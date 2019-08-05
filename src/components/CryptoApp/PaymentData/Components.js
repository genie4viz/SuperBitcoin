import styled from 'styled-components/macro';

export const PaymentDataWrapper = styled.div.attrs({ className: 'payment-data-wrapper' })`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    font-size: ${props => props.billHeight > 0 ? `${props.billHeight / 50}px` : 0};

    .corner-text {
        position: absolute;
        z-index: 99;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ebebe1;

        &.usd_1 {
            span {
                background: white;
                -webkit-text-stroke: 0.4px black;
                -webkit-background-clip: text;
                &::after {
                    content: attr(data-text);
                    position: absolute;
                    -webkit-text-stroke: 1px white;
                    left: 0;
                    top 0;
                    z-index: -2;
                    text-shadow: 2px 1px 1px rgba(0,0,0,0.7);
                }

                &.fixed {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: 40px;
                    right: 5px;
                    font-size: 0.3em;
                    text-align: left;
                }
            }
            &.left-corner {
                font-family: 'ARB-187 Modern Caps';
                font-size: 3em;
                span {
                    transform: rotateZ(90deg) scale(1, 1);
                }
                &.cent {
                    font-size: 1em;
                    line-height: 1em;
                    text-align: center;
                    span {
                        transform: rotateZ(90deg) scale(0.9, 1);
                        padding-bottom: 0.5em;
                    }
                }
            }
            &.right-corner {
                font-family: 'ARB-187 Modern Caps';
                font-size: 3em;
                span {
                    transform: rotateZ(90deg) scale(1, 1.4);
                }
                &.cent {
                    font-size: 1em;
                    line-height: 1em;
                    text-align: center;
                    span {
                        transform: rotateZ(90deg) scale(0.8, 1.4);
                        padding-bottom: 0.5em;
                    }
                }
            }
        }
        &.usd_10 {
            span {
                background: white;
                -webkit-text-stroke: 0.6px black;
                -webkit-background-clip: text;
                &::after {
                    content: attr(data-text);
                    position: absolute;
                    -webkit-text-stroke: 1.4px white;
                    left: 0;
                    z-index: -2;
                    text-shadow: 2px 1px 1px rgba(0,0,0,0.7);
                }
            }
            &.left-corner {
                font-family: 'Century Ultra Condensed';
                font-size: 3.4em;
                span {
                    transform: rotateZ(90deg) scale(1, 1);
                }
            }
            &.right-corner {
                font-family: 'Bernard MT Condensed';
                font-size: 4em;
                letter-spacing: -0.05em;
                span {
                    transform: rotateZ(90deg) scale(1, 1.4);
                }
            }
        }
        &.usd_100 {
            span {
                text-shadow: 3px 2px 1px rgba(0,0,0,0.7);
            }
            &.left-corner {
                font-family: 'Europa Grotesque Extra Bold';
                font-size: 2.5em;
                span {
                    transform: rotateZ(90deg) scale(1.2, 1.1);
                }
            }
            &.right-corner {
                font-family: 'Europa Grotesque Extra Bold';
                font-size: 3.5em;
                span {
                    transform: rotateZ(90deg) scale(1, 1);
                }
            }
        }
        &.usd_1000 {
            span {
                text-shadow: 2px 1px 1px rgba(0,0,0,0.7);
            }
            &.left-corner {
                font-family: 'Europa Grotesque Extra Bold';
                font-size: 2.5em;
                span {
                    transform: rotateZ(90deg) scale(1, 2);
                }
            }
            &.right-corner {
                font-family: 'Bernard MT Condensed';
                font-size: 2.5em;
                font-weight: bold;
                .char-0 {
                    transform: skew(0deg, -35deg) scale(1.2, 1);
                    padding-top: 15px;
                }
                .char-1 {
                    transform: skew(0deg, -20deg) scale(1.2, 1);
                    padding-top: 2px;
                }
                .char-2 {
                    transform: skew(0deg, -5deg) scale(1.2, 1);
                }
                .char-3 {
                    transform: skew(0deg, 15deg) scale(1.2, 1);
                    padding-top: 8px;
                }    
            }
            div {
                position: 'relative',
                display: 'inline-block',
                padding-right: 0.5px;
            }
        }
        &.usd_10000 {
            &.left-corner {
                font-family: 'Europa Grotesque Extra Bold';
                font-size: 3em;
                span {
                    transform: rotateZ(90deg) scale(0.5, 0.8);
                    text-shadow: 3px 2px 1px rgba(0,0,0,0.7);
                }
                &.corner-text-len-6 span {
                    transform: rotateZ(90deg) scale(0.9, 0.8);
                }
                &.corner-text-len-7 span {
                    transform: rotateZ(90deg) scale(0.8, 0.8);
                }
                &.corner-text-len-9 span {
                    transform: rotateZ(90deg) scale(0.65, 0.8);
                }
                &.corner-text-len-10 span {
                    transform: rotateZ(90deg) scale(0.55, 0.8);
                }
            }
            &.right-corner {
                font-family: 'Bernard MT Condensed';
                font-size: 2.5em;
                transform: rotateZ(90deg) scale(0.6, 1.2);
                span {
                    background: -webkit-linear-gradient(black, #fbfaf5);
                    -webkit-text-stroke: 1px white;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    &::after {
                        content: attr(data-text);
                        left: 0;
                        z-index: -1;
                        position: absolute;
                        text-shadow: 3px 2px 1px rgba(0,0,0,0.7);
                    }
                }
                &.corner-text-len-6 {
                    transform: rotateZ(90deg) scale(1, 1.2);
                }
                &.corner-text-len-7 {
                    transform: rotateZ(90deg) scale(0.8, 1.2);
                }
                &.corner-text-len-9 {
                    transform: rotateZ(90deg) scale(0.7, 1.2);
                }
                &.corner-text-len-10 {
                    transform: rotateZ(90deg) scale(0.65, 1.2);
                }
            }
        }
        &.usd_100000 {
            span {
                background: white;
                -webkit-text-stroke: 0.6px black;
                -webkit-background-clip: text;
                &::after {
                    content: attr(data-text);
                    position: absolute;
                    -webkit-text-stroke: 1.4px white;
                    left: 0;
                    z-index: -2;
                    text-shadow: 2px 1px 1px rgba(0,0,0,0.7);
                }
            }
            &.left-corner {
                font-family: 'Century Ultra Condensed';
                font-size: 3em;
                span {
                    transform: rotateZ(90deg) scale(0.5, 1);
                }
                &.corner-text-len-7 span {
                    transform: rotateZ(90deg) scale(0.85, 1);
                }
                &.corner-text-len-9 span {
                    transform: rotateZ(90deg) scale(0.7, 1);
                }
                &.corner-text-len-10 span {
                    transform: rotateZ(90deg) scale(0.6, 1);
                }
                &.corner-text-len-11 span {
                    transform: rotateZ(90deg) scale(0.5, 1);
                }
            }
            &.right-corner {
                font-family: 'Bernard MT Condensed';
                font-size: 3em;
                letter-spacing: -0.05em;
                span {
                    transform: rotateZ(90deg) scale(0.7, 0.7);
                }
                &.corner-text-len-7 span {
                    transform: rotateZ(90deg) scale(1.2, 0.7);
                }
                &.corner-text-len-9 span {
                    transform: rotateZ(90deg) scale(1, 0.7);
                }
                &.corner-text-len-10 span {
                    transform: rotateZ(90deg) scale(0.9, 0.7);
                }
                &.corner-text-len-11 span {
                    transform: rotateZ(90deg) scale(0.75, 0.7);
                }
            }
        }
    }

    .amount-text {
        position: absolute;
        z-index: 2;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Federal Regular';
        color: #ebebe1;

        span {
            white-space: pre;
            -webkit-text-stroke: 0.5px black;
            text-shadow: 1px 1px 0px rgba(0,0,0,0.7)
        }
    }

    .status-text {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotateZ(90deg) scale(1, 1);
        font-family: 'Tungsten Medium';
        font-size: 2em;
        // letter-spacing: 0.16em;
        color: #f9ac04;
    }

    .highlight-text {
        font-size: 1.1em !important;
        left: calc(10.5% - 25px) !important;
        .detail-3 {
            transform: rotateZ(90deg) scale(2, 1) !important;
        }
        .detail-4 {
            transform: rotateZ(90deg) scale(2, 1) !important;
        }
        .detail-5 {
            transform: rotateZ(90deg) scale(2, 1) !important;
        }
        .detail-6 {
            transform: rotateZ(90deg) scale(1, 1) !important;
        }
        .detail-7 {
            transform: rotateZ(90deg) scale(0.9, 1) !important;
        }
        .detail-8 {
            transform: rotateZ(90deg) scale(0.75, 1) !important;
        }
        .detail-9 {
            transform: rotateZ(90deg) scale(0.65, 1) !important;
        }
        span {
            transform: rotateZ(90deg) scale(0.9, 0.5) !important;
            text-align: center;
            line-height: 90%;
            text-shadow: 0.2px 0.2px 1px black;
            -webkit-text-stroke: 0.2px black;
        }
    }
`;

