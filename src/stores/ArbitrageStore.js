import React from "react";
import uuidv4 from "uuid/v4";
import { observable, reaction, action } from 'mobx';
import {
    BalanceRequest, SendOrderTicket, HistoryRequest, ExecPlanRequest, OrderStopExecutionPlan, GetExecPlans, PositionRequest
} from '@/lib/bct-ws';
import {customDigitFormat, getScreenInfo} from "@/utils";

export const arbStateKeys = {
    ARB_NONE: 'none',
    ARB_LOAD: 'loading',
    ARB_PLAN: 'plan',
    ARB_EXEC: 'execute',
    ARB_RUN: 'run',
    ARB_SETT: 'settle',
    ARB_DONE: 'done',
};
const throttleMs = 100;

class ArbitrageStore {
    @observable arbState;
    @observable transactionDir = false;
    @observable symbol = '';
    @observable size = 0;
    @observable hStep1 = 0;
    @observable hStep2 = 0;
    @observable hStep3 = 0;
    @observable hStep4 = 0;

    authClientId = '';
    arbMode = false;

    limitLower = 0.0001;
    increaseRate = 1.00001;
    balanceOfETH = 0;
    balanceOfBTC = 0;
    isFirstLoad = true;

    ExecPlans$ = null;
    __subscriptionInited = false;
    averagePrice = 0;
    totalPrice = 0;

    hdRestoreArb = null;
    isMobileDevice = false;
    snackbar = null;
    snackbarStoreRef = null;

    constructor(networkStore, viewModeStore, snackbar) {
        // window['ARB'] = this; //DEBUG

        this.snackbar = snackbar.Snackbar;
        this.snackbarStoreRef = snackbar;

        // Invoked when the user connects or disconnects
        reaction(
            () => ({
                isPrivateConnected: networkStore.isPrivateConnected,
            }),
            ({isPrivateConnected}) => {
                // The user's network connection disconnected
                if (!isPrivateConnected) return;

                // The user has a network connection, attempt to begin arbitrage
                this.authClientId = localStorage.getItem('authClientId') || '';
                this.start();
            }
        );

        reaction(
            () => ({
                arbMode: viewModeStore.arbMode,
            }),
            (arbObj) => {
                this.arbMode = arbObj.arbMode;
                if (this.arbMode) {
                    this.authClientId = localStorage.getItem('authClientId') || '';
                    HistoryRequest(this.authClientId);
                    this.snackbarStoreRef.setRightMode(true);
                    this.start();
                } else {
                    this.snackbarStoreRef.setRightMode(false);
                }
            }
        );

        this.ExecPlans$ = GetExecPlans({
            throttleMs,
        });
        if (!this.__subscriptionInited) {
            this.ExecPlans$.subscribe({ next: this.handleIncomingExecPlanFrames.bind(this) });

            this.__subscriptionInited = true;
        }

        this.setArbState(arbStateKeys.ARB_SETT);
        this.authClientId = localStorage.getItem('authClientId') || '';
        this.isMobileDevice = getScreenInfo().isMobileDevice;
    }

    restoreArb() {
        clearTimeout(this.hdRestoreArb);
        this.hdRestoreArb = setTimeout(this.start, 10000);
    }

    start = () => {
        if (!this.arbMode) return;
        if (this.isFirstLoad) {
            this.initialPlanMode();
            PositionRequest(this.authClientId);
            HistoryRequest(this.authClientId);
        }

        BalanceRequest(this.authClientId).then(data => {
            this.processTransaction(data);
        }).catch(e => {
            console.log('[BalanceRequest Failed]', e);
            this.restoreArb();
        });
    };

