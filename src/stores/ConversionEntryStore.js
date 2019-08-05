import React from "react";
import {observable, action, computed, reaction} from 'mobx';

import { BUY_SIDE, SELL_SIDE, ClientId } from "@/config/constants";
import { ConversionRequest, PositionRequest } from "@/lib/bct-ws";

class ConvertEntryForm {
    @observable Amount = 0;
    @observable Total = 0;
    @observable baseSymbol = '';
    @observable quoteSymbol = '';
    @observable sliderMax = 0;
    side = null;
    snackbar = null;
    stockMode = false;

    constructor(side, snackbar) {
        this.side = side;
        this.snackbar = snackbar;
    }

    @action.bound setSliderMax(amount = 0) {
        this.sliderMax = amount;
    }

    @action.bound setAmount(amount = 0) {
        this.Amount = amount;
    }

    @action.bound setTotal(total) {
        this.Total = total;
    }

    @action.bound reset() {
        this.Amount = 0;
        this.Total = 0;
    }
    
    @action.bound setStockMode(sMode) {
        this.stockMode = sMode;
    }

    @computed get amount() {
        return this.Amount;
    }

    @computed get total() {
        return this.Total;
    }

    setSymbolPair(baseSymbol, quoteSymbol) {
        this.baseSymbol = baseSymbol;
        this.quoteSymbol = quoteSymbol;
    }

    @action.bound __submitProgressStart() {
        this.submitInProgress = true;
    }

    @action.bound __submitProgressStop() {
        this.submitInProgress = false;
    }

    @action.bound submitOrder() {
        this.__submitProgressStart();
        
        const size = this.side === BUY_SIDE ? this.Total : this.Amount;
        let quote = this.side === BUY_SIDE ? this.quoteSymbol : this.baseSymbol;
        let base = this.side === BUY_SIDE ? this.baseSymbol : this.quoteSymbol;
        if (this.stockMode) {
            quote = (quote || '').replace('F:', 'S:');
            base = (base || '').replace('F:', 'S:');
        }
        this.showTradeState(size, quote, base, this.side);        
        ConversionRequest(size, quote, base)
            .then(data => {
                this.__submitProgressStop();
                try {
                    const Message = data.Status.Message;
                    const isSuccess = data.Status.IsSuccess;
                    if (isSuccess) {
                        const ConversionInfo = data.ConversionInfo;
                        const Amount = ConversionInfo.Amount;
                        const StartCoin = ConversionInfo.StartCoin;
                        const EndCoin = ConversionInfo.EndCoin;
                        const Rate = ConversionInfo.Rate;
                        const Value = ConversionInfo.EndCoin;
                        this.showConversionState(Message, Amount, StartCoin, EndCoin, Rate, Value, this.side);
                        // update Position
                        setTimeout(PositionRequest(localStorage.getItem('authClientId') || ClientId), 500);
                    } else {
                        this.showTradeMsg(Message);
                    }
                } catch (e) {
                    console.log(e);
                    this.showTradeMsg('Conversion failed');
                    this.__submitProgressStop();
                }
            })
            .catch(err => {
                console.log(err);
                this.showTradeMsg('Conversion failed');
                this.__submitProgressStop();
            });        
    }

    @action.bound showTradeState(size, quote, base, snackbarPositionType) {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{this.side} Spot Order Submitted!</b></span> <br /><br />
                    <span><b>Side:</b> {`${quote}-${base}`}</span> <br />
                    <span><b>Amount:</b> {size} {quote}</span> <br />
                </React.Fragment>
            ),
            snackbarPositionType
        });
    }

    @action.bound showConversionState(Message, Amount, StartCoin, EndCoin, Rate, Value, snackbarPositionType) {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{Message}</b></span> <br /><br />
                    <span><b>StartCoin:</b> {StartCoin}</span> <br />
                    <span><b>EndCoin:</b> {EndCoin}</span> <br />
                    <span><b>Amount:</b> {Amount}</span> <br />
                    <span><b>Rate:</b> {Rate}</span> <br />
                    <span><b>Value:</b> {Value}</span>
                </React.Fragment>
            ),
            snackbarPositionType
        });
    }
    
    @action.bound showTradeMsg(msg, snackbarPositionType) {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
            snackbarPositionType
        });
    }
}

class ConversionEntryStore {
    @observable OrderFormBuy = null;
    @observable OrderFormSell = null;
    accountStoreRef = null;
    fiatCurrencyStoreRef = null;
    basicCurrency = 'BTC';
    
    constructor(yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar) {
        this.accountStoreRef = yourAccountStore;
        this.fiatCurrencyStoreRef = fiatCurrencyStore;
        this.OrderFormBuy = new ConvertEntryForm(BUY_SIDE, snackbar.Snackbar);
        this.OrderFormSell = new ConvertEntryForm(SELL_SIDE, snackbar.Snackbar);

        instrumentsReaction((baseSymbol, quoteSymbol) => {
            this.baseSymbol = baseSymbol;
            this.basicCurrency = quoteSymbol;
            this.OrderFormBuy.reset();
            this.OrderFormBuy.setSymbolPair(this.baseSymbol, this.basicCurrency);
            this.OrderFormSell.reset()
            this.OrderFormSell.setSymbolPair(this.baseSymbol, this.basicCurrency);
        }) 

        this.accountStoreRef.balancesReaction(({baseCoinBalance, quoteCoinBalance}) => {
            this.OrderFormBuy.setTotal(quoteCoinBalance);
            this.OrderFormBuy.setSliderMax(quoteCoinBalance);
            this.OrderFormSell.setAmount(baseCoinBalance);
            this.OrderFormSell.setSliderMax(baseCoinBalance);
        }, true)

        reaction(
            () => ({
                stockMode: fiatCurrencyStore.stockMode,
            }),
            (stockObj) => {
                this.OrderFormBuy.setStockMode(stockObj.stockMode);
                this.OrderFormSell.setStockMode(stockObj.stockMode);
            }
        );
        
        orderBookBreakDownStore.priceReaction((midPrice) => {
            let price = midPrice;
            const base = this.OrderFormBuy.baseSymbol;
            if (!fiatCurrencyStore.stockMode && (base || '').includes('F:') && price !== 0 || base === 'USDT') {
                price = 1 / price;
            }
            this.OrderFormBuy.setAmount(this.OrderFormBuy.Total / price);
            this.OrderFormSell.setTotal(this.OrderFormSell.Amount * price);
        });
    }
}

export default (yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar) => {
    return new ConversionEntryStore(yourAccountStore, instrumentsReaction, orderBookBreakDownStore, fiatCurrencyStore, snackbar);
};
