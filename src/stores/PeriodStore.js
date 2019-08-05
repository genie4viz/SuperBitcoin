import { observable, action } from 'mobx';
import {
    MONTH, WEEK, DAY, HOUR, YEAR
} from '../config/constants';

export const periodKeys = {
    hourSelectKey: HOUR,
    daySelectKey: DAY,
    weekSelectKey: WEEK,
    monthSelectKey: MONTH,
    yearSelectKey: YEAR,
};

class PeriodStore {
    @observable selectedPeriod = periodKeys.yearSelectKey;

    @action.bound selectPeriod(selectedPeriodKey) {
        this.selectedPeriod = selectedPeriodKey;
    }
}

export default () => {
    const store = new PeriodStore();
    return store;
};
