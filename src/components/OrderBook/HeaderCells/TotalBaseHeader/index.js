import React, { memo } from 'react';

import CoinIcon from '@/components-generic/CoinIcon';
import { darkTheme } from '@/theme/core';
import AmountCell from '@/components/OrderBook/Cells/AmountCell';

import HeaderCell from '../HeaderCell';

const TotalBaseHeader = memo(
    ({
        amount,
        intLength,
        fractionDigits,
        digitsGap,
        coin,
        cellWidth,
        multiLegMode,
        multiLegCoin,
        stockMode,
        getFiatSymbolFromName
    }) => {
        const fiatSymbol = getFiatSymbolFromName(multiLegCoin) || multiLegCoin;

        return (
            <HeaderCell tooltipText={coin} cellWidth={cellWidth}>
                <CoinIcon
                    fontIcon
                    value={(multiLegMode && stockMode) ? fiatSymbol : coin}
                    filter={darkTheme.palette.orderBookIconFilter}
                />

                <AmountCell
                    type="header"
                    intLength={intLength}
                    fractionDigits={fractionDigits}
                    digitsGap={digitsGap}
                >
                    {amount}
                </AmountCell>
            </HeaderCell>
        );
    }
);

export default TotalBaseHeader;
