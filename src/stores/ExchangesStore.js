import React from 'react';
import { observable, action, reaction } from 'mobx';
import _ from 'lodash';
import { getScreenInfo } from "@/utils";

import { mockData } from '../components/SideBar/ExchangePop/mock';
import {
    AddExchange,
    RemoveExchange,
    GetConnectedExchanges
} from '../lib/bct-ws';
import { REST_MARKET, ACCEPTED_EXCHANGES } from '../config/constants';

class ExchangesStore {
    @observable.shallow exchanges = {};
    @observable.shallow marketExchanges = []; // All exchange services
    @observable selectedExchange = { name: 'Global', icon: '' };
    @observable isEmptyExchange = false;
    @observable exchangeSearchValue = '';
    @observable.shallow validMarketExchanges = []; // Available market exchanges for base-quote coins
    @observable.shallow connectedExchanges = [];
    snackbar = null;
    arbMode = false;
    isLoggedIn = false;
    isRealTrading = false;
    isMobileDevice = false;

    constructor(instrumentStore, settingsStore, snackbar, viewModeStore, smsAuthStore) {
        this.snackbar = snackbar;
        this.isLoggedIn = smsAuthStore.isLoggedIn;
        this.isRealTrading = settingsStore.isRealTrading;
        this.isMobileDevice = getScreenInfo().isMobileDevice;

        reaction(
            () => smsAuthStore.isLoggedIn,
            (isLoggedIn) => {
                this.isLoggedIn = isLoggedIn;
                if (isLoggedIn && !this.isMobileDevice) this.getConnectedExchanges();
            },
            {fireImmediately: true}
        );

        reaction(
            () => settingsStore.isRealTrading,
            (isRealTrading) => {
                this.isRealTrading = isRealTrading;
            },
            {fireImmediately: true}
        );

        instrumentStore.instrumentsReaction((base, quote) => {
            let symbol = '';
            if (this.arbMode) {
                symbol = 'ETH-BTC';
            } else {
                const baseCoin = (base || '').replace('F:', '');
                const quoteCoin = (quote || '').replace('F:', '');
                symbol = `${baseCoin}-${quoteCoin}`;
            }
            this.fetchMarketExchanges(symbol);
        }, true);

        reaction(
            () => {
                return {
                    arbMode: viewModeStore.arbMode
                };
            },
            ({ arbMode }) => {
                this.arbMode = arbMode;
                if (arbMode) {
                    this.fetchMarketExchanges('ETH-BTC');
                }
            }
        );

        this.clearExchanges();
    }

    fetchMarketExchanges(symbol) {
        fetch(`${REST_MARKET}/api/exchanges/${symbol}`)
            .then(response => response.json())
            .then(res => {
                const marketExchanges = _.cloneDeep(mockData);
                const validMarketExchanges = [];

                Object.keys(res).forEach(key => {
                    const marketIdx = marketExchanges.findIndex(m => m.name === res[key].name);
                    if (marketIdx > -1) {
                        marketExchanges[marketIdx].urls = res[key].urls;
                        marketExchanges[marketIdx].status = 'active';
                        validMarketExchanges.push(marketExchanges[marketIdx]);
                    }
                });

                marketExchanges.sort((a, b) => {
                    if (a.status < b.status) {
                        return -1;
                    }

                    if (a.status > b.status) {
                        return 1;
                    }

                    return 0;
                });

                this.marketExchanges = marketExchanges;

                this.validMarketExchanges = validMarketExchanges;

                if (Object.keys(res).length === 0) {
                    this.isEmptyExchange = true;
                } else {
                    this.isEmptyExchange = false;
                }
            })
            .catch(console.log);
    }

