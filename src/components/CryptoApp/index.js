import React, { Component } from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Swipeable } from 'react-swipeable';
import { withSafeTimeout, withSafeInterval } from '@hocs/safe-timers';
import { countries as countryList } from "typed-countries";
import { getCountryCallingCode } from 'libphonenumber-js';
import FacebookLogin from 'react-facebook-login';

import {
    Wrapper,
    BillWrapper,
    BackCurrency,
    PayQRWrapper,
    QRWrapper,
    CurrencyHead,
    BackCurrencyContainer,
    BackCurrencyDataContainer,
    LoadingWrapper,
    LoadingBill,
} from './Components';
import AppHistory from './AppHistory';
import PayQRCodeV2InCurrency from './PayQRCodeV2InCurrency';
import SMSVerificationForm from './SMSVerificationForm';
import FadeScreen from './FadeScreen';
import { STORE_KEYS } from '@/stores';
import PaymentData from './PaymentData/index';
import Wallet from './Wallet';

import USD_1 from './DollarBills/USDT/USDT_1.jpg';
import USD_10 from './DollarBills/USDT/USDT_10.jpg';
import USD_100 from './DollarBills/USDT/USDT_100.jpg';
import USD_1000 from './DollarBills/USDT/USDT_1000.jpg';
import USD_10000 from './DollarBills/USDT/USDT_10000.jpg';
import USD_100000 from './DollarBills/USDT/USDT_100000.jpg';
import LoadingImg from './asset/img/Loading.png';

class CryptoApp extends Component {
    _isMounted = false;
    _timeout = [];
    _timer = null;
    _prevOrie = null;
    _fadeScreenTimer = null;
    _transactionTimer = null;

    state = {
        isInitShowing: false,
        isLoadingShowing: true,
        isBlurLoaded: false,
        isTransferLoaded: false,
        isHistoryShowing: false,
        isSMSVerificationShowing: false,
        isPublicKeyShowing: false,
        isPrivateKeyShowing: false,
        coinAddress: '',
        isScanned: false,
        isPayee: -1,
        isBalanceLoaded: !this.props.isLoggedIn || this.props.isPositionLoaded,
        isPayFormShowing: false,
        scannedStatus: '',
        isCheckingClaimed: false,
        currencyHeadIndex: false,
        privateKeyURL: '',
        amount: 0,
        logoutAmount: 0,
        prevAmount: 0,
        repayAmount: 0,
        isFirstLoad: true,
        verifyType: '',
        smsPlaceHolder: '',
        scannedUniqueId: '',
        scannedAmount: 0,
        afterClaimed: null,
        billHeight: 0,
        spaceWidth: 0,
        fadeStatus: '',
        countries: null,
        countryCode: '',
        defaultCurrencyCode: '',
        currency: {
            symbol: '$',
            currency: 'United States Dollar',
            currencyCode: 'USD',
            price: 1,
            type: 'country',
        },
        // message: null,
    };

