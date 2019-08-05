import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { withSafeTimeout } from '@hocs/safe-timers';
import { STORE_KEYS } from '@/stores';
import TimerTools from './TimerTools';
import { ToolbarWrapper, SelectedItem } from './PriceChartToolbar.style';
import { PulsateDot } from '../../TimeFilters/styles';

const injectProps = compose(
    inject(
        STORE_KEYS.HISTORICALPRICESSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
    ),
    withProps(
        (store) => ({
            selectedFilterKey: store[STORE_KEYS.HISTORICALPRICESSTORE].selectedFilterKey,
            onChangeFilter: store[STORE_KEYS.HISTORICALPRICESSTORE].onChangeFilter,
            tradingViewMode: store[STORE_KEYS.VIEWMODESTORE].tradingViewMode,
        })
    ),
    observer,
)

const PriceChartToolbar = (props) => {
    const { onChangeFilter, selectedFilterKey, tradingViewMode, setSafeTimeout } = props;
    const [isOpen, setIsOpen] = useState(false);

    function handleChange(value) {
        onChangeFilter(value);
        handleDropdown(false);
    }

    function handleDropdown(value) {
        setSafeTimeout(() => {
            setIsOpen(value);
        }, 500);
    }

    function openDropdown() {
        handleDropdown(true);
    }

    function closeDropdown() {
        handleDropdown(false);
    }

    function handleMouseLeave(value) {
        handleDropdown(!value);
    }

    const selectedFilterName = selectedFilterKey || 'LIVE';

    return (
        <ToolbarWrapper>
            {
                !isOpen &&
                <SelectedItem
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                >
                    {
                        !selectedFilterKey &&
                        <PulsateDot />
                    }
                    <span>{selectedFilterName}</span>
                </SelectedItem>
            }
            {
                isOpen &&
                <TimerTools
                    onChange={handleChange}
                    selected={selectedFilterKey}
                    isDisabled={tradingViewMode}
                    onMoveOut={handleMouseLeave}
                    show={isOpen}
                />
            }
        </ToolbarWrapper>
    )
}

export default injectProps(withSafeTimeout(PriceChartToolbar));
