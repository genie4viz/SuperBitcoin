import styled from 'styled-components';

export const NotificationWrapper = styled.div.attrs({ className: 'notification-wrapper' })`
  position: fixed;
  top: -100%;
  left: 0;
  width: 100vw;
  min-height: 70px;
  padding: 1rem;
  background-color: #3269D1;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: top 2s;

  ${props => props.status === 'start' && `
    top: 0 !important;
  `};

  ${props => props.status === 'end' && `
    top: -100% !important;
  `};
`;

export const NotificationText = styled.div.attrs({ className: 'notification-text' })`
  color: white;
  font-size: 18px;
  font-family: 'Exo 2', sans-serif;  
`;
