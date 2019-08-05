
import React from 'react';
import styled from 'styled-components';
import x from '@/components-generic/Modal/x.svg';

export const Wrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000000;
    ${props => props.hoverMode && 'pointer-events: none;'}
    ${props => props.inLineMode && 'display:none;'}
`;


export const ModalWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4000;
    background: rgba(0,0,0,0.435);
    border-radius: ${props => props.theme.palette.borderRadius};
`;

export const InnerWrapper = styled.div`
    position: relative;
`;

const Close = styled.button`
    border-radius: 50%;
    border: 0;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    background-color: ${props => props.theme.palette.modalCloseBackground};
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 21px;
    height: 21px;
    cursor: pointer;
    z-index: 1;

    &:hover {
        filter: brightness(110%);
    }

    &:focus {
        outline: none;
    }
`;

const Icon = styled.img`
    width: 50%;
    height: 50%;
`;

export const CloseButton = ({ onClick }) => {
    const handleOnClick = e => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    }
    return (
        <Close onClick={handleOnClick}>
            <Icon src={x} />
        </Close>
    )
}