export const CornerTopLeft = styled.div.attrs({ className: 'payment-data-corner--top-left corner-text left-corner' })`
    &.usd_1 {
        left: calc(14% - 25px);
        top: calc(8.1% - 25px);
    }
    &.usd_10 {
        left: calc(9% - 25px);
        top: calc(8.1% - 25px);
    }
    &.usd_100 {
        left: calc(9.5% - 25px);
        top: calc(7.5% - 25px);
        &.android {
            left: calc(12% - 25px);
        }
    }
    &.usd_1000 {
        left: calc(10% - 25px);
        top: calc(8.3% - 25px);
        &.android {
            left: calc(15% - 25px);
        }
    }
    &.usd_10000 {
        left: calc(6.5% - 25px);
        top: calc(8.8% - 25px);
        &.android {
            left: calc(9% - 25px);
        }
    }
    &.usd_100000 {
        left: calc(11% - 25px);
        top: calc(12.5% - 25px);
    }
`;

export const CornerBottomLeft = styled.div.attrs({ className: 'payment-data-corner--bottom-left corner-text left-corner' })`
    &.usd_1 {
        left: calc(14% - 25px);
        bottom: calc(7.9% - 25px);
    }
    &.usd_10 {
        left: calc(9% - 25px);
        bottom: calc(8.8% - 25px);
    }
    &.usd_100 {
        left: calc(9.5% - 25px);
        bottom: calc(8.7% - 25px);
        &.android {
            left: calc(12% - 25px);
        }
    }
    &.usd_1000 {
        left: calc(10% - 25px);
        bottom: calc(8% - 25px);
        &.android {
            left: calc(15% - 25px);
        }
    }
    &.usd_10000 {
        left: calc(6.5% - 25px);
        bottom: calc(9% - 25px);
        &.android {
            left: calc(9% - 25px);
        }
    }
    &.usd_100000 {
        left: calc(11% - 25px);
        bottom: calc(12.5% - 25px);
    }
`;

