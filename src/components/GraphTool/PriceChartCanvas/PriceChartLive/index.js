import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import DataLoader from '@/components-generic/DataLoader';
import LineChart from '@/lib/chartModules/lineChart';
import { ChartCanvasWrapper } from '../styles';
import { STORE_KEYS } from '@/stores';
import { MAX_PRICES_LENGTH } from '@/stores/PriceChartStore';

class PriceChartLive extends Component {
    canvas = createRef();

    componentDidUpdate(prevProps) {
        const {
            selectedCoin,
            stockMode,
            getSymbolFrom,
            quoteSelectedCoin,
            defaultFiat,
            price,
            getDefaultPrice
        } = this.props;

        if (
            prevProps.defaultFiat !== defaultFiat ||
            prevProps.selectedCoin !== selectedCoin ||
            prevProps.quoteSelectedCoin !== quoteSelectedCoin ||
            !price
        ) {
            this.destroyChart();
            return;
        }

        if (this.chart) {
            this.updateChart();
            return;
        }

        const startTime = Date.now();
        const endTime = moment(this.props.now)
            .add(10, 'seconds')
            .valueOf();

        const baseCoin = (selectedCoin || '').replace('F:', '');
        const isFiat = (!stockMode && (selectedCoin || '').includes('F:')) || baseCoin === 'BTC';
        const coinSymbol = !isFiat ? '\u20BF' : getSymbolFrom(baseCoin);

        this.chart = new LineChart({
            el: this.canvas.current,
            data: [{ x: Date.now(), y: getDefaultPrice(price) }],
            config: {
                liveMode: true,
                startTime,
                endTime,
                maxDataLength: MAX_PRICES_LENGTH,
                coinSymbol,
                baseCoin,
                isFiat,
                maxTicksLimit: 6,
            }
        });
    }

    componentWillUnmount() {
        this.destroyChart();
    }

    destroyChart = () => {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };

    updateChart = () => {
        const { getDefaultPrice, price } = this.props;

        const nextItem = { x: Date.now(), y: getDefaultPrice(price) };

        this.chart.lineTo(nextItem);
    };

    render() {
        return (
            <ChartCanvasWrapper>
                <canvas ref={this.canvas} />
                {!this.chart && <DataLoader width={100} height={100} />}
            </ChartCanvasWrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.PRICECHARTSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.ARBITRAGESTORE,
        STORE_KEYS.FIATCURRENCYSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.PRICECHARTSTORE]: { priceData, price },
            [STORE_KEYS.YOURACCOUNTSTORE]: { selectedCoin, quoteSelectedCoin },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, getDefaultPrice, getSymbolFrom },
            [STORE_KEYS.FIATCURRENCYSTORE]: { stockMode }
        }) => ({
            priceData,
            price,
            selectedCoin,
            quoteSelectedCoin,
            defaultFiat,
            getDefaultPrice,
            getSymbolFrom,
            stockMode
        })
    )
)(PriceChartLive);
