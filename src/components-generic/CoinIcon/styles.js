import styled from 'styled-components/macro';

export const IconStyleWrapper = styled.div.attrs({ className: 'exch-dropdown__icon' })`
    width: ${props => props.size || '50'}px;
    height: ${props => props.size || '50'}px;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover !important;
    border: none;
    z-index: 1;
    ${props => props.backgroundSrc && `
        background: ${props.backgroundSrc}
    `}
    ${props => props.opacity && `
        background: ${props.opacity}
    `}
    ${props => props.insideWalletButton && `
        position: absolute;
        left: 6px;
        margin: 0 3px;
    `}
    ${props => props.fontIcon && `
        width: 16px;
        height: 16px;
    `}
    ${props => props.noIcon && `
        background: ${props.theme.tradePalette.primaryBuy};
        border-radius: 50%;
        font-weight: bold;
        color: ${props.theme.palette.contrastText};
        font-size: 12px;
    `}
`;
export const SvgIcon = styled.img`
    filter: ${props => props.filter || props.theme.palette.orderBookIconFilter};
    width: 14px;
    height: 14px;
    margin-right: 4px;
`;
export const FontIcon = styled.span`
    filter: ${props => props.filter};
    font-size: ${props => props.fontSize ? `${props.fontSize}px` : '16px'};
    margin-right: 4px;
`;
export const StockImg = styled.img`
    src: ${props => props.backgroundSrc};
    width: 100%;
    height: 100%;
    border-radius: 50%;
`;
