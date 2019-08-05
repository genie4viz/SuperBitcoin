import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'settings-pop-wrapper' })`
    position: absolute;
    left: 0;
    top: 15px;
    right: 0;
    bottom: 15px;
    z-index: 999999;
    // background: rgba(0, 0, 0, 0.5);
    background: transparent;
`;

export const Modal = styled.div.attrs({ className: 'settings-pop-modal' })`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    border: 1px solid ${props => props.theme.palette.settingsBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    background-color: ${props => props.theme.palette.settingsBackground};
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.palette.settingsText};
    z-index: 999999;

    // &:before {
    //     content: '';
    //     position: absolute;
    //     left: -17px;
    //     bottom: 20px;
    //     width: 0;
    //     border-style: solid;
    //     border-width: 8px;
    //     border-color: transparent ${props => props.theme.palette.settingsBorder} transparent transparent;
    //     z-index: 10000001;
    // }

    .ps__rail-y {
        background-color: ${props => props.theme.palette.settingsBackground} !important;
        border-left: 1px solid ${props => props.theme.palette.settingsBorder};
        opacity: 1 !important;

        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;

            &:before {
                background-color: ${props => props.theme.palette.settingsBorder};
            }
        }
    }
`;

export const Header = styled.div.attrs({ className: 'settings-pop-header' })`
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px 0 0;
    width: 100%;
    height: 60px;
    background: transparent;
    // background-color: ${props => props.theme.palette.settingsHeaderBackground};
    border-bottom: 1px solid ${props => props.theme.palette.settingsBorder};
    border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
    color: ${props => props.theme.palette.settingsHeaderText};
    fill: ${props => props.theme.palette.settingsHeaderText};
    overflow: hidden;

    span {
        margin-left: 10px;
    }

    .terms-link {
        // position: absolute;
        // right: 10px;
        margin: 0 10px 0 auto;
        color: ${props => props.theme.palette.clrBlue};
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        padding-bottom: 3px;
        border-bottom: 1px solid ${props => props.theme.palette.clrBlue};
    }
`;

const CloseWrapper = styled.div`
    // position: absolute;
    // top: -12px;
    // right: -12px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.palette.modalCloseBackground};
    border-radius: 50%;
    fill: ${props => props.theme.palette.settingsHeaderText};
    cursor: pointer;
`;

const CloseSvg = styled.svg`
    width: 12px;
    height: 12px;
`;

export const Close = props => (
    <CloseWrapper className="ml-auto">
        <CloseSvg {...props} viewBox="0 0 9.38 9.38">
            <path transform="rotate(135 4.694 4.692)" d="M-1.38 4.13h12.14v1.13H-1.38z"/>
            <path transform="rotate(45 4.687 4.691)" d="M-1.38 4.13h12.14v1.13H-1.38z"/>
        </CloseSvg>
    </CloseWrapper>
);

export const List = styled.div.attrs({ className: 'settings-pop-list' })`
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: ${props => `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
    overflow: hidden;
`;

export const Item = styled.div.attrs({ className: 'settings-pop-item' })`
    flex-shrink: 0;
    position: relative;
    width: 100%;
    ${props => props.isMobileDevice ? 'flex: 1;' : 'height: 70px;'}
    height: ${props => props.UserItem ? 'auto' : 70};
    ${props => props.settingsOpen && 'height: 400px;'};
    border-bottom: 1px solid ${props => props.theme.palette.clrSubBorder};
    margin-top: -1px;
    display: flex;
    justify-content: ${props => props.appStoreButton ? 'flex-start' : 'space-between'};
    align-items: center;
    padding-right: ${props => props.header ? 4 : 12}px;
    padding-left: ${props => props.UserItem ? 0 : (props.appStoreButton ? 0 : 70)}px;
    color: ${props => props.theme.palette.settingsText};
    border-top: 1px solid ${props => props.theme.palette.clrSubBorder};
    transition: all 0.2s ease;
    ${props => props.btn && `
        cursor: pointer;
        &:hover {
            background-color: ${props.theme.palette.clrSubBorder};
        }
    `}

    &:last-child {
        border-bottom: 0.25px solid ${props => props.theme.palette.clrSubBorder};
    }

    .settings-label {
        font-size: 38px;
        font-weight: 600;
        padding-left: 12px;
    }

    >  a {
        text-decoration: none;
    }
    > a :hover{
        cursor: pointer;
        text-decoration: underline;
    }

    .symbol_i {
        background: ${props => props.theme.palette.clrMouseClick};
        border-radius: 50%;
        color: ${props => props.theme.palette.clrMainWindow};
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-left: 5px;
    }

    .info-tooltip {
        align-items: center;
        justify-content: center;
    }

    > span {
        display: flex;
        align-items: center;

        &.clickable {
            cursor: pointer;
        }
    }

    > .btn_normal {
        border-radius: ${props => props.theme.palette.borderRadius};
        border: 1px solid ${props => props.theme.palette.clrSubBorder};
        background: ${props => props.theme.palette.clrBackground};
        color: ${props => props.theme.palette.clrHighContrast};
        outline: none;
        height: 31px;
        min-width: 78px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;

        &:hover {
            opacity: 0.8;
        }
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        svg, svg * {
            fill: ${props => props.theme.palette.userMenuPopupMenuItemHover} !important;
        }
    }

    &:hover {
        color: #fff;
        cursor: pointer;
        ${props => !props.noHoverAni && 'padding-left: 75px;'}
    }
    .spinner-wrapper {
        > svg {
            position: relative;
        }
    }
