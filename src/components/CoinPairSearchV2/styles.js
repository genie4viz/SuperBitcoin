import styled from 'styled-components/macro';

export const StyledWrapper = styled.div.attrs({ className: 'coin-pair-form-v2' })`
    position: relative;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    margin: 0;
    padding: 0;
    min-height: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
    width: ${props => props.isSearch && '100%'};

    *:focus {
        outline: none !important;
    }

    .coin-pair-form-inner-wrapper {
        flex: 1;
        position: relative;
        z-index: ${props => props.modalOpened ? 0 : 100000};
        height: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
        background-color: transparent;

        &.open {
            .exch-head {
                visibility: hidden;
                opacity: 0;
                display: none;
            }
        }
    }

    // Step 1 ===================================================================================================
    .exch-head {
        position: relative;
        display: flex;
        margin: 0;
        height: 60px;
        transition: all .5s;
        border-radius: ${props => props.theme.palette.borderRadius};
        border: 1px solid ${props => props.theme.palette.coinPairSelectBorder};
        &:hover {
            border: 1px solid ${props => props.theme.palette.coinPairSelectHoverBorder};
        }

        .exch-head__coin-pair {
            position: relative;
            display: flex;
            flex: 1;
            direction: ${props => props.isCoinPairInversed ? 'rtl' : 'ltr'};
            transition: border 0.2s ease;

            .exch-head__get,
            .exch-head__send {
                direction: ltr;
                position: relative;
                display: flex;
                flex: 1;
                padding: 0;
                height: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
                width: calc(50% - 20px);
            }

            .exch-head__send-right {
                .exch-dropdown__current {
                    > div:first-child {
                        width: calc(100% - 250px);
                        .coin-icon-wrapper {
                            width: 100%;
                            > div {
                                width: 100%;
                                p {
                                overflow-x: hidden;
                                text-overflow: ellipsis;
                                padding-right: 0;
                            }
                            }                            
                        }
                    }
                }
            }

            .exch-head__get {
                .exch-dropdown {
                    .exch-dropdown__border {
                        &:hover {
                            .exch-dropdown__current {
                                color: ${props => props.theme.palette.clrMouseClick};

                                span {
                                    color: ${props => props.theme.palette.clrMouseClick};
                                }
                            }
                        }
                    }
                }
            }

            .exch-head__switch {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                margin: 0;
                border: none;
                border-radius: ${props => props.theme.palette.borderRadius};
                // padding-bottom: 14px;
                padding: 0px 12px;
                cursor: pointer;
                background: transparent;

                &:hover {
                    .exch-head__switch-arrows,
                    .exch-form__switch-arrows {
                        stroke: ${props => props.theme.palette.coinPairSwitchBtnHoverFill};
                    }
                }

                &.switched {
                    .exch-head__switch-arrows {
                        transform: rotate(180deg);
                    }
                }

                &.shortsell {
                    cursor: initial;

                    &:hover {
                        .exch-head__switch-arrows,
                        .exch-form__switch-arrows {
                            stroke: ${props => props.theme.palette.coinPairSwitchBtnFill};
                        }
                    }
                }

                .exch-head__switch-arrows {
                    margin: 0 0 2px 0;
                    width: 38px;
                    height: 28px;
                    transition: all .3s;
                    transform: rotate(0deg);
                    stroke: ${props => props.theme.palette.coinPairSwitchBtnFill};
                    fill: none;
                }

                .exch-form__switch-arrows {
                    width: 32px;
                    height: 24px;
                    transition: all .3s;
                    transform: rotate(${props => props.isCoinPairInversed ? '180' : '0'}deg);
                    stroke: ${props => props.theme.palette.coinPairSwitchBtnFill};
                    fill: none;
                }
            }
        }
    }

    // Dropdown component =======================================================================================
    .exch-dropdown {
        position: relative;
        z-index: 8;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        transition: all 0.1s;

        &.open {
            .exch-dropdown__border {
                &:before {
                    background: ${props => props.theme.palette.coinPairSelectHoverBg};
                    border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
                }
            }

            .exch-dropdown__list {
                margin-top: 11px;
                border-top: 1px solid ${props => props.theme.palette.clrBorder};
            }

            .exch-dropdown__handle {
                .sprite-icon {
                    &.arrow {
                        display: none;
                    }

                    &.close {
                        display: block;
                    }
                }
            }
        }

        .exch-dropdown__border {
            position: relative;
            width: 100%;
            height: 100%;

            &:hover {
                &:before {
                    background: ${props => props.theme.palette.coinPairSelectHoverBg};
                }

                .exch-dropdown__current {
                    ${'' /* color: ${props => props.theme.palette.coinPairSelectHoverText2} !important; */}

                    // .exch-dropdown__title {
                    //     color: ${props => props.theme.palette.coinPairSelectHoverText2} !important;
                    //
                    //     span {
                    //         color: ${props => props.theme.palette.coinPairSelectHoverText2} !important;
                    //     }
                    // }
                }
            }
        }

        .exch-dropdown__handle {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            right: 22px;
            width: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                .sprite-icon {
                    fill: ${props => props.theme.palette.coinPairSelectHoverAddon};
                }
            }

            .sprite-icon {
                position: relative;
                width: 15px;
                height: 9px;
                fill: ${props => props.theme.palette.clrHighContrast};
                transition: all 0.2s;

                &.arrow {
                    display: block;
                }

                &.close {
                    height: 10px;
                    display: none;
                }
            }
        }

        .exch-dropdown__list-title {
            position: relative;
            display: flex;
            padding: 0 15px;
            align-items: center;
            height: 0;
            font-size: 16px;
            font-weight: 600;
            background: ${props => props.theme.palette.coinPairDropDownTitleBg};
            border-bottom: 1px solid ${props => props.theme.palette.coinPairDropDownItemBorder};
            color: ${props => props.theme.palette.coinPairDropDownTitleText};
            margin: 0 0 -1px;
        }

        .exch-dropdown__list {
            position: absolute;
            z-index: 5;
            left: -1px;
            right: 0;
            top: 100%;
            padding: 0;
            margin: 0;
            list-style: none;
            transition: all 0.2s;
            background: transparent;
            border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};

            .scrollbar-container {
                height: auto;
                max-height: 100%;
                box-shadow: 0 2px 10px rgba(0,0,0,.35);
                border: 1px solid ${props => props.theme.palette.coinPairDropDownBorder};
                border-top: 0;
                border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
                background: ${props => props.theme.palette.coinPairDropDownItemBg};
                overflow: hidden;

                .ps__rail-y {
                    opacity: 0 !important;
                    border-left: 1px solid ${props => props.theme.palette.clrInnerBorder};
                    background: ${props => props.theme.palette.coinPairDropDownScrollBg};

                    .ps__thumb-y {
                        &:before {
                            background: ${props => props.theme.palette.coinPairDropDownScrollThumb};
                        }
                        cursor: pointer;
                    }
                }
            }
        }

        .exch-dropdown__item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 15px 0 15px;
            border: none;
            width: 100%;
            height: 70px;
            font-size: 18px;
            color: ${props => props.theme.palette.coinPairDropDownItemText};
            background: ${props => props.theme.palette.coinPairDropDownItemBg};
            transition: all .2s ease;
            cursor: pointer;

            &:focus,
            &.select {
                .exch-dropdown__title {
                    color: ${props => props.theme.palette.coinPairDropDownItemActiveText};

                    span {
                        color: ${props => props.theme.palette.coinPairDropDownItemActiveText};
                    }
                }
            }

            &:hover {
                background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};
                padding-left: 20px;

                .exch-dropdown__title {
                    color: ${props => props.theme.palette.coinPairDropDownItemHoverText};

                    span {
                        color: ${props => props.theme.palette.coinPairDropDownItemHoverText};
                    }
                }

                .exch-dropdown__wedge {
                    background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};
                }

                .exch-dropdown__sliding.animation {
                    div:nth-child(1) {
                        display: block;
                    }
                    div:nth-child(2) {
                        display: none;
                    }
                }
            }

            &.current {
                background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};

                .exch-dropdown__title {
                    color: ${props => props.theme.palette.coinPairDropDownItemActiveText} !important;

                    span {
                        color: ${props => props.theme.palette.coinPairDropDownItemActiveText} !important;
                    }
                }

                & ~ .exch-deposit-wrapper {
                    .exch-deposit-input {
                        border-color: ${props => props.theme.palette.clrPurple} !important;

                        div {
                            background-color: ${props => props.theme.palette.clrPurple} !important;
                        }
                    }
                }
            }

            &.disabled,
            &:disabled {
                .overlay {
                    display: block;
                }
            }

            .overlay {
                position: absolute;
                display: none;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: rgba(0, 0, 0, .3);
                pointer-events: none;
            }
        }

        .exch-dropdown__list__rvtable-wrapper {
            width: 100%;

            .ReactVirtualized__Table__row:last-child {
                .exch-dropdown__item {
                    border-bottom: 0;
                }
            }
        }

        .exch-search__wrapper {
            height: 110px;
            width: 100%;
            background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .exch-search {
            display: flex;
            position: absolute;
            z-index: 5;
            left: 0;
            right: 0;
            top: 0;
            height: 58px;
            background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};

            &.right {
                position: relative;
                width: 100%;
                margin: 10px;
                height: 60px;
                background: ${props => props.theme.palette.coinPairSelectBg};
            }

            .exch-search__input {
                font-size: 24px;
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                color: ${props => props.theme.palette.coinPairSelectText};
                padding: 5px 10px 5px 65px;
                border: none;
                background: ${props => props.theme.palette.clrChartBackground};
                margin: auto 0;
                caret-color: white;
                caret-width: 2px;

                &::placeholder {
                    color: ${props => props.theme.palette.coinPairSelectText};
                }
            }
        }
    }

    // Came out since used in other components, needs refactoring in future
    .exch-dropdown__title {
        direction: ltr;
        padding: 0 12px;
        margin: 0;
        line-height: 1;
        font-weight: 500;
        font-size: 30px;
        white-space: nowrap;
        color: ${props => props.theme.palette.clrMouseClick};

        span {
            position: relative;
            text-transform: uppercase;
            color: ${props => props.theme.palette.clrMouseClick};
        }

        div:not([data-tooltipped]) {
            font-size: 15px;
            margin-left: 8px;

            div:nth-child(1) {
                color: ${props => props.theme.palette.clrPurple};
            }
            div:nth-child(2) {
                margin-top: 1px;
                &.minus_change {
                    color: ${props => props.theme.palette.exchBarItemMinusPrice};
                }
                &.plus_change {
                    color: ${props => props.theme.palette.exchBarItemPlusPrice};
                }
            }
        }
    }

    // Came out since exch-head is also using these
    .exch-form__btns {
        width: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
        height: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
        margin: 0 ${props => props.theme.palette.gapSize};
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .exch-form__close {
        flex: 0 0 85px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0 0 ${props => props.theme.palette.gapSize};
        border: none;
        padding: 0;
        height: calc(${props => props.theme.palette.exchHeadHeight} + 2px);
        color: #fff;
        cursor: pointer;
        text-decoration: none;
        font-size: 16px;
        font-weight: 700;
        white-space: nowrap;
        transition: all 0.1s;
        line-height: 1;
        background: ${props => props.theme.palette.coinPairCloseBtnBg};
        border-radius: ${props => props.theme.palette.borderRadius};

        .sprite-icon {
            width: 35px;
            height: 35px;
            fill: ${props => props.theme.palette.coinPairCloseBtnText};
        }

        &:hover, &:focus {
            background: ${props => props.theme.palette.coinPairCloseBtnHoverBg};

            .sprite-icon {
                fill: ${props => props.theme.palette.coinPairCloseBtnHoverText};
            }
        }

        &:active, &.active {
            background: ${props => props.theme.palette.coinPairCloseBtnActiveBg};

            .sprite-icon {
                fill: ${props => props.theme.palette.coinPairCloseBtnActiveText};
            }
        }
    }

    .exch-form__submitv2 {
         cursor: pointer;
         &.progress {
            border: 1px solid ${props => props.theme.palette.clrBorder};
         }

        .btn-text, .btn-text-done {
            color: #fff;
            text-decoration: none;
            font-size: 22px;
            letter-spacing: 1.1px;
            font-weight: 600;
            white-space: nowrap;
            justify-content: center;
            line-height: 1;
        }

        .exch-form__progress {
            display: none;
            color: ${props => props.theme.palette.coinPairNextBtnText};
            z-index: 1;
            margin-top: 2px;

            > img {
                width: 20%;
            }
        }
    }

    // Others ===================================================================================================
    .hidden {
        display: none !important;
    }

    .appstore-btn-wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
    }
`;

export const EqualSymbol = styled.div`
    height: 60px;
    line-height: 60px;
    font-size: 40px;
    font-weight: 700;
    color: ${props => props.theme.palette.clrBorder};
`;
