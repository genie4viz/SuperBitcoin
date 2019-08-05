import { observable, action } from 'mobx';

class RightLowerSectionGridStore {

    @observable selectedIndex = 0;
    setTargetTradeHistoryTicket = () => {};
    Modal = () => {};

    constructor(setTargetTradeHistoryTicket, Modal) {
        this.setTargetTradeHistoryTicket = setTargetTradeHistoryTicket;
        this.Modal = Modal;
    }

    @action.bound
    handleSelectChange = index => {
        this.selectedIndex = index;
    };

    @action.bound
    changeSelectIndex = (id) => {
        this.selectedIndex = id;
    };
}

export default (setTargetTradeHistoryTicket, Modal) => {
    return new RightLowerSectionGridStore(setTargetTradeHistoryTicket, Modal);
};
