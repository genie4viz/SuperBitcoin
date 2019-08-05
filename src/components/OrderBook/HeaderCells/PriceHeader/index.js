import React from 'react';
import { inject } from 'mobx-react';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import HeaderCell from '../HeaderCell';
import { ZerosWrapper } from '@/components/OrderBook/Cells/PriceCell/styles';
import { commafy, customDigitFormatParts  } from '@/utils';

const PriceHeader = ({
    price,
    avgPrice,
    cellWidth,
    multiLegPriceRate,
    adjPrice,
    intLength,
    fractionDigits,
    digitsGap,
}) => {
    const digitParts = customDigitFormatParts(adjPrice, {intLength, fractionDigits, digitsGap});

    return (
        <HeaderCell
            tooltipText={
                <div>
                    <div>Average Price: {commafy((avgPrice * multiLegPriceRate).toPrecision(8))}</div>
                    <div>Median Price: {commafy(price.toPrecision(8))}</div>
                </div>
            }
            cellWidth={cellWidth}
        >
            <span className="priceCell">
                {digitParts.resultNumber}
                {!!digitParts.trailingZeros && (
                    <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>
                )}
                {digitParts.suffix}
            </span>
        </HeaderCell>
    );
};

export default compose(
    inject(stores => ({
        price: stores[STORE_KEYS.ORDERBOOKBREAKDOWN].MidPrice,
        avgPrice: stores[STORE_KEYS.ORDERBOOKBREAKDOWN].MidAvgPrice,
        multiLegPriceRate: stores[STORE_KEYS.ORDERBOOKBREAKDOWN].multiLegPriceRate,
        adjPrice: stores[STORE_KEYS.ORDERBOOKBREAKDOWN].adjPrice,
        priceDelta: stores[STORE_KEYS.ORDERBOOKBREAKDOWN].priceDelta,
        getFiatSymbolFromName: stores[STORE_KEYS.SETTINGSSTORE].getFiatSymbolFromName,
    }))
)(PriceHeader);