export const CornerTopRight = styled.div.attrs({ className: 'payment-data-corner--top-right corner-text right-corner' })`
    &.usd_1 {
        right: calc(24% - 25px);
        top: calc(8.1% - 25px);
    }
    &.usd_10 {
        right: calc(21% - 25px);
        top: calc(8.5% - 25px);
    }
    &.usd_100 {
        right: calc(24% - 25px);
        top: calc(8.5% - 25px);
        &.android {
            right: calc(20% - 25px);
        }
    }
    &.usd_1000 {
        right: calc(19% - 25px);
        top: calc(7.5% - 25px);
        transform: rotate(45deg) scale(1, 1);
    }
    &.usd_10000 {
        right: calc(18% - 25px);
        top: calc(16% - 25px);
    }
    &.usd_100000 {
        right: calc(13% - 25px);
        top: calc(14.5% - 25px);
    }
`;

export const CornerBottomRight = styled.div.attrs({ className: 'payment-data-corner--bottom-right corner-text right-corner' })`
    &.usd_1 {
        right: calc(24% - 25px);
        bottom: calc(7.9% - 25px);
    }
    &.usd_10 {
        right: calc(21% - 25px);
        bottom: calc(8.8% - 25px);
    }
    &.usd_100 {
        right: calc(24% - 25px);
        bottom: calc(9.8% - 25px);
        &.android {
            right: calc(20% - 25px);
        }
    }
    &.usd_1000 {
        right: calc(18% - 25px);
        bottom: calc(7.5% - 25px);
        transform: rotate(140deg) scale(1, 1);
    }
    &.usd_10000 {
        right: calc(18% - 25px);
        bottom: calc(16% - 25px);
    }
    &.usd_100000 {
        right: calc(13% - 25px);
        bottom: calc(14.5% - 25px);
    }
`;

