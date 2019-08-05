import React from "react";
import { observable, reaction, action } from 'mobx';
import { customDigitFormat } from '@/utils';
import { graphViewModeKeys } from '@/stores/ViewModeStore';

export const arbStateKeys = {
    ARB_NONE: 'none',
    ARB_LOAD: 'loading',
    ARB_PLAN: 'plan',
    ARB_EXEC: 'execute',
    ARB_RUN: 'run',
    ARB_SETT: 'settle',
    ARB_DONE: 'done',
};

class ArbitrageMockStore {
    @observable arbState;
    @observable hStep1 = 0;
    @observable hStep2 = 0;
    @observable hStep3 = 0;
    @observable hStep4 = 0;
    @observable OrderHistoryData = [];
    @observable storedPortfolios = [];
    @observable activeCoin = '';
    @observable activeQuote = '';
    @observable activeCoinETHRate = 1;
    @observable isBuying;
    @observable isSelling;
    @observable increaseRate = 1.00001;
    @observable fixedValueRate = 1;
    @observable rate = 1;
    @observable c2Rate = 1;
    @observable portPriceGraphViewMode = graphViewModeKeys.valueMode;
    @observable isHoverPortfolio = false;
    @observable lastBalance = 0;

    arbMode = false;
    snackbar = null;
    snackbarStoreRef = null;
    accountStoreRef = null;
    fiatCurrencyStoreRef = null;
    baseCurrency = '';
    countries = [];

    isNumberModeInitialized = false;
    lockedValue = 0;
    handleStopArb = false;

    constructor(viewModeStore, snackbar, yourAccountStore, instrumentStore, orderBookBreakDownStore, fiatCurrencyStore) {
        this.snackbar = snackbar.Snackbar;
        this.snackbarStoreRef = snackbar;
        this.accountStoreRef = yourAccountStore;
        this.fiatCurrencyStoreRef = fiatCurrencyStore;

        reaction(
            () => ({
                arbMode: viewModeStore.arbMode,
            }),
            (arbObj) => {
                this.arbMode = arbObj.arbMode;
                if (this.arbMode) {
                    this.snackbarStoreRef.setRightMode(true);
                } else {
                    this.snackbarStoreRef.setRightMode(false);
                }

                this.handleStopArb = true;
                this.initMode();
                setTimeout(() => {
                    this.resetBalance();
                    this.setArbState(arbStateKeys.ARB_SETT);
                    this.lockedValue = 0;
                    this.isNumberModeInitialized = false;
                    this.handleStopArb = false;
                    this.start();
                }, 3000);
            }
        );

        reaction(
            () => ({
                MidAvgPrice: orderBookBreakDownStore.MidAvgPrice,
            }),
            (priceObj) => {
                this.rate = priceObj.MidAvgPrice;
                // exception for USDT->BTC
                if (!this.arbMode && this.activeCoin === 'USDT' && this.activeQuote === 'BTC') {
                    this.rate = 1 / priceObj.MidAvgPrice;
                }
            }
        );

        this.baseCurrency = 'BTC';
        this.totalInitBalance = 10.647260860780053;
        this.lastBalance = this.totalInitBalance;
        this.storedPortfolios.push({ x: new Date().getTime(), y: this.totalInitBalance });
        
        instrumentStore.instrumentsReaction(() => {
            /**
             *  Lock default arb mode as F:USD->BTC
             */
            this.activeCoin = 'F:USD';
            this.activeQuote = 'BTC';

            if (this.activeCoin === 'ETH') {
                this.portPriceGraphViewMode = graphViewModeKeys.unfixedMode;
            } else {
                this.portPriceGraphViewMode = graphViewModeKeys.valueMode;
            }
            this.handleStopArb = true;
            this.initMode();
            setTimeout(() => {
                this.resetBalance();
                this.setArbState(arbStateKeys.ARB_SETT);
                this.lockedValue = 0;
                this.isNumberModeInitialized = false;
                this.handleStopArb = false;
                this.start();
            }, 3000);
            this.refreshActivePrice();
        }, true);

        this.resetBalance();

        this.isBuying = false;
        this.isSelling = false;
    }

