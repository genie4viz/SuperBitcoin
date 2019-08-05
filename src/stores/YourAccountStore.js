/* eslint-disable */
import { observable, action, computed, toJS, reaction } from 'mobx';
import {
    PositionRequest,
    PositionReply,
    ResetDemoBalancesRequest,
    coinsForWalletReply,
    coinsForWalletRequest,
    GetExchangeBalances,
    EditMemberInformationRequest,
    GetMemberInformationRequest
} from '../lib/bct-ws';

import { ClientId } from '../config/constants';
import partial from 'lodash.partial';
import {
    normalizeYourAccountPositionDataWithAllCoins,
    registerForPositionReplies,
    updatePosition,
    updatePositionError
} from './utils/YourAccountStoreUtils';
import { convertArrToMapWithFilter } from './utils/storeUtils';
import findIndex from 'lodash/findIndex';
import { getScreenInfo } from '@/utils'
const { isMobileDevice } = getScreenInfo(true);

class YourAccountStore {
    @observable isLoaded = false;
    @observable.shallow CoinsForWallet = [];
    @observable isCoinsForWalletLoaded = false;
    @observable.shallow PortfolioData = [];
    @observable storeCredit = 0;
    @observable PortfolioValue = null;
    @observable.shallow PortfolioPieChartData = [];
    @observable.shallow baseCoins = [];
    @observable.shallow quoteCoins = [];
    @observable.shallow coinsInMyWallet = [];   // TODO: need to investigation differences CoinsForWallet
    @observable OrderEventsData = new Map();

    @observable baseCoinIndex = 0;
    @observable baseSelectedCoin = '';
    @observable quoteSelectedCoin = '';
    @observable baseCoinPrice = 0;
    @observable quoteCoinPrice = 0;
    @observable changeInPercent = 0;
    @observable resetWalletTable = false;
    @observable isSendFormOpened = false;
    @observable baseCoinBalance = 0;
    @observable quoteCoinBalance = 0;
    @observable isPositionLoaded = false;

    // Set default C1 = USD
    @observable selectedCoin = 'F:USD';

    @observable isNewUser = null; // new to payapp?
    @observable exchangeBalances = [];
    @observable memberInfo = null;

    coinsInterval = null;
    instrumentStoreRef = null;
    arbMode = false;

    isRecentPositionPassed = true;
    timerHandleForRecentPositionCheck = null;
    MAX_LIMIT_RECENT_CHECK = 30;

    requestPositionTimeout = null;

    constructor (instrumentStore) {
        // Register to receive CoinsForWallet
        coinsForWalletReply({}).subscribe({
            next: this.updateCoinsForWallet,
            error: e => console.log(e)
        });
        this.getExchangeBalances();

        registerForPositionReplies(
            PositionReply,
            localStorage.getItem('authClientId') || ClientId,
            partial(updatePosition, this.updateYourAccountStoreData),
            updatePositionError
        );

        // Get selected base coin index in wallet table
        instrumentStore.instrumentsReaction(
            async (base, quote) => {
                this.baseSelectedCoin = base;
                this.quoteSelectedCoin = quote;

                this.setSelectedCoinData();

                const isLoggedIn = localStorage.getItem('signedin');
                // if (!isLoggedIn) {
                //     this.setSelectedCoin(base);
                // }
            },
            true
        );

        instrumentStore.baseCoinsReaction(
            (bases) => {
                this.baseCoins = this.filterList(bases);
            }
        )

        instrumentStore.quoteCoinsReaction(
            (quotes) => {
                this.quoteCoins = this.filterList(quotes);
            }
        )

        this.instrumentStoreRef = instrumentStore;

        reaction(
            () => this.CoinsForWallet,
            () => {
                if (this.isCoinsForWalletLoaded) {
                    setTimeout(
                        () => PositionRequest(localStorage.getItem('authClientId') || ClientId),
                        500
                    );
                }
            },
            {
                fireImmediately: true,
            }
        );

        this.selectedCoin = 'BTC';
        this.isRecentPositionPassed = true;
    }

