import styled, { keyframes, css } from 'styled-components/macro';
import { fadeIn, fadeOut } from '@/theme/animations';

export const ToolbarWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 72px;
    background: ${props => props.theme.palette.clrMainWindow};
`;

export const ToolbarGroupWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border-right: 1px solid ${props => props.theme.palette.clrBorder};
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    border-top-left-radius: 3px;
    border-bottom-right-radius: 3px;
    ${props => props.show ? css`
    animation: ${fadeOut} 0.5s forwards;
    ` : css`
        animation: ${fadeIn} 0.5s forwards;
    `};
    transition: all 0.5s ease;
`;

export const SelectedItem = styled.div`
    height: 30px;
    width: calc(100% - 1px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid ${props => props.theme.palette.clrBorder};
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    font-weight: bold;
    background: ${props => props.theme.palette.clrMainWindow};
    color: ${props => props.theme.palette.clrPurple};
    cursor: pointer;
    &:hover {
        color: ${props => props.theme.palette.orderFormHeaderTabTextHover};
        transition-duration: 0.3s;
    }

    span {
        margin-left: 10px;
        text-align: center;
    }
`;

export const ToolbarItem = styled.div`
    position: relative;
    width: calc(100% - 1px);
    height: 30px;
    font-size: 14px;
    font-weight: bold;
    background: ${props => props.isActive ? props.theme.palette.clrBackground : props.theme.palette.clrChartBackground};
    color: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
    text-align: center;
    padding: 4px 10px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
    &:hover {
        ${({ disabled }) => (!disabled && `
            color: white;
            border-color: white;
            transition-duration: 0.3s;
            font-size: 16px;
        `)}
    }
`;

export const ToolbarLiveItem = styled(ToolbarItem)`
    width: calc(100% - 1px);
    justify-content: space-between;
`;

const pulsateRing = keyframes`
    0% {
        transform: scale(.33);
    }
    80%, 100% {
        opacity: 0;
    }
`;

const pulsateDot = keyframes`
    0% {
        transform: scale(.8);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(.8);
    }
`;

export const PulsateDot = styled.div`
    position: relative;
    width: 10px;
    height: 10px;

    &:before {
        content: '';
        position: relative;
        display: block;
        width: 300%;
        height: 300%;
        box-sizing: border-box;
        margin-left: -100%;
        margin-top: -100%;
        border-radius: 45px;
        background-color: #01a4e9;
        animation: ${pulsateRing} 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
        animation: ${pulsateDot} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    }
`;


export const SVG = styled.svg`
    width: 18px;
    height: 18px;
    fill: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
    &:hover {
        fill: #fff;
    }

    > g {
        fill: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
        &:hover {
            fill: #fff;
        }
    }
`