export const AmountText = styled.div.attrs({ className: 'payment-data-amount--text amount-text' })`
    &.usd_1 {
        font-size: 1.25em;
        left: calc(13% - 25px);
        top: calc(50.2% - 25px);
        span {
            transform: rotateZ(90deg) scale(0.65, 0.9);
        }
        &.amount-text-len-10 span {
            transform: rotateZ(90deg) scale(0.85, 0.9);
        }
        &.amount-text-len-11 span {
            transform: rotateZ(90deg) scale(0.8, 0.9);
        }
        &.amount-text-len-12 span {
            transform: rotateZ(90deg) scale(0.75, 0.9);
        }
        &.amount-text-len-13 span {
            transform: rotateZ(90deg) scale(0.65, 0.9);
        }
    }
    &.usd_10 {
        font-size: 1.3em;
        left: calc(10.5% - 25px);
        top: calc(50% - 25px);
        span {
            transform: rotateZ(90deg) scale(0.5, 1);
        }
        &.amount-text-len-11 span {
            transform: rotateZ(90deg) scale(1, 1);
        }
        &.amount-text-len-14 span {
            transform: rotateZ(90deg) scale(0.75, 1);
        }
        &.amount-text-len-15 span {
            transform: rotateZ(90deg) scale(0.7, 1);
        }
        &.amount-text-len-16 span {
            transform: rotateZ(90deg) scale(0.65, 1);
        }
        &.amount-text-len-17 span {
            transform: rotateZ(90deg) scale(0.6, 1);
        }
    }
    &.usd_100 {
        font-size: 1em;
        left: calc(12% - 25px);
        top: calc(50% - 25px);
        span {
            transform: rotateZ(90deg) scale(1.2, 1);
        }
    }
    &.usd_1000 {
        font-size: 1em;
        left: calc(12% - 25px);
        top: calc(50% - 25px);
        span {
            transform: rotateZ(90deg) scale(0.8, 1.2);
        }
    }
    &.usd_10000 {
        font-size: 1em;
        left: calc(10.5% - 25px);
        top: calc(50% - 25px);
        span {
            transform: rotateZ(90deg) scale(0.7, 1.2);
        }
        &.amount-text-len-22 span {
            transform: rotateZ(90deg) scale(0.85, 1.2);
        }
        &.amount-text-len-23 span {
            transform: rotateZ(90deg) scale(0.8, 1.2);
        }
    }
    &.usd_100000 {
        font-size: 1em;
        left: calc(10.5% - 25px);
        top: calc(50% - 25px);
        span {
            transform: rotateZ(90deg) scale(0.7, 0.8);
        }
        &.amount-text-len-23 span {
            transform: rotateZ(90deg) scale(0.8, 0.8);
        }
    }
`;

