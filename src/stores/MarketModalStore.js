import { observable, action } from 'mobx';

import { ListUserBillsRequest } from '../lib/bct-ws';

class MarketModalStore {
    @observable isOpen = false;
    @observable symbol = '';
    @observable isReceivedUserBills = false;
    @observable listUserBills = [];

    @action.bound setSymbol(symbol) {
        this.symbol = symbol;
    }

    @action.bound showModal(symbol) {
        this.symbol = symbol;
        this.listUserBillsRequest();
        this.isOpen = true;
    }

    @action.bound closeModal() {
        this.isOpen = false;
    }

    @action.bound listUserBillsRequest() {
        this.isReceivedUserBills = false;
        this.listUserBills = [];

        return new Promise((resolve) => {
            ListUserBillsRequest(this.symbol)
                .then(res => {
                    const bills = res.Bills;
                    bills.sort((a, b) => b.Nominal - a.Nominal);

                    this.isReceivedUserBills = true;
                    this.listUserBills = bills;
                    resolve(res);
                })
                .catch(() => {
                    this.isReceivedUserBills = true;
                    this.listUserBills = [];
                    resolve([]);
                });
        });
    }
}

export default () => {
    const store = new MarketModalStore();
    return store;
};
