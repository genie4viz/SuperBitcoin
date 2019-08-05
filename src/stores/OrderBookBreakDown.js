import { observable, runInAction, reaction, action, computed } from 'mobx';

import { getScreenInfo, pageIsVisible } from '@/utils';
import { updateMapStoreFromArrayForOrderBook } from './utils/storeUtils';
import { ORDER_BOOK_THROTTLE, ORDER_BOOK_ROWS_COUNT } from '@/config/constants';
import { getOrderBookBreakdowns, getOrderBookDataFeed } from '@/lib/ws/feed';

const DEPTH_CHART_THROTTLE = 2000;
const DEPTH_CHART_LEVELS = 150;

class OrderBookBreakDownStore {
    @observable.shallow AsksForOrderBook = [];
    @observable.shallow BidsForOrderBook = [];
    @observable.shallow AsksForDepthChart = [];
    @observable.shallow BidsForDepthChart = [];
    @observable isDGLoaded = false;
    @observable isCoinPairInversed = false;
    @observable base = ''; // incoming data feed's base coin
    @observable quote = ''; // incoming data feed's quote coin
    @observable isOrderBookBreakDownStop = false; // FALSE: no data stream, TRUE: data stream exists
    @observable isOrderBookDataLoaded = false;
    @observable totalOrderSize = 0;
    @observable totalOrderAmount = 0;
    @observable maxBidPrice = 0;
    @observable maxAskPrice = 0;
    @observable MidAvgPrice = 0;
    @observable maxOrderAmount = 0;
    @observable maxOrderSize = 0;
    @observable manualOrderBookHoverItem = {};
    @observable MidPrice = 0;
    @observable adjPrice = 0;
    @observable multiLegMode = false;
    @observable multiLegCoin = '';
    @observable multiLegPriceRate = 1;
    @observable priceDelta = 0;

    symbol = '';
    __subscriptionInited = false;
    orderbookBreakDownArrivedTime = 0;
    exchanges = {};
    isMobileDevice = false;
    arbMode = false;
    multiLegRate = 1;
    fiatCurrencyStoreRef = null;
    spotCalcTimer = null;

    constructor(instrumentStore, exchangesStore, marketsStore, viewModeStore, fiatCurrencyStore) {
        this.isMobileDevice = getScreenInfo().isMobileDevice;
        this.fiatCurrencyStoreRef = fiatCurrencyStore;

        instrumentStore.instrumentsReaction((base = '', quote = '') => {
            if (this.arbMode) return;

            this.AsksForOrderBook = [];
            this.BidsForOrderBook = [];
            this.AsksForDepthChart = [];
            this.BidsForDepthChart = [];

            this.isDGLoaded = false;
            this.isCoinPairInversed = false;
            this.priceDelta = 0;
            this.MidAvgPrice = 0;

            if (base.includes('F:')) {
                this.setMultiLegMode(base);
                return;
            }

            const symbol = `${base.replace('F:', '')}-${quote.replace('F:', '')}`;
            const isSymbolUpdated = this.symbol !== symbol;
            if (isSymbolUpdated) {
                this.symbol = symbol;
            }

            try {
                const newPair = marketsStore.markets[`${base}-${quote}`];
                const pair = newPair.split('-');
                if (pair.length === 2) {
                    this.base = pair[0];
                    this.quote = pair[1];
                    this.isCoinPairInversed = base === this.quote && quote === this.base;
                } else {
                    this.base = base;
                    this.quote = quote;
                }
            } catch (e) {
                this.base = base;
                this.quote = quote;
            }
            this.multiLegMode = false;
            this.multiLegRate = 1;
            this.multiLegPriceRate = 1;

            if (!this.isMobileDevice) {
                this.createSubscription();
            }
        }, true);

        reaction(
            () => {
                return {
                    exchanges: exchangesStore.exchanges,
                    validMarketExchanges: exchangesStore.validMarketExchanges
                };
            },
            ({ exchanges, validMarketExchanges }) => {
                this.exchanges = exchanges;
                if (!this.isMobileDevice && validMarketExchanges.length > 1) {
                    this.createSubscription();
                }
            }
        );

        reaction(
            () => ({ arbMode: viewModeStore.arbMode }),
            ({ arbMode }) => {
                this.arbMode = arbMode;
                this.AsksForOrderBook = [];
                this.BidsForOrderBook = [];
                if (arbMode) {
                    this.setMultiLegMode('F:USD'); // default arb's orderbook is [F:USD->BTC]
                    this.priceDelta = 0;
                    this.isSelectedCoinFiat = true;
                } else {
                    const base = instrumentStore.selectedBase;
                    if ((base || '').includes('F:')) {
                        this.setMultiLegMode(base);
                    } else {
                        this.base = instrumentStore.selectedBase;
                        this.quote = instrumentStore.selectedQuote;
                        this.multiLegRate = 1;
                        this.multiLegPriceRate = 1;
                        this.multiLegMode = false;
                    }
                }
                this.createSubscription();
            }
        );

        this.loadFromStorage();

        this.orderbookBreakDownArrivedTime = Math.round(Date.now() / 1000);

        setInterval(() => {
            if (this.__subscriptionInited) {
                const currentUnix = Math.round(Date.now() / 1000);
                const delta = currentUnix - this.orderbookBreakDownArrivedTime;
                if (delta > 5) {
                    this.isOrderBookBreakDownStop = true;
                }
            }
        }, 1000);

        this.runSpotPriceDelta();
    }