export const AmountTextMid = styled.div.attrs({ className: 'payment-data-amount--text-mid' })`
    position: absolute;
    z-index: 2;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: calc(44% - 25px);
    top: calc(75% - 25px);
    font-size: 7em;

    span {
        transform: rotateZ(90deg) scale(1, 1);
        font-family: 'Caslon RR Regular ExtraCond Outline';
        -webkit-background-clip: text;
        color: black;
        text-align: center;
        line-height: 75%;
        
        &::after {
            content: attr(data-text);
            font-family: 'Caslon RR Regular ExtraCond Diagonal';
            position: absolute;
            left: 0;
            top: 0;
        }
    }

    // &.usd_1 {
    //     left: calc(44% - 25px);
    //     top: calc(75% - 25px);
    //     font-size: 7em;
    //     &.amount-text-mid-len-3 {
    //         span {
    //             transform: rotateZ(90deg) scale(1.25, 1.25);
    //         }
    //     }
    //     &.amount-text-mid-len-4 {
    //         span {
    //             transform: rotateZ(90deg) scale(1.25, 1.25);
    //         }
    //     }
    //     &.amount-text-mid-len-5 {
    //         span {
    //             transform: rotateZ(90deg) scale(1, 1);
    //         }
    //     }
    // }
    // &.usd_10 {
    //     left: calc(41.8% - 25px);
    //     top: calc(75% - 25px);
    //     font-size: 7em;
    //     span {
    //         transform: rotateZ(90deg) scale(1, 1);
    //     }
    //     &.amount-text-mid-len-3 {
    //         top: calc(74% - 25px);
    //         span {
    //             transform: rotateZ(90deg) scale(1.8, 2);
    //         }
    //     }
    //     &.amount-text-mid-len-5 span {
    //         transform: rotateZ(90deg) scale(1.1, 1.6);
    //     }
    //     &.amount-text-mid-len-6 span {
    //         transform: rotateZ(90deg) scale(1.1, 1.6);
    //     }
    //     &.amount-text-mid-len-7 span {
    //         transform: rotateZ(90deg) scale(1, 1.6);
    //     }
    //     &.amount-text-mid-len-8 span {
    //         transform: rotateZ(90deg) scale(0.9, 1.6);
    //     }
    //     &.amount-text-mid-len-9 span {
    //         transform: rotateZ(90deg) scale(0.8, 1.6);
    //     }
    //     &.two span {
    //         transform: rotateZ(90deg) scale(0.8, 1);
    //     }
    // }
    // &.usd_100 {
    //     left: calc(42% - 25px);
    //     top: calc(73% - 25px);
    //     font-size: 6em;
    //     span {
    //         transform: rotateZ(90deg) scale(1, 1);
    //     }
    // }
    // &.usd_1000 {
    //     left: calc(48% - 25px);
    //     top: calc(75% - 25px);
    //     font-size: 7em;
    //     letter-spacing: -0.02em;
    //     span {
    //         transform: rotateZ(90deg) scale(1, 1);
    //     }
    // }
    // &.usd_10000 {
    //     left: calc(43.5% - 25px);
    //     font-size: 7em;
    //     letter-spacing: -0.03em;
    //     span {
    //         transform: rotateZ(90deg) scale(1, 1);
    //     }
    //     &.amount-text-mid-len-6 span {
    //         transform: rotateZ(90deg) scale(0.9, 1);
    //     }
    //     &.amount-text-mid-len-7 span {
    //         transform: rotateZ(90deg) scale(0.8, 0.9);
    //     }
    //     &.amount-text-mid-len-9 span {
    //         transform: rotateZ(90deg) scale(0.65, 0.8);
    //     }
    //     &.amount-text-mid-len-10 span {
    //         transform: rotateZ(90deg) scale(0.55, 0.8);
    //     }
    // }
    // &.usd_100000 {
    //     left: calc(43% - 25px);
    //     top: calc(74.5% - 25px);
    //     font-size: 7em;
    //     letter-spacing: -0.03em;
    //     span {
    //         transform: rotateZ(90deg) scale(1, 1);
    //     }
    //     &.amount-text-mid-len-7 span {
    //         transform: rotateZ(90deg) scale(0.9, 0.95);
    //     }
    //     &.amount-text-mid-len-9 span {
    //         transform: rotateZ(90deg) scale(0.75, 0.95);
    //     }
    //     &.amount-text-mid-len-10 span {
    //         transform: rotateZ(90deg) scale(0.65, 0.95);
    //     }
    // }
`;

