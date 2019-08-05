import React from 'react';
import styled from 'styled-components/macro';
import QRCode from 'qrcode.react';

import { darkTheme } from '../../theme/core';

const { palette } = darkTheme;

export const DropdownWrapper = styled.div.attrs({ className: 'user-avatar-dropdown-wrapper' })`
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    margin: 0;
    border: ${props => props.isOpenMenu ? `1px solid ${props.theme.palette.userMenuPopupBorder}` : '0px'};
    border-top: 0;
    border-radius: ${palette.borderRadius};
    padding: 0;
    height: ${props => props.gridHeight ? (!props.isOpenMenu ? `${props.gridHeight - 101}px` : `${props.gridHeight - 29}px`) : '100vh'};
    height: ${props => props.isOpenMenu ? 'calc(100% - 72px)' : '100%'};
    background: ${props => props.theme.palette.clrChartBackground};
    z-index: 999;
    box-shadow: 2px 0 0 2px rgba(0, 0, 0, .2);
    width: 100%;
    ${props => !props.isOpenMenu && `
        min-height: ${props.gridHeight - 101}px;
        transform: translateX(-110%);
    `}
    transition: all 0.3s;

    .btn_reset {
        padding: 0;
        border-radius: ${props => props.theme.palette.borderRadius};
        border: 0;
        background: transparent;
        color: ${props => props.theme.palette.clrLightRed};
        outline: none;
        margin-right: 12px;
        height: 31px;
        max-width: 110px;
        width: auto;
        font-size: 17px;
        font-weight: 600;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &:hover {
            opacity: 0.8;
        }
    }
`;

export const DropdownArrow = styled.div`
    position: absolute;
    margin-top: 50px;
    margin-left: 25px;
    border: none;
    border-bottom: 6px solid ${palette.userMenuPopupArrowBg};
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    padding: 0;
    width: 6px;
    background: transparent;
`;

export const DropdownAvatar = styled.div`
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 25px 5px;
    border: 1px solid ${palette.userMenuPopupItemBorder};
    border-radius: ${palette.borderRadius} ${palette.borderRadius} 0 0;
    background: ${palette.userMenuPopupBg};

    .user-avatar-component {
        border: none !important;
        height: 135px !important;
        width: 135px !important;
        pointer-events: none !important;

        svg {
            height: 135px !important;
            width: 135px !important;
        }
    }

    .settings-pop-avatar-wrapper, .settings-pop-default-avatar, .user-pic {
        border: none !important;
        margin: 0 !important;
        width: 135px !important;
        height: 135px !important;
    }
`;

export const AvatarButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0 0;
    border: none;
    padding: 0;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;

    color: ${palette.clrHighContrast};

    &:hover {
        span {
            color: ${palette.userMenuPopupAvatarLinkHover};
        }
    }
`;

export const AuthLink = styled.span`
    margin: 0 .5rem;
    color: ${palette.userMenuPopupAvatarLink};
    cursor: pointer;

    &:hover {
        color: ${palette.userMenuPopupAvatarLinkHover};
    }
`;

export const DropdownMenu = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    margin: 0;
    border: none;
    border-top: ${props => !props.isOpenMenu ? 0 : 1}px solid ${palette.userMenuPopupBorder};
    padding: 0;
    width: 100%;
    height: min-content;

    .scrollbar-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 10px rgba(0,0,0,.35);
        border-radius: ${palette.borderRadius}; // 0 0 ${palette.borderRadius} ${palette.borderRadius};
        overflow: hidden;

        .ps__rail-y {
            opacity: 0 !important;
            border-left: 1px solid ${palette.userMenuPopupBorder};
            background: ${palette.userMenuPopupBg};

            .ps__thumb-y {
                &:before {
                    background: ${palette.userMenuPopupBorder};
                }
                cursor: pointer;
            }
        }

        .trading-section {
            border-top: ${props => `1px solid ${props.theme.palette.userMenuPopupMenuItemBorder}`};
            padding: 20px;
        }
    }
`;

