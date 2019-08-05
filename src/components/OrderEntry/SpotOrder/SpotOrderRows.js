import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { SpotInputCell } from "./SpotInputCell";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const SpotOrderRows = memo(({
    isBuy,
    amount,
    total,
    max,
    handleAmountChange,
    handleTotalChange,
    baseSymbol,
    quoteSymbol,
    progress
}) => (
    <Wrapper>
        <div>
            <SpotInputCell 
                value={amount} 
                handleInputChange={handleAmountChange}
                symbol={baseSymbol}
                isBuy={isBuy}
                max={max}
                progress={progress}
                type={`${isBuy ? 'buy_to' : 'sell_from'}`}
            />
        </div>
        <div>
            <SpotInputCell 
                value={total}
                handleInputChange={handleTotalChange}
                symbol={quoteSymbol}
                isBuy={isBuy}
                max={max}
                progress={progress}
                type={`${isBuy ? 'buy_from' : 'sell_to'}`}
            />
        </div>
    </Wrapper>
));
