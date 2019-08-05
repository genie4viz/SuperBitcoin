import {
    observable, action, reaction, computed, autorun
} from 'mobx';
import partial from 'lodash.partial';
import BigNumber from 'bignumber.js';

import { roundToFixedNum, invokeAll } from '@/utils';
import {
    SubmitOrderHandler,
    OrderTicketPayload,
    postSubmissionSnackbarHandler,
    getOrderPrice,
    getOrderAmount,
    getOrderSymbol,
    getOrderSide
} from './utils/OrderEntryUtils';
import {
    BUY_SIDE,
    ClientId,
    ORDER_TICKET_TICKET_ID,
    SELL_SIDE
} from '@/config/constants';

class OrderTicketForm {
    @observable Amount = '';
    @observable Price = '';
    @observable StopPrice = '';
    @observable submitInProgress = false;

    @observable baseSymbol = null;
    @observable quoteSymbol = null;
    @observable LastOrderTicketData = null;

    // Slider max value for order form, set by reaction from portfolioData change
    @observable sliderMax = '';

    submissionHandler = null;
    side = null;
    setTargetTradeHistoryTicket = null;
    accurateAmount = '';
    programId = '';

    isUserEnteredPrice = false;

    constructor(side, setTargetTradeHistoryTicket, programId) {
        this.side = side;
        this.setTargetTradeHistoryTicket = setTargetTradeHistoryTicket;
        this.programId = programId;
    }

    @action.bound setSliderMax(amount = '') {
        this.sliderMax = amount;
    }

    @action.bound setAmount(amount = '') {
        // input validation to prevent values over wallet number
        if (Number.parseFloat(amount) > this.accurateAmount) {
            this.Amount = this.accurateAmount;
        } else {
            this.Amount = amount;
        }
    }

    @action.bound setAccurateAmount(amount = '') {
        this.accurateAmount = amount;
    }

    @action.bound setPrice(price) {
        if (!this.isUserEnteredPrice) {
            this.Price = price;
        }
    }

    @action.bound setUserEnteredPrice(price) {
        if (!this.isUserEnteredPrice) {
            this.isUserEnteredPrice = true;
        }
        this.Price = price;
    }

    @action.bound setStopPrice(price) {
        this.StopPrice = price;
    }

    @action.bound
    reset() {
        this.Amount = '';
        this.Price = '';
        this.isUserEnteredPrice = false;
    }

    @computed get amount() {
        return this.Amount;
    }

    @computed get price() {
        return this.Price;
    }

    @computed get stopPrice() {
        return this.StopPrice;
    }

    @computed get total() {
        return (
            roundToFixedNum((Number(this.amount) * Number(this.price)), 6)
                .toString()
        );
    }

    @computed get enabled() {
        return !!(
            !this.submitInProgress &&
            this.baseSymbol &&
            this.quoteSymbol &&
            Number(this.total) > 0 &&
            this.submissionHandler
        );
    }

    @computed get lastOrderAmountExchanged() {
        return this.LastOrderTicketData === null ? '0' : getOrderAmount(this.LastOrderTicketData).toString();
    }

    @computed get lastOrderAmountReceived() {
        return this.LastOrderTicketData === null ? '0' : (getOrderPrice(this.LastOrderTicketData) * Number(this.lastOrderAmountExchanged)).toString();
    }

    @computed get lastOrderSymbol() {
        return this.LastOrderTicketData === null ? 'ETH-BTC' : getOrderSymbol(this.LastOrderTicketData).toString();
    }

    @computed get lastOrderSide() {
        return this.LastOrderTicketData === null ? 'Sell' : getOrderSide(this.LastOrderTicketData).toString();
    }

    setSubmissionHandler(submissionHandler) {
        this.submissionHandler = submissionHandler;
    }

    setSymbolPair(baseSymbol, quoteSymbol) {
        this.baseSymbol = baseSymbol;
        this.quoteSymbol = quoteSymbol;
    }

    @action.bound
    __submitProgressStart() {
        this.submitInProgress = true;
    }

    @action.bound
    __submitProgressStop() {
        this.submitInProgress = false;
        this.isUserEnteredPrice = false;
    }

