import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'wallet-header' })`
    top: 0;
    left: 0;
    grid-area: walletheader;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${props => props.theme.palette.clrChartBackground};
    border: ${props => `1px solid ${props.theme.palette.clrBorder}`};
    border-radius: ${props => props.isSeparate ? props.theme.palette.borderRadius : `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
    width: 100%;
    margin: 0 auto;
    padding-right: 10px;

    .dropdown-wrapper {
        color: ${props => props.theme.palette.clrPurple};

        .dropdown {
            top: 1px;
        }
    }
    .exchange-sibling{
        margin: 0;
        padding-left: 12px;
    }
    .exchange-sibling: hover{
        background: ${props => props.theme.palette.coinPairSelectHoverBg};
    }
    .exchange-sibling: hover ~.exchange-child{
        background: ${props => props.theme.palette.coinPairSelectHoverBg};
    }
    .exchange-child{
        display: flex;
        height: 100%;
        display: flex;
        height: 45px;
        width: 45px;
        position: absolute;
        left: 7%;
        @media (max-width: 768px) {
            left: 2%;
        }
    }
    .exchange-child: hover svg{
        background: ${props => props.theme.palette.clrBorderHover};
        border-radius: 50%;
    }
    .exchange-child svg{
        width: 45px;
        height: 45px;
        stroke-width: 3;
        stroke-linecap: square;
        stroke: white;
        margin: auto;
        padding: 10px;
    }

    @media (max-width: 768px) {
        height: ${props => !props.isOrderbook ? '60px' : ''};
        width: 100%;
    }

`;

export const AvatarWrapper = styled.div`
    position: relative;
    z-index: 1;
    width: 0;

    .login-title {
        position: absolute;
        text-overflow: ellipsis;
        left: 30px;
        bottom: 0;
        z-index: 99;
        padding: 2px;
        background-color: ${props => props.isLoggedIn ? props.theme.palette.clrRed : '#444872'};
        border: 1px solid ${props => props.isLoggedIn ? props.theme.palette.clrRed : '#444872'};
        border-radius: ${props => props.theme.palette.borderRadius};
        font-size: 9px;
        line-height: 8px;
        letter-spacing: 0.2px;
        color: ${props => props.theme.palette.clrHighContrast};
        text-transform: uppercase;
        text-align: center;
        pointer-events: none;
        overflow: hidden;
        transform: translateX(calc(-50% + 1px));
    }
`;

export const TextWrapper = styled.div`
    // height: 100%;
    padding: 0 15px;
    flex: 1;
    font-size: ${props => props.smallFont ? '24px' : '30px'};
    color: ${props => props.theme.palette.clrHighContrast};
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    > span {
        display: inline;
        cursor: pointer;

        &:hover {
            color: ${props => props.theme.palette.clrPurple};
        }
    }
`;

export const LoginTextWrapper = styled.div`
    height: 6px;
    position: relative;

    .loader {
        background: transparent;
    }
`;

export const IconWrapper = styled.div`
    width: 100% !important;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // border-left: 1px solid ${props => props.theme.palette.clrBorder};


    &.exchange-wrapper {
        width: fit-content;
        padding-right: 10px;

        & > div:first-child {
            width: fit-content;
            span {
                width: auto;
            }
        }
    }
`;

export const CurrencySymbol = styled.span`
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 15px;
    transform: translateX(calc(-50% + ${props => props.isFromTrading ? 9 : 3}px)) translateY(calc(-50% - ${props => props.isFromTrading ? 8 : 5}px));
`;

export const CurrencyImage = styled.img`
    width: ${props => props.width ? props.width : '100px'};
    height: ${props => props.height ? props.height : 'auto'};
`;

export const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    right: ${props => props.isLoggedIn ?  -1 : -61}px;
    z-index: 100000;
    width: ${props => props.width ?  props.width : 180}px;
    height: ${props => props.width ?  props.height - 60 : 500}px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background: ${props => props.theme.palette.clrBackground};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
    box-shadow: 2px 0 0 2px rgba(0, 0, 0, .2);
`;