    @computed get highestBidPrice() {
        return this.BidsForOrderBook && this.BidsForOrderBook.length > 0 ? this.BidsForOrderBook[0][0] : 0;
    }

    @computed get lowestAskPrice() {
        return this.AsksForOrderBook && this.AsksForOrderBook.length > 0 ? this.AsksForOrderBook[0][0] : 0;
    }

    runSpotPriceDelta = () => {
        clearTimeout(this.spotCalcTimer);
        this.priceDelta = this.MidAvgPrice * this.multiLegPriceRate - this.MidPrice;
        this.spotCalcTimer = setInterval(() => {
            this.priceDelta = this.MidAvgPrice * this.multiLegPriceRate - this.MidPrice;
        }, 60000);
    };

    setMultiLegMode = async base => {
        /**
         *  Multi-leg Mode
         */
        try {
            let price;
            this.removeSubscription();
            if (this.fiatCurrencyStoreRef.stockMode || this.arbMode) {
                // Stock prices to ETH
                price = await this.fiatCurrencyStoreRef.getSpotRate(base, 'ETH');
                this.base = 'ETH';
                this.quote = 'BTC';
                this.multiLegPriceRate = price;
                this.multiLegRate = 1 / price;
            } else {
                // Fiat price to USDT
                price = await this.fiatCurrencyStoreRef.getSpotRate(base, 'USDT');
                this.base = 'BTC';
                this.quote = 'USDT';
                this.multiLegPriceRate = 1 / price;
                this.multiLegRate = price;
            }

            this.multiLegCoin = base.replace('F:', '');
            this.multiLegMode = true;

            if (!this.isMobileDevice) {
                this.createSubscription();
            }
        } catch (e) {
            console.log(e);
        }
    };

    @action.bound highlightRow = (type, price) => {
        if (!type) {
            this.manualOrderBookHoverItem = undefined;
            return;
        }

        const rows = type === 'buy' ? this.BidsForOrderBook : this.AsksForOrderBook;
        let index;
        for (index = 0; index < rows.length - 1; index++) {
            if (rows[index].price >= price) {
                break;
            }
        }

        if (index === rows.length) {
            index = rows.length - 1;
        }

        this.manualOrderBookHoverItem = {
            type,
            index
        };
    };

    loadFromStorage = () => {
        const exchangesStr = localStorage.getItem('exchanges') || '{}';
        try {
            this.exchanges = JSON.parse(exchangesStr) || {};
        } catch (e) {
            console.log(e);
        }
    };

    handleOrderBookData = ({ Asks = [], Bids = [], Symbol = '', MidPrice } = {}) => {
        // --- check if data feed is coming continuously --- //
        this.orderbookBreakDownArrivedTime = Math.round(Date.now() / 1000);

        runInAction(() => {
            let totalOrderSize = 0;
            let totalOrderAmount = 0;
            let maxOrderAmount = 0;
            let maxOrderSize = 0;
            let maxAskPrice = Asks.length ? Asks[0][0] : 0;
            for (let i = 0; i < Asks.length; i++) {
                const currentPrice = Number(Asks[i][0]);
                const currentAmount = Number(Asks[i][1]);
                const orderSum = Number(Asks[i][0]) * Number(Asks[i][1]);

                totalOrderSize += orderSum;
                totalOrderAmount += currentAmount;
                maxOrderSize = Math.max(currentAmount, maxOrderSize);
                maxAskPrice = Math.max(maxAskPrice, currentPrice);
                maxOrderAmount = Math.max(maxOrderAmount, orderSum);
            }

            let maxBidPrice = Bids.length ? Bids[0][0] : 0;
            for (let i = 0; i < Bids.length; i++) {
                const currentPrice = Number(Bids[i][0]);
                const currentAmount = Number(Bids[i][1]);
                const orderSum = Number(Bids[i][0]) * Number(Bids[i][1]);

                maxOrderSize = Math.max(currentAmount, maxOrderSize);
                maxBidPrice = Math.max(maxBidPrice, currentPrice);
                maxOrderAmount = Math.max(maxOrderAmount, orderSum);
            }

            this.isOrderBookBreakDownStop = false;
            this.totalOrderSize = totalOrderSize;
            this.totalOrderAmount = totalOrderAmount * this.multiLegRate;

            const nextMidAvgPrice = totalOrderSize / totalOrderAmount;
            // add some noise to prices
            const midDiff = this.MidAvgPrice ? this.MidAvgPrice - nextMidAvgPrice : 0;

            this.AsksForOrderBook = updateMapStoreFromArrayForOrderBook(
                Asks.reverse(),
                this.multiLegRate,
                this.multiLegPriceRate,
                midDiff
            );
            this.BidsForOrderBook = updateMapStoreFromArrayForOrderBook(
                Bids,
                this.multiLegRate,
                this.multiLegPriceRate,
                midDiff
            ).reverse();

            
            this.maxBidPrice = maxBidPrice;
            this.maxAskPrice = maxAskPrice;
            this.maxOrderAmount = maxOrderAmount;
            this.maxOrderSize = maxOrderSize * this.multiLegRate;

            const isOrderBookDataLoaded = Asks.length > 0 && Bids.length > 0;
            if (this.isOrderBookDataLoaded !== isOrderBookDataLoaded) {
                this.isOrderBookDataLoaded = isOrderBookDataLoaded;
            }

            this.MidAvgPrice = nextMidAvgPrice;
            this.MidPrice = MidPrice * this.multiLegPriceRate;

            if (this.resetDeltaPriceOnNextRun) {
                this.resetDeltaPriceOnNextRun = false;
                this.runSpotPriceDelta();
            }
            this.symbol = Symbol;
            this.adjPrice = this.MidAvgPrice * this.multiLegPriceRate - this.priceDelta;
        });
    }

