import { observable, action } from 'mobx';

import { ListUserBillsRequest } from '../lib/bct-ws';

class BillChipStore {
    @observable symbol = '';
    @observable withdrawAmount = 0;
    @observable isDeposit = false;
    @observable isReceivedUserBills = false;
    @observable listUserBills = [];

    @action.bound setSymbol(symbol) {
        this.symbol = symbol;
    }

    @action.bound changeDepositMode(mode) {
        this.isDeposit = mode;
    }

    @action.bound setWithdrawAmount(amount) {
        this.withdrawAmount = amount;
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
    const store = new BillChipStore();
    return store;
};