    start = async() => {
        if (this.handleStopArb) return;
        this.setArbState(arbStateKeys.ARB_SETT);
        await this.waitFor(3000);
        if (this.arbMode) {
            this.getC1C2Price();
        }

        const length = this.storedPortfolios.length;
        if (length > 0 && !this.handleStopArb) {
            if (this.rate !== 1) {
                this.lastBalance = this.storedPortfolios[length - 1].y;
                switch (this.portPriceGraphViewMode) {
                    case graphViewModeKeys.valueMode:
                        this.hStep1 = Number(this.lastBalance);
                        if (!this.isNumberModeInitialized) {
                            this.isNumberModeInitialized = true;
                            this.lockedValue = Number(this.hStep1 * (1 / this.rate));
                        }
                        this.hStep2 = this.lockedValue;
                        this.hStep3 = this.lockedValue;
                        this.hStep4 = this.hStep3 * this.rate;
                        break;
                    case graphViewModeKeys.numberMode:
                        this.hStep1 = Number(this.lastBalance);
                        this.hStep2 = Number(this.hStep1 * (1 / this.rate));
                        this.hStep3 = this.hStep2;
                        this.hStep4 = this.hStep1;
                        this.isNumberModeInitialized = false;
                        break;
                    case graphViewModeKeys.unfixedMode:
                        this.hStep1 = Number(this.lastBalance);
                        this.hStep2 = Number(this.hStep1 * (1 / this.rate));
                        this.hStep3 = this.hStep2;
                        this.hStep4 = this.hStep1 * 1.00001;
                        this.isNumberModeInitialized = false;
                        break;
                    default:
                        break;
                }
                this.storedPortfolios.push({ x: new Date().getTime(), y: this.hStep4 });
                this.lastBalance = this.hStep4;
                this.OrderHistoryData.unshift({
                    timeUnFormatted: new Date().toISOString(),
                    sourceFilled: this.hStep2,
                    sourceTotal: this.hStep1,
                    advancedMode: true,
                });
                this.OrderHistoryData.unshift({
                    timeUnFormatted: new Date((new Date()).getTime() + (1000 * 60)).toISOString(),
                    sourceFilled: this.hStep3,
                    sourceTotal: this.hStep4,
                    advancedMode: false,
                });
                if (!this.arbMode) {
                    this.start();
                    return;
                }
                this.showTradeState(this.hStep1, this.hStep2);
                this.setArbState(arbStateKeys.ARB_LOAD);
                await this.waitFor(3000);

                if (this.arbState !== arbStateKeys.ARB_SETT) {
                    this.showTradeStep('Plan Step');
                    this.setArbState(arbStateKeys.ARB_PLAN);
                    await this.waitFor(3000);
                }
                if (this.arbState !== arbStateKeys.ARB_SETT) {
                    this.setArbState(arbStateKeys.ARB_EXEC);
                    await this.waitFor(3000);
                }
                if (this.arbState !== arbStateKeys.ARB_SETT) {
                    this.showTradeStep('Execution Step');
                    this.setArbState(arbStateKeys.ARB_RUN);
                    await this.waitFor(3000);
                    this.isBuying = false;
                    this.isSelling = false;
                }
            }
            this.start();
        }
    };

    refreshActivePrice = () => {
        this.fiatCurrencyStoreRef.getSpotRate('ETH', this.activeCoin)
            .then(activeCoinETHRate => {
                this.activeCoinETHRate = activeCoinETHRate;
            })
            .catch(e => {
                console.log(e);
            });
    };

    getC1C2Price = () => {
        this.fiatCurrencyStoreRef.getSpotRate(this.baseCurrency, this.activeCoin)
            .then(c2Rate => {
                this.c2Rate = c2Rate;
            })
            .catch(e => {
                console.log(e);
            });
    };

    resetBalance = () => {
        this.storedPortfolios = [];
        this.storedPortfolios.push({ x: new Date().getTime(), y: this.totalInitBalance });
    };

    initMode = () => {
        this.hStep1 = 0;
        this.hStep2 = 0;
        this.hStep3 = 0;
        this.hStep4 = 0;
        this.OrderHistoryData = [];
    };

    @action.bound showTradeState(amount1, amount2) {
        if (!this.arbMode) return;
        const activeC = (this.activeCoin || '').replace('F:', '');
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>Arbitrage Order Submitted!</b></span> <br /><br />
                    <span><b>Side:</b> {`${this.baseCurrency}-${activeC}`}</span> <br />
                    <span><b>Amount:</b> {customDigitFormat(this.hStep1)} {activeC}</span> <br />
                    <span><b>Balance of {this.baseCurrency}:</b> {customDigitFormat(amount1)} {this.baseCurrency}</span> <br />
                    <span><b>Balance of {activeC}:</b> {customDigitFormat(amount2)} {activeC}</span>
                </React.Fragment>
            ),
        });
    }

    @action.bound showTradeStep(msg) {
        if (!this.arbMode) return;
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

    @action.bound setActiveCoin(coin) {
        this.activeCoin = coin;        
        this.fiatCurrencyStoreRef.getSpotRate(this.activeCoin, 'ETH')
            .then(activeCoinETHRate => {
                this.activeCoinETHRate = 1 / activeCoinETHRate;
            })
            .catch(e => {
                console.log(e);
            });
    }

    @action.bound setHoverPortfolio(mode) {
        this.isHoverPortfolio = mode;
    }

    waitFor = (delay) => {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, delay);
        });
    };
}

export default (viewModeStore, snackbar, yourAccountStore, instrumentStore, orderBookBreakDownStore, fiatCurrencyStore, donutMockStore) => new ArbitrageMockStore(viewModeStore, snackbar, yourAccountStore, instrumentStore, orderBookBreakDownStore, fiatCurrencyStore, donutMockStore);
