import React, { memo } from 'react';

import { customDigitFormatParts } from '@/utils';
import { ResultNumber, ZerosWrapper, Wrapper } from './styles';

const PriceCell = memo(({ children, type, cellWidth, intLength, fractionDigits, digitsGap }) => {
    const digitParts = customDigitFormatParts(children, {intLength, fractionDigits, digitsGap});

    return (
        <Wrapper cellWidth={cellWidth}>
            <ResultNumber type={type}>
                {type === "header" && "@"}
                {
                    <span data-end={digitParts.suffix ? digitParts.suffix : ''}>
                        {digitParts.resultNumber}
                        {!!digitParts.trailingZeros && (
                            <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>
                        )}
                    </span>
                }
            </ResultNumber>
        </Wrapper>
    );
});

export default PriceCell;
