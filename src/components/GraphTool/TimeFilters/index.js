import React, { Component } from 'react';

import { FILTERS } from '../../../stores/HistoricalPricesStore';

import {
    FiltersWrapper, FilterItem, LiveItem, PulsateDot
} from './styles';

const TimeFilters = ({ onChange, selected, minTime = 0 }) => {
    const now = Date.now();
    const filterValues = Object.values(FILTERS);
    return (
        <FiltersWrapper>
            {!!selected && (
                <LiveItem onClick={() => onChange()}>
                    <PulsateDot />
                    LIVE
                </LiveItem>
            )}
            {filterValues.map((item, i) => {
                const disabled = i && minTime && minTime > now - filterValues[i - 1].ms;
                return (
                    <FilterItem
                        key={item.key}
                        onClick={disabled ? undefined : () => onChange(item.key)}
                        isActive={selected === item.key}
                        disabled={disabled}
                    >
                        {item.key}
                    </FilterItem>
                );
            })}
        </FiltersWrapper>
    );
};

export default TimeFilters;