export const DropdownFullHeight = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100000;
    // width: ${props => props.width ?  props.width : 180}px;
    // height: ${props => props.height ?  props.height : 500}px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background: ${props => props.theme.palette.clrBackground};
    // border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
    box-shadow: 2px 0 0 2px rgba(0, 0, 0, .2);
`;

const RefreshIconSvg = styled.svg`
    width: 35px !important;
    height: 35px !important;
    fill: #fff;
`;

export const LogoWrapper = styled.div.attrs({ className: 'exchange-icon' })`
    width: ${props => props.size ? props.size : 30}px;
    height: ${props => props.size ? props.size : 30}px;
    // background: ${props => props.theme.palette.clrBackground};
    margin-right: 15px;
    border-radius: 50%;
    overflow: hidden;
`;

export const Logo = styled.img`
    margin: 0 !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
`;

export const RefreshIcon = props => (
    <RefreshIconSvg
        viewBox="0 0 487.23 487.23"
        role="img"
        aria-hidden="true"
        {...props}
    >
        <path d="M55.323,203.641c15.664,0,29.813-9.405,35.872-23.854c25.017-59.604,83.842-101.61,152.42-101.61 c37.797,0,72.449,12.955,100.23,34.442l-21.775,3.371c-7.438,1.153-13.224,7.054-14.232,14.512 c-1.01,7.454,3.008,14.686,9.867,17.768l119.746,53.872c5.249,2.357,11.33,1.904,16.168-1.205 c4.83-3.114,7.764-8.458,7.796-14.208l0.621-131.943c0.042-7.506-4.851-14.144-12.024-16.332 c-7.185-2.188-14.947,0.589-19.104,6.837l-16.505,24.805C370.398,26.778,310.1,0,243.615,0C142.806,0,56.133,61.562,19.167,149.06 c-5.134,12.128-3.84,26.015,3.429,36.987C29.865,197.023,42.152,203.641,55.323,203.641z"/>
        <path d="M464.635,301.184c-7.27-10.977-19.558-17.594-32.728-17.594c-15.664,0-29.813,9.405-35.872,23.854 c-25.018,59.604-83.843,101.61-152.42,101.61c-37.798,0-72.45-12.955-100.232-34.442l21.776-3.369 c7.437-1.153,13.223-7.055,14.233-14.514c1.009-7.453-3.008-14.686-9.867-17.768L49.779,285.089 c-5.25-2.356-11.33-1.905-16.169,1.205c-4.829,3.114-7.764,8.458-7.795,14.207l-0.622,131.943 c-0.042,7.506,4.85,14.144,12.024,16.332c7.185,2.188,14.948-0.59,19.104-6.839l16.505-24.805 c44.004,43.32,104.303,70.098,170.788,70.098c100.811,0,187.481-61.561,224.446-149.059 C473.197,326.043,471.903,312.157,464.635,301.184z"/>
    </RefreshIconSvg>
);

const Svg = styled.svg.attrs({ className: 'exchange-icon' })`
    width: 30px !important;
    height: 30px !important;
    margin-right: 20px;
    fill: ${props => props.theme.palette.clrPurple};