    @action.bound
    submitOrder() {
        this.__submitProgressStart();

        if (Number(this.Amount) > Number(this.accurateAmount)) {
            this.Amount = this.accurateAmount;
        }

        const payload = OrderTicketPayload(
            this.baseSymbol,
            this.quoteSymbol,
            this.Amount,
            this.Price,
            this.side,
            localStorage.getItem('authClientId') || ClientId,
            this.programId
        );
        this.LastOrderTicketData = payload;
        this.submissionHandler(payload);
        this.setTargetTradeHistoryTicket(payload[ORDER_TICKET_TICKET_ID]);

        // this.reset();
        this.__submitProgressStop();
    }
}

class MarketOrderForm extends OrderTicketForm {
    constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
        super(side, setTargetTradeHistoryTicket, programId);
        this.highestBidPrice = highestBidPrice;
        this.lowestAskPrice = lowestAskPrice;

        // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
        reaction(
            () => coinsPairSearchForm.amount,
            (amount) => {
                super.setAmount(amount);
            }
        );

        this.__initMarketPriceReaction();
    }

    __initMarketPriceReaction() {
        reaction(
            () => this.marketOrderPrice,
            marketOrderPrice => super.setPrice(marketOrderPrice),
            { fireImmediately: true }
        );
    }

    @computed
    get marketOrderPrice() {
        return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
    }
}

class LimitOrderForm extends OrderTicketForm {
    constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
        super(side, setTargetTradeHistoryTicket, programId);
        this.highestBidPrice = highestBidPrice;
        this.lowestAskPrice = lowestAskPrice;

        // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
        reaction(
            () => coinsPairSearchForm.amount,
            (amount) => {
                super.setAmount(amount);
            }
        );

        this.__initLimitPriceReaction();
    }

    __initLimitPriceReaction() {
        reaction(
            () => this.limitOrderPrice,
            limitOrderPrice => super.setPrice(limitOrderPrice),
            { fireImmediately: true }
        );
    }

    @computed
    get limitOrderPrice() {
        return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
    }
}

class StopOrderForm extends OrderTicketForm {
    constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
        super(side, setTargetTradeHistoryTicket, programId);
        this.highestBidPrice = highestBidPrice;
        this.lowestAskPrice = lowestAskPrice;

        // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
        reaction(
            () => coinsPairSearchForm.amount,
            (amount) => {
                super.setAmount(amount);
            }
        );

        this.__initStopPriceReaction();
    }

    __initStopPriceReaction() {
        reaction(
            () => this.stopOrderPrice,
            stopOrderPrice => super.setPrice(stopOrderPrice),
            { fireImmediately: true }
        );
    }

    @computed
    get stopOrderPrice() {
        return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
    }
}

class SpotOrderForm extends OrderTicketForm {
    constructor(side, setTargetTradeHistoryTicket, programId, highestBidPrice, lowestAskPrice, coinsPairSearchForm) {
        super(side, setTargetTradeHistoryTicket, programId);
        this.highestBidPrice = highestBidPrice;
        this.lowestAskPrice = lowestAskPrice;

        // Reaction to get Amount from CoinsPairSearchMarketOrderBuyForm
        reaction(
            () => coinsPairSearchForm.amount,
            (amount) => {
                super.setAmount(amount);
            }
        );

        this.__initMarketPriceReaction();
    }

    __initMarketPriceReaction() {
        reaction(
            () => this.marketOrderPrice,
            marketOrderPrice => super.setPrice(marketOrderPrice),
            { fireImmediately: true }
        );
    }

    @computed
    get marketOrderPrice() {
        return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
    }
}

class CoinPairMarketOrderForm extends OrderTicketForm {
    @observable coinPrice = 0;
    coinPriceFromStore = -1;

