import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import QRCode from 'qrcode.react';
import { withSafeTimeout } from '@hocs/safe-timers';
import findIndex from 'lodash/findIndex';

import { STORE_KEYS } from '@/stores';
import COIN_DATA_MAP from '../../../mock/coin-data-map';
import { XIGNITE_DATA } from '../../../mock/xignite-data';

import {
    Main,
    LoadingSpinner,
    CircleText,
    CertificateContainer,
    InputBar,
    PayText,
    CountrySearch,
    CountrySelect,
    CountrySelectItem,
    QRCodeWrapper,
    Promotion,
    NumberInputWrapper,
    LockScreen,
    CurrencyAmount,
    CurrencyText,
    ExchDropdownSearchIconSvg
} from './Components';

import certificateImg from './img/USDT_Certificate.png';
import verifyIcon from '../asset/img/verify.png';
import payIcon from '../asset/img/pay.png';
import payErrorIcon from '../asset/img/pay_error.png';
import lockIcon from '../asset/img/currency_lock.svg';
import Settings from './Settings';
import History from './History';
import CoinIcon from './CoinIcon';

const DEFAULT_PAY_AMOUNT = 0;

class PayQRCodeViewV2 extends React.Component {
    _timeout = [];
    _zoomTimer = null;
    _blinkingTimer = null;
    _repeatPayTimer = null;
    _promotionStartTimeout = null;
    _promotionEndTimeout = null;
    _isPaying = false;
    _payTimer = null;

    state = {
        error: '',
        payAmount: this.props.amount,
        payText: (Number(this.props.amount) < 1e-9) ? '' : this.props.getFixedNumberString(this.props.amount, true),
        isSettingsShowing: false,
        isHistoryShowing: false,
        isHistoryDetailShowing: false,
        historyDetailQRValue: '',
        isCurrencyShowing: false,
        isSpinnerShowing: false,
        isPromotionShowing: false,
        isQRShowing: true,
        isInitShowing: false,
        isSendingPayAmount: false,
        isChanged: false,
        isFirstOpen: true,
        loading: false,
        loaded: false,
        showPhoneArrow: false,
        phoneSubmitStatus: 'none',
        unloadPhoneInput: false,
        unloadCodeInput: false,        
        qrCodeValue: this.props.uniqueId || this.props.payDomainName,
        firstLoad: true,
        keyboardStatus: 0,         // 0: Form closed, 1: Keyboard closed, 2: Keyboard Showing
        searchCurrency: '',
        currencyList: [],
        selCurrency: null,
        currency: this.props.currency,
        prevCurrency: null,
        isLandscapeMode: false,
        isSearchInputFocused: false,
    };

    componentDidMount() {
        this.setState({
            isSendingPayAmount: false,
            loading: false,
            loaded: false,
            showPhoneArrow: false,
            phoneSubmitStatus: 'none',
            unloadPhoneInput: false,
            unloadCodeInput: false,
            payAmount: this.props.amount,
            payText: (this.props.amount < 1e-9) ? '' : this.props.getFixedNumberString(this.props.amount),
        });

        if (this.props.isPositionLoaded && this.props.repayAmount && Number(this.props.repayAmount) > 0) {
            setTimeout(() => {
                const res = this.payMoney(Number(this.props.repayAmount), this.props.currency);
                if (res !== -2) {
                    // In case, of amount > portfolio total value
                    this.props.onQRImageClick(true);
                    this.setState({
                        isSpinnerShowing: false,
                        unloadPhoneInput: false,
                        loading: true,
                        loaded: false,
                        showPhoneArrow: false,
                        phoneSubmitStatus: 'warning',
                        error: 'error',
                        isFirstOpen: false,
                    });
                    this._timeout.push(setTimeout(() => {
                        this.setState({
                            payAmount: res,
                            payText: (res < 1e-9) ? '' : this.props.getFixedNumberString(res),
                            isChanged: true,
                            showPhoneArrow: true,
                            loaded: true,
                            error: '',
                        });
                    }, 3000));
                    this.props.onGetAmount(res);
                }
            }, 100);
        }

        window.addEventListener('orientationchange', () => {
            this.setState({ isLandscapeMode: window.orientation !== 0 });
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        const { firstLoad, searchCurrency, selCurrency } = this.state;
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            isInitShowing,
            currencies,
            getUniqueId,
            payDomainName,
            onQRImageClick,
            changePayFormShowing
        } = this.props;
        let currency = this.state.currency;

        if (!isInitShowing && nextProps.isInitShowing) this.startInitShowingAnim();
        if (nextProps.fadeStatus === 'reset') {
            this.setState({
                payAmount: 0,
                qrCodeValue: `${payDomainName}`,
            });
        }
        if (JSON.stringify(currencies) !== JSON.stringify(nextProps.currencies)) {
            this._timeout.push(setTimeout(() => {
                this.handleChangeSearchCurrency(searchCurrency);
            }, 500));
        }
        if (JSON.stringify(this.props.currency) !== JSON.stringify(nextProps.currency)) {
            currency = nextProps.currency;
            this.setState({ currency: nextProps.currency });
        }
        if (isLoggedIn && selCurrency !== null && this.props.verifyType === 'history' && nextProps.verifyType === '') {
            const c = currencies.find(item => item.currencyCode === this.state.currency.currencyCode && item.type === this.state.currency.type);
            if(c) {
                this.setState({ currency: c });
            }
            this.setState({ isHistoryShowing: true });
        }
        if (nextProps.isPayFormShowing) {
            onQRImageClick(true);
            this.setState({
                firstLoad: false,
                loading: true,
                loaded: true,
                showPhoneArrow: false,
                phoneSubmitStatus: 'clicked',
                keyboardStatus: 1,
            });
            changePayFormShowing(false);
        }
        if (
            this.props.uniqueId !== nextProps.uniqueId
            && nextProps.uniqueId !== null
            && nextProps.uniqueId !== undefined
            && nextProps.uniqueId !== ''
            && (nextProps.isCoinTransfer || (getUniqueId() && nextProps.scannedAmount > 0))
        ) {
            this.setState({
                qrCodeValue: `${payDomainName}/r/${nextProps.uniqueId}`,
                isChanged: true,
                firstLoad: false,
                payAmount: Number(nextProps.scannedAmount),
                payText: (Number(nextProps.scannedAmount) > 0) ? '' : this.props.getFixedNumberString(nextProps.scannedAmount),
            });
            
            if (!nextProps.isCoinTransfer) {
                this.getTransferNotification(nextProps.uniqueId);
                this.startChangingQR();
            }
            return;
        }
        if (this.props.repayAmount !== nextProps.repayAmount && nextProps.repayAmount && Number(nextProps.repayAmount) > 0) {
            setTimeout(() => {this.payMoney(Number(nextProps.repayAmount), currency)}, 100);
        }
        if (isLoggedIn && !firstLoad && nextProps.uniqueId === '' && nextProps.amount === 0 && nextProps.prevAmount === 0 && nextProps.scannedAmount === 0) {
            this.setState({
                payAmount: DEFAULT_PAY_AMOUNT,
                payText: (DEFAULT_PAY_AMOUNT === 0) ? '' : this.props.getFixedNumberString(DEFAULT_PAY_AMOUNT),
                qrCodeValue: `${payDomainName}`,
            });
        }
    }

    componentDidUpdate() {
        const { keyboardStatus, isLandscapeMode } = this.state;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        this.getMaxWidthOfForm();
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            if(keyboardStatus === 0 || keyboardStatus === 1) {
                if(this.inputRef) this.inputRef.blur();
            } else if(keyboardStatus === 2) {
                if(this.inputRef) this.inputRef.focus();
            }
        }

        if (isLandscapeMode) {
            if (this.inputRef) this.inputRef.blur();
        }
    }

