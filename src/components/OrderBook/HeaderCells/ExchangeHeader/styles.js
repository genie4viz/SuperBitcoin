import styled from 'styled-components/macro';

export const Button = styled.button`
    padding: 0 0 0 12px;
    background: none;
    border: none;
    color: ${props => props.theme.palette.orderBookTableCellText};
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    outline: none;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        cursor: pointer;
        filter: brightness(110%);
    }
`;
