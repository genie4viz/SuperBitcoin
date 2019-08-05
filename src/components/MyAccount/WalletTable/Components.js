import styled  from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    height: 100%;
    flex: 1;
    overflow: hidden;
`;

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height}px;

    .ps__thumb-y {
        opacity: 0 !important;
        z-index: 9999;
        cursor: pointer;
    }

    .ReactVirtualized__Table__rowColumn {
        flex: 1 !important;
        height: 100%;
        margin-left: 0;
        margin-right: 0;
        text-overflow: inherit;
        overflow: initial !important;
    }

    .ReactVirtualized__Table__row {
        overflow: visible !important;
        pointer-events: none;

        .ReactVirtualized__Table__rowColumn {
            pointer-events: auto;
            &:last-child {
                margin-right: 0;
            }
        }
        &:hover {
            background: ${props => props.theme.palette.clrMouseClick};
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

export const Item = styled.div`
    position: relative;
    height: 100%;
    display: flex;
    background: transparent;
    align-items: center;
    justify-content: ${props => props.isFirstCell ? 'space-between' : 'flex-end'};
    border-bottom: 1px solid ${props => props.theme.palette.orderFormBorder}7f;
    padding: 10px;
    font-size: 26px;
    font-weight: 500;
    /* transition: background-color 0.5s ease; */

    /* &:hover {
        cursor: pointer;
        background: ${props => props.theme.palette.clrMouseClick};
    } */

    .symbol {
        display: flex;
        span {
            padding-left: 10px;
        }
        div:first-of-type {
            border: ${props => props.isEOS ? '2px solid white' : 'none'};
        }
    }

    .symbol.first-cell {
        span {
            width: 105px;
        }
    }

    .element {
        display: flex;
        align-items: center;
    }

    .element.right {
        justify-content: flex-end;
        color: ${props => props.theme.palette.clrPurple};
        span {
            font-size: 30px;
            color: ${props => props.theme.palette.portfolioUSDIconColor};
        }
        .symbol {
            display: flex;
            width: auto;
            span {
                padding-left: 0px;
                padding-right: 0px;
            }
            img {
                width: 20px;
                height: 20px;
            }
        }
    }

    .equal {
        display: flex;
        padding-right: 15px;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        text-align: center;
        color: ${props => props.theme.palette.clrPurple};
    }
`;
