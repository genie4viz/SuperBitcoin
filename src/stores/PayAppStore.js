import { observable, action } from 'mobx';
import axios from 'axios';

import { GetClaimedTransferNotification } from '../lib/bct-ws';
import { REACT_APP_PUBLIC_QR_CODE_URL, REACT_APP_PRIVATE_QR_CODE_URL } from '../config/constants';

const throttleMs = 100;

export const payViewModeKeys = {
    payHistoryModeKey: 'pay-history-view', // tab 1
    payCalcModeKey: 'pay-calc-view', // tab 2
    payChooseModeKey: 'pay-currency-choose', // tab 3
    payScanModeKey: 'pay-scan-view', // tab 4
    payQRCodeModeKey: 'pay-qrcode-view',
    payScanConfirmModeKey: 'pay-scan-confirm-view',
};

export const claimModeKeys = {
    initialModeKey: 'init-mode',
    loadingModeKey: 'loading-mode',
    doneModeKey: 'done-mode',
};

class PayAppStore {
    @observable payViewMode = '';
    @observable qrObj = null;
    @observable claimNotify = null;
    @observable payAmount = 0;
    @observable backMode = false;
    @observable uniqueId = '';
    @observable payRepeatCount = 0;
    @observable isWalletShowing = false;
    @observable payDomainName = '75.is';
    @observable balance = 0;

    GetClaimedTransferNotification$ = null;
    __subscriptionInited = false;

    handleIncomingClaimedNotificationTimeout = null;

    constructor() {
        this.payViewMode = payViewModeKeys.payChooseModeKey;
        this.GetClaimedTransferNotification$ = GetClaimedTransferNotification({ throttleMs });
        if (!this.__subscriptionInited) {
            this.GetClaimedTransferNotification$.subscribe({ next: this.handleIncomingClaimedNotification.bind(this) });
            this.__subscriptionInited = true;
        }
        this.claimNotify = claimModeKeys.initialModeKey;
    }

    handleIncomingClaimedNotification(data) {
        // Amount: "0.080911456624898860"
        // Coin: "btc"
        // Executor: {FullName: null}
        // TrId: "c2c734b80f7a46e3903b0f69d208d6032a7556823f9c4d1cb9cc514bd0ecd56af34046ae595045bfb4d211140e3cca21"
        if (data && data.TrId) {
            this.claimNotify = claimModeKeys.loadingModeKey;
            setTimeout(() => {
                this.claimNotify = claimModeKeys.doneModeKey;
            }, 10000);
        }
    }

    @action.bound setWalletShowing(mode) {
        this.isWalletShowing = mode;
    }

    @action.bound switchAppContentView(mode) {
        this.payViewMode = mode;
    }

    @action.bound setQrObject(qObj) {
        this.qrObj = qObj;
    }

    @action.bound setClaimNotify(mode) {
        this.claimNotify = mode;
    }

    @action.bound setPayAmount(amt, backMode) {
        this.payAmount = amt;
        this.backMode = backMode;
    }

    @action.bound setUniqueId(id) {
        this.uniqueId = id;
        localStorage.setItem('uniqueId', id);
    }

    @action.bound getUniqueId() {
        return localStorage.getItem('uniqueId');
    }

    @action.bound removeUniqueId() {
        localStorage.removeItem('uniqueId');
        localStorage.removeItem('payRepeatCount');
    }

    @action.bound setPayRepeatCount(count) {
        localStorage.setItem('payRepeatCount', count);
    }

    @action.bound getPayRepeatCount() {
        const count = localStorage.getItem('payRepeatCount');
        return (count ? Number(count) : 0);
    }

    @action.bound loadQRCodeUrl(content, isPublic = true) {
        return axios.get(
            `${isPublic ? REACT_APP_PUBLIC_QR_CODE_URL : REACT_APP_PRIVATE_QR_CODE_URL}${encodeURIComponent(content)}`,
            { 'Access-Control-Allow-Origin': '*' }
        ).then(res => {
            return res.data;
        });
    }

    @action.bound getFixedNumberString(value, isRemoveAll = false) {
        const str = Number(value).toFixed(9).split('.');
        const res = str[1].split('');
        let index = 8;
        for(; (index > 1 || (index >= 0 && isRemoveAll)) && res[index] === '0'; index--);
        if(index === -1) return Number(str[0]).toLocaleString();
        return `${Number(str[0]).toLocaleString()}.${str[1].substring(0, index + 1)}`;
    }

    @action.bound setBalance(value) {
        this.balance = value;
    }
}

export default () => {
    const store = new PayAppStore();
    return store;
};