`;

export const GlobalIcon = props => (
    <Svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 362.842 362.843"
        {...props}
    >
        <g>
            <path d="M338.444,93.39l-3.426-5.85l-0.217,0.177C303.078,35.692,245.806,0.878,180.535,0.878 C80.99,0.883,0,81.873,0,181.424s80.99,180.541,180.541,180.541c22.151,0,43.377-4.031,63.007-11.362 c13.454-4.723,26.411-10.979,38.539-18.909l3.637-2.373l-0.314-1.075c34.365-24.622,59.788-60.966,70.303-103.17l1.894,1.63 l1.921-9.909c2.207-11.351,3.316-22.764,3.316-33.914C362.842,151.604,354.403,120.664,338.444,93.39z M347.958,199.338 c-1.527-1.561-3.574-2.424-5.781-2.447h-0.062c-0.863,0-1.698,0.149-2.465,0.436l-0.126-0.098v0.143 c-1.772,0.681-3.168,2.076-3.837,3.911c-1.475,4.071,1.161,8.062,3.442,10.544c-0.445,4.455-1.709,9.812-2.578,12.746 c-1.155,3.825-6.599,9.995-14.427,13.986c-0.309-1.344-0.767-2.888-1.858-4.26c-3.128-3.923-8.663-5.998-15.999-5.998 c-6.347,0-13.906,1.583-20.23,4.26c-8.646,3.613-12.437,8.822-15.21,12.613c-0.983,1.338-1.818,2.482-2.619,3.202 c-3.831,3.442-14.706,6.645-21.889,8.761c-1.921,0.571-3.739,1.104-5.363,1.611c-10.31,3.26-9.972,14.37-9.721,22.484 c0.098,3.27,0.194,6.655-0.194,9.549c-0.835,6.141,0.206,11.133,3.1,14.861c2.504,3.23,6.347,5.3,10.83,5.826 c3.425,0.4,8.908,0.148,14.421-0.126c4.168-0.218,8.806-0.395,10.841-0.286c0.869,2.276,2.064,6.633,2.985,9.995 c0.194,0.743,0.405,1.521,0.617,2.288c-10.315,6.655-21.374,12.259-33.062,16.559c-17.2,5.93-35.298,9.046-53.689,9.046 l-0.006,1.201c-0.011,0-0.022,0-0.034,0v-1.201c-67.698,0-129.173-42.027-154.212-104.972c3.071-3.739,3.791-8.342,4.269-11.412 c0.569-3.683,1.341-8.721,4.651-16.297c4.583-10.48,5.873-14.752,6.281-17.199c0.38-0.606,0.978-1.481,1.91-2.871l1.101-1.646 c8.237-12.334,9.286-21.309,10.615-32.667l0.075-0.641c0.375-3.242,0.792-6.873,1.447-11.104 c1.881-12.162,7.356-19.141,12.637-25.862c1.649-2.087,3.202-4.065,4.52-5.992c2.888-4.163,4.812-9.638,6.844-15.428 c1.029-2.922,3.637-10.275,4.989-12.531c2.061,0.229,5.543,1.512,7.805,3.988c1.301,1.435,1.815,2.81,1.656,4.492 c-0.583,6.521-3.646,14.203-6.476,21.294c-3.634,9.077-6.504,16.242-5.092,23.229c2.47,12.354,12.997,17.483,17.986,19.908 c1.658,0.849,3.854,1.375,5.721,1.375c8.028,0,11.559-6.33,14.444-11.511c0.849-1.529,3.425-6.178,4.28-6.898 c7.871-2.788,13.9-8.877,19.247-14.27l0.529-0.537c1.247-1.272,2.447-2.487,3.471-3.396c3.396,4.783,7.882,7.447,10.95,9.269 c0.615,0.363,2.09,1.241,2.788,1.767c0.332,2.173,0.62,5.569,0.917,9.149l0.094,1.118c1.413,16.874,2.587,27.572,7.019,33.796 c0.932,1.31,1.944,2.459,3.005,3.477c-1.481,0.337-3.219,1.149-4.923,2.904c-5.152,5.324-7.977,18.086-7.842,22.266 c0.171,5.656,2.19,23.342,9.029,30.335c6.078,6.146,22.826,11.333,30.843,8.92c2.699-0.807,4.724-2.671,6.496-4.312 c2.35-2.173,3.625-3.34,5.443-2.974c5.964,1.121,10.801-2.618,13.209-9.606c1.841-5.357,2.762-15.427-2.631-19.646 c-1.898-1.476-4.288-2.195-7.33-2.195c-2.517,0-5.181,0.491-7.76,0.96c-2.064,0.372-4.203,0.767-5.655,0.767 c-0.32,0-0.509-0.012-0.521,0.012c-3.882-2.459-10.218-6.645-16.559-19.688c-0.154-0.326-0.326-0.646-0.486-0.955 c0.629,0.246,1.229,0.475,1.807,0.687c0.623,0.239,1.304,0.457,1.842,0.737c1.933,2.339,5.838,6.547,12.064,6.547 c4.632,0,12.671-2.195,14.513-17.074c0.915-7.971-1.784-13.405-3.809-16.625c0.264-0.323,0.572-0.691,0.938-1.106 c5.071-5.755,7.353-7.496,10.063-9.555c3.167-2.373,6.759-5.066,13.426-12.574c13.277-14.918,22.077-38.462,22.077-47.491 c0-3.834-1.344-6.879-2.916-9.221c3.757-2.781,6.775-5.506,9.589-8.039c5.946-5.364,9.218-8.314,16.96-9.335 c5.249-0.697,9.034-0.732,10.921-0.363c-0.731,2.027-2.053,5.252-4.426,10.393l-0.457,1.026c-0.469,1.023-0.915,2.001-1.321,2.922 c-6.192,1.218-10.115,5.315-10.526,11.03c-0.669,9.357,6.667,11.811,13.78,14.181c14.947,4.989,21.14,2.922,27.812-0.052 l3.957-1.727c1.584-0.669,3.259-1.553,4.975-2.59c11.67,22.938,18.297,48.852,18.297,76.301c0,6.221-0.365,12.351-1.023,18.412 C348.209,199.67,348.113,199.493,347.958,199.338z M180.3,200.493c7.754,15.462,16.022,20.688,20.522,23.536 c3.465,2.184,9.022,1.669,14.312,0.709c1.922-0.35,3.911-0.709,5.341-0.755c0.286,2.361-0.503,6.541-1.584,8.085 c-7.164-0.961-11.796,3.305-14.724,6.01c-0.669,0.617-1.681,1.561-1.915,1.698c-0.178,0.058-0.704,0.177-1.744,0.177 c-5.741,0-14.821-3.505-17.386-6.095c-2.782-2.831-5.447-14.735-5.681-22.478C177.413,209.322,178.799,203.97,180.3,200.493z M325.423,94.859c-1.378,0.861-2.71,1.576-3.922,2.079l-4.123,1.804c-3.46,1.536-5.083,2.213-7.634,2.213 c-2.722,0-6.444-0.817-11.722-2.576c-2.185-0.732-4.838-1.616-5.832-2.23c0.143-0.095,0.537-0.263,1.234-0.392 c2.139-0.389,6.107-1.101,7.525-4.766c0.537-1.352,1.28-2.988,2.099-4.786l0.457-1.007c2.75-5.973,4.478-10.152,5.433-13.214 C315.034,79.126,320.569,86.768,325.423,94.859z M180.541,12.594c44.418,0,84.855,17.269,115.035,45.413 c-2.968-0.117-6.444,0.112-10.762,0.686c-11.333,1.487-16.862,6.47-23.397,12.365c-2.928,2.647-6.244,5.641-10.396,8.509 c-1.59,1.089-2.842,2.112-3.831,3.139l-3.82,3.951l4.712,5.124c1.722,1.844,2.945,3.291,2.945,5.112 c0,5.563-7.222,26.337-19.115,39.709c-5.89,6.63-8.841,8.843-11.837,11.093c-2.876,2.188-5.85,4.454-11.688,11.082 c-4.34,4.932-4.895,7.402-4.895,9.006v1.178l0.457,1.089c0.258,0.615,0.544,1.095,1.602,2.633 c1.532,2.279,3.442,5.112,2.854,10.264c-0.549,4.432-1.516,6.673-2.877,6.673c-1.086,0-2.235-1.315-3.773-3.18 c-1.636-1.704-3.945-2.573-6.141-3.407c-3.706-1.401-7.892-2.982-10.57-6.736c-2.888-4.057-3.954-16.766-4.889-27.976 l-0.095-1.118c-0.363-4.294-0.669-8-1.112-10.587c-0.821-4.989-4.44-7.145-8.28-9.429c-2.788-1.655-5.95-3.536-7.899-6.767 c-2.699-4.492-6.018-5.435-8.331-5.435c-2.999,0-5.101,1.587-6.341,2.519c-2.056,1.476-4.057,3.514-6.178,5.667l-0.521,0.529 c-4.44,4.48-9.475,9.555-14.815,11.448c-4.386,1.555-7.399,6.47-10.655,12.331c-1.821,3.265-3.091,5.409-4.091,5.409l-0.586-0.157 c-5.246-2.559-10.475-5.569-11.71-11.728c-0.72-3.568,1.693-9.592,4.621-16.9c2.996-7.524,6.393-16.044,7.13-24.264 c0.452-4.929-1.152-9.566-4.66-13.432c-6.396-6.996-16.056-8.995-20.856-7.248l-0.926,0.415c-4.085,2.256-6.71,8.04-10.715,19.37 c-1.69,4.806-3.437,9.784-5.443,12.677c-1.195,1.738-2.582,3.505-4.077,5.387c-5.644,7.19-12.668,16.136-15.013,31.332 c-0.678,4.402-1.112,8.185-1.504,11.559l5.821,0.666l-5.892-0.06c-1.235,10.563-2.053,17.543-8.723,27.532l-1.101,1.646 c-1.904,2.842-2.619,3.917-3.116,4.946l-0.486,1.006l-0.08,1.115c-0.061,0.801-0.715,3.849-5.504,14.805 c-3.925,8.977-4.872,15.141-5.492,19.206c-0.552,3.517-1.072,5.312-2.355,6.267c-6.102-17.434-9.455-36.132-9.455-55.619 C11.71,88.332,87.449,12.594,180.541,12.594z M282.024,316.249c-2.733-9.961-4.231-14.684-8.589-16.147 c-1.692-0.572-3.848-0.812-7.216-0.812c-2.756,0-6.09,0.172-9.446,0.354c-4.677,0.24-9.491,0.555-12.419,0.194 c-0.961-0.119-2.242-0.445-2.962-1.372c-0.869-1.115-1.133-3.294-0.749-6.118c0.52-3.859,0.399-7.725,0.291-11.471 c-0.172-5.878-0.172-10.418,1.544-10.967c1.556-0.492,3.305-0.995,5.152-1.544c9.657-2.848,20.602-6.062,26.405-11.281 c1.71-1.532,3.002-3.3,4.249-5.004c2.401-3.282,4.654-6.37,10.292-8.731c4.975-2.092,10.836-3.339,15.702-3.339 c3.636,0,5.638,0.709,6.473,1.275c0.034,0.143,0.062,0.297,0.097,0.451c1.87,8.737,7.6,11.739,16.297,7.417 c4.151-2.076,7.931-4.712,11.133-7.605C326.831,271.432,307.171,297.276,282.024,316.249z"/>
            <path d="M264.87,150.958c-3.064,0-7.616,1.253-11.836,7.233c-4.312,6.096-6.072,7.8-7.64,9.304 c-1.475,1.424-2.864,2.768-5.181,6.247l-17.359,26.192l12.442-1.373c1.738-0.194,3.202-0.16,4.231-0.04 c1.692,0.234,2.607,0.784,3.865,1.55c1.572,0.938,3.729,2.23,6.759,2.23c3.248,0,6.581-1.453,11.145-4.85 c13.546-10.063,19.95-20.33,19.029-30.497C279.868,161.528,273.99,150.958,264.87,150.958z M254.315,188.045 c-2.797,2.076-3.94,2.465-3.854,2.568c-0.354-0.138-0.675-0.366-1.041-0.596c-1.08-0.651-2.516-1.509-4.494-2.195l5.032-7.604 c1.606-2.413,2.344-3.128,3.567-4.303c1.83-1.77,4.111-3.971,9.058-10.967c1.218-1.715,2.104-2.235,2.253-2.278 c1.212,0.194,3.574,3.714,3.819,5.312C269.181,173.67,264.092,180.798,254.315,188.045z"/>
        </g>
    </Svg>
);

const HistoryMenuIconSvg = styled.svg`
    width: 36.32px;
    height: 34.50px;
    margin-right: 15px;
    fill: ${props => props.theme.palette.clrPurple};
