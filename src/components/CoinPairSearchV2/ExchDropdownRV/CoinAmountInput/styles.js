import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    min-width: 150px;
`;

export const AmountInput = styled.input`
    cursor: auto;
    font-size: 40px;
    font-weight: 600;
    color: ${props => props.isLeft ? props.theme.palette.coinPairSelectHoverText2 : props.theme.palette.clrBorder};
    background: transparent;
    border: 0;
    text-align: ${props => props.isLeft ? 'right' : 'left'};
    max-width: 300px;
`;