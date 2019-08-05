import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../stores';
import COIN_DATA_MAP from '../../mock/coin-data-map';
import { format2DigitString, unifyDigitString, customDigitFormat } from '../../utils';
import Select from './Select';
import DataLoader from '../../components-generic/DataLoader';

const StyleWrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    margin: 0;
    border: 1px solid ${props => props.theme.palette.sendCoinsModalBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    padding: 0;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    margin: 0;
    border: none;
    padding: 15px;
    background: ${props => props.theme.palette.sendCoinsModalBg};
    border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    border: none;
    border-bottom: 1px solid ${props => props.theme.palette.sendCoinsModalBorder};
    padding: 5px 15px;
    height: 40px;
    background: ${props => props.theme.palette.sendCoinsModalHeaderBg};
    border-radius: ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0 0;
    
    span {
        font-size: 18px;
        font-weight: 600;
        line-height: 1em;
        color: ${props => props.theme.palette.sendCoinsModalHeaderText};
    }
`;

const SendButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.palette.sendCoinsModalAddonBtnBg};
    outline: none !important;
    cursor: pointer;

    svg {
        &, & * {
            fill: ${props => props.theme.palette.sendCoinsModalAddonBtnText};
        }
    }
    
    &:hover, &:focus {
        background: ${props => props.theme.palette.sendCoinsModalAddonBtnHoverBg};

        svg {
            &, & * {
                fill: ${props => props.theme.palette.sendCoinsModalAddonBtnHoverText};
            }
        }
    }
    
    &:active, &.active {
        background: ${props => props.theme.palette.sendCoinsModalAddonBtnActiveBg};

        svg {
            &, & * {
                fill: ${props => props.theme.palette.sendCoinsModalAddonBtnActiveText};
            }
        }
    }
    
    &:disabled {
        background: ${props => props.theme.palette.sendCoinsModalAddonBtnBg} !important;
        
        svg {
            &, & * {
                fill: ${props => props.theme.palette.sendCoinsModalAddonBtnText} !important;
            }
        }
    }
    
    svg#send-icon {
        width: 18px;
        height: 17px;
    }
`;

const SendIcon = () => (
    <svg id="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.4 17.52">
        <g>
            <polygon points="8.45 5.09 8.45 0 18.4 8.76 8.45 17.52 8.45 12.54 0 12.55 0 5.09 8.45 5.09"/>
        </g>
    </svg>
);

const SendResult = styled.div.attrs({ className: 'send-coins-result' })`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: stretch;
    margin: 15px 0 0;
    border: none;
    padding: 0;
`;

const GroupLabel = styled.div`
    flex: 1;
    max-width: 50%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 5px 0 0;
    background: ${props => props.theme.palette.sendCoinsModalInputBg};
    border: 1px solid ${props => props.theme.palette.sendCoinsModalInputBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    padding: 15px;
    
    .label {
        position: absolute;
        top: -10px;
        left: 5px;
        margin: 0;
        padding: 0 3px;
        font-size: 16px;
        line-height: 1em;
        font-weight: bold;
        background: ${props => props.theme.palette.sendCoinsModalBg};
        color: ${props => props.theme.palette.sendCoinsModalInputLabel};
    }
    
    .content {
        width: 100%;
        font-size: 14px;
        line-height: 1em;
        color: ${props => props.theme.palette.sendCoinsModalInputText};
        font-weight: 300;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;

const ResultAmountWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    
    .label {
        font-size: 16px;
        line-height: 1em;
        color: ${props => props.theme.palette.sendCoinsModalInputText2};
    }
    
    .amount {
        font-size: 35px;
        font-weight: 600;
        line-height: 1em;
        color: ${props => props.theme.palette.sendCoinsModalInputText};
    }
    
    .unit {
        color: ${props => props.theme.palette.clrPurple};
    }
`;

const SuccessfulBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.palette.sendCoinsModalAddonBg};
    
    svg#successful-icon {
        width: 15px;
        height: 10px;
    }
    
    svg {
        &, & * {
            fill: transparent;
            stroke: white;
        }
    }
