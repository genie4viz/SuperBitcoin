/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Tooltip } from 'react-tippy';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { compose } from 'recompose';
import { withSafeTimeout, withSafeInterval } from '@hocs/safe-timers';

import { AutoSizer } from 'react-virtualized';
import { STORE_KEYS } from '@/stores';
import {
    commafy,
    fillUntil,
    customDigitFormatWithNoTrim,
    format2DigitStringForDonut
} from '@/utils';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon'
import { HexColors, GreenHexColors } from './colors';

import {
    ItemNormal,
    ItemExchPairSimple,
    ItemExchPairSideIcon,
    ExchangeWrapper,
    ExCellTable,
    ExCellContainer,
    StyleWrapper,
    ExchangeInfoWrapper,
    ColumnObj,
    TooltipContent,
    TotalExchange,
    BTCIcon
} from './Components';
import WalletHeader from '@/components/WalletHeader';
import WalletGroupButton from '@/components-generic/WalletGroupButton';
import { WalletSideIcon } from "@/components-generic/SvgIcon";

const maxCells = 150;

class ExchangePlanCell extends React.Component {
    state = {
        isOpen: false,
        itemHover: false,
    };

    handleClick = () => {
        if (this.props.confirmed) {
            this.setState(prevState => ({
                isOpen: !prevState.isOpen,
            }));
        }
    };

    onMouseEnter = () => {
        this.setState({
            itemHover: true,
        });

        this.props.updateHoverExchange(this.props.exchange);
    };

    onMouseLeave = () => {
        this.setState({
            itemHover: false,
        });

        this.props.updateHoverExchange('');
    };

    getColor = (index, isCoinPairInversed) => {
        if (isCoinPairInversed)  return GreenHexColors[index >= GreenHexColors.length ? GreenHexColors.length - 1 : index];
        return HexColors[index >= HexColors.length ? 0 : HexColors.length - 1 - index];
    };

