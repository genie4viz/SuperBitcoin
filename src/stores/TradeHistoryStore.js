import {
    observable, action
} from 'mobx';
import { TransferHistoryRequest } from '../lib/bct-ws';

class TransferHistoryStore {
    @observable TransferHistoryData = [];
    @observable historyCurrency = 'tusd';

    constructor() {

        if (localStorage.getItem('authToken')) {
            this.requestTransferHistory();
        }
    }

    @action.bound requestTransferHistory() {
        const payload = {
            CurrencyId: 'TUSD',
        };

        return TransferHistoryRequest(payload)
            .then(res => {
                if(res.Status === 'success') {
                    try {
                        res.UserTransfers.sort(function compare(a, b) {
                            const dateA = new Date(a.CreatedAt).getTime();
                            const dateB = new Date(b.CreatedAt).getTime();
                            return dateB - dateA;
                        });
                        this.TransferHistoryData = res.UserTransfers.filter(item => item.Status !== 'expired');
                        this.TransferHistoryData = this.transferHistory.map(item => {
                            if (item.TrType === 'promo-New') item.Status = 'Promo';
                            return item;
                        })
                        this.isEmpty = this.TransferHistoryData.length === 0;
                        return Promise.resolve(this.TransferHistoryData);
                    } catch (e) {
                        return Promise.resolve([]);
                    }
                }
            })
            .catch(e => {
                this.TransferHistoryData = [];
                return Promise.reject(e);
            });
    }

    @action.bound resetTransferHistory() {
        this.TransferHistoryData = [];
    }
}

export default (instrumentStore, settingsStore) => {
    return new TransferHistoryStore(instrumentStore, settingsStore);
};
