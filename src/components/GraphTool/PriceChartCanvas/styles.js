import styled from 'styled-components/macro';

export const ChartWrapper = styled.div`
    position: relative;
    height: 100%;
    border-radius: ${props => props.theme.palette.borderRadius};
    border-style: solid;
    border-color: ${props => props.theme.palette.clrBorder};
    border-width: 1px 0 1px 1px;
    cursor: crosshair;
    z-index: 3;
`;

export const ChartInfoWrapper = styled.div`
    position: absolute;
    right: 100px;
    bottom: 50px;
`;

export const ChartCanvasWrapper = styled.div`
    height: 100%;
`;
