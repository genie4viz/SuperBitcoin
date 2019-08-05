import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    &.hide {
        display: none;
    }
`;

export const HeaderWrapper = styled.div`
    position: absolute;
    width: calc(100% - 40px);
    height: 74px;
    top: calc(22.7% - 24px);
    left: 20px;
    margin: 0 auto;
    border: 1.51px solid white;
    border-radius: 37px;
    box-shadow: 0 0 5.03px rgb(206, 206, 206);
    background: black;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: ${props => props.justify ? 'center' : 'initial'};

    img {
        width: 74px;
        height: auto;
        padding: 18px;
        cursor: pointer;
    }
`;

export const ContentWrapper = styled.div`
    flex: 1 1 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    margin: 0;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
`;

export const ImageWrapper = styled.div.attrs({ className: 'avatar-image-wrapper' })`
    width: 33px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.palette.clrBorder};
`;

export const AvatarWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    background-image: url("/img/default-avatar.png");
    background-size: contain;
    overflow: hidden;
    z-index: 2;
    
    .user-pic {
        z-index: 2;
        width: 33px;
        height: 33px;
    }
`;

export const DefaultAvatar = styled.div`
    position: absolute;
    width: 33px;
    height: 33px;
    background: ${props => props.color};
    color: #fff;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    min-width: 33px;
    min-height: 33px;
    margin: 0 0 5px;
    z-index: 1;
`;

export const List = styled.div`
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    
    .settings-pop-header {
        display: none;
    }
    
    .settings-pop-modal {
        border: 0;
    }
`;

export const TableWrapper = styled.div`
    // width: ${props => props.width}px;
    // height: ${props => props.height}px;

    .ps__rail-y {
        background-color: ${props => props.theme.palette.clrBackground} !important;
        border-left: 1px solid ${props => props.theme.palette.mobile2HistoryItemBorder};
        opacity: 1 !important;
        
        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;

            &:before {
                background-color: ${props => props.theme.palette.mobile2HistoryItemBorder};
            }
        }
    }

    .ReactVirtualized__Table__rowColumn {
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        text-overflow: inherit;
        overflow: visible !important;
        
        &:last-child {
            border-right: 0;
            padding-right: 15px;
        }
    }
    
    .ReactVirtualized__Table__row {
        border-bottom: 1px solid ${props => props.theme.palette.mobile2HistoryItemBorder};
        overflow: visible !important;
    }
    
    .ReactVirtualized__Table__Grid {
        outline: none !important;
    }
`;

export const HistoryCell = styled.div`
    position: relative;
    display: flex;
    margin: 0;
    padding: 15px 25px;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    
    .avatar-image-wrapper {
        border: none !important;
    }
`;

export const NoDataText = styled.span`
    align-self: center;
    margin: auto;
    border: none;
    padding: 0;
    width: 100%;
    font-size: 17px;
    font-weight: normal;
    color: ${props => props.theme.palette.clrGray};
    line-height: 1em;
    text-align: center;
    padding: 30px;
    border-bottom: 2px solid grey;
`;

export const TransactionInfo = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: normal;
    margin: 0;
    border: none;
    padding: 15px 0 15px 10px;
    overflow: hidden;
`;

export const TransactionTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 0 6px;
    border: none;
    padding: 0;
    font-size: 14px;
    font-family: 'Exo 2', sans-serif;
    font-weight: normal;
    color: ${props => props.theme.palette.clrHighContrast};
    line-height: 1em;
    text-align: left;
`;

export const TransactionDate = styled.div`
    display: flex;
    border: none;
    padding: 0;
    font-size: 10px;
    font-family: 'Exo 2', sans-serif;
    font-weight: normal;
    color: ${props => props.theme.palette.clrLightGray};
    line-height: 1em;
    text-align: left;

    svg {
        fill: ${props => props.theme.palette.clrGray};
        transform: translate(0px, 1px);
    }
    
    > span {
        flex: 1;
    }
    
    > button {
        display: ${props => !props.isPending ? 'none' : 'block'};
        background: transparent;
        border: 0;
        color: ${props => props.theme.palette.clrLightGray};
        font-size: 10px;
        cursor: pointer;
        outline: none;
        padding: 0 0 1px 0;
    }
    
    > .status {
        flex: 0 0 auto;
        margin-left: auto;
        color: ${props => props.isCanceled ? props.theme.palette.clrGray : props.theme.palette.clrHighContrast};
        display: ${props => props.isPending ? 'none' : 'block'};
    }
`;

