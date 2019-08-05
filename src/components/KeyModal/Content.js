import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';

import imgYubiKey from './yubi-key.svg';

const OuterWrapper = styled.section`
    background-color: ${props => props.theme.palette.clrMainWindow};
    color: ${props => props.theme.palette.clrHighContrast};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 12px;
    width: 420px;
    height: 360px;
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

const ImgKey = styled.img`
    width: 280px;
    height: 140px;
    margin-bottom: 30px;
`;

const TextDescription = styled.span`
    width: 100%;
    text-align: center;
    color: ${props => props.theme.palette.clrHighContrast};
    font-size: 25px;
    font-weight: normal;
`;

const Content = () => (
    <OuterWrapper>
        <InnerWrapper>
            <ImgKey src={imgYubiKey}/>

            <TextDescription>
                <FormattedMessage
                    id="modal.key.label_description1"
                    defaultMessage="Please insert your"
                />
                <br/>
                <FormattedMessage
                    id="modal.key.label_description2"
                    defaultMessage="Hardware Key now."
                />
            </TextDescription>
        </InnerWrapper>
    </OuterWrapper>
);

export default Content;
