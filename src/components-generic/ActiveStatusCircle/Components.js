import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: absolute;
    ${props => !props.isGraph ? `
        left: calc(50% - 38px);
        top: 16px;
    ` : `
        left: 10px;
        bottom: 10px;
    `};
    
    z-index: 200;
    
    svg.CircularProgressbar  {
        width: 76px;
        height: 76px;
    }
    
    .CircularProgressbar .CircularProgressbar-text {
        font-weight: 800;
    }
    
    .CircularProgressbar.Settle .CircularProgressbar-path {
        transition: stroke-dashoffset 0s ease 0s;
    }
`;