export const StatusTextTop = styled.div.attrs({ className: 'status-text' })`
    position: absolute;
    z-index: 2;
    width: 160px;
    height: 16px;
    left: calc(32% - 80px);
    top: calc(26% - 8px);

    &.usd_1 {
        left: calc(33% - 80px);
    }
    &.usd_10 {
        left: calc(25.5% - 80px);
        top: calc(26% - 8px);
    }
    &.usd_100 {
        left: calc(27% - 80px);
        top: calc(25% - 8px);
    }
    &.usd_1000 {
        left: calc(32% - 80px);
        top: calc(24% - 8px);
    }
    &.usd_10000 {
        left: calc(27% - 80px);
    }
`;

export const StatusTextBottom = styled.div.attrs({ className: 'status-text' })`
    position: absolute;
    z-index: 2;
    width: 160px;
    height: 16px;
    left: calc(62% - 80px);
    top: calc(75% - 8px);

    span {
        white-space: nowrap;
        transform: scale(${props => props.len < 20 ? 1 : 20 / props.len}, 1);
    }

    // &.usd_1 {
    //     left: calc(67.5% - 80px);
    // }
    // &.usd_10 {
    //     left: calc(67.5% - 80px);
    //     top: calc(73% - 8px);
    // }
    // &.usd_100 {
    //     left: calc(69% - 80px);
    //     top: calc(71.5% - 8px);
    // }
    // &.usd_1000 {
    //     left: calc(68% - 80px);
    //     top: calc(73% - 8px);
    // }
    // &.usd_10000 {
    //     left: calc(65% - 80px);
    //     top: calc(73% - 8px);
    // }
    // &.usd_100000 {
    //     left: calc(64% - 80px);
    //     top: calc(73% - 8px);
    // }
`;

export const AdditionText = styled.div.attrs({ className: 'addition-text' })`
    position: absolute;
    z-index: 2;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Federal Regular';
    color: #ebebe1;
    font-size: 0.5em;

    &.usd_1 span {
        -webkit-text-stroke: 0.5px black;
    }

    &.top {
        span {
            transform: scale(1, 1);
        }
        &.usd_1 {
            left: calc(43.45% - 25px);
            top: calc(5% - 25px);
        }
        &.usd_10 {
            font-size: 1.8vh;
            left: calc(39.5% - 25px);
            top: calc(5.5% - 25px);
        }
    }
    &.bottom {
        span {
            transform: rotateZ(180deg) scale(1, 1);
        }
        &.usd_1 {
            left: calc(44% - 25px);
            bottom: calc(4.5% - 25px);
        }
        &.usd_10 {
            font-size: 1.8vh;
            left: calc(38.7% - 25px);
            bottom: calc(5.2% - 25px);
        }
    }
    &.left-top {
        span {
            transform: rotateZ(90deg) scale(1, 1);
        }
        &.usd_1 {
            left: calc(9.4% - 25px);
            top: calc(19.8% - 25px);
        }
        &.usd_100 {
            font-family: 'Europa Grotesque Extra Bold';
            font-size: 2em;
            left: calc(7.5% - 25px);
            top: calc(17.7% - 25px);
            span {
                transform: rotateZ(90deg) scale(0.6, 0.5);
                -webkit-text-stroke: 0.1px white;
            }
        }
    }
    &.left-bottom {
        span {
            transform: rotateZ(90deg) scale(1, 1);
        }
        &.usd_1 {
            left: calc(9.4% - 25px);
            bottom: calc(19.8% - 25px);
        }
        &.usd_100 {
            font-family: 'Europa Grotesque Extra Bold';
            font-size: 2em;
            left: calc(7.5% - 25px);
            bottom: calc(18.4% - 25px);
            span {
                transform: rotateZ(90deg) scale(0.6, 0.5);
                -webkit-text-stroke: 0.1px white;
            }
        }
    }
    &.right-top {
        span {
            transform: rotateZ(90deg) scale(1, 1);
        }
        &.usd_1 {
            right: calc(10% - 25px);
            top: calc(22.12% - 25px);
        }
    }
    &.right-bottom {
        span {
            transform: rotateZ(90deg) scale(1, 1);
        }
        &.usd_1 {
            right: calc(10% - 25px);
            bottom: calc(22.12% - 25px);
        }
    }
`;