    /**
     *  Remove BCT/TUSD from lists
     */
    filterList = (list) =>
        list.filter(({ symbol } = {}) => symbol !== 'BCT' && (isMobileDevice || symbol !== 'TUSD'));


    /**
     * Get coins in my wallet as MAP array
     * This builds top group of dropdown, removing items in top group from bottom group.
     */
    setCoinInMyWallet () {
        for (let i = 0; i < this.PortfolioData.length; i++) {
            if (this.PortfolioData[i] && Number.parseFloat(this.PortfolioData[i].Position) > 0.0001) {
                // low limit is 0.0001
                // coin is in wallet, if baseList has it, remove from base list and add here, if not, just add new disabled one to list.
                const symbol = (this.PortfolioData[i].Coin || '').replace('S:', 'F:');

                // Disabled TopGroupItems, 2019-01-11
                let index = this.baseCoins.findIndex(x => x.symbol === symbol);
                if (index !== -1) {
                    this.coinsInMyWallet.push({
                        ...this.baseCoins[index],
                        position: this.PortfolioData[i].Position
                    });
                    this.baseCoins.splice(index, 1);
                }
            }
        }
    }

    @computed.struct
    get portfolioData () {
        return toJS(this.PortfolioData);
    }

    @computed.struct
    get portfolioPieChartData () {
        return toJS(this.PortfolioPieChartData);
    }

    @action.bound
    requestCoinsForWallet () {
        coinsForWalletRequest();
    }

