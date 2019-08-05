import React from 'react';
import styled from 'styled-components/macro';

const AvatarSvg = styled.svg.attrs({ className: 'avatar-icon' })`
    width: 40px;
    height: 40px;
    background-color: ${props => props.theme.palette.clrBorder};
    border-radius: 50%;
    
    &:hover {
        box-shadow: 0px 0px 15px 3px ${props => props.theme.palette.clrBorder};
        cursor: pointer;
    }

    &:active {
        box-shadow: 0px 0px 15px 3px ${props => props.theme.palette.clrBorder};
    }
    
    .cls-1 {
        stroke: #7881ae; // ${props => props.theme.palette.clrHighContrast};
        fill: white; // ${props => props.theme.palette.clrHighContrast};
    }
    
    .cls-2 {
        stroke: none;
        fill: ${props => props.theme.palette.clrBorder};
    }
`;

const AvatarIcon = (props) => (
    <AvatarSvg {...props} viewBox="0 0 43.71 43.71">
        <circle className="cls-2" cx="21.855" cy="21.855" r="21.855" strokeWidth="2" />
        <path
            className="cls-1"
            d="M15.35,34.27,8.83,37.82a6.06,6.06,0,0,0-1,.75,21.83,21.83,0,0,0,28.06.07,6,6,0,0,0-1.14-.77l-7-3.49A2.66,2.66,0,0,1,26.24,32V29.26a9.14,9.14,0,0,0,.66-.85A16.22,16.22,0,0,0,29.07,24,2.2,2.2,0,0,0,30.63,22V19a2.22,2.22,0,0,0-.73-1.63V13.18s.87-6.58-8-6.58-8,6.58-8,6.58V17.4A2.19,2.19,0,0,0,13.08,19V22a2.2,2.2,0,0,0,1,1.84,14.64,14.64,0,0,0,2.65,5.47v2.67a2.69,2.69,0,0,1-1.39,2.34Z"
        />
        {/*
        <path
            className="cls-2"
            d="M22.23,0A21.84,21.84,0,0,0,7.79,38.56a6.51,6.51,0,0,1,1-.74l6.52-3.55a2.68,2.68,0,0,0,1.39-2.34V29.26a14.47,14.47,0,0,1-2.65-5.47,2.2,2.2,0,0,1-1-1.84V19a2.22,2.22,0,0,1,.73-1.62V13.18s-.86-6.59,8-6.59,8,6.59,8,6.59V17.4A2.21,2.21,0,0,1,30.62,19V22A2.21,2.21,0,0,1,29.07,24a16.22,16.22,0,0,1-2.17,4.37,10.7,10.7,0,0,1-.66.85V32a2.66,2.66,0,0,0,1.47,2.38l7,3.49a5.85,5.85,0,0,1,1.14.77A21.85,21.85,0,0,0,22.23,0Z"
        />
        */}
    </AvatarSvg>
);

export default AvatarIcon;
