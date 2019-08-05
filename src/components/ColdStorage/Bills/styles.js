import styled, { css } from 'styled-components/macro';
import { FlexWrapper } from '@/components-generic/Wrappers';

export const BillsWrapper = styled(FlexWrapper)`
  height: 100%;
  padding: 12px;
`;

export const BillsColumn = styled(FlexWrapper)`
  position: relative;
  flex: 1;
  height: 100%;
  margin-left: 8px;

  &:first-child {
    margin-left: 0;
  }
`;

export const Balance = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 11%;
    background-color: rgba(0,0,0,0.4);
    text-align: center;
    font-size: 2.8rem;
    font-weight: 600;
    color: white;
    opacity: ${props => props.active ? 1 : 0.39};
    transition: 0.2s;

    ${props => props.hasDot && css`
      &::after {
          content: '.';
          position: absolute;
          right: -2px;
          bottom: 0;
      }
    `}

    &:hover {
        opacity: 0.1;
    }
`;
export const SelectedCoinBalance = styled.div`
  position: absolute;
  left: 37%;
  bottom: 20px;
  background-color: rgba(0,0,0,0.8);
  font-size: 2.8rem;
  font-weight: 600;
  padding: 0 20px;
  line-height: 3rem;
  color: ${props => props.theme.palette.clrYellow};
  opacity: 1
`;