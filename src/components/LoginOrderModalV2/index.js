import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';
// import isMobile from 'is-mobile';

import TelegramLogin from '../TelegramLogin';
import { STORE_KEYS } from '../../stores';
import imgX from '../../components-generic/Modal/x.svg';

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, .435);
    z-index: 1000000; // made higher than wallet table
`;

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid ${props => props.theme.palette.clrBorderHover};
    border-radius: ${props => props.theme.palette.borderRadius};
    // width: ${props => props.width ? `${props.width}px`   : '500px'};
    width: calc(100% - 40px);
    max-width: 500px;
    height: 415px;
    margin: 0 20px;
    background-color: ${props => props.theme.palette.clrMainWindow};
    box-shadow: 0 3px 15px rgba(0, 0, 0, .5);
    color: ${props => props.theme.palette.clrMouseClick};
`;

const Title = styled.h2`
    margin: 0 0 30px;
    padding: 0;
    font-size: 19px;
    font-weight: bold;
    color: ${props => props.theme.palette.clrHighContrast};
    line-height: 1em;
    text-align: center;
`;

const ExclamationMarkSvg = styled.svg`
    margin: 0 0 30px;
    width: 155px;
    height: 155px;

    path {
        fill: ${props => props.theme.palette.clrBlue} !important;
    }
`;

export const ExclamationMark = () => (
    <ExclamationMarkSvg viewBox="0 0 286.054 286.054">
        <g>
            <path
                d="M143.027,0C64.04,0,0,64.04,0,143.027c0,78.996,64.04,143.027,143.027,143.027 c78.996,0,143.027-64.022,143.027-143.027C286.054,64.04,222.022,0,143.027,0z M143.027,259.236 c-64.183,0-116.209-52.026-116.209-116.209S78.844,26.818,143.027,26.818s116.209,52.026,116.209,116.209 S207.21,259.236,143.027,259.236z M143.036,62.726c-10.244,0-17.995,5.346-17.995,13.981v79.201c0,8.644,7.75,13.972,17.995,13.972 c9.994,0,17.995-5.551,17.995-13.972V76.707C161.03,68.277,153.03,62.726,143.036,62.726z M143.036,187.723 c-9.842,0-17.852,8.01-17.852,17.86c0,9.833,8.01,17.843,17.852,17.843s17.843-8.01,17.843-17.843 C160.878,195.732,152.878,187.723,143.036,187.723z"
            />
        </g>
    </ExclamationMarkSvg>
);

const Close = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 0;
    padding: 0;
    width: 21px;
    height: 21px;
    transform: translate(50%, -50%);
    background-color: ${props => props.theme.palette.telegramLoginControlAddonColor};
    z-index: 11;

    &:hover {
        cursor: pointer;
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


class LoginOrderModalV2 extends Component {
    state = {};

    closePopup = () => {
        const {
            [STORE_KEYS.TELEGRAMSTORE]: { setLoginBtnLocation },
        } = this.props;
        setLoginBtnLocation(false);
    };

    render() {
        const {
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
        } = this.props;

        const {
            isLoggedIn,
            loginBtnLocation,
        } = telegramStore;

        const isVisible = !isLoggedIn && loginBtnLocation;

        // const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        // const width = Math.max((screenWidth - 15) / 4, 390);
        // const isMobileBrowser = isMobile({ tablet: true }) ? screenWidth < screenHeight : false;

        return (
            isVisible && <LoginWrapper>
                <Wrapper>
                    <ExclamationMark/>

                    <Title>
                        <FormattedMessage
                            id="modal.login_order_v2.label_login"
                            defaultMessage="Please Sign Up or Log In"
                        />
                    </Title>

                    {loginBtnLocation && (
                        <TelegramLogin width={205} height={55}/>
                    )}

                    <Close onClick={this.closePopup}>
                        <Icon src={imgX}/>
                    </Close>
                </Wrapper>
            </LoginWrapper>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE
)(observer(LoginOrderModalV2));
