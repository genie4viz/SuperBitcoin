import React, { memo, Fragment } from 'react';

import { customDigitFormatParts } from '@/utils';
import { darkTheme } from '@/theme/core';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon';
import CoinIcon from '@/components-generic/CoinIcon';

import { Container, Wrapper } from './styles';
import { ZerosWrapper } from '../PriceCell/styles';

const COIN_COLORS = {
    buy: darkTheme.palette.orderBookBuyIconFilter,
    sell: darkTheme.palette.orderBookSellIconFilter
};

const AmountCell = memo(({
    children,
    type,
    cellWidth,
    intLength,
    fractionDigits,
    digitsGap,
    coin,
    isHovered,
    showArrow,
    multiLegMode,
    multiLegCoin,
    getFiatSymbolFromName,
}) => {
    const digitParts = customDigitFormatParts(children, {intLength, fractionDigits, digitsGap});

    const isBuy = type === 'buy';

    let ArrowComponent;
    if (isHovered) {
        ArrowComponent = isBuy ? BuyArrowIcon : SellArrowIcon;
    }

    const symbol = multiLegMode
        ? getFiatSymbolFromName(multiLegCoin) || multiLegCoin
        : coin;

    return (
        <Wrapper cellWidth={cellWidth} isHovered={isHovered}>
            {isHovered && (
                <Fragment>
                    {showArrow && <ArrowComponent className="arrow-icon" width="16px" />}
                    <CoinIcon
                        fontIcon
                        value={symbol}
                        filter={COIN_COLORS[type]}
                    />
                </Fragment>
            )}
            <Container type={type}>
                <span>
                    {digitParts.resultNumber}
                    {!!digitParts.trailingZeros && (
                        <ZerosWrapper position="trailing">{digitParts.trailingZeros}</ZerosWrapper>
                    )}
                    {!!digitParts.suffix && digitParts.suffix}
                </span>
            </Container>
        </Wrapper>
    );
});

export default AmountCell;
