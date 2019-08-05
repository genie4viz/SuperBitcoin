import React from "react";
import { compose, withProps } from "recompose";
import { inject, observer } from "mobx-react";

import {
    Wrapper,
    AmountInput
} from './Components';
import { STORE_KEYS } from "@/stores";
import { commafy } from '@/utils';
import DataLoader from "@/components-generic/DataLoader";

const CoinAmountInput = props => {

    const { isLeft, hStep3, hStep4, activeCoinETHRate, arbMode, activeCoin } = props;
    const isFiatStock = (activeCoin || '').includes('F:');
    const value = (isLeft ? hStep3 : hStep4) * (((arbMode && isLeft) || (isFiatStock && isLeft)) ? activeCoinETHRate : 1);
    return (
        <Wrapper>
            {value > 0 ? (
                <AmountInput type="text" value={commafy(value.toPrecision(8))} isLeft={isLeft} readOnly/>
            ) : (
                <DataLoader/>
            )}
        </Wrapper>
    );

}

export default compose(
    inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.ARBITRAGESTORE),
    observer,
    withProps(
        ({
             [STORE_KEYS.VIEWMODESTORE]: {
                 arbMode,
             },
             [STORE_KEYS.ARBITRAGESTORE]: {
                 hStep3,
                 hStep4,
                 activeCoinETHRate,
                 activeCoin,
             },
         }) => ({
            arbMode,
            hStep3,
            hStep4,
            activeCoinETHRate,
            activeCoin,
        })
    ),
)(CoinAmountInput);

