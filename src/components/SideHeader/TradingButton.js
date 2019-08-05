/**
 * Trading button component for switching trade mode in settings menu
 */
import React from 'react';
import styled from 'styled-components/macro';

const TradingButtonWrapper = styled.div`
    display: flex;
    width: 48%;
    border: ${props => `1px solid ${!props.disabled
        ? props.theme.palette.userMenuPopupMenuItemBorder
            : props.theme.palette.userMenuPopupMenuItemHover}`};
    border-radius: 3px;
    padding: 10px 0;
    background: ${props => props.disabled
        ? props.theme.palette.userMenuPopupMenuItemHoverBg
            : ''};
    color:  ${props => !props.disabled
        ? props.theme.palette.userMenuPopupMenuItem
            : props.theme.palette.userMenuPopupMenuItemHover};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s ease;

    .icon-wrapper {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        border: none;
        padding: 0;
        width: 68px;
        height: 100%;

        svg, svg * {
            fill: ${props => !props.disabled
                ? props.theme.palette.userMenuPopupMenuItem
                    : props.theme.palette.userMenuPopupMenuItemHover};
        }
    }

    &:hover {
        background: ${props => props.theme.palette.userMenuPopupMenuItemHoverBg};
        color: ${props => props.theme.palette.userMenuPopupMenuItemHover};
        padding-left: 5px;

        .icon-wrapper {
            svg, svg * {
                fill: ${props => props.theme.palette.userMenuPopupMenuItemHover};
            }
        }
    }
`;

const ButtonTitle = styled.span`
    font-size: 24px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 10px;
`;

const ButtonDescription = styled.span`
    font-size: 16px;
    font-weight: 400;
    text-transform: uppercase;
`;

const TradingButton = (props) => {
    const { children, title, description, disabled, onTradeClick } = props;

    return (
        <TradingButtonWrapper onClick={onTradeClick} role="button" disabled={disabled}>
            {children}
            <div className="d-flex flex-column">
                <ButtonTitle>{title}</ButtonTitle>
                <ButtonDescription>{description}</ButtonDescription>
            </div>
        </TradingButtonWrapper>
    );
};

export default TradingButton;
