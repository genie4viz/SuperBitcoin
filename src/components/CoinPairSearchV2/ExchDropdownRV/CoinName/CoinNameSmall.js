import React from 'react';
import { Tooltip } from 'react-tippy';
import COIN_DATA_MAP from '@/mock/coin-data-map';

import {
    SlidingCoinNameItem,
} from '../Components';

import { highlightSearchDom } from '@/utils';

const getCoinInfoLength = (obj) => {
    if (typeof obj === 'string') {
        return obj.length;
    }
    return obj[0].props.children.length + obj[1].props.children.length + obj[2].length;
}

const CoinNameSmall = ({ value, search, defaultFiat, isMobile, coinSymbolMaxLength, isSearch }) => {
    if (typeof value === 'string') {
        let symbol = (value || '').replace('F:', '');
        symbol = symbol === 'USDT' ? (defaultFiat === 'USD' ? 'USDT' : defaultFiat) : symbol;
        const coinName = COIN_DATA_MAP[value] && COIN_DATA_MAP[value].name;
        if (isSearch) {
            return <p className="exch-dropdown__title">
                <span>{symbol}</span>
            </p>
        }
        const text = `${symbol}${coinName ? `-${coinName}` : ''}`;
        return <Tooltip
            arrow
            animation="shift"
            position="bottom"
            theme="bct"
            distance={20}
            html={text}
        >
            <p className="exch-dropdown__title">
                <span>{text}</span>
            </p>
        </Tooltip>;
    }

    const symbol = (value && value.symbol ? value.symbol : '').replace('F:', '');
    const symbolName = highlightSearchDom(symbol, search);

    let coinName = '';
    if (value && value.name) {
        coinName = highlightSearchDom(value.name, search);
    }

    const coinNameLength = getCoinInfoLength(coinName);
    // const isSliding = coinNameLength > 20;
    const isSliding = false;

    let marqueeWidth = 0;
    if (isSliding) {
        marqueeWidth = 22 * coinNameLength / 410 * 100
    }

    const slidingCoinItemClassName = `exch-dropdown__sliding ${isSliding && 'animation'}`
    return value && value.name ? (
        <div className="exch-dropdown__title">
            <Tooltip
                arrow
                animation="shift"
                position="bottom"
                followCursor
                theme="bct"
                html={symbol === 'USD' ? `${value.name} tethered to ${defaultFiat}` : symbol}
            >
                <span style={coinSymbolMaxLength !== 0 ? {width: 22 * coinSymbolMaxLength} : {}}>{symbolName}</span>
            </Tooltip>
            {/* <div>
                {value.price && !search ?
                    <Fragment>
                        <div>${formatString(value.price, 2)}</div>
                        <div className={`${value.priceChange24 < 0 ? 'minus_change' : 'plus_change'}`}>
                            {symbol === "USDT" ? '0.00'
                                : ( value.priceChange24 < 0
                                ? `${formatString(value.priceChange24.toString().slice(1), 2)}%`
                                : `${formatString(value.priceChange24, 2)}%` )
                            }
                        </div>
                    </Fragment>
                    : ''
                }
            </div> */}
            {!isMobile && search && (
                <Tooltip 
                    arrow
                    animation="shift" 
                    position="bottom" 
                    followCursor 
                    theme="bct" 
                    html={value.name}
                >
                    <SlidingCoinNameItem
                        nameLength={coinNameLength}
                        marqueeWidth={marqueeWidth}
                        className={slidingCoinItemClassName}
                    >
                        <div>
                            <span>{coinName}</span>
                            <span>{coinName}</span>
                        </div>
                        <div className="coin-name__wrapper">
                            <span>{coinName}</span>
                        </div>
                    </SlidingCoinNameItem>
                </Tooltip>
            )}
        </div>
    ) : (
        <p className="exch-dropdown__title">
            <span>{symbolName}</span>
        </p>
    );
};

export default CoinNameSmall;
