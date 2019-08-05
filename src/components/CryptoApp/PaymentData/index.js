import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';

import {
    PaymentDataWrapper,
    CornerTopLeft,
    CornerBottomLeft,
    CornerTopRight,
    CornerBottomRight,
    AmountText,
    AmountTextMid,
    StatusTextBottom,
    AdditionText,
    RightHighlightText,
    TestText
} from './Components';

const converter = require('number-to-words');

class PaymentData extends React.Component {
    getCornerStyle = (value) => {
        const amount = Math.round(value);
        const os = (/Android/i.test(navigator.userAgent) ? 'android ' : '');
        if(value < 0.02) return `${os}usd_1 cent`;
        if(value < 10) return `${os}usd_1`;
        if(amount < 100) return `${os}usd_10`;
        if(amount < 1000) return `${os}usd_100`;
        if(amount < 10000) return `${os}usd_1000`;
        if(amount < 100000) return `${os}usd_10000`;
        return `${os}usd_100000`;
    };

    getAmountStr = (value) => {
        if(value < 0.02) return 'ONE CENT';
        if(value < 10) return Math.floor(value).toString();
        if(Math.round(value) < 10000) return Math.round(value).toString();
        return Math.round(value).toLocaleString();
    }

    getFixedStr = (value) => {
        const text = (Math.floor(value * 100) / 100).toFixed(2);
        const res = text.substring(text.length - 2);
        return (res === '00' ? '' : res);
    }

    getAmountText = (value) => {
        let amountValue = value;
        if(value < 0.02) amountValue = 0.01;
        const amount = this.round(amountValue);
        if(amountValue === 1) return 'ONE DOLLAR';
        if(amountValue < 10) return `${(Math.floor(amountValue * 100) / 100).toFixed(2)} DOLLARS`;
        if(amount < 1000) return `${this.getAdditionText(amount)} DOLLARS`;
        return `${this.getAdditionText(amount)} DOLLARS IN BITCOIN`;
    }

    getAmountTextMid = () => {
        return this.props.currency.currencyCode;
    }

    getAdditionText = (value) => {
        const amount = this.round(value);
        if (value < 0.02) return 'CENT';
        if (value < 10) return `${(Math.floor(value * 100) / 100).toFixed(2)}`;
        if (amount < 100) return converter.toWords(amount).toUpperCase();
        if (amount < 10000) return amount.toString();
        return amount.toLocaleString();
    }

    getStatusText = (value) => {
        const {
            currency,
        } = this.props;
        if(value < 0.02) return 'O N E C E N T';
        let text = this.props.getFixedNumberString(value, true);
        text = text.split('').join(' ');
        text = text.split(' . ').join('.');
        text = text.split(' , ').join(',');
        if(currency.type === 'country' && text.length < 10) {
            const parts = currency.currency.split(' ');
            let symbol = parts[parts.length - 1].toUpperCase().split('').join(' ');
            if(value !== 1) symbol += ' S';
            text = `${text} ${symbol}`;
        }
        return text;
    }

    round = (value) => {
        return Math.max(Math.round(value), 1);
    }

