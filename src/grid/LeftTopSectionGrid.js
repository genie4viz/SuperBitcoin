import React, { PureComponent } from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '../stores';
import { viewModeKeys } from '../stores/ViewModeStore';
import OrderBookRecentTradesContainer from '../components/OrderBookRecentTradesContainer';
import PayApp from '../components/CryptoApp';
import SettingsPanel from '../components/SettingsPanel';
import ExchangeCellsV2 from '../components/GraphTool/ExchangeCellsV2';

const StyledLeftTopSectionGrid = styled.div`
    position: relative;
    ${props =>
        props.isMobilePortrait || props.isSmallWidth ? 'width: calc(100% - 8px);' : 'max-width: 33%; width: 33%;'}
    margin-left: ${props => props.isTrading && !props.isMobilePortrait ? '-33%' : '12px'};
    transition: margin .1s linear;

    & > div:first-child {
        transition: none !important;
        margin-left: 0 !important;
        width: 100% !important;
    }
`;

class LeftTopSectionGrid extends PureComponent {
    getComponentToRender = () => {
        const {
            viewMode,
            setIsPayApp,
            isSettingsOpen,
            isEmptyExchange,
            isOrderBookBreakDownStop,
            isOrderBookDataLoaded,
            isMobileDevice
        } = this.props;

        if (isSettingsOpen) {
            return SettingsPanel;
        }

        switch (viewMode) {
            case viewModeKeys.basicModeKey:
                if (isMobileDevice) {
                    setIsPayApp(true);
                    return PayApp;
                }
                return OrderBookRecentTradesContainer;
            case viewModeKeys.advancedModeKey:
                if (!isOrderBookBreakDownStop && isOrderBookDataLoaded && !isEmptyExchange) {
                    return OrderBookRecentTradesContainer;
                }
                return ExchangeCellsV2;
            case viewModeKeys.settingsModeKey:
                return SettingsPanel;
            case viewModeKeys.exchangesModeKey:
                return ExchangeCellsV2;
            default:
                setIsPayApp(true);
                return PayApp;
        }
    };

    render() {
        const {
            isPayAppLoading,
            isUserDropDownOpen,
            isCoinTransfer,
            isMobileDevice,
            isMobilePortrait,
            isSmallWidth,
        } = this.props;

        const ComponentToRender = this.getComponentToRender();

        return (
            <StyledLeftTopSectionGrid
                id="left-sidebar"
                isMobilePortrait={isMobilePortrait}
                isSmallWidth={isSmallWidth}
                isSidebarMenuOpen={isUserDropDownOpen}
            >
                <ComponentToRender
                    isLeftTop
                    isMobileDevice={isMobileDevice}
                    isCoinTransfer={isCoinTransfer}
                    trId={isCoinTransfer ? this.props.trId : null}
                    firstLoad={isPayAppLoading}
                    isUserDropDownOpen={isUserDropDownOpen}
                    isSidebarMenuOpen={isUserDropDownOpen}
                />
            </StyledLeftTopSectionGrid>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.ORDERBOOKBREAKDOWN
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: { viewMode, isSettingsOpen, isPayAppLoading, isUserDropDownOpen, setIsPayApp },
            [STORE_KEYS.EXCHANGESSTORE]: { isEmptyExchange },
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { isOrderBookBreakDownStop, isOrderBookDataLoaded }
        }) => ({
            viewMode,
            setIsPayApp,
            isSettingsOpen,
            isPayAppLoading,
            isEmptyExchange,
            isOrderBookBreakDownStop,
            isOrderBookDataLoaded,
            isUserDropDownOpen
        })
    )
);

export default withStore(LeftTopSectionGrid);
