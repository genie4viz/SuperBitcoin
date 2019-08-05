import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
    AsYouType,
    formatIncompletePhoneNumber,
    parsePhoneNumberFromString,
    getCountryCallingCode,
    getExampleNumber,
} from 'libphonenumber-js';
import { compose, withProps } from 'recompose';
import { withSafeTimeout } from '@hocs/safe-timers';
import ReactCountryFlag from 'react-country-flag';
import examples from 'libphonenumber-js/examples.mobile.json'

import { STORE_KEYS } from '../../../stores';

import {
    Main,
    CountrySelect,
    CountrySelectItem,
    SubmitPhone,
    LoadingSpinner,
    SMLoadingSpinner,
    InputCircle,
    LockScreen,
    PrefCountry,
    Directory,
    LetterScroll
} from './Components';
import {
    CountrySearch,
    ExchDropdownSearchIconSvg,
} from '../PayQRCodeV2InCurrency/Components';
import verifyIcon from '../asset/img/verify.svg';
import receiveIcon from '../asset/img/receive.png';
import receiveErrorIcon from '../asset/img/receive_error.png';
import arrowIcon from '../asset/img/right-arrow.svg';

class SMSVerificationForm extends React.Component {
    state = {
        error: false,
        loading: false,
        loaded: false,
        showPhoneArrow: false,
        phoneSubmitStatus: 'none',
        codeSubmitStatus: 'none',
        phoneNumber: '',
        smsCode: '',
        unloadPhoneInput: false,
        unloadCodeInput: false,
        scanned: this.props.scanned,
        isResending: false,
        isScanShowing: this.props.scanned === 'scanned',
        isSMSShowing: this.props.scanned !== 'scanned',
        isCountrySelectShowing: false,
        countryCode: '',
        claimStatus: (this.props.scannedStatus !== 'pending' ? 'error' : ''),
        isBlured: -1,
        isLandscapeMode: false,
        isSearchInputFocused: false,
        isPhoneNumberSendAvailable: false,
        selectionStart: 0,
        countrySearch: ''
    };

    phoneInputRef = null;
    codeInputRef = null;
    _errorTimer = null;
    _scanTimer = null;
    _timeout = [];

    componentDidMount() {
        this.setState({
            countryCode: this.props.countryCode,
            phoneNumber: '',
            loading: false,
            loaded: false,
            showPhoneArrow: false,
            phoneSubmitStatus: 'none',
            unloadPhoneInput: false,
            unloadCodeInput: false,
            isPhoneNumberSendAvailable: false,
            isLandscapeMode: window.orientation !== 0,
        });
        const phoneInput = document.getElementById('phoneInput');
        if(phoneInput) {
            phoneInput.focus();
        }

        if (this.state.isScanShowing) {
            this._timeout.push(setTimeout(() => this.onScanAccept(), 7000));
        }

        window.addEventListener('orientationchange', () => {
            this.setState({ isLandscapeMode: window.orientation !== 0 });
        }, false);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            isBlured,
            isResending,
            isLandscapeMode,
            phoneSubmitStatus,
            codeSubmitStatus,
            selectionStart,
            isCountrySelectShowing,
        } = this.state;

        if (isLandscapeMode) {
            if (this.phoneInputRef) this.phoneInputRef.blur();
            if (this.codeInputRef) this.codeInputRef.blur();
            return;
        }

        if (isResending && this.phoneInputRef) {
            this.phoneInputRef.focus();
            return;
        } 

        if (phoneSubmitStatus !== 'submitted' && this.phoneInputRef && prevState.countrySearch === this.state.countrySearch) {
            this.phoneInputRef.setSelectionRange(selectionStart, selectionStart);
        }
        if (isCountrySelectShowing && prevState.phoneNumber === this.state.phoneNumber) {
            if (this.phoneInputRef) this.phoneInputRef.blur();
        }

        if(phoneSubmitStatus === 'submitting') {
            if (this.phoneInputRef) this.phoneInputRef.blur();
            if (this.codeInputRef) this.codeInputRef.focus();
            return;
        }

