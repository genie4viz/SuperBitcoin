import React from 'react';
import styled from 'styled-components/macro';

import { MarketOrderRows } from './MarketOrderRows';
import OrderButton from '../OrderButton';
import SliderInput from '../SliderInputWithColor';
import { customDigitFormat } from '../../../utils';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: 14px;
    width: 100%;

    &:last-of-type {
        border-left: 1px solid ${props => props.theme.palette.orderFormBorder}7f;
    }
`;

export const MarketOrderContainer = ({
    isBuy,
    orderButtonText,
    amount,
    price,
    sliderMax,
    amountCoin,
    baseSymbol,
    quoteSymbol,
    sliderCurrency,
    estimatedAmountReceived,
    total,
    handleOrder,
    handleAmountChange,
    orderButtonDisabled,
    priceLabel
}) => {
    const currentBalance = isBuy ? total : amount;

    return (
        <Wrapper>
            <MarketOrderRows
                isBuy={isBuy}
                amount={amount}
                price={price}
                amountCoin={amountCoin}
                handleAmountChange={handleAmountChange}
                priceLabel={priceLabel}
                baseSymbol={baseSymbol}
                quoteSymbol={quoteSymbol}
                estimatedAmountReceived={estimatedAmountReceived}
            />
            <SliderInput
                isBuy={isBuy}
                value={amount}
                max={sliderMax}
                showTooltip
                tooltipValue={`${customDigitFormat(currentBalance)} ${sliderCurrency}`}
                onChange={handleAmountChange}
            />
            {/* <SliderSlick/> */}
            <OrderButton
                isBuy={isBuy}
                onClick={handleOrder}
                orderButtonText={orderButtonText}
                disabled={orderButtonDisabled}
            />
        </Wrapper>
    );
};
