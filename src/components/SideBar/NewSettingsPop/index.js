import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';
import { FormattedMessage } from 'react-intl';

import SwitchCustom from '../../../components-generic/SwitchCustom';
import InputCustom from '../../../components-generic/InputCustom';
import {
    accessLevels, swaps,
    c2s, autoFlips, sliders
} from './mock';
import { languages } from '../../../lib/translations/languages';
import {
    Modal, Header, List, Item,
    InputTextCustom,
    UserInfoWrapper, SettingsBtn,
    ImageWrapper, CloseIcon
} from './Components';
import {
    autoConvertOptions
} from '@/stores/SettingsStore';
// import { St } from '../icons';
import { STORE_KEYS } from '@/stores';
import { SETTING_TIPPY_INFO } from '@/config/constants';
import {
    format7DigitString, formatNegativeNumber
} from '@/utils';
import PerfectScrollWrapper from '../../../components-generic/PerfectScrollWrapper';
import SendCoinsModal from '../../SendCoinsModal';
import SeedWordsModal from '../../SeedWordsModal';
// import TopSwitch from '../../TopSwitch';
import SelectDropdown from '../../../components-generic/SelectDropdown';
import CurrencySelectDropdown from '../../../components-generic/SelectDropdown/CurrencySelectDropdown';
import { viewModeKeys, settingsViewModeKeys } from '../../../stores/ViewModeStore';
import AvatarImage from '../../SideHeader/AvatarImage';
import LanguageCurrencyModal from '../../Modals/LanguageCurrencyModal';

const showLanguageCurrencyModal = (Modal, onClose, portal, additionalVerticalSpace) => () => {
    return Modal({
        portal,
        additionalVerticalSpace,
        ModalComponentFn: () => <LanguageCurrencyModal portal={portal} onClose={onClose} />,
    });
};

class NewSettingsPop extends Component {
    state = {
        isAutoPayBCT: false,
    };

