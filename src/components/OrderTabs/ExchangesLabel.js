import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../stores';
import { Label, GlobalIcon, Logo } from './Components';

const ExchangesLabel = ({
    exchanges,
    marketExchanges,
    getActiveExchanges,
    id,
    className,
    selectedBase,
    multiLegMode,
    insideGraph,
    arbMode,
    stockMode,
}) => {
    const activeExchanges = marketExchanges.filter(
        m => m.name !== 'Global' && exchanges[m.name] && exchanges[m.name].active
    );
    let selectedTableItem = activeExchanges[activeExchanges.length - 1];


    const selectedMarketExchanges = marketExchanges.filter(m => m.status === 'active');
    const countExchange = activeExchanges.length === 0 ? selectedMarketExchanges.length : activeExchanges.length;
    if (activeExchanges.length === 0 && selectedMarketExchanges.length === 1) {
        const activeMarketNotGlobalExchanges = marketExchanges.filter(
            m => m.name !== 'Global' && m.status === 'active'
        );
        selectedTableItem = activeMarketNotGlobalExchanges[activeMarketNotGlobalExchanges.length - 1];
    }
    const selectedIcon = (selectedTableItem && selectedTableItem.icon) || null;

    /**
     *  Multi-Leg Label
     */
    const currency = !arbMode
        ? (selectedBase || '').replace('F:', '')
        : 'USD'; // in arbitrage mode, BTC->USD is default orderbook

    const isFiat = !stockMode && (selectedBase || '').includes('F:') || currency === 'USD';

    const legSymbol = isFiat ? 'USDT' : 'ETH';

    return !multiLegMode ? (
        <Label id={id} className={className} insideGraph={insideGraph}>
            {countExchange !== 1 ? <GlobalIcon /> : <Logo src={`/img/exchange/${selectedIcon}`} alt="" />}
            {getActiveExchanges()}
        </Label>
    ) : (
        <Label id={id} className={className} insideGraph={insideGraph}>
            <Tooltip
                arrow={true}
                position="top"
                theme="bct"
                title={`[${currency} &gt; ${legSymbol}] + [${legSymbol} &gt; BTC]`}
                className="full-width"
            >
                <Label>
                    {countExchange !== 1 ? <GlobalIcon /> : <Logo src={`/img/exchange/${selectedIcon}`} alt="" />}
                    {getActiveExchanges()}
                </Label>
            </Tooltip>
        </Label>
    );
};

export default compose(
    inject(
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.FIATCURRENCYSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: { exchanges, marketExchanges, getActiveExchanges, validMarketExchanges },
            [STORE_KEYS.INSTRUMENTS]: { selectedBase },
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { multiLegMode },
            [STORE_KEYS.VIEWMODESTORE]: { arbMode },
            [STORE_KEYS.FIATCURRENCYSTORE]: {
                stockMode,
            },
        }) => {
            return {
                exchanges,
                marketExchanges,
                getActiveExchanges,
                validMarketExchanges,
                selectedBase,
                multiLegMode,
                arbMode,
                stockMode,
            };
        }
    )
)(ExchangesLabel);
