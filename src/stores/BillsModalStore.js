import { observable, action } from 'mobx';

import BillChipStore from './BillChipStore';

class BillsModalStore {
    @observable baseChip;
    @observable quoteChip;
    @observable isOpen = false;
    PortfolioData = null;

    constructor(yourAccountStore) {
        this.baseChip = BillChipStore(yourAccountStore);
        this.quoteChip = BillChipStore(yourAccountStore);

        this.baseChip.setSymbol('BTC');
        this.quoteChip.setSymbol('USDT');
    }

    @action.bound showBillChips() {
        this.isOpen = true;

        this.baseChip.listUserBillsRequest();
        this.quoteChip.listUserBillsRequest();
    }

    @action.bound onClosePopup() {
        this.isOpen = false;
    }
}

export default (yourAccountStore) => {
    const store = new BillsModalStore(yourAccountStore);
    return store;
};