    render() {
        const {
            exchange, hoverExchange, price, quoteSymbol, amount, spentAmount, index,
            percentage,
            setExchange, marketExchanges,
            setTradingViewMode,
            startPercentage, partial, getLocalPrice, defaultFiat,
            defaultFiatSymbol, selectedQuote, hoveredCellIndex,
        } = this.props;

        const { isOpen } = this.state;

        let exchangeFileName = exchange.toLowerCase();
        for (let i = 0; i < marketExchanges.length; i++) {
            if (marketExchanges[i].icon.toLowerCase() === `${exchange.toLowerCase()}.png`)  {
                exchangeFileName = marketExchanges[i].icon.substr(0, marketExchanges[i].icon.length - 4);
                break;
            }
        }

        const isCoinPairInversed =  (spentAmount < amount);
        const realPrice = price < 1 ? 1 / price : price;
        const realAmount = Math.max(spentAmount, amount);
        const realTotal = Math.min(spentAmount, amount);

        const baseAmount = Number.parseFloat(getLocalPrice(realAmount, quoteSymbol));
        const quoteAmount = Number.parseFloat(getLocalPrice(realTotal, selectedQuote));
        const c1Amount = quoteAmount;
        const c2Amount = baseAmount;
        const c2TotalAmount = Number.parseFloat(realPrice);
        const percentLabel = !partial || partial === 0 ? 0 : format2DigitStringForDonut(partial);

        return (
            <ItemNormal
                color={percentage === 0 ? this.getColor(index, false) : ''}
                hover={index === hoveredCellIndex}
                isOpen={isOpen}
                isPlan
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                isRealExchange
                onClick={() => {
                    setTradingViewMode(true);
                    setExchange(exchange);
                }}
            >
                <ItemExchPairSimple
                    hover={this.state.itemHover || (exchange === hoverExchange)}
                    isProgress
                    isRealExchange
                >
                    <ColumnObj>
                        <ItemExchPairSideIcon
                            value={exchangeFileName}
                            type="ExchangeIcon"
                            size={38}
                            className={`${exchange}exch`}
                            isOpen={isOpen}
                            isSearchState={false}
                            hover={(exchange === hoverExchange) || percentage > 0}
                            defaultFiat={defaultFiat}
                        />
                        <Tooltip
                            followCursor
                            className="exch-name-tooltip"
                            animation="fade"
                            arrow={true}
                            position="bottom"
                            distance={10}
                            theme="bct"
                            title={exchange}
                        >
                            <div className="c1Symbol">
                                {exchange}
                            </div>
                        </Tooltip>
                        <div className={`c1Amount ${isCoinPairInversed && 'expRight'}`}>
                            <WalletGroupButton
                                masterColor={this.getColor(index, false)}
                                isShouldOneAnim
                                inProgress={isCoinPairInversed}
                                isLeft={false}
                                isBuy={true}
                                progress={isCoinPairInversed}
                                isWhite={false}
                                position={false}
                            >
                                <WalletSideIcon/>
                                <span>
                                    {c1Amount > 1 ? commafy(c1Amount.toPrecision(8)) : c1Amount.toFixed(7)}
                                </span>
                                <span className="infoIcon">
                                    <BTCIcon/>
                                </span>
                            </WalletGroupButton>
                        </div>
                    </ColumnObj>

                    <ExchangeWrapper isActive={true} isCoinPairInversed={false}>
                        <div className="info-arrow-directional">
                            <div className="wrapper_arrow">
                                <SellArrowIcon width={35} withText />
                            </div>
                        </div>
                    </ExchangeWrapper>

                    <ColumnObj right>
                        <div className={`c1Amount ${!isCoinPairInversed && 'expRight'}`}>
                            <WalletGroupButton
                                masterColor={this.getColor(index, false)}
                                isShouldOneAnim
                                inProgress={!isCoinPairInversed}
                                isLeft={false}
                                isBuy={false}
                                progress={!isCoinPairInversed}
                                isWhite={false}
                                position={false}
                            >
                                <WalletSideIcon isRight/>
                                <span>
                                    {commafy(c2Amount.toPrecision(8))}
                                </span>
                                <span className="infoIcon">
                                    <span>{defaultFiatSymbol}</span>
                                </span>
                            </WalletGroupButton>
                        </div>
                        <div className="c1Symbol">
                            <Tooltip
                                animation="fade"
                                arrow={true}
                                position="bottom"
                                followCursor
                                distance={10}
                                theme="bct"
                                title={`1->${defaultFiatSymbol}${c2TotalAmount}`}
                            >
                                <span className="atSymbol">@</span>{c2TotalAmount}
                            </Tooltip>
                        </div>
                    </ColumnObj>

                    <ExchangeInfoWrapper
                        active
                        rotateDegree={startPercentage * 360 / 100}
                    >
                        <Tooltip
                            animation="fade"
                            arrow={true}
                            position="bottom"
                            followCursor
                            distance={10}
                            theme="bct"
                            html={(
                                <TooltipContent value={exchangeFileName}>
                                    <div className="tooltip-icon"/>
                                    <span>{exchange.charAt(0).toUpperCase() + exchange.slice(1)}</span>
                                </TooltipContent>
                            )}
                        >
                            <div className="display-flex">
                                <CircularProgressbar
                                    strokeWidth={10}
                                    value={!partial || partial === 0 ? 0 : partial}
                                    maxValue={100}
                                    text={`${percentLabel}%`}
                                    background={true}
                                    styles={buildStyles({
                                        textSize: '33px',
                                        textColor: '#6ac6de',
                                        pathColor: '#6ac6de',
                                        trailColor: '#2c3133',
                                        backgroundColor: '#0000',
                                    })}
                                />
                            </div>
                        </Tooltip>
                    </ExchangeInfoWrapper>
                </ItemExchPairSimple>
            </ItemNormal>
        );
    }
}