    render() {
        const {
            amount,
        } = this.props;

        const usdAmount = amount * this.props.currency.price;
        const cornerStyle = this.getCornerStyle(usdAmount);
        const amountStr = this.getAmountStr(usdAmount);
        const fixedStr = this.getFixedStr(usdAmount);
        const amountText = this.getAmountText(usdAmount);
        const amountTextMid = this.getAmountTextMid(amount);
        const additionText = this.getAdditionText(usdAmount);

        return (
            <PaymentDataWrapper id="payment-data-wrapper" billHeight={this.props.billHeight}>
                <CornerTopLeft
                    className={`${cornerStyle} corner-text-len-${amountStr.length}`}
                >
                    <span data-text={amountStr}>{amountStr}</span>
                    {usdAmount < 10 && (<span data-text={fixedStr} className="fixed">{fixedStr}</span>)}
                </CornerTopLeft>
                <CornerBottomLeft
                    className={`${cornerStyle} corner-text-len-${amountStr.length}`}
                >
                    <span data-text={amountStr}>{amountStr}</span>
                    {usdAmount < 10 && (<span data-text={fixedStr} className="fixed">{fixedStr}</span>)}
                </CornerBottomLeft>
                <CornerTopRight
                    className={`${cornerStyle} corner-text-len-${amountStr.length}`}
                >
                    {(usdAmount < 1000 || usdAmount >= 100000) ? (
                        <span data-text={amountStr}>{amountStr}</span>
                    ) : (
                        amountStr.split('').map((item, index) =>
                            (usdAmount < 10000 ? (
                                <div
                                    key={`char-rotation-${index}`}
                                    className={`char-${index}`}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            ) : (
                                <div
                                    key={`char-rotation-${index}`}
                                    className={`char-${index}`}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        paddingTop: `${80 * ((amountStr.length - 1) / 2 - index) * ((amountStr.length - 1) / 2 - index) / (amountStr.length * amountStr.length)}px`,
                                    }}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            )))
                    )}
                    {usdAmount < 10 && (<span data-text={fixedStr} className="fixed">{fixedStr}</span>)}
                </CornerTopRight>
                <CornerBottomRight
                    className={`${cornerStyle} corner-text-len-${amountStr.length}`}
                >
                    {(usdAmount < 1000 || usdAmount >= 100000) ? (
                        <span data-text={amountStr}>{amountStr}</span>
                    ) : (
                        amountStr.split('').map((item, index) =>
                            (usdAmount < 10000 ? (
                                <div
                                    key={`char-rotation-${index}`}
                                    className={`char-${index}`}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            ) : (
                                <div
                                    key={`char-rotation-${index}`}
                                    className={`char-${index}`}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        paddingTop: `${80 * ((amountStr.length - 1) / 2 - index) * ((amountStr.length - 1) / 2 - index) / (amountStr.length * amountStr.length)}px`,
                                    }}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            )))
                    )}
                    {usdAmount < 10 && (<span data-text={fixedStr} className="fixed">{fixedStr}</span>)}
                </CornerBottomRight>

                <AmountText
                    className={`${cornerStyle} amount-text-len-${amountText.length}`}
                >
                    <span data-text={amountText.split(' ').join('   ')}>{amountText.split(' ').join('   ')}</span>
                </AmountText>

                <AmountTextMid
                    className={cornerStyle}
                >
                    <span data-text={amountTextMid}>{amountTextMid}</span>
                </AmountTextMid>

                <StatusTextBottom
                    className={cornerStyle}
                    len={this.getStatusText(amount).length}
                >
                    <span>{this.getStatusText(amount)}</span>
                </StatusTextBottom>

                {usdAmount >= 10 && Math.round(usdAmount) < 100 && (
                    <CornerTopLeft
                        className={`${cornerStyle} highlight-text`}
                    >
                        <span className={`detail-${additionText.length}`}>{additionText}</span>
                    </CornerTopLeft>
                )}
                {usdAmount >= 10 && Math.round(usdAmount) < 100 && (
                    <CornerBottomLeft
                        className={`${cornerStyle} highlight-text`}
                    >
                        <span className={`detail-${additionText.length}`}>{additionText}</span>
                    </CornerBottomLeft>
                )}
                {usdAmount < 10 && (
                    <RightHighlightText className={`top right-highlight-${additionText.length}`}>
                        {
                            additionText.split('').map((item, index) =>
                                <div
                                    key={`char-rotation-${index}`}
                                    className={`right-highlight-len-${index}`}
                                >
                                    <span>{item}</span>
                                </div>)
                        }
                    </RightHighlightText>
                )}
                {usdAmount < 10 && (
                    <RightHighlightText className={`bottom right-highlight-${additionText.length}`}>
                        {
                            additionText.split('').map((item, index) =>
                                <div
                                    key={`char-rotation-${index}`}
                                    className={`right-highlight-len-${index}`}
                                >
                                    <span>{item}</span>
                                </div>)
                        }
                    </RightHighlightText>
                )}
                {usdAmount < 10 && (<AdditionText className={`${cornerStyle} addition-text top`}><span>{additionText}</span></AdditionText>)}
                {usdAmount < 10 && (<AdditionText className={`${cornerStyle} addition-text bottom`}><span>{additionText}</span></AdditionText>)}
                {(usdAmount < 10 || (Math.round(usdAmount) >= 100 && Math.round(usdAmount) < 1000)) && (<AdditionText className={`${cornerStyle} addition-text left-top`}><span>{additionText}</span></AdditionText>)}
                {(usdAmount < 10 || (Math.round(usdAmount) >= 100 && Math.round(usdAmount) < 1000)) && (<AdditionText className={`${cornerStyle} addition-text left-bottom`}><span>{additionText}</span></AdditionText>)}
                {usdAmount < 10 && (<AdditionText className={`${cornerStyle} addition-text right-top`}><span>{additionText}</span></AdditionText>)}
                {usdAmount < 10 && (<AdditionText className={`${cornerStyle} addition-text right-bottom`}><span>{additionText}</span></AdditionText>)}

                <TestText style={{ fontFamily: 'ARB-187 Modern Caps' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Century Ultra Condensed' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Bernard MT Condensed' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Europa Grotesque Extra Bold' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Federal Regular' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Tungsten Medium' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Caslon RR Regular ExtraCond Outline' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Caslon RR Regular ExtraCond Diagonal' }}>Test</TestText>
            </PaymentDataWrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.PAYAPPSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.PAYAPPSTORE]: {
                    getFixedNumberString,
                },
            }
        ) => ({
            getFixedNumberString,
        })
    )
)(withRouter(PaymentData));