    constructor(side, setTargetTradeHistoryTicket, programId, coinPriceStore) {
        super(side, setTargetTradeHistoryTicket, programId);

        // Reaction to get price from CoinPriceStore
        reaction(
            () => coinPriceStore.price,
            (price) => {
                this.coinPriceFromStore = price;
                super.setPrice(price);
                this.coinPrice = price;
            }
        );
        /*
        // Reaction to get price from HighestBidPrice
        reaction(
            () => this.marketOrderPrice,
            marketOrderPrice => {
                // if price is different with highestBidPrice less than 10% offset, we will use highestBidPrice
                if (this.coinPriceFromStore > 0 &&
                    (Math.abs(this.coinPriceFromStore - marketOrderPrice) < this.coinPriceFromStore * 0.1))
                {
                    super.setPrice(marketOrderPrice);
                    this.coinPrice = marketOrderPrice;
                }
            },
            { fireImmediately: true }
        ) */
    }

    @computed
    get estimatedAmountReceived() {
        let marketOrderPriceMultiplier = new BigNumber(!Number.isNaN(Number(this.Amount)) ? this.Amount.toString() : 1);
        marketOrderPriceMultiplier = marketOrderPriceMultiplier.multipliedBy(new BigNumber(Number(this.coinPrice)));
        return marketOrderPriceMultiplier.toString();
    }

    @computed
    get validAmountEntered() {
        const amount = Number(this.Amount);
        // const price = Number(this.Price);
        const validAmountEntered = !Number.isNaN(amount) && !!amount;
        // const validPrice = !Number.isNaN(price) && price !== 0; // In case recent trade data isn't flowing (yet).
        return validAmountEntered;
    }

    // @computed
    // get marketOrderPrice() {
    //     return this.side === BUY_SIDE ? this.lowestAskPrice() : this.highestBidPrice();
    // }
}

class OrderEntryStore {
    @observable selectedAskOrderItem = null;
    @observable selectedBidOrderItem = null;
    @observable selectedAsk = null;
    @observable selectedBid = null;

    updateFormAmountToAvailableMaxTimeout = null;

    constructor(
        orderBookBreakDownStore,
        highestBidPrice,
        lowestAskPrice,
        instrumentsReaction,
        snackbar,
        setTargetTradeHistoryTicket,
        coinPriceStore,
        yourAccountStore,
    ) {
        autorun(() => {
	        this.Bids = orderBookBreakDownStore.BidsForOrderBook;
	        this.Asks = orderBookBreakDownStore.AsksForOrderBook;
        });


        this.snackbar = snackbar;

        this.CoinsPairSearchMarketOrderBuyForm = new CoinPairMarketOrderForm(SELL_SIDE, setTargetTradeHistoryTicket, 'simple', coinPriceStore);

        this.MarketOrderBuyForm = new MarketOrderForm(BUY_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);
        this.MarketOrderSellForm = new MarketOrderForm(SELL_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);

        this.LimitOrderFormBuy = new LimitOrderForm(BUY_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);
        this.LimitOrderFormSell = new LimitOrderForm(SELL_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);

        this.StopOrderFormBuy = new StopOrderForm(BUY_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);
        this.StopOrderFormSell = new StopOrderForm(SELL_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);

        this.SpotOrderFormBuy = new SpotOrderForm(BUY_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);
        this.SpotOrderFormSell = new SpotOrderForm(SELL_SIDE, setTargetTradeHistoryTicket, 'standard', highestBidPrice, lowestAskPrice, this.CoinsPairSearchMarketOrderBuyForm);

        this.__initSubmitOrderHandlers();
        this.__initSelectedOrderItemReaction();
        this.__initInstrumentReactionHandler(instrumentsReaction, yourAccountStore);
    }

