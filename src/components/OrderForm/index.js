import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';

import { STORE_KEYS } from '@/stores';
import { arbStateKeys } from '@/stores/ArbitrageStore';

import OrderContainer from './OrderContainer';

const Wrapper = styled.div.attrs({ className: 'order-form' })`
    display: flex;
    width: 100%;
`;

const OrderFrom = () => ({
    render () {
		const { activeCoin, arbState, hStep1 } = this.props;
    	let animation = 0;
		switch (arbState) {
			case arbStateKeys.ARB_NONE:
			case arbStateKeys.ARB_LOAD:
			case arbStateKeys.ARB_SETT:
				animation = 1;
				break;
			case arbStateKeys.ARB_PLAN:
				animation = 2;
				break;
			case arbStateKeys.ARB_EXEC:
				animation = 3;
				break;
			case arbStateKeys.ARB_RUN:
				animation = 4;
				break;
			default:
				animation = 0;
		}
        if (!hStep1) {
            animation = 0;
        }
        return (
        	<Wrapper>
				<OrderContainer activeCoin={activeCoin} animation={animation} isBuy />
				<OrderContainer activeCoin={activeCoin} animation={animation} />
			</Wrapper>
        );
    }
});

export default compose(
	inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.ARBITRAGESTORE),
	observer,
	withProps(
		({
		    [STORE_KEYS.VIEWMODESTORE]: { arbMode, setArbMode },
			[STORE_KEYS.ARBITRAGESTORE]: { arbState, activeCoin, hStep1 },
		}) => ({
			setArbMode,
            arbMode,
			arbState,
			activeCoin,
            hStep1,
		})
	)
)(OrderFrom);