`;

export const HistoryMenuIcon = props => (
    <HistoryMenuIconSvg {...props}>
        <path className="cls-1" d="M19.07,0A16.94,16.94,0,0,0,4.18,8.72L0,4.54V16.35H11.81L6.72,11.26a13.69,13.69,0,0,1,26,6A13.65,13.65,0,0,1,6.17,21.79H2.36a17.29,17.29,0,0,0,34-4.54A17.36,17.36,0,0,0,19.07,0ZM16.35,9.08v9.26l8.53,5.09,1.45-2.36-7.26-4.36V9.08Z"/>
    </HistoryMenuIconSvg>
);

const CheckWrapper = styled.button`
    position: relative;
    width: 20px;
    height: 20px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.checked ? props.theme.palette.settingsCheckBackgroundActive : (!props.isSelected ? 'transparent' : '#fff')};
    border: 1px solid ${props => props.checked ? props.theme.palette.settingsCheckBackgroundActive : props.theme.palette.settingsCheckBorder};
    outline: none;
    cursor: pointer;
`;

const CheckBox = styled.svg`
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 20px;
    height: 20px;
    // fill: ${props => props.theme.palette.settingsCheckBackground};
    // stroke: ${props => props.theme.palette.settingsCheckBorder};
`;

const Checked = styled.svg`
    width: 14px;
    height: 14px;
    fill: ${props => props.theme.palette.settingsItemActive};
