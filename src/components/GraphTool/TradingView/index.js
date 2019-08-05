import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';
import { compose } from 'recompose';

import { withSafeTimeout } from '@hocs/safe-timers';
import { STORE_KEYS } from '@/stores';
import { TV_CONFIG } from '@/config/constants';
import DataFeed, { apiDataLoadObservable } from './Api'
import { customIndicatorsGetter } from './utils';
import DataLoader from '@/components-generic/DataLoader';

const Wrapper = styled.div.attrs({ className: 'wrapper-tradingview' })`
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: ${props => props.isCoinListOpen ? 'none' : 'all'};
    z-index: 2;
    .settings-tooltip {
        position: absolute;
        z-index: 10;
        width: 38px;
        height: 38px;
        top: 12px;
        left: 12px;
        
        .settings-icon {
            width: 38px;
            height: 38px;
        }
    }
`;

const ChartContainer = styled.div`
    position: relative;
    flex: 1;
    border-top-left-radius: ${props => props.theme.palette.borderRadius};
    border: 1px solid ${props => props.theme.palette.clrBorder};
`;

const ApTradingViewChart = styled.div.attrs({ className: 'apTradingViewChart' })`
    position: relative;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: 100%;

    iframe {
        height: 100% !important;
    }
`;

class BCTChart extends React.Component {
    symbols = [];

    isSubscribed = false;

    state = {
        isLoading: false,
    };

    componentDidMount() {
        const {
            [STORE_KEYS.EXCHANGESSTORE]: { exchanges },
            coinPair,
        } = this.props;

        const symbols = Object.keys(exchanges).filter(name => exchanges[name].active).map(exchange => `${exchange === 'Global' ? 'CCCAGG': exchange}:${coinPair}`);
        this.symbols = symbols;

        this.createChart(this.symbols, TV_CONFIG);

        if (!this.isSubscribed) {
            apiDataLoadObservable
                .subscribe({
                    next: (apiDataEvent) => {
                        if (this.isSubscribed && apiDataEvent) {
                            if (apiDataEvent.apiLoaded) {
                                this.setState({
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    isLoading: true,
                                });
                            }
                        }
                    },
                });
            this.isSubscribed = true;
        }
    }

    componentDidUpdate() {
        try {
            const {
                [STORE_KEYS.EXCHANGESSTORE]: { exchanges },
                coinPair,
            } = this.props;

            const symbols = Object.keys(exchanges).filter(name => exchanges[name].active).map(exchange => `${exchange === 'Global' ? 'CCCAGG': exchange}:${coinPair}`);

            if (this.symbols.length !== symbols.length) {
                if (!this.tv) {
                    this.createChart(symbols, TV_CONFIG);
                } else {
                    this.tv.chart().removeAllStudies();
                    symbols.map((symbol, idx)  => {
                        if (idx !== 0) {
                            this.tv.chart().createStudy('Overlay', true, false, [symbol], null, {
                                style: 2,
                                'lineStyle.color': `#${Math.floor(Math.random()*16777215).toString(16)}`,
                                width: 2
                            });
                        }
                    })
                }
                this.symbols = symbols;
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    componentWillUnmount() {
        if (this.tv && !this.tv.remove) {
            console.error(new Error('Method undefined this.tv.removed'));
            return;
        }

        try {
            this.tv.remove();
        } catch (err) {
            console.log(err.message);
        }
        this.isSubscribed = false;
    }

    createChart = (symbols, overrides) => {
        try {
            const chartOptions = {
                symbol: symbols[0],
                interval: '1',
                container_id: 'tv_chart_container',
                datafeed: DataFeed,
                library_path: 'trading_view/',
                charts_storage_url: 'https://saveload.tradingview.com',
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id',
                fullscreen: false,
                autosize: true,
                debug: true,
                custom_indicators_getter: customIndicatorsGetter,
                ...overrides
            }

            this.tv = new TradingView.widget(chartOptions);
            
            this.tv.onChartReady(() => {
                symbols.map((symbol, idx) => {
                    if (idx !== 0) {
                        this.tv.chart().createStudy('Overlay', true, false, [symbol], null, {
                            style: 2,
                            'lineStyle.color': `#${Math.floor(Math.random()*16777215).toString(16)}`,
                            width: 2
                        });
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const {
            [STORE_KEYS.TRADINGVIEWSTORE]: { isCoinListOpen },
            [STORE_KEYS.EXCHANGESSTORE]: { selectedExchange },
        } = this.props;
        const {
            isLoading,
        } = this.state;

        return (
            <Wrapper isCoinListOpen={isCoinListOpen}>
                <ChartContainer>
                    <ApTradingViewChart id="tv_chart_container" />
                </ChartContainer>

                {isLoading && <DataLoader width={100} height={100}/>}
            </Wrapper>
        );
    }
}

export default compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.TRADINGVIEWSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer
)(BCTChart);
