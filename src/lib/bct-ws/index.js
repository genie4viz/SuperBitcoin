/* eslint-disable */
import socketCluster from 'socketcluster-client';
import { BehaviorSubject } from 'rxjs';
import throttle from 'lodash.throttle';
import uuidv4 from 'uuid/v4';

import { taskStateTracker } from '../../utils/taskStateTracker';
import { WS } from '../../config/constants';
import { refreshToken } from '../../utils';

const publisher = (throttleMs, publisher) => throttle(publisher, throttleMs, { trailing: false });

let clientLive;
let clientTrade;

let orderEventsPublisher1;

export const recentTradesObservable = new BehaviorSubject({});
export const aggregatedSummaryBooksObservable = new BehaviorSubject({});
export const OrderBooksResponseObservable = new BehaviorSubject({});
export const orderHistoryObservable = new BehaviorSubject({});
export const positionObservableForAuth = new BehaviorSubject({});
export const coinsForWalletObservable = new BehaviorSubject({});
export const orderEventsObservable = new BehaviorSubject({});
export const orderConfirmationObservable = new BehaviorSubject({});
export const exchPlanObservable = new BehaviorSubject({});
export const portfolioDataObservable = new BehaviorSubject({});
export const claimedTransferNotificationObservable = new BehaviorSubject({});
export const privateNetworkObservable = new BehaviorSubject({});
export const publicNetworkObservable = new BehaviorSubject({});

/**
 *  Public Websocket creation and connectivity event bindings
 *  TODO: rename this function! getClientLive implies no side effects - and also that it's live trading.
 *  leaving for until I've refactored all functions in this file and checked for usage elsewhere
 *
 *  Nevermind that "get" implies a lack of side effects...
 */
export const getClientLive = () => {
    return new Promise((resolve, reject) => {
        if (clientLive) {
            return resolve(clientLive);
        }

        const socket = socketCluster.create({
            port: WS.PUBLIC.PORT,
            hostname: WS.PUBLIC.HOST,
            autoReconnect: true
        });
        socket.on('connect', () => {
            publicNetworkObservable.next({ publicSocket: true });
            clientLive = socket;
            resolve(clientLive);
        });
        socket.on('disconnect', (code, data) => {
            // taskStateTracker.logError("WS-PUBLIC-DISCONNECTED");
            if (clientLive) {
                clientLive.off();
                clientLive = null;
            }
            publicNetworkObservable.next({ publicSocket: false });
            console.log('disconnected', {code, data});
            reject('public client disconnected');
        });
        socket.on('connectAbort', (code, data) => {
            if (clientLive) {
                clientLive.off();
                clientLive = null;
            }
            publicNetworkObservable.next({ publicSocket: false });
            console.log('connectAbort', {code, data});
            reject('public client connection abort');
        });
        socket.on('error', error => {
            if (clientLive) {
                clientLive.off();
                clientLive = null;
            }
            console.log('public socket error', error);
            reject('error');
        });
    });
};

/**
 *  Private Websocket creation and connectivity event bindings
 *  TODO: rename this function! getClientTrade implies trading-specific API, when really it's for anything requiring logged in user.
 *  leaving for until I've refactored all functions in this file and checked for usage elsewhere.
 *
 *  Nevermind that "get" implies a lack of side effects...
 */