    componentDidMount() {
        this.getCountrySelectData();
        this._isMounted = true;

        const {
            isCoinTransfer,
            trId,
            firstLoad,
            // getUniqueId,
            removeUniqueId,
            isPositionLoaded,
            [STORE_KEYS.VIEWMODESTORE]: { isLoaded },
            [STORE_KEYS.SMSAUTHSTORE]: { isLoggedIn },
        } = this.props;

        if(isPositionLoaded) {
            this.setState({ isBalanceLoaded: true });
            if(!isCoinTransfer) {
                if(isLoggedIn) {
                    this.setState({
                        isTransferLoaded: true,
                        amount: 0.01,
                        repayAmount: 0.01,
                        currency: {
                            symbol: '$',
                            currency: 'United States Dollar',
                            currencyCode: 'USD',
                            price: 1,
                            type: 'country',
                        },
                    });
                }
            }
        }

        removeUniqueId();
        if (isCoinTransfer) {
            this.setState({
                isCheckingClaimed: true,
                scannedUniqueId: trId,
            });
            this.getTransferDetail(trId).then(() => {
                this.setState({ isPayee: 0 });
            });
        } else {
            document.title = 'Blockchain Terminal';
            if(!isLoggedIn) {
                this.setState({
                    isTransferLoaded: true,
                })
            }
            // const uniqueId = getUniqueId();
            // if(isLoggedIn && uniqueId) {
            //     this.getTransferDetail(uniqueId);
            // } else {
            //     this.setState({
            //         isTransferLoaded: true,
            //     })
            // }
        }
        document.getElementsByTagName('body')[0].style = `height: ${document.documentElement.clientHeight}px !important`;
        this._prevOrie = window.orientation;
        if(Math.round(this.state.billHeight) === 0) {
            this.setState({
                billHeight: document.documentElement.clientHeight - 60,
                spaceWidth: ((document.documentElement.clientWidth) - (document.documentElement.clientHeight) * 0.42) / 2,
            });
        }

        window.addEventListener('resize', () => {
            if (Number(window.orientation) !== Number(this._prevOrie)) {
                this.setBillHeight();
            }
        });

        window.addEventListener('orientationchange', () => {
            this.setOrientationMode();
        }, false);
        this.setOrientationMode();
        this.setBillHeight();

        if(isLoaded) {
            this.setState({ isLoadingShowing: false });
        } else if(!firstLoad) {
            this.handleLoad();
        } else {
            window.addEventListener('load', this.handleLoad.bind(this));
        }

        Axios.get('https://json.geoiplookup.io/').then(res => {
            this.setState({
                countryCode: res.data.country_code,
                defaultCurrencyCode: res.data.currency_code,
            });
        }).catch(err => {
            this.setState({
                countryCode: 'US',
                defaultCurrencyCode: 'USD'
            });
            console.log(err);
        });

        if(isLoggedIn) {
            this.setCoinAddress();
            this.props.requestTransferHistory();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isPositionLoaded && nextProps.isPositionLoaded) {
            this.setState({ isBalanceLoaded: true });
            if(!this.props.isCoinTransfer) {
                if(this.props.isLoggedIn && !this.state.isSMSVerificationShowing) {
                    this.setState({
                        isTransferLoaded: true,
                        amount: 0.01,
                        repayAmount: 0.01,
                    });
                }
            }
        }

        if (nextProps.trId !== this.props.trId) {
            this.setState({
                isCheckingClaimed: true,
                scannedUniqueId: undefined,
            });
            this.getTransferDetail(nextProps.trId);
        }

        if (nextProps.isEmpty !== this.props.isEmpty) {
            if (nextProps.isEmpty === true) {
                this.props.promotionTransferRequest('New');
                this._timeout.push(setTimeout(() => this.props.requestCoinsForWallet(), 5000));
            }
        }
    }

    componentDidUpdate() {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: { isLoggedIn },
        } = this.props;
        const {
            isScanned,
            isFirstLoad,
            scannedUniqueId
        } = this.state;

