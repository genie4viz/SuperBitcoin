import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import DataLoader from '@/components-generic/DataLoader';
import { ChartCanvasWrapper } from '../styles';
import LineChart from '@/lib/chartModules/lineChart';
import { STORE_KEYS } from '@/stores';

class PriceChartHistorical extends Component {
    canvas = createRef();
    chartInitialized = false;

    componentDidMount() {
        this.handleData();
    }

    componentDidUpdate(prevProps) {
        const {
            selectedCoin,
            quoteSelectedCoin,
        } = this.props;

        if (
            prevProps.selectedCoin !== selectedCoin ||
            prevProps.quoteSelectedCoin !== quoteSelectedCoin
        ) {
            this.destroyChart();
        }

        this.handleData();
    }

    componentWillUnmount() {
        this.destroyChart();
    }

    handleData = () => {
        const {
            historicalData,
            loading,
            selectedFilterKey,
            getSymbolFrom,
            selectedCoin,
            stockMode,
        } = this.props;

        if (loading) {
            this.destroyChart();
            return;
        }

        const baseCoin = (selectedCoin || '').replace('F:', '');
        const isFiat = (!stockMode && (selectedCoin || '').includes('F:')) || baseCoin === 'BTC';
        const coinSymbol = !isFiat ? '\u20BF' : getSymbolFrom(baseCoin);

        if (!this.chartInitialized && historicalData.length) {
            this.chart = new LineChart({
                el: this.canvas.current,
                data: historicalData,
                config: {
                    liveMode: false,
                    startTime: historicalData[0].x,
                    endTime: historicalData[historicalData.length - 1].x,
                    maxDataLength: historicalData.length,
                    baseCoin,
                    coinSymbol,
                    isFiat,
                    selectedFilterKey,
                    maxTicksLimit: 6,
                },
            });

            this.chartInitialized = true;
        }
    }

    destroyChart = () => {
        this.chartInitialized = false;
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };

    render() {
        const {
             loading,
        } = this.props;

        return (
            <ChartCanvasWrapper>
                <canvas ref={this.canvas} />
                {loading && <DataLoader width={100} height={100} />}
            </ChartCanvasWrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.HISTORICALPRICESSTORE,
        STORE_KEYS.FIATCURRENCYSTORE,
    ),
    observer,
    withProps(({
        [STORE_KEYS.HISTORICALPRICESSTORE]: {
            historicalData,
            loading,
            selectedFilterKey,
        },
        [STORE_KEYS.SETTINGSSTORE]: {
            defaultFiat,
            getSymbolFrom,
        },
        [STORE_KEYS.YOURACCOUNTSTORE]: {
            selectedCoin,
            quoteSelectedCoin,
        },
        [STORE_KEYS.FIATCURRENCYSTORE]: {
            stockMode,
        },
    }) => ({
        loading,
        historicalData,
        selectedFilterKey,
        getSymbolFrom,
        defaultFiat,
        selectedCoin,
        quoteSelectedCoin,
        stockMode,
    }))
)(PriceChartHistorical);