    // Reaction when user changes coin pair form baseSymbol and quoteSymbol, set amount to Max
    __initInstrumentReactionHandler(instrumentsReaction) {
        instrumentsReaction((baseSymbol, quoteSymbol) => {
            this.MarketOrderBuyForm.reset();
            this.MarketOrderBuyForm.setSymbolPair(baseSymbol, quoteSymbol);

            this.MarketOrderSellForm.reset();
            this.MarketOrderSellForm.setSymbolPair(baseSymbol, quoteSymbol);

            this.LimitOrderFormBuy.reset();
            this.LimitOrderFormBuy.setSymbolPair(baseSymbol, quoteSymbol);

            this.LimitOrderFormSell.reset();
            this.LimitOrderFormSell.setSymbolPair(baseSymbol, quoteSymbol);

            this.StopOrderFormBuy.reset();
            this.StopOrderFormBuy.setSymbolPair(baseSymbol, quoteSymbol);

            this.StopOrderFormSell.reset();
            this.StopOrderFormSell.setSymbolPair(baseSymbol, quoteSymbol);

            this.SpotOrderFormBuy.reset();
            this.SpotOrderFormBuy.setSymbolPair(baseSymbol, quoteSymbol);

            this.SpotOrderFormSell.reset();
            this.SpotOrderFormSell.setSymbolPair(baseSymbol, quoteSymbol);

            this.CoinsPairSearchMarketOrderBuyForm.reset();
            this.CoinsPairSearchMarketOrderBuyForm.setSymbolPair(baseSymbol, quoteSymbol);

            // this.__updateFormAmountToAvailableMax(baseSymbol, quoteSymbol, yourAccountStore, true);
        }, true);
    }

    // __updateFormAmountToAvailableMax(baseSymbol, quoteSymbol, yourAccountStore, isInitialization) {
    //     clearTimeout(this.updateFormAmountToAvailableMaxTimeout);
    //     this.updateFormAmountToAvailableMaxTimeout = setTimeout(() => {
    //         // Get available balance of baseSymbol from yourAccountStore
    //         let baseBalance = 0;
    //         let quoteBalance = 0;
    //         for (let i = 0; i < yourAccountStore.portfolioData.length; i++) {
    //             if (yourAccountStore.portfolioData[i] && yourAccountStore.portfolioData[i].Coin === baseSymbol) {
    //                 if (yourAccountStore.portfolioData[i].Coin === baseSymbol) {
    //                     baseBalance = yourAccountStore.portfolioData[i].Position;
    //                 } else if (yourAccountStore.portfolioData[i].Coin === quoteSymbol) {
    //                     quoteBalance = yourAccountStore.portfolioData[i].Position;
    //                 }
    //
    //                 if (isInitialization) {
    //                     partial(withValueFromEvent, this.MarketOrderBuyForm.setAmount)({ target: { value: quoteBalance } });
    //                     partial(withValueFromEvent, this.MarketOrderSellForm.setAmount)({ target: { value: baseBalance } });
    //                     partial(withValueFromEvent, this.LimitOrderFormBuy.setAmount)({ target: { value: quoteBalance } });
    //                     partial(withValueFromEvent, this.LimitOrderFormSell.setAmount)({ target: { value: baseBalance } });
    //                     partial(withValueFromEvent, this.StopOrderFormBuy.setAmount)({ target: { value: quoteBalance } });
    //                     partial(withValueFromEvent, this.StopOrderFormSell.setAmount)({ target: { value: baseBalance } });
    //                     partial(withValueFromEvent, this.SpotOrderFormBuy.setAmount)({ target: { value: quoteBalance } });
    //                     partial(withValueFromEvent, this.SpotOrderFormSell.setAmount)({ target: { value: baseBalance } });
    //                 }
    //
    //                 this.MarketOrderBuyForm.sliderMax = quoteBalance;
    //                 this.MarketOrderSellForm.sliderMax = baseBalance;
    //                 this.LimitOrderFormBuy.sliderMax = quoteBalance;
    //                 this.LimitOrderFormSell.sliderMax = baseBalance;
    //                 this.StopOrderFormBuy.sliderMax = quoteBalance;
    //                 this.StopOrderFormSell.sliderMax = baseBalance;
    //                 this.SpotOrderFormBuy.sliderMax = quoteBalance;
    //                 this.SpotOrderFormSell.sliderMax = baseBalance;
    //
    //                 this.MarketOrderBuyForm.setAccurateAmount(quoteBalance);
    //                 this.MarketOrderSellForm.setAccurateAmount(baseBalance);
    //                 this.LimitOrderFormBuy.setAccurateAmount(quoteBalance);
    //                 this.LimitOrderFormSell.setAccurateAmount(baseBalance);
    //                 this.StopOrderFormBuy.setAccurateAmount(quoteBalance);
    //                 this.StopOrderFormSell.setAccurateAmount(baseBalance);
    //                 this.SpotOrderFormBuy.setAccurateAmount(quoteBalance);
    //                 this.SpotOrderFormSell.setAccurateAmount(baseBalance);
    //                 break;
    //             }
    //         }
    //     }, 0);
    // }

