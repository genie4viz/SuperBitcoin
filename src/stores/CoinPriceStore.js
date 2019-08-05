import { observable } from 'mobx';

class CoinPriceStore {
    @observable price = 0;
    @observable maxAmount = 0;
    @observable arbitrageAmount = 0;
    // "ok": 1,
    // "data": {
    //     "rate": 3621.4158,
    //     "amounts": {
    //         "BTC-USDT": {
    //             "fromCoin": "BTC",
    //             "toCoin": "USDT",
    //             "maxAmount": 28.525185,
    //             "arbitrageAmount": 2.7540162
    //         },
    //         "USDT-BTC": {
    //             "fromCoin": "USDT",
    //             "toCoin": "BTC",
    //             "maxAmount": 102558.71,
    //             "arbitrageAmount": 92578.98
    //         }
    //     }
    // }

    updatePrice(base, quote, rates) {
        const baseName = (base || '').replace('F:', '');
        const quoteName = (quote || '').replace('F:', '');

        try {
            this.price = Number(rates.data.rate) || 0;
        } catch(err) {
            this.price = 0;
        }

        try {
            this.maxAmount = rates.data.amounts[`${baseName}-${quoteName}`].maxAmount || 0;
        } catch(err) {
            this.maxAmount = 0;
        }

        try {
            this.arbitrageAmount = rates.data.amounts[`${baseName}-${quoteName}`].arbitrageAmount || 0;
        } catch(err) {
            this.arbitrageAmount = 0;
        }
    }
}

export default (priceChartStore) => new CoinPriceStore(priceChartStore);
