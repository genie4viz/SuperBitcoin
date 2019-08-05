import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AutoSizer, Column, Table } from 'react-virtualized';
import QRCode from 'qrcode.react';
import moment from 'moment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import {
    format2DigitString
} from '../../../utils';
import { STORE_KEYS } from '../../../stores';
import DataLoader from '../../../components-generic/DataLoader';
import {
    Wrapper,
    HeaderWrapper,
    ContentWrapper,
    List,
    LoadingWrapper,
    NoDataText,
    TableWrapper,
    InnerWrapper,
    InfoItem,
    InnerList,
    BalanceRow,
    AddPhoto,
    SettingItem,
    OptionTransfer
} from './Components';
import logoutIcon from '../asset/img/logout.svg';
import settingIcon from '../asset/img/setting.png';
import acceptIcon from '../asset/img/accept.png';
import rejectIcon from '../asset/img/reject.png';

class AppHistory extends React.Component {
    state = {
        isLogoutScreen: false,
        isSettingScreen: false,
        scrollTop: 0,
        openedMenu: ''
    };

    mounted = true;
    scrollRef = null;
    psRef = null;
    tableRef = null;
    interval = null;

    componentDidMount() {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestTransferHistory,
            },
        } = this.props;

        requestTransferHistory();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isVisible === true && this.props.isVisible === false) {
            const {
                [STORE_KEYS.SENDCOINSTORE]: {
                    requestTransferHistory,
                },
            } = this.props;

            requestTransferHistory()
                .then(() => {
                    if (this && this.mounted && this.psRef) {
                        this.psRef.updateScroll();
                    }
                });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.mounted = false;
    }

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    handleClose = (e) => {
        if(e) e.stopPropagation();
        this.props.onClose(true);
    };

    historyCellRenderer = ({ rowData }) => {
        const {
            [STORE_KEYS.TELEGRAMSTORE]: {
                loggedInUser,
            }
        } = this.props;

        const {
            Amount,
            CreatedAt,
            Executor,
            Initiator,
            IsMemberSender,
            Status,
            TrId,
            InitiatorMemberId,
        } = rowData;

        let executorFullName = '';
        let initiatorFullName = '';
        let initiatorUserName = '';

        if (Executor) {
            executorFullName = Executor.FullName || '';
            executorUserName = Executor.Username || '';
        }

        if (Initiator) {
            initiatorFullName = Initiator.FullName || '';
            initiatorUserName = Initiator.Username || '';
        }

        const userName = (loggedInUser && loggedInUser.username) || '';

        let displayFullName = (Status ==='pending' ? 'Pending' : (Status === 'Promo' ? 'Promo' : `User ${InitiatorMemberId}`));
        const qrCodeValue = `https://${window.location.hostname}/r/${TrId}`;

        if (userName === initiatorUserName) {
            if (executorFullName !== '') {
                displayFullName = executorFullName;
            }
        } else if (initiatorFullName !== '') {
            displayFullName = initiatorFullName;
        }

        let createdAt = CreatedAt;

        try {
            const createdAtMoment = moment(CreatedAt);
            if (createdAtMoment.isValid()) {
                createdAt = createdAtMoment.format('lll');
            }
        } catch (e) {
            console.log(e);
        }

        const labelAmount = `$${format2DigitString(Amount)}`;

        return (
            <InfoItem
                isActive={this.state.openedMenu === 'activity'}
            >
                <div className="prefix">
                    {Status === 'pending' ? (
                        <div className="circleText transparent">
                            <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                            <QRCode
                                value={qrCodeValue}
                                size={20}
                                bgColor="#FFB400"
                                fgColor="#000"
                                renderAs="svg"
                            />
                        </div>
                    ) : (
                        <div className="circleText">
                            <span className="circleContent" />
                        </div>
                    )}
                    <div className="containerText">
                        <div className={Status === 'pending' ? 'titleText grey' : 'titleText'}>{displayFullName}</div>
                        <div className="descText">{createdAt}</div>
                    </div>
                </div>
                <div className="prefix">
                    <div className="containerText">
                        <div className={Status === 'pending' || Status === 'canceled' ? 'titleText grey' : 'titleText'}>{IsMemberSender ? '-' : '+'} {labelAmount}</div>
                        <div className="descText">{Status === 'canceled' ? 'rejected' : Status}</div>
                    </div>
                </div>
            </InfoItem>
        );
    };

    renderPromoTransaction() {
        return (
            <InfoItem
                isActive={this.state.openedMenu === 'activity'}
            >
                <div className="prefix">
                    <div className="circleText">
                        <span className="circleContent">P</span>
                    </div>
                    <div className="containerText">
                        <div className="titleText">Promo</div>
                        <div className="descText" />
                    </div>
                </div>
                <div className="prefix">
                    <div className="containerText">
                        <div className="titleText">+ $5.00</div>
                        <div className="descText">claimed</div>
                    </div>
                </div>
            </InfoItem>
        );
    }

    toggleMenu = (openedMenu) => {
        if (this.state.openedMenu === openedMenu) {
            this.setState({
                openedMenu: '',
            });
        } else {
            this.setState({
                openedMenu,
            });
        }
    };

    onLogout = (e, option = -1) => {
        e.stopPropagation();
        if (option === -1) this.setState({ isLogoutScreen: true });
        if (option === false) {
            this.setState({ isLogoutScreen: false });
        } else if (option === true) {
            this.props[STORE_KEYS.SMSAUTHSTORE].forceCleanStorage();
        }
    }

    onSetting = (e) => {
        e.stopPropagation();
        this.setState({ isSettingScreen: true });
    }

    onSettingOut = e => {
        e.stopPropagation();
        this.setState({ isSettingScreen: false });
    }

    render() {
        const {
            scrollTop,
            isLogoutScreen,
            isSettingScreen,
        } = this.state;

        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn
            },
            [STORE_KEYS.SENDCOINSTORE]: {
                transferHistory: tableData,
                isFetchingTransferHistory,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioValue,
            },
        } = this.props;

        const authClientId = localStorage.getItem('authClientId');
        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumberFromString(localStorage.getItem('phoneNumber'));
            phoneNumber = phoneNumber.formatInternational();
        } catch(e) {
            phoneNumber = '';
        }

        return (
            <Wrapper onClick={this.handleClose}>
                {isSettingScreen ? (
                        <ContentWrapper>
                            <HeaderWrapper justify={true} onClick={e => this.onSettingOut(e)}>
                                <AddPhoto>Add Photo</AddPhoto>
                            </HeaderWrapper>
                            <InnerWrapper onClick={e => e.stopPropagation()}>
                                <SettingItem>
                                    <p>{authClientId}</p>
                                    <span> User ID </span>
                                </SettingItem>

                                <SettingItem>
                                    <p>{phoneNumber}</p>
                                    <span> Your Phone </span>
                                </SettingItem>

                                <SettingItem>
                                    <OptionTransfer>
                                        <input type='checkbox' className='ios8-switch ios8-switch-sm' id='checkbox2' />
                                        <label htmlFor='checkbox2' />
                                    </OptionTransfer>
                                    <span> Require PIN to transfer funds </span>
                                </SettingItem>
                            </InnerWrapper>
                        </ContentWrapper>
                    ) : <ContentWrapper>
                        {isLogoutScreen ? (
                            <HeaderWrapper>
                                <img src={rejectIcon} alt="reject" onClick={e => this.onLogout(e, false)}/>
                                <BalanceRow isLogoutScreen={true}>
                                    Are you sure you want to sign out?
                                </BalanceRow>
                                <img src={acceptIcon} alt="accept" onClick={e => this.onLogout(e, true)} />
                            </HeaderWrapper>
                        ) : (
                            <HeaderWrapper onClick={e => e.stopPropagation()}>
                                <img src={settingIcon} alt="setting" onClick={e => this.onSetting(e)} />
                                <BalanceRow>
                                    {/* <div><p>$</p></div> */}
                                    ${`${Number(PortfolioValue).toLocaleString()}`}
                                </BalanceRow>
                                <img src={logoutIcon} alt="setting" onClick={e => this.onLogout(e)} />
                            </HeaderWrapper>
                        )}

                        {!isLogoutScreen && <InnerWrapper onClick={e => e.stopPropagation()}>
                            <List>
                                {isLoggedIn ? (
                                    isFetchingTransferHistory ? (
                                        <LoadingWrapper>
                                            <DataLoader width={120} height={120} />
                                        </LoadingWrapper>
                                    ) : (
                                        <InnerList>
                                            {(tableData && tableData.length) ? (
                                                <AutoSizer>
                                                    {({ width, height }) => (
                                                        <TableWrapper width={width} height={height}>
                                                            <PerfectScrollbar
                                                                containerRef={ref => {
                                                                    this.scrollRef = ref;
                                                                }}
                                                                ref={ref => {
                                                                    this.psRef = ref;
                                                                }}
                                                                options={{
                                                                    suppressScrollX: true,
                                                                }}
                                                                onScrollY={this.handleScroll}
                                                            >
                                                                <InfoItem style={{ backgroundColor: '#4080FF' }}>
                                                                    <div className="prefix">
                                                                        <div className="containerText">
                                                                            <div style={{ fontSize: '36px', paddingRight: '10px' }}>
                                                                                $5
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="prefix">
                                                                        <div className="containerText">
                                                                            <div style={{ fontSize: '12px' }}>
                                                                                Send any amount to your friends and we&apos;ll send you both $5 when they try this App!
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </InfoItem>
                                                                <Table
                                                                    ref={ref => {
                                                                        this.tableRef = ref;
                                                                    }}
                                                                    autoHeight
                                                                    width={width}
                                                                    height={height}
                                                                    disableHeader
                                                                    rowCount={tableData.length}
                                                                    rowGetter={({ index }) => tableData[index]}
                                                                    rowHeight={80}
                                                                    overscanRowCount={0}
                                                                    scrollTop={scrollTop}
                                                                >
                                                                    <Column
                                                                        width={width}
                                                                        dataKey="History"
                                                                        cellRenderer={this.historyCellRenderer}
                                                                        style={{ paddingRight: 0 }}
                                                                    />
                                                                </Table>
                                                            </PerfectScrollbar>
                                                        </TableWrapper>
                                                    )}
                                                </AutoSizer>
                                            ) : (
                                                <AutoSizer>
                                                    {({ width, height }) => (
                                                        <TableWrapper width={width} height={height}>
                                                            <PerfectScrollbar
                                                                containerRef={ref => {
                                                                    this.scrollRef = ref;
                                                                }}
                                                                ref={ref => {
                                                                    this.psRef = ref;
                                                                }}
                                                                options={{
                                                                    suppressScrollX: true,
                                                                }}
                                                                onScrollY={this.handleScroll}
                                                            >
                                                                <InfoItem style={{ backgroundColor: '#4080FF' }}>
                                                                    <div className="prefix">
                                                                        <div className="containerText">
                                                                            <div style={{ fontSize: '36px', paddingRight: '10px' }}>
                                                                                $5
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="prefix">
                                                                        <div className="containerText">
                                                                            <div style={{ fontSize: '12px' }}>
                                                                                Send any amount to your friends and we&apos;ll send you both $5 when they try this App!
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </InfoItem>
                                                            </PerfectScrollbar>
                                                        </TableWrapper>
                                                    )}
                                                </AutoSizer>
                                                // <NoDataText>
                                                //     {/* <FormattedMessage
                                                //         id="pay_app.history_view_v2.label_no_transaction"
                                                //         defaultMessage="No Transaction Yet"
                                                //     /> */}
                                                // </NoDataText>
                                            )}
                                        </InnerList>
                                    )
                                ) : (
                                    <NoDataText>
                                        <FormattedMessage
                                            id="pay_app.history_view_v2.label_login"
                                            defaultMessage="Please login to see transactions"
                                        />
                                    </NoDataText>
                                )}
                            </List>
                        </InnerWrapper>}
                    </ContentWrapper>
                }
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.SENDCOINSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.SMSAUTHSTORE,
)(observer(withRouter(AppHistory)));
