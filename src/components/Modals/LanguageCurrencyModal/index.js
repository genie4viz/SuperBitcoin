import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import uuidv4 from 'uuid/v4';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';

import { STORE_KEYS } from '../../../stores';
import { languages } from '../../../lib/translations/languages';
import {
    Wrapper, Footer, Section, Block, Item
} from './Component';
import { InnerWrapper, Label } from '../Components';
import OrderGradientButton from '../../../components-generic/GradientButtonSquare';
import { currencyList } from '../../../components-generic/CurrencyDropdown/currencies';

class LanguageCurrencyModal extends React.Component {
    state = {
        language: 'English',
        currency: 'USD',
    };

    clearHandleSubmitTimeout = null;

    // static getDerivedStateFromProps(props, state) {
    //     const { [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, isDefaultCrypto, language } } = props;
    //
    //     const currency = isDefaultCrypto ? '' : defaultFiat;
    //
    //     const newState = {};
    //     if (currency !== state.currency) {
    //         newState.currency = currency;
    //     }
    //     if (language !== state.language) {
    //         newState.language = language;
    //     }
    //
    //     if (Object.keys(newState).length === 0) {
    //         return null;
    //     }
    //
    //     return newState;
    // }

    componentDidMount() {
        const { [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, isDefaultCrypto, language } } = this.props;
        this.setState({
            language,
            currency: isDefaultCrypto ? '' : defaultFiat,
        });
    }

    componentWillUnmount() {
        if (this.clearHandleSubmitTimeout) {
            this.clearHandleSubmitTimeout();
        }
    }

    handleSubmit = () => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: {
                setLanguage,
                setFiatCurrency,
            },
            [STORE_KEYS.INSTRUMENTS]: {
                setQuote,
                addRecentQuote,
            },
            setSafeTimeout,
        } = this.props;

        const { language, currency } = this.state;

        setLanguage(language);
        setFiatCurrency(currency);

        if (this.clearHandleSubmitTimeout) {
            this.clearHandleSubmitTimeout();
        }
        this.clearHandleSubmitTimeout = setSafeTimeout(() => {
            setQuote('USDT');
            addRecentQuote('USDT');
        });

        this.closePopup();
    };

    closePopup = () => {
        this.props.onClose();
    };

    render() {
        const { language, currency } = this.state;
        const {
            [STORE_KEYS.SETTINGSSTORE]: {
                countries,
            },
        } = this.props;

        this.languages = languages;

        this.list = [];
        for (let j = 0; j < currencyList.length; j++) {
            let include = false;
            for (let i = 0; i < countries.length; i++) {
                if (countries[i].currencyCode === currencyList[j].code) {
                    include = true;
                }
            }
            if (include) {
                this.list.push(currencyList[j]);
            }
        }

        return (
            <Wrapper>
                <Label>
                    <FormattedMessage
                        id="modal.language_currency.label_change_preference"
                        defaultMessage="Change Your Preferences"
                    />
                </Label>

                <InnerWrapper>
                    <Section>
                        <div className="title">
                            <FormattedMessage
                                id="modal.language_currency.label_select_language"
                                defaultMessage="Please select your Language"
                            />
                        </div>

                        <PerfectScrollbar
                            options={{
                                suppressScrollX: true,
                                minScrollbarLength: 50,
                            }}
                        >
                            <Block>
                                {languages.map((lang, index) => (
                                    <Item
                                        key={index}
                                        active={lang.value === language}
                                        onClick={() => this.setState({ language: lang.value })}
                                    >
                                        {lang.value}
                                    </Item>
                                ))}
                            </Block>
                        </PerfectScrollbar>
                    </Section>

                    <Section>
                        <div className="title">
                            <FormattedMessage
                                id="modal.language_currency.label_select_currency"
                                defaultMessage="Please select your Currency"
                            />
                        </div>

                        <PerfectScrollbar
                            option={{
                                suppressScrollX: true,
                                minScrollbarLength: 50,
                            }}
                        >
                            <Block>
                                {this.list.map((cur) => (
                                    <Item
                                        active={cur.code === currency}
                                        onClick={() => this.setState({ currency: cur.code })}
                                        key={uuidv4()}
                                    >
                                        <img src={`/img/icons-coin/${cur.code.toLowerCase()}.png`} className="flag" alt=""/>
                                        {/* <Flag x={cur.countries[0].posX} y={cur.countries[0].posY} /> */}
                                        <span className="symbol">{cur.symbol}</span>
                                        <span className="code">{cur.code}</span>
                                    </Item>
                                ))}
                            </Block>
                        </PerfectScrollbar>
                    </Section>
                </InnerWrapper>

                <Footer>
                    <OrderGradientButton
                        width={200}
                        height={40}
                        className="primary-solid"
                        onClick={this.handleSubmit}
                    >
                        <FormattedMessage
                            id="button.save"
                            defaultMessage="Save"
                        />
                    </OrderGradientButton>
                    <OrderGradientButton
                        width={200}
                        height={40}
                        className="negative-solid"
                        onClick={this.closePopup}
                    >
                        <FormattedMessage
                            id="button.cancel"
                            defaultMessage="Cancel"
                        />
                    </OrderGradientButton>
                </Footer>
            </Wrapper>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.INSTRUMENTS,
    ),
    observer,
);

export default enhanced(LanguageCurrencyModal);