export const getClientTrade = () => {
    return new Promise((resolve, reject) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return resolve(null);
            // return reject(new Error('unauth'));
        }
        if (clientTrade) {
            return resolve(clientTrade);
        }

        const socket = socketCluster.create({
            port: WS.PRIVATE.PORT,
            hostname: WS.PRIVATE.HOST,
            query: {
                token: authToken,
            },
            autoReconnect: true,
        });
        socket.on('connect', () => {
            privateNetworkObservable.next({ privateSocket: true });
            clientTrade = socket;
            resolve(clientTrade);
        });
        socket.on('disconnect', () => {
            if (clientTrade) {
                clientTrade.off();
                clientTrade = null;
            }
            taskStateTracker.logError("WS-PRIVATE-DISCONNECTED");
            privateNetworkObservable.next({ privateSocket: false });
            reject('private client disconnected');
        });
        socket.on('connectAbort', () => {
            if (clientTrade) {
                clientTrade.off();
                clientTrade = null;
            }
            privateNetworkObservable.next({ privateSocket: false });
            reject('private client connection abort');
        });
        socket.on('error', err => {
            if (clientTrade) {
                clientTrade.off();
                clientTrade = null;
            }
            console.log('private socket error', err);
            if (err && err.code === 4008) { // Server rejected handshake from client
                refreshToken().then(() => {
                    window.location.reload();
                });
            } else {
                reject('error');
            }
        });
    });
};

/*
 * getPublicSocket(): a safe and sane version of 'getClientLive()' - synchronous, returns a ref to the socket or null, you do what you like
 */
export const getPublicSocket = () => {
    return clientLive || null;
}

 /*
 * getPrivateSocket(): a safe and sane version of 'getClientTrade()' - synchronous, returns a ref to the socket or null, you do what you like
 */
export const getPrivateSocket = () => {
    const authToken = localStorage.getItem('authToken');

    return (authToken && clientTrade ? clientTrade : null);

}



/**
 *  MarketDataRequest
 */
export const MarketDataRequest = ({
    Symbols,
    ProgramId,
    throttleMs = 100,
}) => {
    if (!Array.isArray(Symbols)) {
        throw new Error(`Symbols needs to be non empty array [${Symbols}]`);
    }

    // getClientMarket()
    //     .then(cli => {
    //         cli.emit('MarketDataRequest', {
    //             symbols: Symbols,
    //             levels: 5000,
    //             throttleMs,
    //             // min,
    //             // max,
    //             // exchange,
    //         });

    //         // On reconnect
    //         cli.on('connect', () => {
    //             cli.emit('MarketDataRequest', {
    //                 symbols: Symbols,
    //                 levels: 5000,
    //                 throttleMs,
    //             });
    //         });
    //     })
    //     .catch(e => console.log(e.message || 'ClientMarket connection lost'));
};

/**
 *  MarketDataRequest for OrderBook table.
 */
export const OrderBookDataRequest = ({
    Symbols,
    ProgramId,
    throttleMs = 50,
}) => {
    if (!Array.isArray(Symbols)) {
        throw new Error(`Symbols needs to be non empty array [${Symbols}]`);
    }
    // getClientMarket()
    //     .then(cli => {

    //         cli.emit('MarketBreakdown', {
    //             symbols: Symbols,
    //             throttle: throttleMs,
    //             levels: 10,
    //             // exchanges: [2],
    //         });

    //         // On reconnect
    //         cli.on('connect', () => {
    //             cli.emit('MarketBreakdown', {
    //                 symbols: Symbols,
    //                 throttle: throttleMs,
    //                 levels: 10,
    //                 // exchanges: [2],
    //             });
    //         });
    //     })
    //     .catch(e => console.log(e.message || 'BCTSessionForOrderBook connection lost'));
};

/**
 *  RecentTrades data flow
 */
export const RecentTrades = ({
    Symbols,
    throttleMs = 250,
}) => {
    // getClientMarket()
    //     .then(cli => {
    //         const publishOnSubscription = publisher(throttleMs, data => {
    //             data = {
    //                 body: {
    //                     messages: [data],
    //                 },
    //             };
    //             recentTradesObservable.next(data);
    //         });
    //
    //         cli.on('recentTrades', publishOnSubscription);
    //     })
    //     .catch(e => console.log(e.message || 'getClientMarket connection lost'));

    return recentTradesObservable;
};

export const RecentTradesUpdate = ({
    Symbols,
    throttleMs = 250,
}) => {
};

/**
 *  SetExchange Request/Response to get filtered OrderBook data.
 */