`;

export const AvatarWrapper = styled.div.attrs({ className: 'settings-pop-avatar-wrapper' })`
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("/img/default-avatar.png");
    background-size: contain;
    border: 2px solid;
    border-radius: 50%;
    overflow: hidden;
    // z-index: 2;

    .user-pic {
        z-index: 2;
        width: 44px;
        height: 44px;
        border: 2px solid;
    }

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
    }
`;

export const DefaultAvatar = styled.div.attrs({ className: 'settings-pop-default-avatar' })`
    position: absolute;
    width: 45px;
    height: 45px;
    background: ${props => props.color};
    color: #fff;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 0 5px;
    z-index: 1;
    border: 3px solid ${props => props.theme.palette.clrRed};

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
`;

export const AffiliateLabel = styled.div`
    color: ${props => props.theme.palette.settingsText};
    font-size: 16px;
    font-weight: 400;
    padding: 11px 25px;
`;

export const InputTextCustom = styled.input`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border: ${props => `1px solid ${props.theme.palette.clrInnerBorder}`};
    border-radius: 3px;
    padding: 9px 15px;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: 40px;
    background: ${props => props.theme.palette.clrBackground};
    font-size: 14px;
    font-weight: 700;
    line-height: 1em;
    color: ${props => props.theme.palette.clrPurple};
    outline: none;
    cursor: ${props => props.clickable ? 'pointer' : 'initial'};
    ${props => props.readOnly ? `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    ` : ''}
`;

export const InputTextGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    margin: 0;
    border: none;
    padding: 0;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: 40px;
    background: transparent;

    .settings-pop-input-addon {
        justify-content: flex-end;
        border-right: none !important;
        padding-right: 0 !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }

    input {
        flex-grow: 1;
        border-left: none !important;
        padding-left: 0 !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
`;

export const InputTextAddon = styled.div.attrs({ className: 'settings-pop-input-addon' })`
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: ${props => `1px solid ${props.theme.palette.clrInnerBorder}`};
    border-radius: 3px;
    padding: 9px 15px;
    width: min-content;
    height: 40px;
    background: ${props => props.theme.palette.clrBackground};
    font-size: 14px;
    font-weight: 700;
    line-height: 1.1em;
    color: ${props => props.theme.palette.clrPurple};
    outline: none;
`;

export const UserInfoWrapper = styled.div.attrs({ className: 'settings-user-info-wrapper' })`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: flex-start;
    color: rgb(69, 76, 115);
    font-size: 17px;
    font-weight: 700;
    padding: 17px 0;

    .user-info-top {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .user-info-bottom {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;

        .user-info-bottom-left {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: space-around;
        }

        .user-info-bottom-qr-info {
            display: flex;
            flex-direction: row;

            .user-balance-info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-right: 10px;
                padding-bottom: 40px;

                .open-link {
                    color: ${props => props.theme.palette.clrHighContrast};
                    cursor: pointer;
                }
            }
            .qrcode-info {
                .qrcode-info-text {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 120px;

                    .balance-address {
                        max-width: 100px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding: 0;
                        margin: 0 5px 0 0;
                    }
                }
            }
        }
    }

    ${props => props.isMobileDevice && `
        // flex-direction: column;
        // align-items: flex-start;
        // .affiliateContainer {
        //     flex-direction: column;
        //     align-items: flex-start;
        // }
        // .btn-wrapper {
        //     order: 2;
        // }
    `}

    .userContainer, .btn-wrapper, .affiliateContainer {
        display: flex;
        align-items: center;
        span {
            display: flex;
            margin-right: ${props => props.isMobileDevice ? '7px' : '12px'};
        }
    }

    .affiliateContainer {
        margin-top: -10px;
    }

    .levelContainer {
        margin: -5px 0 10px;
    }

    .affliate-label-wrapper, refined-address-label-wrapper {
        display: inline-flex !important;
        margin-right: 12px;
        font-size: 17px;
        span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 0;
        }
    }

    .btn-wrapper {
        display: flex;
    }
`;

