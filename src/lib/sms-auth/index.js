import axios from 'axios';

import {
    AUTH_SERVER_URL
} from '../../config/constants';

export const requestDeviceToken = () => axios.post(`${AUTH_SERVER_URL}/api/tokens/device`)
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const requestAuthenticationCode = (deviceToken, phoneNumber) =>
    axios.post(`${AUTH_SERVER_URL}/api/sms/send-code`, {
        deviceToken,
        phoneNumber,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const requestTwofaAuthenticationCode = (deviceToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/sms/twofa-send-code`, {
        deviceToken
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const confirmAuthenticationCode = (deviceToken, securityCode, scope) =>
    axios.post(`${AUTH_SERVER_URL}/api/sms/verify`, {
        deviceToken,
        secretCode: securityCode,
        scope,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const getTwoFAStatus = (sessionToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/twofa/status`, {
        sessionToken,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const requestGoogleSecret = (sessionToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/twofa/setup-google`, {
        sessionToken,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const verifyGoogle2FA = (sessionToken, googleToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/twofa/verify-google`, {
        sessionToken,
        googleToken,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const disableGoogle2FA = (sessionToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/twofa/disable-google`, {
        sessionToken,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const refreshSecurityToken = (deviceToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/tokens/session`, {
        deviceToken,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

