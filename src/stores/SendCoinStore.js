
/* eslint no-param-reassign: 0 */
import React from 'react';
import { observable, action } from 'mobx';
import {
    InitTransferRequest,
    TransferNotification,
    TransferInfoDetailedRequest,
    TransferInfoRequest,
    ClaimTransfer,
    TransferHistoryRequest,
    CancelTransferRequest,
    RejectTransferRequest,
    PromotionTransferRequest,
} from '../lib/bct-ws';

class SendCoinStore {
    @observable uniqueAddress = '';
    @observable historyCurrency = 'tusd';
    @observable transferHistory = [];
    @observable isFetchingTransferHistory = false;
    @observable isEmpty = null;

    constructor(snackBar) {
        this.snackBar = snackBar;
    }

    @action.bound initTransferRequest(coin, amount, currency) {
        this.uniqueAddress = '';
        return new Promise(resolve => {
            InitTransferRequest(coin, amount, currency).then(res => {
                console.log(res);
                this.uniqueAddress = res.Status.TrId || '';
                resolve(res.Status.TrId || '');
            }).catch(err => console.log(err));
        });
    }

    @action.bound promotionTransferRequest(type) {
        return new Promise((resolve, reject) => {
            PromotionTransferRequest(type).then(res => {
                this.requestTransferHistory();
                if (res.Status.IsSuccess === false) reject(res);
                resolve(res.Status.TrId);
            }).catch(err => console.log(err));
        });
    }

    @action.bound transferNotification() {
        return new Promise(resolve => {
            TransferNotification().then(res => {
                console.log(res);
                resolve(res);
            });
        });
    }

    @action.bound requestDetailsPrivate(uniqueId) {
        return new Promise((resolve, reject) => {
            TransferInfoDetailedRequest(uniqueId).then(res => {
                const trInfo = res.transferInfo;
                if (res.Status.IsSuccess === false) reject(res);

                resolve({
                    Coin: trInfo.Coin || '',
                    Amount: trInfo.Amount || '',
                    DefaultCurrency: trInfo.DefaultCurrency || '',
                    FullName: trInfo.FullName || '',
                    Status: trInfo.Status || '',
                    IsOwner: trInfo.IsOwner,
                });
            });
        });
    }

    @action.bound requestDetailsPublic(uniqueId) {
        return new Promise((resolve, reject) => {
            TransferInfoRequest(uniqueId).then(res => {
                const trInfo = res.transferInfo;
                if (res.Status.IsSuccess === false) reject(res);

                resolve({
                    Coin: trInfo.Coin || '',
                    Amount: trInfo.Amount || '',
                    DefaultCurrency: trInfo.DefaultCurrency || '',
                    FullName: trInfo.FullName || '',
                    Status: trInfo.Status || '',
                });
            });
        });
    }

    @action.bound claimTransfer(uniqueId) {
        return new Promise((resolve, reject) => {
            if (uniqueId !== '') {
                ClaimTransfer(uniqueId)
                    .then(res => {
                        this.requestTransferHistory('tusd');
                        resolve(res);
                    });
            } else {
                reject(new Error('uniqueId is empty'));
            }
        });
    }

    @action.bound requestTransferHistory() {
        this.isFetchingTransferHistory = true;

        const payload = {
            CurrencyId: 'TUSD',
        };

        return TransferHistoryRequest(payload)
            .then(res => {
                this.isFetchingTransferHistory = false;
                if(res.Status.IsSuccess === true) {
                    try {
                        // res.UserTransfers.sort(function compare(a, b) {
                        //     const dateA = new Date(a.CreatedAt).getTime();
                        //     const dateB = new Date(b.CreatedAt).getTime();
                        //     return dateB - dateA;
                        // });
                        this.transferHistory = res.UserTransfers.filter(item => item.Status !== 'expired');
                        this.transferHistory = this.transferHistory.map(item => {
                            if (item.TrType === 'promo-New') item.Status = 'Promo';
                            return item;
                        })
                        this.isEmpty = this.transferHistory.length === 0;
                        return Promise.resolve(this.transferHistory);
                    } catch (e) {
                        return Promise.resolve([]);
                    }
                }
            })
            .catch(e => {
                this.isFetchingTransferHistory = false;
                this.transferHistory = [];

                return Promise.reject(e);
            });
    }

    @action.bound showCoinSendState(msg) {
        this.snackBar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
        });
    }

    @action.bound requestCancelTransferRequest(uniqueId) {
        return CancelTransferRequest(uniqueId)
            .then(res => {
                if (res && res.IsSuccess === true) {
                    this.showCoinSendState('Successfully canceled payment');
                    this.requestTransferHistory();
                } else {
                    this.showCoinSendState('Payment cancellation is failed');
                }
                this.requestTransferHistory();
                return {
                    success: res && res.Success,
                };
            });
    }

    @action.bound requestRejectTransferRequest(uniqueId) {
        return RejectTransferRequest(uniqueId)
            .then(res => {
                if (res && res.IsSuccess === true) {
                    this.showCoinSendState('Successfully canceled payment');
                    this.requestTransferHistory();
                } else {
                    this.showCoinSendState('Payment cancellation is failed');
                }
                this.requestTransferHistory();
                return {
                    success: res && res.Status === 'success',
                };
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export default (snackBar) => {
    const store = new SendCoinStore(snackBar);
    return store;
};