export const ImageWrapper = styled.div`
    width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.palette.clrInnerBorder};
`;

export const BackIcon = () => (
    <svg className="sprite-icon arrow" role="img" aria-hidden="true">
        <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="img/sprite-basic.svg#arrow-back-2"
        />
    </svg>
);

export const BackButton = styled.button`
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px 0 0;
    padding: 0;
    border: none;
    width: 40px;
    height: 100%;
    min-height: 40px;
    background: transparent;
    cursor: pointer;
    outline: none !important;

    &:hover {
        .arrow {
            fill: ${props => props.theme.palette.contrastText};
        }
    }

    .arrow {
        width: 10px;
        height: 100%;
        fill: ${props => props.theme.palette.telegramRoomArrow};
    }
`;

export const SettingsBtn = styled.button`
    border: none;
    border-radius: ${props => props.theme.palette.borderRadius};
    background: transparent;
    // margin: 0 10px;
    // margin-left: auto;
    min-width: 78px;
    height: 31px;
    color: ${props => props.theme.palette.clrMouseClick};
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    outline: none;

    &:hover {
        color: ${props => props.theme.palette.clrHighContrast};
    }

    &:active {
        color: ${props => props.theme.palette.clrHighContrast};
    }

    &:disabled {
        color: ${props => props.theme.palette.clrMouseHover};
    }

    span {
        margin-left: 0;
    }
`;


const Svg = styled.svg`
    width: 32px;
    height: 32px;
    fill: ${props => props.theme.palette.clrPurple};
    margin-left: auto;
    cursor: pointer;
`;

export const CreditIcon = (props) => (
    <Svg {...props} viewBox="0 0 33.9 35.65">
        <path d="M33,16.71,17.2.93a3.19,3.19,0,0,0-4.5,0L4.06,9.57a3.24,3.24,0,0,0,0,4.54l1.43,1.47H8.8L5.71,12.46a.93.93,0,0,1-.25-.62.91.91,0,0,1,.25-.61l1.14-1.11,5.42,5.46h5.21l-8-8.06,4.9-4.92a.88.88,0,0,1,.6-.25.86.86,0,0,1,.6.24L31.33,18.36a.86.86,0,0,1,.24.6.88.88,0,0,1-.27.6l-.89.87v3.31L33,21.21a3.19,3.19,0,0,0,0-4.5Z" />
        <path d="M25.57,17.06H3.26A3.24,3.24,0,0,0,0,20.23v8.45H28.72V20.23a3.15,3.15,0,0,0-3.15-3.17ZM7.8,25.8a2.33,2.33,0,0,1-1.61-.64,2.31,2.31,0,0,1-3.91-1.67,2.31,2.31,0,0,1,3.91-1.67,2.34,2.34,0,0,1,1.61-.65,2.32,2.32,0,0,1,0,4.63Z" />
        <path d="M0,32.45a3.26,3.26,0,0,0,3.26,3.2H25.57a3.17,3.17,0,0,0,3.15-3.2v-.18H0Z" />
    </Svg>
);

const CloseSvgWrapper = styled.svg`
    width: 30px;
    height: 30px;
    fill: ${props => props.theme.palette.clrPurple};
    cursor: pointer;

    &:hover {
        fill: ${props => props.theme.palette.clrHighContrast};
    }
`;

export const CloseIcon = (props) => (
    <CloseSvgWrapper {...props} viewBox="0 0 12 12">
        <path
            d="M386.991,180.892l-1.1,1.1L381,177.1l-4.892,4.892-1.1-1.1L379.9,176l-4.892-4.892,1.1-1.1L381,174.9l4.892-4.892,1.1,1.1L382.1,176Z"
            transform="translate(-375 -170)"
        />
    </CloseSvgWrapper>
);