export const DropdownMenuItem = styled.div`
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: ${props => props.isColumn ? 'column' : 'row'};
    align-items: center;
    justify-content: stretch;
    margin: 0;
    border: none;
    border-top: 1px solid ${palette.userMenuPopupMenuItemBorder};
    padding: ${props => props.isColumn ? 0 : '10px 0'};
    width: 100%;
    cursor: auto;

    ${props => (props.opened && props.isFullHeight) && 'flex: 1;'};
    ${props => (!props.opened && props.isFullHeight) && `border-bottom: 1px solid ${palette.userMenuPopupMenuItemBorder};`};

    .d-flex {
        flex-shrink: 0;
        width: 100%;
        height: 60px;
        padding: 10px 0;
        align-items: center;
        justify-content: stretch;
        transition: all 0.25s ease;
        cursor: pointer;
        ${props => props.opened && `
            background: ${props.theme.palette.clrMainWindow} !important;
            border-bottom: 0.25px solid ${props => props.theme.palette.clrBorder};
        `};
        span {
            transition: all 0.25s ease;
        }
    }

    .icon-wrapper {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        border: none;
        padding: 0;
        width: 68px;
        height: 100%;

        svg, svg * {
            fill: ${props => props.opened ? palette.settingsSelectedText : palette.userMenuPopupMenuItem} !important;
        }
    }

    .label-wrapper {
        flex: 1;
        color: ${props => props.opened ? palette.settingsSelectedText : palette.userMenuPopupMenuItem};
        font-size: 40px;
        font-weight: 600;
        text-transform: uppercase;
    }

    &:hover {
        .d-flex {
            background: ${palette.userMenuPopupMenuItemHoverBg};
            & > span {
                padding-left: 5px;
            }
        }

        .icon-wrapper {
            svg, svg * {
                fill: ${props => props.opened ? palette.settingsSelectedText : palette.userMenuPopupMenuItemHover} !important;
            }
        }

        .label-wrapper {
            color: ${props => props.opened ? palette.settingsSelectedText : palette.userMenuPopupMenuItemHover};
        }
    }

    > .btn_reset {
        border-radius: ${palette.borderRadius};
        border: 0;
        background: ${palette.clrLightRed};
        color: ${palette.clrHighContrast};
        outline: none;
        height: 31px;
        width: 78px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 25px;

        &:hover {
            opacity: 0.8;
        }
    }

    > .btn_normal {
        border-radius: ${palette.borderRadius};
        border: 1px solid ${palette.clrBorder};
        background: ${palette.clrBackground};
        color: ${palette.clrHighContrast};
        outline: none;
        height: 31px;
        width: 78px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;

        &:hover {
            opacity: 0.8;
        }
    }
`;

export const TradingButton = styled.div`
    display: flex;
    width: 45%;
    padding: 50px;
    border: ${props => `1px solid ${props.theme.palette.userMenuPopupMenuItemBorder}`};
`;

export const Spacer = styled.div`
    flex: 1 0 10px;
    width: 100%;
    border-bottom: 1px solid ${palette.clrBorder};
`;

const DownArrowSvg = styled.svg`
    margin-right: 25px;
    width: 15px;
    height: 9px;

    ${props => props.isOpen ? 'transform: rotateZ(180deg);' : ''};

    &, & * {
        fill: ${palette.userMenuPopupMenuItem} !important;
    }
`;

export const DownArrow = props => (
    <DownArrowSvg
        viewBox="0 0 15 8.9"
        {...props}
    >
        <path
            className="st0"
            d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
        />
    </DownArrowSvg>
);

const OpenArrowSvg = styled.svg`
    margin-right: 25px;
    width: 15px;
    height: 9px;
    transform: ${props => props.isOpened ? 'rotateZ(0deg)' :  'rotateZ(-90deg)'};
    transition: all 0.1s;
    &, & * {
        fill: ${palette.userMenuPopupMenuItem} !important;
    }
`;

export const OpenArrow = props => (
    <OpenArrowSvg
        viewBox="0 0 15 8.9"
        {...props}
    >
        <path
            className="st0"
            d="M7.5,8.9L0.3,1.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.8,5.8l5.8-5.8c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L7.5,8.9z"
        />
    </OpenArrowSvg>
);