    componentDidMount() {
        // document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        // document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.modalRef && !this.modalRef.contains(event.target)) {
            this.props.toggle();
        }
    };

    handleLanguage = (lang) => {
        // this.props.toggleKeyModal(true);
        const { setLanguage } = this.props[STORE_KEYS.SETTINGSSTORE];
        setLanguage(lang);
    };

    handleChangeAutoPayBCT = () => {
        this.props.toggleKeyModal();
        this.props.toggle();

        this.setState(prevState => ({
            isAutoPayBCT: !prevState.isAutoPayBCT,
        }));
    };

    handleResetBalance = () => {
        this.props[STORE_KEYS.YOURACCOUNTSTORE].resetDemoBalances();
        this.props[STORE_KEYS.YOURACCOUNTSTORE].resetWalletTableState();
        // this.props[STORE_KEYS.SETTINGSSTORE].setShortSellWith(false);
        this.props[STORE_KEYS.CONVERTSTORE].gotoFirstState();
        this.props[STORE_KEYS.INSTRUMENTS].setBase('BTC');
        this.props[STORE_KEYS.INSTRUMENTS].setQuote('USDT');
        this.props[STORE_KEYS.SETTINGSSTORE].resetBalance();
    };

    logOutAccount = () => {
        this.props[STORE_KEYS.SMSAUTHSTORE].forceCleanStorage();
    };

    setAccessLevel = (accessLevel) => {
        const { referredBy, setAccessLevel } = this.props[STORE_KEYS.SETTINGSSTORE];
        const { Modal } = this.props[STORE_KEYS.MODALSTORE];

        if (accessLevel !== 'Level 1') {
            Modal({
                portal: 'graph-chart-parent',
                ModalComponentFn: () => (
                    <SendCoinsModal
                        coin="USDT"
                        name={referredBy}
                        user={{
                            name: referredBy,
                        }}
                        onFinish={() => {
                            setAccessLevel(accessLevel);
                        }}
                    />
                ),
            });
        } else {
            setAccessLevel(accessLevel);
        }
    };

    handleViewSeedWords = () => {
        const { Modal } = this.props[STORE_KEYS.MODALSTORE];
        Modal({
            portal: 'graph-chart-parent',
            ModalComponentFn: () => (
                <SeedWordsModal isShow={true} isBackUp={true} />
            ),
        });
    };

    setRealTradingWith = () => {
        const { setRealTrading } = this.props[STORE_KEYS.SETTINGSSTORE];
        const { isLoggedIn } = this.props[STORE_KEYS.TELEGRAMSTORE];
        if (isLoggedIn) {
            setRealTrading();
        } else {
            console.log('Login with Telegram');
        }
    };

    render() {
        const { toggleKeyModal } = this.props;
        const {
            isLoggedIn, loggedInUser,
        } = this.props[STORE_KEYS.TELEGRAMSTORE];
        const {
            isShortSell, isRealTrading, defaultURL, isGoogle2FA,
            setShortSell, setDefaultURL,
            setPortfolioIncludesBct, portfolioIncludesBct,
            accessLevel,
            privateVpn, setPrivateVpn,
            referredBy, setReferredBy,
            language,
            isAutoConvert, setIsAutoConvert,
            swap, setSwap,
            c2, setC2,
            autoFlip, setAutoFlip,
            slider, setSlider,
        } = this.props[STORE_KEYS.SETTINGSSTORE];

        const { setViewMode, setSettingsOpen, settingsViewMode } = this.props[STORE_KEYS.VIEWMODESTORE];

        // -----
        let fullName = '';
        if (isLoggedIn && loggedInUser) {
            const {
                firstname,
                lastname,
            } = loggedInUser;

            if (firstname && firstname.length > 0) {
                symbolName = firstname[0];
            }
            if (lastname && lastname.length > 0) {
                symbolName += lastname[0];
            }

            userName = loggedInUser.username;
            fullName = `${firstname} ${lastname}`;
        }

        // -----
        const isBackendTelLogin = localStorage.getItem('authToken');
        const languagesArray = [];
        for (let i = 0; i < languages.length; i++) {
            languagesArray.push(languages[i].value);
        }

        // ------
        const { storeCredit } = this.props[STORE_KEYS.YOURACCOUNTSTORE];
        const { Modal: ModalPopup, onClose } = this.props[STORE_KEYS.MODALSTORE];
        const storeCreditStr = formatNegativeNumber(format7DigitString(storeCredit)).replace('+', '');

        return (
            <Modal
                ref={ref => {
                    this.modalRef = ref;
                }}
            >
                <Header>
                    {isBackendTelLogin ? (
                        <UserInfoWrapper>
                            <ImageWrapper onClick={() => setViewMode(viewModeKeys.basicModeKey)}>
                                <CloseIcon
                                    onClick={() => {
                                        setSettingsOpen(false);
                                        setViewMode(viewModeKeys.basicModeKey);
                                    }}
                                />
                            </ImageWrapper>
                        </UserInfoWrapper>
                    ) : (
                        <Fragment>
                            <AvatarImage onClick={() => setViewMode(viewModeKeys.basicModeKey)} />
                            <span>
                                <FormattedMessage
                                    id="settings.label_settings"
                                    defaultMessage="Settings"
                                />
                            </span>
                        </Fragment>
                    )}
                </Header>

                <List>
                    <PerfectScrollWrapper scrollTop={false}>
                        {settingsViewMode === settingsViewModeKeys.privacyList && (
                            <React.Fragment>
                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_demomode"
                                            defaultMessage="Demo Mode"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.DEMO_MODE}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <button
                                        className="btn_reset"
                                        onClick={this.handleResetBalance}
                                    >
                                        <FormattedMessage
                                            id="settings.btn_reset"
                                            defaultMessage="Reset"
                                        />
                                    </button>
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_real_trading"
                                            defaultMessage="Real Trading (Level1 Access)"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.REAL_TREADING}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <SwitchCustom
                                        checked={isRealTrading}
                                        onChange={this.setRealTradingWith}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_access_level"
                                            defaultMessage="Access Level"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.ACCESS_LEVEL}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>

                                    <SelectDropdown
                                        width={180}
                                        value={accessLevel}
                                        items={accessLevels}
                                        isSearchable={false}
                                        alignTop={false}
                                        onChange={this.setAccessLevel}
                                        // onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_language"
                                            defaultMessage="Language"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.LANGUAGE}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>

                                    <SelectDropdown
                                        width={180}
                                        value={language}
                                        items={languagesArray}
                                        alignTop={false}
                                        onChange={this.handleLanguage}
                                        onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                                    />
                                    {/*
                                    <InputTextCustom
                                        width={180}
                                        value={language}
                                        readOnly
                                        clickable
                                        onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                                    />
                                    */}
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_default_fiat"
                                            defaultMessage="Default Fiat"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.DEFAULT_FIAT}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>

                                    <CurrencySelectDropdown
                                        width={180}
                                        height={200}
                                        type="fiat"
                                        onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_default_crypto"
                                            defaultMessage="Default Crypto"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.DEFAULT_CRYPTO}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>

                                    <CurrencySelectDropdown
                                        width={180}
                                        height={200}
                                        type="crypto"
                                    />
                                </Item>
                            </React.Fragment>
                        )}

                        {settingsViewMode === settingsViewModeKeys.affiliateList && (
                            <React.Fragment>
                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_default_url"
                                            defaultMessage="Default URL"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.DEFAULT_URL}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <InputTextCustom
                                        // readOnly
                                        width={180}
                                        value={defaultURL}
                                        onChange={setDefaultURL}
                                        readOnly
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_referred_by"
                                            defaultMessage="Referred by"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.REFERRED_BY}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <InputTextCustom
                                        width={180}
                                        value={referredBy}
                                        onChange={setReferredBy}
                                        readOnly
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <span>
                                            <FormattedMessage
                                                id="settings.label_affiliate_link"
                                                defaultMessage="Affiliate Link"
                                            />
                                        </span>

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.AFFILIATE_LINK}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <InputCustom
                                        width={180}
                                    />
                                </Item>
                            </React.Fragment>
                        )}

                        {settingsViewMode === settingsViewModeKeys.advancedList && (
                            <React.Fragment>
                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_slider"
                                            defaultMessage="Slider"
                                        />
                                        <span className="symbol_i">i</span>
                                    </span>
                                    <SelectDropdown
                                        width={180}
                                        value={slider}
                                        items={sliders}
                                        alignTop={false}
                                        isSearchable={false}
                                        onChange={setSlider}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_auto_flip"
                                            defaultMessage="Auto Flip"
                                        />
                                        <span className="symbol_i">i</span>
                                    </span>
                                    <SelectDropdown
                                        width={180}
                                        value={autoFlip}
                                        items={autoFlips}
                                        isSearchable={false}
                                        onChange={setAutoFlip}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_c2s"
                                            defaultMessage="C2"
                                        />
                                        <span className="symbol_i">i</span>
                                    </span>
                                    <SelectDropdown
                                        width={180}
                                        value={c2}
                                        items={c2s}
                                        isSearchable={false}
                                        onChange={setC2}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_swaps"
                                            defaultMessage="Swap"
                                        />
                                        <span className="symbol_i">i</span>
                                    </span>
                                    <SelectDropdown
                                        width={180}
                                        value={swap}
                                        items={swaps}
                                        isSearchable={false}
                                        onChange={setSwap}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_is_auto_convert"
                                            defaultMessage="Auto Convert"
                                        />
                                        <span className="symbol_i">i</span>
                                    </span>

                                    <SelectDropdown
                                        width={180}
                                        value={isAutoConvert}
                                        items={Object.values(autoConvertOptions)}
                                        isSearchable={false}
                                        onChange={setIsAutoConvert}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_12words"
                                            defaultMessage="12-word phrase"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.WORD12_PHRASE}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <button
                                        className="btn_normal"
                                        onClick={this.handleViewSeedWords}
                                    >
                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="left"
                                            followCursor
                                            theme="bct"
                                            title="Your Access is Restricted to Level 1"
                                        >
                                            <FormattedMessage
                                                id="settings.btn_view"
                                                defaultMessage="View"
                                            />
                                        </Tooltip>
                                    </button>
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_store_credit"
                                            defaultMessage="Store Credit"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={`Your Store Credit: ${storeCreditStr}`}
                                            // title={SETTING_TIPPY_INFO.STORE_CREDIT}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <SwitchCustom
                                        checked={isShortSell}
                                        onChange={isRealTrading ? toggleKeyModal : setShortSell}
                                        onMouseLeave={() => {
                                            this.props.toggleKeyModal(false);
                                        }}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_balance_includes_credit"
                                            defaultMessage="Balance includes Credit"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.BALANCE_CREDIT}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <SwitchCustom
                                        checked={portfolioIncludesBct}
                                        // onChange={toggleKeyModal}
                                        onChange={setPortfolioIncludesBct}
                                        onMouseLeave={() => {
                                            this.props.toggleKeyModal(false);
                                        }}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_private_vpn"
                                            defaultMessage="Private VPN"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.PRIVATE_VPN}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <SwitchCustom
                                        checked={privateVpn}
                                        onChange={setPrivateVpn}
                                        // readOnly
                                        // onMouseEnter={() => { this.props.toggleKeyModal(true); }}
                                        onMouseLeave={() => {
                                            this.props.toggleKeyModal(false);
                                        }}
                                    />
                                </Item>

                                <Item>
                                    <span>
                                        <FormattedMessage
                                            id="settings.label_google_2fa"
                                            defaultMessage="Google 2FA"
                                        />

                                        <Tooltip
                                            arrow={true}
                                            animation="shift"
                                            position="right"
                                            theme="bct"
                                            title={SETTING_TIPPY_INFO.GOOGLE_2FA}
                                        >
                                            <span className="symbol_i">i</span>
                                        </Tooltip>
                                    </span>
                                    <SwitchCustom
                                        checked={isGoogle2FA}
                                        // onChange={toggleKeyModal}
                                        // onChange={setGoogle2FA}
                                        // onMouseLeave={() => { this.props.toggleKeyModal(false); }}
                                    />
                                </Item>

                                {isBackendTelLogin && (
                                    <Item>
                                        <span className="fullName">{fullName}</span>
                                        <SettingsBtn onClick={this.logOutAccount}>
                                            <FormattedMessage
                                                id="settings.btn_logout"
                                                defaultMessage="Logout"
                                            />
                                        </SettingsBtn>
                                    </Item>
                                )}
                            </React.Fragment>
                        )}

                        {/*
                        <Item>
                            <span>Auto Payback BCT</span>
                            <SwitchCustom
                                checked={isAutoPayBCT}
                                onChange={this.handleChangeAutoPayBCT}
                                readOnly
                                onMouseEnter={() => { this.props.toggleKeyModal(true); }}
                                onMouseLeave={() => { this.props.toggleKeyModal(false); }}
                            />
                        </Item>
                        <Item>
                            <span>
                                <FormattedMessage
                                    id="settings.label_trading_history"
                                    defaultMessage="Trading History"
                                />
                                <span className="symbol_i">i</span>
                            </span>
                            <Tooltip
                                arrow={true}
                                animation="shift"
                                // position="bottom"
                                followCursor
                                theme="bct"
                                title="Your Access is Restricted to Level 1"
                            >
                                <SwitchCustom
                                    checked={isExporting}
                                    // onChange={toggleKeyModal}
                                    // onChange={setExportTrading}
                                    // onMouseLeave={() => { this.props.toggleKeyModal(false); }}
                                />
                            </Tooltip>
                        </Item>
                        <Item>
                            <span>
                                <FormattedMessage
                                    id="settings.label_default_currency"
                                    defaultMessage="Default Currency"
                                />
                                <span className="symbol_i">i</span>
                            </span>
                            <CurrencySelectDropdown
                                width={180}
                                height={200}
                                type="currency"
                                onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                            />
                        </Item>
                        <Item>
                            <span>
                                <FormattedMessage
                                    id="settings.label_default_channel"
                                    defaultMessage="Default Channel"
                                />
                                <span className="symbol_i">i</span>
                            </span>
                            <InputTextGroup width={180}>
                                <InputTextAddon>
                                    t.me/
                                </InputTextAddon>
                                <InputTextCustom
                                    value={defaultTelegram}
                                    onChange={setDefaultTelegram}
                                />
                            </InputTextGroup>
                        </Item>
                        */}
                    </PerfectScrollWrapper>
                </List>
            </Modal>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.CONVERTSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.SMSAUTHSTORE
)(observer(NewSettingsPop));
