import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    display: flex;
    width: 260px;
    align-items: center;
    height: 32px;
`
export const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

export const Selector = styled.div`
    display:flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    border: 2px solid ${props => props.theme.palette.clrBorder};
    cursor: pointer;
    padding: 0px 4px;
    input {
        width: 100%;
        background-color: ${props => props.theme.palette.clrChartBackground};
        border: none;
        outline: none;
        margin-right: 4px;
        font-size: 12px;
        color: ${props => props.theme.palette.clrBorder};
        font-weight: bold;
        &:focus{
           outline: none;
        }
        &::placeholder {
            font-weight: bold;
            color: ${props => props.theme.palette.clrBorder};
        }
    }
`;

export const DropdownWrapper = styled.div`
    position: absolute;
    margin-top: 31px;
    width: 222px;
    height: 500px;
    border: solid 1px ${props => props.theme.palette.clrBorder};
    background-color: ${props => props.theme.palette.clrChartBackground};
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

export const SelectItem = styled.div`
    position: relative; 
    width: ${props => props.width}px;
    height: 50px;
    padding: 4px 12px;    
    border-bottom: solid 1px ${props => props.theme.palette.clrBorder};
    color: ${props => props.theme.palette.clrBorder};
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 42px;

    &:hover {
        background-color: ${props => props.theme.palette.clrBorder};
        color: ${props => props.theme.palette.clrHighContrast};
        cursor: pointer;
    }
`;

export const TxtNoMatch = styled.div`
    padding: 10px;
    text-align: center;
`