import styled, { keyframes } from 'styled-components';

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const keyFrameFadeIn = keyframes`
    0% {
        background-color: #000c;
    }
    100% {
        background-color: black;
    }
`;

const keyFrameLoading = width => keyframes`

    ${width === 74 ? `
        0% {
            transform: translate(0, 0) rotate(0);
        }
        100% {
            transform: translate(0, 0) rotate(360deg);
        }
    ` : `
        0% {
            transform: translate(0, 0) rotate(0);
        }

        35% {
            transform: translate(${width - 72}px, 0) rotate(0deg);
        }

        50% {
            transform: translate(${width - 72}px, 0) rotate(180deg);
        }

        85% {
            transform: translate(0, 0) rotate(180deg);
        }

        100% {
            transform: translate(0, 0) rotate(360deg);
        }
    `}
`;

export const FadeWrapper = styled.div.attrs({ className: 'crypto-app-fade-wrapper' })`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;

    &.on {
        background-color: transparent;
    }

    &.fade {
        animation: ${keyFrameFadeIn} ease-in 1;
        animation-fill-mode: forwards;
        animation-duration:1s;
        // animation-delay: 1s;
    }
`;

export const CircleContainer = styled.div.attrs({ className: 'crypto-app-fade-circle-container' })`
    position: absolute;
    height: 74px;
    width: 74px;
    top: calc(21% - 7px);
    left: calc(50% - 37px);
`;

export const InformLoadingSpinner = styled.div`
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    width: 74px !important;
    height: 74px !important;
    border-radius: 50% !important;
    animation: ${keyFrameSpin} 1.8s linear ${props => props.isClaiming ? '' : '4s'} ${props => props.isClaiming ? '' : 'infinite'} !important;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
        content: '';
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 21px;
        height: 6px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(255,255,255,1);
        position: absolute;
    }
`;

export const ClaimLoadingSpinner = styled.div`
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%);
    top: 0px !important;
    width: 74px;
    height: 74px;
    border: 1.5px solid white;
    border-radius: 37px !important;
    color: white;
    transition: width 1s ease-out;
    background-color: black;

    &.claim {
        width: ${props => props.width}px;
    }

    .spinner {
        position: relative;
        display: inline-block;
        animation: ${props => keyFrameLoading(props.width)} 3s linear infinite !important;
        width: 74px;
        height: 74px;
        z-index: 6;

        &:after {
            position: absolute;
            top: -2px;
            left: 50%;
            content: '';
            width: 21px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 5px rgba(255, 255, 255, 1);
        }
    }

    .arrow {
        width: 95%;
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        transform: translateX(-50%);
    }

    .smile {
        width: 74px;
        height: 74px;
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
    }
`;

export const InputCircle = styled.div.attrs({ className: 'fade-input-circle' })`
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px ${props => props.borderColor ? props.borderColor : 'rgba(255, 255, 255, 0.5)'};

    img {
        width: 60%;
        height: auto;
    }
`;
