import React from 'react';
import styled from 'styled-components/macro';

const GradientButtonStyleWrapper = styled.button.attrs({ className: 'gradient-button' })`
    position: ${props => (props.isSimple ? 'absolute' : 'relative')};
    overflow: hidden;
    padding: 0;
    margin: 0 auto;
    width: ${props => props.width ? (`${props.width}px`) : '100%'};
    height: ${props => props.height ? props.height : '30'}px;
    top: ${props => props.isSimple ? '0px' : ''};
    left: ${props => props.isSimple ? '0px' : ''};
    border: none;
    border-radius: 3px;
    background: transparent;
    outline: none !important;
    cursor: pointer;
    ${props => (props.isSimple ? 'display: flex' : '')};
    ${props => (props.isSimple ? 'justify-content: center' : '')};
    .gradient-button__label {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 1em;
        color: white;
        font-weight: 400;
        z-index: 2;
        ${props => (props.isSimple ? 'width: 45px' : '')};
        ${props => (props.isSimple ? 'height: 45px' : '')};
        position: ${props => (props.isSimple ? 'relative' : 'absolute')};
        &:hover {
              ${props => (props.isSimple ? `background: ${props.theme.palette.clrBorderHover}` : '')};
              ${props => (props.isSimple ? 'border-radius: 50%' : '')};
        }  
        svg {
            height: 30px;
            width: 30px;
            fill: white;
        }
    }

    @media only screen and (max-width : 1550px) {
        .gradient-button__label > span {
            font-size: 20px;
        }
    }

    @media only screen and (max-width : 550px) {
        .gradient-button__label > span {
            font-size: 18px;
        }
    }
    
    .gradient-button__content {
        position: absolute;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        overflow: hidden;
        background: ${props =>
            props.header
                ? 'inherit'
                : props.red
                ? props.theme.palette.gradientBtnCloseBg
                : props.theme.palette.gradientBtnNextBg};
        border: none;
        border-radius: 3px;
        z-index: 1;
        
        .gradient-button__content__glow {
            position: absolute;
            opacity: .4;
            top: -40%;
            left: -15%;
            right: -15%;
            bottom: 50%;
            background: radial-gradient(ellipse at center, rgba(255,255,255,.5) 0%, rgba(255,255,255,1) 100%);
            border-radius: 50%;
            transform-origin: bottom right;
            z-index: 3;
        }
    }
    
    &:hover, &:focus {
        .gradient-button__content {
            background: ${props =>
                props.header
                    ? 'inherit'
                    : props.red
                    ? props.theme.palette.gradientBtnCloseHoverBg
                    : props.theme.palette.gradientBtnNextHoverBg};
            .gradient-button__content__glow {
                opacity: .5;
            }
        }
    }
    
    &.exchange-progress {
        cursor: pointer;

        .gradient-button__content {
            background: transparent;
        }
        .gradient-button__content__glow {
            background: transparent;
        }
    }
    
    &[disabled], &.progress, &.completed {
        cursor: url('/img/not-allowed1.cur'), not-allowed !important;

        .gradient-button__label {
            &, & * {
                color: ${props => props.theme.palette.coinPairSelectText2} !important;
                // border: 1px ${props => props.theme.palette.orderFormSellBtnDisabledText} solid;
                
                svg {
                    fill: ${props => props.theme.palette.coinPairSelectText2} !important;
                }
            }
        }

        .gradient-button__content {
            // background: ${props => props.theme.palette.orderFormSellBtnDisabledBg};
        
            &:before {
                background: ${props => props.theme.palette.coinPairSelectBg};
            }
            
            &:after {
                background: ${props => props.theme.palette.coinPairSelectBg};
            }
            
            .gradient-button__content__glow {
                opacity: .05;
            }
        }
    }
    
    &.primary-solid {
        .gradient-button__label {
            &, & * {
                color: ${props => props.theme.palette.coinPairNextBtnText};
                
                svg {
                    fill: ${props => props.theme.palette.coinPairNextBtnText};
                }
            }
        }
        
        .gradient-button__content {
             background: ${props => (props.header ? 'inherit' : props.theme.palette.coinPairNextBtnBg)};

            .gradient-button__content__glow {
                opacity: 0 !important;
            }
        }
        
        // &:hover, &:focus {
        //     .gradient-button__label {
        //         &, & * {
        //             color: ${props => props.theme.palette.btnPrimaryHoverText};
        //         }
        //     }
        //    
        //     .gradient-button__content {
        //         background: ${props => props.theme.palette.btnPrimaryHoverBg};
        //     }
        // }
        
        &:active, &.active {
            .gradient-button__label {
                &, & * {
                    color: ${props => props.theme.palette.coinPairNextBtnActiveText};
                
                    svg {
                        fill: ${props => props.theme.palette.coinPairNextBtnActiveText};
                    }
                }
            }
            
            .gradient-button__content {
                background: ${props => (props.header ? 'inherit' : props.theme.palette.coinPairNextBtnActiveBg)};
            }
        }

        &.completed {
            .gradient-button__label {
                &, & * {
                    color: ${props => props.theme.palette.coinPairNextBtnText};
                
                    svg {
                        fill: ${props => props.theme.palette.coinPairNextBtnText};
                    }
                }
            }
    
            .gradient-button__content {
                background: ${props => props.theme.palette.coinPairNextBtnText};
            }
        }
        
        &[disabled], &.progress {
            .gradient-button__label {
                &, & * {
                    color: ${props => props.theme.palette.coinPairSelectText2} !important;
                
                    svg {
                        fill: ${props => props.theme.palette.coinPairSelectText2} !important;
                    }
                }
            }
    
            .gradient-button__content {
                background: ${props => (props.header ? 'inherit' : props.theme.palette.coinPairSelectBg)};
            }
        }
    }

    &.positive-solid {
        background-color: ${props => props.theme.palette.btnPositiveBg};
        background-image: -webkit-linear-gradient(top,rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.05) 80%);
        border-radius: 6px;
        // box-shadow: inset rgba(0,0,0,0.2) 0px 5px 6px;
        height: 50px;
        
        .gradient-button__label {
            &, & * {
                /* color: ${props => props.theme.palette.coinPairDoneBtnText}; */
            
                svg {
                    fill: ${props => props.theme.palette.coinPairDoneBtnText};
                    height: 30px;
                }
            }
            span {
                color: ${props => props.theme.palette.btnPositiveText} !important;
                text-shadow: 0px 1px 0px ${props => props.theme.palette.btnPositiveHoverText};
            }
        }
        
        .gradient-button__content {
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            border-radius: 4px;
            background-image: -webkit-linear-gradient(top, #132c27, #132c27 20%, #010111 100%);
            background-color: #132c27;
            background-repeat: no-repeat;
            box-shadow: rgba(0,0,0,.4) 0 0px 6px 2px;

            .gradient-button__content__glow {
                opacity: 0 !important;
            }
        }
        
        &:not([disabled]) {
            &:hover {
                .gradient-button__label {
                    &, & * {
                        /* color: ${props => props.theme.palette.btnPositiveHoverText}; */
                    
                        svg {
                            fill: ${props => props.theme.palette.btnPositiveHoverText};
                        }
                    }
                }
                
                .gradient-button__content {
                    /* background-color: ${props => props.theme.palette.btnPositiveHoverBg}; */
                }
            }
            
            &:active, &.active {
                .gradient-button__label {
                    &, & * {
                        /* color: ${props => props.theme.palette.btnPositiveActiveText}; */
                    
                        svg {
                            fill: ${props => props.theme.palette.btnPositiveActiveText};
                        }
                    }
                    span {
                        font-size: 18px;
                    }
                }
                
                .gradient-button__content {
                    /* background-color: ${props => props.theme.palette.btnPositiveActiveBg}; */
                    top: 3px;
                    left: 3px;
                    right: 3px;
                    bottom: 3px;
                    box-shadow: inset rgba(0,0,0,.4) 0px 1px 4px;
                }
            }
        }

        &.completed {
            .gradient-button__label {
                &, & * {
                    /* color: ${props => props.theme.palette.coinPairDoneBtnText}; */
                
                    svg {
                        fill: ${props => props.theme.palette.coinPairDoneBtnText};
                    }
                }
            }
    
            .gradient-button__content {
                /* background-color: ${props => props.theme.palette.coinPairDoneBtnBg}; */
            }
        }
        
        &[disabled], &.progress {
            background-image: -webkit-linear-gradient(top,rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.45) 80%);

            .gradient-button__label {
                &, & * {
                    /* color: ${props => props.theme.palette.orderFormInputDisabledText}; */
                
                    svg {
                        fill: ${props => props.theme.palette.coinPairDoneBtnText};
                    }
                }
            }
    
            .gradient-button__content {
                /* background-color: #0a362f; */
            }
        }
    }

    &.negative-solid {
        background-color: ${props => props.theme.palette.btnNegativeBg};
        background-image: -webkit-linear-gradient(top,rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.05) 80%);
        border-radius: 6px;
        // box-shadow: inset rgba(0,0,0,0.2) 0px 5px 6px;
        height: 50px;
        
        .gradient-button__label {
            &, & * {
                /* color: ${props => props.theme.palette.btnNegativeText}; */
            
                svg {
                    fill: ${props => props.theme.palette.btnNegativeText};
                }
            }

            span {
                color: ${props => props.theme.palette.btnNegativeText} !important;
                text-shadow: 0px 1px 0px ${props => props.theme.palette.btnNegativeHoverText};
            }
        }
        
        .gradient-button__content {
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            border-radius: 4px;
            background-image: -webkit-linear-gradient(top, #081d41, #081d41 20%, #010111 100%);
            background-color: #081d41;
            background-repeat: no-repeat;
            box-shadow: rgba(0,0,0,.4) 0 0px 6px 2px;

            .gradient-button__content__glow {
                opacity: 0 !important;
            }
        }
        
        &:not([disabled]) {
            &:hover {
                .gradient-button__label {
                    &, & * {
                        /* color: ${props => props.theme.palette.btnNegativeHoverText}; */
                    
                        svg {
                            fill: ${props => props.theme.palette.btnNegativeHoverText};
                        }
                    }
                }
                
                .gradient-button__content {
                    /* background-color: ${props => props.theme.palette.btnNegativeHoverBg}; */
                }
            }
            
            &:active, &.active {
                .gradient-button__label {
                    &, & * {
                        /* color: ${props => props.theme.palette.btnNegativeActiveText}; */
                    
                        svg {
                            fill: ${props => props.theme.palette.btnNegativeActiveText};
                        }
                    }
                    span {
                        font-size: 18px;
                    }
                }
                
                .gradient-button__content {
                    /* background-color: ${props => props.theme.palette.btnNegativeActiveBg}; */
                    top: 3px;
                    left: 3px;
                    right: 3px;
                    bottom: 3px;
                    box-shadow: inset rgba(0,0,0,.4) 0px 1px 4px;
                }
            }
        }
        
        &.completed {
            .gradient-button__label {
                &, & * {
                    /* color: ${props => props.theme.palette.btnNegativeText}; */
                
                    svg {
                        fill: ${props => props.theme.palette.btnNegativeText};
                    }
                }
            }
    
            .gradient-button__content {
                /* background-color: ${props => props.theme.palette.btnNegativeBg}; */
            }
        }
        
        &[disabled], &.progress {
            // background-image: -webkit-linear-gradient(top,rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.45) 80%);

            .gradient-button__label {
                &, & * {
                    /* color: ${props => props.theme.palette.orderFormInputDisabledText} !important; */
                
                    svg {
                        fill: ${props => props.theme.palette.coinPairDoneBtnText} !important;
                    }
                }
            }
    
            .gradient-button__content {
                /* background-color: #0a315c; */
            }
        }
    }
    
    &.search-btn .gradient-button__content {
        background: ${props => (props.header ? 'inherit' : props.theme.palette.clrBlue)};
    }
    &.search-btn:hover .gradient-button__content {
        background: ${props => (props.header ? 'inherit' : props.theme.palette.clrDarkBlue)};
    }
`;

const OrderGradientButton = ({ transparent, children, width, height, red, header, ...props }) => (
    <GradientButtonStyleWrapper
        width={width}
        height={height}
        red={red}
        header={header}
        transparent={transparent}
        {...props}
    >
        <div className="gradient-button__label">{children}</div>
        <div className="gradient-button__content">
            <div className="gradient-button__content__glow" />
        </div>
    </GradientButtonStyleWrapper>
);

export default OrderGradientButton;