`;

export const Check = props => (
    <CheckWrapper {...props}>
        <CheckBox viewBox="0 0 20 20">
            <rect x="0.5" y="0.5" width="19" height="19"/>
        </CheckBox>

        {props.checked && (
            <Checked viewBox="0 0 13.01 9.97">
                <path d="M12.78,1.38,11.64.23a.83.83,0,0,0-1.15,0L5,5.75,2.52,3.27A.81.81,0,0,0,2,3a.78.78,0,0,0-.57.23L.23,4.42A.78.78,0,0,0,0,5a.81.81,0,0,0,.23.57l3,3L4.42,9.74A.74.74,0,0,0,5,10a.77.77,0,0,0,.57-.23L6.7,8.6l6.08-6.08A.81.81,0,0,0,13,2a.78.78,0,0,0-.23-.57Z"/>
            </Checked>
        )}
    </CheckWrapper>
);

export const LabelAPI = styled.a`
    // font-size: 14px;
    color: ${props => props.included ? props.theme.palette.clrBlue : props.theme.palette.clrHighContrast};
    // cursor: ${props => props.included ? 'pointer' : 'initial'};
    cursor: pointer;
    // text-decoration: underline;

    &:hover {
        text-decoration: ${props => props.included ? 'underline' : 'none'};
    }
