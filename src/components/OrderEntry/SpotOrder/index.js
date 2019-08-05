import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { SpotOrderContainer } from './SpotOrderContainer';

const SpotOrderSideBySideContainer = ({
    [STORE_KEYS.CONVERSIONENTRYSTORE]: {
        OrderFormBuy: {
            Amount: buyAmount,
            Total: buyTotal,
            baseSymbol,
            quoteSymbol,
            setAmount: setBuyAmount,
            setTotal: setBuyTotal,
            submitOrder: submitBuyOrder,
            sliderMax: buySliderMax,
        },
        OrderFormSell: {
            Amount: sellAmount,
            Total: sellTotal,
            setAmount: setSellAmount,
            setTotal: setSellTotal,
            submitOrder: submitSellOrder,
            sliderMax: sellSliderMax,
        }
    }
}) => {
    const selectedBase = (baseSymbol || '').replace('F:', '');
    const selectedQuote = (quoteSymbol || '').replace('F:', '');
    return (
        <React.Fragment>
            <FormattedMessage id="order_entry.label_buy" defaultMessage="BUY">
                {value1 => (
                    <SpotOrderContainer
                        amount={buyAmount}
                        total={buyTotal}
                        sliderMax={buySliderMax}
                        handleAmountInputChange={setBuyAmount}
                        handleTotalInputChange={setBuyTotal}
                        orderButtonDisabled={buyTotal <= 0}
                        handleOrder={submitBuyOrder}
                        orderButtonText={`${value1} ${selectedBase}`}
                        baseSymbol={selectedBase}
                        quoteSymbol={selectedQuote}
                        sliderCurrency={selectedQuote}
                        isBuy
                    />
                )}
            </FormattedMessage>
            <FormattedMessage id="order_entry.label_sell" defaultMessage="SELL">
                {value1 => (
                    <SpotOrderContainer
                        amount={sellAmount}
                        total={sellTotal}
                        sliderMax={sellSliderMax}
                        handleAmountInputChange={setSellAmount}
                        handleTotalInputChange={setSellTotal}
                        orderButtonText={`${value1} ${selectedBase}`}
                        orderButtonDisabled={sellAmount <= 0}
                        baseSymbol={selectedBase}
                        quoteSymbol={selectedQuote}
                        sliderCurrency={selectedBase}
                        handleOrder={submitSellOrder}
                    />
                )}
            </FormattedMessage>
        </React.Fragment>
    );
};

export default compose(
    inject(
        STORE_KEYS.CONVERSIONENTRYSTORE
    ),
    observer
)(SpotOrderSideBySideContainer);
