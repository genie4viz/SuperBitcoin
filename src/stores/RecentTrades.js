import once from 'lodash.once';
import { computed, observable, action } from 'mobx';
import { shiftMapStoreFromArray } from './utils/storeUtils';
import { pageIsVisible, roundToFixedNum } from '../utils';

import { RecentTrades, RecentTradesUpdate } from '../lib/bct-ws';

const throttleMs = 1;
const maxRows = 50;

const recentTradesNormalized = recentTrades => recentTrades.reduce(
    (acc, { ExchangeID, Trades = [] }) => {
        Trades.forEach(({
            IsBuy, Price, Size, Timestamp, Exchange,
        }) => {
            if (Price && Size) {
                acc.push([
                    Exchange ? Exchange.toUpperCase() : ExchangeID.toUpperCase(), // temporary: if mrtt is available, use that, but else, use belka
                    roundToFixedNum(Price, 6),
                    roundToFixedNum(Size, 6),
                    IsBuy || false,
                    Timestamp.split('T')[1].split('.')[0].split('Z')[0]
                ]);
            }
        });
        return acc;
    },
    []
);

class RecentTradesStore {
    @observable RecentTrades = new Map();
    @observable isStopped = false;
    @observable base = '';
    @observable quote = '';
    __subscriptionInited = false;
    RecentTrades$ = null;
    incomingTimer = null;

    constructor(instrumentStore) {
        instrumentStore.instrumentsReaction(
            (base, quote) => {
                this.RecentTrades.clear();
                if (this.__subscriptionInited) this.updateRecentTradesSubscription(base, quote);
                else this.initRecentTradesSubscription(base, quote);
            },
            true
        );
    }

    @action.bound
    updateRecentTradesSubscription(base, quote) {
        this.RecentTrades.clear();
        RecentTradesUpdate({
            Symbols: [`${base}-${quote}`],
            OldObservable: this.RecentTrades$,
        });
    }

    initRecentTradesSubscription = once((base, quote) => {
        this.RecentTrades$ = RecentTrades({
            Symbols: [`${base}-${quote}`],
            throttleMs,
        });

        this.RecentTrades$.subscribe({ next: this.handleIncomingRecentTradesFrames.bind(this) });

        this.__subscriptionInited = true;
    });

    handleIncomingRecentTradesFrames(
        {
            body: {
                messages: recentTrades = [],
            } = {},
        } = {}
    ) {
        if (!pageIsVisible()) return;

        if (recentTrades[0]) {
            if (recentTrades[0].length === 0) {
                this.isStopped = true;
            } else if (recentTrades[0].Trades.length > 0 && this.isStopped) {
                this.isStopped = false;
            }
            // console.log('recentTrades[0]', recentTrades[0]);
            // console.log('[this.isStopped]', this.isStopped);

            try {
                this.base = recentTrades[0].Symbol.split('-')[0];
                this.quote = recentTrades[0].Symbol.split('-')[1];
            } catch (e) {
                this.base = '';
                this.quote = '';
            }
        }

        if ('requestIdleCallback' in window) {
            // Use requestIdleCallback to schedule work.
            requestIdleCallback(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        shiftMapStoreFromArray(this.RecentTrades, recentTradesNormalized(recentTrades), maxRows);
                    });
                });
            }, { timeout: 100 });
        } else {
            // Do what you’d do today.
        }
    }

    @computed get recentTrades() {
        return this.RecentTrades;
    }
}

export default (instrumentStore) => {
    const store = new RecentTradesStore(instrumentStore);
    return store;
};
