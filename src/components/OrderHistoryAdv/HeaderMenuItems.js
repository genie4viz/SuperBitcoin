import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { MODE_KEYS, MODE_LABELS, EXTRA_DROPMENU_LABELS } from './Constants';
import { HeaderMenu, Menu, DropMenuWrapper, ToolbarItem, IcFullScreen, IcExitFullScreen } from './Components';
import DropMenu from './DropMenu';
import { STORE_KEYS } from '@/stores';
import { getScreenInfo } from '@/utils';
import { viewModeKeys } from '@/stores/ViewModeStore';

const IS_MOBILE = getScreenInfo().isMobileDevice;

class HeaderMenuItems extends Component {
    state = {};
    render() {
        const {
            rightBottomSectionOpenMode,
            setRightBottomSectionOpenMode,
            rightBottomSectionFullScreenMode,
            setRightBottomSectionFullScreenMode,
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore,
        } = this.props;
        const instrumentData = ['All', instrumentsStore.selectedBase, instrumentsStore.selectedQuote];
        const statusData = ['All', 'Filled', 'Canceled', 'Rejected', 'Expired'];

        let SELECTED_MODE_KEYS = [
            MODE_KEYS.myTradesModeKey,
        ];

        // check which items form preferences are ON. set them in header
        if (this.props[STORE_KEYS.VIEWMODESTORE].isPreferenceDepthChartON
            && !SELECTED_MODE_KEYS.includes(MODE_KEYS.depthChartKey)) {
            SELECTED_MODE_KEYS.push(MODE_KEYS.depthChartKey);
        }

        if (this.props[STORE_KEYS.VIEWMODESTORE].isPreferenceActiveOrdersON
            && !SELECTED_MODE_KEYS.includes(MODE_KEYS.activeModeKey)) {
            SELECTED_MODE_KEYS.push(MODE_KEYS.activeModeKey);
        }
        
        if (this.props[STORE_KEYS.VIEWMODESTORE].isPreferenceFilledOrdersON
            && !SELECTED_MODE_KEYS.includes(MODE_KEYS.filledModeKey)) {
            SELECTED_MODE_KEYS.push(MODE_KEYS.filledModeKey);
        }

        return (
            <HeaderMenu>
                {Object.values(SELECTED_MODE_KEYS).map(key =>
                    <Menu
                        key={key}
                        active={rightBottomSectionOpenMode === key}
                        onClick={() => setRightBottomSectionOpenMode(key)}
                    >
                        {MODE_LABELS[key]}
                    </Menu>
                )}
                {
                    [
                        MODE_KEYS.activeModeKey,
                        MODE_KEYS.filledModeKey,
                        MODE_KEYS.myTradesModeKey,
                    ].includes(rightBottomSectionOpenMode) &&
                    !IS_MOBILE &&
                    <DropMenuWrapper>
                        <DropMenu data={instrumentData} label="Instrument" />
                        {EXTRA_DROPMENU_LABELS[rightBottomSectionOpenMode].map(label => <DropMenu key={label} data={statusData} label={label} />)}
                    </DropMenuWrapper>
                }
                {/* {
                    ![MODE_KEYS.depthChartKey].includes(rightBottomSectionOpenMode) &&
                    <ToolbarItem
                        onClick={() => setRightBottomSectionFullScreenMode(!rightBottomSectionFullScreenMode)}
                    >
                        {!rightBottomSectionFullScreenMode && <IcFullScreen />}
                        {rightBottomSectionFullScreenMode && <IcExitFullScreen />}
                    </ToolbarItem>
                } */}
            </HeaderMenu>
        );
    }
}

export default inject(
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.VIEWMODESTORE,
)(observer(HeaderMenuItems));