import React, { Component, Fragment } from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';

import { format2DigitString } from '../../utils';
import { valueNormalized } from '../../stores/utils/OrderEntryUtils';
import CoinSelect from './CoinSelectRV';
import SliderInput from './SliderInputWithColor';
import CoinIcon from '@/components-generic/CoinIcon';

const StyleWrapper = styled.div.attrs({ className: 'send-coins-modal-select' })`
    position: relative;
    width: 430px;
    height: 60px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    background: ${props => props.theme.palette.sendCoinsModalInputBg};
    border: 1px solid ${props => props.theme.palette.sendCoinsModalInputBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    
    &:hover {
        border: 1px solid ${props => props.theme.palette.sendCoinsModalInputHoverBorder};
        background: ${props => props.theme.palette.sendCoinsModalInputHoverBg};
        
        .coin-name {
            color: ${props => props.theme.palette.sendCoinsModalInputHoverText2} !important;
        }
    }
    
    .select__icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px 0 15px;
        padding: 0;
    }
    
    .select__name-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 40px 0 0;
        cursor: pointer;

        .select__name-wrapper__coin-symbol {
            font-size: 18px;
            font-weight: 600;
            line-height: 1em;
            color: ${props => props.theme.palette.sendCoinsModalInputText};
        }

        .select__name-wrapper__coin-name {
            margin: 3px 0 0;
            font-size: 13px;
            font-weight: normal;
            line-height: 1em;
            color: ${props => props.theme.palette.sendCoinsModalInputText};
            // color: ${props => props.theme.palette.sendCoinsModalInputText2};
        }
    }
    
    .select__amount-wrapper {
        position: relative;
        height: 100%;
        margin: 0;
        padding: 0 15px 0 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-start;

        .select__amount-wrapper__amount-input {
            padding-right: 4px;
            width: 100%;
            height: 100%;
            background: transparent;
            border: 0;
            font-size: 38px;
            font-weight: 600;
            text-align: right;
            color: ${props => props.theme.palette.sendCoinsModalInputText};

            &:focus {
                outline: none;
            }
        }
        
        .range-slider {
            position: absolute;
            left: 0px;
            right: 15px;
            bottom: -6px;
            z-index: 1;
        }
    }
    
    .select__addon {
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        margin: 0;
        border-left: 1px solid ${props => props.theme.palette.sendCoinsModalInputBorder};
        padding: 0;
        width: 60px;
        height: 100%;
        background: ${props => props.theme.palette.sendCoinsModalAddonBg};
        overflow: hidden;
        border-radius: 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0;
        
        & > div {
            width: 100%;
        }
    }
`;

class Select extends Component {
    constructor(props) {
        super(props);

        this.wrapperRef = null;
        this.amountInput = null;

        this.state = {
            isOpened: false,
            isAmtInputFocused: false,
            isAmtChangedAfterFocus: false,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (this.state.isOpened && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.toggleDropDown();
        }
    };

    toggleDropDown = () => {
        this.setState(prevState => ({
            isOpened: !prevState.isOpened,
        }));
    };

    handleCoinChange = coin => {
        this.props.onCoinChange(coin);
        this.toggleDropDown();
    };

    handleAmountChange = value => {
        const valueParsed = Number.parseFloat(value);
        if (valueParsed > this.props.amountMax) {
            return;
        }

        const oldValue = String(this.state.amount);
        const newValue = valueNormalized(oldValue, value);

        this.props.onAmountChange(newValue || 0);

        this.setState({
            isAmtChangedAfterFocus: true,
        });
    };

    handleAmtInputFocus = () => {
        this.setState({
            isAmtInputFocused: true,
            isAmtChangedAfterFocus: false,
        });

        this.props.onAmountChange('0');

        if (this.state.isOpened) {
            this.toggleDropDown();
        }
    };

    handleAmtInputBlur = () => {
        this.setState({
            isAmtInputFocused: false,
        });
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && this.amountInput) {
            this.amountInput.blur();
        }
    };

    render() {
        const {
            coins, selectedCoin, amountMax, amount, currentValue, children, readOnly, resetWalletTableState, amount: amountFromState,
        } = this.props;

        const {
            isOpened, isAmtInputFocused, isAmtChangedAfterFocus,
        } = this.state;

        return (
            <StyleWrapper
                ref={ref => {
                    this.wrapperRef = ref;
                }}
                onClick={() => {
                    if (resetWalletTableState) {
                        resetWalletTableState();
                    }
                }}
                onKeyDown={this.handleKeyDown}
            >
                <div className="select__icon-wrapper">
                    <CoinIcon value={selectedCoin} size={34} />
                </div>

                <div className="select__name-wrapper" onClick={this.toggleDropDown} role="button" tabIndex={0}>
                    <span className="select__name-wrapper__coin-symbol">
                        {((selectedCoin && selectedCoin.symbol) || '').replace('F:', '')}
                    </span>
                    <span className="select__name-wrapper__coin-name">
                        <FormattedMessage
                            id="modal.send_coins.label_you_send"
                            defaultMessage="You send"
                        />
                        {/* {((selectedCoin && selectedCoin.name) || '').replace('F:', '')} */}
                    </span>
                </div>

                <div className="select__amount-wrapper">
                    {!isOpened &&
                        <Fragment>
                            <input
                                ref={ref => {
                                    this.amountInput = ref;
                                }}
                                className="select__amount-wrapper__amount-input"
                                value={isAmtInputFocused ? isAmtChangedAfterFocus ? amountFromState : '' : format2DigitString(amount)}
                                onChange={(e) => this.handleAmountChange(e.target.value)}
                                onFocus={this.handleAmtInputFocus}
                                onBlur={this.handleAmtInputBlur}
                                disabled={readOnly}
                                readOnly={readOnly}
                                type="text"
                            />

                            <SliderInput
                                value={amount}
                                currentValue={currentValue}
                                max={amountMax}
                                readOnly={readOnly}
                                onChange={(e) => this.handleAmountChange(e.target.value)}
                            />
                        </Fragment>
                    }
                </div>

                <div className="select__addon">
                    {children}
                </div>

                <CoinSelect
                    items={coins}
                    value={selectedCoin}
                    isOpen={isOpened}
                    onChange={this.handleCoinChange}
                />
            </StyleWrapper>
        );
    }
}

export default Select;