        if (isLoggedIn && !isScanned && isFirstLoad) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                isFirstLoad: false,
                scannedUniqueId: scannedUniqueId === undefined ? scannedUniqueId : '',
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._timer);
        document.getElementsByTagName('body')[0].removeAttribute('style');
        if (this.clearToggleHistoryTimeout) {
            this.clearToggleHistoryTimeout();
        }
        if (this.clearGetTransferDetailTimeout) {
            this.clearGetTransferDetailTimeout();
        }
        if (this.clearSwipeHandlerTimeout) {
            this.clearSwipeHandlerTimeout();
        }
        if (this._fadeScreenTimer) {
            clearTimeout(this._fadeScreenTimer);
        }

        for (let i = 0; i < this._timeout.length; i++) {
            clearTimeout(this._timeout[i]);
        }
    }

    setOrientationMode = () => {
        if (window.orientation !== 0) document.getElementsByTagName('body')[0].classList.add('landscape');
        else document.getElementsByTagName('body')[0].classList.remove('landscape');
    }

    setBillHeight = () => {
        this._prevOrie = window.orientation;
        document.getElementsByTagName('body')[0].style = `height: ${document.documentElement.clientHeight}px !important`;
        this.setState({
            billHeight: window.orientation === 0 ? document.documentElement.clientHeight : document.documentElement.clientWidth,
            spaceWidth: ((document.documentElement.clientWidth) - (document.documentElement.clientHeight) * 0.42) / 2,
        });
    }

    setCoinAddress = () => {
        this.props.createDepositAddress('BTC')
            .then(address => {
                this.setState({
                    coinAddress: address,
                });
            }).catch(err => {
                console.log(err);
            });
    }

    toggleHistory = (isReset = false) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;
        const {
            isHistoryShowing,
            isCheckingClaimed,
            scannedUniqueId,
        } = this.state;

        if (isReset && !isCheckingClaimed && scannedUniqueId !== undefined && scannedUniqueId !== '') {
            this.setState({
                scannedUniqueId: '',
                amount: 0,
                prevAmount: 0,
                scannedAmount: 0,
            });
        }

        if (isHistoryShowing) {
            this._timeout.push(setTimeout(() => {
                const obj = document.getElementsByClassName('crypto-app-back-currency-container')[0];
                if (obj) obj.setAttribute('style', 'display: block;');
            }, 500));
        }

        if (isLoggedIn) {
            this.setState(prevState => ({
                isHistoryShowing: !prevState.isHistoryShowing,
            }));
        } else if (!isLoggedIn) {
            this.setState({
                isSMSVerificationShowing: true,
            });
        }
    };

    handleBack = () => {
        this.setState({
            isSMSVerificationShowing: false,
            isScanned: false,
        });
        this.resetToHomePage();
    }

    handleQRBack = (value, logoutAmount = 0) => {
        if (value) {
            this.setState({
                logoutAmount,
                prevAmount: logoutAmount,
                isSMSVerificationShowing: true,
                currencyHeadIndex: false,
                verifyType: (logoutAmount === 0 ? 'history' : 'pay'),
            });
        } else {
            this.setState(prevState => ({
                logoutAmount: 0,
                amount: prevState.prevAmount,
                currencyHeadIndex: false,
            }));
        }
    }

    handleQRImageClick = (value) => {
        this.setState({ currencyHeadIndex: value });

        if(value) {
            this.savePrevAmount();
        }
    }

    savePrevAmount = () => {
        this.setState(prevState => ({ prevAmount: prevState.amount }));
    }

    handleGetAmount = (value) => {
        this.setState({ amount: Number(value), repayAmount: 0 });
    }

    handleVerification = (isHistory) => {
        const { verifyType, logoutAmount } = this.state;

        this.setState({
            isHistoryShowing: isHistory,
            isSMSVerificationShowing: false,
            isScanned: false,
            smsPlaceHolder: null,
            scannedAmount: 0,
            currencyHeadIndex: (verifyType.length > 0),
            verifyType: '',
            amount: logoutAmount,
            repayAmount: logoutAmount,
        });
    }

    handlePrevAmount = (am) => {
        this.setState({ prevAmount: am });
    }

    handleSaveUniqueAddress = (uniqueAddress) => {
        this.setState({
            scannedUniqueId: uniqueAddress,
            isCheckingClaimed: true,
        });
    }

    getCountrySelectData() {
        const countries = [];
        // const prior_countries = ['US', 'KR', 'JP', 'DE', 'FR', 'MT', 'CA', 'BY', 'NL', 'VN', 'SG'];
        let errMsg = 'error';
        // prior_countries.forEach(code => {
        //     const item = countryList.find(country => country.iso === code);
        //     if(item) {
        //         let phoneNumber;
        //         try {
        //             phoneNumber = getCountryCallingCode(item.iso);
        //             countries.push({...item, callCode: phoneNumber});
        //         } catch(err) {
        //             if (errMsg) errMsg = err;
        //         }
        //     }
        // });
        countryList.forEach(item => {
            let phoneNumber;
            try {
                phoneNumber = getCountryCallingCode(item.iso);
                countries.push({...item, callCode: phoneNumber});
            } catch(err) {
                if (errMsg) errMsg = err;
            }
        });
        this.setState({ countries });
    }

    getPrivateQR = async () => {
        if (this.state.isPublicKeyShowing) {
            const response = await axios.get(
                'https://qr.bct.trade/private_qr?words=02ceb48796223dc3777fe210a2034059b5e39b3743e59d62f75ef07a32f8440caf}',
                { 'Access-Control-Allow-Origin': '*' }
            );
            if (response) {
                return response.data;
            }
        }
        return this.state.privateKeyURL;
    }

    showPublicKey = async () => {
        const { isPublicKeyShowing } = this.state;
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        const prevPublicKeyShowing = isPublicKeyShowing;
        if(isLoggedIn) {
            if(!prevPublicKeyShowing) {
                this.setState(prevState => ({
                    isPublicKeyShowing: !prevPublicKeyShowing,
                    isPrivateKeyShowing: false,
                    prevAmount: prevState.amount,
                }));
            } else {
                this.setState(prevState => ({
                    isPublicKeyShowing: !prevPublicKeyShowing,
                    isPrivateKeyShowing: false,
                    amount: prevState.prevAmount,
                }));
            }
        }
    }

    checkPrivateKey = async () => {
        const { isPrivateKeyShowing } = this.state;
        if (!isPrivateKeyShowing) {
            this.setState({
                isPrivateKeyShowing: true,
            });
            const privateKey = await this.getPrivateQR();
            this.setState({
                privateKeyURL: privateKey,
            });
        }
    }

    claimTransferRequest = () => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                claimTransfer,
            },
            [STORE_KEYS.YOURACCOUNTSTORE] : {
                requestCoinsForWallet,
            },
            // isCoinTransfer
        } = this.props;
        const { amount, scannedUniqueId } = this.state;
        return claimTransfer(scannedUniqueId).then(res => {
            this.setState({
                isFirstLoad: false,
                afterClaimed: amount,
            });
            // if (isCoinTransfer) {
            //     this.setState({
            //         message: `You received ${amount}${currency.currencyCode} successfully. Now your ${currency.currencyCode} balance is ${currency.position + amount}.`,
            //         isFirstLoad: false,
            //         afterClaimed: amount,
            //     })
            // } else {
            //     this.setState({
            //         isFirstLoad: false,
            //         afterClaimed: amount,
            //     });
            // }
            requestCoinsForWallet();
            return res;
        }).catch(err => {
            return err;
        });
    }

    cancelTransferRequest = () => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestRejectTransferRequest,
            },
        } = this.props;
        const { scannedUniqueId } = this.state;
        return requestRejectTransferRequest(scannedUniqueId);
    }

    checkTransferDetailStatus = async (uniqueId) => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestDetailsPrivate,
            },
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        const privResponse = await requestDetailsPrivate(uniqueId);
        if(isLoggedIn && privResponse.IsOwner && privResponse.Status === 'claimed' && this._isMounted) {
            this.setState({ isCheckingClaimed: false });
            clearInterval(this._timer);
            this.toggleHistory();
            this.zoomQRCode(false);
        }
    }

    getTransferDetail = async (uniqueId) => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestDetailsPrivate,
                requestDetailsPublic,
            },
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            isCoinTransfer,
            getUniqueId,
        } = this.props;

        let response = null;
        const trId = getUniqueId();
        if(trId && trId === uniqueId) {
            response = await requestDetailsPublic(uniqueId);
            this._transactionTimer = setInterval(() => {
                if(this.props.PortfolioValue) {
                    const currency = this.props.currencies.find(item => item.currencyCode.toLowerCase() === (response.Coin === 'tusd' ? 'USD' : response.Coin).toLowerCase());

                    if(currency) {
                        clearInterval(this._transactionTimer);
                        this._timeout.push(setTimeout(() => this.setState({ isTransferLoaded: true }), 1000));
                        this.setState({
                            amount: Number(response.Amount),
                            repayAmount: Number(response.Amount),
                            currency,
                        });
                    }
                }
            }, 1000);
            return;
        }

        if (isLoggedIn) {
            response = await requestDetailsPrivate(uniqueId);
            this._transactionTimer = setInterval(() => {
                const currency = this.props.currencies.find(item => item.currencyCode.toLowerCase() === (response.Coin === 'tusd' ? 'USD' : response.Coin).toLowerCase());
                if(currency) {
                    clearInterval(this._transactionTimer);
                    this._timeout.push(setTimeout(() => this.setState({ isTransferLoaded: true }), 1000));
                    if (response.IsOwner) {
                        this.setState({
                            scannedUniqueId: uniqueId,
                            scannedAmount: Number(response.Amount),
                            amount: Number(response.Amount),
                            prevAmount: Number(response.Amount),
                            isSMSVerificationShowing: false,
                            isScanned: false,
                            smsPlaceHolder: currency.symbol + this.props.getFixedNumberString(response.Amount),
                            currency,
                        });
                    } else {
                        this.setState({
                            scannedUniqueId: uniqueId,
                            scannedAmount: Number(response.Amount),
                            amount: Number(response.Amount),
                            prevAmount: Number(response.Amount),
                            isSMSVerificationShowing: true,
                            isScanned: true,
                            scannedStatus: response.Status,
                            smsPlaceHolder: currency.symbol + this.props.getFixedNumberString(response.Amount),
                            currency,
                        });
                        if(response.Status !== 'pending') {
                            this._timeout.push(setTimeout(() => this.props.history.push('/'), 5000));
                        }
                    }    
                }
            }, 1000);
        } else {
            response = await requestDetailsPublic(uniqueId);
            this._transactionTimer = setInterval(() => {
                const currency = this.props.currencies.find(item => item.currencyCode.toLowerCase() === (response.Coin === 'tusd' ? 'USD' : response.Coin).toLowerCase());
                if(currency) {
                    clearInterval(this._transactionTimer);
                    this._timeout.push(setTimeout(() => this.setState({ isTransferLoaded: true }), 1000));
                    this.setState({
                        scannedUniqueId: uniqueId,
                        scannedAmount: Number(response.Amount),
                        amount: Number(response.Amount),
                        prevAmount: Number(response.Amount),
                        isSMSVerificationShowing: true,
                        isScanned: true,
                        scannedStatus: response.Status,
                        smsPlaceHolder: currency.symbol + this.props.getFixedNumberString(response.Amount),
                        currency,
                    });
                    if(response.Status !== 'pending') {
                        this._timeout.push(setTimeout(() => this.props.history.push('/'), 5000));
                    }
                }
            }, 1000);
        }

        if(isCoinTransfer) {
            const amount = Math.round(response.amount);
            if(amount <= 1) {
                document.title = `${this.props.getFixedNumberString(response.Amount)} Dollar ${window.location.hostname}`;
            } else {
                document.title = `${this.props.getFixedNumberString(response.Amount)} Dollars ${window.location.hostname}`;
            }
        }

        this._timeout.push(setTimeout(() => {
            this.setState({
                isBlurLoaded: true,
                isInitShowing: true
            });
        }, 2000));
    }

    claimTransfer = (uniqueId) => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                claimTransfer,
            },
        } = this.props;

        claimTransfer(uniqueId).then(() => {
        });
    }

    handlePayFormShowing = (value) => {
        this.setState({ isPayFormShowing: value });
    }

    handleBlurLoad = () => {
        if(!this.props.isCoinTransfer) {
            this._timeout.push(setTimeout(() => {
                this.setState({
                    isBlurLoaded: true,
                    isInitShowing: true
                });
            }, 2000));
        }
    }

    handleLoad() {
        const {
            [STORE_KEYS.VIEWMODESTORE]: { setIsLoaded },
        } = this.props;

        setIsLoaded();

        this._timeout.push(setTimeout(() => {
            this.setState({
                isLoadingShowing: false,
            });
        }, 1000));
    }

    zoomQRCode(zoomIn = false) {
        if (zoomIn) {
            document.getElementsByTagName('body')[0].classList.add('zoom');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('zoom');
        }
    }

    resetToHomePage = () => {
        this.setState({
            scannedUniqueId: '',
            amount: 0,
            prevAmount: 0,
            scannedAmount: 0,
            repayAmount: 0,
            fadeStatus: 'reset',
            verifyType: '',
            currency: {
                symbol: '$',
                currency: 'United States Dollar',
                currencyCode: 'USD',
                price: 1,
                type: 'country',
            },
        });
        if(this.props.isCoinTransfer) {
            this.props.history.push('/');
        } else {
            this._timeout.push(setTimeout(() => {
                this.setState({ fadeStatus: '' });
                this.componentDidMount();
            }, 1000));
        }
    }

    setFadeStatus = (status) => {
        const {
            // [STORE_KEYS.YOURACCOUNTSTORE] : {
            //     requestCoinsForWallet,
            // },
            removeUniqueId,
        } = this.props;
        this.setState({ isCheckingClaimed: false, fadeStatus: status });
        this.zoomQRCode(false);

        if(status === 'fade') {
            this.resetToHomePage();
        } else if (status === 'claiming') {
            if (this.state.isPayee === 0){
                this.setState({ isPayee: 1});
            }
            // requestCoinsForWallet();
            removeUniqueId();
        } else if (status === 'rejecting') {
            removeUniqueId();
        }

        if(this._fadeScreenTimer) clearTimeout(this._fadeScreenTimer);
        this._fadeScreenTimer = setTimeout(() => {
            if(this.state.fadeStatus === 'informing') {
                this.onFadeScreenClick();
            }
        }, 300000);
    }

    onFadeScreenClick = () => {
        this.setFadeStatus('fade');
    }

    getBillStyle = (value) => {
        const amount = Math.round(value);
        if(value < 10) return 'usd_1';
        if(amount < 100) return 'usd_10';
        if(amount < 1000) return 'usd_100';
        if(amount < 10000) return 'usd_1000';
        if(amount < 100000) return 'usd_10000';
        return 'usd_100000';
    }

    onWalletBack = () => {
        this.props.setWalletShowing(false);
    }

    setCurrency = (currency) => {
        this.setState({
            currency,
        });
    }

    setInitShowing = value => {
        this.setState({ isInitShowing: value });
    }

    responseFacebook = (response) => {
        const { updateUserInformation } = this.props;
        console.log('[FacebookResponse]', response);
        const parts = response.name.split(' ');
        const info = {
            FirstName: parts[0],
            LastName: parts.length > 1 ? parts[parts.length - 1] : '',
            Fullname: response.name,
            Username: response.name,
            PhotoUrl: response.picture.data.url,
        };
        updateUserInformation(info);
        this.props.history.push('/');
    }

    render() {
        const {
            isInitShowing,
            isFirstLoad,
            isLoadingShowing,
            isBlurLoaded,
            isHistoryShowing,
            isSMSVerificationShowing,
            isBalanceLoaded,
            isPayFormShowing,
            amount,
            logoutAmount,
            repayAmount,
            isScanned,
            scannedStatus,
            smsPlaceHolder,
            currencyHeadIndex,
            scannedUniqueId,
            scannedAmount,
            afterClaimed,
            verifyType,
            billHeight,
            spaceWidth,
            fadeStatus,
            countries,
            countryCode,
            defaultCurrencyCode,
            currency,
            isPayee,
            isTransferLoaded,
            coinAddress,
            // message,
        } = this.state;

        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioValue,
            },
            isCoinTransfer,
            isWalletShowing,
            isSidebarMenuOpen,
            isEmpty,
        } = this.props;

        const usdAmount = amount * currency.price;

        return (
            <Swipeable>
                <Wrapper
                    isVisible={isBlurLoaded && !isSidebarMenuOpen || isCoinTransfer}
                    isCoinTransfer={isCoinTransfer}
                    className={fadeStatus + (isPayee === 0 ? ' payee' : (isPayee === 1 ? ' payee-back' : ''))}
                >
                    {isHistoryShowing && (
                        <AppHistory
                            isCoinTransfer={isCoinTransfer}
                            onClose={this.toggleHistory}
                        />
                    )}
                    <BillWrapper>
                        <BackCurrencyContainer>
                            <BackCurrency src={USD_1} alt="1" isVisible={usdAmount < 10} />
                            <BackCurrency src={USD_10} alt="2" isVisible={usdAmount >= 10 && Math.round(usdAmount) < 100} />
                            <BackCurrency src={USD_100} alt="3" isVisible={Math.round(usdAmount) >= 100 && Math.round(usdAmount) < 1000} />
                            <BackCurrency src={USD_1000} alt="4" isVisible={Math.round(usdAmount) >= 1000 && Math.round(usdAmount) < 10000} />
                            <BackCurrency src={USD_10000} alt="5" isVisible={Math.round(usdAmount) >= 10000 && Math.round(usdAmount) < 100000} />
                            <BackCurrency src={USD_100000} alt="6" isVisible={Math.round(usdAmount) >= 100000} />
                            <BackCurrencyDataContainer>
                                <PaymentData
                                    isLoggedIn={isLoggedIn}
                                    isEmpty={isEmpty}
                                    amount={amount}
                                    totalValue={PortfolioValue}
                                    isScanned={isScanned}
                                    onClose={this.toggleHistory}
                                    billHeight={billHeight}
                                    currency={currency}
                                />
                                <CurrencyHead
                                    className={this.getBillStyle(usdAmount)}
                                />
                            </BackCurrencyDataContainer>
                        </BackCurrencyContainer>
                        {isSMSVerificationShowing && fadeStatus === '' && (
                            <PayQRWrapper>
                                <SMSVerificationForm
                                    claimTransfer={this.claimTransferRequest}
                                    cancelTransfer={this.cancelTransferRequest}
                                    verify={this.handleVerification}
                                    onBack={this.handleBack}
                                    setFadeStatus={this.setFadeStatus}
                                    setCoinAddress={this.setCoinAddress}
                                    resetToHomePage={this.resetToHomePage}
                                    placeholderText={isScanned ? smsPlaceHolder : null}
                                    scanned={isScanned ? 'scanned' : 'failed'}
                                    scannedStatus={scannedStatus}
                                    isLoggedIn={isLoggedIn}
                                    countries={countries}
                                    countryCode={countryCode}
                                    spaceWidth={spaceWidth}
                                />
                            </PayQRWrapper>
                        )}
                        {(!isScanned && (!isSMSVerificationShowing || verifyType === 'history')) && (
                            <QRWrapper currencyHeadIndex={currencyHeadIndex} isVisible={!isHistoryShowing && verifyType !== 'history'}>
                                <PayQRCodeV2InCurrency
                                    onQRImageClick={this.handleQRImageClick}
                                    onGetAmount={this.handleGetAmount}
                                    fiatPrice={(isLoggedIn && !isFirstLoad) ? logoutAmount : 0}
                                    onBack={this.handleQRBack}
                                    onHistory={this.toggleHistory}
                                    onSaveUniqueAddress={this.handleSaveUniqueAddress}
                                    setFadeStatus={this.setFadeStatus}
                                    fadeStatus={fadeStatus}
                                    zoomQRCode={this.zoomQRCode}
                                    resetToHomePage={this.resetToHomePage}
                                    setCurrency={this.setCurrency}
                                    amount={amount}
                                    prevAmount={this.state.prevAmount}
                                    repayAmount={repayAmount}
                                    balance={PortfolioValue}
                                    uniqueId={scannedUniqueId}
                                    scannedAmount={scannedAmount}
                                    afterClaimed={afterClaimed}
                                    billHeight={billHeight}
                                    setPrevAmount={this.handlePrevAmount}
                                    defaultCurrencyCode={defaultCurrencyCode}
                                    isPayFormShowing={isPayFormShowing}
                                    changePayFormShowing={this.handlePayFormShowing}
                                    isCoinTransfer={isCoinTransfer}
                                    spaceWidth={spaceWidth}
                                    currency={currency}
                                    verifyType={verifyType}
                                    isInitShowing={isInitShowing}
                                    setInitShowing={this.setInitShowing}
                                />
                            </QRWrapper>
                        )}
                    </BillWrapper>
                </Wrapper>

                <div style={{ display: 'none' }}>
                    <FacebookLogin
                        appId="288404425009300"
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                    />
                </div>

                {isWalletShowing && (
                    <Wallet
                        onBack={this.onWalletBack}
                        billHeight={billHeight}
                        coinAddress={coinAddress}
                    />
                )}

                {!isCoinTransfer && <LoadingWrapper isVisible={(isLoadingShowing || !isBlurLoaded || !isTransferLoaded || (isLoggedIn && !isBalanceLoaded))}>
                    <LoadingBill src={LoadingImg} onLoad={this.handleBlurLoad} alt="" />
                </LoadingWrapper>}

                {fadeStatus !== ''  && fadeStatus !== 'reset' && (
                    <FadeScreen
                        isCoinTransfer={isCoinTransfer}
                        fadeStatus={fadeStatus}
                        currency={currency}
                        amount={amount}
                        onFadeScreenClick={this.onFadeScreenClick}
                    />
                )}
            </Swipeable>
        );
    }
}

