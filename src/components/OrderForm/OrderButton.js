import React from 'react';
import { compose } from 'recompose';
import styled from 'styled-components/macro';
import { withSnackBar } from '../../hocs/WithSnackBar';
import OrderGradientButton from '../../components-generic/GradientButtonSquare';

const OrderButtonText = styled.span`
    border: none !important;
    font-size: 23px;
    font-weight: ${props => (props.labelWeight ? props.labelWeight : 'bold')};
`;

const OrderButton = ({ labelWeight, transparent, isBuy, onClick, orderButtonText = 'PLACE ORDER', disabled, active }) => {
    return (
        <OrderGradientButton
            className={`${isBuy ? 'positive-solid' : 'negative-solid'} ${active ? 'active' : ''}`}
            onClick={onClick}
            disabled={disabled}
            height={40}
            transparent={transparent}
        >
            <OrderButtonText labelWeight={labelWeight}>{orderButtonText}</OrderButtonText>
        </OrderGradientButton>
    );
};

export default compose(withSnackBar)(OrderButton);
