import React, { memo, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import PopUp from '@/components-generic/PopUp';
import { Wrapper } from '@/components-generic/Wrappers';
import SliderInput from '@/components-generic/SliderInput';
import { BILL_IMG_RATIO } from '@/config/constants';
import { BackgroundImg } from '../styles';
import {
  LeftDetails, GuideQRCode, SecurityQRCode, RightDetails,
  WithdrawAmount, WithdrawForm, InputArea, BTCAddressInput,
  AmountSlider, WithdrawButton, WithdrawInfo,
} from './styles';
import { customDigitFormat } from '@/utils';

const WithdrawPop = memo(({
  balance,
  conversionRate,
  currency,
  userId,
  userSecret,
  height,
  onWithdraw,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [btcAddress, setBTCAddress] = useState('');
  const [amountToWithdraw, setAmountToWithdraw] = useState(balance);
  const contentHeight = Math.round(height * 0.8);
  const contentWidth = Math.round(contentHeight * BILL_IMG_RATIO);

  function handleAddressChange(event) {
    setBTCAddress(event.target.value);
  }

  // Tempo: disable ability to control withdraw amount
  // const updateAmount = debounce(setAmountToWithdraw, 200);
  // 
  // function handleAmountChange(event) {
  //   updateAmount(customDigitFormat(event.target.value, 8));
  // }

  function handleClose() {
    setIsOpen(false);
  }

  function handleWithdraw() {
    onWithdraw(amountToWithdraw);
    handleClose();
  }

  return (
    <PopUp
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      open={isOpen}
      onClose={handleClose}
    >
      {/* Darwin Background Img */}
      <BackgroundImg src="./img/bills/bill_0.png" />

      <Wrapper>
        <LeftDetails>
          {/* Show big QR code containing userId + Withdraw Guide */}
          <GuideQRCode
            color="#454746"
            renderAs="svg"
            size={250}
            value={`Your userId is ${userId}.
              To receive your ${currency}, Open an account at Interactive Brokers, confirm that
              ${balance} ${currency} is valued at ${balance * conversionRate}
              BTC. Then enter the BTC address you are provided with and press withdraw. Once
              received, Interactive Brokers will deposit ${balance} ${currency} in the
              ${currency} Wallet/Account of your choice.
              Scan QR code to the right to get your 16 digit security code. Do not share...
              You must provide this to interactive brokers.`}
          />

          {/* Withdrawal Amount */}
          <WithdrawAmount>{balance} <b>{currency}</b></WithdrawAmount>

          {/* Withdraw form */}
          <WithdrawForm>
            <InputArea>
              <BTCAddressInput value={btcAddress} onChange={handleAddressChange} />
            </InputArea>
            <WithdrawButton onClick={handleWithdraw}>WITHDRAW</WithdrawButton>
          </WithdrawForm>
        </LeftDetails>


        <RightDetails>
          {/* Show Currency value + Date */}
          <WithdrawInfo>
            {currency}: {balance}<br />
            {moment.now()}
          </WithdrawInfo>

          {/* Show small QR code containing UserSecret */}
          {/* <SecurityQRCode
            value={userSecret}
            level="M"
            renderAs="svg"
            color="#454746"
          /> */}
        </RightDetails>
      </Wrapper>
    </PopUp>
  )
});

WithdrawPop.propTypes = {
  balance: PropTypes.number,
  conversionRate: PropTypes.number,
  currency: PropTypes.string,
  userId: PropTypes.string.isRequired,
  userSecret: PropTypes.string,
  height: PropTypes.number.isRequired,
  onWithdraw: PropTypes.func,
};

WithdrawPop.defaultProps = {
  userSecret: '1234567890123456',
  currency: 'ETH',
  balance: 0,
  conversionRate: 0,
  onWithdraw: () => { },
};

export default WithdrawPop;