const ExchangePlanCellWithSafeTimeout = withSafeTimeout(ExchangePlanCell);

const ObservedExchangeCell = (observer(
    ({
        isCoinPairInversed = false,
        instrumentsStore: { selectedQuote },
        lowestExchangeStore: {
            hoverExchange, hoverExchangeFromDonut, updateHoverExchange, PlanForExchangesBar: Plan, confirmed, totalPrice,
        },
        convertStore: { setCurrentProgress },
        orderFormToggle: { showOrderForm },
        viewModeStore: {
            setViewMode, viewMode, setTradingViewMode
        },
        settingsStore: {
            getLocalPrice, defaultFiat, defaultFiatSymbol,
        },
        index,
        setExchange,
        marketExchanges,
        hoveredCellIndex,
        isLeftTop,
    }) => {

        if (Plan && Plan.length > index) {
            if (index === 0) {
                setCurrentProgress(Plan.get(0).progress);
            }
            let startPercentage = 0;
            for (let i = 0; i < index; i++) {
                startPercentage += Plan.get(i).Percentage;
            }
            return (
                <Fragment>
                    <ExchangePlanCellWithSafeTimeout
                        length={Plan.length}
                        baseSymbol={Plan.get(index).Ask.toUpperCase()}
                        quoteSymbol={Plan.get(index).Bid.toUpperCase()}
                        exchange={Plan.get(index).Exchange}
                        marketExchanges={marketExchanges}
                        hoverExchange={hoverExchange || ''}
                        updateHoverExchange={updateHoverExchange}
                        hoverExchangeFromDonut={hoverExchangeFromDonut || ''}
                        price={Plan.get(index).Price}
                        spentAmount={Plan.get(index).spentAmount}
                        amount={Plan.get(index).Amount}
                        index={index}
                        partial={Plan.get(index).Percentage}
                        startPercentage={startPercentage}
                        percentage={Plan.get(index).progress}
                        details={Plan.get(index).details || []}
                        confirmed={confirmed}
                        setViewMode={setViewMode}
                        setTradingViewMode={setTradingViewMode}
                        showOrderForm={showOrderForm}
                        viewMode={viewMode}
                        setExchange={setExchange}
                        getLocalPrice={getLocalPrice}
                        defaultFiat={defaultFiat}
                        isCoinPairInversed={isCoinPairInversed}
                        defaultFiatSymbol={defaultFiatSymbol}
                        totalPrice={totalPrice}
                        selectedquote={selectedQuote}
                        hoveredCellIndex={hoveredCellIndex}
                        isLeftTop={isLeftTop}
                    />
                </Fragment>
            );
        }
        return null;
    }
));

class ExchangeCellsContent extends React.PureComponent {
    clearScrollTopTimeout = null

    constructor() {
        super();

        this.scrollBarRef = null;
        this.perfectScrollRef = null;
        this.state = {
            isScrollTopVisible: false,
        };
    }

    componentDidMount() {
        this.props.setSafeTimeout(this.updateScroll);
    }

    componentDidUpdate() {
        this.props.setSafeTimeout(this.updateScroll);
    }

    handleScrollReachedStart = () => {
        this.setState({
            isScrollTopVisible: false,
        });
    };

    handleScrollY = () => {
        this.setState({
            isScrollTopVisible: !!this.perfectScrollRef.scrollTop,
        });
    };

    scrollTop = (duration = 300) => {
        const difference = this.perfectScrollRef.scrollTop || 0;
        const perTick = (difference / duration) * 10;

        if (this.clearScrollTopTimeout) {
            this.clearScrollTopTimeout();
        }
        this.clearScrollTopTimeout = this.props.setSafeTimeout(() => {
            if (!this.perfectScrollRef) { return; }
            this.perfectScrollRef.scrollTop = this.perfectScrollRef.scrollTop - perTick;
            if (this.perfectScrollRef.scrollTop === 0) {
                return;
            }
            this.scrollTop(duration - 10);
        }, 10);
    };

