import React, { memo } from 'react';
import styled from 'styled-components/macro';

const InputWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;    
    width: 100%;
    height: 100%;
    border: 2px solid ${props => props.theme.palette.clrBorder};    
    padding: 0px 4px;
    input {
        width: 100%;
        background-color: ${props => props.theme.palette.clrChartBackground} !important;
        border: none;
        outline: none;
        font-size: 12px;
        color: ${props => props.theme.palette.clrBorder};
        font-weight: bold;
        &:focus{
           outline: none;
        }
        &::placeholder {
            font-weight: bold;
            color: ${props => props.theme.palette.clrBorder};
        }
    }
`;
const PopupInput = memo(({className, placeholder}) => {
    return (
        <div className={className}>
            <InputWrapper>
                <input placeholder={placeholder} />
            </InputWrapper>
        </div>
    );
});

export default PopupInput;
