import React, { useState } from 'react';
import styled from 'styled-components/macro';
import OrderRow from './OrderRow';
import OrderButton from './OrderButton';
import DataLoader from '../../components-generic/DataLoader';

const Wrapper = styled.div.attrs({ className: 'order-container' })`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px 15px;
    width: 50%;
    
    & + & {
        border-left: 1px solid ${props => props.theme.palette.clrBorder}7f;
    }
`;
let animate = false;
const OrderContainer = ({ isBuy, animation, activeCoin }) => {
    const [buttonAnimate, setButtonAnimate] = useState(false);
    const [orderButtonText, setOrderButtonText] = useState(`${isBuy ? 'Buy' : 'Sell'} ${(activeCoin || '').replace('F:', '')}`);
    const buttonAnimation = !animate && (isBuy ? (animation === 1) : (animation === 3));
    if (buttonAnimation) {
		animate = true;
		setButtonAnimate(true);
        setTimeout(() => {
			setButtonAnimate(false);
			setTimeout(() => {
				setOrderButtonText(<DataLoader width={20} height={20}/>);
			}, 350);
			setTimeout(() => {
				setOrderButtonText(`${isBuy ? 'Buy' : 'Sell'} ${(activeCoin || '').replace('F:', '')}`);
			}, 2300);
		}, 350);
		setTimeout(() => {
			animate = false;
		}, 6000);
    }
    return (
		<Wrapper>
			<OrderRow isBuy={isBuy} animation={animation} isLeft />
			<OrderRow isBuy={isBuy} animation={animation} />
			<OrderButton
				active={buttonAnimate}
				isBuy={isBuy}
				onClick={() => {}}
				orderButtonText={orderButtonText}
			/>
		</Wrapper>
	);
};

export default OrderContainer;