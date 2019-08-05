import React, { PureComponent } from 'react';

import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import { STORE_KEYS } from '@/stores';
import { getScreenInfo, getNumberParts } from '@/utils';
import { ORDER_BOOK_ROWS_COUNT } from '@/config/constants';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import DataLoader from '@/components-generic/DataLoader';

import ExchangeCell from '../Cells/ExchangeCell';
import AmountCell from '../Cells/AmountCell';
import PriceCell from '../Cells/PriceCell';
import ProgressCell from '../Cells/ProgressCell';
import ExchangeHeader from '../HeaderCells/ExchangeHeader';
import TotalBaseHeader from '../HeaderCells/TotalBaseHeader';
import TotalQuoteHeader from '../HeaderCells/TotalQuoteHeader';
import PriceHeader from '../HeaderCells/PriceHeader';

import { Table, Row, HeaderRow } from './styles';

const IS_MOBILE_PORTRAIT = getScreenInfo().isMobilePortrait;

const DEFAULT_MAX_DECIMAL_DIGITS_LENGTH = {
    amount: 6,
    amountQuote: 6,
    price: 6,
};

const DEFAULT_MAX_FIAT_PRICE_DECIMAL_DIGITS_LENGTH = 2;

class OrderBookTable extends PureComponent {
    state = {
        hoverMeta: { index: -1 },
    };

    onRowClick = (callback, data) => () => {
        if (IS_MOBILE_PORTRAIT) {
            return;
        }

        callback(data);
    };

    onMouseEnter = (type, index) => () => {
        this.setState({
            hoverMeta: {
                type,
                index,
            },
        });
    };

    onMouseLeave = () => {
        this.setState({
            hoverMeta: { index: -1 },
        });
    };

    getCellsWidth = () => {
        const { screenWidth, isMobilePortrait, isSmallWidth } = getScreenInfo();
        const rowWidth = isSmallWidth || isMobilePortrait ? screenWidth : screenWidth * 0.33;
        const isWidthOverThreshold = rowWidth > 530;

        return {
            exchangeWidth: isWidthOverThreshold ? 35 : 33,
            amountWidth: isWidthOverThreshold ? 25 : 23,
            amountQuoteWidth: isWidthOverThreshold ? 22 : 24,
            priceWidth: isWidthOverThreshold ? 18 : 20,
        };
    };

    getBaseAmountCell = (amount, type, width, hovered, numberFormatMeta) => {
        const { selectedBase, multiLegMode } = this.props;
        const {
            amountIntLength,
            amountFractionDigits,
            amountDigitsGap,
        } = numberFormatMeta;

        return this.getAmountCell(
            amount,
            type,
            width,
            amountIntLength,
            amountFractionDigits,
            amountDigitsGap,
            selectedBase,
            hovered,
            false,
            multiLegMode,
        );
    };

    getQuoteAmountCell = (amount, type, width, hovered, numberFormatMeta) => {
        const { selectedQuote } = this.props;

        const {
            amountQuoteIntLength,
            amountQuoteFractionDigits,
            amountQuoteDigitsGap,
        } = numberFormatMeta;

        return this.getAmountCell(
            amount,
            type,
            width,
            amountQuoteIntLength,
            amountQuoteFractionDigits,
            amountQuoteDigitsGap,
            selectedQuote,
            hovered,
            true,
            false,
        );
    };

    getAmountCell = (
        amount,
        type,
        width,
        intLength,
        fractionDigits,
        digitsGap,
        coin,
        isHovered,
        showArrow,
        multiLegMode,
    ) => {
        const { multiLegCoin, getFiatSymbolFromName } = this.props;
        // DON'T ADD ANY LOGIC HERE!
        // Add to the AmountCell component
        return (
            <AmountCell
                type={type}
                intLength={intLength}
                fractionDigits={fractionDigits}
                digitsGap={digitsGap}
                coin={coin}
                cellWidth={width}
                isHovered={isHovered}
                showArrow={showArrow}
                multiLegMode={multiLegMode}
                multiLegCoin={multiLegCoin}
                getFiatSymbolFromName={getFiatSymbolFromName}
            >
                {amount}
            </AmountCell>
        );
    };

    getPriceCell = (price, type, width, isHovered, numberFormatMeta) => {
        const { multiLegMode } = this.props;

        const {
            priceIntLength,
            priceFractionDigits,
            priceDigitsGap,
        } = numberFormatMeta;

        // DON'T ADD ANY LOGIC HERE!
        // Add to the PriceCell component
        return (
            <PriceCell
                type={type}
                cellWidth={width}
                intLength={priceIntLength}
                fractionDigits={priceFractionDigits}
                digitsGap={priceDigitsGap}
                isHovered={isHovered}
                multiLegMode={multiLegMode}
            >
                {price}
            </PriceCell>
        );
    };

