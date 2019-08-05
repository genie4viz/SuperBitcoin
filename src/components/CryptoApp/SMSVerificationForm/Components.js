import styled, { keyframes } from 'styled-components';

const height = 80;

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

const keyFrameLoading = width => keyframes`
    0% {
        transform: translate(0, 0) rotate(0);
    }

    35% {
        transform: translate(${width - height + 2}px, 0) rotate(0deg);
    }

    50% {
        transform: translate(${width - height + 2}px, 0) rotate(180deg);
    }

    85% {
        transform: translate(0, 0) rotate(180deg);
    }

    100% {
        transform: translate(0, 0) rotate(360deg);
    }
`;

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

export const LoadingSpinner = styled.div`
    position: absolute !important;
    left: 0 !important;
    top: 0px !important;
    width: 100% !important;
    height: ${height}px !important;
    border-radius: 50% !important;
    color: white;

    .spinner {
        position: relative;
        display: inline-block;
        animation: ${props => keyFrameLoading(props.width)} 2s linear infinite !important;
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

export const CountrySelect = styled.div`
    position: absolute;
    width: 75.5%;
    max-height: ${props => props.colCount * 70 + 3}px;
    background-color: black;
    border: solid 1.69px white;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    top: calc(20.7% + 66px);
    left: 50%;
    transform: translateX(-50%);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    transition: top 2s;
`;

export const PrefCountry = styled.div`
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 10px;
    border-right: 1px solid gray;
    font-family: 'open-sans', sans-serif;
    font-weight: 500;

    span {
        cursor: pointer;
        display: block !important;
        position: relative;
        background-size: auto 100% !important;
        width: 40px !important;
        min-width: 40px;
        height: 40px !important;
        border-radius: 50%
    }

    h1 {
        font-size: 18px;
        margin-left: 0.5rem;
    }
`;

export const CountrySelectItem = styled.div`
    border-bottom: 0.5px solid #414042;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 1rem 0.7rem 1rem;
    background-color: ${props => props.isSearch ? 'rgb(50, 105, 209)' : ''};
    height: 50px;

    ${props => props.selected && `
        border-bottom: 1px solid ${props.theme.palette.clrBorder};
        background-color: rgb(50, 105, 209);
        width: 83%;
        margin: auto;
        border: 1.5px solid white;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        padding: 0.9rem 1rem 0.8rem 1rem;
        transform: translateY(-7px);
    `};

    h1 {
        font-size: 16px;
        font-family: 'Exo 2', sans-serif;
        font-weight: 600;
        margin-left: 1rem;
    }

    span {
        cursor: pointer;
        display: block !important;
        position: relative;
        font-size: 20px !important;
        background-size: auto 100% !important;
    }
`;

export const SubmitPhoneContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
`;

export const Directory = styled.div`
    background-color: gray;
    padding: 0.7rem 1rem 0.7rem 1rem;
`;

export const LetterScroll = styled.div`
    position: sticky;
    top: 50%;
    float: right;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
        font-size: 12px;
        line-height: 11px;
        width: 24px;
        padding: 0px;
        margin: 0;
        margin-right: 6px;
        color: rgb(64, 128, 255);
        text-align: center;
    }
`;