    @action.bound createSubscription() {
        const exchanges = Object.keys(this.exchanges).filter(
            property => this.exchanges[property] && this.exchanges[property].active && property !== 'Global'
        );

        if (!this.base || !this.quote) {
            return;
        }

        this.removeSubscription();

        const symbol = `${this.base}-${this.quote}`;
        this.subscribe = getOrderBookBreakdowns({
            symbol,
            levels: ORDER_BOOK_ROWS_COUNT,
            throttleMs: ORDER_BOOK_THROTTLE,
            exchanges
        }).subscribe(this.handleOrderBookData);

        this.depthChartSubscription = getOrderBookDataFeed({
            symbol,
            levels: DEPTH_CHART_LEVELS,
            throttleMs: DEPTH_CHART_THROTTLE,
            min: null,
            max: null,
            exchanges
        }).subscribe(this.handleDepthChartData);

        this.__subscriptionInited = true;
    }

    @action.bound removeSubscription() {
        if (this.subscribe) {
            this.subscribe.unsubscribe();
            this.subscribe = undefined;
        }

        if (this.depthChartSubscription) {
            this.depthChartSubscription.unsubscribe();
            this.depthChartSubscription = undefined;
        }

        this.resetDeltaPriceOnNextRun = true;
    }

    patchLevels = data => {
        if (!data.length) {
            return data;
        }

        const spread = Math.abs(data[data.length - 1][0] - data[0][0]);
        const step = spread / DEPTH_CHART_LEVELS;

        let prevItem;
        return data.slice(1).reduce((res, [price, amount], index) => {
            if (!prevItem) {
                prevItem = [price, amount];
                return res;
            }

            const [prevPrice, prevAmount] = prevItem;

            if (index && Math.abs(price - prevPrice) < step) {
                prevItem = [(price + prevPrice) / 2, amount + prevAmount];
            } else {
                res.push(prevItem);
                prevItem = [price, amount];
            }
            return res;
        }, [data[0]]);
    };

    handleDepthChartData = ({ Asks = [], Bids = [] }) => {
        if (!pageIsVisible() || !Asks.length || !Bids.length) {
            return;
        }

        runInAction(() => {
            let bidsBuffer = Bids;
            let asksBuffer = Asks;
            if (this.multiLegMode) {
                bidsBuffer = bidsBuffer.map(([price, amount]) => {
                    return [
                        Number(price) * this.multiLegPriceRate,
                        Number(amount) * this.multiLegRate
                    ];
                });

                asksBuffer = asksBuffer.map(([price, amount]) => {
                    return [
                        Number(price) * this.multiLegPriceRate,
                        Number(amount) * this.multiLegRate
                    ];
                });
            }

            this.BidsForDepthChart = this.patchLevels(bidsBuffer);
            this.AsksForDepthChart = this.patchLevels(asksBuffer.slice().reverse());

            const isDGLoaded = this.AsksForDepthChart.length > 10 && this.BidsForDepthChart.length > 10;
            if (isDGLoaded !== this.isDGLoaded) {
                this.isDGLoaded = isDGLoaded;
            }
        });
    }

    /**
     * Reaction handler for orderbook midPrice
     */
    priceReaction = (reactionHandler, fireImmediately = false) => {
        return reaction(
            () => ({ adjPrice: this.adjPrice }),
            ({ adjPrice }) => {
                if (!this.symbol.includes(this.base) || !this.symbol.includes(this.quote)) {
                    // reset a price
                    reactionHandler(0);
                    return;
                }

                reactionHandler(adjPrice);
            },
            { fireImmediately }
        );
    };
}

export default (instrumentStore, exchangesStore, marketsStore, viewModeStore, fiatCurrencyStore) => {
    const store = new OrderBookBreakDownStore(
        instrumentStore,
        exchangesStore,
        marketsStore,
        viewModeStore,
        fiatCurrencyStore
    );
    return store;
};