`;

const SuccessfulIcon = () => (
    <svg id="successful-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.85 11.74">
        <g>
            <polyline points="0.49 5.18 6.8 10.7 16.3 0.51"/>
        </g>
    </svg>
);

class SendCoins extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCoin: null,
            coinsInWallet: [],
            amount: 0,
            amountMax: 0,
            isSendingCoins: false,
            coinSentSuccessfully: false,
        };
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // Iterate items in wallet and add only with values
        const coinsInWallet = [];

        if (nextProps.PortfolioData && nextProps.PortfolioData.length) {
            nextProps.PortfolioData.forEach(item => {
                // low limit is 0.0001
                if (Number.parseFloat(item.Position) > 0.0001) {
                    if (COIN_DATA_MAP[item.Coin]) {
                        coinsInWallet.push({
                            ...item,
                            ...COIN_DATA_MAP[item.Coin],
                        });
                    } else {
                        coinsInWallet.push({
                            ...item,
                            name: item.Name,
                            file: item.Coin,
                            symbol: item.Coin,
                        });
                    }
                }
            });
        }

        if (!isEqual(coinsInWallet, prevState.coinsInWallet)) {
            return {
                coinsInWallet,
                selectedCoin: prevState.selectedCoin || ((coinsInWallet.length && coinsInWallet[0]) || null),
                amount: prevState.selectedCoin ? prevState.amount : Math.min((coinsInWallet.length && Number.parseFloat(coinsInWallet[0].Position)) || 0, 1.0),
                // amount: 1.0,
                amountMax: prevState.selectedCoin ? prevState.amountMax : ((coinsInWallet.length && Number.parseFloat(coinsInWallet[0].Position)) || 0),
            };
        }

        return null;
    }

    handleSendCoin = () => {
        if (!this.state.selectedCoin || !Number.parseFloat(this.state.amount)) {
            return;
        }

        const { amount } = this.state;
        const { symbol } = this.state.selectedCoin;
        // const url = localStorage.getItem('username') + '-' + localStorage.getItem('userid');
        const defaultURL = localStorage.getItem('defaultURL') || 'ourbit.io';
        const notification = `I just sent you ${customDigitFormat(amount)} ${symbol.replace('F:', '')}. Please login into ${defaultURL} to receive it.`;

        this.setState({
            isSendingCoins: true,
        });

        this.props.sendWalletMsg(notification, symbol, amount, this.props.user)
            .then(res => {
                this.setState({
                    coinSentSuccessfully: res,
                    isSendingCoins: false,
                });

                if (res && this.props.onFinish) {
                    this.props.onFinish();
                }
            })
            .catch(() => {
                this.setState({
                    isSendingCoins: false,
                });
            });
    };

    handleCoinChange = selectedCoin => {
        this.setState({
            selectedCoin,
            amountMax: Number.parseFloat(selectedCoin.Position),
            // amount: 1.0,
            amount: Math.min(Number.parseFloat(selectedCoin.Position), 1.0),
        });
    };

    handleAmountChange = amount => {
        this.setState({ amount });
    };

    render() {
        const {
            name, resetWalletTableState, isLoggedIn, portfolioData,
        } = this.props;
        const {
            type, selectedCoin, coinsInWallet, amount, amountMax, coinSentSuccessfully, isSendingCoins,
        } = this.state;

        const coin = ((selectedCoin && selectedCoin.symbol) || '').replace('F:', '');

        let baseCoinUSDPrice = 0;
        for (let i = 0; i < portfolioData.length; i++) {
            if (portfolioData[i].Coin === coin) {
                baseCoinUSDPrice = portfolioData[i].Price;
            }
        }

        return (
            <StyleWrapper>
                <Header>
                    <span>Send {format2DigitString(amount)} {coin} to {name}</span>
                </Header>

                <ContentWrapper>
                    <Select
                        selectedCoin={selectedCoin}
                        coins={coinsInWallet}
                        amount={amount}
                        currentValue={unifyDigitString(baseCoinUSDPrice * amount)}
                        amountMax={amountMax}
                        onCoinChange={this.handleCoinChange}
                        onAmountChange={this.handleAmountChange}
                        type={type}
                        readOnly={coinSentSuccessfully || isSendingCoins}
                        resetWalletTableState={resetWalletTableState}
                    >
                        {!coinSentSuccessfully ? (
                            <Tooltip
                                arrow={true}
                                animation="shift"
                                position="bottom"
                                distance={18}
                                followCursor
                                theme="bct"
                                disabled={isLoggedIn}
                                title="Please login to send"
                            >
                                <SendButton
                                    onClick={this.handleSendCoin}
                                    disabled={isSendingCoins || coinSentSuccessfully || !isLoggedIn}
                                >
                                    {isSendingCoins
                                        ? <DataLoader width={40} height={40}/>
                                        : <SendIcon/>
                                    }
                                </SendButton>
                            </Tooltip>
                        ) : (
                            <SuccessfulBtn> <SuccessfulIcon/> </SuccessfulBtn>
                        )}
                    </Select>

                    {coinSentSuccessfully && (
                        <SendResult>
                            <GroupLabel>
                                <span className="label">
                                    <FormattedMessage
                                        id="modal.send_coins.label_order_id"
                                        defaultMessage="Order ID"
                                    />
                                </span>
                                <span className="content">3HZV VbrcLAuWt691</span>
                            </GroupLabel>
                            <ResultAmountWrapper>
                                <span className="label">
                                    <FormattedMessage
                                        id="modal.send_coins.label_transfer_complete"
                                        defaultMessage="Your transfer is complete"
                                    />
                                </span>
                                <span className="amount">{format2DigitString(amount)} <span className="unit">{coin}</span></span>
                            </ResultAmountWrapper>
                        </SendResult>
                    )}
                </ContentWrapper>
            </StyleWrapper>
        );
    }
}

const enchanced = compose(
    inject(STORE_KEYS.MODALSTORE, STORE_KEYS.YOURACCOUNTSTORE, STORE_KEYS.TELEGRAMSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.MODALSTORE]: {
                Modal,
                onClose,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioData,
                portfolioData,
                resetWalletTableState,
            },
            [STORE_KEYS.TELEGRAMSTORE]: {
                sendWalletMsg,
                isLoggedIn,
            },
        }) => ({
            Modal,
            onClose,
            PortfolioData,
            portfolioData,
            resetWalletTableState,
            sendWalletMsg,
            isLoggedIn,
        })
    )
);

export default enchanced(SendCoins);