    updateScroll = () => {
        if (this.scrollBarRef && this.scrollBarRef.updateScroll) {
            this.scrollBarRef.updateScroll();
        }
    };

    render() {
        const {
            isScrollTopVisible,
        } = this.state;

        const {
            searchValue,
            instrumentsStore,
            convertStore,
            lowestExchangeStore,
            orderFormToggle,
            swapBaseQuote,
            viewModeStore,
            settingsStore,
            setExchange,
            marketExchanges,
            hoveredCellIndex,
            isLeftTop,
        } = this.props;

        return (
            <Fragment>
                {isScrollTopVisible && (
                    <div className="scroll__scrollup" onClick={() => this.scrollTop(300)} role="button" tabIndex={0}>
                        <button className="scroll-up-button">
                            <svg className="sprite-icon" role="img" aria-hidden="true">
                                <use
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    xlinkHref="img/sprite-basic.svg#arrow-up"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                <PerfectScrollbar
                    ref={ref => { this.scrollBarRef = ref; }}
                    containerRef={element => {
                        this.perfectScrollRef = element;
                    }}
                    options={{ minScrollbarLength: 40, maxScrollbarLength: 60 }}
                    onYReachStart={this.handleScrollReachedStart}
                    onScrollY={this.handleScrollY}
                >
                    <div className="exchange_cells">
                        {fillUntil(
                            maxCells,
                            i => (
                                <ObservedExchangeCell
                                    searchValue={searchValue}
                                    instrumentsStore={instrumentsStore}
                                    lowestExchangeStore={lowestExchangeStore}
                                    setExchange={setExchange}
                                    marketExchanges={marketExchanges}
                                    convertStore={convertStore}
                                    swapBaseQuote={swapBaseQuote}
                                    orderFormToggle={orderFormToggle}
                                    viewModeStore={viewModeStore}
                                    settingsStore={settingsStore}
                                    index={i}
                                    key={i}
                                    hoveredCellIndex={hoveredCellIndex}
                                    isLeftTop={isLeftTop}
                                />
                            )
                        )}
                    </div>
                </PerfectScrollbar>
            </Fragment>
        );
    }
}

const ExchangeCellsContentWithSafeTimeout = withSafeTimeout(ExchangeCellsContent);

class ExchangeCells extends React.Component {
    state = {
        swapBaseQuote: false,
        searchValue: '',
        hoveredCellIndex: -1,
    };

    render() {
        const {
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore,
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange, marketExchanges },
            [STORE_KEYS.MARKETMAKER]: orderFormToggle,
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.ARBITRAGESTORE]: { hStep1, hStep2 },
            [STORE_KEYS.YOURACCOUNTSTORE]: { getPriceOf },
            isDonutMode,
            isLeftTop = false,
            isCoinPairInversed = false,
        } = this.props;
        const {
            defaultFiatSymbol,
        } = settingsStore;
        const {
            PlanForExchangesBar: Plan,
        } = lowestExchangeStore;
        const { swapBaseQuote, searchValue, hoveredCellIndex } = this.state;

        let leftAmount = hStep1 || 0;
        let rightAmount = hStep2 || 0;
        if (leftAmount === 0 && rightAmount === 0) {
            leftAmount = 1;
            rightAmount = getPriceOf('BTC');
        }

        const averagePriceCalc = hStep2 > 0 ? rightAmount / leftAmount : 0;
        rightAmount = Number.parseFloat(rightAmount);
        leftAmount = Number.parseFloat(leftAmount);
        return (
            <ExCellTable isDonutMode={isDonutMode}>
                <AutoSizer>
                    {({ width, height }) => (
                        <StyleWrapper width={width} height={height} isLeftTop={isLeftTop}>
                            {
                                !isDonutMode &&
                                <WalletHeader isExchange isSeparate isMenuOpened={viewModeStore.isUserDropDownOpen} />
                            }
                            <ExCellContainer id="exchange-cells-container" isDonutMode={isDonutMode}>
                                <ExchangeCellsContentWithSafeTimeout
                                    searchValue={searchValue}
                                    instrumentsStore={instrumentsStore}
                                    convertStore={convertStore}
                                    lowestExchangeStore={lowestExchangeStore}
                                    setExchange={setExchange}
                                    marketExchanges={marketExchanges}
                                    viewModeStore={viewModeStore}
                                    swapBaseQuote={swapBaseQuote}
                                    orderFormToggle={orderFormToggle}
                                    settingsStore={settingsStore}
                                    hoveredCellIndex={hoveredCellIndex}
                                    isLeftTop={isLeftTop}
                                />
                            </ExCellContainer>
                        </StyleWrapper>
                    )}
                </AutoSizer>
                {!isLeftTop &&
                    <TotalExchange isCoinPairInversed={isCoinPairInversed}>
                        <ItemExchPairSimple
                            isProgress={true}
                            isRealExchange={true}
                        >
                            <ColumnObj>
                                <div className="c1Symbol">
                                    {Plan && Plan.length > 0 ? Plan.length > 1 ? `${Plan.length} Exchanges` : '1 Exchange' : '0 Exchange'}
                                </div>
                                <div className={`c1Amount ${isCoinPairInversed && 'expRight'}`}>
                                    <WalletGroupButton
                                        isShouldOneAnim
                                        inProgress={isCoinPairInversed}
                                        isLeft={true}
                                        isBuy={false}
                                        isWhite={false}
                                        position={false}
                                    >
                                        <WalletSideIcon/>
                                        <span>
                                            {leftAmount === 0 ? 0 : (
                                              leftAmount > 1 ? commafy(leftAmount.toPrecision(8)) : leftAmount.toFixed(7)
                                            )}
                                        </span>
                                        <span className="infoIcon">
                                            <BTCIcon/>
                                        </span>
                                    </WalletGroupButton>
                                </div>
                            </ColumnObj>

                            <ExchangeWrapper isActive={true} isCoinPairInversed={isCoinPairInversed}>
                                <div className="info-arrow-directional">
                                    <div className="wrapper_arrow">
                                        {isCoinPairInversed ? <BuyArrowIcon width={35} withText /> : <SellArrowIcon width={35} withText />}
                                    </div>
                                </div>
                            </ExchangeWrapper>

                            <ColumnObj right>
                                <div className={`c1Amount ${!isCoinPairInversed && 'expRight'}`}>
                                    <WalletGroupButton
                                        isShouldOneAnim
                                        inProgress={!isCoinPairInversed}
                                        isLeft={false}
                                        isBuy={false}
                                        isWhite={false}
                                        position={false}
                                    >
                                        <WalletSideIcon isRight/>
                                        <span>
                                            {rightAmount === 0 ? 0 : commafy(rightAmount.toPrecision(8))}
                                        </span>
                                        <span className="infoIcon">
                                            <span>{defaultFiatSymbol}</span>
                                        </span>
                                    </WalletGroupButton>
                                </div>
                                <div className="c1Symbol">
                                    <span>{averagePriceCalc === 0 ? '' : `@${customDigitFormatWithNoTrim(averagePriceCalc, 6)}`}</span>
                                </div>
                            </ColumnObj>

                            <ExchangeInfoWrapper
                                active
                            >
                                <span>{Plan && Plan.length > 0 ? '100%' : '0%'}</span>
                            </ExchangeInfoWrapper>
                        </ItemExchPairSimple>
                    </TotalExchange>
                }
            </ExCellTable>
        );
    }
}

const enhanced = compose(
    withSafeInterval,
    withSafeTimeout,
    inject(
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.MARKETMAKER,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.ARBITRAGESTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
    ),
    observer,
);

export default enhanced(ExchangeCells);