    getProgressCell = (cumulativeAmount, totalAmount, isBuy) => (
        <ProgressCell cumulativeAmount={cumulativeAmount} totalAmount={totalAmount} isBuy={isBuy} />
    );

    getRows = (type, items, cellWidth, numberFormatMeta) => {
        const {
            manualOrderBookHoverItem = {},
            setOrderFormData,
        } = this.props;

        const {
            priceFractionDigits,
            priceIntLength,
            priceDigitsGap,
        } = numberFormatMeta;

        const { hoverMeta } = this.state;
        const hoverRowMeta = manualOrderBookHoverItem.type ? manualOrderBookHoverItem : hoverMeta;

        const {
            exchangeWidth,
            amountWidth,
            amountQuoteWidth,
            priceWidth,
        } = cellWidth;
        const isBuy = type === 'buy';
        const totalAmount = items[isBuy ? 0 : items.length - 1].cumulativeAmount;

        return items.map(({ price, amount, amountQuote, exchange, total, cumulativeAmount }, index) => {
            const hovered = hoverRowMeta && hoverRowMeta.index === index && hoverRowMeta.type === type;

            const props = {};
            if (isBuy) {
                const nextIndex = index + 1;
                props.nextPrice = nextIndex in items
                    ? items[nextIndex].price
                    : undefined;
            } else {
                const prevIndex = index - 1;
                props.prevPrice = prevIndex in items
                    ? items[prevIndex].price
                    : undefined;
            }

            return (
                <Row
                    key={index}
                    onClick={this.onRowClick(setOrderFormData, { amount, price })}
                    onMouseEnter={this.onMouseEnter(type, index)}
                    onMouseLeave={this.onMouseLeave}
                    priceFractionDigits={priceFractionDigits}
                    priceIntLength={priceIntLength}
                    priceDigitsGap={priceDigitsGap}
                    index={index}
                    isBuy={isBuy}
                    price={price}
                    exchange={exchange}
                    total={total}
                    {...props}
                >
                    <ExchangeCell isBuy={isBuy} exchange={exchange} cellWidth={exchangeWidth} />
                    {this.getBaseAmountCell(amount, type, amountWidth, hovered, numberFormatMeta)}
                    {this.getQuoteAmountCell(amountQuote, type, amountQuoteWidth, hovered, numberFormatMeta)}
                    {this.getPriceCell(price, type, priceWidth, hovered, numberFormatMeta)}
                    {this.getProgressCell(cumulativeAmount, totalAmount, isBuy)}
                </Row>
            );
        });
    };

    getHeader = (cellWidth, numberFormatMeta) => {
        const {
            setSettingsExchangeViewMode,
            selectedBase,
            selectedQuote,
            totalOrderAmount,
            totalOrderSize,
            multiLegMode,
            multiLegCoin,
            getFiatSymbolFromName,
            stockMode,
        } = this.props;

        const {
            amountIntLength,
            amountQuoteIntLength,
            amountDigitsGap,
            priceIntLength,
            priceFractionDigits,
            priceDigitsGap,
            amountFractionDigits,
            amountQuoteFractionDigits,
            amountQuoteDigitsGap,
        } = numberFormatMeta;

        const { exchangeWidth, amountWidth, amountQuoteWidth, priceWidth } = cellWidth;

        return (
            <HeaderRow>
                <ExchangeHeader
                    text={<ExchangesLabel />}
                    onClick={setSettingsExchangeViewMode}
                    cellWidth={exchangeWidth}
                />
                <TotalBaseHeader
                    coin={selectedBase}
                    multiLegMode={multiLegMode}
                    multiLegCoin={multiLegCoin}
                    stockMode={stockMode}
                    amount={totalOrderAmount}
                    intLength={amountIntLength}
                    fractionDigits={amountFractionDigits}
                    digitsGap={amountDigitsGap}
                    cellWidth={amountWidth}
                    getFiatSymbolFromName={getFiatSymbolFromName}
                />
                <TotalQuoteHeader
                    coin={selectedQuote}
                    multiLegMode={multiLegMode}
                    multiLegCoin={multiLegCoin}
                    stockMode={stockMode}
                    amount={totalOrderSize}
                    intLength={amountQuoteIntLength}
                    fractionDigits={amountQuoteFractionDigits}
                    digitsGap={amountQuoteDigitsGap}
                    cellWidth={amountQuoteWidth}
                    getFiatSymbolFromName={getFiatSymbolFromName}
                />
                <PriceHeader
                    selectedBase={selectedBase}
                    selectedQuote={selectedQuote}
                    intLength={priceIntLength}
                    fractionDigits={priceFractionDigits}
                    digitsGap={priceDigitsGap}
                    multiLegMode={multiLegMode}
                    multiLegCoin={multiLegCoin}
                    cellWidth={priceWidth}
                />
            </HeaderRow>
        );
    };

