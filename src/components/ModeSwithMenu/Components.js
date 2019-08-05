import styled, { css, keyframes } from 'styled-components/macro';
import React from "react";

const DropMenuSvg = styled.svg`
    width: 15px;
    height: 7px;
    fill: ${props => props.theme.palette.settingsText};
    transform: ${props => props.isOpened ? 'rotateZ(180deg)' :  'rotateZ(0deg)'};
    transition: all 0.1s;
`;

export const DropMenuIcon = (props) => (
    <DropMenuSvg
        viewBox="0 0 15 8.9"
        {...props}
    >
        <path
            className="st0"
            d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
        />
    </DropMenuSvg>
);

export const DropdownWrapper = styled.div.attrs({ className: 'dropdown-wrapper' })`
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
    height: 30px;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    background: transparent;
    
    &.close:hover {
        opacity: .8;
    }
`;

export const SelectedItemLabel = styled.span`
    position: relative;
    width: auto;
    height: 100%;
    margin: 0;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border: none;
    font-size: 14px;
    font-weight: 700;
    line-height: 1em;
    text-align: left;
    cursor: pointer;
    color: ${props => props.theme.palette.clrPurple};

    span {
        display: -webkit-box;
        line-height: 16px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 10px;
    }
`;

export const Dropdown = styled.div`
    position: absolute;    
    z-index: 100;
    display: flex;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background: ${props => props.theme.palette.clrMainWindow};
    border-left: 1px solid ${props => props.theme.palette.clrBorder};
    border-top: ${props => props.isOpened ? `1px solid ${props.theme.palette.clrBorder}` : 'none'};
    border-radius: ${props => props.theme.palette.borderRadius} 0 0 0;
    height: ${props => props.isOpened ? props.height : 0}px;
    bottom: 44px;
    transition: height 0.3s;
    ${props => props.expanded ? css`
        animation: ${keyframes`
            0% {
                overflow-y: auto;
            }
        `} 0.4s;
    ` : css`
        overflow-y: auto;
    `};
`;

export const DropdownItem = styled.div`
    min-height: ${props => props.minHeight || 45}px;
    border-bottom: 1px solid ${props => props.theme.palette.clrMouseHover};
    display: flex;
    width: ${props => props.width}px;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    padding: 4px 12px;
    color: ${props => props.theme.palette.clrPurple};
    &:hover {
        background: ${props => props.theme.palette.clrMouseHover};
        color: ${props => props.theme.palette.clrHighContrast};
    }
    
    &:active {
        background: ${props => props.theme.palette.clrMouseClick};
        color: ${props => props.theme.palette.clrHighContrast};
    }
`;
