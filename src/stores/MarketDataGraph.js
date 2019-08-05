/* eslint-disable */
import { ALL, YEAR, MONTH, WEEK, DAY, HOUR, PERIOD, RANGE_OPTIONS, TELEGRAM_AUTH_URL } from "../config/constants";
import { observable, computed, action, reaction } from "mobx";

class MarketDataGraphStore {
    @observable.shallow Candles = [];
    @observable.shallow Columns = [];
    @observable.shallow randomMaxes = [];
    @observable.shallow randomMins = [];
    @observable.shallow randomDiffMaxes = [];
    @observable.shallow fakeGraphs = [];
    @observable.shallow fakeGraphdiffs = [];
    @observable isLoaded = false;
    @observable diffMax = 0;
    @observable min = 0;
    @observable max = 0;
    @observable yMin = 0;
    @observable yMax = 0;
    @observable rangeIndex = 4;
    @observable ratioBaseQuote = 0;

    constructor (instrumentStore, periodStore) {
        // instrumentStore.instrumentsReaction(
        //     async (base, quote) => {
        //         this.base = base;
        //         this.quote = quote;
        //         this.submitCandlesRequest(base, quote, periodStore.selectedPeriod);
        //     },
        //     true
        // );
        //
        // reaction(
        //     () => {
        //         return periodStore.selectedPeriod;
        //     },
        //     (selectedPeriod) => {
        //         switch (selectedPeriod) {
        //             case YEAR:
        //                 this.rangeIndex = 4;
        //                 break;
        //             case MONTH:
        //                 this.rangeIndex = 3;
        //                 break;
        //             case WEEK:
        //                 this.rangeIndex = 2;
        //                 break;
        //             case DAY:
        //                 this.rangeIndex = 1;
        //                 break;
        //             case HOUR:
        //                 this.rangeIndex = 0;
        //                 break;
        //             default:
        //                 break;
        //         }
        //         this.submitCandlesRequest(this.base, this.quote, selectedPeriod);
        //     }
        // );
    }

    async submitCandlesRequest (base, quote, selectedPeriod = YEAR) {
        let url, grapArr = [], columnArr = [], rangeIndex = 4;

        switch (selectedPeriod) {
            case YEAR:
                url = `https://min-api.cryptocompare.com/data/${RANGE_OPTIONS[4].endpoint}?fsym=${base}&tsym=${quote}&aggregate=${RANGE_OPTIONS[4].aggregate}&limit=${RANGE_OPTIONS[4].limit}`;
                rangeIndex = 4;
                break;
            case MONTH:
                url = `https://min-api.cryptocompare.com/data/${RANGE_OPTIONS[3].endpoint}?fsym=${base}&tsym=${quote}&aggregate=${RANGE_OPTIONS[3].aggregate}&limit=${RANGE_OPTIONS[3].limit}`;
                rangeIndex = 3;
                break;
            case WEEK:
                url = `https://min-api.cryptocompare.com/data/${RANGE_OPTIONS[2].endpoint}?fsym=${base}&tsym=${quote}&aggregate=${RANGE_OPTIONS[2].aggregate}&limit=${RANGE_OPTIONS[2].limit}`;
                rangeIndex = 2;
                break;
            case DAY:
                url = `https://min-api.cryptocompare.com/data/${RANGE_OPTIONS[1].endpoint}?fsym=${base}&tsym=${quote}&aggregate=${RANGE_OPTIONS[1].aggregate}&limit=${RANGE_OPTIONS[1].limit}`;
                rangeIndex = 1;
                break;
            case HOUR:
                url = `https://min-api.cryptocompare.com/data/${RANGE_OPTIONS[0].endpoint}?fsym=${base}&tsym=${quote}&aggregate=${RANGE_OPTIONS[0].aggregate}&limit=${RANGE_OPTIONS[0].limit}`;
                rangeIndex = 0;
                break;
            default:
                url = "";
        }

        fetch(url)
            .then(response => response.json())
            .then(({ Response, Data }) => {
                if (Response !== "Success" || Data.length === 0) {
                    // throw Error("Error");
                    console.log('error');
                    return;
                }

                let initial = (Data[0].open + Data[0].close) / 2,
                    min = initial,
                    max = initial,
                    diffMax = 0;

                let prevValue = [null, null, null, null, null, null];

                let randomMaxes = [initial, initial, initial, initial, initial, initial];
                let randomMins = [initial, initial, initial, initial, initial, initial];
                let randomDiffMaxes = [0, 0, 0, 0, 0, 0];

                let fakeGraphs = [[], [], [], [], [], []];
                let fakeGraphdiffs = [[], [], [], [], [], []];

                Data.map(s => {
                    const value = (s.open + s.close) / 2;
                    grapArr.push([s.time * 1000, value]);

                    const diff = s.close - s.open;
                    columnArr.push([s.time * 1000, diff]);

                    if (max < value) {
                        max = value;
                    }

                    if (min > value) {
                        min = value;
                    }

                    if (diffMax < Math.abs(diff)) {
                        diffMax = Math.abs(diff);
                    }

                    for (let k = 0; k < 6; k++) {
                        if (prevValue[k] == null) prevValue[k] = value * (Math.random() * (0.92 - 1.08) + 1.08);
                        let random = Math.pow(Math.random(), 15) * Math.pow(-1, Math.floor(Math.random() * 10));
                        let valueForFake = value * (1 + (0.001 + 0.002 * Math.pow(rangeIndex, 3)) * random);
                        let diff = valueForFake - prevValue[k];

                        fakeGraphs[k].push(valueForFake);
                        fakeGraphdiffs[k].push(diff);
                        prevValue[k] = valueForFake;

                        if (randomMaxes[k] < valueForFake) randomMaxes[k] = valueForFake;
                        if (randomMins[k] > valueForFake) randomMins[k] = valueForFake;
                        if (randomDiffMaxes[k] < Math.abs(diff)) randomDiffMaxes[k] = Math.abs(diff);
                    }
                });

                this.ratioBaseQuote = grapArr[grapArr.length - 1][1];
                this.Candles = grapArr;

                this.Columns = columnArr;
                this.diffMax = diffMax;
                this.min = min;
                this.max = max;

                this.yMin = min - (max - min) * 0.3;
                if (this.yMin < 0) {
                    this.yMin = 0;
                }
                this.yMax = max + (max - min) * 0.15;

                this.randomMaxes = randomMaxes;
                this.randomMins = randomMins;
                this.randomDiffMaxes = randomDiffMaxes;
                this.fakeGraphs = fakeGraphs;
                this.fakeGraphdiffs = fakeGraphdiffs;

                if (!this.isLoaded)
                    this.isLoaded = true;
            });
    }

    @computed get candles () {
        return this.Candles;
    }

    @computed get columns () {
        return this.Columns;
    }
}

export default (instrumentStore, periodStore) => {
    const store = new MarketDataGraphStore(instrumentStore, periodStore);
    return store;
};