    @action.bound
    updateCoinsForWallet (eventData) {
        const { event, data = [] } = eventData;

        let coinsHash = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].length >= 7) {
                coinsHash.push({
                    coin: data[i][0],
                    symbolId: data[i][1],
                    isEnabled: data[i][2] === 1,
                    price: data[i][3],
                    priceChange24: data[i][4],
                    marketVolume24: data[i][5],
                    marketCap: data[i][6],
                    AmountUsd: 0,
                    Coin: data[i][0],
                    Position: 0,
                    fullName: data[i][9],
                });
            }
        }

        if (event === 'CoinsForWallet') {
            this.CoinsForWallet = coinsHash;
            this.isCoinsForWalletLoaded = true;
            if (!localStorage.getItem('signedin')) {
                this.updateYourAccountStoreData([]);
            }
        }
    };

    @action.bound
    updateYourAccountStoreData (Positions, response, event) {
        if (this.isSendFormOpened) return;
        const YourAccountPositions = normalizeYourAccountPositionDataWithAllCoins(Positions, this.CoinsForWallet);

        const isLoggedIn = localStorage.getItem('signedin');
        if (!isLoggedIn) {
            this.isNewUser = true;
            this.PortfolioValue = null;
        } else {
            this.PortfolioValue = Positions;
            this.isNewUser = this.PortfolioValue.length === 0;
        }
        this.isPositionLoaded = (Positions.length > 0);

        if (YourAccountPositions.length > 0) {
            this.PortfolioData = YourAccountPositions;
            this.OrderEventsData.clear();
            this.instrumentStoreRef.setActivePostions(Positions);
            convertArrToMapWithFilter(this.OrderEventsData, YourAccountPositions);

            /**
             *  Get Store Credit(BCT balance)
             */
            const bctIndex = findIndex(this.PortfolioData, { Coin: 'BCT' });
            if (bctIndex !== -1) {
                this.storeCredit = (this.PortfolioData[bctIndex] && this.PortfolioData[bctIndex].Amount) || 0;
            } else {
                this.storeCredit = 0;
            }

            this.setSelectedCoinData();
            this.setCoinInMyWallet();
        }

        if (!this.isLoaded)
            this.isLoaded = true;
    }

    @action.bound setSelectedCoinData = () => {
        let basePortfolioData;
        let quotePortfolioData;

        if (!this.baseSelectedCoin || !this.quoteSelectedCoin) return;

        try {
            for (let i = 0; i < this.PortfolioData.length; i++) {
                if (this.PortfolioData[i] && this.PortfolioData[i].Coin === this.baseSelectedCoin) {
                    basePortfolioData = this.PortfolioData[i];
                    this.baseCoinPrice = this.PortfolioData[i].Price;
                    this.baseCoinBalance = this.PortfolioData[i].Position;
                }
                if (this.PortfolioData[i] && this.PortfolioData[i].Coin === this.quoteSelectedCoin) {
                    quotePortfolioData = this.PortfolioData[i];
                    this.quoteCoinPrice = this.PortfolioData[i].Price;
                    this.quoteCoinBalance = this.PortfolioData[i].Position;
                }
                if (basePortfolioData && quotePortfolioData) break;
            }

            if (basePortfolioData && quotePortfolioData) {
                this.baseCoinPrice = basePortfolioData.Price;
                this.quoteCoinPrice = quotePortfolioData.Price;

                const baseCoinCurrentPrice = Number.parseFloat(basePortfolioData.Price);
                const baseCoinPrevPrice = Number.parseFloat(basePortfolioData.Price) - Number.parseFloat(basePortfolioData.Change);
                const quoteCoinCurrentPrice = Number.parseFloat(quotePortfolioData.Price);
                const quoteCoinPrevPrice = Number.parseFloat(quotePortfolioData.Price) - Number.parseFloat(quotePortfolioData.Change);

                const prevRate = quoteCoinPrevPrice > 0 ? baseCoinPrevPrice / quoteCoinPrevPrice : 0;
                const currentRate = quoteCoinCurrentPrice > 0 ? baseCoinCurrentPrice / quoteCoinCurrentPrice : 0;

                this.changeInPercent = prevRate > 0 ? (currentRate / prevRate - 1) * 100 : 0;
            }
        } catch (err) {
            console.log(err);
        }
    };

    balancesReaction = (reactionHandler, fireImmediately = true) => {
        return reaction(
            () => ({
                baseCoinBalance: this.baseCoinBalance,
                quoteCoinBalance: this.quoteCoinBalance
            }),
            (data) => reactionHandler(data),
            { fireImmediately }
        )
    }

    @action.bound getExchangeBalances = async () => {
        const balances = await GetExchangeBalances();
        this.exchangeBalances = balances.data;
    }

    @action.bound
    resetWalletTableState () {
        this.resetWalletTable = !this.resetWalletTable;
    }

    @action.bound resetDemoBalances () {
        ResetDemoBalancesRequest();
    }

    @action.bound setSelectedCoin (coin) {
        this.selectedCoin = coin;
    }

    @action.bound setSendFormState (mode) {
        this.isSendFormOpened = mode;
    }

    requestPosition () {
        setTimeout(
            PositionRequest(localStorage.getItem('authClientId') || ClientId),
            500
        );
    }

    requestPositionWithReply () {
        registerForPositionReplies(
            PositionReply,
            localStorage.getItem('authClientId') || ClientId,
            partial(updatePosition, this.updateYourAccountStoreData),
            updatePositionError
        );

        this.baseCoinIndex = 0;

        setTimeout(
            PositionRequest(localStorage.getItem('authClientId') || ClientId),
            500
        );
    }

    @action.bound getPriceOf(coin) {
        for (let i = 0; i < this.PortfolioData.length; i++) {
            if (this.PortfolioData[i] && this.PortfolioData[i].Coin === coin) {
                return this.PortfolioData[i].Price;
            }
        }
        return 0;
    }

    @action.bound updateUserInformation(info) {
        return new Promise((resolve, reject) => {
            EditMemberInformationRequest(info).then(res => {
                this.memberInfo = res;
                // console.log(res);
                resolve(res.MemberInformation);
            }).catch(err => console.log(err));
        });
    }

    @action.bound getUserInformation() {
        return new Promise((resolve, reject) => {
            GetMemberInformationRequest().then(res => {
                this.memberInfo = res;
                // console.log(res);
                resolve(res.MemberInformation);
            }).catch(err => console.log(err));
        });
    }
}

export default (instrumentStore) => {
    return new YourAccountStore(instrumentStore);
};
