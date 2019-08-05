import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { numberWithCommas } from '@/utils';
import DataLoader from '@/components-generic/DataLoader';
import { STORE_KEYS } from '@/stores';

import { DataLoaderWrapper, ExchangeRateWrapper } from './styles';

const ExchangeRate = props => {
    const {
        price, selectedQuote, selectedBase, getLocalCurrency, getDefaultPrice,
        amount, adjPrice, arbMode, c2Rate, stockMode,
        toggleDropdown, getPriceOf, usdOfBTC, euroOfBTC, isAUMSelected,
    } = props;

    const getRate = () => {
        if (isAUMSelected) {
            return amount;
        }

        if (getLocalCurrency(selectedBase) === getLocalCurrency(selectedQuote)) {
            return 1;
        }

        let preparedPrice = price;
        if (adjPrice !== undefined && !(selectedBase || '').includes('F:') && !arbMode) {
            preparedPrice = adjPrice;
            if (selectedBase === 'USDT') {
                preparedPrice = 1 / adjPrice;
            }
        }
        if ((selectedBase || '').includes('F:') && !stockMode) {
            preparedPrice = 1 / price;
        }

        return arbMode ? c2Rate : getDefaultPrice(preparedPrice * amount);
    };

    const isLoading = !price || !selectedQuote;
    const c2RateOfBTC = getRate();
    let c2RateOfUSD = 0;
    let c2RateOfEURO = 0;
    if (selectedBase === 'USDT') {
        c2RateOfUSD = getPriceOf(selectedBase) * amount;
        c2RateOfEURO = c2RateOfUSD / getPriceOf('F:EUR');
    } else {
        c2RateOfUSD = c2RateOfBTC * usdOfBTC;
        c2RateOfEURO = c2RateOfBTC * euroOfBTC;
    }

    return (
        <ExchangeRateWrapper onClick={toggleDropdown}>
            <Tooltip
                html={(
                    <div>
                        <div>
                            <strong>₿</strong> {numberWithCommas(c2RateOfBTC)}
                        </div>
                        <div>
                            <strong>$</strong> {numberWithCommas(c2RateOfUSD)}
                        </div>
                        <div>
                            <strong>€</strong> {numberWithCommas(c2RateOfEURO)}
                        </div>
                    </div>
                )}
                arrow={true}
                animation="shift"
                position="bottom"
                theme="bct"
            >
                <span>{!isLoading && numberWithCommas(c2RateOfBTC, selectedQuote === 'USDT' ? 2 : 9)}</span>
            </Tooltip>
            {isLoading && (
                <DataLoaderWrapper>
                    <DataLoader width={50} height={50} />
                </DataLoaderWrapper>
            )}
        </ExchangeRateWrapper>
    );
}

const withStore = compose(
    inject(
        STORE_KEYS.PRICECHARTSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.ARBITRAGESTORE,
        STORE_KEYS.FIATCURRENCYSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.PRICECHARTSTORE]: { price, getPriceOf, euroOfBTC, usdOfBTC },
            [STORE_KEYS.SETTINGSSTORE]: { getLocalCurrency, getDefaultPrice, accessLevel },
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { adjPrice },
            [STORE_KEYS.VIEWMODESTORE]: { arbMode },
            [STORE_KEYS.ARBITRAGESTORE]: { c2Rate },
            [STORE_KEYS.FIATCURRENCYSTORE]: { stockMode },
        }) => ({
            price,
            getLocalCurrency,
            getDefaultPrice,
            accessLevel,
            adjPrice,
            arbMode,
            c2Rate,
            getPriceOf,
            stockMode,
            euroOfBTC,
            usdOfBTC
        })
    )
);

export default withStore(ExchangeRate);
