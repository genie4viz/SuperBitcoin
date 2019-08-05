import { action } from 'mobx';
import { DepositAddressRequest, TelegramIdRequest, WithdrawalRequest } from '../lib/bct-ws';

class CoinTransferStore {
    @action.bound withdrawalRequestWith(coin, amount, address) {
        return WithdrawalRequest(coin, amount, address);
    }

    @action.bound DepositAddressRequest(address) {
        DepositAddressRequest(address);
    }

    @action.bound TelegramIdRequest(id) {
        TelegramIdRequest(id);
    }
}

export default () => {
    const store = new CoinTransferStore();
    return store;
};
