import React, { PureComponent, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import AvatarImage from '@/components/SideHeader/AvatarImage';
import { Wrapper, AvatarWrapper, Title, Dropdown, DoubleArrow } from './Components';
import { animateButton } from '@/utils/CustomControls';
import { STORE_KEYS } from '@/stores';
import CoinPairSearchV2 from '@/components/CoinPairSearchV2';

class DesktopHeader extends PureComponent {
    handleToggleMenu = () => {
        animateButton('threeDotIcon');
        this.props.toggleDropDown();
    };

    getUserTooltip = () => {
        const {
            accessLevel,
            defaultURL
        } = this.props[STORE_KEYS.SETTINGSSTORE];

        const ownerId = localStorage.getItem('authClientId');

        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumberFromString(localStorage.getItem('phoneNumber'));
            phoneNumber = phoneNumber.formatInternational();
        } catch (e) {
            phoneNumber = '';
        }

        const tooltip =
            <Dropdown>
                User ID: {ownerId}<br />
                Access Level: {accessLevel}<br />
                Phone Number: {phoneNumber}<br />
                Affiliate URL: {defaultURL}/{ownerId}<br />
            </Dropdown>
        return tooltip
    }

    render() {
        const { isLoggedIn, isMenuOpened } = this.props;
        return (
            <Wrapper isMenuOpened={isMenuOpened} isLoggedIn={isLoggedIn}>
                <AvatarWrapper>
                    <AvatarImage id="threeDotIcon" onClick={this.handleToggleMenu} />
                    {this.getUserTooltip()}
                </AvatarWrapper>

                {isMenuOpened &&
                    <Fragment>
                        <DoubleArrow onClick={this.props.toggleDropDown} />
                        <Title>
                            <FormattedMessage
                                id="settings.label_settings"
                                defaultMessage="Settings"
                            />
                        </Title>
                    </Fragment>
                }
                {!isMenuOpened && <CoinPairSearchV2 isSearch />}
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.SETTINGSSTORE
)(observer(DesktopHeader));
