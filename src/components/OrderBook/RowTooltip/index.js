import React, { PureComponent } from 'react';
import { Tooltip } from 'react-tippy';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { getScreenInfo } from '@/utils';
import { STORE_KEYS } from '@/stores';
import TooltipContent from './TooltipContent';

import { Wrapper } from './styles';

const IS_MOBILE = getScreenInfo().isMobileDevice;

const TOOLTIP_OPTIONS = {
    modifiers: {
        preventOverflow: { enabled: true },
        flip: { enabled: true },
        hide: { enabled: false }
    }
};

class RowTooltip extends PureComponent {
    getTooltipContent = () => {
        const {
            isBuy,
            price,
            nextPrice,
            prevPrice,
            exchange,
            index,
            total,
            priceFractionDigits,
            priceIntLength,
            priceDigitsGap,
            adjPrice
        } = this.props;

        return (
            <TooltipContent
                isBuy={isBuy}
                price={price}
                nextPrice={nextPrice}
                prevPrice={prevPrice}
                exchange={exchange}
                index={index}
                total={total}
                midPrice={adjPrice}
                adjPrice={adjPrice}
                priceFractionDigits={priceFractionDigits}
                priceIntLength={priceIntLength}
                priceDigitsGap={priceDigitsGap}
            />
        );
    };

    render() {
        const { isBuy, className, children, onClick, onMouseEnter, onMouseLeave } = this.props;

        return (
            <Wrapper onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <Tooltip
                    arrow
                    unmountHTMLWhenHide
                    delay={300}
                    duration={250}
                    animation="fade"
                    position="right"
                    placement="right"
                    theme={isBuy ? 'orderbook' : 'orderbook-sell'}
                    className={className}
                    style={{ display: 'Wrapper' }}
                    disabled={IS_MOBILE}
                    html={this.getTooltipContent()}
                    popperOptions={TOOLTIP_OPTIONS}
                >
                    {children}
                </Tooltip>
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(STORE_KEYS.ORDERBOOKBREAKDOWN),
    observer,
    withProps(({ [STORE_KEYS.ORDERBOOKBREAKDOWN]: { adjPrice } }) => ({
        adjPrice
    }))
);

export default withStore(RowTooltip);
