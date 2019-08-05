import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import FacebookLogin from 'react-facebook-login';

import { STORE_KEYS } from '@/stores';

import {
    Wrapper,
    ContentWrapper,
    InnerWrapper,
    SettingItem,
    OptionTransfer,
    AddPhoto
} from './Components';

import logoutImg from '../../asset/img/logout.svg';

class Settings extends React.Component {

    state = {
        photo: null,
        userName: 'User',
        phoneNumber: '',
    };

    componentDidMount() {
        const {
            memberInfo,
            getUserInformation,
        } = this.props;

        getUserInformation();

        const photo = memberInfo ? memberInfo.MemberInformation.PhotoUrl : null;
        const userName = memberInfo ? memberInfo.MemberInformation.Username : 'User';
        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumberFromString(localStorage.getItem('phoneNumber'));
            phoneNumber = phoneNumber.formatInternational();
        } catch(e) {
            phoneNumber = '';
        }

        this.setState({
            photo,
            userName,
            phoneNumber,
        });
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.memberInfo) !== JSON.stringify(nextProps.memberInfo) && nextProps.memberInfo && nextProps.memberInfo.MemberInformation) {
            const photo = nextProps.memberInfo.MemberInformation.PhotoUrl;
            const userName = nextProps.memberInfo.MemberInformation.Username;
            this.setState({
                photo,
                userName,
            });
        }
    }

    handleChangeWalletView = e => {
        if (this.props.isLoggedIn) {
            this.props.setWalletShowing(e.target.checked);
        }
    }

    handleChangeUserName = e => {
        if(e) e.stopPropagation();
        this.setState({
            userName: e.target.value,
        });
    }

    handleUserNameBlur = () => {
        const {
            updateUserInformation,
        } = this.props;

        const {
            userName,
        } = this.state;

        const parts = userName.split(' ');
        const info = {
            FirstName: parts[0],
            LastName: parts.length > 1 ? parts[parts.length - 1] : '',
            Fullname: userName,
            Username: userName,
        };
        updateUserInformation(info);
    }

    onLogout = e => {
        if(e) e.stopPropagation();
        localStorage.clear();
        window.location.reload();
    }

    render() {
        const {
            photo,
            userName,
            phoneNumber,
        } = this.state;

        return (
            <Wrapper>
                <ContentWrapper>
                    <InnerWrapper onClick={e => e.stopPropagation()}>
                        {/* <SettingHeader onClick={e => this.props.onBack(e)}>
                            <img src={settingsIcon} alt="" />
                            <p>Settings</p>
                        </SettingHeader> */}
                        <SettingItem>
                            <AddPhoto>
                                <img src={photo} alt="" />
                            </AddPhoto>
                        </SettingItem>

                        <SettingItem>
                            <input
                                className="name-input"
                                type="text"
                                value={userName}
                                placeholder=""
                                onChange={e => this.handleChangeUserName(e)}
                                onBlur={this.handleUserNameBlur}
                            />
                            <span>Username</span>
                        </SettingItem>

                        <SettingItem>
                            <p>{phoneNumber}</p>
                            <span>Your Phone</span>
                        </SettingItem>

                        <SettingItem>
                            <OptionTransfer>
                                <input
                                    type='checkbox'
                                    checked={false}
                                    className='ios8-switch ios8-switch-sm'
                                    id='checkWallet'
                                    onChange={e => this.handleChangeWalletView(e)}
                                    onClick={e => this.handleChangeWalletView(e)}
                                />
                                <label htmlFor='checkWallet' />
                            </OptionTransfer>
                            <span>Deposit BTC</span>
                        </SettingItem>

                        <SettingItem>
                            <FacebookLogin
                                appId="288404425009300"
                                fields="name,email,picture"
                                icon="fa-facebook"
                            />
                        </SettingItem>

                        <SettingItem>
                            <div className="logout-container" onClick={e => this.onLogout(e)} role="button" tabIndex="0">
                                <img src={logoutImg} alt="" />
                                <span>LOGOUT</span>
                            </div>
                        </SettingItem>
                    </InnerWrapper>
                </ContentWrapper>
            </Wrapper>
        );
    }
}

export default compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.PAYAPPSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.SMSAUTHSTORE] : {
                    isLoggedIn,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    setWalletShowing,
                },
                [STORE_KEYS.YOURACCOUNTSTORE] : {
                    memberInfo,
                    updateUserInformation,
                    getUserInformation,
                },
            }
        ) => ({
            isLoggedIn,
            setWalletShowing,
            memberInfo,
            updateUserInformation,
            getUserInformation,
        })
    )
)(withRouter(Settings));
