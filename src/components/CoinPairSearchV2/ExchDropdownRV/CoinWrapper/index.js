import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { AutoSizer } from 'react-virtualized';
import { FormattedMessage } from 'react-intl';

import { STORE_KEYS } from '@/stores';
import { formatStringForMKTCAP, formatString } from '@/utils';
import { MODE_KEYS } from '@/components/OrderHistoryAdv/Constants';
import CoinIcon from '@/components-generic/CoinIcon';
import CoinNameSmall from '../CoinName/CoinNameSmall';
import PopupInput from './PopupInput';
import BrokerSelect from './BrokerDropdown';
import IconPagination from './IconPagination';
import {
    AumCustomImg
} from '../Components';
import {
    Wrapper,
    DropdownWrapper,
    InfoIcon,
    InfoWrapper,
    CoinIconWrapper
} from './styles';
import COIN_DATA_MAP from '@/mock/coin-data-map';

import IcAUM from '../icon-aum.png';

import imgIconFacebook from './icon-facebook.svg';
import imgIconTwitter from './icon-twitter.svg';
import imgIconTelegram from './icon-telegram.svg';
import imgIconReddit from './icon-reddit.svg';
import imgIconDiscord from './icon-discord.svg';
import imgIconYoutube from './icon-youtube.svg';
import imgIconInstagram from './icon-instagram.svg';
import imgIconGithub from './icon-github.svg';


class CoinWrapper extends React.Component {
    state = {
        isOpened: false,
        isIconOver: false,
        isOpenDelivery: false
    };

