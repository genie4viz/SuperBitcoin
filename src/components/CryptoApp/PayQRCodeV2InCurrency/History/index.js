import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import findIndex from 'lodash/findIndex';

import { STORE_KEYS } from '@/stores';
import DataLoader from '@/components-generic/DataLoader';
import {
    Wrapper,
    ContentWrapper,
    List,
    LoadingWrapper,
    NoDataText,
    InnerWrapper,
    InfoItem,
    InnerList,
} from './Components';

import Settings from '../Settings';

class History extends React.Component {
    state = {
        loading: true,
        openedMenu: '',
        tableData: [],
    };

    mounted = true;
    scrollRef = null;
    psRef = null;
    tableRef = null;
    interval = null;

    componentDidMount() {
        this.setState({ loading: true });
        this.props.requestTransferHistory()
            .then(res => {
                this.updateTableData(res);
                this.setState({ loading: false });
            });
    }

    // componentWillReceiveProps(nextProps) {
    //     if (JSON.stringify(this.props.PortfolioValue) !== JSON.stringify(nextProps.PortfolioValue)) {
    //         this.updateTableData(this.props.transferHistory);
    //     }
    // }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.mounted = false;
    }

    historyCellRenderer = rowData => {
        // const {
        //     [STORE_KEYS.TELEGRAMSTORE]: {
        //         loggedInUser,
        //     },
        // } = this.props;

        const {
            Amount,
            CreatedAt,
            // Executor,
            Initiator,
            IsMemberSender,
            Status,
            InitiatorMemberId,
            InitiatorPhotoUrl,
        } = rowData;

        // let executorFullName = '';
        let initiatorFullName = '';
        // let initiatorUserName = '';

        // if (Executor) {
        //     executorFullName = Executor.FullName || '';
        // }

        if (Initiator) {
            initiatorFullName = Initiator.FullName || '';
            // initiatorUserName = Initiator.Username || '';
        }

        // const userName = (loggedInUser && loggedInUser.username) || '';

        let displayFullName = (Status ==='pending' ? 'Pending' : (Status === 'Promo' ? 'Promo' : `User ${InitiatorMemberId}`));

        if (initiatorFullName && Status !== 'pending' && Status !== 'Promo') {
            displayFullName = initiatorFullName;
        }

        let createdAt = CreatedAt;

        try {
            const createdAtMoment = moment(CreatedAt);
            if (createdAtMoment.isValid()) {
                createdAt = createdAtMoment.format('YYYY-MM-DD HH:mm');
            }
        } catch (e) {
            console.log(e);
        }

        const labelAmount = (this.props.currency.type === 'country' ? this.props.currency.symbol : '') + this.props.getFixedNumberString(Amount);
        const isVisible = (Amount / this.props.currency.price > 0.01 || Status !== 'pending');

        return (
            <InfoItem
                isActive={this.state.openedMenu === 'activity'}
                key={CreatedAt + InitiatorMemberId + Number(Math.random() * 100)}
                isVisible={isVisible}
            >
                <div className="photo">
                    <img src={InitiatorPhotoUrl} alt="" />
                </div>
                <div className="info-container">
                    <div className="prefix">
                        <div className="containerText">
                            <div className={Status === 'pending' ? 'titleText grey' : 'titleText'}>{displayFullName}</div>
                            <div className="descText">{createdAt}</div>
                        </div>
                    </div>
                    <div
                        className="prefix"
                        onClick={() => {
                            if(Status === 'pending') {
                                this.props.onHistoryRedo(Amount);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="containerText">
                            <div className={(Status === 'pending' || Status === 'canceled' ? 'amountText grey' : 'amountText') + (labelAmount.length > 6 ? ' long' : '')}>
                                {IsMemberSender ? '-' : '+'}{labelAmount}
                            </div>
                            {Status === 'pending' && <div className="descText" style={{ color: '#4080FF', textAlign: 'right' }}>Redo</div>}
                        </div>
                    </div>
                </div>
            </InfoItem>
        );
    };

    renderPromoTransaction() {
        return (
            <InfoItem
                isActive={this.state.openedMenu === 'activity'}
                isVisible={true}
            >
                <div className="prefix">
                    <div className="containerText">
                        <div className="titleText">Promo</div>
                        <div className="descText" />
                    </div>
                </div>
                <div className="prefix">
                    <div className="containerText">
                        <div className="titleText">+ $5.00</div>
                    </div>
                </div>
            </InfoItem>
        );
    }

    updateTableData(data) {
        const { currency } = this.props;
        const response = data.filter(item => {
            return item.Coin.toLowerCase() === (currency.currencyCode === 'USD' ? 'TUSD' : currency.currencyCode).toLowerCase();
        });
        this.setState({ tableData: response });
    }

    getCurrencyPosition() {
        const { currency, PortfolioValue } = this.props;
        const curIndex = findIndex(PortfolioValue, { Coin: currency.currencyCode === 'USD' ? 'TUSD' : currency.currencyCode });

        return curIndex === -1 ? 0 : PortfolioValue[curIndex].Position;
    }

    getCurrencyText = (currency) => {
        if(currency.type === 'crypto') {
            return currency.currency;
        }
        const names = currency.currency.split(' ');
        return names[names.length - 1];
    }

    render() {
        const { tableData } = this.state;

        return (
            <Wrapper className={this.props.isHistoryDetailShowing ? 'hide' : ''}>
                <ContentWrapper>
                    <InnerWrapper onClick={e => e.stopPropagation()}>
                        <List>
                            {(this.state.loading || !(this.props.PortfolioValue && this.props.PortfolioValue.length > 0)) ? (
                                <LoadingWrapper>
                                    <DataLoader width={120} height={120} />
                                </LoadingWrapper>
                            ) : (
                                <InnerList>
                                    {tableData.length > 0 ? tableData.map(item => {
                                        return this.historyCellRenderer(item);
                                    }) : (
                                        <NoDataText>
                                            <FormattedMessage
                                                id="pay_app.history_view_v2.label_no_transaction"
                                                defaultMessage="No Transaction Yet"
                                            />
                                        </NoDataText>
                                    )}

                                    <Settings />
                                </InnerList>
                            )}
                        </List>
                    </InnerWrapper>
                </ContentWrapper>
            </Wrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.PAYAPPSTORE,
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.TELEGRAMSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    PortfolioValue,
                },
                [STORE_KEYS.SENDCOINSTORE]: {
                    transferHistory,
                    requestTransferHistory,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    getFixedNumberString,
                },
            }
        ) => ({
            transferHistory,
            PortfolioValue,
            requestTransferHistory,
            getFixedNumberString,
        })
    )
)(withRouter(History));