export const TransactionAmount = styled.div`
    align-items: center;
    justify-content: flex-end;
    margin: 0 0 0 auto;
    border: none;
    padding: 0 0 0 5px;
    font-size: 14px;
    font-weight: normal;
    font-family: 'Exo 2', sans-serif;
    color: ${props => props.theme.palette.clrHighContrast};
    line-height: 1em;
    text-align: right;
    display: inline;
    text-decoration: ${props => props.isCanceled ? 'line-through' : ''};
    
    &.clr-green {
        color: ${props => props.theme.palette.clrHighContrast} !important;
    }
    
    &.clr-red {
        color: ${props => props.theme.palette.clrGray} !important;
    }
`;

export const LoadingWrapper = styled.div`
    flex: 1 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

export const InnerWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 75%;
    max-height: 356px;
    background-color: black;
    border: solid 1.69px white;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    top: calc(22.7% + 50px);
    left: 50%;
    transform: translateX(-50%);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
`;

export const InfoItem = styled.div`
    width: 100%;
    height: 70px;
    padding: 10px;
    display: ${props => props.isVisible ? 'flex' : 'none'};
    border-bottom: 2px solid grey;
    font-size: 24px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    ${props => props.isActive ? `
        border-bottom: 1px solid ${props.theme.palette.clrBorder};
    ` : ''};
    .photo{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-image: url('/img/user.jpeg');
        background-repeat: round;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .info-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 210px;
        height: 40px;
        .prefix{
            display: inline-flex;
        }
        .circleText{
            width: 40px;
            height: 40px;
            border-radius: 100%;
            background-color: #4080FF;
            color: white;
            text-align: center;
            margin-right: 10px;
            display: flex;
    
            &.transparent {
                background-color: transparent;
                img {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                }
                canvas {
                    margin: auto;
                }
            }
        }
        .circleContent{
            margin: auto;
        }
        .containerText{
            justify-content: center;
            display: flex;
            flex-direction: column;
        }
        .titleText{
            color: white;
            font-size: 16px;
    
            img {
                margin-left: 5px;
            }
        }
        .amountText{
            color: white;
            font-size: 16px;

            &.long{
                font-size: 10px;
                transform: scale(1, 1.2);
            }
        }
        .descText{
            color: grey;
            font-size: 12px;
            font-weight: 400;
            // text-align: right;
        }
        .grey {
            color: grey !important;
        }
    
        &:first-child {
            margin-top: 0.5rem !important;
        }
    }
`;

export const Item = styled.div`
    height: 80px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 2px solid grey;
    font-size: 24px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    ${props => props.isActive ? `
        border-bottom: 1px solid ${props.theme.palette.clrBorder};
    ` : ''};
  `;

const CloseSvg = styled.svg`
    width: 20px;
    height: 20px;

    & * {
        fill: ${props => props.theme.palette.clrPurple};
    }
`;

export const CloseIcon = props => (
    <CloseSvg {...props} viewBox="0 0 9.38 9.38">
        <path transform="rotate(135 4.694 4.692)" d="M-1.38 4.13h12.14v1.13H-1.38z" />
        <path transform="rotate(45 4.687 4.691)" d="M-1.38 4.13h12.14v1.13H-1.38z" />
    </CloseSvg>
);

const ArrowSvg = styled.svg`
    position: absolute;
    width: 40px;
    height: 40px;
    padding: 10px;
    margin-top: 15px;
    fill: grey;
    pointer: cursor;
    transform: rotate(-90deg);
`;

export const ArrowIcon = props => (
    <ArrowSvg viewBox="0 0 284.929 284.929" {...props}>
        <path
            d="M282.082 195.285L149.028 62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665.953-6.567 2.856L2.856 195.285C.95 197.191 0 199.378 0 201.853c0 2.474.953 4.664 2.856 6.566l14.272 14.271c1.903 1.903 4.093 2.854 6.567 2.854s4.664-.951 6.567-2.854l112.204-112.202 112.208 112.209c1.902 1.903 4.093 2.848 6.563 2.848 2.478 0 4.668-.951 6.57-2.848l14.274-14.277c1.902-1.902 2.847-4.093 2.847-6.566.001-2.476-.944-4.666-2.846-6.569z"
        />
    </ArrowSvg>
);

const OpenArrowSvg = styled.svg`
    width: 20px;
    height: 12px;
    transform: rotateZ(-90deg);
    
    &, & * {
        fill: ${props => props.theme.palette.clrPurple} !important;
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

export const InnerList = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .ps__rail-y {
        width: 0;
    }
`;

export const AmountRow = styled.div`
    margin: 0 0 15px 0;
    text-align: center;
    width: 100%;
    font-family: 'Exo 2', sans-serif;
    font-size: 60px;
    font-weight: 600;
    color: white;
`;
