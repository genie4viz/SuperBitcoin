import distanceInWords from 'date-fns/distance_in_words';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import moment from 'moment';

import { roundToFixedNum } from '@/utils';

export const isDiffArr = (a = [], b = []) => {
    let i = -1;
    const alen = a.length;

    while (++i < alen) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
};

export const updateMapStoreFromArrayForOrderBook = (nextData, multiLegRate, multiLegPriceRate, noise) => {
    // allways from smaller to bigger
    const size = nextData.length;
    const result = [];
    let cumulativeAmount = 0;
    for (let i = 0; i < size; i++) {
        const [price, amount, exchanges] = nextData[i];
        cumulativeAmount += amount;

        result.push({
            price: price * multiLegPriceRate + noise,
            amount: amount * multiLegRate,
            amountQuote: price * amount,
            exchange: exchanges ? exchanges.toUpperCase() : '',
            total: i < size - 1 ? nextData[i + 1][0] : price,
            cumulativeAmount,
        });
    }

    return result;
};

export const shiftMapStoreFromArray = (mapStore = new Map(), updateArr = [], maxRows = 0) => {
    const updateArrLen = updateArr.length;

    if (updateArrLen >= maxRows) {
        let i = -1;
        while (updateArr[++i] && i < maxRows) {
            mapStore.set(i, updateArr[i]);
        }
    } else {
        const tmp = new Map();
        const carryLimit = maxRows - updateArrLen;
        let i = -1;
        let j = updateArrLen - 1;

        // cache old indices
        while (++i < carryLimit && mapStore.has(i) && ++j < maxRows) {
            tmp.set(j, mapStore.get(i));
        }

        // then prepend incoming updateArr to mapStore
        i = -1;
        while (++i < updateArrLen) {
            mapStore.set(i, updateArr[i]);
        }

        /* eslint-disable-next-line */
        for (let [k, v] of tmp) {
            mapStore.set(k, v);
        }
    }
};

export const convertArrToMapWithFilter = (mapStore, updateArr) => {
    let j = 0;

    for (let i = 0; i < updateArr.length; i++) {
        if (updateArr[i] && updateArr[i].Coin !== 'BCT') {
            mapStore.set(j, updateArr[i]);
            j++;
        }
    }
};

export const formatNumForDisplay = (num) => roundToFixedNum(num, 2);

export const calculateFee = (size, price, precision) => formatNumForDisplay(size * price * 0.001, precision);

export const getTimeFormatted = (time) => distanceInWords(
    parse(time),
    new Date(),
    { includeSeconds: true }
);

export const scheduleVisualDOMUpdate = fn => {
    requestAnimationFrame(fn);
};

export const getDateFormatted = (time) => format(new Date(time), 'MM.DD.YYYY');

export const getNewDateFormatted = (time) => {
    return moment(time).format('MMM D');
};
