import React from 'react';
import styled from 'styled-components/macro';

import ArbOrderRows from './ArbOrderRows';
import OrderButton from '../OrderButton';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px 15px;
    width: 100%;

    &:last-of-type {
        border-left: 1px solid ${props => props.theme.palette.orderFormBorder}7f;
    }
`;

export const ArbOrderContainer = ({
    isBuy,
    orderButtonText,
    amount,
    basicAmount,
    price,
    sliderMax,
    amountCoin,
    basicSymbol,
    baseSymbol,
    quoteSymbol,
    total,
    handleOrder,
    handleAmountChange,
    orderActive
}) => {
    const max = Number.parseFloat(sliderMax) || 0;
    let value = Number.parseFloat(orderActive ? sliderMax : 0) || 0;
    if (value > max) {
        value = max;
    }
    const progress = value > 0 ? (value / max) * 100 : 0;
    return (
        <Wrapper>
            <ArbOrderRows
                isBuy={isBuy}
                amount={orderActive ? amount : 0}
                basicAmount={basicAmount}
                price={orderActive ? price : 0}
                amountCoin={amountCoin}
                handleAmountChange={handleAmountChange}
                basicSymbol={basicSymbol}
                baseSymbol={baseSymbol}
                quoteSymbol={quoteSymbol}
                estimatedAmountReceived={orderActive ? total : 0}
                progress={progress}
            />
            <OrderButton
                isBuy={isBuy}
                onClick={handleOrder}
                orderButtonText={orderButtonText}
                disabled={!orderActive}
            />
        </Wrapper>
    );
};
