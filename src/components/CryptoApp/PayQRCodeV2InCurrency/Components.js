import React from 'react';
import styled, { keyframes } from 'styled-components';
import { darkTheme } from '../../../theme/core';

const { palette } = darkTheme;
const height = 80;
const pi = 3.141592;

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

const keyFrameLoading = width => ((width - height + 2) < 0 ? keyframes`
    0% {
        transform: translate(0, 0) rotate(0);
    }
    100% {
        transform: translate(0, 0) rotate(360deg);
    }
    ` : keyframes`
    0% {
        transform: translate(0, 0) rotate(0);
    }

    ${width * 100.0 / (width + height * pi / 2.0) / 2.0}% {
        transform: translate(${width - height + 2}px, 0) rotate(0deg);
    }

    50% {
        transform: translate(${width - height + 2}px, 0) rotate(180deg);
    }

    ${50 + width * 100.0 / (width + height * pi / 2.0) / 2.0}% {
        transform: translate(0, 0) rotate(180deg);
    }

    100% {
        transform: translate(0, 0) rotate(360deg);
    }
`);

const keyFrameShake = keyframes`
    0%  { -webkit-transform:     translate(8px, 0px) rotate(0deg); }
    10% { -webkit-transform:     translate(-4px, -0px) rotate(-0deg); }
    20% { -webkit-transform:     translate(-12px, 0px) rotate(0deg); }
    30% { -webkit-transform:     translate(0px, 0px) rotate(0deg); }
    40% { -webkit-transform:     translate(4px, -0px) rotate(0deg); }
    50% { -webkit-transform:     translate(-4px, 0px) rotate(-0deg); }
    60% { -webkit-transform:     translate(-12px, 0px) rotate(0deg); }
    70% { -webkit-transform:     translate(8px, 0px) rotate(-0deg); }
    80% { -webkit-transform:     translate(-4px, -0px) rotate(0deg); }
    90% { -webkit-transform:     translate(8px, 0px) rotate(0deg); }
    100%{ -webkit-transform:     translate(4px, -0px) rotate(-0deg); }
}`;

const keyFrameDrop = keyframes`
    from {
        top: 22%;
    }
    20% {
        top: 105%;
        animation-timing-function: ease-in;
    }
    80% {
        top: 105%;
        animation-timing-function: ease-in;
    }
    to {
        top: 22%;
        animation-timing-function: ease-out;
    }
}`;

export const CurrencyAmount = styled.div`
    display: flex;
    align-items: center;
`;

export const CurrencyText = styled.div`
    font-family: 'Exo 2', sans-serif;
    display: flex;
    align-items: center;

    ${props => props.isHidden && `
        display: none;
    `};

    img {
        width: 38px;
        margin-right: 1rem;
        border-radius: 50%;
    }
`;

export const PayText = styled.div.attrs({ className: 'pay-text' })`
    position: absolute;
    background-color: black;
    color: #FDB913;
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 500;
    font-size: 21px;
    box-shadow: 0 0 9.07px rgba(50,105,209,0.5);

    img {
        height: 65%;
        width: auto;
        padding-left: 3px;
    }
`;

export const InputBar = styled.div`
    ${props => props.maxWidth ? `
        width: ${props.maxWidth}px !important;
        transition: none !important;
    ` : ''};
`;

export const NoFlag = styled.div`
    width: ${props => props.size === 'big' ? '50px' : '32px'};
    min-width: ${props => props.size === 'big' ? '50px' : '32px'};
    height: ${props => props.size === 'big' ? '50px' : '32px'};
    background-color: #01B067;
    border-radius: ${props => props.size === 'big' ? '25px' : '16px'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.size === 'big' ? `${20 - props.length}px` : `${12 - props.length}px`};
    z-index: 2;
    border-radius: 50%;
    margin-right: ${props => props.size === 'big' ? '0.5rem' : '0px'};
    overflow: hidden;
`;

