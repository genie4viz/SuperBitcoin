import styled from 'styled-components/macro';

export const ChartWrapper = styled.div`
    position: absolute;
    ${props => props.isBorderHidden && 'border: none !important;'}
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.palette.clrChartBackground};
    border-radius: ${props => props.theme.palette.borderRadius};
    border-style: solid;
    border-color: ${props => props.theme.palette.clrBorder};
    border-width: 1px 0 1px 1px;
    ${props => props.noBorder && 'border: none !important;'}
    cursor: crosshair;
`;

export const PortfolioLabels = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 18px;
    font-size: 33px;
    font-weight: 400;
    
    > svg {
        cursor: pointer;
        margin-left: 12px;
        margin-bottom: 5px;
        &:hover {
            fill: white;
        }
    }
`;

export const ChartInfoWrapper = styled.div`
    position: absolute;
    left: 12px;
    right: 75px;
    bottom: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
`;

export const GraphControlWrapper = styled.div`
    display: flex;
    align-items: center;
`;
