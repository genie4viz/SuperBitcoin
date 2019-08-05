import { observable, action } from 'mobx';

export const contentModeKeys = {
    numPadModeKey: 'num-pad',
    qrScanModeKey: 'qr-scan',
    qrScannerModeKey: 'qr-scanner',
    qrScanReceiveModeKey: 'qr-receive',
    historyModeKey: 'history-view',
    depositModeKey: 'deposit-view',
};

export const claimModeKeys = {
    initialModeKey: 'init-mode',
    loadingModeKey: 'loading-mode',
    doneModeKey: 'done-mode',
};

class PayWindowStore {
    @observable contentViewMode = '';
    @observable sentAmount = 0;
    @observable sentCoin = '';
    @observable qrObj = null;
    @observable claimNotify = null;

    GetClaimedTransferNotification$ = null;
    __subscriptionInited = false;

    handleIncomingClaimedNotificationTimeout = null;

    constructor() {
        this.contentViewMode = contentModeKeys.numPadModeKey;
        // this.GetClaimedTransferNotification$ = GetClaimedTransferNotification({ throttleMs });
        // if (!this.__subscriptionInited) {
        //     this.GetClaimedTransferNotification$.subscribe({ next: this.handleIncomingClaimedNotification.bind(this) });
        //     this.__subscriptionInited = true;
        // }
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

    @action.bound switchContentView(mode) {
        this.contentViewMode = mode;
    }

    @action.bound openQRScan(coin, amount) {
        this.sentAmount = amount;
        this.sentCoin = coin;
        this.switchContentView(contentModeKeys.qrScanModeKey);
    }

    @action.bound setQrObject(qObj) {
        this.qrObj = qObj;
    }

    @action.bound setClaimNotify(mode) {
        this.claimNotify = mode;
    }
}

export default () => {
    const store = new PayWindowStore();
    return store;
};
