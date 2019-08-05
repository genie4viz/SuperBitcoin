import styled  from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const Content = styled.div`
    flex: 1;
    display: flex;
    width: 100%;
`;

export const WrapperHeader = styled.div`
    width: 100%;
    height: 32px;
    background: ${props => props.theme.palette.clrMainWindow};
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;