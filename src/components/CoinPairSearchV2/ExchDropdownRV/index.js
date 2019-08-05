/* eslint-disable */
import React, { Component, Fragment, createRef } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Tooltip } from 'react-tippy';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';

import CoinIcon from '@/components-generic/CoinIcon';
import { ExchDropdownSearchIcon } from '@/components-generic/SvgIcon'
import CoinNameSmall from './CoinName/CoinNameSmall';
import CoinWrapper from './CoinWrapper';
// import CoinAmountInput from './CoinAmountInput';
import ExchangeRate from './ExchangeRate';
import {
    ExchDropdownList,
    StyleWrapper,
    AddonWrapper,
    ItemButtonWrapper,
    ItemButton,
    CoinItemWrapper,
    CurrencyName,
    CoinAmountInput,
    CoinInputSymbol,
    Wedge,
    AumCustomImg
} from './Components';
import { WalletButton } from '@/components-generic/WalletGroupButton/ChildComponents';
import { customDigitFormat, numberWithCommas } from '@/utils';
import DataLoader from '@/components-generic/DataLoader';
import SMSVerification from '@/components-generic/SMSVerification2';

import { STORE_KEYS } from '@/stores';
import { valueNormalized } from '@/stores/utils/OrderEntryUtils';
import { getTableItems } from './utils';
import { MODE_KEYS } from "@/components/OrderHistoryAdv/Constants";
import IcAUM from './icon-aum.png';

const ROW_HEIGHT = 70;

class ExchDropdownRV extends Component {
    state = {
        searchInputValue: '',
        tableItems: [],
        scrollTop: 0,
        selectedValue: '',
        selectedIndex: -1,
        tooltipShow: false,
        isLoginBtnShow: false,
        isLeft: true,
        isAmtInputFocused: false,
        isAmtChangedAfterFocus: false,
        amount: 1,
        coinSymbolMaxLength: 4,
    };

    wrapperRef = createRef();
    inputRef = createRef();
    tableRef = createRef();

