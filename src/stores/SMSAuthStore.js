import React from 'react';
import decode from 'jwt-decode';
import { action, observable } from 'mobx';
import Cookies from 'universal-cookie';
import {
    requestDeviceToken,
    requestAuthenticationCode,
    requestTwofaAuthenticationCode,
    confirmAuthenticationCode,
    refreshSecurityToken,
    requestGoogleSecret,
    verifyGoogle2FA,
    disableGoogle2FA,
    getTwoFAStatus
} from '../lib/sms-auth';
import { isTokenExpired, refreshToken } from '../utils';

class SMSAuthStore {
    @observable price = 0;
    @observable isLoggedIn = false;
    @observable isVerified = false;
    @observable loggedInUser = null;
    @observable isGoogle2FA = false;
    @observable isGet2FA = false;
    @observable is2FAVerified = true;
    @observable googleSecret = '';
    @observable googleQrCodeData = '';
    deviceToken = '';

    constructor(snackbar) {
        this.snackbar = snackbar;
        this.deviceToken = localStorage.getItem('deviceToken') || '';
        const phoneNumber = localStorage.getItem('phoneNumber');
        const authClientId = localStorage.getItem('authClientId');
        const authToken = localStorage.getItem('authToken');

        if (phoneNumber && authClientId && authToken) {
            this.loggedInUser = {
                phoneNumber,
                authClientId,
                authToken,
            };
            this.isLoggedIn = true;
        } else {
            this.loggedInUser = null;
            this.isLoggedIn = false;
        }

        if (this.deviceToken === '' || isTokenExpired(this.deviceToken)) {
            requestDeviceToken()
                .then(data => {
                    this.deviceToken = data.ok.deviceToken;
                    localStorage.setItem('deviceToken', this.deviceToken);
                })
                .catch(err => {
                    console.log('[requestDeviceToken failed]', err);
                    this.deviceToken = '';
                    this.showSnackMsg('Device Token generation is failed.');
                });
        }
        refreshToken();
    }


