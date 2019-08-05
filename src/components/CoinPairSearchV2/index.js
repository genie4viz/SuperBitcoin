import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import throttle from 'lodash.throttle';

import { STORE_KEYS } from '@/stores';
import { viewModeKeys } from '@/stores/ViewModeStore';
import { donutChartModeStateKeys } from '@/stores/LowestExchangeStore';
import { getScreenInfo } from '@/utils';
import { MODE_KEYS } from '@/components/OrderHistoryAdv/Constants';
import ExchDropdown from './ExchDropdownRV';
import { StyledWrapper, EqualSymbol } from './styles';

class CoinPairSearchV2 extends Component {
    state = {
        isSwapped: null,
        isOpenLeftList: false,
        isOpenRightList: false,
        inputAmount: 1,
        isCoinPairInversed: false,
        isAUMSelected: false,
    };

    wrapperRef = createRef();
    amtInputRef = createRef();
    doneTradingTick = null;

    static getDerivedStateFromProps(nextProps, prevState) {
        const newState = {};
        if (Boolean(prevState.isCoinPairInversed) !== Boolean(nextProps.isCoinPairInversed)) {
            newState.isCoinPairInversed = nextProps.isCoinPairInversed;
            if (prevState.isSwapped !== null) {
                newState.isSwapped = nextProps.isCoinPairInversed;
            }
        }

        const isAUMSelected = nextProps.rightBottomSectionOpenMode === MODE_KEYS.myPortfolioModeKey;
        if (prevState.isAUMSelected !== isAUMSelected) {
            newState.isAUMSelected = isAUMSelected;
        }

        if (nextProps.accessLevel === 'Level 1') {
            newState.isSwapped = null;
        }

        return newState;
    }

