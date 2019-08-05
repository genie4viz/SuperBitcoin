import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';

import GradientButton from '../../components-generic/GradientButtonSquare';

const OuterWrapper = styled.section`
    background-color: ${props => props.theme.palette.clrMainWindow};
    color: ${props => props.theme.palette.clrHighContrast};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 12px;
    width: calc(100vw - 30px);
    max-width: 360px;
    height: 200px;
    box-shadow: 0 3px 10px 5px rgba(0, 0, 0, .52);
`;

const InnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const TextDescription = styled.span`
    margin-top: 20px;
    width: 100%;
    text-align: center;
    color: ${props => props.theme.palette.clrHighContrast};
    font-size: 25px;
    font-weight: normal;
`;

const ButtonWrappers = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 40px;
    width: 100%;
    
    button {
        &:first-child {
            margin: 0 10px 0 auto;
        }
        &:last-child {
            margin: 0 auto 0 10px;
        }
    }
`;

const Content = ({ toggleModal, onLogout }) => (
    <OuterWrapper>
        <InnerWrapper>
            <TextDescription>
                <FormattedMessage
                    id="modal.logout.label_confirm"
                    defaultMessage="Are you sure to logout?"
                />
            </TextDescription>

            <ButtonWrappers>
                <GradientButton
                    className="primary-solid"
                    width={120}
                    height={40}
                    onClick={toggleModal}
                >
                    <FormattedMessage
                        id="modal.logout.button_cancel"
                        defaultMessage="Cancel"
                    />
                </GradientButton>

                <GradientButton
                    className="primary-solid"
                    width={120}
                    height={40}
                    onClick={onLogout}
                >
                    <FormattedMessage
                        id="modal.logout.button_logout"
                        defaultMessage="Log out"
                    />
                </GradientButton>
            </ButtonWrappers>
        </InnerWrapper>
    </OuterWrapper>
);

export default Content;
