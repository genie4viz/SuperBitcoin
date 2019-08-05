import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { orderFormToggleKeys } from '@/stores/MarketMaker';
import { getScreenInfo } from '@/utils';
import PriceChartCanvas from './PriceChartCanvas';
import TradingView from './TradingView';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';

/**
 *  Container styles
 */
const BGraph = styled.div.attrs({ className: 'bgraph' })`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const BGraphControls = styled.div`
    position: relative;
    flex-grow: 1;
    border-right: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    min-height: 0;
`;

const { isMobilePortrait: IS_MOBILE_PORTRAIT } = getScreenInfo();

class GraphTool extends Component {
    componentDidUpdate() {
        const {
            isDGLoaded,
            showOrderFormWith,
            isFirstLoad,
            setIsFirstLoad,
        } = this.props;

        // show depthChart & advanced Orderform by default when page is loaded
        if (isDGLoaded && isFirstLoad) {
            if (!IS_MOBILE_PORTRAIT) {
                showOrderFormWith(orderFormToggleKeys.onToggleKey);
            }
            setIsFirstLoad(false);
        }
    }

    render() {
        const {
            base,
            quote,
            exchanges,
            tradingViewMode,
            rightBottomSectionFullScreenMode,
        } = this.props;
        const baseSymbol = (base || '').replace('F:', '');
        const quoteSymbol = (quote || '').replace('F:', '');

        const exchangesKeys = Object.keys(exchanges);
        const hasExchanges = exchangesKeys.length && exchangesKeys.some(name => exchanges[name].active) && (!exchanges.Global || !exchanges.Global.active);

        const isTradingView = hasExchanges || tradingViewMode;

        return (
            <BGraph id="graph-chart-parent">
                {!rightBottomSectionFullScreenMode && (
                    <BGraphControls id="graph-chart-content">
                        {!isTradingView && (
                            <PriceChartCanvas />
                        )}
                        {isTradingView && (
                            <TradingView coinPair={baseSymbol ? `${baseSymbol}-${quoteSymbol}` : 'BTC-USDT'} />
                        )}
                        <ExchangesLabel insideGraph />
                    </BGraphControls>
                )}
            </BGraph>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.MARKETMAKER,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.EXCHANGESSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { isDGLoaded, base, quote },
            [STORE_KEYS.VIEWMODESTORE]: {
                tradingViewMode,
                isFirstLoad,
                setIsFirstLoad,
                viewMode,
                rightBottomSectionFullScreenMode,
            },
            [STORE_KEYS.MARKETMAKER]: { showOrderFormWith },
            [STORE_KEYS.EXCHANGESSTORE]: { exchanges },
        }) => {
            return {
                base,
                quote,
                isDGLoaded,
                tradingViewMode,
                isFirstLoad,
                setIsFirstLoad,
                viewMode,
                showOrderFormWith,
                exchanges,
                rightBottomSectionFullScreenMode,
            };
        }
    )
)(GraphTool);
