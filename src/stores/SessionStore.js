import { observable } from 'mobx';
import { ProgramId } from '../config/constants';
import { MarketDataRequest, OrderBookDataRequest } from '../lib/bct-ws';

class SessionStore {
    @observable isRegularMarket = true;
    inited = false;

    constructor(instrumentStore, yourAccountStore) {
        instrumentStore.instrumentsReaction(
            (base, quote) => {
                this.inited = true;
                let baseSymbol = base;
                let quoteSymbol = quote;
                this.isRegularMarket = true;

                /**
                 *  Swap order of (base, quote) based on MarketCap
                 */
                // http://prntscr.com/mb3h01
                // If Market Cap of C1/ Market Cap of C2 is less than 1 (then do nothing)
                // If it is greater than 1 (then the market is the reverse C2>C1)
                const portfolioData = yourAccountStore.PortfolioData;
                let c1MarketCap = 0;
                let c2MarketCap = 0;

                if (portfolioData && portfolioData.length > 0) {
                    for (let i = 0; i < portfolioData.length; i++) {
                        if (portfolioData[i] && portfolioData[i].Coin === base) {
                            c1MarketCap = portfolioData[i].Marketcap || 0;
                        }
                        if (portfolioData[i] && portfolioData[i].Coin === quote) {
                            c2MarketCap = portfolioData[i].Marketcap || 0;
                        }
                        if (c1MarketCap !== 0 && c2MarketCap !== 0) {
                            break;
                        }
                    }
                }

                if (c2MarketCap !== 0 && c1MarketCap > c2MarketCap) {
                    baseSymbol = quote;
                    quoteSymbol = base;
                    this.isRegularMarket = false;
                }

                if (base === 'BTC' && quote === 'USDT') {
                    this.isRegularMarket = true;
                }
                if (base === 'USDT' && quote === 'BTC') {
                    this.isRegularMarket = false;
                }

                /**
                 *  Send a call to backend via Socket
                 */
                if (base === 'BTC' && quote === 'USDT') {
                    MarketDataRequest({ Symbols: ['BTC-USDT'], ProgramId });
                    OrderBookDataRequest({ Symbols: ['BTC-USDT'], ProgramId });
                } else {
                    MarketDataRequest({ Symbols: [`${baseSymbol}-${quoteSymbol}`], ProgramId });
                    OrderBookDataRequest({ Symbols: [`${baseSymbol}-${quoteSymbol}`], ProgramId });
                }
            },
            true
        );
        this.__checkInited();
    }

    __checkInited() {
        const hn = setTimeout(() => {
            if (!this.inited) console.log('[BCTSession not started!]');
            clearTimeout(hn);
        }, 15000);
    }
}

export default (instrumentStore, yourAccountStore) => {
    const store = new SessionStore(instrumentStore, yourAccountStore);
    return store;
};
