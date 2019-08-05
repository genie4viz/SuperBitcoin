import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: ${props => !props.isLoggedIn ? '' : 'absolute'};
    top:0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    border: none;
    z-index: 1000;
    height: 60px;
`;

export const AvatarWrapper = styled.div`
    position: absolute;
    right: 12px;
    top: 10px;
    width: 40px;
    height: 40px;
    z-index: 1000000;
    
    &:hover {
        div {
            display: block;
        }
    }
`;

const ThreeDotSvg = styled.svg`
    position: absolute;
    right: 12px;
    top: 8px;
    width: 45px;
    height: 45px;
    fill: ${props => props.theme.palette.clrHighContrast};
    stroke-width: 3;
    stroke: #878b91;
    cursor: pointer;
    margin-left: 12px;
    padding: 10px;
    background: ${props => props.theme.palette.clrBorderHoverLight};
    border-radius: 50%;
    &:hover {
        background: ${props => props.theme.palette.clrBorderHover};
        transition-duration: 0.3s;
        transform: scale(1.2);
    }
`;

export const Title = styled.div`
    font-size: 40px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    margin-left: 12px;
    margin-right: auto;
`;

export const ThreeDotIcon = (props) => (
    <ThreeDotSvg
        viewBox="0 0 38 38"
        role="img"
        aria-hidden="true"
        {...props}
    >
        <path d="M4 10l31 0" />
        <path d="M4 19l31 0" />
        <path d="M4 28l31 0" />
    </ThreeDotSvg>
);

export const Button = styled.button`
    height: 40px;
    margin-left: 12px;
    padding: 0 16px;
    border: 1px solid ${props => props.theme.palette.clrDarkPurple};
    border-radius: 3px;
    color: ${props => props.theme.palette.clrHighContrast};
    font-size: 15px;
    text-transform: uppercase;
    background-color: ${props => props.theme.palette.clrBorder};
`;


const DoubleArrowSvg = styled.svg`
    margin-right: 18px;
    margin-left: 24px;
    width: 15px;
    height: 18px;
    transform: rotateZ(90deg);
    cursor: pointer;
    &, & * {
        fill: ${props=>props.theme.palette.userMenuPopupMenuItem} !important;
    }
    path:last-child {
        transform: translateY(8px)
    }
`;

export const DoubleArrow = props => (
    <DoubleArrowSvg
        viewBox="0 0 15 18"
        {...props}
    >
        <path
            d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
        />
        <path
            d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
        />
    </DoubleArrowSvg>
);

export const Dropdown = styled.div`
    position: absolute;
    top: 62px;
    left: -13px;
    padding: 5px;
    white-space: pre;
    color: ${props => props.theme.palette.clrBorder};
    background: ${props => props.theme.palette.clrMainWindow};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
    box-shadow: 2px 0 0 2px rgba(0, 0, 0, .2);
    display: none;

    &:before {
        content: ' ';
        position: absolute;
        top: -7px;
        left: 25px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 7px solid ${props => props.theme.palette.clrBorder};
    }
`;
