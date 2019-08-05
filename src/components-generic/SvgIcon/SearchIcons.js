import React from 'react';
import styled from 'styled-components/macro';

const GeneralSearchIconSvg = styled.svg`
    margin: 0 2px 0 10px;
    width: ${props => props.isMobile ? '30px' : '22.5px'};
    height: ${props => props.isMobile ? '25px' : '18.75px'};
    
    &, & * {
        fill: ${props => props.theme.palette.clrPurple} !important;
    }
`;

export const GeneralSearchIcon = ({ isMobile }) => {
    return (
        <GeneralSearchIconSvg isMobile={isMobile}>
            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#search" />
        </GeneralSearchIconSvg>
    );
};

const ExchDropdownSearchIconSvg = styled.svg`
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 26px;
    height: 30px;
    z-index: 1;
    fill: ${props => props.theme.palette.clrHighContrast};
    margin: 0 12px 0 0;
    &, & * {
        fill: ${props => props.theme.palette.clrHighContrast};
    }
`;
export const ExchDropdownSearchIcon = () => (
    <ExchDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px">
        <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
        <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
    </ExchDropdownSearchIconSvg>
);

const SideBarSearchIconSvg = styled.svg`
    width: 27px;
    height: 27px;
`;
export const SideBarSearchIcon = () => (
    <SideBarSearchIconSvg
        viewBox="0 0 20.89 20.88"
        role="img"
        aria-hidden="true"
    >
        <path d="M20.3,17.51l-4-4a8.79,8.79,0,1,0-2.78,2.79l4,4a2,2,0,1,0,2.78-2.78Zm-6.94-4.16a6.44,6.44,0,1,1,0-9.1,6.45,6.45,0,0,1,0,9.1Z"/>
    </SideBarSearchIconSvg>
);

const ExchangesDropdownSearchIconSvg = styled.svg`
    width: 41px;
    height: 27px;
    fill: ${props => props.theme.palette.clrHighContrast};
`;

export const ExchangesDropdownSearchIcon = () => (
    <ExchangesDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px">
        <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
        <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
    </ExchangesDropdownSearchIconSvg>
);
