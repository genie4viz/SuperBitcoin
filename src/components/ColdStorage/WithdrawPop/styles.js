import QRCode from 'qrcode.react';
import styled from 'styled-components/macro';
import { FlexWrapper, Content } from '@/components-generic/Wrappers';
import { BILL_RIGHT_GAP_RATIO } from '@/config/constants';

/**
 * Left details container styles
 * |                                                    |
 * |  QRRRRRRRRRRRRRRRRRRQ                              |
 * |  RRRRRRRRRRRRRRRRRRRR                              |
 * |  RRRRRRRRRRRRRRRRRRRR                              |
 * |  RRRRRRRRRRRRRRRRRRRR                              |
 * |  RRRRRRRRRRRRRRRRRRRR                              |
 * |  RRRRRRRRRRRRRRRRRRRR                              |
 * |  RRRRRRRRRRRRRRRRRRRR                              |
 * |  QRRRRRRRRRRRRRRRRRRQ                              |
 * |                                                    |
 * |  BTC ADDRESS INPUT                                 |
 * |  AMOUNT SLIDER----------------------Withdraw       |
 * |                                                    |
 */
export const LeftDetails = styled(FlexWrapper).attrs({
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})`
  flex: 1;
  height: 100%;
  padding: 16px 30px 16px 16px;
`;


export const GuideQRCode = styled(QRCode)`
  margin-bottom: auto;
  max-height: 100%;
`;

export const WithdrawAmount = styled.div`
  font-size: 60px;
  color: ${props => props.theme.palette.clrDarkPurple};
`;

export const WithdrawForm = styled(FlexWrapper)`
  width: 100%;
`;

export const InputArea = styled(Content)`
  flex: 1;
`;

export const BTCAddressInput = styled.input.attrs({
  placeholder: 'Enter BTC Wallet Address',
  type: 'text',
})`
  width: 100%;
  height: 46px;
  padding: 10px 10px 15px;
  background: ${props => props.theme.palette.clrDarkPurple};
  border: 0;
  font-size: 18px;
  color: ${props => props.theme.palette.contrastText};

  &:focus {
      outline: none;
  }

  &::placeholder {
      color: ${props => props.theme.palette.depositText};
  }
`;

export const AmountSlider = styled.div`
  position: absolute;
  left: -3px;
  right: -3px;
  bottom: -14px;
`;

export const WithdrawButton = styled.button`
  width: 150px;
  height: 46px;
  border-radius: 0;
  border: none;
  background-color: ${props => props.theme.palette.clrPurple};
  color: white;
`;

/**
 * Right details container styles
 * |              |
 * |       D  A   |
 * |       A  M   |
 * |       T  O   |
 * |       E  U   |
 * |          N   |
 * |          T   |
 * |              |
 * |   Security   |
 * |     code     |
 * |  QRRRRRRRRQ  |
 * |  RRRRRRRRRR  |
 * |  RRRRRRRRRR  |
 * |  QRRRRRRRRQ  |
 * |              |
 */
export const RightDetails = styled(FlexWrapper).attrs({
  flexDirection: 'column',
  justifyContent: 'flex-end',
})`
  position: relative;
  width: ${BILL_RIGHT_GAP_RATIO * 100}%;
  height: 100%;
  padding: 12px;
`;

export const WithdrawInfo = styled.div`
  position: absolute;
  transform-origin: top left;
  color: black;
  left: 80%;
  top: 16px;
  font-size: 20px;
  transform: rotate(90deg);
`;

export const SecurityQRCode = styled(QRCode)`
  width: calc(100% - 24px);
`;
