import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'coin2pair-simple' })`
    position: ${props => !props.isLoggedIn ? '' : 'absolute'};;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    z-index: 50;
    border: ${props => props.isMenuOpened ? `1px solid ${props.theme.palette.clrBorder}` : 'none'};
    border-radius: ${props => props.isMenuOpened ? '0' : '30px'};
    background: transparent;

    .exchange-child {
        position: relative;
        left: 8px;
        top: 3px;
        height: 60px;
    }
    .coin-pair-form-v2 {
        width: 60px;
    }
    .exch-form__switch-arrows{
        width: 38px;
        stroke: ${props => props.theme.palette.clrHighContrast};
        fill: ${props => props.theme.palette.clrChartBackground};
    }

`;

export const Title = styled.div`
    font-size: 40px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    padding-left: ${props => props.isLeft ? '4px' : ''};
    padding-right: ${props => !props.isLeft ? '4px' : ''};
    @media (max-width: 768px) {
        font-size: 28px;
    }
    
`;

export const C2Wrapper = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    right: 5% !important;
    @media (max-width: 768px) {
        right: 1% !important;
    }
`;

export const CWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    width: 20%;
    margin: 0 15px;

    & > div:last-child {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        margin: 0 5px;
    }
`;

export const CoinSwap = props => (
    <svg className="exch-form__switch-arrows" viewBox="0 0 1400 980">
        <g className="arrow_top" strokeMiterlimit="10" strokeWidth="10" transform="matrix(188.16722106933594, 0, 0, 188.16722106933594, 425.3118591308594, 57.448905944824226)">
            <g transform="translate(0 -294.35)">
                <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                    <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                        <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                            <path d="M 204 306 L -300 306 L -300 102 L 204 102 L 204 0 L 458 204 L 204 408 Z" />
                        </g>
                    </g>
                </g>
            </g>
        </g>
        <g className="arrow_bottom" strokeMiterlimit="10" strokeWidth="10" transform="matrix(-188.16722106933594, 0, 0, 188.16722106933594, 978.9641723632811, 429.2027282714843)">
            <g transform="translate(0 -294.35)">
                <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                    <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                        <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                            <path d="M 204 306 L -300 306 L -300 102 L 204 102 L 204 0 L 458 204 L 204 408 Z"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);