export const SetOrderbookExchangeRequest = (exchange) => {
    const payload = {
        Exchange: exchange,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('SetExchangeRequest', payload);
                cli.once('SetExchangeResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientMarket'));
    });
};

/**
 *  Get Exchanges list for Market OrderBook data.
 */
export const getMarketExchangesRequest = (coinPair) => {
    const payload = {
        Market: coinPair,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('MarketExchangesRequest', payload);
                cli.once('ExchangesForMarket', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientMarket'));
    });
};

/**
 *  Submit Exchange Order request
 */
export const OrderTicket = ({ throttleMs = 250, orderType }) => Promise.resolve({
    SubmitOrderTicket: SubmitOrderTicket(orderType),
});


/* Deprecated: use SendOrderTicket */
const SubmitOrderTicket = (OrderType) => {
    taskStateTracker.logError("Usage of deprecated function SubmitOrderTicket in bct-ws/index.js");
    // TODO Something is calling SubmitOrderTicket not once but TWICE on page load.
    // Please remove. This function is deprecated and should be replaced with SendOrderTicket
    // when you want to submit a trade to the backend.
};

/*
 * This is the only working trading code I'm aware of.
 * Needs a backend tweak to allow us to roundtrip a client-generated unique ID in the payload but works
 * as long as there are no overlapping orders
 */
export const SendOrderTicket = (clientId, orderType, price, programId, route, side, size, symbol, ticketId) => {
    let opId = taskStateTracker.beginOperation("WS-SendOrderTicket");

    const payload = {
        ClientId: clientId,
        OrderType: orderType,
        Price: price,
        ProgramId: programId,
        Route: route,
        Side: side,
        Size: size,
        Symbol: symbol,
        TicketId: opId,
    };


    return new Promise((resolve, reject) => {

        //The callback for an event listener must be a named function... Why? So that you can remove it later!
        getClientTrade()
        .then(cli => {
            cli.emit('OrderTicket', payload);
            //Remove the event listener you set up last time...
            //cli.off("OrderConfirmation");
            //And recreate it for each order
            cli.once('OrderConfirmation', (data) => {
                taskStateTracker.endOperation(opId, {end_on: 'OrderConfirmation', response_data: data});
                resolve(data)
            });
        });
    });
};


/**
 *  Response of submitted order
 */
export const OrderEvents = ({
    throttleMs = 1,
}) => {
     getClientTrade().then(cli => {
            var throttleMsTime = 1;
            const publishOnSubscription = orderEventsPublisher1 || publisher(throttleMsTime, data => {
                //taskStateTracker.log({eventType: 'WS-OrderEvents-Receive-Publish', payload: data});
                orderEventsObservable.next(data);
            });
            //const publishOnSubscription2 = orderEventsPublisher2 ||publisher(throttleMsTime, data => {
                //taskStateTracker.log({eventType: 'WS-OrderConfirmation-Receive-Publish', payload: data});
                //orderConfirmationObservable.next(data);
            //});
            orderEventsPublisher1 = publishOnSubscription
            cli.once('OrderEvents', publishOnSubscription);
            //sock.on('OrderConfirmation', publishOnSubscription2);

            return orderEventsObservable;
    });
};

/**
 *  Wallet coins request
 */
export const PositionRequest = (ClientId) => {
    getClientTrade()
        .then(cli => {
            if (!cli) {
                return;
            }
            cli.emit('PositionRequest', { ClientId });
        })
        .catch(e => {
            console.log(e.message || 'can not getClientTrade');
            // Send empty wallet if not logged in
            PositionReply({ throttleMs: 0 });
        });
};

/**
 * An example of more readable implementation
 * @returns {Promise<void>}
 */
export const coinsForWalletRequest = () => {
    getClientLive()
      .then(cli => {
          cli.emit('CoinsForWallet');
      })
      .catch(e => console.log(e.message || 'can not getClientLive'));
};

