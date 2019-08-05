import { observable, action } from 'mobx';

import { CoinAddressRequest, WithdrawRequest } from '../lib/bct-ws';

class CoinAddressStore {
    @observable symbol = '';
    @observable coinDepositAddress = '';
    @observable errMsg = '';

    @action.bound createDepositAddress(symbol) {
        return new Promise((resolve) => {
            if (this.symbol !== symbol) {
                let payload;
                this.symbol = symbol;
                this.coinDepositAddress = '';
                if (!localStorage.getItem('authToken')) {
                    payload = { Coin: symbol };
                    CoinAddressRequest(payload).then(res => {
                        this.coinDepositAddress = res;
                        resolve(res);
                    });
                } else {
                    const clientId = localStorage.getItem('authClientId');
                    payload = { Coin: symbol, ClientId: clientId };
                    CoinAddressRequest(payload).then(res => {
                        this.coinDepositAddress = res;
                        resolve(res);
                    });
                }
            }
        });
    }

    @action.bound withdrawDeposit(coin, address, amount) {
        // --- validation ---
        if (!coin || !address || !amount) {
            this.errMsg = 'Please input correct values';
        }

        // --- send request to websocket ---
        const payload = {
            Coin: coin,
            Address: address,
            Amount: amount,
        };

        WithdrawRequest(payload).then(() => {
            console.log('[WithdrawRequest has sent]');
        });
    }
}

export default () => {
    const store = new CoinAddressStore();
    return store;
};
