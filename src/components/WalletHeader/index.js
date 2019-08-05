import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import { STORE_KEYS } from '@/stores/index';
import { languages } from '@/lib/translations/languages';
import {
    Wrapper,
    AvatarWrapper,
    LoginTextWrapper
} from './Components';
import UserAvatarComponent from '@/components/SideHeader/UserAvatarComponent';
import { getScreenInfo } from '@/utils/index';
import LanguageDropdown from '@/components-generic/SelectDropdown/LanguageDropdown';
import SMSVerification from '@/components-generic/SMSVerification2';
import UserAvatarPopupMenu from '@/components/SideHeader/UserAvatarPopupMenu';
import DesktopHeader from './DesktopHeader';

class WalletHeader extends React.Component {
    state = {
        loginMode: false
    };

    headerRef = React.createRef();

    handleLanguage = (lang) => {
        const { setLanguage } = this.props[STORE_KEYS.SETTINGSSTORE];
        setLanguage(lang);
    };

    handleLogin = () => {
        this.setState(prevState => ({
            loginMode: !prevState.loginMode,
        }));
    };

    toggleDropDown = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
                setUserDropDownOpen,
                setAppStoreDropDownOpen,
                setSettingsExchangeViewMode,
            },
        } = this.props;

        setUserDropDownOpen(!isUserDropDownOpen);
        setAppStoreDropDownOpen(false);
        setSettingsExchangeViewMode(false);
    };

    handleShowExchanges = () => {
        this.toggleDropDown();
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                setSettingsExchangeViewMode,
            },
        } = this.props;
        setSettingsExchangeViewMode(true);
    };

    render() {
        const { loginMode } = this.state;
        const {
            [STORE_KEYS.TELEGRAMSTORE]: {
                isLoggedIn, isProfileLogoExists, logoURL, setLoginBtnLocation,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                language,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
            },
            isOrderbook,
            isSeparate,
        } = this.props;

        const {
            isMobileDevice,
        } = getScreenInfo();

        const languagesArray = [];
        for (let i = 0; i < languages.length; i++) {
            languagesArray.push({
                name: languages[i].value,
                flag: languages[i].flag,
            });
        }

        return (
            <Wrapper
                isUserDropDownOpen={isUserDropDownOpen}
                isTelegram={false}
                isOrderbook={isOrderbook}
                isSeparate={isSeparate}
                isPadding={isLoggedIn && !isMobileDevice}
                ref={this.headerRef}
            >
                {!isLoggedIn && (
                    <AvatarWrapper onClick={this.handleLogin}>
                        <UserAvatarComponent toggleDropDown={this.toggleDropDown} />

                        <LoginTextWrapper>
                            <span className="login-title">
                                <FormattedMessage
                                    id="pay_app.pay_window.label_login"
                                    defaultMessage="Login"
                                />
                            </span>
                        </LoginTextWrapper>
                    </AvatarWrapper>
                )}

                {!isLoggedIn && !loginMode && (
                    <LanguageDropdown
                        value={language}
                        items={languagesArray}
                        onChange={this.handleLanguage}
                    />
                )}

                {(!isLoggedIn && loginMode) ? (
                    <SMSVerification handleBack={this.handleLogin} />
                ) : (
                    isLoggedIn && <DesktopHeader
                        isLoggedIn={isLoggedIn}
                        toggleDropDown={this.toggleDropDown}
                        onLogin={this.handleLogin}
                        isMenuOpened={isUserDropDownOpen}
                    />
                )}

                <UserAvatarPopupMenu
                    isOpenMenu={isUserDropDownOpen}
                    isLoggedIn={isLoggedIn}
                    isProfileLogoExists={isProfileLogoExists}
                    logoURL={logoURL}
                    setLoginBtnLocation={setLoginBtnLocation}
                    onClose={this.toggleDropDown}
                    onShowExchanges={this.handleShowExchanges}
                    headerRef={this.headerRef}
                />
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.EXCHANGESSTORE,
)(observer(WalletHeader));