    componentDidMount() {
        window.addEventListener('resize', throttle(this.handleResizeWindow, 250));
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate() {
        const { donutChartStatus, resetDonutChartStatus, setExchange } = this.props;

        if (donutChartStatus === donutChartModeStateKeys.doneModeKey) {
            setExchange('Global');
            resetDonutChartStatus();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResizeWindow);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleChangeAmount = value => {
        this.setState({ inputAmount: value });
    };

    handleResizeWindow = () => {
        this.forceUpdate();
    };

    handleClickOutside = event => {
        const { orderForm } = this.props;

        if (!this.wrapperRef.current || this.wrapperRef.current.contains(event.target)) {
            return;
        }

        if (this.amtInputRef.current) {
            this.amtInputRef.current.blur();
        }

        if (orderForm.sliderMax < orderForm.amount) {
            orderForm.setAmount(orderForm.sliderMax || 0);
        }
    };

    toggleSwap = () => {
        this.setState(prevState => ({
            isSwapped:
                prevState.isSwapped === null && this.props.accessLevel === 'Level 1'
                    ? !prevState.isCoinPairInversed
                    : !prevState.isSwapped
        }));
    };

    toggleLeftList = () => {
        this.setState(prevState => ({
            isOpenLeftList: !prevState.isOpenLeftList
        }));
    };

    toggleRightList = () => {
        this.setState(prevState => ({
            isOpenRightList: !prevState.isOpenRightList
        }));
    };

    changedPositionOfUSDT = (items) => {
        if (!items.length) {
            return []
        }
        const USDTRecords = items.filter(x => x.symbol === 'USDT')[0];
        const reuseTable = items.filter(x => x.symbol !== 'USDT');
        let BCHIndex = 0;
        for(let i = 0; i < reuseTable.length; i++){
            if(reuseTable[i].symbol === 'BCH'){
                BCHIndex = i;
                break;
            }
        }
        reuseTable.splice(BCHIndex + 1, 0, USDTRecords);
        return reuseTable;
    };

    getAmount = () => {
        const { inputAmount, isAUMSelected } = this.state;
        const {
            price,
            totalBalance,
            isHoverPortfolio,
            getBTCBalanceOf,
            getPositionOf,
            activeCoin,
            selectedBase,
            stockMode,
        } = this.props;

        if (isAUMSelected) {
            return isHoverPortfolio
                ? getBTCBalanceOf(activeCoin)
                : totalBalance;
        }

        const amount = selectedBase === 'BTC'
            ? totalBalance
            : getPositionOf(selectedBase);

        if (amount > 0) {
            return inputAmount === 1
                ? amount
                : inputAmount;
        }

        if ((selectedBase || '').includes('F:') && !stockMode) {
            return inputAmount === 1
                ? price
                : inputAmount;
        }

        return inputAmount;
    }

    render() {
        const { isSwapped, isOpenLeftList, isOpenRightList, isAUMSelected } = this.state;
        const {
            selectedBase,
            selectedQuote,
            setBase,
            setQuote,
            addRecentQuote,
            resetWalletTableState,
            setViewMode,
            setTradingViewMode,
            modalOpened,
            setArbMode,
            coinsInMyWallet,
            baseCoins,
            quoteCoins,
            isSearch,
            usdOfBTC,
        } = this.props;

        const { screenWidth, isMobileDevice, gridHeight } = getScreenInfo(true);
        const isCoinPairInversed = isSwapped;

        const amount = this.getAmount();

        return (
            <StyledWrapper
                ref={this.wrapperRef}
                modalOpened={modalOpened}
                gridHeight={gridHeight}
                isCoinPairInversed={isCoinPairInversed}
                isAUMSelected={isAUMSelected}
                isSearch={isSearch}
            >
                <div className="coin-pair-form-inner-wrapper">
                    <div className="exch-head">
                        <div className="exch-head__coin-pair">
                            <div className={`exch-head__send ${!isSearch && 'exch-head__send-right'}`}>
                                <ExchDropdown
                                    isLeft
                                    value={isAUMSelected ? 'AUM' : selectedBase}
                                    onChange={val => {
                                        if (val !== 'AUM') {
                                            setArbMode(false);
                                            setBase(val);
                                            setViewMode(viewModeKeys.basicModeKey);
                                            setTradingViewMode(false);
                                        }
                                        this.setState({
                                            isAUMSelected: val === 'AUM',
                                        });
                                    }}
                                    isSearch={isSearch}
                                    onClick={resetWalletTableState}
                                    mainItems={this.changedPositionOfUSDT(baseCoins)}
                                    topGroupLabel="Your Coins"
                                    topGroupItems={this.changedPositionOfUSDT(coinsInMyWallet)}
                                    isCoinPairInversed={isCoinPairInversed}
                                    isSwapped={isSwapped}
                                    isOpen={isOpenLeftList}
                                    toggleDroplist={this.toggleLeftList}
                                    isMobile={isMobileDevice || screenWidth < 1024}
                                    amount={isAUMSelected ? amount * usdOfBTC : amount}
                                    onChangeAmount={this.handleChangeAmount}
                                    timestamp={Date.now()}
                                    isAUMSelected={isAUMSelected}
                                />
                            </div>
                            {!isSearch && <EqualSymbol>≈</EqualSymbol>}
                            {!isSearch && (
                                <div className="exch-head__get">
                                    <ExchDropdown
                                        value={isAUMSelected ? 'BTC' : selectedQuote}
                                        onChange={val => {
                                            setQuote(val);
                                            addRecentQuote(val);
                                            setViewMode(viewModeKeys.basicModeKey);
                                            setTradingViewMode(false);
                                        }}
                                        mainItems={quoteCoins}
                                        topGroupLabel="Recent"
                                        topGroupItems={coinsInMyWallet}
                                        isSwapped={isSwapped}
                                        isCoinPairInversed={isCoinPairInversed}
                                        isOpen={isOpenRightList}
                                        toggleDroplist={this.toggleRightList}
                                        isMobile={isMobileDevice || screenWidth < 1024}
                                        amount={amount}
                                        onChangeAmount={this.handleChangeAmount}
                                        timestamp={Date.now()}
                                        isAUMSelected={isAUMSelected}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </StyledWrapper>
        );
    }
}

const enhanced = compose(
    inject(
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.MODALSTORE,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.DONUTMOCKSTORE,
        STORE_KEYS.PRICECHARTSTORE,
        STORE_KEYS.ARBITRAGESTORE,
    ),
    observer,
    withProps(props => {
        const {
            [STORE_KEYS.INSTRUMENTS]: { setBase, setQuote, selectedBase, selectedQuote, addRecentQuote, Bases, Quotes },
            [STORE_KEYS.ORDERENTRY]: { CoinsPairSearchMarketOrderBuyForm },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                resetWalletTableState,
                coinsInMyWallet,
                baseCoins,
                quoteCoins,
            },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: { donutChartStatus, resetDonutChartStatus },
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
            [STORE_KEYS.VIEWMODESTORE]: {
                setViewMode,
                setTradingViewMode,
                setArbMode,
                rightBottomSectionOpenMode,
            },
            [STORE_KEYS.SETTINGSSTORE]: { accessLevel },
            [STORE_KEYS.MODALSTORE]: { open },
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { isCoinPairInversed },
            [STORE_KEYS.DONUTMOCKSTORE]: {
                totalBalance,
                getBTCBalanceOf,
                getPositionOf,
            },
            [STORE_KEYS.PRICECHARTSTORE]: { price, usdOfBTC },
            [STORE_KEYS.ARBITRAGESTORE]: {
                isHoverPortfolio,
                activeCoin,
            },
        } = props;
        return {
            setBase,
            setQuote,
            selectedBase,
            selectedQuote,
            addRecentQuote,
            Bases,
            Quotes,
            orderForm: CoinsPairSearchMarketOrderBuyForm,
            resetWalletTableState,
            donutChartStatus,
            resetDonutChartStatus,
            setExchange,
            setViewMode,
            setArbMode,
            setTradingViewMode,
            accessLevel,
            modalOpened: open,
            isCoinPairInversed,
            coinsInMyWallet,
            baseCoins,
            quoteCoins,
            totalBalance,
            usdOfBTC,
            getBTCBalanceOf,
            getPositionOf,
            isHoverPortfolio,
            activeCoin,
            rightBottomSectionOpenMode,
            price,
        };
    })
);

export default enhanced(CoinPairSearchV2);
