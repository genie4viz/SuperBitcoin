import React from 'react';
import partial from 'lodash.partial';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { withValueFromEvent } from '@/utils';
import { ArbOrderContainer } from './ArbOrderContainer';

const ArbOrderSideBySideContainer = ({
        [STORE_KEYS.INSTRUMENTS]: { selectedQuote },
        [STORE_KEYS.ORDERENTRY]: {
            MarketOrderBuyForm: {
            // price: buyPrice,
            setAmount: setMarketBuyAmount,
            marketOrderPrice: buyEstimatedAmount
            },
            MarketOrderSellForm: {
            // price: sellPrice,
            setAmount: setMarketSellAmount,
            marketOrderPrice: sellEstimatedAmount
        }
        },
        // [STORE_KEYS.ORDERHISTORY]: {
        //     OrderHistoryData,
        // },
        [STORE_KEYS.ARBITRAGESTORE]: {
            isBuying,
            isSelling,
            rate,
            activeCoinETHRate,
            hStep1,
            hStep2,
            hStep3,
            hStep4,
            activeCoin: selectedBase,
        },
        showModal
    }) => {
    const basicSymbol = 'ETH';
    const baseSymbol = (selectedBase || '').replace('F:', '');
    const quoteSymbol = (selectedQuote || '').replace('F:', '');

    const buyBasicAmount = hStep2;
    const buyAmount = hStep2 * activeCoinETHRate;
    const buyTotal = hStep1;
    const buySliderMax = buyTotal;

    const sellBasicAmount = hStep3;
    const sellAmount = hStep3 * activeCoinETHRate;
    const sellTotal = hStep4;
    const sellSliderMax = sellAmount;

    const tradePrice = rate;

    return (
        <React.Fragment>
            <FormattedMessage id="order_entry.label_buy" defaultMessage="BUY">
                {value1 => (
                    <ArbOrderContainer
                        amount={buyAmount}
                        basicAmount={buyBasicAmount}
                        price={tradePrice}
                        total={buyTotal}
                        sliderMax={buySliderMax}
                        handleAmountChange={partial(withValueFromEvent, setMarketBuyAmount)}
                        orderActive={isBuying}
                        handleOrder={showModal}
                        orderButtonText={`${value1} ${baseSymbol}`}
                        amountCoin={baseSymbol}
                        basicSymbol={basicSymbol}
                        baseSymbol={baseSymbol}
                        quoteSymbol={quoteSymbol}
                        sliderCurrency={quoteSymbol}
                        isBuy={true}
                        estimatedAmountReceived={buyAmount * buyEstimatedAmount}
                    />
                )}
            </FormattedMessage>
            <FormattedMessage id="order_entry.label_sell" defaultMessage="SELL">
                {value1 => (
                    <ArbOrderContainer
                        amount={sellAmount}
                        basicAmount={sellBasicAmount}
                        price={tradePrice}
                        total={sellTotal}
                        sliderMax={sellSliderMax}
                        handleAmountChange={partial(withValueFromEvent, setMarketSellAmount)}
                        orderButtonText={`${value1} ${baseSymbol}`}
                        orderActive={isSelling}
                        amountCoin={baseSymbol}
                        basicSymbol={basicSymbol}
                        baseSymbol={baseSymbol}
                        quoteSymbol={quoteSymbol}
                        sliderCurrency={baseSymbol}
                        handleOrder={showModal}
                        isBuy={false}
                        estimatedAmountReceived={sellAmount * sellEstimatedAmount}
                    />
                )}
            </FormattedMessage>
        </React.Fragment>
    );
};

export default compose(
    inject(STORE_KEYS.ORDERENTRY, STORE_KEYS.INSTRUMENTS, STORE_KEYS.ORDERHISTORY, STORE_KEYS.ARBITRAGESTORE),
    observer
)(ArbOrderSideBySideContainer);