`;

export const ApiKeyWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 5px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: ${props => props.theme.palette.clrMainWindow};
`;

export const LabelArbitrage = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 40px;
    font-weight: 600;
    margin-left: 15px;
    color: ${props => props.theme.palette.clrPurple};
`;

export const ExchangeHeader = styled.div`
    position: relative;
    width: 100%;
    height: ${props => props.height ? `${props.height}px` : '100%'};
    margin: 0;
    padding-left: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: transparent;
    border-bottom: 1px solid ${props => props.theme.palette.clrInnerBorder};
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};

    .checkbox {
        margin-left: auto;
    }
`;

export const TransactionDetail = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: ${props => props.theme.palette.clrBorder};

    > div:last-child {
        text-align: right;
    }

    .name,
    .amount {
        font-weight: 600;
        color: ${props => props.theme.palette.clrHighContrast};
    }

    .date,
    .status {
        margin-top: 8px;
    }
`;

const ThreeDotSvg = styled.svg`
    width: 20px;
    height: 100%;
    fill: ${props => props.theme.palette.clrHighContrast};
    cursor: pointer;
`;

export const ThreeDotIcon = (props) => (
    <div className="exchange-child">
        <ThreeDotSvg
            viewBox="0 0 38 38"
            role="img"
            aria-hidden="true"
            {...props}
        >
            <path d="M10.5 10l17 0"/>
            <path d="M10.5 19l17 0"/>
            <path d="M10.5 28l17 0"/>
        </ThreeDotSvg>
    </div>
);