        if (isBlured > 0) {
            if (this.phoneInputRef) this.phoneInputRef.blur();
            if (this.codeInputRef) this.codeInputRef.blur();
            return;
        }

        if (phoneSubmitStatus === 'submitted' && codeSubmitStatus !== 'submitted' && codeSubmitStatus !== 'submitting') {
            if (this.codeInputRef) this.codeInputRef.focus();
            if (this.phoneInputRef) this.phoneInputRef.blur();
        }
        
        if(phoneSubmitStatus === 'submitted' && codeSubmitStatus === 'submitting') {
            if (this.codeInputRef) this.codeInputRef.blur();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { codeSubmitStatus, scanned } = this.state;
        const { verify } = this.props;
        if (nextProps.isPositionLoaded) {
            if(codeSubmitStatus === 'submitting' && scanned !== 'success') {
                verify();
            }
        }
    }

    componentWillUnmount() {
        for (let i = 0; i < this._timeout.length; i++) {
            clearTimeout(this._timeout[i]);
        }
    }

    onBlur = () => {
        const {
            isBlured,
            isCountrySelectShowing
        } = this.state;

        if (isCountrySelectShowing) {
            this.setState({
                isSearchInputFocused: false,
            });
            return;
        }
        if (isBlured === -1) {
            this.setState({ isBlured: 0 });
        }
    }

    onClose = () => {
        const {
            scanned,
            isBlured,
            isSMSShowing,
            isCountrySelectShowing
        } = this.state;

        if (isCountrySelectShowing) {
            this.setState({
                isSearchInputFocused: false,
            });
            return;
        }
        if (isBlured === 0) {
            this.setState({
                isBlured: 1,
            });
            return;
        }
        if(isSMSShowing) {
            this.setState({ isBlured: -1 });
            if(scanned === 'failed') {
                this.props.onBack(false);
            } else {
                this.onResetReceivePayment();
            }
        }
    }

    onForceClose(e) {
        if(e) e.stopPropagation();
        this.props.onBack(false);
    }

    onCountrySelect(e) {
        e.stopPropagation();
        if (!this.state.isCountrySelectShowing) {
            if (this.phoneInputRef) this.phoneInputRef.blur();
        }
        this.setState(prevState => ({
            countrySearch: '',
            isCountrySelectShowing: !prevState.isCountrySelectShowing
        }));
    }

    onClickCountry(e, iso) {
        if(e) e.stopPropagation();
        this.setState(prevState => ({
            countryCode: iso,
            isSearchInputFocused: false,
            phoneNumber: this.getFormattedPhoneNumber(prevState.phoneNumber, iso),
        }));
        this.onCountrySelect(e);
    }

    onQRCode() {
        if (this.state.unloadPhoneInput) {
            return;
        }
        this.setState({
            loading: true,
            isCountrySelectShowing: false,
        });
        this._timeout.push(setTimeout(() => {
            this.setState({ loaded: true });
            this.onSend();
            // document.getElementById('phoneInput').focus();
        }, 600));
    }

    onInputChange() {
        if (this.state.loaded) {
            this.setState({ showPhoneArrow: true, phoneSubmitStatus: 'none' });
        }
    }

    onBoxClick = (e) => {
        e.stopPropagation();
    }

    onClickPhoneNumber = e => {
        e.stopPropagation();
        const { phoneSubmitStatus } = this.state;
        this.setState({
            selectionStart: e.target.selectionStart,
            isBlured: -1,
            loaded: false,
            smsCode: '',
            isResending: false,
            isPhoneNumberSendAvailable: false,
        });

        if (phoneSubmitStatus === 'submitted') {
            this.setState({
                phoneSubmitStatus: 'none',
                unloadPhoneInput: false,
                loading: false,
                loaded: false,
                isResending: true,
                showPhoneArrow: false,
                unloadCodeInput: false,
            })
        }
    }

