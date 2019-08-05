import once from 'lodash.once';
import { computed, observable } from 'mobx';

class OrderEventsStore {
    @observable OrderEvents = new Map();
    __subscriptionInited = false;
    OrderEvents$ = null;

    constructor() {
        this.initRecentTradesSubscription();
    }

    initRecentTradesSubscription = once(() => {
        // this.OrderEvents$ = OrderEvents({
        //     throttleMs,
        // });
        //
        // // this.OrderEvents$.subscribe({next: this.handleOrderEvents.bind(this)})
        //
        // this.__subscriptionInited = true;
    })

    handleOrderEvents(
        orderEvents
    ) {
        orderEvents
            .forEach(({
                Exchange, Symbol, Amount, Price, AmountFilled, Status, TicketId, QuoteSymbol, BaseSymbol, Side,
            }) => {
                let event = this.OrderEvents.get(`${TicketId}-${Exchange}`);

                if (event) {
                    event = {
                        ...event,
                        AmountFilled: Side === 'Sell' ? event.AmountFilled + (AmountFilled * Price) : event.AmountFilled + AmountFilled,
                        Status,
                        // Price, // average???
                    };

                    this.OrderEvents.set(`${TicketId}-${Exchange}`, event);
                } else {
                    this.OrderEvents.set(`${TicketId}-${Exchange}`, {
                        Exchange,
                        Symbol,
                        Amount,
                        Price,
                        AmountFilled,
                        Status,
                        QuoteSymbol,
                        BaseSymbol,
                    });
                }
            });
    }

    @computed get orderEvents() {
        return this.OrderEvents;
    }

    @computed get orderEventsKeys() {
        return this.OrderEvents.keys();
    }
}

export default () => {
    const store = new OrderEventsStore();
    return store;
};