export const Tab = styled.div`
    padding: 8px;
    z-index: 100;
    font-weight: 400;
    color: ${props => props.active ? props.theme.palette.orderHistoryHeaderTabActive : props.theme.palette.orderHistoryHeaderTab};
    cursor: pointer;
    margin-right: ${props => props.marginRight ? 10 :  0}px;
`;


const ThreeDotSvg = styled.svg`
    width: 30px;
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

const GlobalSvg = styled.svg`
    width: ${props => props.size ? props.size : 16}px !important;
    height: ${props => props.size ? props.size : 16}px !important;
    fill: ${props => props.isDisabled ? props.theme.palette.clrBorder : (props.color ? props.color : props.theme.palette.orderFormHeaderText)} !important;
`;

export const GlobalIcon = props => (
    <GlobalSvg viewBox="0 0 12.33 12.33" {...props}>
        <path d="M1.1,3.78a5.21,5.21,0,0,0,1.67.64A7.55,7.55,0,0,1,4.26.89l-.73.33-.23.13a.27.27,0,0,1-.4-.08c-.1-.15,0-.3.12-.41A5.9,5.9,0,0,1,5,.12,6.16,6.16,0,1,1,.19,7.63,6,6,0,0,1,1.65,2c.1-.12.21-.2.37-.12s.2.29.06.48c-.3.39-.57.79-.85,1.19C1.18,3.6,1.15,3.69,1.1,3.78Zm10.35.56c-.28.12-.55.25-.83.35S10,4.87,9.74,5c-.11,0-.1.1-.1.18,0,.59,0,1.18,0,1.76a.26.26,0,0,1-.35.28c-.18,0-.21-.18-.21-.35,0-.37,0-.75,0-1.12,0-.2,0-.4,0-.57l-2.64.23V8.59h.1a14.85,14.85,0,0,0,3.18-.37,5,5,0,0,0,1.64-.66A.63.63,0,0,0,11.69,7c0-.13,0-.26.05-.39A5.32,5.32,0,0,0,11.45,4.34ZM5.85,8.62V5.36L3.26,5.13a0,0,0,0,0,0,0A10.1,10.1,0,0,0,3.43,8.3a.22.22,0,0,0,.12.11c.22,0,.43.07.65.09C4.75,8.55,5.29,8.58,5.85,8.62ZM9,4.57A6.5,6.5,0,0,0,7.63,1.31,2.25,2.25,0,0,0,6.78.69L6.44.58V4.8ZM5.85,4.8V.6l-.09,0a2.39,2.39,0,0,0-1.27.94,6.21,6.21,0,0,0-1,2.32c0,.21-.09.43-.14.69Zm-5-.48a.93.93,0,0,0-.05.1A5.24,5.24,0,0,0,.59,6.61c.08.77,0,.78.88,1.24a5.24,5.24,0,0,0,1.36.42V8.16A10.48,10.48,0,0,1,2.69,5.1c0-.1,0-.13-.12-.15A6.1,6.1,0,0,1,.89,4.32ZM8,.91A7.13,7.13,0,0,1,9.56,4.42a5.3,5.3,0,0,0,1.66-.64A5.44,5.44,0,0,0,8,.91Zm-1.6,10.8c1-.1,1.94-1.47,2.25-2.68l-2.25.16Zm-.58,0V9.19L3.62,9a4.52,4.52,0,0,0,1.6,2.43A5.29,5.29,0,0,0,5.85,11.76Zm-1.57-.33s0-.06,0-.06A6.22,6.22,0,0,1,3,9a.2.2,0,0,0-.19-.16,6.36,6.36,0,0,1-.78-.2c-.36-.11-.71-.25-1.09-.38A5.72,5.72,0,0,0,4.28,11.43Zm7.09-3.19a7.64,7.64,0,0,1-1.93.63.34.34,0,0,0-.15.18c-.17.39-.29.81-.48,1.19s-.48.78-.72,1.18A5.73,5.73,0,0,0,11.37,8.24Z" />
    </GlobalSvg>
);

export const DropdownFullHeight = styled.div`
    width: 100%;
    height: 400px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background: ${props => props.theme.palette.clrBackground};
    border-radius: ${props => `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
    box-shadow: 2px 0 0 2px rgba(0, 0, 0, .2);
`;

export const IconWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.exchange-wrapper {
        height: 400px;

        & > div:first-child {
            span {
                width: auto;
            }
        }
    }
`;

export const ItemList = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    margin-top: ${props => props.isMarginTop ? '12px' : ''};
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    background: transparent;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    .hide {
        display: none;
    }
`;


export const ListStyleWrapper = styled.div`
    width: ${props => props.width - 2}px;
    height: ${props => props.isMarginTop ? props.height - 12 : props.height}px;
    box-shadow: ${props => !props.isMarginTop ? '5px 5px 38px 11px rgba(0,0,0,1)' : ''};

    .scrollbar-container {
        height: min-content;
        max-height: 100%;
        overflow: hidden;

        &.d-flex {
            flex-wrap: wrap;
        }
    }

    .ps__rail-y {
        right: 0 !important;
        background-color: ${props => props.theme.palette.clrBackground} !important;
        border-left: 1px solid ${props => props.theme.palette.clrInnerBorder};
        border-bottom-right-radius: ${props => props.theme.palette.borderRadius};
        opacity: 0 !important;

        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;

            &:before {
                background-color: ${props => props.theme.palette.clrBorder};
            }
        }
    }

    .ReactVirtualized__Table__rowColumn {
        height: 100%;
        margin: 0;
    }

    .ReactVirtualized__Table__row {
        background: ${props => props.theme.palette.clrChartBackground};
        border-bottom: 1px solid ${props => props.theme.palette.clrInnerBorder};

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background: ${props => props.theme.palette.clrMouseHover};
        }

        // &:active {
        //     background: ${props => props.theme.palette.clrMouseClick};
        // }

        &:hover,
        &:active {
            .deposit-dropdown-name {
                color: ${props => props.theme.palette.clrHighContrast} !important;
            }
        }
    }

    .ReactVirtualized__Table__Grid {
        outline: none !important;
    }
`;

export const LanguageWrapper = styled.div`
    position: absolute;
    right: 12px;
    bottom: 12px;
    .dropdown-wrapper {
        opacity: 1 !important;
    }
`;

export const PageButtonsWrapper = styled.div`
    position: absolute;
    left: 12px;
    bottom: 6px;

    .primary-solid {
        .gradient-button__label {
            span {
                color: ${props => props.theme.palette.settingsText};

                &:hover {
                    color: ${props => props.theme.palette.clrLightBlue};
                }
            }
        }

        @media (max-width: 768px) {
            max-width: 80px;
        }
    }
`;

export const Code = styled(QRCode)`
    pointer-events: none !important;

    & path:nth-child(1) {
        /* background */
        fill: ${props => props.theme.palette.clrBorder};
        display: none;
    }

    & path:nth-child(2) {
        /* foreground */
        fill: ${props => props.color || props.theme.palette.clrPurple};
    }
`;

export const ReportItem = styled.span`
    &:hover {
        transition-duration: 0.3s;
        font-size: 16px;  
    }
`;

export const TransferSection = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 200px;
    padding: 12px 160px 12px 12px;
    border-top: 1px solid ${props => props.theme.palette.clrBorder};
`;

export const AddressInput = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    margin-bottom: 16px;
    align-items: center;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: 3px 0 0 3px;
    background-color: ${props => props.theme.palette.clrBorder};
    overflow: hidden;

    label {
        width: 150px;
        text-align: center;
        line-height: 30px;
        color: white;
        font-size: 15px;
    }

    input {
        flex: 1;
        height: 28px;
        padding: 0 12px;
        line-height: 28px;
        border: none;
        color: ${props => props.theme.palette.clrPurple};
        background: ${props => props.theme.palette.clrChartBackground};

        &::placeholder {
            color: ${props => props.theme.palette.clrPurple};
        }
    }
`;

export const DepositQRCode = styled.div`
    position: absolute;
    right: 12px;
    top: 12px;
    width: 136px;
    height: 136px;
    border-radius: 3px;
    text-align: center;

    svg {
        padding: 8px;
        border: 1px solid ${props => props.theme.palette.clrBorder};
    }
`;

export const BottomMenuWrapper = styled.div`
    width: 100%;
    height: 65px;
    border-top: 1px solid ${darkTheme.palette.userMenuPopupMenuItemBorder};
`;
