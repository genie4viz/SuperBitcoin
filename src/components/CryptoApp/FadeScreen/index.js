import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import {
    FadeWrapper,
    CircleContainer,
    ClaimLoadingSpinner,
    InformLoadingSpinner,
    InputCircle
} from './Components';

import Notification from '../Notification';
import { STORE_KEYS } from '../../../stores';

import rejectIcon from '../asset/img/reject.png';
import receiveIcon from '../asset/img/receive.png';
import arrowsUp from '../asset/img/arrows-up.png';
import arrowsDown from '../asset/img/arrows-down.png';
import smile from '../asset/img/smile.svg';

class FadeScreen extends React.Component {

    _timeout = [];

    state = {
        isStarted: false,
        showEmotion: false,
        width: 74,
        step: 0, // 0: init, 1: first animation, 2: show arrows, 3: smile, 4: reverse-initial
        msg: null,
    };

    onClick = () => {
        if(this.props.fadeStatus && (this.props.fadeStatus === 'receiving' || this.props.fadeStatus === 'claiming' || this.props.fadeStatus === 'rejecting') && this.state.step >= 4) {
            this.props.onFadeScreenClick();
        }
    }

    componentDidMount() {
        const { fadeStatus } = this.props;
        if (fadeStatus === 'informing') {
            this._timeout.push(setTimeout(() => this.arcMove(), 4000));
        } else if (fadeStatus === 'claiming') {
            this.startClaimingAnimation();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { fadeStatus } = this.props;
        if (fadeStatus !== nextProps.fadeStatus && nextProps.fadeStatus === 'claiming') {
            this.startClaimingAnimation();
        }
    }

    componentWillUnmount() {
        for (let i = 0; i < this._timeout.length; i++) {
            clearTimeout(this._timeout[i]);
        }
    }

    startClaimingAnimation() {
        if (this.state.isStarted === true) return;
        this.setState({ isStarted: true });
        this._timeout.push(setTimeout(() => {
            this.setState({
                width: window.innerWidth - 50,
                step: 1,
            });
        }, 500));
        this._timeout.push(setTimeout(() => this.setState({ step: 2 }), 1000));
        this._timeout.push(setTimeout(() => this.setState({ step: 3, width: 74 }), 2500));
        this._timeout.push(setTimeout(() => this.setState({ showEmotion: true }), 3500));
    }

    arcMove(value = true) {
        const can = document.getElementById('canvas');
        const c = can.getContext('2d');
    
        const posX = can.width / 2;
        const posY = can.height / 2;
        const fps = 1000 / 200;
        const oneProcent = 360 / 100;
        const result = oneProcent * 100;
        c.lineCap = 'round';

        let deegres = 0;
        const acrInterval = setInterval (() => {
            deegres += 1;
            c.clearRect( 0, 0, can.width, can.height );

            c.beginPath();
            c.arc( posX, posY, 35, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
            c.strokeStyle = value ? 'transparent' : 'white';
            c.lineWidth = '1';
            c.stroke();

            c.beginPath();
            c.strokeStyle = value ? 'white' : 'black';
            c.lineWidth = '1.8';
            c.arc( posX, posY, 35, (Math.PI/180) * 270, (Math.PI/180) * (270 + deegres) );
            c.stroke();
            if( deegres >= result ) clearInterval(acrInterval);
        }, fps);
    }

    getCurrencyPosition(currency) {
        const { PortfolioValue } = this.props;
        const coin = PortfolioValue.find(item => item.Coin.toLowerCase() === (currency.currencyCode === 'USD' ? 'TUSD' : currency.currencyCode).toLowerCase());

        return coin ? coin.Position : 0;
    }

    onClickSmile = () => {
        const { step } = this.state;
        const { currency, amount, isCoinTransfer, balance } = this.props;

        if (step === 3) {
            this.setState({ step: 4, showEmotion: false }, () => {
                this.arcMove(false);
            });
            this._timeout.push(setTimeout(() => {
                this.setState({ step: 5 });
            }, 1000));

            if (isCoinTransfer) {
                this.setState({
                    msg: `You received ${amount} ${currency.currencyCode} successfully. Now your ${currency.currencyCode} balance is ${balance}.`,
                });
            }

            this._timeout.push(setTimeout(() => {
                this.props.onFadeScreenClick();
            }, 5000));
        }
    }

    render() {
        const {
            fadeStatus,
            isCoinTransfer,
        } = this.props;

        const {
            msg,
            step,
            width,
            showEmotion,
        } = this.state;

        return (
            <FadeWrapper className={fadeStatus}>
                <CircleContainer>
                    {fadeStatus === 'informing' && (
                        <div>
                            <InformLoadingSpinner/>
                            <canvas id="canvas" width="74" height="74" />
                        </div>
                    )}

                    {fadeStatus === 'receiving' && (
                        <InputCircle borderColor="rgba(0,174,83,0.25)" >
                            <img src={receiveIcon} alt="" />
                        </InputCircle>
                    )}

                    {fadeStatus === 'claiming' && (
                        step < 4 ? (<ClaimLoadingSpinner className={(width > 100 && step < 3) ? 'claim' : ''} width={width}>
                            {step !== 3 && <div className="spinner" />}
                            {showEmotion && <img className="smile" src={smile} alt="smile" onClick={e => this.onClickSmile(e)} />}
                            {step === 2 && <img className="arrow" src={isCoinTransfer === true ? arrowsDown : arrowsUp} alt="arrows" />}
                        </ClaimLoadingSpinner>
                        ) : (<div>
                            <InformLoadingSpinner isClaiming={true}/>
                            <canvas id="canvas" width="74" height="74" />
                        </div>
                        )
                    )}

                    {fadeStatus === 'rejecting' && (
                        <InputCircle borderColor="rgba(237,28,36,0.25)" >
                            <img src={rejectIcon} alt="" />
                        </InputCircle>
                    )}

                    {step >= 4 && msg && <Notification msg={msg} />}
                </CircleContainer>
            </FadeWrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.PAYAPPSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    PortfolioValue,
                    isPositionLoaded,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    balance,
                },
            }
        ) => ({
            PortfolioValue,
            isPositionLoaded,
            balance,
        })
    )
)(FadeScreen);
