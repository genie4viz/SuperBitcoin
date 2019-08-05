import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell)`
    color: ${props => props.isBuy? props.theme.palette.orderBookTableCellTextBuy : props.theme.palette.orderBookTableCellTextSell};
    padding-right: 12px;
    padding-left: 12px;
`;

export const Inner = styled.span`
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