export const SubmitPhone = styled.div`
    position: absolute;
    width: 50px;
    height: 50px;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 15px;
    right: 15px;
    z-index: 2;
    background-color: black;
    border-radius: 50%;
    box-shadow: 0 0 5px #fff8;

    img {
        width: 50%;
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
    // background: ${props => props.gradient ? 'linear-gradient(00deg, transparent 0%, transparent 85%, #231F20 100%)' : 'transparent'};

    .icon__back {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }


    .input-bar-containers {
        position: relative;
        top: calc(22.7% + 15px);
        transform: translateY(-50%);
        margin: 0 auto;
        z-index: 110;
        width: 95%;
        transition: top 2s;

        &.shadow {
            width: 90%;
            border-radius: ${height / 2}px;
            top: calc(22.7% + 15px);
            height: ${height}px;

            .input-bar-container {
                max-width: inherit !important;
            }
        }

        &.error {
            width: 90%;
            border-radius: ${height / 2}px;
            top: calc(22.7% + 15px);
            box-shadow: 0 0 10px rgba(237, 28, 36, 1);

            .input-bar {
                top: 0 !important;
                box-shadow: none;
            }

            .input-bar-container {
                max-width: none !important;
            }
        }

        .main-icon {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.9rem 1.5rem 0.8rem 1.5rem;
            transform: translateY(-3px);
            background-color: rgb(50,105,209);
            border: 1.5px solid white;
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
            min-height: 75px;
            width: 83%;
            margin: auto;

            img {
                width: 38px;
                height: 38px;
            }

            span {
                font-size: 19px;
                font-family: 'Exo 2', sans-serif;
            }
        }

        .to-sms-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 8px;
            right: 8px;
            width: 58px;
            height: 58px;
            background-color: black;
            border-radius: 50%;
            box-shadow: 0 0 9.07px rgba(0,112,235,0.5);

            img {
                height: 60%;
            }
        }
    }

    .input-bar-container {
        display: block;
        max-width: calc(100% - 30px);
        margin: 0 auto;        
    }

    .input-bar {
        width: 100%;
        max-width: ${height}px;
        position: relative;
        box-shadow: 0 0 5.31px rgb(206, 206, 206);
        margin: 0 auto;
        transform: scale(1);
        background: black;
        border-radius: ${height / 2}px;
        z-index: 1;
        transition: max-width 250ms ease-in 500ms, transform 250ms ease-in, left 250ms ease-in;

        .qr-code-container {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            padding: 12px;

            > span {
                display: none;
            }

            .qr-code {
                height: 100%;
                padding: 4px;
                object-fit: cover;
                transform: translateY(0%) rotate(0deg);
                transition: transform 250ms ease-in;
                opacity: 1;
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

            &.flag {
                display: none;

                > span {
                    cursor: pointer;
                    display: block !important;
                    position: relative;
                    background-size: auto 100% !important;
                    width: 58px !important;
                    height: 58px !important;
                    border-radius: 50%
                }

                > img {
                    display: none;
                }
            }

            &.arrow {
                .qr-code {
                    padding: 10px;
                }
            }

            &.money {
                .qr-code {
                    padding: 0px;
                }
            }

            &.spinner {
                .qr-code {
                    padding: 4px;
                }
            }

            &.none {
                border: none;
                .qr-code {
                    opacity: 0;
                }
            }
        }

        .number-input {
            // font-family: 'AvantGardeLT-CondBook';
            font-family: 'open-sans', sans-serif;
            font-weight: 500;
            font-size: 18px;
            width: 80%;
            height: ${height}px;
            box-sizing: border-box;
            margin: auto;
            text-align: center;
            border: none;
            outline: none;
            background: transparent;
            color: #fff;
            z-index: 100;
            caret-color: white;

            &.sms-code {
                padding-left: 0 !important;
                padding-right: 0 !important;
                letter-spacing: 0.8rem;
                height: ${height}px;
                color: white !important;
                caret-color: white;
                // box-shadow: 0 0 0 1000px black inset;
                width: 80% !important;
                margin: auto;
                text-align: center;

                &.error {
                    color: red !important;
                }

                &.submitted {
                    color: white !important;
                    pointer-events: none !important;
                }

                &.submitting {
                    color: #999 !important;
                    -webkit-text-fill-color: #999 !important;    
                }
            }

            &.payment {
                &::placeholder {
                    font-size: 12px !important;
                    font-family: 'Exo 2', sans-serif;
                    font-weight: 300 !important;
                    text-align: center;
                    letter-spacing: initial !important;
                    color: grey;            
                }
            }

            &.submitting {
                caret-color: transparent !important;
                point-events: none;
                color: #999 !important;
                -webkit-text-fill-color: #999 !important;
            }

            &.submitted {
                color: #0070EB !important;
            }

            &::placeholder {
                font-size: 18px;
                font-family: 'Exo 2', sans-serif;
                font-weight: 600;
                text-align: center;
                letter-spacing: 0.5px;
                color: grey;
                text-shadow: none !important;
            }

            &:focus {
                outline: none;
            }

            &.phone {
                padding-left: 15px;
                margin-right: 30px;
                text-align: left !important;

                &::placeholder {
                    text-align: left !important;
                }
            }
        }

        &.qr-scanner {
            height: ${height}px;
            background: black;
            border: 1.51px solid white;
            border-radius: ${height / 2}px;
            box-shadow: 0 0 10px black;
            max-width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            &.claiming {
                box-shadow: 0 0 11.8px #00AE53;
            }

            &.claimed {
                box-shadow: 0 0 11.8px #00AE53;
                max-width: ${height}px;
                transition: transform 250ms ease-in 500ms, max-width 250ms ease-in, border-width 250ms ease-in 250ms;
            }

            &.rejected {
                box-shadow: 0 0 11.8px rgba(237,28,36,0.25);
                max-width: ${height}px;
                transition: transform 250ms ease-in 500ms, max-width 250ms ease-in, border-width 250ms ease-in 250ms;
            }

            &.error {
                border: 1.51px solid #ED1C24 !important;
                box-shadow: 0 0 10px #ED1C24;
            }

            .reject-section, .accept-section {
                padding-top: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                img {
                    width: 21px;
                    margin-bottom: 5px;
                }

                span {
                    font-size: 9.8px;
                    font-family: 'Exo 2', sans-serif;
                    color: #999;
                }
            }

            .reject-section {
                padding-left: 32px;
            }

            .accept-section {
                padding-right: 16px;
                min-width: 72px;
            }

            .scanned-balance {
                font-size: 41px;
                font-family: 'AvantGardeLT-CondDemi';
                // font-family: 'open-sans', sans-serif;
                font-weight: 700;
                font-style: normal;
                color: white;
                &.claiming {
                    color: #00AE53;
                }
            }

            .spinner {
                width: ${height}px;
                height: ${height}px;
                padding-right: 5px;

                > div {
                    background-color: #FFB400;
                    border-radius: 50%;
                }
            }
        }

        &.error {
            -webkit-animation-name:              ${keyFrameShake};
            -webkit-animation-duration:          0.8s;
            -webkit-animation-iteration-count:   1;
            -webkit-animation-timing-function:   linear;
            -webkit-transform-origin:            50% 100%;
            box-shadow: 0 0 11.8px #ED1C24;
        }

        &.error-form {
            display: flex;
            align-items: center;
            justify-content: center;
            height: ${height}px;
            border: 1.51px solid #ED1C24 !important;
            box-shadow: none !important;
        }

        &.load {
            max-width: calc(100%);
            transform: scale(1);
            border: 1.51px solid white;
            box-shadow: 0 0 10px black;
            background: black;

            .active {
                padding-bottom: ${height / 2}px;
            }

            .qr-code-container {
                top: 8px;
                right: 8px;
                bottom: 8px;
                height: 58px;
                width: 58px;
                padding: 0;
                background-color: black;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 9.32px rgba(255, 255, 255, 0.5);

                img {
                    width: 50%;
                    height: 50%;
                }

                .qr-code {
                    transform: translateY(0%) rotate(360deg);
                }

                &.arrow {
                    .qr-code {
                        &:active {
                            opacity: 0.7;
                        }
                    }
                }

                &.none {
                    border: none;
                    box-shadow: none;
                    display: none;
                }

                &.not-changed {
                    padding: 10px !important;
                }
            }

            .number-input {
                display: block;

                &::placeholder {
                    opacity: 1;
                }
            }
        }

        &.unload {
            max-width: calc(100%);
            transform: scale(1);
            border: 1.51px solid white;
            background: black;

            .active {
                color: #fff !important;
                pointer-events: none;
            }

            .number-input {
                padding-right: 17% !important;
                padding-left: 10% !important;
            }

            .qr-code-container {
                display: none !important;
                top: 8px;
                right: 8px;
                bottom: 8px;
                height: 58px;
                width: 58px;
                background-color: black;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                .qr-code {
                    transform: translateY(0%) rotate(360deg);
                }

                &.arrow {
                    .qr-code {
                        &:active {
                            opacity: 0.7;
                        }
                    }
                }

                &.none {
                    border: none;
                    box-shadow: none;
                    display: none;
                }
            }

            .number-input {
                display: block;

                &::placeholder {
                    opacity: 1;
                }
            }
        }
    }
`;

export const InputCircle = styled.div.attrs({ className: 'sms-input-circle' })`
    position: absolute;
    top: 7px;
    bottom: 7px;
    height: 60px;
    width: 60px;
    background-color: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px ${props => props.borderColor ? props.borderColor : 'rgba(255, 255, 255, 0.5)'};

    img {
        width: 70%;
        height: auto;
    }

    &.left {
        left: 7px;
    }
    &.right {
        right: 7px;
    }
    &.mid {
        left: auto;
        right: auto;
    }
    .balance {
        position: absolute;
        width: 28px;
        height: 18px;
        top: 26px;
        left: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #00AE53;

        &.long span {
            transform: scale(0.65, 1)
        }
    }
`;

export const CornerButton = styled.div`
    position: absolute;
    top: 1%;
    width: 12px;
    height: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.left {
        left: ${props => props.spaceWidth}px;
    }

    &.right {
        right: ${props => props.spaceWidth}px;
    }

    img {
        width: 100%;
        height: auto;
    }
`;

export const LockScreen = styled.div.attrs({ className: 'sms-lock-screen' })`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999999;
`;
