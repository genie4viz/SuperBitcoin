import styled from 'styled-components/macro';
import { Tooltip } from 'react-tippy';

import { darkTheme } from '@/theme/core';

export const Cell = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    ${props => props.cellWidth && `width: ${props.cellWidth}%;`}
    flex-shrink: 0;
    flex-grow: 0;
`;

export const HeaderCellStyled = styled(Tooltip)`
    display: flex;
    position: relative;
    align-items: center;
    ${props => props.cellWidth && `width: ${props.cellWidth}%;`}
    flex-shrink: 0;
    flex-grow: 0;
    justify-content: flex-end;
    border-left: 1px solid ${darkTheme.palette.orderBookHeaderBorder};

    &:not(:last-child) {
        border-right: 1px solid ${darkTheme.palette.orderBookHistoryCellInnerborder};
    }

    .tooltip-text-wrapper {
        span {
            font-size: 16px;
        }
    }

    .priceCell {
        display: flex;
        align-items: center;

        font-size: 14px;
        font-weight: bold;
        text-align: center;
        padding-right: 12px;

        .divider {
            line-height: 14px;
            font-size: 15px;
            padding: 0 4px;
        }
    }

    .expoAmount {
        font-size: 14px;
        font-weight: bold;
        padding-right: 12px;
        white-space: nowrap;
    }
`;