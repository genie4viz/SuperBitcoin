import styled, { keyframes } from 'styled-components/macro';
import { withElementWithIdDimensions } from '../../../hocs/withElementWithIdDimensions';

export const ExchDropdownList = withElementWithIdDimensions(styled.div.attrs({ className: 'exch-drop-list' })`
    height: ${props => props.itemCount === 0 ? 100 : props.objHeight - 1}px;

    .exch-dropdown__list__rvtable-wrapper {
        height: ${props => props.itemCount === 0 ? 100 : props.objHeight - 1}px;
    }

    .no-match {
        font-size: 25px;
        color: ${props => props.theme.palette.coinPairSelectText2};
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 100%;
        height: 100%;
        padding: 5px 0;
    }
`, 'right-top');

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height}px;

    .ps__thumb-y {
        opacity: 0 !important;
        z-index: 9999;
        cursor: pointer;
    }

    .ReactVirtualized__Table__rowColumn {
        margin-left: 0;
        text-overflow: inherit;
        overflow: initial !important;
    }

    .ReactVirtualized__Table__row {
        overflow: visible !important;

        .ReactVirtualized__Table__rowColumn {
            &:last-child {
                margin-right: 0;
            }
        }
    }

    .ReactVirtualized__Table__Grid {
        outline: none !important;
        box-shadow: 7px 6px 11px rgba(0, 0, 0, .05);
    }

    .addon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: stretch;
        padding: 0 15px;
        height: 60px;
        width: 100%;
    }
`;

export const AddonWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    align-items: center;

    .DemoLabel{
        font-size: 11px;
        position: absolute;
        top: 20%;
        padding: 2px;
        left: 0;
        // height: 13px;
        z-index: 100;
        font-weight: 700;
        color: white;
        background: red;
    }
`;

export const ItemButtonWrapper = styled.div`
    position: relative;
    min-height: 70px;
    display: flex;
    align-items: center;
    

    .phone-number-input svg, .code-input svg{
        min-height: 36px;
    }
    .right-side-exch-deposit-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const ItemButton = styled.button`
    padding-right: ${props => props.isActive ? '20px !important' : '30px'};
    flex: 1;
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder} !important;
    .exch-dropdown__title {
        text-align: left;
        width: 100%;
        white-space: nowrap;
        display: inline-flex;

    }
`;

export const CoinAmountInput = styled.input.attrs({className: 'exch-dropdown__current' })`
    font-size: 40px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrBorder };
    background: transparent;
    border: 0;
    text-align: right;
    max-width: 200px;
    cursor: ${props => props.isAUMSelected ? 'default' : 'text'};
    &:hover {
        color: ${props => props.theme.palette.coinPairSelectHoverText2};
    }
`;


export const CoinItemWrapper = styled.div.attrs({ className: 'exch-dropdown__current' })`
    width: 100%;
    height: 100%;
    padding: 0 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all .1s;
    font-size: 13px;
    color: ${props => props.theme.palette.coinPairSelectText2};

    &>div {
        cursor: auto;
    }

    .exch-dropdown__title__wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .exch-dropdown__title {
        font-size: 13px;
        color: ${props => props.theme.palette.coinPairSelectText2};

        span {
            font-size: 40px;
            font-weight: 600;
            color: ${props => (props.isAUMSelected || props.disableHover) ? props.theme.palette.clrBorder : props.theme.palette.coinPairSelectHoverText2} !important;
        }
    }

    .exch-dropdown__title__coin2 {
        display: flex;
        align-items: center;
    }
`;

export const CurrencyName = styled.div`
    font-size: 40px;
    font-weight: 600;
    color: ${props => props.theme.palette.coinPairSelectText2};
    background: transparent;
    border: 0;
    padding: 0 12px;
`;

export const CoinInputSymbol = styled.span`
    font-size: 40px;
    font-weight: 600;
    color: ${props => props.theme.palette.coinPairSelectHoverText2};
`

export const Wedge = styled.div.attrs({ className: 'exch-dropdown__wedge' })`
    width: 15px;
    height: 100%;
    z-index: 1;
    background: rgb(2, 5, 24);
    flex-shrink: 0;
    position: absolute;
    right: 0px;
    top: 0px;
`;

const slidingCoinNameFrame = marqueeWidth => keyframes`
    0% { left: 0; }
    100% { left: ${(0 - marqueeWidth)}%; }
`;

export const SlidingCoinNameItem = styled.div`
    display: inline-flex;
    width: 465px;
    height: 70px;
    position: absolute;
    top: 20px;
    right: 0px;
    padding-left: 20px;
    overflow: hidden;

    & > div:nth-child(1) {
        width: ${props => props.marqueeWidth * 2}%;
        position: absolute;
        height: 70px;
        overflow: hidden;
        display: none;
        animation: ${props => slidingCoinNameFrame(props.marqueeWidth)} 6s linear infinite;
    }

    & > div:nth-child(2) {
        display: block;
    }

    & > div > span {
        font-size: 30px;
        font-weight: 500;
        float: left;
        width: 50%;
    }

    .coin-name__wrapper {
        width: calc(100% - 30px);

        & > span {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
`;

export const AumCustomImg = styled.img`
    width: 37px;
    height: 37px;
    object-fit: cover;
`;