    componentWillUnmount() {
        if (this.inputRef) this.inputRef.blur();
        if (this._zoomTimer) clearTimeout(this._zoomTimer);
        if (this._blinkingTimer) clearTimeout(this._blinkingTimer);
        if (this._repeatPayTimer) clearTimeout(this._repeatPayTimer);

        for (let i = 0; i < this._timeout.length; i++) {
            clearTimeout(this._timeout[i]);
        }
    }

    startInitShowingAnim() {
        const {
            amount,
            isLoggedIn,
            setInitShowing,
            getFixedNumberString
        } = this.props;

        if (!isLoggedIn) {
            this.setState({
                loading: true,
                payText: 1,
                unloadPhoneInput: true,
                isSpinnerShowing: true,
                isInitShowing: true 
            });
            setTimeout(() => {
                this.setState({
                    loading: false,
                    payText: (amount < 1e-9) ? '' : getFixedNumberString(amount),
                    isInitShowing: false,
                    isSpinnerShowing: false,
                    unloadPhoneInput: false,
                });
                setInitShowing(false);
            }, 5000);
        }
    }

    onInputChange(e) {
        if (this.state.phoneSubmitStatus === 'warning') {
            this.setState({
                loaded: true,
                phoneSubmitStatus: 'clicked',
                keyboardStatus: 2,
            });
            if(this.inputRef) this.inputRef.focus();
        } else if (this.state.loaded) {
            this.setState({
                phoneSubmitStatus: 'clicked',
                keyboardStatus: 2,
            });
            if(this.inputRef) this.inputRef.focus();
        }
        if(e.key === 'Backspace' || e.key === 'Delete') {
            if(this.state.isFirstOpen) {
                this.handleChangePayAmount(e);
            } else {
                this.setState({
                    isFirstOpen: false,
                });
            }
        }
    }

    onPromotion = e => {
        e.stopPropagation();
        this.setState({ isPromotionShowing: false });
    }

    onQRCode = (e, type = null) => {
        this.onBoxClick(e);
        this.props.zoomQRCode();
        this.setState({
            isCurrencyShowing: false,
            isSearchInputFocused: false,
        });

        // if ((isNewUser === true && isEmpty === true) || !isLoggedIn) {
        //     if (this._promotionStartTimeout) clearTimeout(this._promotionStartTimeout);
        //     this._promotionStartTimeout = setTimeout(() => {
        //         this.setState({ isPromotionShowing: true });
        //         document.getElementsByClassName('input-bar')[0].setAttribute('style', 'width: calc(100% - 10px);');
        //     }, 2000);

        //     if (this._promotionEndTimeout) clearTimeout(this._promotionEndTimeout);
        //     this._promotionEndTimeout = setTimeout(() => {
        //         this.setState({ isPromotionShowing: false });
        //         this.getMaxWidthOfForm();
        //     }, 8000);
        // }

        if(this._zoomTimer) clearTimeout(this._zoomTimer);
        if(this.state.unloadPhoneInput) {
            return;
        }
        this.props.onQRImageClick(!this.state.loaded);
        if (this.state.loaded) {
            this.cancelPromotionTimer();
            this.setState({
                isPromotionShowing: false,
            });
            this.onSend(type);
            return;
        }
        this.setState({
            loading: true,
            loaded: true,
            showPhoneArrow: false,
            phoneSubmitStatus: 'clicked',
            keyboardStatus: 2,
            payAmount: 0,
            payText: '',
            isFirstOpen: true,
        });
        this.props.onGetAmount(0);
        this._timeout.push(setTimeout(() => {
            if (this.inputRef) {
                this.setState({ keyboardStatus: 2 });
                this.inputRef.focus();
                this.inputRef.setSelectionRange(this.getPayAmountText().length + 1, this.getPayAmountText().length + 1);
            }
        }, 500));
    }

    onSettings = (e) => {
        if(e) e.stopPropagation();
        this.setState({
            isSettingsShowing: true,
            keyboardStatus: 1,
        });
        if(this.inputRef) this.inputRef.blur();
    }

    onHistory = (cur, e) => {
        let currency = cur;
        if(this.state.unloadPhoneInput || !this.state.loaded) {
            return;
        }

        if(currency.type === 'xignite') {
            return;
        }

        if(e) e.stopPropagation();
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        if(this.state.isHistoryShowing) {
            this.onBack();
        } else {
            if(isLoggedIn) {
                const c = this.state.currencyList.find(item => item.currencyCode === currency.currencyCode && item.type === currency.type);
                if(c) currency = c;
                this.setState({
                    isHistoryShowing: true,
                    isCurrencyShowing: false,
                    isSearchInputFocused: false,
                    selCurrency: currency,
                    currency,
                });
                this.props.setCurrency(currency);
            } else {
                this._isPaying = true;
                if(this._payTimer) clearTimeout(this._payTimer);
                this._payTimer = setTimeout(() => {
                    this._isPaying = false;
                }, 3000);

                this.setState({
                    selCurrency: currency,
                    isCurrencyShowing: false,
                    isSearchInputFocused: false,
                })
                this.props.setCurrency(currency);
                this.props.onBack(true);
            }
        }
    }

    onBack = (e) => {
        const {
            loading,
            keyboardStatus,
            phoneSubmitStatus,
            isCurrencyShowing,
            isSettingsShowing,
            isHistoryShowing,
        } = this.state;
        this.cancelPromotionTimer();
        if(e) e.stopPropagation();
        if (!loading || phoneSubmitStatus === 'submitting' || phoneSubmitStatus === 'submitted') return;
        if (isSettingsShowing) {
            this.setState({
                isSettingsShowing: false,
                keyboardStatus: isCurrencyShowing ? keyboardStatus : 2,
            });
            if(!isCurrencyShowing && this.inputRef) this.inputRef.focus();
            return;
        }
        if (isHistoryShowing) {
            this.setState({ isHistoryShowing: false, keyboardStatus : 2 });
            if(this.inputRef) this.inputRef.focus();
            return;
        }
        if (isCurrencyShowing) {
            this.setState({
                isCurrencyShowing: false,
                isSearchInputFocused: false,
                keyboardStatus: 2,
                isPromotionShowing: false,
            });
            if(this.inputRef) this.inputRef.focus();
            return;
        }
        if (keyboardStatus === 2) {
            this.setState({ keyboardStatus: 1, isPromotionShowing: false });
            if(this.inputRef) this.inputRef.blur();
            return;
        }

        this.onForceBack();
    }

