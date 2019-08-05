import React, { memo } from 'react';

import { darkTheme } from '@/theme/core';
import CoinIcon from '@/components-generic/CoinIcon';
import AmountCell from '@/components/OrderBook/Cells/AmountCell';
import HeaderCell from '../HeaderCell';

import { SwipArrowIconStyled } from './styles';

const TotalQuoteHeader = memo(
    ({
        coin,
        multiLegMode,
        multiLegCoin,
        stockMode,
        amount,
        intLength,
        fractionDigits,
        digitsGap,
        cellWidth,
        getFiatSymbolFromName
    }) => {
        const fiatSymbol = getFiatSymbolFromName(multiLegCoin) || multiLegCoin;
        return (
            <HeaderCell tooltipText={multiLegMode ? multiLegCoin : coin} cellWidth={cellWidth}>
                <SwipArrowIconStyled width="20px" />
                {multiLegMode && !stockMode ? (
                    `${fiatSymbol} `
                ) : (
                    <CoinIcon fontIcon value={coin} filter={darkTheme.palette.orderBookIconFilter} />
                )}
                <AmountCell type="header" intLength={intLength} fractionDigits={fractionDigits} digitsGap={digitsGap}>
                    {amount}
                </AmountCell>
            </HeaderCell>
        );
    }
);

export default TotalQuoteHeader;
