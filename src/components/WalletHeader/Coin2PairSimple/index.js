import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../../stores';
import {
    Wrapper,
    CWrapper,
    C2Wrapper,
    Title,
    CoinSwap
} from './Components';
import { ThreeDotIcon } from '../Components';

class Coin2PairSimple extends Component {
    componentDidMount() {
    }

    toggleBillsPopup = (symbol) => {
        this.props.showBillChips(symbol);
    };

    render() {
        const {
            isLoggedIn,
            toggleDropDown,
            isMenuOpened,
        } = this.props;
        const value1 = 'BTC';
        const value2 = 'USDT';

        return (
            <Wrapper isMenuOpened={isMenuOpened} isLoggedIn={isLoggedIn}>
                {isLoggedIn && <ThreeDotIcon onClick={toggleDropDown} />}
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.BILLSMODALSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.BILLSMODALSTORE]: {
                showBillChips,
            },
        }) => ({
            showBillChips,
        })
    )
);

export default withStore(Coin2PairSimple);
