import { action } from 'mobx';
import { PaymentRequest } from '../lib/bct-ws';

class PaymentStore {
    @action.bound sendPaymentRequest(Type, Name, Number, ExpDate, Cvv) {
        PaymentRequest(Type || '', Name || '', Number || '', ExpDate || '', Cvv || '');
    }
}

export default () => new PaymentStore();