export const coinsForWalletReply = ({ throttleMs = 0 }) => {
    getClientLive()
        .then(socket => {
            const publishOnSubscription = publisher(throttleMs, data => {
                coinsForWalletObservable.next({
                    event: 'CoinsForWallet',
                    data,
                });
            });

            socket.on('CoinsForWallet', publishOnSubscription);
        })
        .catch(e => {
            console.log(e.message || 'can not getClientLive');
        });

    return coinsForWalletObservable;
};

export const PositionReply = ({ throttleMs = 250 }) => {
    if (!localStorage.getItem('authToken')) {
        positionObservableForAuth.next({
            event: 'PositionResponseNotLoggedIn',
            data: {
                body: {
                    messages: [
                        {
                            Positions: [],
                        }
                    ],
                },
            },
        });
    } else {
        // Real wallet data
        getClientTrade()
            .then(cli => {
                const publishOnSubscription = publisher(throttleMs, data => {
                    let lData = {
                        body: {
                            messages: [{
                                Positions: data,
                            }],
                        },
                    };
                    positionObservableForAuth.next({
                        event: 'PositionResponse',
                        data: lData,
                    });
                });

                cli.on('PositionResponse', publishOnSubscription);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    }

    return positionObservableForAuth;
};

/**
 *  CoinPairSearch coins request
 *
 *  an example of delayed response (the previous version didn't take into account timeouts)
 */
export const CoinsRequest = ({
                                 Coin,
                             }) => {
    return new Promise(resolve => {
        getClientLive()
          .then(cli => {
              cli.emit('CoinsRequest2', { Coin });
              cli.once('CoinsResponse2', data => {
                  resolve(data);
              });
          })
          .catch(e => console.log(e.message || 'can not getClientLive'));
    });
};

/**
 *  Execution Plan
 *
 *  an example with bool result
 */
export const OrderExecutionPlanRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientLive()
          .then(cli => {
              cli.emit('StartExecPlan', payload);
              resolve(true);
          })
          .catch(e => console.log(e.message || 'can not getClientLive'));
    });
};

/* TODO: refactor calling code so we can use .once fix
 * likely an issue with lowestexchangestore or convertstore
 */
export const GetExecPlans = ({ throttleMs = 250 }) => {
    getClientLive()
        .then(cli => {
            const publishOnSubscription = publisher(throttleMs, data => {
                exchPlanObservable.next(data);
            });

            cli.on('ExecPlan', publishOnSubscription);
        })
        .catch(e => console.log(e.message || 'can not getClientLive'));

    return exchPlanObservable;
};

export const OrderStopExecutionPlan = (payload) => {
    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('StopExecPlan', payload);
                resolve(true);
            })
            .catch(e => {
                console.log(e.message || 'can not getClientLive');
                reject(e);
            });
    });
};

/**
 *  CoinAddressRequest
 */
export const CoinAddressRequest = (payload) => {
    if (!localStorage.getItem('authToken')) {
        return new Promise((resolve, reject) => {
            getClientLive()
              .then(cli => {
                  cli.emit('CoinAddressRequest', payload);
                  cli.once('CoinAddress', data => {
                      if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
                          resolve(data.Address);
                      }
                  });
              })
              .catch(e => console.log(e.message || 'can not getClientLive'));
        });
    }
    return new Promise((resolve, reject) => {
        getClientTrade()
          .then(cli => {
              cli.emit('CoinAddressRequest', payload);
              cli.once('CoinAddress', data => {
                  if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
                      resolve(data.Address);
                  }
              });
          })
          .catch(e => console.log(e.message || 'can not getClientTrade'));
    });

};

/**
 *  WithdrawRequest
 */
export const WithdrawRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('WithdrawRequest', payload);
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  ResetDemoBalances
 */
export const ResetDemoBalancesRequest = () => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('ResetDemoBalances', {});
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  TelegramTransferRequest
 */
