import React from 'react';

import { FILTERS } from '@/stores/HistoricalPricesStore';

import {
    ToolbarGroupWrapper, ToolbarItem, PulsateDot, ToolbarLiveItem
} from './PriceChartToolbar.style';

import { animateButton } from "@/utils/CustomControls";

const TimerTools = ({ onChange, selected, minTime = 0, isDisabled, onMoveOut }) => {
    const now = Date.now();
    const filterValues = Object.values(FILTERS);

    return (
        <ToolbarGroupWrapper
            onMouseEnter={() => onMoveOut(false)}
            onMouseLeave={() => onMoveOut(true)}
        >
            {!!selected && (
                <ToolbarLiveItem onClick={() => onChange()}>
                    <PulsateDot />
                    LIVE
                </ToolbarLiveItem>
            )}
            {filterValues.map((item, i) => {
                const disabled = i && minTime && minTime > now - filterValues[i - 1].ms;
                return (
                    <ToolbarItem
                        id={item.key}
                        key={item.key}
                        onClick={() => {
                            animateButton(item.key);
                            if(disabled || isDisabled) {
                                return undefined;
                            }

                            onChange(item.key);
                        }}
                        isActive={selected === item.key}
                        disabled={disabled || isDisabled}
                    >
                        {item.key}
                    </ToolbarItem>
                );
            })}
        </ToolbarGroupWrapper>
    );
};

export default TimerTools;
