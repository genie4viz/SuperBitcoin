import React from 'react';

import { HeaderCellStyled } from '../../Cells/commonStyles';

const HeaderCell = ({ children, tooltipText, cellWidth }) => (
    <HeaderCellStyled
        cellWidth={cellWidth}
        arrow={true}
        animation="fade"
        position="top"
        placement="top"
        distance={10}
        theme="bct"
        style={{ display: 'flex' }}
        html={
            <div className="tooltip-text-wrapper advanced-tooltip text-left">
                <span>{tooltipText}</span>
            </div>
        }
        popperOptions={{
            modifiers: {
                preventOverflow: {
                    enabled: false
                },
                flip: {
                    enabled: false
                },
                hide: {
                    enabled: false
                }
            }
        }}
    >
        {children}
    </HeaderCellStyled>
);

export default HeaderCell;
