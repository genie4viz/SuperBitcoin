import styled from 'styled-components/macro';

export const Wrapper = styled.section`
    position: relative;
    width: 770px;
    height: 570px;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.palette.clrMainWindow};
    border: 1px solid ${props => props.theme.palette.clrBorderHover};
    border-radius: ${props => props.theme.palette.borderRadius};
    box-shadow: 0 3px 15px rgba(0, 0, 0, .5);
    color: ${props => props.theme.palette.clrMouseClick};
`;

export const Footer = styled.div`
    width: 100%;
    margin: 0;
    padding: 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: ${props => props.theme.palette.clrBackground};
    border-bottom: 1px solid ${props => props.theme.palette.clrBorderHover};
    border-radius: ${props => `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
    
    .gradient-button:last-child {
        margin-left: 15px;
    }
`;

export const Section = styled.div`
    width: 100%;
    margin-top: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .title {
        margin-bottom: 15px;
        font-weight: 600;
        color: ${props => props.theme.palette.clrPurple};
    }
    
    .ps__rail-y {
        opacity: 1 !important;
        
        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;

            &:before {
                background-color: ${props => props.theme.palette.clrPurple};
            }
        }
    }
`;

export const Block = styled.div`
    width: 100%;
    padding: 0 15px;
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;

export const Item = styled.div`
    width: 160px;
    height: 40px;
    margin-right: 15px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background: ${props => props.active ? props.theme.palette.clrBorder : 'transparent'};
    border: ${props => props.active ? `1px solid ${props.theme.palette.clrBorder}` : 'none'};
    border-radius: ${props => props.theme.palette.borderRadius};
    color: ${props => props.active ? props.theme.palette.clrHighContrast : props.theme.palette.clrBorder};
    cursor: pointer;
    
    .symbol {
        margin: 0 10px;
    }
    
    .flag {
        width: 16px;
        height: 16px;
    }
    
    &:hover {
        color: ${props => props.theme.palette.clrHighContrast};
    }
`;

export const Flag = styled.div`
    width: 16px;
    height: 11px;
    background: url('./img/flags.png') no-repeat scroll 0 0; 
    background-position: ${props => `${props.x}px ${props.y}px`} !important;
`;
