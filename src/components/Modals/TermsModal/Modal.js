import React from 'react';
import Content from './Content';
import {
    ModalWrapper,
    ModalInnerWrapper,
    Close,
    Icon,
} from './styles';
import x from '@/components-generic/Modal/x.svg';

const Modal = ({ noCloseBtn, text, isLoading, toggleModal }) => {
    const handleInnerWrapperClick = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleCloseClick = e => {
        e.preventDefault();
        e.stopPropagation();
        toggleModal();
    }

    return (
        <ModalWrapper>
            <ModalInnerWrapper
                onClick={handleInnerWrapperClick}
            >
                {!noCloseBtn && (
                    <Close
                        onClick={handleCloseClick}
                    >
                        <Icon src={x} />
                    </Close>
                )}
                <Content text={text} isLoading={isLoading} />
            </ModalInnerWrapper>
        </ModalWrapper>
    );
}

export default Modal;
