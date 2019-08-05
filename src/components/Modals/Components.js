import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.section`
    position: relative;
    width: 550px;
    height: 390px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.palette.depositBackground};
    border: 1px solid ${props => props.theme.palette.clrBorderHover};
    border-radius: ${props => props.submitted ? `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0` : props.theme.palette.borderRadius};
    box-shadow: 0 3px 15px rgba(0, 0, 0, .5);
    color: ${props => props.theme.palette.depositText};
    
    .confirm-button {
        &:disabled {
            filter: drop-shadow(0px 0px 1px ${props => props.theme.palette.clrBorderHover}) !important;
        }
    }
        
    .btn-text {
        font-size: 24px;
        font-weight: bold;
        text-transform: uppercase;
    }
`;

export const InnerWrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
`;

export const Label = styled.div`
    width: 100%;
    min-height: 41px;
    margin: 0;
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.palette.clrBackground};
    border-bottom: 1px solid ${props => props.theme.palette.clrBorderHover};
    border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    
    .terms {
        font-weight: normal;
        color: ${props => props.theme.palette.clrBlue};
        text-decoration: underline;
        cursor: pointer;
    }
`;

const Svg = styled.svg`
    width: 32px;
    height: 32px;
`;

export const CopyIcon = (props) => (
    <Svg {...props} viewBox="0 0 25.93 30.03">
        <path d="M19.1,0H2.73A2.74,2.74,0,0,0,0,2.73V21.84H2.73V2.73H19.1Zm4.1,5.46h-15A2.74,2.74,0,0,0,5.46,8.19v19.1A2.75,2.75,0,0,0,8.19,30h15a2.75,2.75,0,0,0,2.73-2.74V8.19A2.74,2.74,0,0,0,23.2,5.46Zm0,21.83h-15V8.19h15Z" />
    </Svg>
);

export const PrintIcon = (props) => (
    <Svg {...props} viewBox="0 0 38.35 34.51">
        <path d="M32.6,9.59H5.75A5.64,5.64,0,0,0,0,15.33V26.84H7.67v7.67h23V26.84h7.67V15.33A5.64,5.64,0,0,0,32.6,9.59ZM26.84,30.68H11.51V21.09H26.84ZM32.6,17.25a1.81,1.81,0,0,1-1.92-1.92,1.92,1.92,0,0,1,3.83,0,1.81,1.81,0,0,1-1.91,1.92ZM30.68,0h-23V7.67h23Z" />
    </Svg>
);

export const CreditIcon = (props) => (
    <Svg {...props} viewBox="0 0 33.9 35.65">
        <path d="M33,16.71,17.2.93a3.19,3.19,0,0,0-4.5,0L4.06,9.57a3.24,3.24,0,0,0,0,4.54l1.43,1.47H8.8L5.71,12.46a.93.93,0,0,1-.25-.62.91.91,0,0,1,.25-.61l1.14-1.11,5.42,5.46h5.21l-8-8.06,4.9-4.92a.88.88,0,0,1,.6-.25.86.86,0,0,1,.6.24L31.33,18.36a.86.86,0,0,1,.24.6.88.88,0,0,1-.27.6l-.89.87v3.31L33,21.21a3.19,3.19,0,0,0,0-4.5Z" />
        <path d="M25.57,17.06H3.26A3.24,3.24,0,0,0,0,20.23v8.45H28.72V20.23a3.15,3.15,0,0,0-3.15-3.17ZM7.8,25.8a2.33,2.33,0,0,1-1.61-.64,2.31,2.31,0,0,1-3.91-1.67,2.31,2.31,0,0,1,3.91-1.67,2.34,2.34,0,0,1,1.61-.65,2.32,2.32,0,0,1,0,4.63Z" />
        <path d="M0,32.45a3.26,3.26,0,0,0,3.26,3.2H25.57a3.17,3.17,0,0,0,3.15-3.2v-.18H0Z" />
    </Svg>
);

export const HistoryIcon = (props) => (
    <Svg {...props} viewBox="0 0 36.32 34.51">
        <path d="M19.07,0A16.94,16.94,0,0,0,4.18,8.72L0,4.54V16.35H11.81L6.72,11.26a13.69,13.69,0,0,1,26,6A13.65,13.65,0,0,1,6.17,21.79H2.36a17.29,17.29,0,0,0,34-4.54A17.36,17.36,0,0,0,19.07,0ZM16.35,9.08v9.26l8.53,5.09,1.45-2.36-7.26-4.36V9.08Z" />
    </Svg>
);
