import React, { memo } from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
    .progress-arrow {
        align-items: center;
        display: flex;
        flex-direction: ${props => (props.direction === 'top' || props.direction === 'bottom' ? 'column' : 'row')};

        .direction {
            border-left: ${props => (props.direction === 'left' ? '6px solid #454c73' : '6px solid transparent')};
            border-top: ${props => (props.direction === 'top' ? '6px solid #454c73' : '6px solid transparent')};
            border-bottom: ${props => (props.direction === 'bottom' ? '6px solid #454c73' : '6px solid transparent')};
            border-right: ${props => (props.direction === 'right' ? '6px solid #454c73' : '6px solid transparent')};
        }

        &--animated {
            .progress-left_arrow {
                animation: ${props => {
                    if (props.direction === 'top') {
                        return 'pulse-top 2s infinite ease';
                    }

                    if (props.direction === 'bottom') {
                        return 'pulse-bottom 2s infinite ease';
                    }

                    if (props.direction === 'left') {
                        return 'pulse-left 2s infinite ease';
                    }

                    return 'pulse-right 2s infinite ease';
                }};
            }
            .arrow-1,
            .arrow-2,
            .arrow-3 {
                margin: ${props => {
                    if (props.direction === 'bottom') {
                        return '-5px 0 0 auto';
                    }

                    if (props.direction === 'top') {
                        return '0 auto -5px 0';
                    }
                }};
            }
            .arrow-1 {
                animation-delay: 0;
                order: ${props => (props.direction === 'top' || props.direction === 'left' ? 1 : 3)};
            }
            .arrow-2 {
                animation-delay: 0.5s;
                order: 2;
            }
            .arrow-3 {
                animation-delay: 1s;
                order: ${props => (props.direction === 'top' || props.direction === 'left' ? 3 : 1)};
            }
        }
        @keyframes pulse-left {
            25% {
                border-left-color: #454c73;
            }
            50% {
                border-left-color: white;
            }
        }
        @keyframes pulse-right {
            25% {
                border-right-color: #454c73;
            }
            50% {
                border-right-color: white;
            }
        }
        @keyframes pulse-top {
            25% {
                border-top-color: #454c73;
            }
            50% {
                border-top-color: white;
            }
        }
        @keyframes pulse-bottom {
            25% {
                border-bottom-color: #454c73;
            }
            50% {
                border-bottom-color: white;
            }
        }
    }
`;

const ProgressArrow = memo(({ direction }) => {
    return (
        <Wrapper direction={direction}>
            <div className="progress-arrow progress-arrow--animated">
                <div className="progress-left_arrow direction arrow-1" />
                <div className="progress-left_arrow direction arrow-2" />
                <div className="progress-left_arrow direction arrow-3" />
            </div>
        </Wrapper>
    );
});

ProgressArrow.defaultProps = {
    direction: 'right'
};

export default ProgressArrow;