export const CircleText = styled.span.attrs({ className: 'circle-text' })`
    @mixin rotated-text($num-letters: 80, $angle-span: 360deg) {
        $angle: $angle-span / $num-letters;
        @for $i from 1 through $num-letters {
            .char-#{$i} {
                transform: rotate($angle * $i);
            }
        }
    }
    height: 48%;
    top: 5.5%;
    left: 49.5%;
    position: absolute;
    z-index: 10;

    [class*="char"] {
        bottom: 0;
        height: 93%;
        left: 0;
        margin: auto;
        min-width: 1px;
        position: absolute;
        right: 0;
        text-align: center;
        transform-origin: center bottom;
        width: auto;
        display: flex;
        justify-content: center;
    }
    @include rotated-text();
    display: block;

    span {
        font-size: 7px;
        font-weight: 600;
        display: block;
        color: black;
    }

    opacity: 1;
`;

export const Promotion = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 75%;
    margin: auto;
    height: 100px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 2px solid grey;
    font-size: 24px;
    font-weight: 600;
    color: white;
    border: 1.7px solid white;
    border-radius: 10px;

    -webkit-animation-name:              ${keyFrameDrop};
    -webkit-animation-duration:          6s;
    -webkit-animation-iteration-count:   infinite;
    -webkit-animation-timing-function:   linear;
    -webkit-transform-origin:            50% 100%;
    animation-iteration-count:           1;

    ${props => props.isActive ? `
        border-bottom: 1px solid ${props.theme.palette.clrBorder};
    ` : ''};

    .prefix{
        display: inline-flex;
    }

    .circleText{
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background-color: #4080FF;
        color: white;
        text-align: center;
        margin-right: 10px;
        display: flex;

        &.transparent {
            background-color: transparent;
            img {
                position: absolute;
                width: 40px;
                height: 40px;
            }
            canvas {
                margin: auto;
            }
        }
    }

    .circleContent{
        margin: auto;
    }

    .containerText{
        justify-content: center;
        display: flex;
        flex-direction: column;

        .five {
            &:first-letter {
                font-size: 32px;
            }
        }
    }

    .titleText{
        color: white;
        font-size: 16px;
    }

    .descText{
        color: grey;
        font-size: 12px;
        font-weight: 400;
        text-align: right;
    }

    .grey {
        color: grey !important;
    }
