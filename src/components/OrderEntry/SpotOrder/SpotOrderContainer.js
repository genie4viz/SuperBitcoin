import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { SpotOrderRows } from './SpotOrderRows';
import OrderButton from '../OrderButton';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px 15px;
    width: 100%;

    &:last-of-type {
        border-left: 1px solid ${props => props.theme.palette.orderFormInputBorder};
    }
`;

export const SpotOrderContainer = memo(({
    amount,
    total,
    sliderMax,
    handleAmountInputChange,
    handleTotalInputChange,
    orderButtonDisabled,
    handleOrder,
    orderButtonText,
    baseSymbol,
    quoteSymbol,
    isBuy,
}) => {
    const max = Number.parseFloat(sliderMax) || 0;
    let value = Number.parseFloat(amount) || 0;
    if (value > max) {
        value = max;
    }
    const progress = value > 0 ? (value / max) * 100 : 0;
    return (
        <Wrapper>
            <SpotOrderRows
                isBuy={isBuy}
                amount={amount}
                total={total}
                max={max}
                handleAmountChange={handleAmountInputChange}
                handleTotalChange={handleTotalInputChange}
                baseSymbol={baseSymbol}
                quoteSymbol={quoteSymbol}
                progress={progress}
            />
            <OrderButton
                isBuy={isBuy}
                onClick={handleOrder}
                orderButtonText={orderButtonText}
                disabled={orderButtonDisabled}
            />
        </Wrapper>
    );
});