    onSend = async (e) => {
        if (e) e.stopPropagation();
        const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const { phoneNumber } = this.state;
        let phoneNumberTrimed;

        if (this.state.loaded && parsePhoneNumberFromString(phoneNumber)) {
            this.setState({
                phoneSubmitStatus: 'submitting',
                isCountrySelectShowing: false,
            });
            document.getElementById('phoneInput').blur();
            document.getElementById('codeInput').focus();

            phoneNumberTrimed = parsePhoneNumberFromString(phoneNumber).format('INTERNATIONAL');
            phoneNumberTrimed = phoneNumberTrimed.split(' ').join('');

            requestAuthCode(phoneNumberTrimed).then(() => {
                this._timeout.push(setTimeout(() => {
                    this.setState({
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        isBlured: -1,
                    });
                    // document.getElementById('codeInput').focus();
                }, 2500));
            }).catch(() => {
                this.setState({
                    error: true,
                    loading: false,
                });
                this._timeout.push(setTimeout(() => {
                    this.setState({
                        error: false,
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        isBlured: -1,
                    });
                }, 3000));
            });
        }
    }

    onCountySearchClose = () => {
        this.setState({ isCountrySelectShowing: false });
    }

    onClaimTransfer() {
        const { claimTransfer, setFadeStatus, setBalance } = this.props;

        this.setState({
            isSMSShowing: false,
            isScanShowing: false,
            claimStatus: 'progress',
            loading: false,
            scanned: 'scanned',
        });

        claimTransfer().then((res) => {
            if(res && res.Status && res.Status.IsSuccess === true) {
                setBalance(Number(res.Position));
                this.setState({
                    claimStatus: 'claiming',
                });
                setTimeout(() => {
                    this.setState({
                        claimStatus: 'claimed',
                    });
                }, 4500);
                setFadeStatus('claiming');
            } else {
                console.log('Cannot claim Transfer');
                this.setState({
                    claimStatus: 'error',
                });
                if(this._errorTimer) clearTimeout(this._errorTimer);
                this._errorTimer = setTimeout(() => this.onResetReceivePayment(), 5000);
            }
        }).catch(err => {
            console.log('Cannot claim Transfer', err);
            this.setState({
                claimStatus: 'error',
            });
            if(this._errorTimer) clearTimeout(this._errorTimer);
            this._errorTimer = setTimeout(() => this.onResetReceivePayment(), 5000);
        });
    }