    // The API credentials should not ever be stored unobfuscated
    // anywhere in the application at any point
    @action.bound addExchange (payload) {

      // We verify new API credentials before storing them. In paper
      // trading mode this verification always succeeds when the
      // apiKeysValid flag is passed.
      if (this.isRealTrading) {
          payload.verifyExchange = true;
      } else {
          payload.paperTrading = {
              apiKeysValid: true
          }
      }

      return new Promise((resolve) => {

        AddExchange(payload)
            .then(res => {
                // Obfuscates API credentials before storing them in application
                // state. It might be nice to retrieved obfuscated and validated
                // credential from BE in response to AddExchangeAccount. When the
                // page reloads, the FE retrieves obfuscated keys from the BE so
                // this obfuscation only needs to happen here.
                payload.apiKey = `${payload.apiKey.substr(0, 4)}-xxxxx`;
                payload.apiSecret = `${payload.apiSecret.substr(0, 4)}-yyyyy`;

                this.exchanges = {
                    ...this.exchanges,
                    [payload.exchange]: payload,
                };

                this.snackbar({
                    message: () => (
                        <span>
                            <b>Added {payload.exchange}</b>
                        </span>
                    )
                });

                this.setExchangeApiSynced(payload.exchange, true);

                resolve(res);
            })
            .catch(err => {
                this.snackbar({
                    message: () => <span><b>{err.message}</b></span>
                })
            });
        });
    }

    @action.bound getConnectedExchanges = async () => {
        this.connectedExchanges = await GetConnectedExchanges();

        // We filter the huge list of exchanges based on the ACCEPTED_EXCHANGES whitelist
        // In future the BE will return this list to the FE for display
        this.marketExchanges = this.marketExchanges.filter(({ name }) => {
            return ACCEPTED_EXCHANGES.indexOf(name) > -1;
        });

        this.validMarketExchanges = this.validMarketExchanges.filter(({ name }) => {
            return ACCEPTED_EXCHANGES.indexOf(name) > -1;
        });

        this.connectedExchanges.forEach(({ exchange, api_key, api_secret, password, uid }) => {
            // We use the ACCEPTED_EXCHANGES whitelist to work out the
            // exchange name with case, e.g. Bitfinex instead of the
            // lowercased name returned by the BE, e.g. bitfinex. In future
            // it might nice to return both to prevent this step.
            let exchangeName = ACCEPTED_EXCHANGES.filter(acceptedExchangeName => {
                return acceptedExchangeName.toLowerCase() === exchange.name.toLowerCase();
            }).pop();

            // Hack to determine exchange name expected by front-end
            if (exchange.name === 'okcoinusd') exchangeName = 'OKEX';
            if (exchange.name === 'huobipro') exchangeName = 'Huobi';

            // There's no known exchange with this name in ACCEPTED_EXCHANGES
            if (!exchangeName) return;

            this.exchanges[exchangeName] = {
                active: true,
                enabled: true,
                apiSynced: true,
                apiKey: api_key,
                apiSecret: api_secret
            };

            if (password) this.exchanges[exchangeName].password = password;
            if (uid) this.exchanges[exchangeName].uid = uid;
        });
    };

    // The API credentials should not ever be stored unobfuscated
    // anywhere in the application at any point
    @action.bound removeExchange(key) {
        return new Promise((resolve, reject) => {
            // --- access to backend --- //
            RemoveExchange(key)
                .then(res => {
                    delete this.exchanges[key];

                    this.snackbar({
                        message: () => (
                            <span>
                                <b>Removed {key}</b>
                            </span>
                        )
                    });

                    resolve(res);
                })
                .catch(err => {
                    this.snackbar({
                        message: () => (
                            <span>
                                <b>{err.message}</b>
                            </span>
                        )
                    });
                    reject(err);
                });
        });
    }

