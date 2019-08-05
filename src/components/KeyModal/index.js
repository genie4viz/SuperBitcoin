import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';

import Modal from './Modal';

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000000;
    ${props => props.hoverMode ? 'pointer-events: none;' : ''}
    ${props => props.inLineMode ? 'display:none;' : ''}
`;

const KeyModal = ({
    inLineMode,
    isModalOpen,
    toggleModal,
    hoverMode,
}) => (
    ReactDOM.createPortal(
        <Wrapper
            hoverMode={hoverMode}
            inLineMode={inLineMode}
            className={
                inLineMode
                    ? (isModalOpen ? 'animate-appear' : 'animate-disappear')
                    : ''
            }
        >
            <Modal
                toggleModal={toggleModal}
                noCloseBtn
            />
        </Wrapper>,
        document.getElementById('modal'),
    )
);

export default KeyModal;
