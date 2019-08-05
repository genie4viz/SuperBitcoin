import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';

import { getItemColor } from '../../utils';
import { STORE_KEYS } from '../../stores';
import { AvatarWrapper, DefaultAvatar } from '../SideBar/NewSettingsPop/Components';
import AvatarImage from './AvatarImage';

const Wrapper = styled.div.attrs({ className: 'user-avatar-wrapper' })`
    position: relative;
    display: flex;
    justify-content: center;
    margin: 0;
    border: none;
    padding: 0;
    width: 60px;
`;

export const ImageWrapper = styled.div.attrs({ className: 'user-avatar-component' })`
    width: 60px;
    height: 100%;
    min-height: min-content;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @media (max-width: 768px) {
        img {
            width: 50px !important;
            height: 50px !important;
        }
    }
    
    .login-title {
        position: absolute;
        text-overflow: ellipsis;
        left: 30px;
        bottom: 3px;
        z-index: 99;
        padding: 2px;
        background-color: ${props => props.isLoggedIn ? props.theme.palette.clrRed : '#444872'};
        border: 1px solid ${props => props.isLoggedIn ? props.theme.palette.clrRed : '#444872'};
        border-radius: ${props => props.theme.palette.borderRadius};
        font-size: 10px;
        line-height: 1;
        letter-spacing: 0.2px;
        color: ${props => props.theme.palette.clrHighContrast};
        text-transform: uppercase;
        text-align: center;
        pointer-events: none;
        overflow: hidden;
        transform: translateX(calc(-50% + 2px));
    }

    .user-avatar-component {
        position: absolute;
    }

    .login-title {
        bottom: 7px;
    }
`;

class UserAvatarComponent extends React.Component {
    componentDidMount() {

    }

    render() {
        const {
            [STORE_KEYS.TELEGRAMSTORE]: {
                isLoggedIn,
                loggedInUser,
                logoURL,
                isProfileLogoExists,
            },
            isMobile,
            toggleDropDown,
        } = this.props;

        let symbolName = '';
        let userName = '';
        if (isLoggedIn && loggedInUser) {
            const {
                firstname,
                lastname,
            } = loggedInUser;

            if (firstname && firstname.length > 0) { symbolName = firstname[0]; }
            if (lastname && lastname.length > 0) { symbolName += lastname[0]; }

            userName = loggedInUser.username;
        }

        return (
            <Wrapper>
                {isLoggedIn ? (
                    <ImageWrapper onClick={toggleDropDown} isMobile={isMobile}>
                        <AvatarWrapper>
                            <DefaultAvatar color={getItemColor(userName).hexColor}>
                                {symbolName.toUpperCase()}
                            </DefaultAvatar>

                            {isProfileLogoExists && (
                                <img
                                    alt=""
                                    className="user-pic"
                                    src={logoURL}
                                />
                            )}
                        </AvatarWrapper>
                    </ImageWrapper>
                ) : (
                    <AvatarImage />
                )}
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.VIEWMODESTORE,
)(observer(UserAvatarComponent));
