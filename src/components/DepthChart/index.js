import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import DataLoader from '@/components-generic/DataLoader';
import DepthChartApi from '@/lib/chartModules/depthChart';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';

import CustomTooltip from './CustomTooltip/index';
import ChartControls from './ChartControls/index';
import { Wrapper, Header, CanvasWrapper } from './styles';

const MIN_ZOOM = 0;
const MAX_ZOOM = 90;
const ZOOM_STEP = 10;

const getZoomedData = (data, targetLength, type) => {
    let cumulativeAmount = 0;
    let cumulativeSum = 0;
    const count = Math.min(data.length, targetLength);
    const res = [];
    for (let i = 0; i < count; i++) {
        const [price, amount] = data[i];
        cumulativeAmount += amount;
        cumulativeSum += price * amount;
        res.push({ x: price, y: cumulativeAmount, sum: cumulativeSum, type });
    }

    return res;
};

class DepthChart extends Component {
    state = {
        buys: [],
        sells: [],
        midPrice: 0,
        isArbitrage: false,
        zoom: MIN_ZOOM,
        tooltipModel: undefined
    };

    static getDerivedStateFromProps(props, state) {
        const { bids, asks, midPrice, isDGLoaded } = props;

        if (!isDGLoaded) {
            return null;
        }

        // zoom defines how many percents of array we are going to slice
        // e.g. zoom=30 means that we slice 30% at the beginning of `buys` and at the end of `sells`
        const { zoom } = state;

        const length = Math.min(bids.length, asks.length);
        if (!length) {
            return {
                buys: [],
                sells: [],
                midPrice,
                isArbitrage: false,
            };
        }

        let targetLength = Math.round(length * (1 - zoom / 100));

        const [minBidPrice] = bids[targetLength - 1];
        const [maxBidPrice] = bids[0];
        const [minAskPrice] = asks[0];
        const [maxAskPrice] = asks[targetLength - 1];

        if (minBidPrice > minAskPrice || maxAskPrice < maxBidPrice) {
            // at least 2 prices should be outside an Arbitrage zone
            const minBidsLength = bids.findIndex(([price]) => price < minAskPrice);
            const minAsksLength = asks.findIndex(([price]) => price > maxBidPrice);
            targetLength = Math.max(minBidsLength, minAsksLength) + 2;
        }

        const buys = getZoomedData(bids || [], targetLength, 'buy');
        const sells = getZoomedData(asks || [], targetLength, 'sell');

        return {
            buys,
            sells,
            midPrice,
            isArbitrage: buys[0].x > sells[0].x
        };
    }

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    onTooltipChange = tooltipModel => {
        const { highlightRow } = this.props;
        const { buys, sells } = this.state;
        this.setState({ tooltipModel });

        if (!tooltipModel) {
            highlightRow();
            return;
        }

        const datasets = [buys, sells];
        const { datasetIndex, index } = tooltipModel;
        const data = datasets[datasetIndex][index];
        const type = datasetIndex ? 'sell' : 'buy';
        highlightRow(type, data ? data.x : 0);
    };

    onClick = targetModel => {
        const { setOrderFormData } = this.props;
        const { buys, sells } = this.state;

        if (!targetModel) {
            return;
        }

        const datasets = [buys, sells];
        const { datasetIndex, index } = targetModel;
        const data = datasets[datasetIndex][index];

        setOrderFormData({
            amount: data.y,
            price: data.x
        });
    };

    onZoom = type => {
        const { zoom } = this.state;
        const nextZoom = type === 'in' ? Math.min(zoom + ZOOM_STEP, MAX_ZOOM) : Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
        this.setState({ zoom: nextZoom });
    };

    updateChart = () => {
        const { theme, base, isDGLoaded } = this.props;
        const { buys, sells, midPrice } = this.state;
        const data = { buys, sells };

        if (isDGLoaded) {
            if (this.chart) {
                this.chart.update(data, midPrice);
                return;
            }

            this.chart = new DepthChartApi({
                el: this.el,
                data,
                config: {
                    theme,
                    midPrice,
                    base,
                    onClick: this.onClick,
                    onTooltipChange: this.onTooltipChange
                }
            });
            return;
        }

        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };

    render() {
        const { isDGLoaded, quoteSymbol, base, quote, defaultFiat } = this.props;
        const { buys, sells, tooltipModel, midPrice, zoom, isArbitrage } = this.state;

        if (!isDGLoaded) {
            return <DataLoader />;
        }

        return (
            <Wrapper>
                <Header />
                <CanvasWrapper>
                    <canvas ref={el => (this.el = el)} />
                </CanvasWrapper>
                <CustomTooltip
                    tooltipModel={tooltipModel}
                    datasets={[buys, sells]}
                    base={base}
                    quote={quote}
                    defaultFiat={defaultFiat}
                />
                <ChartControls
                    midPrice={midPrice}
                    onZoom={this.onZoom}
                    plusDisabled={zoom === MAX_ZOOM}
                    minusDisabled={zoom === MIN_ZOOM}
                    quoteSymbol={quoteSymbol}
                    isArbitrage={isArbitrage}
                />
                <ExchangesLabel insideGraph />
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.FIATCURRENCYSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: theme,
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: {
                highlightRow,
                AsksForDepthChart: asks,
                BidsForDepthChart: bids,
                MidPrice: midPrice,
                isDGLoaded,
                base,
                quote,
                multiLegCoin,
                multiLegMode,
            },
            [STORE_KEYS.ORDERENTRY]: { setOrderFormData },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiatSymbol: quoteSymbol, defaultFiat },
            [STORE_KEYS.FIATCURRENCYSTORE]: {
                stockMode,
            },
        }) => ({
            theme: theme.theme,
            asks,
            bids,
            midPrice,
            isDGLoaded,
            quoteSymbol,
            base: multiLegMode && stockMode ? multiLegCoin : base,
            quote,
            setOrderFormData,
            highlightRow,
            defaultFiat,
            stockMode,
        })
    )
);

export default withStore(DepthChart);
