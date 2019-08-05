import React from 'react';
import styled, { keyframes } from 'styled-components';

export const Wrapper = styled.div.attrs({ className: 'crypto-app-wrapper' })`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 30px 50px 30px 50px;
    background: ${props => props.theme.palette.mobile2Bg};
    border-radius: ${props => props.theme.palette.borderRadius};
    overflow: ${props => props.overflowVisible ? 'visible' : 'hidden'};
    display: ${props => props.isVisible ? 'flex' : 'none'};
    transform: ${props => props.isCoinTransfer === true ? 'translate(0, -100%)' : 'translate(0, 0)'};

    &.informing, &.claiming, &.rejecting {
        transform: translate(0, -100%);
        transition: all 4s cubic-bezier(0.45, 0.3, 1, 0.48);
    }

    &.payee {
        transform: translate(0, 0) !important;
        transition: all 4s cubic-bezier(0.45, 0.3, 1, 0.48);
    }

    &.payee-back {
        transform: translate(0, 100%) !important;
        transition: all 4s cubic-bezier(0.45, 0.3, 1, 0.48);
    }
`;

export const BillWrapper = styled.div.attrs({ className: 'crypto-app-bill-wrapper' })`
    position: absolute;
    width: auto;
    height: 100%;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;

    @media(orientation: landscape) {
        top: 0;
        bottom: 0;
    }
`;

export const BackCurrencyContainer = styled.div.attrs({ className: 'crypto-app-back-currency-container', id: 'crypto-app-back-currency-container' })`
    position: relative;
    display: inline-block;
    height: 100%;
    width: auto;
`;

export const BackCurrency = styled.img.attrs({ className: 'crypto-app-back-currency' })`
    height: 100%;
    width: auto;
    display: ${props => props.isVisible ? 'block' : 'none'};
    border: 2px solid transparent;
    z-index: 1;
`;

export const BackCurrencyDataContainer = styled.div.attrs({ className: 'crypto-app-back-currency-data-container' })`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`;

export const LoadingWrapper = styled.div.attrs({ className: 'crypto-app-loading-wrapper' })`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: black;
    margin: 0;
    display: ${props => props.isVisible ? 'flex' : 'none'};
`;

export const LoadingBill = styled.img.attrs({ className: 'crypto-app-loading-bill', id: 'crypto-app-loading-bill' })`
    position: absolute;
    height: 100%;
    top: 0;
    bottom: 0;
    width: auto;
    margin: auto;
    z-index: 9999;
`;

export const FadeWrapper = styled.div.attrs({ className: 'crypto-app-fade-wrapper' })`
    @keyframes fadeIn { 
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    z-index: 10000;
    opacity: 0;
    animation: fadeIn ease-in 1;
    animation-fill-mode: forwards;
    animation-duration:1s;
    animation-delay: 1s;
`;

export const CurrencyHead = styled.div`
    height: 20%;
    width: 60%;
    border-radius: 63%;
    left: 13%;
    top: 40%;
    background: black;
    z-index: 101;
    opacity: 0;
    position: absolute;

    &.usd_1 {
        left: 13%;
    }
    &.usd_10 {
        left: 18%;
    }
    &.usd_100 {
        left: 15%;
    }
    &.usd_1000 {
        left: 22%;
    }
    &.usd_10000 {
        left: 12%;
    }
`;

export const Controller = styled.div.attrs({ className: 'private-container' })`
    position: absolute;
    left: calc(50% - 65px);
    bottom: 19%;
    z-index: 100;
    width: 110px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;

    .private-shadow {
        position: absolute;
        width: 95%;
        height: 91%;
        border-radius: 100%;
        top: 3%;
        left: 2.5%;
        z-index: -1;
        box-shadow: 0 0 12px 2.5px rgba(69, 105, 209, 1);
    }
`;

export const PrivateIcon = styled.img.attrs({ className: 'private-icon' })`
    width: 100%;
    z-index: 10;
`;
export const InnerWrapper = styled.div`
    position: relative;
    width: 30px;
    height: 30px;
    border: 2px solid ${props => props.theme.palette.clrBlue};
    border-radius: ${props => props.theme.palette.borderRadius};
    
    .inner-circle {
        position: absolute;
        left: -4px;
        top: -4px;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(${props => props.theme.palette.clrDarkGray}, ${props => props.theme.palette.clrBackground} 70%);
        border-radius: 50%;
        font-size: 24px;
        font-weight: 600;
        color: ${props => props.theme.palette.clrBlue};
    }
`;

export const QRWrapper = styled.div.attrs({ className: 'qr-outer-wrapper' })`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: ${props => props.currencyHeadIndex ? 109 : 100};
    display: ${props => props.isVisible ? 'flex' : 'none'};
`;

export const PayQRWrapper = styled.div.attrs({ className: 'qr-outer-wrapper' })`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 106;
`;

export const QRBalanceButton = styled.div`
    border: 1px solid rgb(50,102,209);
    border-radius: 50px;
    padding: 0.5rem 1rem 0.5rem 1rem;
    color: white;
    background: black;
    position:absolute;
    top:10px;
    z-index:1000;
    box-shadow: 0 0 20px 10px rgba(50,102,209,0.7);
    display: flex;
    width: 60%;
    align-items: center;
    justify-content: space-around;

    .prefix {
        color: white;
    }
    .amount {
        padding-left: 0.5rem;
        color: grey;
    }
`;

const CopySVG = styled.svg`
    position: absolute;
    right: 50px;
    top: 50px;
    z-index: 100;
    width: 30px;
    height: 30px;
    fill: none;
    stroke: ${props => props.theme.palette.clrBlue};
    transform: rotate(-90deg);
    cursor: pointer;
`;

export const CopyIcon = (props) => (
    <CopySVG {...props} viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </CopySVG>
);

export const ScanContainer = styled.div.attrs({ className: 'scan-container' })`
    position: absolute;
    z-index: 1000;
    left: calc(50% - 20px);
    width: 40px;
    bottom: 5px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .on {
        background-color: #fff8;
    }
    .off {
        background-color: #fff4;
    }
`;

export const ScanIcon = styled.div.attrs({ className: 'scan-icon' })`
    width: 10px;
    height: 10px;
    border-radius: 50%;
`;

export const LoadingScreen = styled.div.attrs({ className: 'loading-screen' })`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    padding-bottom: 30px;
    display: ${props => props.isVisible ? 'flex' : 'none'};
`;

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

export const LoadingSpinner = styled.div`
    position: relative;
    width: 74px !important;
    height: 74px !important;
    border-radius: 50% !important;
    border: 2px solid white !important;
    animation: ${keyFrameSpin} 1s linear infinite !important;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        position: absolute;
        top: -19px;
        width: 18px;
        height: 5px;
        border-radius: 105%;
        background-color: white;
        box-shadow: 0 0 5.67px #fff;
    }
    
    &:after {
        content: "";
        width: 99%;
        height: 99%;
        border-radius: 50%;
        position: absolute;
        background-color: black;
    }
`;