export const RightHighlightText = styled.div.attrs({ className: 'right-highlight-text' })`
    position: absolute;
    z-index: 2;
    width: 50px;
    height: 50px;
    font-family: 'Federal Regular';
    color: #ebebe1;
    text-shadow: 2px 1.5px 1px black;
    font-size: 3.6vh;

    div {
        position: absolute;
        width: 10px;
        height: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
            display: inline-block;
        }
    }
    &.top {
        right: calc(8% - 25px);
        top: calc(8.4% - 25px);
    }
    &.bottom {
        right: calc(7.8% - 25px);
        bottom: calc(7.8% - 25px);
    }
    &.right-highlight-3 {
        font-size: 0.4em;
        .right-highlight-len-0 {
            left: calc(44% - 5px);
            top: calc(32% - 5px);
            span {
                transform: rotateZ(60deg);
            }
        }
        .right-highlight-len-1 {
            left: calc(50% - 5px);
            top: calc(50% - 5px);
            span {
                transform: rotateZ(90deg);
            }
        }
        .right-highlight-len-2 {
            left: calc(44% - 5px);
            top: calc(66% - 5px);
            span {
                transform: rotateZ(120deg);
            }
        }
    }
    &.right-highlight-4 {
        font-size: 0.35em;
        .right-highlight-len-0 {
            left: calc(45% - 5px);
            top: calc(32% - 5px);
            span {
                transform: rotateZ(60deg);
            }
        }
        .right-highlight-len-1 {
            left: calc(49% - 5px);
            top: calc(42% - 5px);
            span {
                transform: rotateZ(80deg);
            }
        }
        .right-highlight-len-2 {
            left: calc(48% - 5px);
            top: calc(54.4% - 5px);
            span {
                transform: rotateZ(100deg);
            }
        }
        .right-highlight-len-3 {
            left: calc(44% - 5px);
            top: calc(66% - 5px);
            span {
                transform: rotateZ(120deg);
            }
        }
    }
    &.right-highlight-5 {
        font-size: 0.28em;
        .right-highlight-len-0 {
            left: calc(43% - 5px);
            top: calc(28% - 5px);
            span {
                transform: rotateZ(60deg);
            }
        }
        .right-highlight-len-1 {
            left: calc(48% - 5px);
            top: calc(38% - 5px);
            span {
                transform: rotateZ(75deg);
            }
        }
        .right-highlight-len-2 {
            left: calc(50% - 5px);
            top: calc(50% - 5px);
            span {
                transform: rotateZ(90deg);
            }
        }
        .right-highlight-len-3 {
            left: calc(48% - 5px);
            top: calc(60% - 5px);
            span {
                transform: rotateZ(105deg);
            }
        }
        .right-highlight-len-4 {
            left: calc(43% - 5px);
            top: calc(69% - 5px);
            span {
                transform: rotateZ(120deg);
            }
        }
    }
`;

export const TestText = styled.div.attrs({ className: 'right-highlight-text' })`
    position: absolute;
    left: 0%;
    bottom: 0%;
    color: transparent;
`;