export const TelegramTransferRequest = (payload) => {
    // {
    //     'Coin': 'btc',
    //     'Amount': '10',
    //     'To': '563959990',
    //     'Details': {
    //         'firstName': 'Igor',
    //         'lastName': 'Kovobski',
    //     }
    // }

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('TelegramTransferRequest', payload);
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  HistoryForCoinRequest
 */
export const HistoryForCoinRequest = (payload) => {
    // {
    //     Coin: "BTC",
    //     Limit: 10,
    //     Skip: 10
    // }

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('HistoryForCoinRequest', payload);
                cli.once('HistoryForCoinResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  Portfolio Data Request
 */
export const PortfolioDataRequest = (payload) => {
    getClientTrade()
        .then(cli => {
            cli.emit('PortfolioDataRequest', payload);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));
};

export const GetSettingsRequest = (payload) => {
    return getClientTrade()
        .then(client => {
            return new Promise((resolve, reject) => {
                try {
                    client.emit('SettingsRequest', payload);
                    client.once('Settings', data => resolve(data));
                } catch (e) {
                    reject(e);
                }
            });
        })
        .catch(e => {
            console.log(e.message || 'can not getClientTrade');
            return Promise.reject(e);
        });
};

export const UpdateSettingsRequest = (payload) => {
    return getClientTrade()
        .then(client => {
            return new Promise((resolve, reject) => {
                try {
                    client.emit('UpdateSettingsRequest', payload);
                    client.once('SettingsUpdate', data => resolve(data));
                } catch (e) {
                    reject(e);
                }
            });
        })
        .catch(e => {
            console.log(e.message || 'can not getClientTrade');
            return Promise.reject(e);
        });
};


/**
 * Adds exchange credentials to member account
 * @param {object} payload
 * @param {string} payload.exchange
 * @param {string} payload.apiKey
 * @param {string} payload.apiSecret
 * @param {string|undefined} payload.uid
 * @param {string|undefined} payload.password
 */
export const AddExchange = (payload) => {

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('addExchange', payload);
                cli.once('exchangeAdded', res => resolve(res));
                cli.once('invalidExchange ', err => reject(err));
            });
    });
};

export const RemoveExchange = (exchangeName) => {
    const payload = {
        exchange: exchangeName
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('removeExchange', payload);
                cli.once('exchangeRemoved', res => resolve(res));
                cli.once('invalidExchange ', err => reject(err));
            });
    });
};

/**
 * Lists exchanges connected to a member's account
 */
export const GetConnectedExchanges = () => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                // Right now this method is fired on Application start
                // even if the user is unauthenticated. We should only
                // fire this for logged in users. This will mean passing
                // logged-in state to the ExchangesStore.
                if (!cli) return resolve([]);
                cli.emit('getConnectedExchanges', {});
                cli.once('connectedExchangesResponse', res => resolve(res));
            });
    });
};


/**
 * Get account balances for each exchanges which will be displayed in Account exchange table
 */

 export const GetExchangeBalances = () => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                if(!cli) return resolve([]);
                cli.emit('getBalances', {});
                cli.once('balancesResponse', res => resolve(res));
            });
    });
}

/**
 *  PaymentRequest  (buying crypto)
 */
// Request: emit "PaymentRequest"
// {
//     "Payment": {
//         "Amount": 10,
//         "Coin": "BTC",
//         "PaymentAmount": 1000,
//         "PaymentCurrency": "USD",
//         "Card": {
//             "Type": "Visa",
//             "Name": "Foo bar",
//             "Number": "1111 1111 1111 1111",
//             "ExpDate": "10/20",
//             "Cvv": "123"
//         }
//     }
// }
export const PaymentRequest = (Type, Name, Number, ExpDate, Cvv) => {
    const payload = {
        Payment: {
            Amount: 0,
            Coin: '',
            PaymentAmount: 1000,
            PaymentCurrency: 'USD',
            Card: {
                Type,
                Name,
                Number,
                ExpDate,
                Cvv,
            },
        },
    };

    getClientTrade()
        .then(cli => {
            cli.emit('PaymentRequest', payload);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));
};


/**
 *  DepositAddressRequest
 */
