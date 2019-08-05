import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { Wrapper, StyleWrapper, Item } from './Components';
import { STORE_KEYS } from "@/stores";
import { darkTheme } from '@/theme/core';
import CoinIcon from "@/components-generic/CoinIcon";
import { commafy } from "@/utils";

class WalletTable extends Component {

    onChangeActiveCoin = (symbol) => {
        this.props.setActiveCoin(symbol);
        this.props.setHoverPortfolio(true);
    };

    onMouseLeave = () => {
        this.props.setActiveCoin('F:USD');
        this.props.setHoverPortfolio(false);
    };

    firstCellRenderer = ({ rowIndex }) => {
        const { data } = this.props;
        const element = data[rowIndex];

        return (
            <Item isEOS={element.symbol === 'EOS'} isFirstCell={true}>
                <div className="symbol first-cell">
                    <CoinIcon value={element.symbol} size={37} />
                    <span>{element.symbol}</span>
                </div>
                <div className="position">{commafy(element.Position.toPrecision(10))}</div>
            </Item>
        );
    };

    secondCellRenderer = ({ rowIndex }) => {
        const { data } = this.props;
        const element = data[rowIndex];
        return (
            <Item isSumCell = {rowIndex === data.length - 1}>
                <div className="equal">≈</div>
                <div className="element right">
                    <div className="symbol">
                        <CoinIcon fontIcon value="USDT" filter={darkTheme.palette.portfolioUSDIconColor} size={20} />
                    </div>
                    <div className="position">{commafy(element.USD.toPrecision(10))}</div>
                </div>
            </Item>
        );
    };

    thirdCellRenderer = ({ rowIndex }) => {
        const { data } = this.props;
        const element = data[rowIndex];
        return (
            <Item isSumCell = {rowIndex === data.length - 1}>
                <div className="equal">≈</div>
                <div className="element right">
                    <div className="symbol">
                        <CoinIcon fontIcon value="BTC" filter={darkTheme.palette.portfolioBTCIconFilter} size={20} />
                    </div>
                    <div className="position">{commafy(element.Amount.toPrecision(10))}</div>
                </div>
            </Item>
        );
    };

    render() {
        const { data } = this.props;
        return (
            <Wrapper>
                <AutoSizer>
                    {({ width, height }) => {
                        return (
                            <StyleWrapper width={width} height={height}>
                                <PerfectScrollbar
                                    options={{
                                        suppressScrollX: true,
                                        minScrollbarLength: 50,
                                    }}
                                >
                                    <Table
                                        width={width}
                                        height={height}
                                        headerHeight={0}
                                        disableHeader={true}
                                        rowCount={data.length}
                                        rowGetter={({ index }) => data[index]}
                                        rowHeight={height / 3}
                                        overscanRowCount={0}
                                        onRowMouseOver={({ rowData }) => this.onChangeActiveCoin(rowData.symbol)}
                                        onRowMouseOut={() => this.onMouseLeave()}
                                    >
                                        <Column
                                            width={ width / 3 }
                                            dataKey="symbol"
                                            cellRenderer={this.firstCellRenderer}
                                        />
                                        <Column
                                            width={ width / 3}
                                            dataKey="USD"
                                            cellRenderer={this.secondCellRenderer}
                                        />
                                        <Column
                                            width={ width / 3}
                                            dataKey="Amount"
                                            cellRenderer={this.thirdCellRenderer}
                                        />
                                    </Table>
                                </PerfectScrollbar>
                            </StyleWrapper>
                        );
                    }}
                </AutoSizer>
            </Wrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.DONUTMOCKSTORE,
        STORE_KEYS.ARBITRAGESTORE,
    ),
    observer,
    withProps(
        ({
             [STORE_KEYS.DONUTMOCKSTORE]: { data },
             [STORE_KEYS.ARBITRAGESTORE]: { setActiveCoin, setHoverPortfolio },
         }) => ({ data, setActiveCoin, setHoverPortfolio })
    )
)(WalletTable);
