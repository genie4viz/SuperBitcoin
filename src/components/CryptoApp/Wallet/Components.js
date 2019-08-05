import styled from 'styled-components';

export const WalletWrapper = styled.div.attrs({ className: 'crypto-app-wallet-wrapper' })`
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
    z-index: 9000;
    background: black;
    margin: 0;
    display: ${props => props.isVisible ? 'flex' : 'none'};
`;

export const WalletContainer = styled.div.attrs({ className: 'crypto-app-wallet-container' })`
    position: relative;
    display: inline-block;
    height: 100%;
    width: auto;

    .wallet-bg {
        height: 100%;
        width: auto;
        display: block; 
    }

    .wallet-data-container {
        position: absolute;
        width: ${props => props.width}px;
        height: 94%;
        top: 3%;
        left: 50%;
        transform: translateX(-50%);

        .wallet-data-header {
            text-align: center;
            color: black;
            font-size: 22px;
            margin-bottom: 5px;
        }

        .wallet-data-qr {
            width: ${props => props.width}px;
            height: ${props => props.width}px;
            svg, canvas {
                width: 100% !important;
                height: 100% !important;
            }
        }

        .wallet-data-address {
            text-align: center;
            color: #3269D1;
            font-size: 16px;
            margin-top: 5px;
            overflow-wrap: break-word;
        }
    }
`;

export const CopyNotification = styled.div.attrs({ className: 'crypto-app-wallet-copy-notification' })`
    position: absolute;
    width: 200px;
    height: 200px;
    top: 200px;
    background: white;
    border-radius: 5%;
    box-shadow: 0 0 5px #3269D1;
    text-align: center;

    img {
        margin: 20px;
    }

    div {
        color: black;
        font-size: 24px;
        padding: 20px;
    }
`;