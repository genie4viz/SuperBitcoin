import React from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    margin: 12px 0 0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const LabelWrapper = styled.div.attrs({ className: 'add-funds2__input-field__label-wrapper' })`
    // position: absolute;
    // margin: 0 0 5px 10px;
    padding: 2px;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.palette.clrback};
`;

const Label = styled.p`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 0.8;
    color: ${props => props.theme.palette.clrPurple};
`;

const InputWrapper = styled.div`
    margin-top: 10px;
    display: flex;
`;

const Input = styled.input`
    width: 100%;
    height: 60px;
    padding: 15px;
    background-color: ${props => props.theme.palette.depositInputBackground};
    border: 1px solid ${props => props.theme.palette.depositInputBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 18px;
    color: ${props => props.theme.palette.contrastText};
    cursor: ${props => props.readOnly ? 'initial' : 'text'};
    
    &:focus {
        outline: none;
    }
    
    &::placeholder {
        font-weight: 300;
        color: ${props => props.theme.palette.depositText} !important;
    }
`;

const InputField = ({
    className, label, placeholder, value, changeValue,
    readOnly, type, handleInputFocus, handleInputBlur,
}) => (
    <Wrapper className={className}>
        <LabelWrapper>
            <Label>{label}</Label>
        </LabelWrapper>

        <InputWrapper>
            <Input
                type={type || 'text'}
                placeholder={placeholder || ''}
                value={value}
                readOnly={readOnly}
                onFocus={readOnly ? null : handleInputFocus}
                onBlur={readOnly ? null : handleInputBlur}
                onChange={e => changeValue ? changeValue(e.target.value) : null}
            />
        </InputWrapper>
    </Wrapper>
);

export default InputField;