    getNumberFormatMeta = (buys, sells) => {
        const {
            maxBidPrice,
            maxAskPrice,
            maxOrderSize,
            totalOrderSize,
            stockMode,
            selectedBase,
        } = this.props;

        const maxValues = {
            amount: maxOrderSize,
            amountQuote: totalOrderSize,
            price: Math.max(maxBidPrice, maxAskPrice),
        };

        const fields = ['amount', 'amountQuote', 'price'];

        return fields
            .map(field => {
                const items = [
                    ...buys.map(item => item[field]),
                    ...sells.map(item => item[field]),
                ];

                const min = Math.min(...items);
                const max = Math.max(...items);

                let minValueDigits;
                if (min >= 1) {
                    minValueDigits = getNumberParts(min).integerPart.length;
                } else {
                    const leadingZerosRegex = min.toFixed(10).match(/^[0, .]+/);
                    const leadingZeros = leadingZerosRegex && leadingZerosRegex[0];
                    minValueDigits = leadingZeros ? leadingZeros.replace('.', '').length : 0;
                }

                let maxValueDigits;
                if (max >= 1) {
                    maxValueDigits = getNumberParts(max).integerPart.length;
                } else {
                    const leadingZerosRegex = max.toFixed(10).match(/^[0, .]+/);
                    const leadingZeros = leadingZerosRegex && leadingZerosRegex[0];
                    maxValueDigits = leadingZeros ? leadingZeros.replace('.', '').length : 0;
                }

                let digitsGap;
                if ((max > 1 && min > 1) || (max < 1 && min < 1)) {
                    digitsGap = maxValueDigits - minValueDigits;
                } else {
                    digitsGap = maxValueDigits + minValueDigits;
                }

                const isFiat = !stockMode && (selectedBase || '').includes('F:');

                let fractionDigits = DEFAULT_MAX_FIAT_PRICE_DECIMAL_DIGITS_LENGTH;
                if (!isFiat || (isFiat && field !== 'price')) {
                    const realFractionDigits = items
                        .map(getNumberParts)
                        .map(parts => parts.fractionalPart.length)
                        .reduce((result, current) => Math.max(result, current), 0);

                    fractionDigits = Math.min(
                        realFractionDigits,
                        DEFAULT_MAX_DECIMAL_DIGITS_LENGTH[field]
                    );
                }

                return {
                    [`${field}IntLength`]: getNumberParts(maxValues[field]).integerPart.length,
                    [`${field}FractionDigits`]: fractionDigits,
                    [`${field}DigitsGap`]: digitsGap,
                };
            })
            .reduce((result, current) => ({...result, ...current}), {});
    };

    render() {
        const { bids, asks } = this.props;

        if (!asks.length || !bids.length) {
            return <DataLoader width={100} height={100} />;
        }

        const buys = bids.slice(-ORDER_BOOK_ROWS_COUNT);
        const sells = asks.slice(0, ORDER_BOOK_ROWS_COUNT);
        const cellWidth = this.getCellsWidth();

        const numberFormatMeta = this.getNumberFormatMeta(buys, sells);

        return (
            <Table>
                {this.getRows('buy', buys, cellWidth, numberFormatMeta)}
                {this.getHeader(cellWidth, numberFormatMeta)}
                {this.getRows('sell', sells, cellWidth, numberFormatMeta)}
            </Table>
        );
    }
}

export default withOrderFormToggleData(stores => {
    const {
        AsksForOrderBook,
        BidsForOrderBook,
        manualOrderBookHoverItem,
        totalOrderAmount,
        totalOrderSize,
        multiLegMode,
        multiLegCoin,
        maxBidPrice,
        maxAskPrice,
        maxOrderSize,
    } = stores[STORE_KEYS.ORDERBOOKBREAKDOWN];

    const { setOrderFormData } = stores[STORE_KEYS.ORDERENTRY];

    const { getFiatSymbolFromName } = stores[STORE_KEYS.SETTINGSSTORE];

    const { stockMode } = stores[STORE_KEYS.FIATCURRENCYSTORE];


    const { selectedBase } = stores[STORE_KEYS.INSTRUMENTS];

    return {
        asks: AsksForOrderBook,
        bids: BidsForOrderBook,
        setOrderFormData,
        totalOrderAmount,
        totalOrderSize,
        manualOrderBookHoverItem,
        multiLegMode,
        multiLegCoin,
        getFiatSymbolFromName,
        maxBidPrice,
        maxAskPrice,
        maxOrderSize,
        stockMode,
        selectedBase,
    };
})(OrderBookTable);