`;

export const LoadingSpinner = styled.div`
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%);
    top: 15px !important;
    width: ${props => props.width}px !important;
    height: ${height}px !important;
    border-radius: 50% !important;
    color: white;
    z-index: 111;

    .spinner {
        position: relative;
        display: inline-block;
        animation: ${props => keyFrameLoading(props.width - 3)} 2s linear infinite !important;
        width: ${height}px;
        height: ${height + 3}px;
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
`;

export const SMLoadingSpinner = styled.div`
    position: absolute !important;
    right: 8px !important;
    top: 8px !important;
    width: 58px !important;
    height: 58px !important;
    border-radius: 50% !important;
    animation: ${keyFrameSpin} 1s linear infinite !important;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 9.32px rgba(255, 255, 255, 0.5) !important;

    &.left {
        left: 8px !important;
        right: auto;
    }

    p {
        position: absolute;
        top: -19px;
        width: 13px;
        height: 8px;
        border-radius: 105%;
        background-color: white;
        box-shadow: 0 0 5.67px #fff;
    }

    img {
        width: 99% !important;
        height: 99% !important;
    }

    &:after {
        content: "";
        width: 99%;
        height: 99%;
        border-radius: 50%;
        position: absolute;
        background-color: transparent;
    }
`;

export const Main = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 109;
    // background: ${props => props.formLoaded ? 'linear-gradient(00deg, transparent 0%, transparent 85%, #231F20 100%)' : 'transparent'};
    
    .input-bar-containers {
        position: relative;
        top: 22.7%;
        transform: translateY(-50%);
        margin: 0 auto;
        transition: top 2s;
        
        &.shadow {
            max-width: calc(100% - 10px);
            border-radius: ${height / 2}px;
        }

        &.history_detail {
            display: none;
        }
    }
    
    .input-bar-container {
        display: block;
        max-width: calc(100% - 30px);
        z-index: 1;
        margin: 0 auto;
        
        &:first-child {
            .input-bar {
                border-radius: ${height / 2}px;
            }
        }
        &:last-child {
            .input-bar {
            border-bottom-left-radius: ${height / 2}px;
            border-bottom-right-radius: ${height / 2}px;
            }
        }
        &:nth-child(2) {
            opacity: 0;
            .input-bar {
            border-top: none;
            }
        }
    }
    
    .input-bar {
        width: 100%;
        max-width: ${height}px;
        position: relative;
        z-index: 110;
        margin: 0 auto;
        transform: scale(1.2);
        background: transparent;
        transition: max-width 250ms ease-in 500ms, transform 250ms ease-in;

        > prefix-number {
            display: none;
        }

        .input-circle {
            display: none;
        }

        .number-input-wrapper {
            display: none !important;
        }

    .qr-code-container {
        position: absolute;
        top: 13px;
        left: 9px;
        bottom: 0;
        height: 72px;
        width: 72px;
        padding: 12px;
        border-radius: 50%;
        transition: transform 0.5s ease-in-out;
        z-index: 200;

        svg, canvas {
            width: 100% !important;
            height: 100% !important;
            display: flex;
            opacity: 1;
            z-index: 7;
        }

        .pay-text {
            display: none;
        }

        .qr-pay {
            display: none;
        }

        .gold-certificate {
            display: none;
            z-index: 6;
        }
    
        .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    
        .animate {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    
        &.arrow, &.spinner, &.none {
            .animate {
                display: none;
            }
        }
    
        &.arrow {
            padding: 14px;
        }
    
        &.spinner {
            .qr-code {
                height: 30px;
                margin: 11px;
                border: none;
            }
        }
    
        &.none {
        border: none;
        .qr-code {
            opacity: 0;
        }
        }

        &.balance {
            border: none;
            opacity: 0;
        }
    }
    
    .number-input {
        width: 100%;
        height: ${height}px;
        box-sizing: border-box;
        border: none;
        outline: none;
        font-size: 40px;
        background-color: transparent;
        color: transparent;
        // font-family: 'open-sans', sans-serif;
        font-family: 'AvantGarde LT CondBook';
        font-weight: 800;
        text-align: center;
        opacity: 0;
        padding-bottom: 5px;
        caret-color: transparent !important;
    
        &::placeholder {
            font-size: 20px;
            opacity: 0;
            color: #999999;
            transition: opacity 250ms 500ms ease-out;
        }

        &:first-letter {
            font-size: 16px;
            color: rgb(50, 115, 209) !important;
        }
    }

    .number-prefix {
        display: none;
        position: absolute;
        left: 6%;
        color: white;
        top: 29%;

        &__pay {
            font-size: 22.64px;
            font-family: 'Exo 2', sans-serif;
            font-weight: 600;
            color: #999;
        }

        &__symbol {
            font-size: 20px;
            font-family: 'Exo 2', sans-serif;
            color: white;
        }
    }

    .balance-prefix {
        display: none;
        position: absolute;
        color: #999;
        left: 30px;
        top: 21px;

        p {
            font-size: 12px;
            margin: 0;
            text-align: left;
        }

        span {
            font-size: 12px;
            text-align: left;
        }
    }

        &.error {
            -webkit-animation-name:              ${keyFrameShake};
            -webkit-animation-duration:          0.4s;
            -webkit-animation-iteration-count:   infinite;
            -webkit-animation-timing-function:   linear;
            -webkit-transform-origin:            50% 100%;
            box-shadow: 0 0 11.8px #ED1C24 !important;
            border: 1.5px solid #ED1C24 !important;

            .number-input-hide {
                color: #ED1C24 !important;
            }

            .number-input-currency {
                color: #ED1C24 !important;
            }

            &::after {
                color: #ED1C24 !important;
            }

            .qr-code-container {
                .pay-text {
                    color: rgba(237, 28, 36) !important;
                    box-shadow: 0 0 9.07px rgba(237, 28, 36, 0.5) !important;
                }
            }

            .input-circle {
                box-shadow: 0 0 9.07px rgba(237, 28, 36, 0.5) !important;

                .balance {
                    color: rgba(237, 28, 36) !important;
                }
            }
        }

        &.load {
            min-width: 80px;
            max-width: calc(100% - 10px);
            transform: scale(1) !important;
            border: 1.51px solid white;
            background: black;
            overflow: hidden;
            box-shadow: 0 0 10px rgb(0, 0, 0);
            top: 15px;

            .input-circle {
                display: flex !important;
            }

            .number-input-wrapper {
                display: flex !important;
            }

            .number-prefix {
                display: flex !important;
                align-items: flex-end;
                justify-content: space-between;
            }

            .certificate {
                display: none !important;
            }

            .gold-certificate {
                display: block !important;
                transform: rotate(-90deg);
            }

            .balance-prefix {
                display: flex !important;
                align-items: center;
                flex-direction: column;
                justify-content: space-between;
            }
        
            .qr-code-container {
                top: 0px !important;
                left: auto !important;
                right: 0px !important;
                bottom: 8px !important;
                height: 100% !important;
                border-radius: ${height / 2}px;
                padding: ${height / 2}px;
                align-items: center;
                display: flex;
                justify-content: center;
                transform: translateY(0%) rotate(360deg);
                background-color: black;

                svg, canvas {
                    width: 36px !important;
                    height: 36px !important;
                    opacity: 1;
                }

                .pay-text {
                    display: flex !important;
                }

                .circle-text {
                    display: none !important;
                }

                .qr-pay {
                    font-family: 'Exo 2', sans-serif;
                    font-weight: 600;
                    display: block !important;
                }
        
                .qr-code {
                    position: absolute;
                    width: 20px !important;
                    height: 20px !important;
                    display: flex;
                    justify-content: center;
                    z-index: 7;
                }
        
                &.none {
                    border: none;
                    box-shadow: none;
                }

                &.changed {

                    .qr-pay {
                        // font-family: 'AvantGardeLT-Bold' !important;
                        font-family: 'open-sans', sans-serif;
                        font-weight: 800;
                        font-style: normal;
                        text-shadow: 0 0 2px rgba(0,0,0,0.196);
                        color: white !important;
                    }
                }
            }
            .number-input {
                display: block;
                caret-color: transparent !important;
                opacity: 1 !important;

                &::placeholder {
                    opacity: 1;
                }
            }

            &::after {
                opacity: 1 !important;
            }
        }
    
        &.unload {
            max-width: ${height}px;
            transform: scale(1);
            border: 1.51px solid white;
            box-shadow: 0 0 10px rgb(0, 0, 0);
            transition: transform 250ms ease-in 500ms, max-width 250ms ease-in, border-width 250ms ease-in 250ms;
            overflow: hidden;

            > .number-prefix {
                display: none !important;
            }

            > .balance-prefix {
                display: none !important;
            }

            // .number-input-wrapper {
            //     display: none !important;
            // }

            &.load {
                transform: scale(1) !important;

                .qr-code-container {
                    right: 0 !important;
                    top: 0 !important;
                }
            }
        
            .qr-code-container {
                position: absolute !important;
                top: 12% !important;
                right: 11% !important;
                left: auto !important;
                bottom: 0 !important;
                height: 25px !important;
                border-radius: 50% !important;
                border: none !important;
                transform: translateY(0%) rotate(0deg);
                transition: transform 250ms ease-in 500ms;
        
                .qr-code {
                    transform: translateY(0%) rotate(0deg);
                    transition: transform 250ms ease-in 500ms;
                }
            }

            .number-input {
                caret-color: transparent !important;
            }
        }
    }
`;

export const Wrapper = styled.div.attrs({ className: 'qr-code-view-wrapper' })`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    margin: 0;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
`;

export const InputCircle = styled.div.attrs({ className: 'input-circle' })`
    padding: ${props => props.isBalance ? 11 : 14}px;
    position: absolute;
    top: 8px;
    left: 8px;
    bottom: 8px;
    height: 58px;
    width: 58px;
    background-color: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px ${props => props.borderColor ? props.borderColor : '#fff4'};

    img {
        width: 100%;
    }

    .balance {
        position: absolute;
        width: 22px;
        height: 18px;
        top: 22px;
        left: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        color: white;

        &.long span {
            transform: scale(0.65, 1)
        }
    }
`;

export const QRCodeWrapper = styled.div.attrs({ className: 'qr-code-wrapper' })`
    top: 26.5%;
    position: absolute;
    width: 56% !important;
    height: 54% !important;
    display: flex;
    opacity: 1;
    z-index: 7;
    border-radius: 13px;
    // overflow: hidden;
    // background-color: rgb(255,180,0);

    svg, canvas {
        width: 100% !important;
        height: 100% !important;
    }
`;


export const CertificateContainer = styled.div.attrs({ className: 'certificate' })`
    position: absolute;
    top: -15px;
    left: -15px;
    bottom: 0;
    height: 104px;
    width: 104px;
    display: flex;
    justify-content: center;
    transform: scale(1);
    transition: transform 2s ease-in;

    img {
        height: 126%;
        width: 83%;
        position: absolute;
        top: -8%;
    }

    &.zoom {
        -webkit-backface-visibility: hidden;
        transform: scale(2.2) translateZ(0);
        transition: transform 2s ease-in;

        .circle-text {
            display: none !important;
        }

        img {
            opacity: 0.5 !important;
        }
    }

    &.history_detail {
        -webkit-backface-visibility: hidden;
        transform: scale(2.2) translateZ(0);

        .circle-text {
            display: none !important;
        }

        img {
            opacity: 0.5 !important;
        }
    }

    &.usd_1 {
        top: ${props => -9 - (props.billHeight - 581.0) * 0.08074}px !important;
        left: ${props => 37 - props.billHeight * 0.1755593 / 2}px !important;
        // left: ${props => -5 - (props.billHeight / 581.0 * 254.0 - 254.0) * 0.15574}px !important;
        height: ${props => props.billHeight * 0.1807289}px !important;
        width: ${props => props.billHeight * 0.1755593}px !important;
    }

    &.usd_10 {
        top: ${props => -14 - (props.billHeight - 581.0) * 0.09074}px !important;
        // left: ${props => -22 - (props.billHeight / 581 * 254 - 254.0) * 0.24074}px !important;
        left: ${props => 37 - props.billHeight * 0.1755593 / 2}px !important;
        bottom: 0 !important;
        height: ${props => props.billHeight * 0.1807289}px !important;
        width: ${props => props.billHeight * 0.1755593}px !important;
    }

    &.usd_100 {
        top: ${props => -19 - (props.billHeight - 581.0) * 0.10374}px !important;
        // left: ${props => -18 - (props.billHeight / 581 * 254 - 254.0) * 0.20574}px !important;
        left: ${props => 37 - props.billHeight * 0.1755593 / 2}px !important;
        bottom: 0 !important;
        height: ${props => props.billHeight * 0.1807289}px !important;
        width: ${props => props.billHeight * 0.1755593}px !important;
    }

    &.usd_1000 {
        top: ${props => -20 - (props.billHeight - 581.0) * 0.10074}px !important;
        // left: ${props => -10 - (props.billHeight / 581 * 254 - 254.0) * 0.20574}px !important;
        left: ${props => 37 - props.billHeight * 0.1755593 / 2}px !important;
        bottom: 0 !important;
        height: ${props => props.billHeight * 0.1807289}px !important;
        width: ${props => props.billHeight * 0.1755593}px !important;
    }

    &.usd_10000 {
        top: ${props => -5 - (props.billHeight - 581.0) * 0.07474}px !important;
        // left: ${props => -19 - (props.billHeight / 581 * 254 - 254.0) * 0.22574}px !important;
        left: ${props => 37 - props.billHeight * 0.1755593 / 2}px !important;
        bottom: 0 !important;
        height: ${props => props.billHeight * 0.1807289}px !important;
        width: ${props => props.billHeight * 0.1755593}px !important;
    }

    &.usd_100000 {
        top: ${props => -5 - (props.billHeight - 581.0) * 0.07474}px !important;
        // left: ${props => -19 - (props.billHeight / 581 * 254 - 254.0) * 0.22574}px !important;
        left: ${props => 37 - props.billHeight * 0.1755593 / 2}px !important;
        bottom: 0 !important;
        height: ${props => props.billHeight * 0.1807289}px !important;
        width: ${props => props.billHeight * 0.1755593}px !important;
    }

    &.zoomIn {
        transform: scale(1) translateZ(0);
        .qr-code-wrapper {
            width: 102% !important;
            height: 100% !important;
            top: 11% !important;
            padding: 8px !important;
        }
    }
`;

export const InnerCenterWrapper = styled.div.attrs({ className: 'center-wrapper' })`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    padding: 0;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: ${props => props.height ? `${props.height}px` : '100%'};
`;

export const QRCodePartial = styled.div.attrs({ className: 'center-wrapper__qr-code-partial' })`
    flex-shrink: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-radius: 50%;
    padding: 0;
    width: ${props => props.width ? `${props.width}px` : '0px'};
    height: ${props => props.height ? `${props.height}px` : '0px'};
    overflow: visible;
    transform: rotateZ(0deg);
    z-index: 2;

    @keyframes qr-code-hide-animation-2 {
        0% {
            width: ${props => props.width ? `${props.width}px` : '0px'};
            height: ${props => props.height ? `${props.height}px` : '0px'};
            transform: rotateZ(0deg);
            opacity: 1;
        }
        
        90% {
            width: 50px;
            height: 50px;
            margin: 0;
            opacity: 1;
        }
        
        100% {
            width: 50px;
            height: 50px;
            transform: rotateZ(360deg);
            opacity: 0;
        }
    }

    @keyframes show-again-animation-2 {
        0% {
            width: 50px;
            height: 50px;
            transform: rotateZ(360deg);
            opacity: 0;
        }
        
        10% {
            width: 50px;
            height: 50px;
            opacity: 1;
        }

        100% {
            width: ${props => props.width ? `${props.width}px` : '0px'};
            height: ${props => props.height ? `${props.height}px` : '0px'};
            transform: rotateZ(0deg);
            opacity: 1;
        }

    }

    &.hide {
        animation-name: qr-code-hide-animation-2;
        animation-duration: .5s;
        animation-fill-mode: both;
        pointer-events: none;
    }
    
    &.show-again {
        animation-name: show-again-animation-2;
        animation-duration: .5s;
        animation-delay: .5s;
        animation-fill-mode: both;
    }

    &.size-1 {
        margin-top: ${props => props.height ? `${props.height * .05}px` : '0px'};
        margin-left: ${props => props.height ? `${-props.height * .055}px` : '0px'};
    }

    &.size-10 {
        margin: 0;
    }

    &.size-100 {
        margin-top: ${props => props.height ? `${-props.height * .3}px` : '0px'};
    }
`;

export const PayAmountPartial = styled.div`
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: 2px solid ${palette.mobile2PhoneInputBorder};
    border-radius: 35px;
    padding: 0 9px;
    width: 64px;
    height: 64px;
    background: ${palette.mobile2PhoneInputBg};
    box-shadow: 0 0 20px 10px ${palette.mobile2CircleGlowColor}d0;
    overflow: hidden;
    z-index: 10;
    
    @keyframes enter-pay-amount-wrapper-animation-2 {
        0% {
            padding: 0 9px;
            width: 64px;
            height: 64px;
        }
        
        100% {
            padding: 0 9px 0 20px;
            width: 100%;
            height: 64px;
        }
    }

    @keyframes view-qr-again-wrapper-animation-2 {   
        0% {
            padding: 0 9px 0 20px;
            width: 100%;
            height: 64px;
        }

        100% {
            padding: 0 9px;
            width: 64px;
            height: 64px;
        }
    }

    @keyframes verify-success-wrapper-animation-2 {
        0% {
            width: 100%;
            height: 126px;
            opacity: 1;
        }
        
        100% {
            opacity: 0;
            padding: 0 9px;
            width: 100%;
            height: 64px;
        }
    }

    &.view-qr {
        display: none;
        opacity: 0;
    }

    &.enter-pay-amount {
        animation-name: enter-pay-amount-wrapper-animation-2;
        animation-duration: .5s;
        animation-delay: .5s;
        animation-fill-mode: both;
    }
    
    &.view-qr-again {
        animation-name: view-qr-again-wrapper-animation-2;
        animation-duration: .5s;
        animation-fill-mode: both;
    }
    
    &.verify-success {
        animation-name: verify-success-wrapper-animation-2;
        animation-duration: .5s;
        animation-fill-mode: both;
        pointer-events: none;
    }
`;

export const InputWrapper = styled.div`
    flex-shrink: 1;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    overflow: visible;
`;

export const Input = styled.input`
    flex-shrink: 1;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    border: none;
    padding: 0 !important;
    width: 100%;
    min-width: 0;
    height: 50px;
    background: transparent;
    font-size: 20px;
    line-height: 1em;
    font-weight: normal;
    font-family: 'Exo 2', sans-serif;
    color: ${palette.clrHighContrast};
    outline: none !important;
    transition: .5s;

    &::placeholder {
        color: ${palette.clrLightGray};
    }
`;

export const InputAddon = styled.div`
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: 2px solid ${palette.mobile2PhoneInputBorder};
    border-radius: 30px;
    width: 40px;
    height: 40px;
    background: ${palette.mobile2PhoneInputBg};
    box-shadow: 0 0 20px 10px ${palette.mobile2CircleGlowColor}70;
`;

const QRIconSvg = styled.svg`
    width: 18px;
    height: 18px;

    & * {
        fill: ${palette.mobile2PhoneInputBorder};
    }
`;

export const QRIcon = props => (
    <QRIconSvg {...props} viewBox="0 0 16.27 16.27">
        <path className="cls-1" d="M0,16.27H7.4V8.88H0Zm1.48-5.92H5.92v4.43H1.48Z" />
        <rect className="cls-1" x="2.96" y="11.83" width="1.48" height="1.48" />
        <rect className="cls-1" x="11.83" y="14.79" width="1.48" height="1.48" />
        <rect className="cls-1" x="14.79" y="14.79" width="1.48" height="1.48" />
        <path className="cls-1" d="M14.79,10.35H13.31V8.88H8.88v7.39h1.47V11.83h1.48v1.48h4.44V8.88H14.79Z" />
        <path className="cls-1" d="M0,7.4H7.4V0H0ZM1.48,1.48H5.92V5.92H1.48Z" />
        <rect className="cls-1" x="2.96" y="2.96" width="1.48" height="1.48" />
        <path className="cls-1" d="M8.88,0V7.4h7.39V0Zm5.91,5.92H10.35V1.48h4.44Z" />
        <rect className="cls-1" x="11.83" y="2.96" width="1.48" height="1.48" />
    </QRIconSvg>
);


const SendIconSvg = styled.svg`
    width: 18px;
    height: 18px;

    & * {
        fill: ${palette.mobile2PhoneInputBorder};
    }
`;

export const SendIcon = props => (
    <SendIconSvg {...props} viewBox="0 0 16.18 13.02">
        <polygon className="cls-1" points="16.18 6.51 9.68 0 9.68 3.22 0 3.22 0 9.08 9.68 9.08 9.68 13.02 16.18 6.51" />
    </SendIconSvg>
);

const rotateOpenAnim = keyframes`
    0% { transform: scale(0) rotate(0deg); }
    100% { transform: scale(1) rotate(1080deg); }
`;

const rotateCloseAnim = keyframes`
    0% { transform: scale(1) rotate(1080deg); }
    100% { transform: scale(0) rotate(0deg); }
`;

export const PortalWrapper = styled.div`
    position: absolute;
    width: 26px;
    height: 26px;
    top: 27%;
    left: 34%;
`;

export const PortalInnerWrapper = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 6px 1.5px rgba(69, 105, 209, 1);
    animation: ${rotateOpenAnim} 1s linear;
    transform-origin: center;
    
    &.close {
        animation: ${rotateCloseAnim} 1s linear;
    }

    > img {
        width: 100%;
        height: 100%;
    }
`;

export const WithdrawInfo = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    img {
        width: 50%;
    }
    
    span {
        font-size: 16px;
        font-weight: 600;
    }
`;

export const ImgBills = styled.img`
    cursor: pointer;
`;

export const CountrySelect = styled.div.attrs({ className: 'country-select-container', id: 'country-select-container' })`
    position: absolute;
    width: 75%;
    max-height: 356px;
    background-color: black;
    border: solid 1.69px white;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    top: calc(20.7% + 64px);
    left: 50%;
    transform: translateX(-50%);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    // padding-top: 5px;
    transition: top 2s;

    ${props => props.isFocused && `
        top: calc(3% + 64px);
    `};
`;

export const CountrySearch = styled.div`
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    height: 70px;
    margin-top: 5px;

    ${props => props.isSMS && `
        background-color: #3269d1;
        border-bottom: 2px solid white;
        padding: 0.8rem 1rem 0.8rem 1rem;
    `};

    input {
        outline: none;
        width: 100%;
        height: ${props => props.isSMS ? '50px' : '80px'};
        margin-left: 1rem;
        color: white;
        border: none;
        font-size: ${props => props.isSMS ? '20px' : '24px'};
        font-family: 'Exo 2', sans-serif;
        font-weight: 400;
        caret-color: white;
        background: transparent;

        &::placeholder {
            font-size: 16px;
            color: gray;
        }
    }

    img {
        width: ${props => props.isSMS ? '32px' : '50px'};
        height: auto;

        &.close {
            // margin-right: 26px;
            width: 25px !important;
        }
    }
`;

export const CountrySelectItem = styled.div`
    border-bottom: 0.5px solid white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 10px 16px;
    height: 70px;
    ${props => props.sticky ? `
        position: sticky;
        top: 0;
    ` : ``};

    // &:hover {
    //     background-color: rgb(50, 105, 209);
    // }

    &.selected {
        background-color: rgb(50, 105, 209);
    }

    h1 {
        font-family: 'Exo 2', sans-serif;
        font-weight: 400;
        margin: 0 0 0 10px;
    }

    .flag {
        height: 32px;
        width: auto;
        max-width: 32px;
        z-index: 5;
        border-radius: 50%;
    }

    .currency-item-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .currency-item-currency-container {
            min-width: 35%;

            .currency-code {
                font-size: 36px;

                &.large {
                    font-size: 36px;
                }

                &.small {
                    font-size: 20px;
                }
            }
            .currency {
                font-size: 10px;
                color: grey;
            }
        }
        .currency-item-price-container {
            display: flex;
            align-items: center;

            .currency-price {
                font-size: 16px;
                // margin-right: 5px;
                text-align: right;
                white-space: nowrap;

                &.grey {
                    color: grey;
                }
            }

            &.currency {
                text-align: left;
                font-size: 12px;
                width: 100%;
            }
        }
    }

    &:first-child {
        margin-top: 5px;
    }
`;

export const NumberInputWrapper = styled.div.attrs({ className: 'number-input-wrapper' })`
    position: absolute;
    width: 100%;
    height: ${height}px;
    top: 0;
    left: 0;
    padding-top: 1px;
    display: flex;
    align-items: center;
    justify-content: ${props => props.isInitShowing ? 'center' : 'space-between'};
    font-size: ${props => props.fontSize}px;
    padding-left: 20px;
    padding-right: 20px;

    .number-input-currency {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0px 2px 0 2px;
        font-family: 'AvantGarde LT CondBook';
        // font-family: 'open-sans', sans-serif;
        font-weight: 100;
    
        img {
            height: 20px;
            width: auto;
        }
    }

    .number-input-hide {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'AvantGarde LT CondBook';
        // font-family: 'open-sans', sans-serif;
        font-weight: 800;
    }

    .hide {
        opacity: 0;
    }
`;

export const LockScreen = styled.div.attrs({ className: 'payqr-lock-screen' })`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999999;
`;

export const ExchDropdownSearchIconSvg = styled.svg`
    width: 36px;
    height: 36px;
    fill: #fff;
    // margin-left: 24px;

    ${props => props.isSMS === true && `
        margin: 0 !important;
    `};
`;
export const ExchDropdownSearchIcon = (isSMS) => (
    <ExchDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px" isSMS={isSMS}>
        <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
        <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
    </ExchDropdownSearchIconSvg>
);