    getSocialLinkItems = () => {
        const { value } = this.props;

        let socialInfo = [];
        if (COIN_DATA_MAP[value] === undefined) {
            socialInfo = [];
        } else {
            socialInfo = COIN_DATA_MAP[value].social_info;
        }

        const socialLinkItems = [];
        for (let i = 0; i < socialInfo.length; i++) {
            const splitArray = socialInfo[i].split('//');
            const domainArray = splitArray[1].split('/');
            const title = domainArray[0].split('.');

            let toolTip = '';
            if (title.length === 3) {
                toolTip = title[1];
            } else if (title.length === 2) {
                toolTip = title[0];
            }

            let imgSrc = `SocialLinks/${domainArray[0]}.png`;
            if (socialInfo[i].indexOf('https://facebook.com') !== -1 || socialInfo[i].indexOf('https://www.facebook.com') !== -1) {
                imgSrc = imgIconFacebook;
            } else if (socialInfo[i].indexOf('https://twitter.com') !== -1 || socialInfo[i].indexOf('https://www.twitter.com') !== -1) {
                imgSrc = imgIconTwitter;
            } else if (socialInfo[i].indexOf('https://discord.com') !== -1 || socialInfo[i].indexOf('https://www.discord.com') !== -1) {
                imgSrc = imgIconDiscord;
            } else if (socialInfo[i].indexOf('https://github.com') !== -1 || socialInfo[i].indexOf('https://www.github.com') !== -1) {
                imgSrc = imgIconGithub;
            } else if (socialInfo[i].indexOf('https://telegram.org') !== -1 || socialInfo[i].indexOf('https://www.telegram.org') !== -1) {
                imgSrc = imgIconTelegram;
            } else if (socialInfo[i].indexOf('https://reddit.com') !== -1 || socialInfo[i].indexOf('https://www.reddit.com') !== -1) {
                imgSrc = imgIconReddit;
            } else if (socialInfo[i].indexOf('https://youtube.com') !== -1 || socialInfo[i].indexOf('https://www.youtube.com') !== -1) {
                imgSrc = imgIconYoutube;
            } else if (socialInfo[i].indexOf('https://instagram.com') !== -1 || socialInfo[i].indexOf('https://www.instagram.com') !== -1) {
                imgSrc = imgIconInstagram;
            }

            socialLinkItems.push(
                <a
                    href={socialInfo[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={toolTip}
                    title={toolTip}
                    key={i}
                >
                    <img className="img-icon" alt="" src={imgSrc} />
                </a>
            );
        }

        return socialLinkItems;
    };

    showInfoIcon = (mode) => () => {
        this.setState({ isIconOver: mode });
    }

    openCoinInfo = (mode) => (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        this.setState({ isOpened: mode, isIconOver: mode, isOpenDelivery: false });
    }

    showColdStorage = () => {
        const { setArbMode, setColdStorageMode, setRightBottomSectionOpenMode } = this.props;
        setArbMode(true);
        setColdStorageMode(true);
        setRightBottomSectionOpenMode(MODE_KEYS.myPortfolioModeKey);
    }

    openDeliveryInfo = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        this.setState({ isOpenDelivery: true });
    }

    getCoinIcon = () => {
        const { isIconOver } = this.state;
        const {
            isAUMSelected,
            value,
            stockMode,
            defaultFiat,
        } = this.props;

        if (isIconOver) {
            return (
                <InfoIcon className="info-icon-wrapper" />
            );
        }
        if (isAUMSelected) {
            return (
                <AumCustomImg src={IcAUM} alt="ic-aum" />
            );
        }
        if ((value && value.stock) || !stockMode) {
            return (
                <CoinIcon
                    size={38}
                    value={value}
                    defaultFiat={defaultFiat}
                />
            );
        }
        return (
            <img
                src={`https://storage.googleapis.com/iex/api/logos/${(value || '').replace('F:', '')}.png`}
                className="icon_stock"
                alt=""
            />
        );
    }

    render() {
        const { isOpened, isOpenDelivery } = this.state;
        const {
            width,
            height,
            isLeft,
            isLeftDirection,
            value,
            defaultFiat,
            OrderEventsData,
            isAUMSelected,
            baseSymbol: selectedBase,
            quoteSymbol: selectedQuote,
            RouterCoin,
            getDefaultPrice,            
            toggleDropdown,
            isSearch,
        } = this.props;
        const activeCoin = isLeft ? selectedBase : selectedQuote;

        let isForceOpened = false;
        if (selectedBase === RouterCoin && isLeft) {
            isForceOpened = true;
        }

        let marketCap = 0;
        let volume24h = 0;
        let priceChange24 = 0;
        /* eslint-disable-next-line */
        for (let [, data] of OrderEventsData) {
            if (data.Coin === activeCoin && data.Price) {
                marketCap = data.Marketcap;
                volume24h = data.Volume24h;
                priceChange24 = data.priceChange24;
            }
        }

        const coinMetaOpened = isForceOpened || isOpened;

        return (
            <div>
                <Wrapper
                    width={width}
                    height={height}
                    onClick={toggleDropdown}
                    coinMetaOpened={coinMetaOpened}
                    disableHover={!isSearch}
                >
                    <CoinIconWrapper isLeft={isLeftDirection}>
                        {isSearch && <div
                            onClick={this.openCoinInfo(true)}
                            role="button"
                            tabIndex={0}
                        >
                            {this.getCoinIcon()}
                        </div>}
                        <CoinNameSmall value={value} isMobile={false} defaultFiat={defaultFiat} isAUMSelected={isAUMSelected} isSearch={isSearch} />
                    </CoinIconWrapper>

                </Wrapper>
                {coinMetaOpened && ( // coinMetaOpened
                    <AutoSizer>
                        {({ width, height }) => (
                            <DropdownWrapper width={width} height={height}>
                                <div className="current-info-popup"
                                    onMouseLeave={this.openCoinInfo(false)}
                                >
                                    <div className="basic-current-info">
                                        <div className="current-info">
                                            <InfoWrapper>
                                                <div className="market-cap-info">M.CAP:
                                                $<span>{formatStringForMKTCAP(getDefaultPrice(marketCap, activeCoin))}</span>
                                                </div>
                                                <div>| 24H VOL.:
                                                $<span>{formatStringForMKTCAP(getDefaultPrice(volume24h, activeCoin))}</span>
                                                </div>
                                                <div>
                                                    <span className={`${priceChange24 < 0 ? 'minus_change' : 'plus_change'}`}>
                                                        {`${priceChange24 < 0 ? '' : '+'}${formatString(priceChange24, 2)}%`}
                                                    </span>
                                                </div>
                                            </InfoWrapper>
                                            <div className="social-link-list">
                                                <IconPagination socialItems={this.getSocialLinkItems()} />
                                            </div>
                                        </div>
                                        <div className="info-tab">
                                            <div onClick={this.showColdStorage} role="button" tabIndex={0}>
                                                <FormattedMessage
                                                    id="currency_info_popup.show_cold_storage"
                                                    defaultMessage="SHOW COLD STORAGE"
                                                />
                                            </div>
                                            <div onClick={this.openDeliveryInfo} role="button" tabIndex={0}>
                                                <FormattedMessage
                                                    id="currency_info_popup.physical_delivery"
                                                    defaultMessage="PHYSICAL DELIVERY"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {isOpenDelivery &&
                                        <div className="extra-info">
                                            <div className="tab-description">
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                                            </p>
                                            </div>
                                            <div className="delivery-actions">
                                                <FormattedMessage
                                                    id="currency_info_popup.physical_delivery.placeholder_select_your_broker"
                                                    defaultMessage="SELECT YOUR BROKER"
                                                >
                                                    {placeholder =>
                                                        <BrokerSelect placeholder={placeholder} />
                                                    }
                                                </FormattedMessage>
                                                <FormattedMessage
                                                    id="currency_info_popup.physical_delivery.placeholder_transaction_number"
                                                    defaultMessage="TRANSACTION NUMBER"
                                                >
                                                    {placeholder =>
                                                        <PopupInput className="transaction-input" placeholder={placeholder} />
                                                    }
                                                </FormattedMessage>

                                                <div className="deliver-button">
                                                    <FormattedMessage
                                                        id="currency_info_popup.physical_delivery.deliver"
                                                        defaultMessage="DELIVER"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </DropdownWrapper>
                        )}
                    </AutoSizer>
                )}
            </div>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.FIATCURRENCYSTORE,
        STORE_KEYS.VIEWMODESTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                OrderEventsData,
            },
            [STORE_KEYS.INSTRUMENTS]: {
                selectedInstrumentPair: [baseSymbol, quoteSymbol],
                RouterCoin,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                getDefaultPrice,
            },
            [STORE_KEYS.FIATCURRENCYSTORE]: {
                stockMode,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                setArbMode,
                setColdStorageMode,
                setRightBottomSectionOpenMode
            }
        }) => ({
            OrderEventsData,
            baseSymbol,
            quoteSymbol,
            RouterCoin,
            getDefaultPrice,
            stockMode,
            setArbMode,
            setColdStorageMode,
            setRightBottomSectionOpenMode
        })
    )
)(CoinWrapper);