    @action.bound setExchangeActive(key, value) {
        if (key === 'Global') {
            if (value) {
                let newExchanges = {};
                for (let i = 0; i < this.marketExchanges.length; i++) {
                    const key = this.marketExchanges[i].name;
                    newExchanges = {
                        ...newExchanges,
                        [key]: {
                            ...this.exchanges[key],
                            active: this.marketExchanges[i].status === 'active'
                        }
                    };
                }

                this.exchanges = {
                    ...newExchanges,
                    Global: {
                        ...this.exchanges.Global,
                        active: true
                    }
                };
            } else {
                let newExchanges = {};
                for (let i = 0; i < this.marketExchanges.length; i++) {
                    const key = this.marketExchanges[i].name;
                    newExchanges = {
                        ...newExchanges,
                        [key]: {
                            ...this.exchanges[key],
                            active: false
                        }
                    };
                }

                this.exchanges = {
                    ...newExchanges,
                    Global: {
                        ...this.exchanges.Global,
                        active: false
                    }
                };
            }
        } else {
            let isGlobalActive = false;

            if (value === false) {
                const keys = Object.keys(this.exchanges);
                let noSelected = true;
                for (let i = 0; i < keys.length; i++) {
                    if (key !== keys[i] && this.exchanges[keys[i]].active) {
                        noSelected = false;
                        break;
                    }
                }
                if (noSelected) {
                    isGlobalActive = false;
                }
            }

            this.exchanges = {
                ...this.exchanges,
                Global: {
                    ...this.exchanges.Global,
                    active: isGlobalActive
                },
                [key]: {
                    ...this.exchanges[key],
                    active: value
                }
            };
        }
    }

    @action.bound setExchangeApiSynced(exchangeName, isSynced) {
        if (exchangeName === 'Global') {
            const keys = Object.keys(this.exchanges);
            let newExchanges = {};
            for (let i = 0; i < keys.length; i++) {
                newExchanges = {
                    ...newExchanges,
                    [keys[i]]: {
                        ...this.exchanges[keys[i]],
                        apiSynced: false
                    }
                };
            }
            this.exchanges = {
                ...newExchanges,
                Global: {
                    ...this.exchanges.Global,
                    apiSynced: isSynced,
                },
            };
        } else {
            this.exchanges = {
                ...this.exchanges,
                Global: {
                    ...this.exchanges.Global,
                    apiSynced: false
                },
                [exchangeName]: {
                    ...this.exchanges[exchangeName],
                    apiSynced: isSynced,
                },
            };
        }
    }

    @action.bound setExchange(exchangeName) {
        if (exchangeName === 'Global') {
            this.selectedExchange = {
                name: 'Global',
                icon: ''
            };
        } else if (this.marketExchanges && this.marketExchanges.length > 0) {
            for (let i = 0; i < this.marketExchanges.length; i++) {
                if (this.marketExchanges[i].name.toLowerCase() === exchangeName.toLowerCase()) {
                    this.selectedExchange = this.marketExchanges[i];
                    break;
                }
            }
        }
    }

    @action.bound getActiveExchanges() {
        let activeExchange = '';
        let activeExchanges = 0;
        for (let i = 0; i < this.marketExchanges.length; i++) {
            if (this.exchanges[this.marketExchanges[i].name] && this.exchanges[this.marketExchanges[i].name].active) {
                activeExchanges++;
                activeExchange = this.marketExchanges[i].name;
            }
        }

        const exchangesKeys = Object.keys(this.exchanges);

        const isGlobal = !exchangesKeys.length || !exchangesKeys.some(name => this.exchanges[name].active) || (this.exchanges.Global && this.exchanges.Global.active);

        if (isGlobal) {
            return 'Global';
        }

        return activeExchanges === 0
            ? this.validMarketExchanges.length === 1
                ? this.validMarketExchanges[0].name
                : `${this.validMarketExchanges.length} Exchanges`
            : activeExchanges === 1
            ? activeExchange
            : `${activeExchanges} Exchanges`;
    }

    @action.bound setExchangeSearchValue(value) {
        this.exchangeSearchValue = value;
    }

    @action.bound clearExchanges() {
        this.exchanges = {};
    }
}

export default (instrumentStore, settingsStore, snackbar, viewModeStore, smsAuthStore) => {
    const store = new ExchangesStore(instrumentStore, settingsStore, snackbar, viewModeStore, smsAuthStore);
    return store;
};
