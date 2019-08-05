import React from 'react';
import partial from 'lodash.partial';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { withValueFromEvent } from '@/utils';
import { MarketOrderContainer } from './MarketOrderContainer';
import LimitOrderArrow from "../LimitOrder/LimitOrderArrow";

const MarketOrderSideBySideContainer = ({
    [STORE_KEYS.INSTRUMENTS]: {
        selectedBase, selectedQuote,
    },
    [STORE_KEYS.ORDERENTRY]: {
        MarketOrderBuyForm: {
            amount: buyAmount,
            price: buyPrice,
            total: buyTotal,
            setAmount: setMarketBuyAmount,
            enabled: marketOrderFormBuyEnabled,
            marketOrderPrice: buyEstimatedAmount,
            sliderMax: buySliderMax,
        },
        MarketOrderSellForm: {
            amount: sellAmount,
            price: sellPrice,
            setAmount: setMarketSellAmount,
            enabled: marketOrderFormSellEnabled,
            marketOrderPrice: sellEstimatedAmount,
            sliderMax: sellSliderMax,
        },
    },
    [STORE_KEYS.VIEWMODESTORE]: {
        arbHFMode,
    },
    showModal,
}) => {
    const baseSymbol = (selectedBase || '').replace('F:', '');
    const quoteSymbol = (selectedQuote || '').replace('F:', '');
    
    return (
        <React.Fragment>
            <FormattedMessage
                id="order_entry.label_buy"
                defaultMessage="BUY"
            >
                {value1 =>
                    <FormattedMessage
                        id="order_entry.label_lowest_price"
                        defaultMessage="Lowest"
                    >
                        {value2 =>
                            <MarketOrderContainer
                                amount={buyAmount}
                                price={buyPrice}
                                total={buyTotal}
                                sliderMax={buySliderMax}
                                handleAmountChange={partial(withValueFromEvent, setMarketBuyAmount)}
                                orderButtonDisabled={!marketOrderFormBuyEnabled}
                                handleOrder={showModal}
                                orderButtonText={arbHFMode ? <div>{quoteSymbol} <LimitOrderArrow isBuy /> {baseSymbol}</div> : `${value1} ${baseSymbol}`}
                                amountCoin={baseSymbol}
                                baseSymbol={baseSymbol}
                                quoteSymbol={quoteSymbol}
                                sliderCurrency={quoteSymbol}
                                isBuy
                                priceLabel={value2}
                                estimatedAmountReceived={buyAmount * buyEstimatedAmount}
                            />
                        }
                    </FormattedMessage>
                }
            </FormattedMessage>
            <FormattedMessage
                id="order_entry.label_sell"
                defaultMessage="SELL"
            >
                {value1 =>
                    <FormattedMessage
                        id="order_entry.label_highest_price"
                        defaultMessage="Highest"
                    >
                        {value2 =>
                            <MarketOrderContainer
                                amount={sellAmount || 0}
                                price={sellPrice}
                                total={sellPrice}
                                sliderMax={sellSliderMax}
                                handleAmountChange={partial(withValueFromEvent, setMarketSellAmount)}
                                orderButtonText={arbHFMode ? <div>{baseSymbol} <LimitOrderArrow /> {quoteSymbol}</div> : `${value1} ${baseSymbol}`}
                                orderButtonDisabled={!marketOrderFormSellEnabled}
                                amountCoin={baseSymbol}
                                baseSymbol={baseSymbol}
                                quoteSymbol={quoteSymbol}
                                sliderCurrency={baseSymbol}
                                handleOrder={showModal}
                                priceLabel={value2}
                                estimatedAmountReceived={sellAmount * sellEstimatedAmount || 0}
                            />
                        }
                    </FormattedMessage>
                }
            </FormattedMessage>
        </React.Fragment>
    );
};

export default compose(
    inject(
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.INSTRUMENTS,
    ),
    observer,
)(MarketOrderSideBySideContainer);
