import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const Header = styled.div`
    height: 32px;
    background-color: ${props => props.theme.palette.clrChartBackground};
    border-bottom: 1px solid ${props => props.theme.palette.clrSubBorder};
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
`;

export const CanvasWrapper = styled.div`
    position: relative;
    flex: 1;
`;