// Request emit DepositAddressRequest
// {
//     Address: "1Ebfh6GruruXwHD67au8eNpL58NXr1YTkH"
// }

// Response on DepositAddressResponse
// - success case:
// {
//     Username: 'jon_doe_12345',
//     FirstName: 'jon',
//     LastName: 'doe',
//     PhotoUrl: 'https://t.me/i/userpic/320/jon_doe_12345.jpg',
//     Status: 'success',
// }

// - failed case:
// {
//     Msg: 'No user exists with such deposit address'
//     Status: 'failed',
// }

export const DepositAddressRequest = (address) => {
    const payload = {
        Address: address,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('DepositAddressRequest', payload);
                cli.on('DepositAddressResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};


/**
 *  TelegramIdRequest
 */
// Request emit TelegramIdRequest
// {
//     Id: 510889450
// }

// Response on TelegramIdResponse
// - success case:
// {
//     Username: 'jon_doe_12345',
//     Status: 'success',
// }

// - failed case:
// {
//     Msg: 'Invalid TelegramID, please check number'
//     Status: 'failed',
// }

export const TelegramIdRequest = (id) => {
    const payload = {
        Id: id,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('TelegramIdRequest', payload);
                cli.on('TelegramIdResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};


/**
 * WithdrawalRequest
 */
// - Request emit WithdrawalRequest
// {
//     RequestId: [uuidv4],
//     Coin: 'BTC',
//     Amount: '1',
//     ToAddress: '1GsojN1um3TPQyHXkcwr47uDw62YwAWfuH',
// }

// - Response: on WithdrawalResponse
// {
//     RequestId: [uuidv4],
//     Status,
//     Error,
// }

// Property Error will be empty if some amount of coins is sent successfully.

export const WithdrawalRequest = (coin, amount, address) => {
    const payload = {
        RequestId: uuidv4(),
        Coin: coin,
        Amount: amount,
        Address: address,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('WithdrawalRequest', payload);
                cli.on('WithdrawalResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};


/**
 * InitTransferRequest
 */
// ## init transfer
//
// FE sends ws request(Private):
//
// event = 'InitTransferRequest'
// data = {
//     Coin: 'USDT',
//     Amount: 22.2,
//     ExpireIn: '2h' (optional),
// }
// If ExpireIn is not sent then value '2d' will be used by default.
//
// BE sends response:
//
//     Success:
//          event = 'InitTransferResponse'
//          data = {
//              Status: 'success',
//              Error: '',
//          }
//
//     Failure:
//          data = {
//               Status: 'fail',
//               Error: 'Message text',
//          }

export const InitTransferRequest = (coin, amount, currency) => {
    const payload = {
        Coin: coin,
        Amount: amount,
        DefaultCurrency: currency,
        ExpireIn: '5m',
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('InitTransferRequest', payload);
                cli.on('InitTransferResponse', data => {
                    // console.log('[InitTransferResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

export const PromotionTransferRequest = (type) => {
    const payload = { Type: type };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('PromotionTransferRequest', payload);
                cli.on('PromotionTransferResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

export const TransferNotification = () => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.on('TransferNotification', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

export const TransferInfoDetailedRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('TransferInfoDetailedRequest', payload);
                cli.on('TransferInfoDetailedResponse', data => {
                    // console.log('[TransferInfoDetailedResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const TransferInfoRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('TransferInfoRequest', payload);
                cli.on('TransferInfoResponse', data => {
                    // console.log('[TransferInfoResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const ClaimTransfer = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('ClaimTransferRequest', payload);
                cli.on('ClaimTransferResponse', data => {
                    console.log('[ClaimTransferResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => {
                reject(e);
            });
    });
};

export const TransferHistoryRequest = payload => getClientTrade()
    .then(client => {
        return new Promise((resolve, reject) => {
            try {
                client.emit('TransferHistoryRequest', payload);
                client.off('TransferHistoryResponse').on('TransferHistoryResponse', data => {
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    })
    .catch(e => Promise.reject(e));


export const GetClaimedTransferNotification = ({ throttleMs = 10 }) => {
    getClientTrade()
        .then(cli => {
            if (!cli) {
                return;
            }
            const publishOnSubscription = publisher(throttleMs, data => {
                claimedTransferNotificationObservable.next(data);
            });

            cli.on('ClaimedTransferNotification', publishOnSubscription);
        })
        .catch(e => console.log(e.message || 'can not getClientLive'));

    return claimedTransferNotificationObservable;
};

// CancelTransferRequest
export const CancelTransferRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('CancelTransferRequest', payload);
                cli.on('CancelTransferResponse', data => {
                    // console.log('[CancelTransferResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

// RejectTransferRequest
export const RejectTransferRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('RejectTransferRequest', payload);
                cli.on('RejectTransferResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const GetMemberInformationRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('GetMemberInformationRequest', payload);
                cli.once('GetMemberInformationResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not edit member information'));
    })
};

/**
 *  Conversions Currencies API
 */
export const ConversionRequest = (amount, start, end) => {
    return new Promise((resolve, reject) => {
        const payload = {
            Amount: amount,
            StartCoin: start,
            EndCoin: end
        };

        getClientTrade()
            .then(cli => {
                cli.emit('ConversionRequest', payload);
                cli.once('ConversionResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const EditMemberInformationRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('EditMemberInformationRequest', payload);
                cli.once('EditMemberInformationResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not edit member information'));
    })
};

/*
 *  Get trade history
 */

export const getTrades = (payload) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.once('tradesResponse', res => resolve(res));
                cli.emit('getTrades', payload);
            })
            .catch(e => reject(e));
    });
};

/**
 *  Order History Request/Response
 */
export const OrderHistoryRequest = (ClientId) => {
    return new Promise((resolve, reject) => {

        getClientTrade()
            .then(cli => {
                cli.emit('OrderHistoryRequest', { ClientId });
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const OrderHistoryReply = ({ throttleMs = 250 }) => {
    getClientTrade()
        .then(cli => {
            const publishOnSubscription = publisher(throttleMs, data => {
                data = {
                    body: {
                        messages: [{
                            Tickets: data,
                        }],
                    },
                };
                orderHistoryObservable.next(data);
            });

            cli.on('OrderHistoryResponse', publishOnSubscription);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));

    return orderHistoryObservable;
};

/**
 *  Bills API integration
 */
export const ListUserBillsRequest = (coin) => {
    const payload = {
        Coin: coin,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('ListUserBillsRequest', payload);
                cli.on('ListUserBillsResponse', data => {
                    if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
                        resolve(data);
                    }
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const BalanceRequest = (ClientId) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                if (!cli) {
                    reject();
                    return;
                }
                cli.emit('PositionRequest', { ClientId });
                cli.on('PositionResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                reject(e);
            });
    });
};

export const ExecPlanRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('StartExecPlan', payload);
                cli.on('ExecPlan', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientLive');
                reject(e);
            });
    });
};

export const HistoryRequest = (ClientId) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('OrderHistoryRequest', { ClientId });
                cli.on('OrderHistoryResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

/**
 * Buy Order Request with best price
 * @param {Object} payload
 * @property {string} side "BUY" or "SELL"
 * @property {string} amount
 */
export const OrderRequestBestPrice = (payload)  => {
    payload.market = 'ETH/BTC';
    return new Promise((resolve, reject) => {
        getClientTrade()
        .then(cli => {
            if (payload.side === 'BUY') {
                cli.emit('orderRequestBestPriceBuy', payload);
            } else if (payload.side === 'SELL') {
                cli.emit('orderRequestBestPriceSell', payload);
            }
            cli.on('orderResponse', res => resolve(res));
            cli.on('invalidOrder', err => reject(err));
            cli.on('orderError', err => reject(err));
        })
        .catch(err => console.log(err.message || 'can not getClientTrade'));
    });
};