    processTransaction = async(position) => {
        this.balanceOfBTC = 0;
        this.balanceOfETH = 0;
        let amountUsdOfBTC = 0;
        let amountUsdOfETH = 0;

        for (let i = 0; i < position.length; i++) {
            if (position[i] && position[i].Coin === 'BTC') {
                this.balanceOfBTC = Number(position[i].Position);
                amountUsdOfBTC = Number(position[i].AmountUsd);
            }
            if (position[i] && position[i].Coin === 'ETH') {
                this.balanceOfETH = Number(position[i].Position);
                amountUsdOfETH = Number(position[i].AmountUsd);
            }
        }
        if (amountUsdOfBTC === 0 && amountUsdOfETH === 0) {
            this.showTradeStep('No ETH or BTC balance');
            // this.restoreArb();
        } else {
            // if ((amountUsdOfBTC >= amountUsdOfETH && this.symbol === 'BTC-ETH')
            //     || (amountUsdOfBTC < amountUsdOfETH && this.symbol === 'ETH-BTC')) {
            //     return;
            // }

            if (amountUsdOfBTC >= amountUsdOfETH) {
                this.transactionDir = false;
                this.symbol = 'BTC-ETH';
                this.size = this.balanceOfBTC;
            } else {
                this.transactionDir = true;
                this.symbol = 'ETH-BTC';
                this.size = this.balanceOfETH;
            }

            if(!this.transactionDir) {
                this.showTradeStep('Settlement Step');
                this.setArbState(arbStateKeys.ARB_SETT);

                HistoryRequest(this.authClientId).then(() => {
                    this.processPlanMode();
                });
            } else {
                this.showTradeState();
                SendOrderTicket(this.authClientId, 'market', 0, 'simple', 'Aggregated', 'Sell', this.size, this.symbol, '')
                    .then(() => {
                        if (this.isFirstLoad) {
                            this.restoreArb();
                        } else {
                            this.showTransaction();
                        }
                    })
                    .catch(() => {
                        this.restoreArb();
                    });
            }
        }
    };

    resetEstimation = () => {
        this.hStep1 = this.size;
        this.hStep2 = this.totalPrice;
        this.hStep3 = this.totalPrice;
        this.hStep4 = this.size * this.increaseRate;
    };

    processPlanMode = async() => {
        this.stopExecPlan();
        const uuid = uuidv4();
        localStorage.setItem('ExecPlanId', uuid);
        ExecPlanRequest({
            ExecPlanId: uuid,
            Symbol: 'BTC-ETH',
            Side: 'Sell',
            Size: this.size,
        })
            .then(() => {
                this.processHistoryMode();
            })
            .catch(() => {
                this.restoreArb();
            });
    };

    processHistoryMode = async() => {
        this.resetEstimation();

        this.isFirstLoad = false;
        this.showTradeState();
        SendOrderTicket(this.authClientId, 'market', 0, 'simple', 'Aggregated', 'Sell', this.size, this.symbol, '')
            .then(() => {
                this.restoreArb();
            })
            .catch(() => {
                this.restoreArb();
            });
    };

    showTransaction = async() => {
        this.setArbState(arbStateKeys.ARB_LOAD);
        await this.waitFor(6000);

        this.showTradeStep('Plan Step');
        this.setArbState(arbStateKeys.ARB_PLAN);
        await this.waitFor(5000);

        this.setArbState(arbStateKeys.ARB_EXEC);
        await this.waitFor(5000);

        this.showTradeStep('Execution Step');
        this.setArbState(arbStateKeys.ARB_RUN);
        await this.waitFor(2500);

        this.start();
    };

    waitFor = (delay) => {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, delay);
        });
    };

    stopExecPlan = () => {
        const oldExecPlanId = localStorage.getItem('ExecPlanId');
        if (oldExecPlanId) {
            OrderStopExecutionPlan({
                ExecPlanId: oldExecPlanId,
            });
        }
    };

    handleIncomingExecPlanFrames(data) {
        if (this.symbol === 'BTC-ETH') {
            const details = data.Details;
            this.averagePrice = details ? Number(details.ConversionCoef) : 0;
            this.totalPrice = details ? Number(details.Total) : 0;
            this.resetEstimation();
        }
    };

    initialPlanMode = async() => {
        this.stopExecPlan();
        const uuid = uuidv4();
        localStorage.setItem('ExecPlanId', uuid);
        ExecPlanRequest({
            ExecPlanId: uuid,
            Symbol: 'BTC-ETH',
            Side: 'Sell',
            Size: 1,
        });
    };

    @action.bound showTradeState() {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>Arbitrage Order Submitted!</b></span> <br /><br />
                    <span><b>Side:</b> {this.symbol}</span> <br />
                    <span><b>Amount:</b> {customDigitFormat(this.size)} {this.symbol.split('-')[0]}</span> <br />
                    <span><b>Balance of BTC:</b> {customDigitFormat(this.balanceOfBTC)} BTC</span> <br />
                    <span><b>Balance of ETH:</b> {customDigitFormat(this.balanceOfETH)} ETH</span>
                </React.Fragment>
            ),
        });
    }

    @action.bound showTradeStep(msg) {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
        });
    }

    @action.bound setArbState(newArbState) {
        this.arbState = newArbState;
    }
}

export default (networkStore, viewModeStore, snackbar) => new ArbitrageStore(networkStore, viewModeStore, snackbar);
