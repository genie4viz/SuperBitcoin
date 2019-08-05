import React from 'react';
import styled from 'styled-components/macro';
import x from '../../components-generic/Modal/x.svg';
import Content from './Content';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4000 !important;
    background: rgba(0,0,0,0.435);
    border-radius: ${props => props.theme.palette.borderRadius};
`;

const InnerWrapper = styled.div`
    position: relative;
`;

const handleClick = onClose => ({ target: { dataset } }) => {
    if (dataset && dataset.zone === 'terms-modal') {
        onClose();
    }
};

const Close = styled.button`
    border-radius: 50%;
    border: 0;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    background-color: ${props => props.theme.palette.modalCloseBackground};
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 21px;
    height: 21px;
    cursor: pointer;
    z-index: 1;

    &:hover {
        filter: brightness(110%);
    }

    &:focus {
        outline: none;
    }
`;

const Icon = styled.img`
    width: 50%;
    height: 50%;
`;

const Modal = ({ toggleModal, noCloseBtn }) => (
    <Wrapper onClick={handleClick(toggleModal)}>
        <InnerWrapper>
            {!noCloseBtn &&
            <Close onClick={toggleModal}>
                <Icon src={x}/>
            </Close>
            }
            <Content/>
        </InnerWrapper>
    </Wrapper>
);

export default Modal;
