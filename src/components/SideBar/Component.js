import React from 'react';
import styled from 'styled-components/macro';

export const SideBarWrapper = styled.div.attrs({ className: 'sidebar-wrapper' })`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 55px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${props => props.theme.palette.sidebarBackground};
    // border-right: 1px solid ${props => props.theme.palette.clrBorder};
    z-index: 9999999;
    transform: ${props => props.isHover ? 'none' : 'translateX(-54px)'};
    // Make sidebar always open
    // transform: translateX(-54px);
    transition: 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    // &:hover {
    //     transform: translateX(0) !important;
    //
    //     .items-wrapper {
    //         box-shadow: 3px 0 10px 0 rgba(0, 0, 0, 0.4);
    //         z-index: 1;
    //     }
    //
    //     .arrow-wrapper {
    //         transform: translateX(15px);
    //     }
    // }
`;

export const Head = styled.div`
    width: 100%;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
`;

export const ImageWrapper = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
        svg {
            fill: ${props => props.theme.palette.clrHighContrast};
        }
    }
`;

export const Wrapper = styled.div`
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 76px;
    // bottom: 0;
    // height: ${props => props.height}px;
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;

    button,
    a {
        pointer-events: all !important;
    }
`;

export const Top = styled.div`
    height: 250px;
    padding: 4px 0;
`;

export const TopBarItemWrapper = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
    margin: 7px;
    z-index: 100;
    
    // ${props => props.toggleAble ? `
    //     > .top-bar__item:after {
    //         content: '';
    //         position: absolute;
    //         right: 0;
    //         bottom: 0;
    //         width: 0;
    //         height: 0;
    //         border-style: inset;
    //         border-width: 0 0 6px 6px;
    //         border-color: transparent transparent ${props.theme.palette.sidebarIconActive} transparent;
    //         transform: rotate(360deg);
    //     }
    // ` : ''}
`;

export const TopBarItem = styled.div.attrs({ className: 'top-bar__item' })`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => (props.opened || props.active) ? props.theme.palette.sidebarIconOpenedBg : 'transparent'};
    cursor: ${props => props.isClickable ? 'pointer' : 'auto'};
    
    &:hover {
        &:after {
            border-color: transparent transparent ${props => props.theme.palette.clrHighContrast} transparent !important;
        }
        
        .top-bar__icon {
            fill: ${props => props.theme.palette.clrHighContrast};
        }
    }
    
    .top-bar__icon {
        fill: ${props => (props.current || props.active) ? props.theme.palette.sidebarIconActive : props.theme.palette.sidebarIcon};
    }
`;

export const TopBarItemPopup = styled.div`
    position: absolute;
    left: calc(100% + 7px);
    top: 0;
    height: 40px;
    display: flex;
    padding: 2px;
    background: ${props => props.theme.palette.sidebarBackground};
    width: 1000px;
    padding-left: 8px;
    
    .top-bar__item {
        width: 36px;
        height: 36px;
        
        &:not(:last-child) {
            margin-right: 20px;
        }
    }
`;

export const TopText = styled.div`
    padding: 30px 0;
    flex: 1;
    font-weight: 600;
    color: ${props => props.theme.palette.clrBorder};
`;

export const TextfitWrapper = styled.div`
    width: ${props => props.height}px;
    height: ${props => props.width}px;
    text-align: center;
    letter-spacing: 3px;
    transform: translateX(-${props => (props.height - props.width) / 2}px) translateY(${props => (props.height - props.width) / 2}px) rotate(-90deg);
    transform-origin: center;
    
    > div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export const Middle = styled.div`
    padding: 4px 0;
    // border-top: 1px solid ${props => props.theme.palette.clrBorder};

    .nav-bar__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 5px 2px;
        width: 100%;
        // height: 50px;
        margin: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        text-decoration: none;

        &.btn {
            height: 62px;
        }

        &:hover,
        &.active {
            .nav-bar__title {
                color: ${props => props.theme.palette.sidebarIconTitleActive};
            }

            .nav-bar__icon {
                fill: ${props => props.theme.palette.sidebarIconActive};
            }
        }
    }

    .nav-bar__icon {
        display: block;
        flex: 0 0 17px;
        margin: 3px auto 4px;
        width: 17px;
        height: 17px;
        fill: ${props => props.theme.palette.sidebarIcon};

        &.reload {
            fill: ${props => props.theme.palette.sidebarIcon};
            width: 35px;
            height: 35px;
            flex: 0 0 35px;
        }
    }

    .nav-bar__title {
        margin: 0 auto;
        font-family: open_sans_condensed, sans-serif;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        color: ${props => props.theme.palette.sidebarIconTitle};
        text-align: center;
    }
`;

export const Bottom = styled.div`
    margin-top: auto;

    .user-bar__btn {
        display: block;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        cursor: pointer;
        outline: none;
        // border-top: 1px solid ${props => props.theme.palette.clrBorder};

        &:hover {
            .user-bar__icon {
                fill: ${props => props.theme.palette.sidebarIconActive};
            }
        }
    }

    .user-bar__icon {
        width: 32px;
        height: 32px;
        margin: 10px 0;
        fill: ${props => props.theme.palette.sidebarIcon};
    }
`;

export const AdditionalButton = styled.button``;

export const Separator = styled.div`
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    height: 1px;
    margin-top: 10px;
`;

const Svg = styled.svg`
    width: 32px;
    height: 32px;
    fill: ${props => props.theme.palette.clrPurple};
`;

export const CreditIcon = (props) => (
    <Svg {...props} viewBox="0 0 33.9 35.65">
        <path d="M33,16.71,17.2.93a3.19,3.19,0,0,0-4.5,0L4.06,9.57a3.24,3.24,0,0,0,0,4.54l1.43,1.47H8.8L5.71,12.46a.93.93,0,0,1-.25-.62.91.91,0,0,1,.25-.61l1.14-1.11,5.42,5.46h5.21l-8-8.06,4.9-4.92a.88.88,0,0,1,.6-.25.86.86,0,0,1,.6.24L31.33,18.36a.86.86,0,0,1,.24.6.88.88,0,0,1-.27.6l-.89.87v3.31L33,21.21a3.19,3.19,0,0,0,0-4.5Z" />
        <path d="M25.57,17.06H3.26A3.24,3.24,0,0,0,0,20.23v8.45H28.72V20.23a3.15,3.15,0,0,0-3.15-3.17ZM7.8,25.8a2.33,2.33,0,0,1-1.61-.64,2.31,2.31,0,0,1-3.91-1.67,2.31,2.31,0,0,1,3.91-1.67,2.34,2.34,0,0,1,1.61-.65,2.32,2.32,0,0,1,0,4.63Z" />
        <path d="M0,32.45a3.26,3.26,0,0,0,3.26,3.2H25.57a3.17,3.17,0,0,0,3.15-3.2v-.18H0Z" />
    </Svg>
);