    __initSelectedOrderItemReaction() {
        reaction(
            () => this.selectedAskOrderItem,
            ({ amount, price }) => {
                this.LimitOrderFormSell.setAmount(amount);
                this.LimitOrderFormSell.setUserEnteredPrice(price);

                this.StopOrderFormSell.setAmount(amount);
                this.StopOrderFormSell.setUserEnteredPrice(price);
            }
        );

        reaction(
            () => this.selectedBidOrderItem,
            ({ price, amount }) => {
                this.LimitOrderFormBuy.setAmount(amount);
                this.LimitOrderFormBuy.setUserEnteredPrice(price);

                this.StopOrderFormBuy.setAmount(amount);
                this.StopOrderFormBuy.setUserEnteredPrice(price);
            }
        );
    }

    async __initSubmitOrderHandlers() {
        const marketSubmitOrderHandler = await SubmitOrderHandler('market');
        const limitSubmitOrderHandler = await SubmitOrderHandler('limit');
        const stopSubmitOrderHandler = await SubmitOrderHandler('stop');
        const coinPairFormSubmitOrderHandler = await SubmitOrderHandler('market');

        const postSubmissionHandlerMarketOrder = invokeAll(
            partial(postSubmissionSnackbarHandler, 'Market', this.snackbar),
        );

        const postSubmissionHandlerLimitOrder = invokeAll(
            partial(postSubmissionSnackbarHandler, 'Limit', this.snackbar),
        );

        const postSubmissionHandlerStopOrder = invokeAll(
            partial(postSubmissionSnackbarHandler, 'Stop', this.snackbar),
        );

        const postSubmissionHandlerCoinsPairSearchMarketOrder = invokeAll(
            partial(postSubmissionSnackbarHandler, 'Market', this.snackbar),
        );

        const limitOrderSubmissionHandler = invokeAll(
            limitSubmitOrderHandler,
            postSubmissionHandlerLimitOrder
        );

        const stopOrderSubmissionHandler = invokeAll(
            stopSubmitOrderHandler,
            postSubmissionHandlerStopOrder
        );

        const marketOrderSubmissionHandler = invokeAll(
            marketSubmitOrderHandler,
            postSubmissionHandlerMarketOrder
        );

        const coinPairFormOrderSubmissionHandler = invokeAll(
            coinPairFormSubmitOrderHandler,
            postSubmissionHandlerCoinsPairSearchMarketOrder
        );

        this.MarketOrderBuyForm.setSubmissionHandler(marketOrderSubmissionHandler);
        this.MarketOrderSellForm.setSubmissionHandler(marketOrderSubmissionHandler);

        this.LimitOrderFormBuy.setSubmissionHandler(limitOrderSubmissionHandler);
        this.LimitOrderFormSell.setSubmissionHandler(limitOrderSubmissionHandler);

        this.StopOrderFormBuy.setSubmissionHandler(stopOrderSubmissionHandler);
        this.StopOrderFormSell.setSubmissionHandler(stopOrderSubmissionHandler);

        this.CoinsPairSearchMarketOrderBuyForm.setSubmissionHandler(
            coinPairFormOrderSubmissionHandler
        );
    }

    @action.bound
    setOrderFormData(data) {
        this.selectedAskOrderItem = data;
        this.selectedBidOrderItem = data;
    }
}

export default (
    Asks$,
    Bids$,
    highestBidPrice,
    lowestAskPrice,
    instrumentsReaction,
    snackbar,
    setTargetTradeHistoryTicket,
    coinPriceStore,
    yourAccountStore,
) => new OrderEntryStore(
    Asks$,
    Bids$,
    highestBidPrice,
    lowestAskPrice,
    instrumentsReaction,
    snackbar,
    setTargetTradeHistoryTicket,
    coinPriceStore,
    yourAccountStore,
);
