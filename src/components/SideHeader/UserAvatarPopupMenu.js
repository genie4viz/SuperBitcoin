import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '@/stores';
import { SETTING_TIPPY_INFO } from '@/config/constants';
import { format7DigitString, formatNegativeNumber, getScreenInfo, customDigitFormat } from '@/utils';
import { InputTextCustom, Item } from '@/components/SideBar/NewSettingsPop/Components';
import {
    AddressInput,
    BottomMenuWrapper,
    Code,
    DepositQRCode,
    DropdownMenu,
    DropdownMenuItem,
    DropdownWrapper,
    LanguageWrapper,
    OpenArrow,
    PageButtonsWrapper,
    ReportItem,
    TransferSection,
} from './Components';
import DesktopHeader from '@/components/WalletHeader/DesktopHeader';
import PerfectScrollWrapper from '@/components-generic/PerfectScrollWrapper';
import {
    SettingsAdvancedIcon,
    SettingsAffiliateIcon,
    SettingsDemoTradeIcon,
    SettingsExchangesIcon,
    SettingsHelpDeskIcon,
    SettingsLiveTradeIcon,
    SettingsPreferencesIcon,
    SettingsPrivacyIcon,
    SettingsReportsIcon,
    SettingsTransferIcon,
} from './icons';
import SelectDropdown from '@/components-generic/SelectDropdown';
import { SearchInput } from '@/components-generic/SelectDropdown/Components';
import { accessLevels, defaultCurrencies, timerList } from '../SideBar/NewSettingsPop/mock';
import SwitchCustom from '@/components-generic/SwitchCustom';
import { languages } from '@/lib/translations/languages';
import KeyModal from '../KeyModal';
import CurrencySelectDropdown from '@/components-generic/SelectDropdown/CurrencySelectDropdown';
import LanguageDropdown from '@/components-generic/SelectDropdown/LanguageDropdown';
import ForexDropdown from '@/components-generic/SelectDropdown/ForexDropdown';
import GradientButton from '@/components-generic/GradientButtonSquare';
import SeedWordsModal from '../SeedWordsModal';
import ExchangeListComponent from './ExchangeListComponent';
import CollapseComponent from './CollapseComponent';
import TradingButton from './TradingButton';
import TermsModal from '../Modals/TermsModal';
import Google2FAModal from '../Google2FAModal';
import Spinner from '@/components-generic/Spinner';

import { MODE_KEYS } from '@/components/OrderHistoryAdv/Constants';
import { animateButton } from '@/utils/CustomControls';
import LogoutModal from '@/components/LogoutModal';

const SETTINGS_ITEMS = {
    ADVANCED: 'setting-advanced',
    AFFILIATE: 'setting-affiliate',
    DEPOSIT_WITHDRAW: 'setting-deposit-withdraw',
    EXCHANGES: 'setting-exchanges',
    HELPDESK: 'setting-helpdesk',
    PREFERENCES: 'setting-preferences',
    PRIVACY: 'setting-privacy',
    REPORTS: 'setting-reports',
};

class UserAvatarPopupMenu extends React.Component {
    state = {
        isGoogle2FAModalOpen: false,
        isLogoutModalOpen: false,
        isKeyModalOpen: false,
        openedSettings: null,
        page: null,
        searchValue: '',
        tooltipWidth: window.innerWidth,
        isOpenMenu: this.props.isOpenMenu
    };

