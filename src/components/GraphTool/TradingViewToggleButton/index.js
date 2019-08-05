import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';
import { compose, withProps } from 'recompose';

import { Tooltip } from 'react-tippy';
import { STORE_KEYS } from '../../../stores';
import { TradingViewIcon, TradingViewImg } from '../icons';

const Wrapper = styled.div`
    margin-left: 10px;
    z-index: 1000;
`;

const TradingViewButton = styled.div.attrs({ className: 'chart-status__item' })`
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.active ? props.theme.palette.sidebarIconOpenedBg : props.theme.palette.clrMainWindow};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    cursor: pointer;
    
    &:hover {
        &:after {
            border-color: transparent transparent ${props => props.theme.palette.clrHighContrast} transparent !important;
        }
        
        .top-bar__icon {
            fill: ${props => props.theme.palette.clrHighContrast};
        }
    }
    
    .top-bar__icon {
        width: 40px;
        height: 40px;
        fill: ${props => props.active ? props.theme.palette.sidebarIconActive : props.theme.palette.sidebarIcon};
    }
`;

const TradingViewToggleButton = ({
    tradingViewMode, setTradingViewMode,
}) => {
    return (
        <Wrapper>
            <Tooltip
                arrow={true}
                animation="shift"
                position="right"
                theme="bct"
                title="TradingView"
            >
                <TradingViewImg
                    size={46}
                    active={tradingViewMode}
                    onClick={() => setTradingViewMode(!tradingViewMode)}
                />
            </Tooltip>
        </Wrapper>
    );
};

export default compose(
    inject(STORE_KEYS.VIEWMODESTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                tradingViewMode,
                setTradingViewMode,
            },
        }) => {
            return ({
                tradingViewMode,
                setTradingViewMode,
            });
        }
    )
)(TradingViewToggleButton);
