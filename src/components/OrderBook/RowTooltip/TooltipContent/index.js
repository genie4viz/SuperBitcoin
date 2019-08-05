import React, { memo } from 'react';

import { customDigitFormatParts } from '@/utils';
import { ZerosWrapper } from '@/components/OrderBook/Cells/PriceCell/styles';
import { ORDER_BOOK_ROWS_COUNT } from '@/config/constants';

import { CellTooltipItem } from './styles';

const TooltipContent = memo(({
    isBuy,
    price,
    nextPrice,
    prevPrice,
    exchange,
    index,
    midPrice,
    priceFractionDigits: fractionDigits,
    priceIntLength: intLength,
    priceDigitsGap: digitsGap,
}) => {
    const sellExchanges = exchange.split(',');
    const exchanges = isBuy
        ? sellExchanges.reverse()
        : sellExchanges;
    let bestPriceValue = isBuy
        ? nextPrice
        : prevPrice;
    if ((isBuy && index === ORDER_BOOK_ROWS_COUNT - 1) || (!isBuy && !index)) {
        bestPriceValue = midPrice;
    }
    const diff = Math.abs(bestPriceValue - price);
    const diffPerExchange = exchanges.length > 1
        ? diff / (exchanges.length - 1)
        : diff;
    const direction = isBuy
        ? 1
        : -1;
    const result = exchanges.map((exchName, idx) => {
        const isOwnPriceIdx = !idx;
        const exchangePrice = price + direction * diffPerExchange * idx;

        const digitParts = customDigitFormatParts(exchangePrice, {intLength, fractionDigits, digitsGap});

        return (
            (exchanges.length > 1) && (
                <CellTooltipItem key={exchName} isBuy={isBuy} isOwnPriceIdx={isOwnPriceIdx}>
                    <span className={`exchange-list-item ${isOwnPriceIdx && 'own-price'}`}>
                        {exchName}
                    </span>
                    <span className={`right-value ${isOwnPriceIdx && 'own-price'}`}>
                        {digitParts.resultNumber}
                        {!!digitParts.trailingZeros && (
                            <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>
                        )}
                        {digitParts.suffix}
                    </span>
                </CellTooltipItem>
            )
        );
    });

    return <ul className="advanced-tooltip orderbook-tooltip text-left">{isBuy ? result : result.reverse()}</ul>;
});

export default TooltipContent;
