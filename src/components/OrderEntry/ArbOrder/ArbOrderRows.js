import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { customDigitFormat } from '@/utils';
import InputCell from '../InputOrderCell';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const InnerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    width: 100%;

    > div {
        &:nth-child(2) {
            display: none;
        }
    }

    &:hover {
        > div {
            &:first-child {
                display: none;
            }
            &:last-child {
                display: flex;
            }
        }
    }
`;

const ArbOrderRows = memo(({
    isBuy,
    amount,
    basicAmount,
    price,
    handleAmountChange,
    basicSymbol,
    baseSymbol,
    quoteSymbol,
    estimatedAmountReceived,
    progress
}) => {
    const isHideAmount = !amount && !price && !estimatedAmountReceived;
    return (
        <Wrapper>
            <InnerWrapper>
                <InputCell
                    amount={customDigitFormat(amount, 9)}
                    coin={baseSymbol}
                    onChange={handleAmountChange}
                    isHideAmount={isHideAmount}
                    isBuy={isBuy}
                    progress={progress}
                    type={`${isBuy ? 'buy_to' : 'sell_from'}`}
                />

                <InputCell
                    amount={customDigitFormat(basicAmount, 9)}
                    coin={basicSymbol}
                    readOnly
                    isHideAmount={isHideAmount}
                    isBuy={isBuy}
                    progress={progress}
                    type={`${isBuy ? 'buy_to' : 'sell_from'}`}
                />
            </InnerWrapper>

            <InnerWrapper>
                <InputCell
                    amount={customDigitFormat(estimatedAmountReceived, 9)}
                    coin={quoteSymbol}
                    readOnly
                    isHideAmount={isHideAmount}
                    isBuy={isBuy}
                    progress={progress}
                    type={`${isBuy ? 'buy_from' : 'sell_to'}`}
                />
            </InnerWrapper>
        </Wrapper>
    );
});

export default ArbOrderRows;