    @action.bound requestAuthCode(phoneNumber) {
        this.isVerified = false;
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid');
                reject(new Error('Device Token is invalid'));
            } else {
                requestAuthenticationCode(this.deviceToken, phoneNumber)
                    .then(data => {
                        localStorage.setItem('phoneNumber', phoneNumber || '');
                        // console.log('requestAuthenticationCode: ', data);
                        this.showSnackMsg(data.message);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[requestAuthenticationCode failed]', err);
                        this.showSnackMsg('SMS request is failed.');
                        this.forceCleanStorage();
                        reject(err);
                    });
            }
        });
    }

    @action.bound confirmAuthCode(securityCode, scope = '') {
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid.');
                reject(new Error('Device Token is invalid.'));
            } else if (securityCode === '') {
                this.showSnackMsg('SecurityCode is invalid.');
                reject(new Error('SecurityCode is invalid.'));
            } else {
                confirmAuthenticationCode(this.deviceToken, securityCode, scope)
                    .then(data => {
                        this.isVerified = true;
                        const token = data.ok.sessionToken;

                        if (scope.toLowerCase() === 'updatesecondfactor') {
                            localStorage.setItem('twoFaAuthToken', token);
                            this.is2FAVerified = true;
                        } else {
                            const payload = decode(token);
                            const phoneNumber = localStorage.getItem('phoneNumber');
                            const authClientId = payload.sub;

                            localStorage.setItem('authClientId', payload.sub || '');
                            localStorage.setItem('authToken', token);
                            localStorage.setItem('signedin', true);
                            const cookies = new Cookies();
                            cookies.set('phoneNumber', localStorage.getItem('phoneNumber'), { path: '/' });
                            this.deviceToken = localStorage.getItem('deviceToken') || '';

                            if (phoneNumber && authClientId && token) {
                                this.loggedInUser = {
                                    phoneNumber,
                                    authClientId,
                                    token,
                                };
                                this.isLoggedIn = true;
                            } else {
                                this.loggedInUser = null;
                                this.isLoggedIn = false;
                            }
                        }

                        this.showSnackMsg('Verification is success.');
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[confirmAuthenticationCode failed]', err);
                        this.showSnackMsg('Code confirmation is failed.');
                        reject(new Error('Code confirmation is failed.'));
                    });
            }
        });
    }

    @action.bound requestTwofaAuthCode() {
        this.isVerified = false;
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid');
                reject(new Error('Device Token is invalid'));
            } else {
                requestTwofaAuthenticationCode(this.deviceToken)
                    .then(data => {
                        this.showSnackMsg(data.message);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[requestTwofaAuthenticationCode failed]', err);
                        this.showSnackMsg('SMS request is failed.');
                        reject(err);
                    });
            }
        });
    }

    @action.bound refreshSecurityToken() {
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid.');
                reject(new Error('Device Token is invalid.'));
            } else {
                refreshSecurityToken(this.deviceToken)
                    .then(data => {
                        const token = data.ok.sessionToken;
                        const payload = decode(token);

                        localStorage.setItem('authClientId', payload.sub || '');
                        localStorage.setItem('authToken', token);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[refreshSecurityToken failed]', err);
                        this.showSnackMsg('Refresh request is failed.');
                        reject(new Error('Refresh request is failed.'));
                    });
            }
        });
    }

    @action.bound getTwoFAStatus() {
        this.isGet2FA = true;

        if (!this.isLoggedIn) {
            return;
        }

        return new Promise((resolve, reject) => {
            const sessionToken = localStorage.getItem('authToken') || '';

            if (sessionToken === '') {
                console.log('Session Token is invalid.');
                this.showSnackMsg('Session Token is invalid.');
                this.isGet2FA = false;
                reject();
            } else {
                getTwoFAStatus(sessionToken)
                    .then(data => {
                        this.isGoogle2FA = data.ok && data.ok.status.googleFactorEnabled;
                        this.isGet2FA = false;
                        resolve();
                    })
                    .catch(err => {
                        console.log('[getTwoFAStatus failed]', err);
                        this.isGoogle2FA = false;
                        this.isGet2FA = false;
                        reject();
                    });
            }
        });
    }

    @action.bound requestGoogleSecret() {
        return new Promise((resolve, reject) => {
            const twoFaSessionToken = localStorage.getItem('twoFaAuthToken') || '';

            if (twoFaSessionToken === '') {
                console.log('Twofa Session Token is invalid.');
                this.showSnackMsg('Twofa Session Token is invalid.');
                this.is2FAVerified = false;
                this.requestTwofaAuthCode();
                reject(false);
            } else {
                requestGoogleSecret(twoFaSessionToken)
                    .then(data => {
                        this.googleSecret = data.ok && data.ok.secret.base ?
                            data.ok.secret.base :
                            '';
                        this.googleQrCodeData = data.ok && data.ok.secret.dataURL ?
                            data.ok.secret.dataURL :
                            '';
                        this.is2FAVerified = true;
                        resolve(true);
                    })
                    .catch(err => {
                        const message = err.response.data && err.response.data.message ?
                            err.response.data.message :
                            'Request Google Secret is failed.';
                        console.log('[requestGoogleSecret failed]', err);
                        this.showSnackMsg(message);
                        this.googleSecret = '';
                        this.googleQrCodeData = '';
                        this.isGoogle2FA = false;
                        this.is2FAVerified = false;

                        if (err.response.data && err.response.data.code === 405) {
                            this.requestTwofaAuthCode();
                            reject(false);
                        }

                        reject(true);
                    });
            }
        });
    }

    @action.bound verifyGoogle2FA(googleToken) {
        return new Promise((resolve, reject) => {
            const twoFaSessionToken = localStorage.getItem('twoFaAuthToken') || '';

            if (twoFaSessionToken === '') {
                this.showSnackMsg('Twofa Session Token is invalid.');
                this.is2FAVerified = false;
                this.requestTwofaAuthCode();
                reject(false);
            } else {
                verifyGoogle2FA(twoFaSessionToken, googleToken)
                    .then(data => {
                        const sensitiveAuthToken = data.ok && data.ok.sensitiveSessionToken ? data.ok.sensitiveSessionToken : '';
                        localStorage.setItem('sensitiveAuthToken', sensitiveAuthToken);
                        this.isGoogle2FA = true;
                        this.showSnackMsg(data.message);
                        resolve(true);
                    })
                    .catch(err => {
                        const message = err.response.data && err.response.data.message ?
                            err.response.data.message :
                            'Google Token Verification is failed.';
                        console.log('[verifyGoogle2FA failed]', err);
                        this.showSnackMsg(message);
                        if (err.response.data && err.response.data.code === 405) {
                            this.is2FAVerified = false;
                            this.requestTwofaAuthCode();
                            return reject(false);
                        }

                        return reject(true);
                    });
            }
        });
    }

    @action.bound disableGoogle2FA() {
        return new Promise((resolve, reject) => {
            const twoFaSessionToken = localStorage.getItem('twoFaAuthToken') || '';

            if (twoFaSessionToken === '') {
                this.showSnackMsg('Twofa Session Token is invalid.');
                this.is2FAVerified = false;
                this.requestTwofaAuthCode();
                reject(false);
            } else {
                disableGoogle2FA(twoFaSessionToken)
                    .then(data => {
                        this.isGoogle2FA = false;
                        this.showSnackMsg(data.message);
                        resolve(true);
                    })
                    .catch(err => {
                        const message = err.response.data && err.response.data.message ?
                            err.response.data.message :
                            'Disable Google 2FA is failed.';
                        console.log('[disableGoogle2FA failed]', err);
                        this.showSnackMsg(message);
                        if (err.response.data && err.response.data.code === 405) {
                            this.is2FAVerified = false;
                            this.requestTwofaAuthCode();
                            return reject(false);
                        }

                        return reject(true);
                    });
            }
        });
    }

    @action.bound forceCleanStorage() {
        localStorage.clear();
        window.location.reload();
    }

    @action.bound showSnackMsg(msg) {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
        });
    }
}

export default (snackbar) => {
    const store = new SMSAuthStore(snackbar);
    return store;
};