    onSendCode() {
        const { confirmAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const { smsCode, scanned } = this.state;
        this.setState({ codeSubmitStatus: 'submitting' });
        document.getElementById('codeInput').blur();

        confirmAuthCode(smsCode)
            .then(() => {
                const {
                    setCoinAddress,
                    [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
                } = this.props;

                setCoinAddress();

                if(scanned === 'success') {
                    this._timeout.push(setTimeout(() => this.onClaimTransfer(), 100));
                } else {
                    this._timeout.push(setTimeout(() => yourAccountStore.requestPositionWithReply(), 500));
                }
            })
            .catch(() => {
                this.setState({ error: true });
                this._timeout.push(setTimeout(() => {
                    this.setState({
                        smsCode: '',
                        error: false,
                        codeSubmitStatus: 'error',
                    });
                    document.getElementById('codeInput').focus();
                }, 3000));
            });
    }

    onReceive() {
        this.props.verify(true);
    }

    onSuccessScan() {
        this.setState({
            scanned: 'success',
            isSMSShowing: true,
            isScanShowing: false,
        });
    }

    onResetReceivePayment() {
        if(this.state.isSMSShowing) {
            this.props.resetToHomePage();
        }
        if(this.props.scannedStatus === 'pending') {
            if(this._errorTimer) clearTimeout(this._errorTimer);
            this.setState({
                claimStatus: '',
                scanned: 'scanned',
                isSMSShowing: false,
                isScanShowing: true,
            });
        }
    }

    onScanAccept() {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            // this.setState({
            //     codeSubmitStatus: 'submitted',
            //     unloadCodeInput: true,
            //     scanned: 'loading',
            // });

            this.onClaimTransfer();
        } else {
            this.onSuccessScan();
        }
    }

    onScanReject() {
        const { setFadeStatus, cancelTransfer } = this.props;
        cancelTransfer();
        this.setState({
            claimStatus: 'rejected',
        });
        this._timeout.push(setTimeout(() => setFadeStatus('rejecting'), 1000));
    }

    resendPhoneNumber(e) {
        if (e) e.stopPropagation();
        const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const phoneNumber = `+${getCountryCallingCode(this.state.countryCode)} ${this.state.phoneNumber}`;
        let phoneNumberTrimed;

        if (parsePhoneNumberFromString(phoneNumber)) {
            this.setState({
                phoneSubmitStatus: 'submitting',
                isCountrySelectShowing: false,
            });
            // document.getElementById('phoneInput').blur();
            // document.getElementById('codeInput').focus();

            phoneNumberTrimed = parsePhoneNumberFromString(phoneNumber).format('INTERNATIONAL');
            phoneNumberTrimed = phoneNumberTrimed.split(' ').join('');

            requestAuthCode(phoneNumberTrimed).then(() => {
                this._timeout.push(setTimeout(() => {
                    this.setState({
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        isBlured: -1,
                    });
                    // document.getElementById('codeInput').focus();
                }, 2500));
            }).catch(() => {
                this.setState({
                    error: true,
                    loading: false,
                });
                this._timeout.push(setTimeout(() => {
                    this.setState({
                        error: false,
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        isBlured: -1,
                    });
                }, 3000));
            });
        }
    }

    getExampleNumber(countryCode) {
        let number = getExampleNumber(countryCode, examples).formatInternational();
        number = number.replace(/\d/g, "_");
        const numbers = number.split(' ');
        numbers[0] = `+${getCountryCallingCode(countryCode)}`;
        numbers[1] = `(${numbers[1]})`;
        number = '';

        for (let i = 0; i < numbers.length; i++) {
            number = number + (i > 2 ? '-' : ' ') + numbers[i];
        }
        this.setState({ selectionStart: numbers[0].length + 2 });

        return number;
    }

    getSMSTypeIcon() {
        return verifyIcon;
    }

    setSearchInputFocus = e => {
        e.stopPropagation();
        this.searchInputRef.focus();
        this.setState({ isSearchInputFocused: true });
        document.body.scrollTop = 0;
    }

    handleChangePhoneNumber = e => {
        if (e.target.value.length < this.state.phoneNumber.length) {
            this.setState({
                phoneNumber: e.target.value,
                showPhoneArrow: false,
                phoneSubmitStatus: 'none',
                isPhoneNumberSendAvailable: false,
                selectionStart: e.target.value.length,
                isResending: e.target.value.length !== 0,
            });
            return;
        }
        if (this.state.phoneSubmitStatus === 'submitting') return;
        e.stopPropagation();
        let tmpNumber = this.removeUselessInPhone(e.target.value);
        const pattern = `+${getCountryCallingCode(this.state.countryCode)}`;
        tmpNumber = formatIncompletePhoneNumber(tmpNumber, this.state.countryCode);
        tmpNumber = tmpNumber[0] === '+' ? tmpNumber : `+${tmpNumber}`;
        if (!tmpNumber.includes(pattern)) {
            const array = tmpNumber.split('+');
            array[1] = getCountryCallingCode(this.state.countryCode) + array[1];
            tmpNumber = array.join('+');
        }
        const inputNumber = tmpNumber.split('+').join('');
        let checkedNumber = e.target.value;
        if(checkedNumber.split(pattern).length > 2) {
            checkedNumber = checkedNumber.split(pattern);
            for (let i = 0; i < checkedNumber.length; i ++) {
                const tmp = this.removeUselessInPhone(checkedNumber[i]);
                if (parsePhoneNumberFromString(pattern + tmp)) {
                    checkedNumber = pattern + tmp;
                    break;
                }                
            }
            if (Array.isArray(checkedNumber)) {
                checkedNumber = checkedNumber.join(pattern);
            }
            const originNumber = `+${getCountryCallingCode(this.state.countryCode)} ${parsePhoneNumberFromString(checkedNumber)}`;
            if (originNumber) {
                if (originNumber.isValid()) {

                    this.setState({
                        showPhoneArrow: true,
                        phoneNumber: this.getFormattedPhoneNumber(checkedNumber),
                        phoneSubmitStatus: 'none',
                        isBlured: -1,
                    });

                    if(originNumber.countryCallingCode === '86' && originNumber.nationalNumber.length !== 11) {
                        this.setState({ isPhoneNumberSendAvailable: false });
                    } else {
                        this.setState({ isPhoneNumberSendAvailable: true });
                    }
                    return;
                }
            }
        }

        this.setState({
            showPhoneArrow: true,
            phoneNumber: this.getFormattedPhoneNumber(inputNumber),
            phoneSubmitStatus: 'none',
            isBlured: -1,
        });

        const phoneNumber = parsePhoneNumberFromString(`+${getCountryCallingCode(this.state.countryCode)} ${this.getFormattedPhoneNumber(inputNumber)}`);
        if (phoneNumber && phoneNumber.isValid()) {
            this.setState({ isPhoneNumberSendAvailable: true });
            if(!(phoneNumber.countryCallingCode === '86' && phoneNumber.nationalNumber.length !== 11)) {
                this.setState({ isPhoneNumberSendAvailable: true });
                return;
            }
        }
        this.setState({ isPhoneNumberSendAvailable: false });
    };

    handleChangeSmsCode = e => {
        if (this.state.codeSubmitStatus === 'submitting') return;
        let res = e.target.value;
        e.stopPropagation();

        if (res.length > 4) {
            res = String(res).substr(0, 4);
        }

        this.setState({
            smsCode: res,
            showPhoneArrow: true,
            isBlured: -1,
        });

        if (res.length === 4) {
            this.setState({ codeSubmitStatus: 'submitting' });
            this._timeout.push(setTimeout(() => this.onSendCode(), 1000));
        } else if (res.length < 4) {
            this.setState({ codeSubmitStatus: 'none' });
        }
    };

    handleSearchCountry = (value) => {
        this.setState({ countrySearch: value });
    }

    filterCountry(item) {
        const searchText = this.state.countrySearch.toLowerCase();

        if (item.name.toLowerCase().includes(searchText)) return true;
        if (item.iso.toLowerCase().includes(searchText)) return true;
        return false;
    }

    removeUselessInPhone(number) {
        let result = number;
        result = result.replace(/_/g, '');
        result = result.replace(/-/g, '');
        result = result.replace(/\(/g, '');
        result = result.replace(/\)/g, '');
        result = result.replace(/\s/g, '');
        return result;
    }

    getFormattedPhoneNumber(inputNumber, iso = null) {
        const globalNumber = new AsYouType().input(inputNumber[0] === '+' ? inputNumber : `+${inputNumber}`);
        const splits = globalNumber.split(' ');
        if (splits.length > 2) {
            splits[1] = `(${splits[1]})`;
        }
        const firstFilter = splits.join(' ');
        const secondFilter = firstFilter.split(') ');
        let response = secondFilter[0];
        if (secondFilter.length > 1) {
            response = `${response}) ${secondFilter[1].split(' ').join('-')}`;
        }
        response = response.split(' ');
        response[0] = `+${getCountryCallingCode(iso || this.state.countryCode)}`;
        response = response.join(' ');

        response = response.split(' ');
        response.shift();
        response = response.join(' ');
        this.setState({ selectionStart: response.length });

        return response;
    }

    getMixedPhoneNumber(phone, placeholder) {
        let phoneArr = phone.split(`+${getCountryCallingCode(this.state.countryCode)}`)[1];
        if (!phoneArr) {
            this.setState(prevState => ({ selectionStart: getCountryCallingCode(prevState.countryCode).length + 3 }));
            return placeholder;
        }
        phoneArr = phoneArr.replace(/\s/g, '');
        phoneArr = phoneArr.replace(/\+/g, '');
        phoneArr = phoneArr.replace(/\(/g, '');
        phoneArr = phoneArr.replace(/\)/g, '');
        phoneArr = phoneArr.replace(/-/g, '');
        phoneArr = phoneArr.split('');
        placeholderArr = placeholder.split('');
        let phoneIndex = 0;
        let i;
        for (i = 0; i < placeholderArr.length; i ++) {
            placeholderArr[i] = placeholderArr[i] === '_' ? phoneArr[phoneIndex ++] : placeholderArr[i];
            if (phoneIndex === phoneArr.length)
                break;
        }
        this.setState({ selectionStart: i + 1 });
        return placeholderArr.join('');
    }

    containerClass() {
        return 'input-bar-containers shadow';
    }

    phoneContainerClass() {
        const { loading, unloadPhoneInput } = this.state;

        if (loading) {
            if (unloadPhoneInput) {
                return 'input-bar load unload';
            }
            return 'input-bar load';
        }
        return 'input-bar load';
    }

    phoneSubmitIconUrl() {
        const {
            phoneSubmitStatus,
            unloadCodeInput,
        } = this.state;
        const mainIcon = this.getSMSTypeIcon();

        if (phoneSubmitStatus === 'submitted' && unloadCodeInput) {
            return mainIcon;
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'spinner';
        }
        return mainIcon;
    }

    codeSubmitIconUrl() {
        const { codeSubmitStatus } = this.state;
        const mainIcon = this.getSMSTypeIcon();

        if (codeSubmitStatus === 'submitting') {
            return 'spinner';
        }
        return mainIcon;
    }

    phoneSubmitIconClass() {
        const {
            phoneSubmitStatus,
            unloadPhoneInput,
            showPhoneArrow,
            scanned,
        } = this.state;

        if (scanned !== 'failed') {
            if (showPhoneArrow) {
                return 'qr-code-container arrow';
            }
            return 'qr-code-container money';
        }

        if (phoneSubmitStatus === 'submitted') {
            if (!unloadPhoneInput) {
                return 'qr-code-container none';
            }
            return 'qr-code-container';
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        if (showPhoneArrow) {
            return 'qr-code-container flag';
        }
        return 'qr-code-container flag';
    }

    codeSubmitIconClass() {
        const { codeSubmitStatus, showPhoneArrow } = this.state;

        if (codeSubmitStatus === 'submitted') {
            return 'qr-code-container arrow';
        }
        if (codeSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        if (showPhoneArrow) {
            return 'qr-code-container none';
        }
        return 'qr-code-container not-changed';
    }

    showCodeInput() {
        return this.state.phoneSubmitStatus === 'submitted';
    }

    hidePhoneInput() {
        this.setState({ unloadPhoneInput: true });
    }

    getInputFormWidth() {
        return document.getElementsByClassName('input-bar')[0].clientWidth;
    }

    scrollToDirectory (e, letter) {
        e.stopPropagation();
        const elem = document.getElementById(`directory-${letter}`);
        if (elem) elem.scrollIntoView();
    }

    render() {
        const {
            error,
            scanned,
            smsCode,
            countryCode,
            countrySearch,
            phoneNumber,
            phoneSubmitStatus,
            codeSubmitStatus,
            claimStatus,
            isResending,
            isSMSShowing,
            isScanShowing,
            isLandscapeMode,
            isSearchInputFocused,
            isCountrySelectShowing,
            isPhoneNumberSendAvailable,
        } = this.state;

        const {
            placeholderText,
        } = this.props;

        const selCountry = this.props.countries.find(item => item.iso === countryCode);
        let iLetter = '';

        return (
            <Main onClick={(e) => this.onClose(e)} onBlur={this.onBlur}>
                {isScanShowing && (
                    <div className="input-bar-containers qr-scanner" onClick={this.onBoxClick} role="button" tabIndex={0}>
                        <div className="input-bar-container qr-scanner">
                            <div
                                className={`input-bar qr-scanner ${claimStatus}`}
                                style={{borderBottom: '1.51px solid white'}}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    if(scanned !== 'loading' && claimStatus === 'error') {
                                        this.onResetReceivePayment();
                                    }
                                }}
                            >
                                <div className={`scanned-balance ${claimStatus}`}>
                                    {claimStatus === 'claiming' && (
                                        placeholderText
                                    )}
                                    {(claimStatus === '' || claimStatus === 'progress' || claimStatus === 'rejecting') && (
                                        placeholderText
                                    )}
                                </div>

                                {(scanned === 'loading' || claimStatus === 'progress' || claimStatus === 'rejecting') && (
                                    <SMLoadingSpinner className={(claimStatus === 'rejecting' ? 'left' : '')}>
                                        <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                                    </SMLoadingSpinner>
                                )}

                                {scanned !== 'loading' && (claimStatus === 'claiming' || claimStatus === 'claimed') && (
                                    <InputCircle
                                        className="right"
                                        borderColor="#00AE5340"
                                    >
                                        <img src={receiveIcon} alt="" style={{ width: '60%' }} />
                                    </InputCircle>
                                )}

                                {scanned !== 'loading' && claimStatus === 'error' && (
                                    <InputCircle
                                        className="mid"
                                        borderColor="rgba(237, 28, 36, 0.5)"
                                        onClick={() => this.onResetReceivePayment()}
                                    >
                                        <img src={receiveErrorIcon} alt="" style={{ width: '60%', paddingBottom: '5px' }} />
                                    </InputCircle>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isSMSShowing && error && (
                    <div
                        className="input-bar-containers error"
                        role="button"
                        tabIndex={0}
                        onClick={this.onBoxClick}
                    >
                        <div className="input-bar-container">
                            <div className="input-bar load error-form">
                                <InputCircle
                                    className="mid"
                                    borderColor="rgba(237, 28, 36, 0.5)"
                                >
                                    <img src={receiveErrorIcon} alt="" style={{ width: '60%', paddingBottom: '5px' }} />
                                </InputCircle>
                            </div>
                        </div>
                    </div>
                )}

                {isSMSShowing && !error && isCountrySelectShowing && this.props.countries && (
                    <CountrySelect style={{ top: isSearchInputFocused && 'calc(3% + 66px)'}} colCount={5}>
                        <LetterScroll>
                            {Array.from(Array(26).keys()).map((item, index) => {
                                return <p
                                key={`Directory-Letter-${index}`}
                                onClick={e => this.scrollToDirectory(e, String.fromCharCode(65 + index))}
                                onMouseEnter={e => this.scrollToDirectory(e, String.fromCharCode(65 + index))}
                                >
                                    {String.fromCharCode(65 + index)}
                                </p>
                            })}
                        </LetterScroll>
                        {this.props.countries.map(item => {
                            if (item.name[0] !== iLetter && item.name[0] !== 'Å' && countrySearch === '') {
                                iLetter = item.name[0];
                                return <Directory id={`directory-${iLetter}`}>{iLetter}</Directory>
                            }
                            return this.filterCountry(item) && (
                                <CountrySelectItem key={item.iso} onClick={e => this.onClickCountry(e, item.iso)}>
                                    <div className="d-flex align-items-center">
                                        <ReactCountryFlag code={item.iso} svg />
                                        <h1>{item.name}</h1>
                                    </div>

                                    {/* <h1>{`+${item.callCode}`}</h1> */}
                                </CountrySelectItem>
                            );
                        })}
                    </CountrySelect>
                )}

                {isSMSShowing && !error && (
                    <div className={this.containerClass()} style={{ top: isSearchInputFocused && 'calc(5% + 15px)'}}>
                        {(phoneSubmitStatus !== 'submitted' && phoneSubmitStatus !== 'submitting') &&
                            <div className="input-bar-container">
                                <div
                                    className={this.phoneContainerClass()}
                                    onClick={this.onBoxClick}
                                    role="button"
                                    tabIndex={0}
                                    style={{ display: 'flex' }}
                                >
                                    {selCountry && !isCountrySelectShowing && <PrefCountry onClick={e => this.onCountrySelect(e)}>
                                            <ReactCountryFlag code={selCountry.iso} svg />
                                            <h1>{`+${selCountry.callCode}`}</h1>
                                        </PrefCountry>
                                    }
                                    {!isCountrySelectShowing &&
                                        <input
                                            type="tel"
                                            className={`number-input phone ${phoneSubmitStatus}`}
                                            id={isResending ? '' : "phoneInput"}
                                            onChange={this.handleChangePhoneNumber}
                                            value={phoneNumber}
                                            onKeyUp={(e) => {
                                                if (e.key === 'Enter') {
                                                    this.resendPhoneNumber(e);
                                                }
                                            }}
                                            placeholder="Mobile Number"
                                            onKeyPress={(e) => this.onInputChange(e)}
                                            ref={ref => {
                                                this.phoneInputRef = ref;
                                            }}
                                            disabled={isLandscapeMode}
                                        />
                                    }
                                    {isCountrySelectShowing &&
                                        <CountrySearch>
                                            <ExchDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px" onClick={(e) => this.setSearchInputFocus(e)}>
                                                <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
                                                <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
                                            </ExchDropdownSearchIconSvg>
                                            <input
                                                type="text"
                                                value={countrySearch}
                                                disabled={isLandscapeMode}
                                                onChange={e => this.handleSearchCountry(e.target.value)}
                                                onClick={(e) => this.setSearchInputFocus(e)}
                                                ref={ref => {
                                                    this.searchInputRef = ref;
                                                }}
                                            />
                                            <img src="/img/svg/close.svg" alt="search" className="close" onClick={e => this.onCountySearchClose(e)} />
                                        </CountrySearch>
                                    }
                                </div>
                            </div>
                        }
                        {(phoneSubmitStatus === 'submitted' || phoneSubmitStatus === 'submitting') && <div className="input-bar-container">
                            <div
                                className="input-bar load"
                                role="button"
                                tabIndex={0}
                                onClick={this.onBoxClick}
                                style={
                                    smsCode === ''
                                        ? {
                                            paddingLeft: '2.5rem',
                                            paddingRight: '2.5rem',
                                        }
                                        : { }}
                            >
                                <input
                                    type="tel"
                                    name="sms-code"
                                    id="codeInput"
                                    className={`number-input sms-code ${codeSubmitStatus}`}
                                    value={smsCode}
                                    onChange={this.handleChangeSmsCode}
                                    placeholder="Confirmation Code"
                                    onKeyUp={e => {
                                        if (e.key === 'Enter') {
                                            this.onSendCode(e);
                                        }
                                    }}
                                    maxLength={4}
                                    ref={ref => {
                                        this.codeInputRef = ref;
                                    }}
                                    disabled={(phoneSubmitStatus !== 'submitted' && phoneSubmitStatus !== 'submitting' && phoneSubmitStatus !== 'resend') || isLandscapeMode}
                                />
                            </div>
                        </div>}
                        {(this.codeSubmitIconUrl() === 'spinner' || this.phoneSubmitIconUrl() === 'spinner') && (
                            <LoadingSpinner width={this.getInputFormWidth()}>
                                <div className="spinner" />
                            </LoadingSpinner>
                        )}                        
                        {this.codeSubmitIconUrl() !== 'spinner' && (phoneSubmitStatus === 'submitted' || phoneSubmitStatus === 'resend') && (
                            <div className="main-icon">
                                <img
                                    onClick={e => this.resendPhoneNumber(e)}
                                    src={this.codeSubmitIconUrl()}
                                    alt=""
                                />
                                <span onClick={this.onClickPhoneNumber} tabIndex={0} role="button">{phoneNumber}</span>
                            </div>
                        )}
                        {this.phoneSubmitIconUrl() !== 'spinner'
                            && phoneSubmitStatus !== 'submitted'
                            && phoneSubmitStatus !== 'resend'
                            && isPhoneNumberSendAvailable &&
                            <SubmitPhone onClick={e => this.resendPhoneNumber(e)}>
                                <img
                                    src={arrowIcon}
                                    alt=""
                                />
                            </SubmitPhone>
                        }
                    </div>
                )}

                {(phoneSubmitStatus === 'submitting' || codeSubmitStatus === 'submitting') && (
                    <LockScreen onClick={e => e.stopPropagation()}/>
                )}
            </Main>
        );
    }
}

export default compose(
    withRouter,
    withSafeTimeout,
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.PAYAPPSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    PortfolioValue,
                    isPositionLoaded,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    setBalance,
                },
            }
        ) => ({
            PortfolioValue,
            isPositionLoaded,
            setBalance,
        })
    )
)(SMSVerificationForm);
