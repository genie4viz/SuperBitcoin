import React from 'react';
import styled from 'styled-components/macro';

import x from './x.svg';

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
    z-index: 50;
    box-shadow: -1px 1px 5px 0px rgba(0,0,0,0.75);

    &:hover {
        cursor: pointer;
        filter: brightness(110%);
    }

    &:focus {
        outline: none;
    }
`;

const Icon = styled.img`
    width: 11px;
    height: 11px;
`;

// chart area
const DefaultWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0 15px 40px;
    z-index: 999999;
    background: rgba(0,0,0,0.735);
    /* if additionalVerticalSpace then get to account that separate div added at the bottom */
    border-radius: ${props => props.additionalVerticalSpace
        ? `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`
        : `${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0 0`};
`;

const RightSectionWrapper = styled(DefaultWrapper)`
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    // @media (max-width: 1300px) {
    //     left: calc(85px + 25%);
    // }
`;

const LeftLowerSectionModalWrapper = styled(DefaultWrapper)`
    padding: 0 !important;
    border-radius: 0;
`;

const InnerWrapper = styled.div`
    position: relative;
    z-index: 9999999; // Higher than vertical spaces
`;

const handleClick = onClose => ({ target: { dataset } }) => {
    if (dataset && dataset.zone === 'modal-wrapper') {
        onClose();
    }
};

const VerticalSpace = styled(DefaultWrapper)`
    width: 100%;
    height: 55%;
    top: 100%;
    border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
`;

const VerticalSpaceTop = styled(DefaultWrapper)`
    width: 100%;
    height: 55%;
    top: -55%;
    border-radius: ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0 0;
`;

const Modal = ({
    open,
    onClose,
    onConfirm,
    ModalComponentFn,
    location,
    additionalVerticalSpace,
    showClose = true,
    ...props
}) => {
    // can be extracted to HOC/render props/etc.
    return (
        location === 'graph-chart-parent' ? (
            <DefaultWrapper
                {...props}
                open={open}
                onClose={onClose}
                onClick={handleClick(onClose)}
                data-zone="modal-wrapper"
                additionalVerticalSpace={additionalVerticalSpace}
            >
                <InnerWrapper>
                    {showClose && (
                        <Close onClick={onClose}>
                            <Icon src={x}/>
                        </Close>
                    )}

                    {ModalComponentFn({
                        open,
                        onClose,
                        onConfirm,
                    })}
                </InnerWrapper>

                {additionalVerticalSpace && (
                    <React.Fragment>
                        <VerticalSpace data-zone="modal-wrapper"/>
                        <VerticalSpaceTop data-zone="modal-wrapper"/>
                    </React.Fragment>
                )}
            </DefaultWrapper>
        ) : location === 'left-lower-section'
            ? (
                <LeftLowerSectionModalWrapper
                    {...props}
                    data-zone="modal-wrapper"
                >
                    {showClose && (
                        <Close onClick={onClose}>
                            <Icon src={x} />
                        </Close>
                    )}

                    {ModalComponentFn({
                        open,
                        onClose,
                        onConfirm,
                    })}
                </LeftLowerSectionModalWrapper>
            )
            : (
                <RightSectionWrapper
                    {...props}
                    open={open}
                    onClose={onClose}
                    onClick={handleClick(onClose)}
                    data-zone="modal-wrapper"
                    additionalVerticalSpace={additionalVerticalSpace}
                >
                    <InnerWrapper>
                        {showClose && (
                            <Close onClick={onClose}>
                                <Icon src={x} />
                            </Close>
                        )}

                        {ModalComponentFn({
                            open,
                            onClose,
                            onConfirm,
                        })}
                    </InnerWrapper>

                    {additionalVerticalSpace && (
                        <React.Fragment>
                            <VerticalSpace data-zone="modal-wrapper" />
                            <VerticalSpaceTop data-zone="modal-wrapper" />
                        </React.Fragment>
                    )}
                </RightSectionWrapper>
            )
    );
};

export default Modal;