export default compose(
    withSafeTimeout,
    withSafeInterval,
    withRouter,
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.MODALSTORE,
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.PAYAPPSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.COINADDRESSSTORE,
        STORE_KEYS.SETTINGSSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    PortfolioData,
                    requestPosition,
                    requestCoinsForWallet,
                    PortfolioValue,
                    updateUserInformation,
                    getUserInformation,
                    isPositionLoaded,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    setWalletShowing,
                    isWalletShowing,
                    setUniqueId,
                    getUniqueId,
                    removeUniqueId,
                    getFixedNumberString,
                },
                [STORE_KEYS.SENDCOINSTORE]: {
                    isEmpty,
                    promotionTransferRequest,
                    requestTransferHistory,
                },
                [STORE_KEYS.SMSAUTHSTORE]: {
                    isLoggedIn,
                },
                [STORE_KEYS.COINADDRESSSTORE]: {
                    createDepositAddress,
                },
                [STORE_KEYS.SETTINGSSTORE]: {
                    currencies,
                },
            }
        ) => ({
            isEmpty,
            isLoggedIn,
            isWalletShowing,
            setWalletShowing,
            PortfolioData,
            requestPosition,
            PortfolioValue,
            setUniqueId,
            getUniqueId,
            removeUniqueId,
            requestCoinsForWallet,
            requestTransferHistory,
            createDepositAddress,
            promotionTransferRequest,
            currencies,
            getFixedNumberString,
            updateUserInformation,
            getUserInformation,
            isPositionLoaded,
        })
    )
)(CryptoApp);
