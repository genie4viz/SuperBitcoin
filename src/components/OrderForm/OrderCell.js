import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import styled, { css, keyframes } from 'styled-components/macro';

import { STORE_KEYS } from '@/stores';
import { customDigitFormat } from '@/utils';

const heightIncAnimation = keyframes`
    0% { height: 0; }
    40% { height: 0; }
    100% { height: 100%; }
`;

const heightDecAnimation = keyframes`
    0% { height: 100%; }
    40% { height: 100%; }
    100% { height: 0; }
`;

const widthIncAnimation = keyframes`
	0% { width: 0; }
    50% { width: 0; }
    100% { width: 100%; }
`;

const widthDecAnimation = keyframes`
    0% { width: 100%; }
    50% { width: 0; }
    100% { width: 0; }
`;

const getAnimationStyle = (isBuy, isLeft, animation, theme, isHover) => {
    if (isBuy && isLeft) {
        switch (animation) {
            case 1:
                return isHover ? css`
                height: 100%;
                top: unset;
                bottom: 0;
                animation: ${heightIncAnimation} 3s linear;
                .content {
                    top: unset;
                    bottom: 0;
                    * {
                        color: ${theme.palette.btnPositiveBg};
                    }
                }` : '';
            case 2:
                return css`
                height: 100%;
                left: unset;
                right: 0;
                animation: ${widthDecAnimation} 3s linear;
                .content {
                    left: unset;
                    right: 0;
                    * {
                        color: ${theme.palette.btnPositiveBg};
                    }
                }`;
            case 3:
                return css`
                display: none;
                `;
            case 4:
                return css`
                height: 100%;
                left: unset;
                right: 0;
                animation: ${widthIncAnimation} 3s linear;
                .content {
                    left: unset;
                    right: 0;
                }`;
            default:
                return '';
        }
    }
    if (isBuy && !isLeft) {
        switch (animation) {
            case 1:
                return isHover ? css`
                height: 0;
                top: 0;
                animation: ${heightDecAnimation} 3s linear;
                .content {
                    top: 0;
                    * {
                        color: ${theme.palette.btnPositiveBg};
                    }
                }` : '';
            case 2:
                return css`
                height: 100%;
                left: unset;
                right: 0;
                animation: ${widthDecAnimation} 3s linear;
                .content {
                    left: unset;
                    right: 0;
                }`;
            case 3:
                return css`
                display: none;
                `;
            case 4:
                return css`
                height: 100%;
                left: unset;
                right: 0;
                animation: ${widthIncAnimation} 3s linear;
                .content {
                    left: unset;
                    right: 0;
                    * {
                        color: ${theme.palette.btnPositiveBg};
                    }
                }`;
            default:
                return '';
        }
    }
    if (!isBuy && isLeft) {
        switch (animation) {
            case 1:
                return css`
                display: none;
                `;
            case 2:
                return css`
                height: 100%;
                left: 0;
                animation: ${widthIncAnimation} 3s linear;
                .content {
                    left: 0;
                    * {
                        color: ${theme.palette.btnNegativeBg};
                    }
                }`;
            case 3:
                return isHover ? css`
                height: 100%;
                top: unset;
                bottom: 0;
                animation: ${heightDecAnimation} 3s linear;
                .content {
                    top: unset;
                    bottom: 0;
                    * {
                        color: ${theme.palette.btnNegativeBg};
                    }
                }` : '';
            case 4:
                return css`
                height: 100%;
                left: 0;
                animation: ${widthDecAnimation} 3s linear;
                .content {
                    left: 0;
                }`;
            default:
                return '';
        }
    }
    if (!isBuy && !isLeft) {
        switch (animation) {
            case 1:
                return css`
                display: none;
                `;
            case 2:
                return css`
                height: 100%;
                left: 0;
                animation: ${widthIncAnimation} 3s linear;
                .content {
                    left: 0;
                }`;
            case 3:
                return isHover ? css`
                height: 0;
                top: 0;
                animation: ${heightIncAnimation} 3s linear;
                .content {
                    top: 0;
                    * {
                        color: ${theme.palette.btnNegativeBg};
                    }
                }` : '';
            case 4:
                return css`
                height: 100%;
                left: 0;
                animation: ${widthDecAnimation} 3s linear;
                .content {
                    left: 0;
                    * {
                        color: ${theme.palette.btnNegativeBg};
                    }
                }`;
            default:
                return '';
        }
    }
};

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    ${props => getAnimationStyle(props.isBuy, props.isLeft, props.animation, props.theme, props.isHover)}
`;

const Content = styled.div.attrs({ className: 'content' })`
    width: ${props => props.width - 4}px;
    height: 36px;
    position: absolute;
    padding: 5px 10px;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const InputValue = styled.input`
    width: calc(100% - 50px);
    height: 100%;
    background: ${props => props.theme.palette.clrMainWindow};
    color: ${props => props.theme.palette.clrMouseClick};
    border: 0;
    outline: 0;
    font-size: 22px;
    font-weight: 600;
`;

const Symbol = styled.span`
    width: 50px;
    background: ${props => props.theme.palette.clrMainWindow};
    color: ${props => props.theme.palette.clrMouseClick};
    font-size: 22px;
    font-weight: 600;
    text-align: right;
`;

const OrderCell = ({ isBuy, isLeft, animation, isHover, hStep1, hStep2, hStep3, hStep4, activeCoin, activeCoinETHRate, width }) => {
	const symbol = isLeft ? (activeCoin || '').replace('F:', '') : 'BTC';
    let value;
    if (isBuy && isLeft) {
        value = hStep2 * activeCoinETHRate;
    }
	if (isBuy && !isLeft) {
		value = hStep1;
	}
	if (!isBuy && isLeft) {
		value = hStep3 * activeCoinETHRate;
	}
	if (!isBuy && !isLeft) {
		value = hStep4;
	}
	value = customDigitFormat(value, 9);
    return (
		<Wrapper animation={animation} isBuy={isBuy} isLeft={isLeft} isHover={isHover}>
			<Content width={width}>
                <InputValue type="text" value={value} onChange={() => {}} />
                <Symbol>{symbol}</Symbol>
            </Content>
		</Wrapper>
	);
};

export default compose(
	inject(STORE_KEYS.ARBITRAGESTORE),
	observer,
	withProps(
		({
			[STORE_KEYS.ARBITRAGESTORE]: { hStep1, hStep2, hStep3, hStep4, activeCoin, activeCoinETHRate },
		}) => ({
            hStep1,
            hStep2,
            hStep3,
            hStep4,
            activeCoin,
			activeCoinETHRate,
		})
	)
)(OrderCell);