const SvgLang = styled.svg`
`;

export const LanguageIcon = (props) => (
    <SvgLang {...props} x="0px" y="0px" viewBox="0 0 100 75.446">
        <path d="M19.198,44.002v-8.201h-8.575c-3.319,0-6.021-2.874-6.021-6.406V10.903c0-3.533,2.701-6.408,6.021-6.408h38.345   c3.319,0,6.019,2.875,6.019,6.408v18.492c0,3.532-2.7,6.406-6.019,6.406v4.496c5.797,0,10.514-4.891,10.514-10.902V10.903   C59.482,4.892,54.766,0,48.968,0H10.623C4.824,0,0.107,4.892,0.107,10.903v18.492c0,6.011,4.717,10.902,10.516,10.902h4.08v7.968   c0,1.223,0.789,2.332,1.963,2.764c0.334,0.123,0.677,0.184,1.014,0.184c0.821,0,1.609-0.354,2.165-1.01l8.369-9.905h8.353v-4.496   H26.128L19.198,44.002z" />
        <path d="M89.377,24.233h-25.96v4.496h25.96c3.319,0,6.021,2.875,6.021,6.408v18.489c0,3.533-2.701,6.408-6.021,6.408h-8.574v8.205   l-6.931-8.203H51.031c-3.318,0-6.019-2.875-6.019-6.408V35.137c0-3.533,2.701-6.408,6.019-6.408v-4.496   c-5.797,0-10.515,4.892-10.515,10.903v18.491c0,6.014,4.717,10.904,10.515,10.904h20.754l8.372,9.91   c0.555,0.652,1.342,1.004,2.161,1.004c0.337,0,0.68-0.059,1.014-0.182c1.176-0.432,1.967-1.543,1.967-2.768V64.53h4.078   c5.799,0,10.516-4.891,10.516-10.904V35.137C99.893,29.125,95.176,24.233,89.377,24.233z" />
        <path d="M26.532,7.437l-7.952,20.951h4.665l1.644-4.665h7.834l1.584,4.665h4.782L31.255,7.437H26.532z M26.093,20.29l2.729-7.688   h0.058l2.641,7.688H26.093z" />
        <path d="M60.12,49.114c0,2.297,1.468,3.787,3.862,3.787c2.876-0.061,5.721-1.887,6.647-2.711c0.926-0.826,3.42-3.693,4.521-5.963   c1.393,0.658,2.053,1.76,2.053,2.98c0,2.639-2.542,4.17-6.599,4.635l1.968,2.725c6.354-0.832,8.516-3.5,8.516-7.408   c0-3.301-2.077-5.305-4.74-6.183c0.049-0.242,0.138-0.495,0.188-0.74l-3.611-0.643c-0.024,0.365-0.097,0.432-0.168,0.798   c-1.297-0.074-2.738,0.121-3.202,0.219c0-0.66,0.024-2.421,0.049-3.055c3.006-0.122,5.962-0.365,8.699-0.781l-0.318-3.566   c-2.81,0.562-5.523,0.856-8.186,1.003c0.072-0.71,0.172-2.717,0.172-2.717l-3.813-0.291c-0.05,0.978-0.072,2.127-0.121,3.128   c-1.688,0.024-3.689,0.024-4.742,0l0.171,3.446h0.414c1.003,0,2.641-0.051,4.109-0.099c0,0.952,0.023,3.005,0.048,3.934   C62.589,43.051,60.12,45.717,60.12,49.114z M71.606,43.59c-0.514,1.025-1.124,1.957-1.808,2.736   c-0.1-0.807-0.148-1.637-0.196-2.516C69.87,43.762,70.945,43.59,71.606,43.59z M66.229,45.008c0.123,1.369,0.27,2.688,0.489,3.885   c-0.634,0.318-1.244,0.514-1.809,0.539c-1.223,0.049-1.223-0.732-1.223-1.076C63.687,47.059,64.689,45.864,66.229,45.008z" />
    </SvgLang>
);