    currentIndex = -1;
    scrollHeight = 0;
    width = 0;

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.timestamp !== nextProps.timestamp) {
            // recalculate items ONLY when props get changed
            return getTableItems(nextProps, prevState);
        }

        return { timestamp: nextProps.timestamp };
    }

    componentDidUpdate(prevProps) {
        if (this.inputRef.current && !prevProps.isOpen) {
            this.inputRef.current.focus();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        if (this.clearScrollTopTimeout) {
            this.clearScrollTopTimeout();
        }
        if (this.clearChangeDepositViewTimeout) {
            this.clearChangeDepositViewTimeout();
        }
        if (this.clearChangeDepositViewInnerTimeout) {
            this.clearChangeDepositViewInnerTimeout();
        }
    }

    onChangeSearchInputValue = e => {
        const { selectedValue } = this.state;

        const { tableItems } = getTableItems(this.props, {
            searchInputValue: e.target.value,
            selectedValue
        });

        this.setState({
            searchInputValue: e.target.value,
            scrollTop: 0,
            tableItems,
            coinSymbolMaxLength: 0,
        });

        if (this.scrollRef) {
            this.scrollRef.scrollTop = 0;
        }

        window.dropDownFocusIndex = 0;
        this.currentIndex = -1;
    };

    onSelectItem = (value, rowIndex, balance) => {
        const {
            isLeft,
            setSelectedCoin,
            onChange,
            setStockMode,
            onChangeAmount,
            setRightBottomSectionOpenMode,
        } = this.props;

        let symbol = '';

        if (value && value.stock) {
            symbol = value.symbol;
            setStockMode(true);
        } else {
            symbol = value && value.fiat ? value.symbol : value;
            setStockMode(false);
        }
        onChange(symbol);
        if (symbol !== 'AUM') {
            onChangeAmount(balance !== '0.00' ? balance : 1);
        }
        this.setState({ selectedValue: symbol });
        if (symbol !== 'AUM' && isLeft) {
            setSelectedCoin(symbol);
            setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
        }
        this.toggleDropdown();
    };

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    handleClickOutside = event => {
        if (this.props.isOpen && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            const qrCodePortal = document.getElementById('qr-code-portal');
            if (qrCodePortal && qrCodePortal.contains(event.target)) {
                return;
            }

            this.toggleDropdown();
            if (this.scrollRef) {
                this.scrollRef.scrollTop = 0;
            }
            this.setState({ scrollTop: 0 });
        }
    };

    scrollTop = (duration = 300) => {
        if (duration > 0) {
            const difference = this.state.scrollTop;
            const perTick = (difference / duration) * 50;

            if (this.clearScrollTopTimeout) {
                this.clearScrollTopTimeout();
            }
            this.clearScrollTopTimeout = this.props.setSafeTimeout(() => {
                this.setState(prevState => ({ scrollTop: prevState.scrollTop - perTick }));
                if (this.scrollRef) {
                    this.scrollRef.scrollTop = this.state.scrollTop;
                }

                this.scrollTop(duration - 10);
            }, 10);
        }
    };

    toggleDropdown = () => {
        const { setCoinListOpen, toggleDroplist, isOpen, isLeft, isSearch } = this.props;
        if (!isLeft || !isSearch) return; // disable opening in C2
        setCoinListOpen(!isOpen);
        toggleDroplist();

        if (isOpen) {
            this.setState({
                searchInputValue: '',
                selectedIndex: -1
            });
        }

        this.forceUpdate();
        window.dropDownFocusIndex = 0;
    };

    handleKeyDown = e => {
        const { selectedValue, tableItems } = this.state;
        const { isOpen, value, topGroupLabel } = this.props;

        if (!isOpen) {
            return;
        }

        const key = ['ArrowUp', 'Enter', 'ArrowDown'].indexOf(e.key);

        if (key !== 0 && key !== 2) {
            return;
        }

        const itemValue = selectedValue || value;

        if (key === 0) {
            if (!itemValue || this.currentIndex <= 1) {
                return;
            }

            let i = this.currentIndex - 1;
            let blankHeight = 0;
            while (tableItems[i] && tableItems[i].type === 'label') {
                i--;
            }

            const prevSymbol = tableItems[i].symbol;

            if (topGroupLabel === 'Recent') {
                blankHeight = 5;
            }
            let scrollTop = (i - 1) * ROW_HEIGHT - blankHeight;
            if (topGroupLabel === 'Recent') {
                scrollTop -= ROW_HEIGHT;
            }
            if (scrollTop < this.scrollHeight) {
                scrollTop = 0;
            }

            const offset = scrollTop - this.scrollRef ? this.scrollRef.scrollTop : 0;
            if (offset > 0 && offset < this.scrollHeight) {
                return;
            }

            if (this.scrollRef) {
                this.scrollRef.scrollTop = scrollTop;
            }
            this.setState({ scrollTop, selectedValue: prevSymbol });
        } else {
            let i = this.currentIndex + 1;
            if (!itemValue || i >= tableItems.length) {
                return;
            }

            let blankHeight = 0;
            while (tableItems[i] && tableItems[i].type === 'label') {
                i++;
            }

            const prevSymbol = tableItems[i].symbol;

            if (topGroupLabel === 'Recent') {
                blankHeight = 5;
            }
            let scrollTop = i * ROW_HEIGHT + blankHeight - this.scrollHeight;
            if (topGroupLabel === 'Recent') {
                scrollTop -= ROW_HEIGHT;
            }
            if (scrollTop < 0) {
                scrollTop = 0;
            }

            const offset = this.scrollRef ? this.scrollRef.scrollTop : 0 - scrollTop;
            if (offset > 0 && offset < this.scrollHeight) {
                return;
            }

            if (this.scrollRef) {
                this.scrollRef.scrollTop = scrollTop;
            }
            this.setState({ scrollTop, selectedValue: prevSymbol });
        }
    };

    handleAmtInputFocus = () => {
        const {
            isAUMSelected,
        } = this.props;
        if (isAUMSelected) {
            return;
        }
        this.setState({
            amount: '',
            isAmtInputFocused: true,
            isAmtChangedAfterFocus: false
        });
    };

    handleAmtInputBlur = () => {
        const {
            isAUMSelected,
        } = this.props;
        if (isAUMSelected) {
            return;
        }
        this.setState({
            isAmtInputFocused: false
        });
    };

    handleAmountChange = event => {
        const {
            isAUMSelected,
        } = this.props;
        if (isAUMSelected) {
            return;
        }

        const value = event.target.value;

        const oldValue = String(this.state.amount);
        const newValue = valueNormalized(oldValue, value);

        this.props.onChangeAmount(newValue || 0);
        this.setState({
            amount: newValue,
            isAmtChangedAfterFocus: true
        });
    };

    cellRenderer = ({ rowIndex }) => {
        const { isShortSell, defaultFiat, isLoggedIn, isMobile, value, totalBalance } = this.props;

        const {
            selectedIndex,
            tooltipShow,
            isLoginBtnShow,
            isLeft,
            searchInputValue,
            tableItems,
            selectedValue,
            coinSymbolMaxLength
        } = this.state;
        const data = tableItems[rowIndex];

        if (!data) {
            return;
        }

        const itemValue = !selectedValue || selectedValue === '' ? value : selectedValue;
        const className = `exch-dropdown__item ${!data.enabled ? ' disabled' : ''}`;

        if (data.symbol === itemValue) {
            this.currentIndex = rowIndex;
        }

        const isActive = data.position > 0.0001;
        const balance =
            data.position !== 1
                ? data.position && data.position >= 0.00001
                    ? customDigitFormat(data.position)
                    : '0.00'
                : '1.00';

        const isAUM = data.symbol === 'AUM';

        return (
            <ItemButtonWrapper>
                {!isLoggedIn && isLoginBtnShow && rowIndex === selectedIndex ? (
                    <SMSVerification handleBack={this.handleLogin} />
                ) : (
                    <Fragment>
                        <ItemButton
                            className={className}
                            key={rowIndex}
                            onClick={() => {
                                this.onSelectItem(
                                    (data && data.fiat) || (data && data.stock) ? data : data.symbol,
                                    rowIndex,
                                    balance
                                );
                                if (isAUM) {
                                    this.onClickColdStorage();
                                }
                            }}
                            id={`dropdown-btn-${data.symbol}`}
                            isActive={isLeft ? !isShortSell : false}
                        >
                            <Wedge />
                            {isAUM
                                ? <AumCustomImg src={IcAUM} alt="ic-aum" />
                                : <CoinIcon value={data} defaultFiat={defaultFiat} size={37} />}
                            {isAUM
                                ? (
                                    <Tooltip
                                        arrow={true}
                                        animation="shift"
                                        position="bottom"
                                        followCursor
                                        theme="bct"
                                        html="Assets Under Management"
                                    >
                                        <div className="exch-dropdown__title">AUM</div>
                                    </Tooltip>
                                ) : (
                                    <CoinNameSmall
                                        value={data}
                                        search={searchInputValue}
                                        defaultFiat={defaultFiat}
                                        coinSymbolMaxLength={coinSymbolMaxLength}
                                        isMobile={isMobile}
                                    />
                                )}
                        </ItemButton>

                        {isAUM && (
                            <AddonWrapper>
                                <WalletButton>
                                    {customDigitFormat(totalBalance)}
                                </WalletButton>
                            </AddonWrapper>
                        )}

                        {(!searchInputValue && !isAUM) && (
                            <AddonWrapper isSelected={data.symbol === itemValue}>
                                <Tooltip
                                    open={tooltipShow && selectedIndex === rowIndex}
                                    arrow={true}
                                    animation="shift"
                                    position="bottom"
                                    theme="bct"
                                    title="Your Access is Restricted to Level 1"
                                    className="full-width"
                                >
                                    <WalletButton
                                        isActive={isActive}
                                        isCurrent={data.symbol === itemValue}
                                        isLoggedIn={isLoggedIn}
                                    >
                                        {selectedIndex === rowIndex ? (
                                            <DataLoader width={35} height={35} />
                                        ) : (
                                            <Fragment>
                                                <span className="value">{balance}</span>
                                            </Fragment>
                                        )}
                                    </WalletButton>
                                </Tooltip>
                            </AddonWrapper>
                        )}
                    </Fragment>
                )}
            </ItemButtonWrapper>
        );
    };

    onClickColdStorage = () => {
        const { setArbMode, setColdStorageMode, setRightBottomSectionOpenMode } = this.props;
        setArbMode(true);
        setColdStorageMode(true);
        setRightBottomSectionOpenMode(MODE_KEYS.myPortfolioModeKey);
    };

    getDropdownList = () => {
        const { searchInputValue, tableItems, scrollTop } = this.state;
        const { isOpen } = this.props;
        if (!isOpen) {
            return;
        }

        return (
            <ExchDropdownList
                itemCount={tableItems.length + 1}
                isSearching={searchInputValue}
                className="exch-dropdown__list"
            >
                <div className={`scroll__scrollup${scrollTop > 1 ? '' : ' hide'}`} onClick={() => this.scrollTop(300)} role="button" tabIndex={0}>
                    <button className="scroll-up-button">
                        <svg className="sprite-icon" role="img" aria-hidden="true">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#arrow-up" />
                        </svg>
                    </button>
                </div>

                <div className="exch-dropdown__list__rvtable-wrapper">
                    <AutoSizer>
                        {({ width, height }) => {
                            this.scrollHeight = height;
                            this.width = width;
                            return (
                                <StyleWrapper width={width} height={height}>
                                    <PerfectScrollbar
                                        containerRef={ref => {
                                            this.scrollRef = ref;
                                        }}
                                        options={{ suppressScrollX: true, minScrollbarLength: 50 }}
                                        onScrollY={this.handleScroll}
                                    >
                                        {tableItems.length === 0 && (
                                            <span className="no-match">
                                                your search - {searchInputValue} - did not match any currencies
                                            </span>
                                        )}

                                        <Table
                                            ref={this.tableRef}
                                            autoHeight={true}
                                            width={width}
                                            height={height}
                                            headerHeight={0}
                                            disableHeader={true}
                                            rowCount={tableItems.length}
                                            rowGetter={({ index }) => tableItems[index]}
                                            rowHeight={ROW_HEIGHT}
                                            overscanRowCount={0}
                                            id="wallet-table"
                                            scrollTop={scrollTop}
                                            onRowsRendered={({overscanStartIndex, overscanStopIndex}) => {
                                                let maxLength = 0;
                                                if (!searchInputValue) {
                                                    const visibleItems = this.props.mainItems.slice(overscanStartIndex, overscanStopIndex);
                                                    visibleItems.forEach(item => {
                                                        if (item && item.symbol.length > maxLength ){
                                                            maxLength = item.symbol.length;
                                                        }
                                                    });
                                                }
                                                this.setState({
                                                    coinSymbolMaxLength: maxLength,
                                                });
                                            }}
                                        >
                                            <Column dataKey="name" width={width} cellRenderer={this.cellRenderer} />
                                        </Table>
                                    </PerfectScrollbar>
                                </StyleWrapper>
                            );
                        }}
                    </AutoSizer>
                </div>
            </ExchDropdownList>
        );
    };

    getInput = () => {
        const { searchInputValue } = this.state;
        const { isOpen, toggleDroplist } = this.props;

        if (!isOpen) {
            return undefined;
        }

        return (
            <div className={`exch-search${isOpen ? '' : ' hidden'}`}>
                <ExchDropdownSearchIcon />
                <input
                    className="exch-search__input"
                    type="text"
                    value={searchInputValue}
                    onChange={this.onChangeSearchInputValue}
                    onClick={toggleDroplist}
                    ref={this.inputRef}
                />
            </div>
        );
    };

    render() {
        const {
            isAmtInputFocused,
            isAmtChangedAfterFocus,
            amount: amountFromState,
        } = this.state;

        const {
            value,
            selectedBase,
            selectedQuote,
            isLeft,
            isCoinPairInversed,
            isOpen,
            defaultFiat,
            amount,
            isSwapped,
            isAUMSelected,
            isSearch,
        } = this.props;

        const isLeftDirection = (isLeft && !isCoinPairInversed) || (!isLeft && isCoinPairInversed);
        const coinAmountInputValue = isAmtInputFocused
                ? (isAmtChangedAfterFocus
                    ? numberWithCommas(amountFromState)
                        : '')
                : numberWithCommas(amount, isAUMSelected ? 2 : null);

        return (
            <div
                className={`exch-dropdown ${isOpen ? 'open' : ''}`}
                ref={this.wrapperRef}
                role="button"
                tabIndex={0}
                onKeyDown={this.handleKeyDown}
            >
                <div className="exch-dropdown__border">
                    <CoinItemWrapper isLeft={isLeft} isAUMSelected={isAUMSelected} disableHover={!isSearch}>
                        {isLeftDirection ? (
                            <Fragment>
                                <CoinWrapper
                                    isSearchOpen={isOpen}
                                    isLeft={isLeft}
                                    isLeftDirection={isLeftDirection}
                                    value={value}
                                    defaultFiat={defaultFiat}
                                    toggleDropdown={this.toggleDropdown}
                                    isAUMSelected={isAUMSelected}
                                    isSearch={isSearch}
                                />
                                {!isSearch && (
                                    <div className="exch-dropdown__title__wrapper">
                                        <div className="exch-dropdown__title">
                                            <CoinAmountInput
                                                readOnly={isAUMSelected}
                                                type="text"
                                                value={isAUMSelected ? `$ ${coinAmountInputValue}` : coinAmountInputValue}
                                                onFocus={this.handleAmtInputFocus}
                                                onBlur={this.handleAmtInputBlur}
                                                onChange={this.handleAmountChange}
                                                isAUMSelected={isAUMSelected}
                                            />
                                            <CoinInputSymbol />
                                        </div>
                                    </div>
                                )}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <ExchangeRate
                                    selectedBase={selectedBase}
                                    selectedQuote={selectedQuote}
                                    amount={amount}
                                    toggleDropdown={this.toggleDropdown}
                                    isCoinPairInversed={isCoinPairInversed}
                                    isSwapped={isSwapped}
                                    defaultFiat={defaultFiat}
                                    isAUMSelected={isAUMSelected}
                                />
                                <div className="exch-dropdown__title__coin2" onClick={this.toggleDropdown} role="button" tabIndex={0}>
                                    <CurrencyName>{value}</CurrencyName>
                                    <CoinIcon size={38} value={value} defaultFiat={defaultFiat} />
                                </div>
                            </Fragment>
                        )}
                    </CoinItemWrapper>

                    {this.getInput()}
                </div>

                {this.getDropdownList()}
            </div>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.FIATCURRENCYSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.TRADINGVIEWSTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.ARBITRAGESTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, accessLevel, isShortSell },
            [STORE_KEYS.VIEWMODESTORE]: {
                setViewMode,
                showLowerSection,
                setArbMode,
                arbMode,
                openDepositView,
                setColdStorageMode,
                setRightBottomSectionOpenMode
            },
            [STORE_KEYS.INSTRUMENTS]: { setBase, setQuote, selectedBase, selectedQuote },
            [STORE_KEYS.FIATCURRENCYSTORE]: { setStockMode },
            [STORE_KEYS.YOURACCOUNTSTORE]: { setSelectedCoin },
            [STORE_KEYS.TRADINGVIEWSTORE]: { setCoinListOpen },
            [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn, setLoginBtnLocation },
            [STORE_KEYS.ARBITRAGESTORE]: { lastBalance: totalBalance },
        }) => ({
            setViewMode,
            showLowerSection,
            setArbMode,
            arbMode,
            setBase,
            setQuote,
            selectedBase,
            selectedQuote,
            setStockMode,
            setSelectedCoin,
            openDepositView,
            setRightBottomSectionOpenMode,
            setCoinListOpen,
            isLoggedIn,
            defaultFiat,
            setLoginBtnLocation,
            accessLevel,
            isShortSell,
            setColdStorageMode,
            totalBalance,
        })
    )
);
export default enhanced(ExchDropdownRV);
