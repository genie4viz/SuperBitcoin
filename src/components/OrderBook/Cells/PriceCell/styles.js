import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell)`
    padding-right: 12px;
    justify-content: flex-end;
    border-left: 1px solid ${props => props.theme.palette.orderBookHeaderBorder};
`;

export const ResultNumber = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: ${({ type, theme }) => {
        switch (type) {
            case 'buy':
                return theme.palette.orderBookTableCellTextBuyBright;
            case 'sell':
                return theme.palette.orderBookTableCellTextSellBright;
            case 'header':
            default:
                return theme.palette.orderBookHeaderText2;
        }
    }};

    span::after {
        content: attr(data-end);
        color: ${({ type, theme }) => {
            switch (type) {
                case 'buy':
                    return '#7bdb7a';
                case 'sell':
                    return '#66cbff';
                case 'header':
                default:
                    return theme.palette.orderBookHeaderText2;
            }
        }};
    }
`;

export const IntegerWrapper = styled.span`
    ${({ type }) => (type !== 'header' ? '' : 'opacity: 0.7;')}
    ${({ type, theme }) => {
        switch (type) {
            case 'buy':
                return `color: ${theme.palette.orderBookTableCellTextBuyPriceInteger};`;
            case 'sell':
                return `color: ${theme.palette.orderBookTableCellTextSellPriceInteger};`;
            case 'header':
            default:
                return `color: ${theme.palette.orderBookHeaderText2};`;
        }
    }}
`;

export const ZerosWrapper = styled.span`
    opacity: ${({ position }) => {
        switch (position) {
            case 'leading':
                return 0;
            case 'trailing':
            default:
                return 0.39;
        }
    }};
`;

export const AtSymbol = styled.span`
    opacity: 0.25;
`;
