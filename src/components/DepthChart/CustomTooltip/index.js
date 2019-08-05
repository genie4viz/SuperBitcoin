import React, { memo } from 'react';
import { formatTotalDigitString } from '@/utils';
import CoinIcon from '@/components-generic/CoinIcon';
import { Container, PriceWrapper, ArrowIcon } from './styles';

const CustomTooltip = memo(({ tooltipModel, datasets, base, quote, defaultFiat }) => {
    if (!tooltipModel || !tooltipModel.meta) {
        return false;
    }

    const { datasetIndex, tooltipXPosition, meta, index } = tooltipModel;
    const data = datasets[datasetIndex][index];
    const left = meta.x + (datasetIndex ? 1 : -1);

    return (
        <Container left={left} datasetIndex={datasetIndex} tooltipXPosition={tooltipXPosition}>
            <CoinIcon size={18} value={datasetIndex ? quote : base} defaultFiat={defaultFiat} />
            {!!datasetIndex && <PriceWrapper>{formatTotalDigitString(data ? data.x : 0, 6)}</PriceWrapper>}
            <ArrowIcon />
            {!datasetIndex && <PriceWrapper>{formatTotalDigitString(data ? data.x : 0, 6)}</PriceWrapper>}
            <CoinIcon size={18} value={datasetIndex ? base : quote} defaultFiat={defaultFiat} />
        </Container>
    );
});

export default CustomTooltip;
