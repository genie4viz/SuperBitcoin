import {action, observable} from "mobx";

class DonutMockStore {
    @observable data = [];
    @observable totalBalance = 0;
    accountStoreRef = null;
    baseCoins = [];

    constructor(yourAccountStore, instrumentStore) {
        this.accountStoreRef = yourAccountStore;

        instrumentStore.baseCoinsReaction(
            (bases) => {
                this.baseCoins = this.filterList(bases);
                this.baseCoins = this.filterListWithCoin(this.baseCoins, 'BTC'); // remove btc from C1
                clearInterval(this.handleMockTimer);
                this.handleMockTimer = setInterval(() => this.generateMockList(), 12000);
            }
        )
    }

    /**
     *  Remove BCT/TUSD from lists
     */
    filterList = (list) =>
        list.filter(({ symbol } = {}) => symbol !== 'BCT' && symbol !== 'TUSD');

    /**
     *  Filter list with coin
     */
    filterListWithCoin = (list, coin) =>
        list.filter(({ symbol } = {}) => symbol !== coin);

    getRandomArbitrary = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    generateMockList = () => {
        const mockArray = [];
        const usdtOfBTC = this.accountStoreRef.getPriceOf('BTC') || 0;
        let totalBTCAmount = 0;

        for (let i = 0; i < this.baseCoins.length; i++) {
            let Position = 0;
            let Amount = 0;
            let USD = 0;
            if (i < 6) {
                Position = this.baseCoins[i].price > 0 ? usdtOfBTC / this.baseCoins[i].price : 0;
                Amount = Position > 0 ? this.getRandomArbitrary(0.99, 1.001) : 0;
                USD = Amount * usdtOfBTC;
            } else {
                Amount = this.baseCoins[i].price > 0 ? this.getRandomArbitrary(0.99 * (1 - i * 0.05), 1.001 * (1 - i * 0.05)) : 0;
                Position = Amount > 0 ? Amount * usdtOfBTC / this.baseCoins[i].price : 0;
                USD = Amount * usdtOfBTC;
            }
            if (Amount > 0 && Position > 0) {
                mockArray.push({
                    symbol: this.baseCoins[i].symbol,
                    coinName: this.baseCoins[i].name,
                    Position,
                    Amount,
                    USD,
                    base: 'BTC',
                    color: this.baseCoins[i].hex,
                });
                totalBTCAmount += Number(Amount);
            }
            if (i > 15) break;
        }

        this.totalBalance = totalBTCAmount;
        this.data = mockArray;
    }

    @action.bound getBTCBalanceOf(symbol) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].symbol === symbol)
                return this.data[i].Amount;
        }
        return 0;
    }

    @action.bound getPositionOf(symbol) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].symbol === symbol)
                return this.data[i].Position;
        }
        return 0;
    }
}

export default (yourAccountStore, instrumentStore) => {
    return new DonutMockStore(yourAccountStore, instrumentStore);
};
