import React, { Fragment } from 'react';
import { Tooltip } from 'react-tippy';
import COIN_DATA_MAP from '@/mock/coin-data-map';

import { highlightSearchDom, formatString } from '@/utils';

const CoinName = ({ value, search, defaultFiat, isMobile }) => {
    if (typeof value === 'string') {
        const symbol = (value || '').replace('F:', '');

        return COIN_DATA_MAP[value] && COIN_DATA_MAP[value].name ? (
            <p className="exch-dropdown__title">
                <span>
                    {symbol === 'USDT'
                        ? defaultFiat === 'USD'
                            ? 'USDT'
                            : defaultFiat
                        : highlightSearchDom(symbol, search)}
                </span>
            </p>
        ) : (
            <p className="exch-dropdown__title">
                <span>{highlightSearchDom(symbol, search)}</span>
            </p>
        );
    }

    const symbol = (value && value.symbol ? value.symbol : '').replace('F:', '');

    return value && value.name ? (
        <Tooltip
            arrow={true}
            animation="shift"
            position="bottom"
            followCursor
            theme="bct"
            title={
                symbol === 'USD'
                    ? `${highlightSearchDom(value.name, search)} tethered to ${defaultFiat}`
                    : highlightSearchDom(value.name, search)
            }
        >
            <div className="exch-dropdown__title">
                <span>{highlightSearchDom(symbol, search)}</span>
                <div>
                    {value.price && !search ?
                        <Fragment>
                            <div>${formatString(value.price, 2)}</div>
                            <div className={`${value.priceChange24 < 0 ? 'minus_change' : 'plus_change'}`}>
                                {`${value.priceChange24 < 0 ? '' : '+'}${formatString(value.priceChange24, 2)}%`}
                            </div>
                        </Fragment>
                        : ''
                    }
                </div>
                {!isMobile && search && <> - {highlightSearchDom(value.name, search)}</>}
            </div>
        </Tooltip>
    ) : (
        <p className="exch-dropdown__title">
            <span>{highlightSearchDom(symbol, search)}</span>
        </p>
    );
};

export default CoinName;
