import React, { memo } from 'react';
import styled from 'styled-components/macro';

import Slider from '@material-ui/core/Slider';
import { customDigitFormat, convertToFloat } from '@/utils';

// import InputCell from '../InputOrderCell';
// import SliderInput from '../SliderInput';

const MULTIPLIER = 10000;

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    
    > input {
        width: 100%;
        height: 40px;
        color: ${props => (props.isBuy ? props.theme.palette.btnPositiveText : props.theme.palette.btnNegativeText)};
        justify-content: space-between;
        padding: 0 55px 0 8px;
        margin-bottom: 25px;
        background: ${props => props.theme.palette.orderFormInputBg};
        border: 2px solid ${props => props.theme.palette.orderFormInputBorder};
        border-radius: 0;
        font-size: 22px;
        font-weight: 600;
        position: relative;
        outline: none;
        ${props => props.isDisabled && `
            cursor: url('/img/not-allowed1.cur'), not-allowed !important;        
        `}
    }
    
    .symbol {
        position: absolute;
        right: 8px;
        top: 5px;
        font-size: 22px;
        font-weight: 600;
        color: ${props => (props.isBuy ? props.theme.palette.btnPositiveText : props.theme.palette.btnNegativeText)};
    }
    
    .slider {
        position: absolute;
        left: 12px;
        top: 27px;
        right: 12px;
        width: unset;
        height: 2px;
        color: ${props => (props.isBuy ? props.theme.palette.btnPositiveText : props.theme.palette.btnNegativeText)};
        transition: all 0.5s;
        
        .MuiSlider-rail {
            background-color: transparent;
        }
    }
`;

export const SpotInputCell = memo(({
    value,
    handleInputChange,
    symbol,
    isBuy,
    max,
    progress,
    type,
}) => {
    const isDisabled = type !== 'buy_from' && type !== 'sell_from';
    const current = customDigitFormat(value, 9);
    
    const handleChange = (e) => {
        if (!isDisabled) {
            handleInputChange(convertToFloat(e.target.value));
        }
    };

    const handleSliderChange = (e, val) => {
        if (!isDisabled) {
            handleInputChange(convertToFloat(val / MULTIPLIER));
        }
    };
    
    return (
        <Wrapper isBuy={isBuy} progress={progress} isDisabled={isDisabled}>
            <input
                type="text"
                value={current} 
                disabled={isDisabled}
                onChange={handleChange}
            />

            <span className="symbol">{symbol}</span>
            
            {(type === 'buy_from' || type === 'sell_from') && (
                
                <Slider className='slider'
                        disabled={isDisabled}
                        max={max * MULTIPLIER}
                        step={max}
                        value={value * MULTIPLIER}
                        onChange={handleSliderChange}
                />

            )}
        </Wrapper>
    );
});
