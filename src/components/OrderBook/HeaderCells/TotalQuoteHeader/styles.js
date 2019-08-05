import styled from 'styled-components/macro';

import { SwipArrowIcon } from '@/components-generic/ArrowIcon';

export const SwipArrowIconStyled = styled(SwipArrowIcon)`
    display: none;
    position: absolute;
    left: -10px;
`;

export const CoinNameWrapper = styled.span`
    color: ${props => props.theme.palette.orderBookHeaderText2};
    font-weight: bold;
    font-size: 16px;

    img {
        height: 100%;
    }
`;