    onForceBack = e => {
        if(e) e.stopPropagation();
        // const clientId = localStorage.getItem('authClientId') ? `/${localStorage.getItem('authClientId')}` : '';

        this.cancelPromotionTimer();
        this.hidePhoneInput();
        this.props.onBack(false);
        this.setState({
            isSpinnerShowing: false,
            isPromotionShowing: false,
            phoneSubmitStatus: 'none',
            keyboardStatus: 0,
            isHistoryShowing: false,
        });
        if(this.inputRef) this.inputRef.blur();

        // const amount = (phoneSubmitStatus === 'warning' ? 0 : this.props.prevAmount);
        this._timeout.push(setTimeout(() => {
            this.setState({
                payAmount: 0,
                payText: '',
                qrCodeValue: `${payDomainName}`,
            });
            this.props.removeUniqueId();
        }, 2000));
        this.props.onGetAmount(0);
    }

    onSend = async (type = null) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            onGetAmount,
            PortfolioValue,
        } = this.props;

        const {
            currency,
        } = this.state;

        // const amount = (this.state.isFirstOpen ? this.props.amount : this.state.payAmount);
        const amount = this.state.payAmount;
        onGetAmount(amount);
        if(amount < 1e-9 && PortfolioValue) {
            const coin = PortfolioValue.find(item => item.Coin.toLowerCase() === (currency.currencyCode === 'USD' ? 'TUSD' : currency.currencyCode).toLowerCase());
            if(!(coin && coin.Position && coin.Position > 0)) {
                this.setState({ keyboardStatus: 1 });
                this._timeout.push(setTimeout(() => this.onBack(), 200));
                return;
            }
        }

        if (!isLoggedIn) {
            const { currency } = this.state;
            this.props.onBack(type !== null, amount === 0 ? (0.01 / currency.price) : amount);
            return;
        }
        if (this.state.loaded) {
            this.setState({
                phoneSubmitStatus: 'submitting',
                unloadPhoneInput: false,
                showPhoneArrow: false,
                isSpinnerShowing: true,
                keyboardStatus: 1,
                isCurrencyShowing: false,
                isHistoryShowing: false,
                isSearchInputFocused: false,
            });
            if(this.inputRef) this.inputRef.blur();

            this._timeout.push(setTimeout(() => {
                let res = true;

                if(isLoggedIn) {
                    res = this.updateQRCode(this.state.currency);
                }

                if (res !== -2) {
                    // In case, of amount > portfolio total value
                    this.props.onQRImageClick(true);
                    this.setState({
                        isSpinnerShowing: false,
                        unloadPhoneInput: false,
                        loading: true,
                        loaded: false,
                        showPhoneArrow: false,
                        phoneSubmitStatus: 'warning',
                        error: 'error',
                        isFirstOpen: false,
                    });
                    this._timeout.push(setTimeout(() => {
                        this.setState({
                            payAmount: res,
                            payText: (res < 1e-9) ? '' : this.props.getFixedNumberString(res),
                            isChanged: true,
                            showPhoneArrow: true,
                            loaded: true,
                            error: '',
                        });
                    }, 1000));
                    this.props.onGetAmount(res);
                } else {
                    this.setState({
                        isSpinnerShowing: false,
                        phoneSubmitStatus: 'submitted',
                        codeSubmitStatus: 'submitted',
                        unloadPhoneInput: false,
                        loaded: false,
                        keyboardStatus: 0,
                    });
                    if(this.inputRef) this.inputRef.blur();
                    if(isLoggedIn) this.props.onGetAmount(amount);

                    this._timeout.push(setTimeout(() => {
                        this.props.onQRImageClick(false);
                        this.hidePhoneInput();
                        this.setState({ unloadCodeInput: true });
                    }, 500));

                    this._timeout.push(setTimeout(() => {
                        this.setState({
                            payAmount: amount,
                            payText: (amount < 1e-9) ? '' : this.props.getFixedNumberString(amount),
                        });
                    }, 2500));
                }
            }, 2400));
        }
    }

    setScrollTop = () => {
        const countrySelect = document.getElementById('country-select-container');
        if(countrySelect) {
            countrySelect.scrollTop = 0;
        }
    }

    onClickCurrency = (e, cur) => {
        let currency = cur;
        if(currency.type === 'xignite') {
            this.setSearchInputFocus(e);
            this.setScrollTop();
            return;
        }

        if(e) e.stopPropagation();

        const {
            getStockPriceOf,
            onGetAmount,
            setCurrency,
        } = this.props;

        if(currency.type === 'stock') {
            getStockPriceOf(currency.currencyCode).then(price => {
                currency = {
                    ...currency,
                    price,
                };
                this.setState({
                    currency,
                    isCurrencyShowing: false,
                    isSearchInputFocused: false,
                    isFirstOpen: false,
                    payAmount: 0,
                    payText: '',
                });
                onGetAmount(0);
                setCurrency(currency);
            });
        } else {
            this.setState({
                currency,
                isCurrencyShowing: false,
                isSearchInputFocused: false,
                isFirstOpen: false,
                payAmount: 0,
                payText: '',
            });
            onGetAmount(0);
            setCurrency(currency);
        }

        this.onBack(e);
    }

    onHistoryRedo = (value) => {
        this.props.onGetAmount(value);
        this.setState({
            payAmount: value,
            payText: this.props.getFixedNumberString(value, true),
            isHistoryShowing: false,
            isCurrencyShowing: false,
            isSearchInputFocused: false,
            isFirstOpen: true,
            keyboardStatus: 2,
        });
        if(this.inputRef) this.inputRef.focus();
    }

    cancelPromotionTimer() {
        if(this._promotionEndTimeout) clearTimeout(this._promotionEndTimeout);
        if(this._promotionStartTimeout) clearTimeout(this._promotionStartTimeout);
    }

    getPayAmountText() {
        let amount = Math.round(this.state.payAmount);
        if(amount === 0) amount = 1;
        return this.props.getFixedNumberString(amount);
    }

    getLocalNumber() {
        const { balance } = this.props;
        if(Number(balance) < 1000) {
            return this.props.getFixedNumberString(balance);
        }
        return '1K+';
    }

    getBillStyle() {
        const { isHistoryDetailShowing } = this.state;
        const suffix = isHistoryDetailShowing && 'history_detail';
        const value = this.state.payAmount * this.state.currency.price;
        const amount = Math.round(value);
        if(value < 10) return `usd_1 ${suffix}`;
        if(amount < 100) return `usd_10 ${suffix}`;
        if(amount < 1000) return `usd_100 ${suffix}`;
        if(amount < 10000) return `usd_1000 ${suffix}`;
        if(amount < 100000) return `usd_10000 ${suffix}`;
        return `usd_100000 ${suffix}`;
    }

    getZoomInBillStyle() {
        const suffix = 'zoomIn';
        const value = this.state.payAmount * this.state.currency.price;
        const amount = Math.round(value);
        if(value < 10) return `usd_1 ${suffix}`;
        if(amount < 100) return `usd_10 ${suffix}`;
        if(amount < 1000) return `usd_100 ${suffix}`;
        if(amount < 10000) return `usd_1000 ${suffix}`;
        if(amount < 100000) return `usd_10000 ${suffix}`;
        return `usd_100000 ${suffix}`;
    }

    handleClickQR = e => {
        e.stopPropagation();

        this.setState({
            isSendingPayAmount: false
        });
    };

    onBoxClick = e => {
        if(e) e.stopPropagation();
        this._isPaying = true;
        if(this._payTimer) clearTimeout(this._payTimer);
        this._payTimer = setTimeout(() => {
            this._isPaying = false;
        }, 3000);
    }

    handlePayAmount = e => {
        e.stopPropagation();

        this.setState({
            isSendingPayAmount: true,
        });

        this._timeout.push(setTimeout(() => {
            this.setState({
                isSendingPayAmount: false
            });
        }, 1000));
    };

    getFormattedText = (str) => {
        const res = str.split('');
        const value = [];
        let isFirst = true;
        let count = 0;
        let isZero = true;
        for(let i = 0; i < res.length; i++) {
            if(res[i] !== '0' && res[i] !== '1' && res[i] !== '2' && res[i] !== '3' && res[i] !== '4' && res[i] !== '5' && res[i] !== '6' && res[i] !== '7' && res[i] !== '8' && res[i] !== '9') {
                if(isFirst) {
                    value.push('.');
                    isFirst = false;
                }
            } else {
                if(res[i] !== '0') isZero = false;
                if(isFirst) {
                    value.push(res[i]);
                } else if(count < 9) {
                    if(count === 8 && isZero) {
                        break;
                    }
                    value.push(res[i]);
                    count++;
                }
            }
        }
        return value.join('');
    }

    handleChangePayAmount = e => {
        e.stopPropagation();
        e.target.focus();
        this.setState({
            keyboardStatus: 2,
            isFirstOpen: false,
        });

        let value = e.target.value.split(',').join('');
        value = this.getFormattedText(value);
        if(value === '') {
            value = '0';
        } else if(value === '.') {
            value = '0.';
        }

        if(!Number.isNaN(Number(value)) && Math.floor(Number(value)) >= 1000000000) return;

        if(Number.isNaN(Number(value))) {
            this.setState({
                payAmount: Number(value),
                payText: value,
                error: 'error',
            });

            this._timeout.push(setTimeout(() => {
                this.setState({
                    isChanged: true,
                    payAmount: 0,
                    payText: '',
                    isFirstOpen: true,
                    showPhoneArrow: true,
                    error: '',
                });
            }, 500));
        } else {
            const numbers = value.split('.');
            const isDot = (value.indexOf('.') !== -1);
            this.setState({
                isChanged: true,
                payAmount: Number(value),
                payText: `${Number(numbers[0]).toLocaleString()}${(isDot ? `.${numbers.length > 1 ? numbers[1] : ''}` : '')}`,
                showPhoneArrow: true,
            });

            this.props.onGetAmount(Number(value));
        }
    };

    handleClickTick = () => {
        this.setState({
            loading: true,
            loaded: false,
            unloadPhoneInput: true,
            isSpinnerShowing: false,
        });

        this._timeout.push(setTimeout(() => {
            this.setState({
                loaded: true,
                loading: false,
            });
        }, 500));
    }

    handleCurrencyIconClick = (e) => {
        if(e) e.stopPropagation();
        this.setState(prevState => ({
            isHistoryShowing: !prevState.isHistoryShowing,
            isCurrencyShowing: false,
            isSearchInputFocused: false,
        }));
        // if(this.state.isSettingsShowing) {
        //     return;
        // }
        // if(this.state.isCurrencyShowing) {
        //     this.onBack(e);
        // } else if(this.state.keyboardStatus === 2) {
        //     this.setState({
        //         isCurrencyShowing: true,
        //         keyboardStatus: 1,
        //     });
        //     if (this.inputRef) this.inputRef.blur();
        //     this.handleChangeSearchCurrency('');
        // } else if(this.state.keyboardStatus === 1) {
        //     this.setState({ keyboardStatus: 2 });
        //     if (this.inputRef) this.inputRef.focus();
        // }
    }

    handleCurrencyTextClick = e => {
        if(this.state.unloadPhoneInput || !this.state.loaded) {
            return;
        }

        if(e) e.stopPropagation();

        this.setState({
            searchCurrency: '',
            isCurrencyShowing: true,
            isHistoryShowing: false,
            isSearchInputFocused: false,
        });
        this.handleChangeSearchCurrency('');
    }

    handleCountrySearchClick = () => {
        this.setState({
            isCurrencyShowing: false,
            isSearchInputFocused: false,
        });
    }

    handleInputClick = (e) => {
        if(this.state.isCurrencyShowing) {
            this.onBack(e);
        }
        this.setState({ keyboardStatus: 2 });
        if (this.inputRef) this.inputRef.focus();
    }

    handleChangeSearchCurrency = (value) => {
        this.setState(prevState => ({
            searchCurrency: value,
            currencyList: this.filterCurrencyList(this.props.currencies, prevState.currency, this.props.defaultCurrencyCode, value),
        }));
        this.setScrollTop();
    }

    handleInputBlur = (e) => {
        this._timeout.push(setTimeout(() => {
            const { loaded, isCurrencyShowing, isSettingsShowing, isHistoryShowing, isHistoryDetailShowing } = this.state;
            if(loaded && !isCurrencyShowing && !isSettingsShowing && !isHistoryShowing && !isHistoryDetailShowing) {
                if(!this._isPaying) {
                    this.onQRCode(e, 'pay');
                }
            }
        }, 500));
    }

    getCircleText = () => {
        const { payAmount, currency } = this.state;
        const amount = (payAmount === 0 ? 0.01 / currency.price : payAmount);
        const pattern = `· ${currency.type === 'country' ? (currency.symbol.includes('$') ? '$' : currency.symbol) : ''} ${this.props.getFixedNumberString(amount)} · ${currency.currencyCode} - ${currency.currency} `;
        const repeatAmount = 2;
        return pattern.repeat(repeatAmount);
    }

    getTransferNotification = (uniqueId) => {
        const {
            transferNotification,
            setFadeStatus,
        } = this.props;

        transferNotification().then(res => {
            if(res && res.Transfer.TrId === uniqueId) {
                if(res.Type === 'informing' && res.Transfer.Status !== 'pending') {
                    return;
                }
                setFadeStatus(res.Type);
                if(res.Type === 'informing') {
                    this.getTransferNotification(uniqueId);
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    payMoney = (amount, c, fiatPrice = 1, redirect = true, isRepeat = true) => {
        const {
            PortfolioValue,
            initTransferRequest,
            requestPosition,
            setPayAmount,
            setUniqueId,
            payDomainName
            // getUniqueId,
            // removeUniqueId,
            // setPayRepeatCount,
            // getPayRepeatCount,
            // resetToHomePage,
            // onGetAmount,
        } = this.props;

        // const clientId = localStorage.getItem('authClientId') ? `/${localStorage.getItem('authClientId')}` : '';

        // if(isRepeat && getUniqueId()) {
        //     const repeatCount = getPayRepeatCount();
        //     if(repeatCount >= 10) {
        //         if(this._repeatPayTimer) clearTimeout(this._repeatPayTimer);
        //         if(!this.state.loaded) {
        //             this.setState({
        //                 payAmount: DEFAULT_PAY_AMOUNT,
        //                 payText: (DEFAULT_PAY_AMOUNT === 0) ? '' : this.props.getFixedNumberString(DEFAULT_PAY_AMOUNT),
        //                 qrCodeValue: this.props.payDomainName,
        //                 isZoom: false,
        //                 isZoomIn: false,
        //             });
        //             onGetAmount(DEFAULT_PAY_AMOUNT);
        //             resetToHomePage();
        //         }
        //         removeUniqueId();
        //         return -1;
        //     }
        //     setPayRepeatCount(repeatCount + 1);
        // } else {
        //     if(this._repeatPayTimer) clearTimeout(this._repeatPayTimer);
        //     removeUniqueId();
        // }

        const currency = this.props.currencies.find(item => item.currencyCode === c.currencyCode && item.type === c.type);
        if(!currency) {
            return 0;
        }

        let payAmount = Number(amount);
        if (Number(amount) < 1e-9) payAmount = 0.01 / currency.price;
        if (payAmount > 0) {
            if (Math.round(fiatPrice) !== 1){
                payAmount = Number(fiatPrice);
            }
            const coin = PortfolioValue.find(item => item.Coin.toLowerCase() === (currency.currencyCode === 'USD' ? 'TUSD' : currency.currencyCode).toLowerCase());
            if(coin) {
                if(payAmount <= coin.Position) {
                    initTransferRequest(coin.Coin, payAmount, 'USD')
                    .then(uniqueAddress => {
                        requestPosition();
                        if(isRepeat && this.state.payAmount !== payAmount && !this.state.loaded) {
                            this.setState({
                                payAmount,
                                payText: (payAmount < 1e-9) ? '' : this.props.getFixedNumberString(payAmount),
                                currency,
                            });
                            this.props.onGetAmount(payAmount);
                        }
                        setPayAmount(payAmount, true);
                        this.resetQRCodeValue(redirect ? uniqueAddress : null);
                        this.getTransferNotification(uniqueAddress);
                        this.startChangingQR();
                        setUniqueId(uniqueAddress);
                        // this._repeatPayTimer = setTimeout(() => this.payMoney(amount, currency, fiatPrice, redirect, true), 300000);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                    return -2;
                }

                return coin.Position;
            }
        }
        this.setState({
            payAmount: 0,
            payText: '',
            qrCodeValue: `${payDomainName}`,
        });
        return 0;
    }

    updateQRCode = (currency, fiatPrice = 1, redirect = true) => {
        // let amount = (this.state.isFirstOpen ? this.props.amount : this.state.payAmount);
        return this.payMoney(this.state.payAmount, currency, fiatPrice, redirect, false);
    }

    resetQRCodeValue = (uniqueAd = null) => {
        this.setState({
            isSpinnerShowing: false,
        });

        if (uniqueAd) {
            this.setState({ qrCodeValue: `${this.props.payDomainName}/r/${uniqueAd}` });
            // this.setState({ qrCodeValue: 'ab.cd/12345678' });
            this.props.onSaveUniqueAddress(uniqueAd);
        }
    }

    getOptionQRCode() {
        const { isQRShowing, qrCodeValue } = this.state;
        if (isQRShowing) {
            return qrCodeValue.split('/r/').join('/t/');
        }
        return qrCodeValue;        

    }

    containerClass() {
        const suffix = this.state.isHistoryDetailShowing ? 'history_detail' : '';
        if (this.showCodeInput()) {
            return `input-bar-containers shadow ${suffix}`;
        }
        return `input-bar-containers ${suffix}`;
    }

    phoneContainerClass() {
        const {
            error,
            loading,
            unloadPhoneInput,
            isSpinnerShowing,
            phoneSubmitStatus,
        } = this.state;
        const suffix = `${isSpinnerShowing ? 'spinner' : ''} ${phoneSubmitStatus === 'warning' ? ' warning' : ''} ${error}`;

        if (loading) {
            if (unloadPhoneInput) {
                return `input-bar load unload ${suffix}`;
            }
            return `input-bar load ${suffix}`;
        }
        return `input-bar ${suffix}`;
    }

    phoneSubmitIconUrl() {
        const {
            phoneSubmitStatus,
            unloadCodeInput,
        } = this.state;

        if (phoneSubmitStatus === 'submitted') {
            if (unloadCodeInput) {
                return verifyIcon;
            }
            return 'spinner';
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'spinner';
        }
        return verifyIcon;
    }

    phoneSubmitIconClass() {
        const { phoneSubmitStatus, unloadPhoneInput, showPhoneArrow } = this.state;

        if (phoneSubmitStatus === 'submitted') {
            if (!unloadPhoneInput) {
                return 'qr-code-container';
            }
            return 'qr-code-container';
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        if (showPhoneArrow) {
            return 'qr-code-container arrow';
        }
        return 'qr-code-container';
    }

    codeSubmitIconClass() {
        const { codeSubmitStatus } = this.state;

        if (codeSubmitStatus === 'submitted') {
            return 'qr-code-container none';
        }
        if (codeSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        return 'qr-code-container arrow';
    }

    showCodeInput() {
        return this.state.phoneSubmitStatus === 'submitted' && !this.state.unloadCodeInput;
    }

    hidePhoneInput() {
        this.setState({
            unloadPhoneInput: true,
            showPhoneArrow: false,
        });
        this._timeout.push(setTimeout(() => {
            this.componentDidMount();
        }, 1000));
    }

    startChangingQR() {
        if (this._blinkingTimer) clearInterval(this._blinkingTimer);
        this._blinkingTimer = setInterval(() => {
            this.setState(prevState => ({
                isQRShowing: !prevState.isQRShowing,
            }));
        }, 5000);
    }

    filterCurrencyList(currencies, selCurrency, defaultCode, searchCurrency='') {
        // const prev = new Date().getTime();

        let currencyList = [];
        const searchList = currencies.filter(currency => (!searchCurrency || searchCurrency === '')
            || (searchCurrency && searchCurrency !== ''
            && (String(currency.currencyCode).toLowerCase().includes(String(searchCurrency).toLowerCase())
            || String(currency.currency).toLowerCase().includes(String(searchCurrency).toLowerCase()))));

        const btcCurrency = searchList.find(currency => (currency.type === 'crypto' && currency.currencyCode === 'BTC'));
        if(btcCurrency) currencyList.push(btcCurrency);

        const defaultCurrency = searchList.find(currency => !(currency.type === 'crypto' && currency.currencyCode === 'BTC')
            && (currency.type === 'country' && currency.currencyCode === defaultCode));
        if(defaultCurrency) currencyList.push(defaultCurrency);

        const nonEmptyList = searchList.filter(currency => !(currency.type === 'crypto' && currency.currencyCode === 'BTC')
            && !(currency.type === 'country' && currency.currencyCode === defaultCode)
            && (currency.amountUsd > 0));
        nonEmptyList.sort((a, b) => {
            return Number(b.amountUsd) - Number(a.amountUsd);
        });
        currencyList = currencyList.concat(nonEmptyList);

        const selectedCurrency = searchList.find(currency => !(currency.type === 'crypto' && currency.currencyCode === 'BTC')
            && !(currency.type === 'country' && currency.currencyCode === defaultCode)
            && !(currency.amountUsd > 0)
            && (currency.type === selCurrency.type && currency.currencyCode === selCurrency.currencyCode));
        if(selectedCurrency) currencyList.push(selectedCurrency);

        if(searchCurrency && searchCurrency !== '') {
            const matchList = searchList.filter(currency => !(currency.type === 'crypto' && currency.currencyCode === 'BTC')
                && !(currency.type === 'country' && currency.currencyCode === defaultCode)
                && !(currency.amountUsd > 0)
                && !(currency.type === selCurrency.type && currency.currencyCode === selCurrency.currencyCode)
                && (currency.currencyCode.toLowerCase().indexOf(searchCurrency.toLowerCase()) === 0));
            currencyList = currencyList.concat(matchList);

            if(currencyList.length < 50) {
                const nonMatchList = searchList.filter(currency => !(currency.type === 'crypto' && currency.currencyCode === 'BTC')
                    && !(currency.type === 'country' && currency.currencyCode === defaultCode)
                    && !(currency.amountUsd > 0)
                    && !(currency.type === selCurrency.type && currency.currencyCode === selCurrency.currencyCode)
                    && !(currency.currencyCode.toLowerCase().indexOf(searchCurrency.toLowerCase()) === 0));
                currencyList = currencyList.concat(nonMatchList);
            } 
        } else {
            const matchList = searchList.filter(currency => !(currency.type === 'crypto' && currency.currencyCode === 'BTC')
                && !(currency.type === 'country' && currency.currencyCode === defaultCode)
                && !(currency.amountUsd > 0)
                && !(currency.type === selCurrency.type && currency.currencyCode === selCurrency.currencyCode)
                && currency.type === 'country');
            currencyList = currencyList.concat(matchList);
        }
            
        currencyList = currencyList.slice(0, 50);
        currencyList = currencyList.concat(XIGNITE_DATA);

        // console.log('time: ', new Date().getTime() - prev);
        // console.log(currencyList);

        return currencyList;
    }

    getFontSize = () => {
        const { payText, currency, isHistoryShowing } = this.state;
        const { getFixedNumberString } = this.props;

        let str = (currency.type === 'country' ? currency.symbol : '');

        if(isHistoryShowing) {
            str += getFixedNumberString(currency.position);
        } else if(payText === '') {
            // str += isFirstOpen ? this.props.amount.toLocaleString() : '0';
            str += '0';
        } else {
            str += payText;
        }

        const len = str.length;
        if(len < 6) return 46;
        return 40 * 6 / len;
    }

    // getSymbolPadding = (symbolLen) => {
    //     const len = Math.round(this.state.payAmount).toLocaleString().length;
    //     if(len < 6) return (symbolLen === 3 ? '0 2px 5px 2px' : '0 2px 0 2px');
    //     if(len === 6) return (symbolLen === 3 ? '0 2px 0 2px' : '0 2px 0 2px');
    //     if(len === 7) return (symbolLen === 3 ? '1px 2px 0 2px' : '0 2px 2px 2px');
    //     if(len === 9) return (symbolLen === 3 ? '0 2px 3px 2px' : '0 2px 3px 2px');
    //     if(len === 10) return (symbolLen === 3 ? '0 2px 0px 2px' : '0 2px 0 2px');
    //     return (symbolLen === 3 ? '1px 2px 0 2px' : '0 2px 4px 2px');
    // }

    // getCurrencyBalance = () => {
    //     const balances = [];
    //     this.state.currencyList.forEach(item => {
    //         balances.push(item.currencyCode === 'USD' ? this.props.PortfolioValue : 0); 
    //     });
    //     return balances;
    // }

    getInputFormWidth() {
        const width = document.getElementsByClassName('input-bar')[0].clientWidth;
        return width === 0 ? 78 : width;
    }

    getMaxWidthOfForm() {
        const {
            loading,
            isHistoryShowing,
            isCurrencyShowing,
            isSettingsShowing,
        } = this.state;
        const inputBar = document.getElementsByClassName('input-bar')[0];
        if (isHistoryShowing || isCurrencyShowing || isSettingsShowing || !loading) {
            if (inputBar) document.getElementsByClassName('input-bar')[0].setAttribute('style', '');
            return null;
        }
        let numberInputCurrency = document.getElementsByClassName('number-input-currency')[0];
        let numberInputHide = document.getElementsByClassName('number-input-hide')[0];
        if (numberInputCurrency) numberInputCurrency = numberInputCurrency.clientWidth || 0;
        if (numberInputHide) numberInputHide = numberInputHide.clientWidth || 0;
    }

    setHistoryDetail = (value, amount) => {
        this.setState(prevState => ({
            isHistoryDetailShowing: true,
            historyDetailQRValue: value,
            prevCurrency: prevState.currency,
        }))
        this.props.setCurrency(this.state.currency);
        this.props.onGetAmount(amount);
    }

    getCurrencyPosition(currencyCode) {
        const { PortfolioValue } = this.props;
        const curIndex = findIndex(PortfolioValue, { Coin: currencyCode });

        return curIndex === -1 ? 0 : PortfolioValue[curIndex].Position;
    }

    getCurrencyText = (currency) => {
        if(currency.type === 'crypto') {
            return currency.currency;
        }
        const names = currency.currency.split(' ');
        return names[names.length - 1];
    }

    getCoinIconUrl = (item) => {
        if(item.type === 'country') {
            return `/img/icons-coin/${item.currencyCode.toLowerCase()}.png`;
        }
        
        if(item.type === 'stock') {
            return `https://storage.googleapis.com/iex/api/logos/${item.currencyCode}.png`;
        }
        
        if(COIN_DATA_MAP[item.currencyCode] && COIN_DATA_MAP[item.currencyCode].file) {
            if(COIN_DATA_MAP[item.currencyCode].file.indexOf('svg') < 0) {
                return `img/icons-coin/${COIN_DATA_MAP[item.currencyCode].file}`;
            }
            return `/img/sprite-coins-view.svg#coin-${item.currencyCode.toLowerCase()}`;
        }
        return `img/coin/coin-${item.currencyCode.toLowerCase()}.png`;
    }

    setSearchInputFocus = e => {
        if(e) e.stopPropagation();
        this.searchInputRef.focus();
        this.setState({ isSearchInputFocused: true });
        document.body.scrollTop = 0;
    }

    getSymbol = currency => {
        // const { defaultCurrencyCode, currencies } = this.props;
        // const defaultCurrency = currencies.length > 0 && currencies.find(item => {
        //     return item.type === 'country' && item.currencyCode.toLowerCase() === defaultCurrencyCode.toLowerCase();
        // });
        // if (defaultCurrency && defaultCurrency.currency.includes('Dollar')) {
        //     if (currency.currencyCode === 'USD' && defaultCurrencyCode !== 'USD') return 'US $';
        //     if (currency.currencyCode !== 'USD' && defaultCurrencyCode === currency.currencyCode) return '$';            
        // }
        const { isInitShowing } = this.state;
        if (isInitShowing) return '¢';
        if (currency.currency.includes('Dollar')) return '$';
        return currency.symbol;
    }

    getSymbolFontSize = (currency, length) => {
        const { isInitShowing } = this.state;

        let res = 36;
        if (length < 4) res = 36;
        else if (length < 6) res = 32;
        else if (length === 6) res = 28;
        else if (length === 7) res = 24;
        else if (length < 10) res = 20;
        else if (length < 12) res = 16;

        if (isInitShowing) return 46;
        if (currency.symbol.includes('$')) return res;
        return '';
    }

    render() {
        const {
            error,
            isChanged,
            payAmount,
            payText,
            isLandscapeMode,
            isSendingPayAmount,
            isSpinnerShowing,
            phoneSubmitStatus,
            isSettingsShowing,
            isHistoryShowing,
            isHistoryDetailShowing,
            isSearchInputFocused,
            historyDetailQRValue,
            isCurrencyShowing,
            isPromotionShowing,
            isInitShowing,
            searchCurrency,
            currency,
            currencyList,
        } = this.state;
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            getFixedNumberString,
        } = this.props;
        const circledText = this.getCircleText();
        const circledTextLength = circledText.length;

        return (
            <Main
                isLoggedIn={isLoggedIn}
                certVisible={isLoggedIn}
                formLoaded={this.state.loaded && !isHistoryDetailShowing}
                symbolLength={this.state.currency.symbol.length}
                onClick={e => {
                    if(isHistoryDetailShowing) {
                        e.stopPropagation();
                        this.setState({
                            isHistoryDetailShowing: false,
                        });
                        this.props.setCurrency(this.state.prevCurrency);
                        this.props.onGetAmount(payAmount);
                    } else if(this.state.loaded && !isCurrencyShowing && !isSettingsShowing && !isHistoryShowing) {
                        this.onQRCode(e, 'pay');
                    } else {
                        this.onBack(e);
                    }
                }}
            >
                {isSettingsShowing ? (
                    <Settings
                        onBack={e => this.onBack(e)}
                        isLoggedIn={isLoggedIn}
                    />
                ) : (
                    <div>
                        {isHistoryShowing && (
                            <History
                                currency={currency}
                                isHistoryDetailShowing={isHistoryDetailShowing}
                                onBack={e => this.onBack(e)}
                                setHistoryDetail={this.setHistoryDetail}
                                onHistoryRedo={this.onHistoryRedo}
                            />
                        )}
                        {isCurrencyShowing && (
                            <CountrySelect onClick={e => this.onBoxClick(e)} isFocused={isSearchInputFocused}>
                                {currencyList.map(item => {
                                    return (
                                        <CountrySelectItem key={`${item.type}-${item.currencyCode}`} onClick={e => this.onClickCurrency(e, item)}>
                                            <div className="d-flex align-items-center" style={{ width: '100%' }}>
                                                <CoinIcon item={item}/>

                                                {item.type === 'xignite' ? (
                                                    <div className="currency-item-container">
                                                        <div className="currency-item-currency-container">
                                                            <h1 className={`currency-code ${searchCurrency !== '' && 'small'}`}>{item.currencyCode}</h1>
                                                        </div>
                                                        {searchCurrency === '' ?
                                                            <div className="currency-item-price-container" onClick={e => this.onHistory(item, e)} role="button" tabIndex={0}>
                                                                <h1 className="currency-price grey">{item.name}</h1>
                                                            </div>
                                                            :
                                                            <div className="currency-item-price-container currency">
                                                                {item.name}
                                                            </div>
                                                        }
                                                    </div>
                                                ) : (isLoggedIn ? (
                                                    <div className="currency-item-container">
                                                        <div className="currency-item-currency-container">
                                                            <h1 className={`currency-code ${searchCurrency !== '' && 'small'}`}>{item.currencyCode}</h1>
                                                        </div>
                                                        {searchCurrency === '' ?
                                                            <div className="currency-item-price-container" onClick={e => this.onHistory(item, e)} role="button" tabIndex={0}>
                                                                <h1 className={`currency-price ${item.position < 1e-9 ? 'grey' : ''}`}>{item.type === 'country' ? this.getSymbol(item) : ''}{this.props.getFixedNumberString(item.position)}</h1>
                                                            </div>
                                                            :
                                                            <div className="currency-item-price-container currency">
                                                                {item.currency}
                                                            </div>
                                                        }
                                                    </div>
                                                ) : (
                                                    <div className="currency-item-container">
                                                        <div className="currency-item-currency-container">
                                                            <h1 className={`currency-code ${searchCurrency !== '' && 'small'}`}>{item.currencyCode}</h1>
                                                        </div>
                                                        {searchCurrency === '' ?
                                                            <div className="currency-item-price-container" onClick={e => this.onHistory(item, e)} role="button" tabIndex={0}>
                                                                <img src={lockIcon} alt="" />
                                                            </div>
                                                            :
                                                            <div className="currency-item-price-container currency">
                                                                {item.currency}
                                                            </div>
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        </CountrySelectItem>
                                    );
                                })}
                            </CountrySelect>
                        )}
                    </div>
                )}

                {!isHistoryDetailShowing && (
                    <div className={this.containerClass()} style={{top: isSearchInputFocused && '5%'}}>
                        <div className="input-bar-container">
                            <InputBar
                                className={this.phoneContainerClass()}
                                onClick={e => this.onBoxClick(e)}
                            >
                                {isCurrencyShowing && 
                                    <CountrySearch>
                                        <ExchDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px" onClick={(e) => this.setSearchInputFocus(e)}>
                                            <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
                                            <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
                                        </ExchDropdownSearchIconSvg>
                                        <input
                                            type="text"
                                            value={searchCurrency}
                                            placeholder=""
                                            disabled={isLandscapeMode}
                                            ref={ref => {
                                                this.searchInputRef = ref;
                                            }}
                                            onClick={(e) => this.setSearchInputFocus(e)}
                                            onChange={(e) => this.handleChangeSearchCurrency(e.target.value)}
                                        />
                                        <img src="/img/svg/close.svg" alt="search" className="close" onClick={e => this.onBack(e)} />
                                    </CountrySearch>
                                }
                                
                                {!isCurrencyShowing && <NumberInputWrapper
                                    onClick={e => this.handleInputClick(e)}
                                    fontSize={this.getFontSize()}
                                    isInitShowing={isInitShowing}
                                >
                                    <CurrencyText isHidden={isInitShowing}>
                                        <CoinIcon item={currency} click={e => this.handleCurrencyTextClick(e)} size="big" />
                                        <span onClick={e => this.handleCurrencyTextClick(e)} role="button" tabIndex={0}>{currency.currencyCode}</span>
                                    </CurrencyText>
                                    <CurrencyAmount onClick={() => {this.inputRef.focus();}}>
                                        <div className={`number-input-currency len-${payText.length}`}>
                                            {(currency.symbol && currency.type === 'country') &&
                                                <div
                                                    style={{ fontSize: `${this.getSymbolFontSize(currency, isHistoryShowing ? getFixedNumberString(currency.position, true).length : payText.length)}px`}}
                                                >
                                                    {this.getSymbol(currency)}
                                                </div>
                                            }
                                        </div>

                                        {isHistoryShowing ? (
                                            <div className="number-input-hide" onClick={e => this.onBack(e)} role="button" tabIndex={0}>
                                                {currency.position && <div>{getFixedNumberString(currency.position, true)}</div>}
                                            </div>
                                        ) : (
                                            <div className="number-input-hide">
                                                <div>
                                                    {payText === '' ? (
                                                        // isFirstOpen ? this.props.amount.toLocaleString() : 0
                                                        0
                                                    ) : (
                                                        payText
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CurrencyAmount>
                                </NumberInputWrapper>}

                                {!isCurrencyShowing && <input
                                    type="tel"
                                    className="number-input"
                                    value={payText}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            this.onQRCode(e, 'pay');
                                        }
                                    }}
                                    onChange={this.handleChangePayAmount}
                                    onKeyDown={(e) => this.onInputChange(e)}
                                    readOnly={isSendingPayAmount}
                                    ref={ref => {
                                        this.inputRef = ref;
                                    }}
                                    disabled={phoneSubmitStatus === 'none' || isSettingsShowing || isLandscapeMode || isHistoryShowing}
                                    onClick={e => this.handleInputClick(e)}
                                    onBlur={e => this.handleInputBlur(e)}
                                />}

                                <CertificateContainer
                                    billHeight={this.props.billHeight}
                                    billWidth={this.props.billWidth}
                                    className={this.getBillStyle()}
                                >
                                    <img src={certificateImg} alt="" />
                                    <CircleText isLoggedIn={isLoggedIn && !isChanged}>
                                        {
                                            circledText.split('').map((item, index) =>
                                                <div
                                                    key={`char-rotation-${index}`}
                                                    className={`char-${index}`}
                                                    style={{ transform: `rotate(${-90 + 360.0 / circledTextLength * index}deg)` }}
                                                >
                                                    <span>{item}</span>
                                                </div>)
                                        }
                                    </CircleText>
                                    <QRCodeWrapper>
                                        <QRCode
                                            value={this.getOptionQRCode()}
                                            bgColor="transparent"
                                            fgColor="#000"
                                            renderAs="svg"
                                        />
                                    </QRCodeWrapper>
                                </CertificateContainer>

                                {!isSpinnerShowing && !this.state.loaded && !this.state.loading && (
                                    <div className={this.phoneSubmitIconClass() + (isChanged ? ' changed' : '')} onClick={(e) => this.onQRCode(e, 'pay')} role="button" tabIndex={0}>
                                        <PayText>
                                            {error === '' && <img src={payIcon} alt="pay"/>}
                                            {error === 'error' && <img src={payErrorIcon} alt="pay-error"/>}
                                        </PayText>
                                    </div>
                                )}
                            </InputBar>
                            {isSpinnerShowing && (
                                <LoadingSpinner width={this.getInputFormWidth() || 0}>
                                    <div className="spinner" />
                                </LoadingSpinner>
                            )}
                        </div>

                        {isPromotionShowing && <Promotion style={{ backgroundColor: '#3269D1', paddingBottom: '8px' }} onClick={e => this.onPromotion(e)}>
                            <div className="prefix">
                                <div className="containerText">
                                    <div className="five" style={{ fontSize: '36px', paddingRight: '10px', fontFamily: 'AvantGarde LT CondBook' }}>
                                        $5
                                    </div>
                                </div>
                            </div>
                            <div className="prefix">
                                <div className="containerText">
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>
                                        Send any amount to your friends and we&apos;ll send you both $5 when they try this App!
                                    </div>
                                </div>
                            </div>
                        </Promotion>}
                    </div>
                )}

                {isHistoryDetailShowing && (
                    <div className="input-bar-containers">
                        <div className="input-bar-container" style={{ height: '74px' }}>
                            <div className="input-bar" style={{ height: '111px' }}>
                                <CertificateContainer
                                    billHeight={this.props.billHeight}
                                    billWidth={this.props.billWidth}
                                    className={this.getBillStyle()}
                                >
                                    <img src={certificateImg} alt="" />
                                    <QRCodeWrapper>
                                        <QRCode
                                            value={historyDetailQRValue}
                                            bgColor="#FFB400"
                                            fgColor="#000"
                                            renderAs="svg"
                                        />
                                    </QRCodeWrapper>
                                </CertificateContainer>
                            </div>
                        </div>
                    </div>
                )}

                {isSpinnerShowing && (
                    <LockScreen onClick={e => e.stopPropagation()}/>
                )}
            </Main>
        );
    }
}

export default compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.PAYAPPSTORE,
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.FIATCURRENCYSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.SENDCOINSTORE]: {
                    isEmpty,
                    initTransferRequest,
                    uniqueAddress,
                    requestDetailsPublic,
                    requestDetailsPrivate,
                    transferNotification,
                },
                [STORE_KEYS.SETTINGSSTORE]: {
                    defaultFiat,
                    getDefaultPrice,
                    getUSDPrice,
                    currencies,
                },
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    isNewUser,
                    PortfolioData,
                    PortfolioValue,
                    requestPosition,
                    requestCoinsForWallet,
                    isPositionLoaded,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    payAmount,
                    payDomainName,
                    switchAppContentView,
                    setPayAmount,
                    loadQRCodeUrl,
                    payViewMode,
                    setUniqueId,
                    getUniqueId,
                    removeUniqueId,
                    setPayRepeatCount,
                    getPayRepeatCount,
                    getFixedNumberString,
                },
                [STORE_KEYS.SMSAUTHSTORE]: {
                    isLoggedIn,
                },
                [STORE_KEYS.FIATCURRENCYSTORE]: {
                    getStockPriceOf,
                },
            }
        ) => ({
            isLoggedIn,
            isEmpty,
            isNewUser,
            initTransferRequest,
            getUSDPrice,
            defaultFiat,
            getDefaultPrice,
            PortfolioData,
            requestPosition,
            PortfolioValue,
            switchAppContentView,
            loadQRCodeUrl,
            payAmount,
            payDomainName,
            setPayAmount,
            payViewMode,
            uniqueAddress,
            requestDetailsPublic,
            requestDetailsPrivate,
            requestCoinsForWallet,
            transferNotification,
            currencies,
            setUniqueId,
            getUniqueId,
            removeUniqueId,
            setPayRepeatCount,
            getPayRepeatCount,
            getStockPriceOf,
            getFixedNumberString,
            isPositionLoaded,
        })
    )
)(withRouter(PayQRCodeViewV2));