    searchValueRef = React.createRef();

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props[STORE_KEYS.SMSAUTHSTORE].getTwoFAStatus();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isOpenMenu !== nextProps.isOpenMenu) {
            return {
                openedSettings: null,
                isOpenMenu: nextProps.isOpenMenu
            };
        }

        return {};
    }

    handleClickOutside = event => {
        const { isGoogle2FAModalOpen, page } = this.state;
        const { headerRef, isOpenMenu } = this.props;

        if (
            isOpenMenu &&
            headerRef.current &&
            !headerRef.current.contains(event.target) &&
            !isGoogle2FAModalOpen &&
            !page
        ) {
            this.setState({ openedSettings: null });
            this.props.onClose(false);
        }
    };

    handlePageOpen = (pageId = null) => () => this.handlePageToggle(pageId);

    handlePageToggle = (pageId = null) => {
        this.setState({ page: pageId });
    };

    handleLogin = e => {
        e.preventDefault();

        this.props.setLoginBtnLocation(true);
        this.props.onClose();
    };

    toggleGoogle2FAModal = isForceOpen => {
        this.setState(prevState => ({
            isGoogle2FAModalOpen: isForceOpen || !prevState.isGoogle2FAModalOpen
        }));
    };

    handleToggleGoogle2FA = () => {
        this.toggleGoogle2FAModal(true);
    };

    submitGoogleToken = () => {
        this.toggleGoogle2FAModal();
    };

    handleLanguage = lang => {
        // this.props.toggleKeyModal(true);
        const {
            [STORE_KEYS.SETTINGSSTORE]: { setLanguage },
            [STORE_KEYS.MODALSTORE]: { onClose }
        } = this.props;
        setLanguage(lang);
        // close LanguageCurrencyModal manually
        onClose();
    };

    handleInputChange = key => event => {
        switch (key) {
            case 'withdrawAddress':
                this.props[STORE_KEYS.SETTINGSSTORE].setWithdrawAddress(event.target.value);
                break;
            default:
                break;
        }
    };

    toggleKeyModal = isKeyModalOpen => {
        this.setState(prevState => ({
            isKeyModalOpen: typeof isKeyModalOpen === 'boolean' ? isKeyModalOpen : !prevState.isKeyModalOpen
        }));
    };

    setAccessLevel = accessLevel => {
        const { setAccessLevel } = this.props[STORE_KEYS.SETTINGSSTORE];
        setAccessLevel(accessLevel);
    };

    setDefaultCurrency = defaultCurrency => {
        const { setDefaultCurrencySetting } = this.props[STORE_KEYS.SETTINGSSTORE];
        setDefaultCurrencySetting(defaultCurrency);
    };

    handleViewSeedWords = () => {
        const { Modal } = this.props[STORE_KEYS.MODALSTORE];
        Modal({
            portal: 'graph',
            ModalComponentFn: () => <SeedWordsModal isShow isBackUp />
        });
    };

    /**
     * @description handler for settings menu
     * @param {string} name setting menu name e.g. Exchanges, Advacned, Affiliate.....
     */
    handleMenuCollapseClicked = name => () => {
        this.setState(prevState => ({
            openedSettings: prevState.openedSettings === name ? null : name,
            searchValue: ''
        }));
        animateButton(name);
    };

    /**
     * @description handler for report settings switches.
     * @param {string} reportName name of report section to be switched
     */
    handleReportClick = reportName => () => {
        this.props[STORE_KEYS.SETTINGSSTORE].setActiveReports(reportName);
        animateButton(reportName);
    };

    setRealTradingWith = () => {
        const { setRealTrading } = this.props[STORE_KEYS.SETTINGSSTORE];
        const { isLoggedIn } = this.props[STORE_KEYS.TELEGRAMSTORE];
        if (isLoggedIn) {
            setRealTrading();
        } else {
            console.log('Login with Telegram');
        }
        this.toggleDropDown();
    };

    handleChangeSearchValue = e => {
        e.stopPropagation();
        this.setState({ searchValue: e.target.value }, () => {
            this.searchValueRef.current && this.searchValueRef.current.focus();
        });
    };

    toggleDropDown = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE]: { isUserDropDownOpen, setUserDropDownOpen },
        } = this.props;
        setUserDropDownOpen(!isUserDropDownOpen);
    };

    onShowTooltip = ({ target }) => {
        const clientWidth = window.innerWidth;
        if (clientWidth > 768) {
            return;
        }

        const rect = target.getBoundingClientRect();
        this.setState({ tooltipWidth: clientWidth - rect.right - 10 });
    };

    getTooltip = (tooltipText, props = {}) => {
        const { tooltipWidth } = this.state;

        return (
            <Tooltip
                arrow
                animation="shift"
                position="right"
                theme="bct"
                useContext
                html={<div style={{ maxWidth: tooltipWidth }}>{tooltipText}</div>}
                popperOptions={{
                    modifiers: {
                        preventOverflow: { enabled: false },
                        flip: { enabled: false },
                        hide: { enabled: false }
                    }
                }}
                {...props}
            >
                <span className="symbol_i" onClick={this.onShowTooltip} role="button" tabIndex={0}>
                    i
                </span>
            </Tooltip>
        );
    };

    stopPropagation = e => {
        e.stopPropagation();
    };

    handleResetBalance = e => {
        e.stopPropagation();
        this.props[STORE_KEYS.YOURACCOUNTSTORE].resetDemoBalances();
        this.props[STORE_KEYS.ORDERHISTORY].resetOrderHistory();
        this.toggleDropDown();
    };

    handleLogout = () => {
        this.props[STORE_KEYS.SMSAUTHSTORE].forceCleanStorage();
        this.toggleLogoutModal();
    };

    toggleLogoutModal = () => {
        this.setState(prevState => ({ isLogoutModalOpen: !prevState.isLogoutModalOpen }));
    };

    renderAdvancedSettings = isOpened => {
        const {
            [STORE_KEYS.YOURACCOUNTSTORE]: { storeCredit },
            [STORE_KEYS.SETTINGSSTORE]: {
                isShortSell,
                isRealTrading,
                setPortfolioIncludesBct,
                portfolioIncludesBct,
                privateVpn,
                setPrivateVpn,
                timer,
                setTimer,
                defaultForex,
                setDefaultForex,
                setShortSell,
            }
        } = this.props;
        const storeCreditStr = formatNegativeNumber(format7DigitString(storeCredit)).replace('+', '');

        return (
            <CollapseComponent expanded={isOpened}>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_store_credit" defaultMessage="Store Credit" />
                        {this.getTooltip(`Your Store Credit: ${storeCreditStr}`)}
                    </span>
                    <SwitchCustom
                        checked={isShortSell}
                        onChange={isRealTrading ? this.toggleKeyModal : setShortSell}
                        onMouseLeave={() => {
                            this.toggleKeyModal(false);
                        }}
                    />
                </Item>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_balance_includes_credit" defaultMessage="Balance includes Credit" />
                        {this.getTooltip(SETTING_TIPPY_INFO.BALANCE_CREDIT)}
                    </span>
                    <SwitchCustom
                        checked={portfolioIncludesBct}
                        // onChange={this.toggleKeyModal}
                        onChange={setPortfolioIncludesBct}
                        onMouseLeave={() => {
                            this.toggleKeyModal(false);
                        }}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage id="settings.label_12words" defaultMessage="12-word phrase" />
                        {this.getTooltip(SETTING_TIPPY_INFO.WORD12_PHRASE)}
                    </span>
                    <button className="btn_normal" onClick={this.handleViewSeedWords}>
                        <Tooltip
                            arrow
                            animation="shift"
                            position="left"
                            followCursor
                            theme="bct"
                            title="Your Access is Restricted to Level 1"
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false },
                                }
                            }}
                        >
                            <FormattedMessage id="settings.btn_view" defaultMessage="View" />
                        </Tooltip>
                    </button>
                </Item>

                <Item>
                    <span>
                        <FormattedMessage id="settings.label_private_vpn" defaultMessage="Private VPN" />
                        {this.getTooltip(SETTING_TIPPY_INFO.PRIVATE_VPN)}
                    </span>
                    <SwitchCustom
                        checked={privateVpn}
                        onChange={setPrivateVpn}
                        onMouseLeave={() => {
                            this.toggleKeyModal(false);
                        }}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage id="settings.forex_profit_margin" defaultMessage="Forex Profit Margin" />
                        {this.getTooltip(SETTING_TIPPY_INFO.FOREX_PROFIT_MARGIN)}
                    </span>
                    <ForexDropdown width={180} value={defaultForex} isSearchable={false} onChange={setDefaultForex} />
                </Item>
                <Item>
                    <span>
                        <FormattedMessage id="settings.timer" defaultMessage="Timer (seconds)" />
                        {this.getTooltip(SETTING_TIPPY_INFO.TIMER)}
                    </span>
                    <Tooltip
                        arrow
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="Your level is not allowed to change this"
                        popperOptions={{
                            modifiers: {
                                preventOverflow: { enabled: false },
                                flip: { enabled: false },
                                hide: { enabled: false }
                            }
                        }}
                    >
                        <SelectDropdown
                            width={180}
                            value={timer}
                            items={timerList}
                            alignTop
                            onChange={setTimer}
                        />
                    </Tooltip>
                </Item>
            </CollapseComponent>
        )
    };

    renderPrivacySettings = isOpened => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: { isGoogle2FA, isGet2FA },
            [STORE_KEYS.SETTINGSSTORE]: { isEmail2FA},
        } = this.props;

        return (
            <CollapseComponent expanded={isOpened}>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_google_2fa" defaultMessage="Google 2FA" />
                        {this.getTooltip(SETTING_TIPPY_INFO.GOOGLE_2FA)}
                    </span>
                    {isGet2FA ? (
                        <div className="spinner-wrapper">
                            <Spinner />
                        </div>
                    ) : (
                            <SwitchCustom checked={isGoogle2FA} onChange={this.handleToggleGoogle2FA} />
                        )}
                </Item>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_email_2fa" defaultMessage="Email 2FA" />
                        {this.getTooltip(SETTING_TIPPY_INFO.EMAIL_2FA)}
                    </span>
                    {isGet2FA ? (
                        <div className="spinner-wrapper">
                            <Spinner />
                        </div>
                    ) : (
                            <SwitchCustom checked={isEmail2FA} />
                        )}
                </Item>
            </CollapseComponent>
        );
    };

    renderPreferencesSettings = isOpened => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: {isRealTrading, accessLevel, isDefaultCrypto }
        } = this.props;
        const defaultCurrency = isDefaultCrypto ? 'Crypto' : 'Fiat';

        return (
            <CollapseComponent expanded={isOpened}>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_real_trading" defaultMessage="Real Trading (Level1 Access)"
                        />
                        {this.getTooltip(SETTING_TIPPY_INFO.REAL_TREADING)}
                    </span>
                    <SwitchCustom checked={isRealTrading} onChange={this.setRealTradingWith} />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage id="settings.label_access_level" defaultMessage="Access Level" />
                        {this.getTooltip(SETTING_TIPPY_INFO.ACCESS_LEVEL)}
                    </span>
                    <SelectDropdown
                        width={180}
                        value={accessLevel}
                        items={accessLevels}
                        onChange={this.setAccessLevel}
                    />
                </Item>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_default_fiat" defaultMessage="Default Fiat" />
                        {this.getTooltip(SETTING_TIPPY_INFO.DEFAULT_FIAT)}
                    </span>
                    <CurrencySelectDropdown
                        width={180}
                        type="fiat"
                    // onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                    />
                </Item>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_default_crypto" defaultMessage="Default Crypto" />

                        {this.getTooltip(SETTING_TIPPY_INFO.DEFAULT_CRYPTO)}
                    </span>

                    <CurrencySelectDropdown width={180} type="crypto" />
                </Item>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_default_currency" defaultMessage="Default Currency" />
                        <Tooltip
                            arrow
                            animation="shift"
                            position="right"
                            theme="bct"
                            title={SETTING_TIPPY_INFO.DEFAULT_CURRENCY}
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false }
                                }
                            }}
                        >
                            <span className="symbol_i">i</span>
                        </Tooltip>
                    </span>
                    <SelectDropdown
                        width={180}
                        value={defaultCurrency}
                        items={defaultCurrencies}
                        alignTop
                        onChange={this.setDefaultCurrency}
                    />
                </Item>
            </CollapseComponent>
        );
    };

    renderAffiliateSettings = isOpened => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: {
                defaultURL,
                setDefaultURL,
                referredBy,
                setReferredBy,
                referCount,
                setReferCount
            }
        } = this.props;

        return (
            <CollapseComponent expanded={isOpened}>
                <Item>
                    <span className="affliate-label-wrapper">
                        <FormattedMessage id="settings.label_default_url" defaultMessage="Default URL" />
                        {this.getTooltip(SETTING_TIPPY_INFO.DEFAULT_URL)}
                    </span>
                    <InputTextCustom
                        // readOnly
                        width={280}
                        value={defaultURL}
                        onChange={setDefaultURL}
                        readOnly
                    />
                </Item>
                <Item>
                    <span className="affliate-label-wrapper">
                        <FormattedMessage id="settings.label_referred_by" defaultMessage="Referred by" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REFERRED_BY)}
                    </span>
                    <InputTextCustom width={280} value={referredBy} onChange={setReferredBy} readOnly />
                </Item>
                <Item>
                    <span className="affliate-label-wrapper">
                        <FormattedMessage id="settings.label_you_referred" defaultMessage="You referred" />
                        {this.getTooltip(SETTING_TIPPY_INFO.YOU_REFERRED)}
                    </span>
                    <InputTextCustom width={280} value={referCount} onChange={setReferCount} readOnly />
                </Item>
            </CollapseComponent>
        )
    };

    renderReportSettings = isOpened => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: { activeReports },
        } = this.props;

        return (
            <CollapseComponent expanded={isOpened}>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.accountsModeKey}
                        active={activeReports.includes(MODE_KEYS.accountsModeKey)}
                    >
                        <FormattedMessage id="settings.exchange_balances" defaultMessage="Your Exchange Balances" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REPORT_ACCOUNTS)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.accountsModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.accountsModeKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.orderHistoryModeKey}
                        active={activeReports.includes(MODE_KEYS.orderHistoryModeKey)}
                    >
                        <FormattedMessage id="settings.order_history" defaultMessage="Order History" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REPORT_ORDER_HISTORY)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.orderHistoryModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.orderHistoryModeKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.tradeHistoryModeKey}
                        active={activeReports.includes(MODE_KEYS.tradeHistoryModeKey)}
                    >
                        <FormattedMessage id="settings.trade_history" defaultMessage="Trade History" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REPORT_TRADE_HISTORY)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.tradeHistoryModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.tradeHistoryModeKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.paymentHistoryModeKey}
                        active={activeReports.includes(MODE_KEYS.paymentHistoryModeKey)}
                    >
                        <FormattedMessage id="settings.payment_history" defaultMessage="Payment History" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REPORT_PAYMENT_HISTORY)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.paymentHistoryModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.paymentHistoryModeKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.navReportModeKey}
                        active={activeReports.includes(MODE_KEYS.navReportModeKey)}
                    >
                        <FormattedMessage id="settings.nav_report" defaultMessage="NAV Report" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REPORT_NAV_HISTORY)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.navReportModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.navReportModeKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.myTradesModeKey}
                        active={activeReports.includes(MODE_KEYS.myTradesModeKey)}
                    >
                        <FormattedMessage id="settings.my_trades" defaultMessage="My Trades" />
                        {this.getTooltip(SETTING_TIPPY_INFO.REPORT_MY_TRADES)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.myTradesModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.myTradesModeKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.depthChartKey}
                        active={activeReports.includes(MODE_KEYS.depthChartKey)}
                    >
                        <FormattedMessage id="settings.depth_chart" defaultMessage="Depth Chart" />
                        {this.getTooltip(SETTING_TIPPY_INFO.PREFERENCE_DEPTH_CHART)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.depthChartKey)}
                        onChange={this.handleReportClick(MODE_KEYS.depthChartKey)}
                    />
                </Item>
                <Item>
                    <ReportItem
                        id={MODE_KEYS.activeModeKey}
                        active={activeReports.includes(MODE_KEYS.activeModeKey)}
                    >
                        <FormattedMessage id="settings.active_orders" defaultMessage="Active Orders" />
                        {this.getTooltip(SETTING_TIPPY_INFO.PREFERENCE_ACTIVE_ORDERS)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.activeModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.activeModeKey)}
                    />
                </Item>
                <Item >
                    <ReportItem
                        id={MODE_KEYS.filledModeKey}
                        active={activeReports.includes(MODE_KEYS.filledModeKey)}
                    >
                        <FormattedMessage id="settings.filled_orders" defaultMessage="Filled and Cancelled Orders" />
                        {this.getTooltip(SETTING_TIPPY_INFO.PREFERENCE_FILLED_ORDERS)}
                    </ReportItem>
                    <SwitchCustom
                        checked={activeReports.includes(MODE_KEYS.filledModeKey)}
                        onChange={this.handleReportClick(MODE_KEYS.filledModeKey)}
                    />
                </Item>
            </CollapseComponent>
        );
    };

    renderHelpDesk = isOpened => {
        const whitelabel = window.location.hostname;
        return (
            <CollapseComponent expanded={isOpened}>
                <Item>
                    <span>
                        <FormattedMessage id="settings.label_support_center" defaultMessage="Platform Support Center" />
                    </span>
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href={`http://nswebdev.us/helpdesk/?${whitelabel}`} target="_blank">
                        <InputTextCustom
                            // readOnly
                            width={280}
                            value="http://nswebdev.us/helpdesk/"
                            readOnly
                        />
                    </a>
                </Item>
            </CollapseComponent>
        );
    };

    render() {
        const {
            isKeyModalOpen,
            isGoogle2FAModalOpen,
            openedSettings,
            isLogoutModalOpen
        } = this.state;

        const { isLoggedIn } = this.props[STORE_KEYS.TELEGRAMSTORE];
        const { setExchangeActive } = this.props[STORE_KEYS.EXCHANGESSTORE];
        const {
            isRealTrading,
            language,
            withdrawAddress,
            publicAddress = '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX'
        } = this.props[STORE_KEYS.SETTINGSSTORE];
        const { isOpenMenu } = this.props;
        // -----
        const languagesArray = [];
        for (let i = 0; i < languages.length; i++) {
            languagesArray.push({
                name: languages[i].value,
                flag: languages[i].flag
            });
        }
        // ------
        const { PortfolioValue } = this.props[STORE_KEYS.YOURACCOUNTSTORE];
        const coin = PortfolioValue && PortfolioValue.find(item => item.Coin.toLowerCase() === 'BTC'.toLowerCase());
        const formattedBTCBalance = coin ? customDigitFormat(coin.Position) : 0;
        const { gridHeight, leftSidebarWidth } = getScreenInfo(true);

        return (
            <DropdownWrapper
                gridHeight={gridHeight}
                leftSidebarWidth={leftSidebarWidth}
                isOpenMenu={isOpenMenu}
            >
                {!isOpenMenu && (
                    <DesktopHeader
                        isLoggedIn={isLoggedIn}
                        toggleDropDown={this.toggleDropDown}
                        onLogin={this.handleLogin}
                        width={leftSidebarWidth || 0}
                        isMenuOpened={isOpenMenu}
                    />
                )}
                <DropdownMenu isOpenMenu={isOpenMenu}>
                    <PerfectScrollWrapper scrollTop>
                        <Fragment>
                            <DropdownMenuItem
                                isColumn
                                opened={openedSettings === SETTINGS_ITEMS.EXCHANGES}
                            >
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.EXCHANGES)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsExchangesIcon
                                            size={38}
                                            color="#fff"
                                            id={SETTINGS_ITEMS.EXCHANGES}
                                        />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.exchanges" defaultMessage="Exchanges" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.EXCHANGES} />}
                                </div>

                                <CollapseComponent expanded={openedSettings === SETTINGS_ITEMS.EXCHANGES}>
                                    <ExchangeListComponent
                                        searchValue={this.state.searchValue}
                                        setExchangeActive={setExchangeActive}
                                        searchComponent={() => <SearchInput
                                            value={this.state.searchValue}
                                            onChange={this.handleChangeSearchValue}
                                            placeholder="Datafeed"
                                            onClick={this.stopPropagation}
                                            isBigger
                                            ref={this.searchValueRef}
                                        />}
                                    />
                                </CollapseComponent>
                            </DropdownMenuItem>

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.PREFERENCES} >
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.PREFERENCES)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsPreferencesIcon id={SETTINGS_ITEMS.PREFERENCES} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.preferences" defaultMessage="Preferences" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.PREFERENCES} />}
                                </div>
                                {this.renderPreferencesSettings(openedSettings === SETTINGS_ITEMS.PREFERENCES)}
                            </DropdownMenuItem>

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.PRIVACY} >
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.PRIVACY)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsPrivacyIcon id={SETTINGS_ITEMS.PRIVACY} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.privacy" defaultMessage="Privacy" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.PRIVACY} />}
                                </div>

                                {this.renderPrivacySettings(openedSettings === SETTINGS_ITEMS.PRIVACY)}
                            </DropdownMenuItem>

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.AFFILIATE} >
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.AFFILIATE)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsAffiliateIcon id={SETTINGS_ITEMS.AFFILIATE} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.affiliate" defaultMessage="Affiliate" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.AFFILIATE} />}
                                </div>

                                {this.renderAffiliateSettings(openedSettings === SETTINGS_ITEMS.AFFILIATE)}
                            </DropdownMenuItem>

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.ADVANCED}>
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.ADVANCED)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsAdvancedIcon id={SETTINGS_ITEMS.ADVANCED} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.advanced" defaultMessage="Advanced" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.ADVANCED}/>}
                                </div>

                                {this.renderAdvancedSettings(openedSettings === SETTINGS_ITEMS.ADVANCED)}
                            </DropdownMenuItem>

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.REPORTS}>
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.REPORTS)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsReportsIcon id={SETTINGS_ITEMS.REPORTS} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.reports" defaultMessage="Reports" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.REPORTS}/>}
                                </div>

                                {this.renderReportSettings(openedSettings === SETTINGS_ITEMS.REPORTS)}
                            </DropdownMenuItem>

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.HELPDESK}>
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.HELPDESK)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsHelpDeskIcon id={SETTINGS_ITEMS.HELPDESK} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.helpdesk" defaultMessage="HelpDesk" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.HELPDESK}/>}
                                </div>

                                {this.renderHelpDesk(openedSettings === SETTINGS_ITEMS.HELPDESK)}
                            </DropdownMenuItem>                            

                            <DropdownMenuItem isColumn opened={openedSettings === SETTINGS_ITEMS.DEPOSIT_WITHDRAW}>
                                <div
                                    className="d-flex"
                                    onClick={this.handleMenuCollapseClicked(SETTINGS_ITEMS.DEPOSIT_WITHDRAW)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsTransferIcon id={SETTINGS_ITEMS.DEPOSIT_WITHDRAW} />
                                    </div>
                                    <span className="label-wrapper">
                                        <FormattedMessage id="settings.wallet" defaultMessage="WITHDRAW/DEPOSIT" />
                                    </span>
                                    {<OpenArrow isOpened={openedSettings === SETTINGS_ITEMS.DEPOSIT_WITHDRAW}/>}
                                </div>

                                <CollapseComponent expanded={openedSettings === SETTINGS_ITEMS.DEPOSIT_WITHDRAW}>
                                    <TransferSection>
                                        <AddressInput>
                                            <label>
                                                <FormattedMessage
                                                    id="settings.label_deposit_btc"
                                                    defaultMessage="DEPOSIT BTC"
                                                />
                                            </label>
                                            <input value={publicAddress} readOnly />
                                        </AddressInput>
                                        <AddressInput>
                                            <label>
                                                <FormattedMessage
                                                    id="settings.label_withdraw_btc"
                                                    defaultMessage="WITHDRAW BTC"
                                                />
                                            </label>
                                            <input value={withdrawAddress} placeholder="REFINED ADDRESS" onChange={this.handleInputChange('withdrawAddress')} />
                                        </AddressInput>
                                        <label>
                                            <FormattedMessage
                                                id="settings.label_withdraw_btc_description"
                                                defaultMessage="To withdraw your bitcoin, send exactly 0.0007BTC from your refined address to your Deposit BTC address.
All your bitcoinbills will then be automatically withdrawn and sent to your refined address."
                                            />
                                        </label>
                                        <DepositQRCode>
                                            <Code
                                                value={publicAddress}
                                                size={120}
                                                level="L"
                                                includeMargin
                                                renderAs="svg"
                                            />
                                            <div>{formattedBTCBalance} BTC</div>
                                        </DepositQRCode>
                                    </TransferSection>
                                </CollapseComponent>
                            </DropdownMenuItem>

                            <div className="trading-section d-flex justify-content-between">
                                <TradingButton
                                    title="Real Money"
                                    description="Trade for Real Money"
                                    onTradeClick={this.setRealTradingWith}
                                    disabled={!isRealTrading}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsLiveTradeIcon />
                                    </div>
                                </TradingButton>
                                <TradingButton
                                    title="Demo Mode"
                                    description="Practice trading with real quotes"
                                    disabled={isRealTrading}
                                    onTradeClick={this.setRealTradingWith}
                                >
                                    <div className="icon-wrapper">
                                        <SettingsDemoTradeIcon />
                                    </div>
                                </TradingButton>
                            </div>
                        </Fragment>
                    </PerfectScrollWrapper>

                    {isOpenMenu && (
                        <BottomMenuWrapper>
                            <LanguageWrapper>
                                <LanguageDropdown
                                    insideSettings
                                    value={language}
                                    items={languagesArray}
                                    onChange={this.handleLanguage}
                                />
                            </LanguageWrapper>

                            <PageButtonsWrapper>
                                <GradientButton
                                    className="primary-solid"
                                    header
                                    width={120}
                                    height={40}
                                    onClick={this.handlePageOpen('terms-of-use')}
                                >
                                    <FormattedMessage id="modal.logout.button_terms_of_use" defaultMessage="Terms of Use" />
                                </GradientButton>

                                <GradientButton
                                    className="primary-solid"
                                    header
                                    width={120}
                                    height={40}
                                    onClick={this.handlePageOpen('privacy-policy')}
                                >
                                    <FormattedMessage
                                        id="modal.page.button_privacy_policy"
                                        defaultMessage="Privacy Policy"
                                    />
                                </GradientButton>

                                {isLoggedIn && (
                                    <Fragment>
                                        <GradientButton
                                            className="primary-solid"
                                            header
                                            width={120}
                                            height={40}
                                            onClick={this.handleResetBalance}
                                        >
                                            <FormattedMessage
                                                id="settings.btn_reset"
                                                defaultMessage="Reset"
                                            />
                                        </GradientButton>

                                        <GradientButton
                                            className="primary-solid"
                                            header
                                            width={120}
                                            height={40}
                                            onClick={this.toggleLogoutModal}>
                                            <FormattedMessage
                                                id="settings.btn_logout"
                                                defaultMessage="Logout"
                                            />
                                        </GradientButton>
                                    </Fragment>
                                )}
                            </PageButtonsWrapper>
                        </BottomMenuWrapper>
                    )}
                    
                    {!!this.state.page && (
                        <TermsModal pageId={this.state.page} toggleModal={this.handlePageToggle} />
                    )}
                </DropdownMenu>

                <KeyModal toggleModal={this.toggleKeyModal} hoverMode inLineMode isModalOpen={isKeyModalOpen} />

                <Google2FAModal
                    toggleModal={this.toggleGoogle2FAModal}
                    inLineMode
                    backdropClose
                    isModalOpen={isGoogle2FAModalOpen}
                />

                <LogoutModal
                    toggleModal={this.toggleLogoutModal}
                    inLineMode
                    backdropClose
                    onLogout={this.handleLogout}
                    isModalOpen={isLogoutModalOpen}
                />
            </DropdownWrapper>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.EXCHANGESSTORE,
    STORE_KEYS.SMSAUTHSTORE,
    STORE_KEYS.ORDERHISTORY
)(observer(UserAvatarPopupMenu));
