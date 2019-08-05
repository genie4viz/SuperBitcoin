import React, { Component } from 'react';
import {compose, withProps} from "recompose";
import {inject, observer} from "mobx-react";

import { STORE_KEYS } from "@/stores/index";
import DataLoader from "@/components-generic/DataLoader/index";
import CoinIcon from "@/components-generic/CoinIcon";
import { Wrapper, BalanceLabel } from "./Components";
import DonutPortfolioChart from '@/lib/chartModules/donutChart';
import { commafy } from "@/utils/index";

class DonutChart extends Component {
    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate() {
        // const { data } = this.props;
        // if (this.chart && data.length && prevProps.data.length === data.length) {
        //     if (data.every((item, i) => item.Percentage === prevProps.data[i].Percentage)) {
        //         return;
        //     }
        // }
        this.updateChart();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getData = () => {
        const { data, isHoverPortfolio, activeCoin } = this.props;

        if (!data || !data.length) {
            return [];
        }

        return data.filter(({ Amount = 0, symbol }) => Amount > 0 && symbol !== 'SUM')
            .reduce((result, { Amount = 0, symbol = '', color = '' }) => {
                result.data.push(Amount);
                result.labels.push(symbol);
                result.colors.push(color);
                return result;
            }, { data: [], labels: [], colors: [], selected: isHoverPortfolio ? activeCoin : '' });
    };

    updateChart = () => {
        if (!this.el) {
            return;
        }

        const nextData = this.getData();

        if (this.chart) {
            this.chart.update(nextData);
            return;
        }

        this.chart = new DonutPortfolioChart({
            el: this.el,
            data: nextData,
        });
    };

    destroyChart = () => {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };

    render() {
        const { data, totalBalance, isHoverPortfolio, activeCoin, getBTCBalanceOf, getPositionOf } = this.props;
        const title = isHoverPortfolio
            ? (`${commafy(getPositionOf(activeCoin).toPrecision(6))}`)
            : `\u20BF ${commafy(totalBalance.toPrecision(8))}`;
        const details = isHoverPortfolio
            ? (` = ${commafy(getBTCBalanceOf(activeCoin).toPrecision(6))} BTC`)
            : 'Total Balance';

        if (!data.length) {
            this.destroyChart();
            return <DataLoader width={100} height={100} />;
        }

        return (
            <Wrapper>
                <canvas ref={el => (this.el = el)} />
                <BalanceLabel isEOS={activeCoin === 'EOS'} isHoverPortfolio={isHoverPortfolio}>
                    <div className="title">
                        {isHoverPortfolio && <CoinIcon value={activeCoin} size={20} />}
                        { title }
                    </div>
                    <span className="details">{ details }</span>
                </BalanceLabel>
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.DONUTMOCKSTORE,
        STORE_KEYS.ARBITRAGESTORE,
    ),
    observer,
    withProps(
        ({
             [STORE_KEYS.DONUTMOCKSTORE]: {
                 data,
                 getBTCBalanceOf,
                 getPositionOf
             },
             [STORE_KEYS.ARBITRAGESTORE]: {
                 isHoverPortfolio,
                 activeCoin,
                 lastBalance: totalBalance,
             }
         }) => ({
            data,
            isHoverPortfolio,
            activeCoin,
            getBTCBalanceOf,
            getPositionOf,
            totalBalance
        })
    )
);

export default withStore(DonutChart);
