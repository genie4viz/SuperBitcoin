import React, { PureComponent, Fragment } from 'react';

import { Wrapper, InnerWrapper } from './Components';
import ActiveTable from './ActiveTable';
import FilledTable from './FilledTable';
import MyTradesTable from './MyTradesTable';
import { MODE_KEYS } from './Constants';
import Accounts from '@/components/Accounts';
import Report from '@/components/Report';
import ActiveStatusCircle from '@/components-generic/ActiveStatusCircle';
import OrderHistory from '@/components/Report/Tabs/OrderHistory';
import TradeHistory from '@/components/Report/Tabs/TradeHistory';
import PaymentHistory from '@/components/Report/Tabs/PaymentHistory';
import NavReport from '@/components/Report/Tabs/NavReport';
import MyAccount from '@/components/MyAccount';
import DepthChart from '@/components/DepthChart';

class OrderHistoryAdv extends PureComponent {
    getContent = () => {
        const { rightBottomSectionOpenMode, arbMode } = this.props;
        switch (rightBottomSectionOpenMode) {
            case MODE_KEYS.depthChartKey:
                return (
                    <Fragment>
                        <DepthChart />
                        {arbMode && <ActiveStatusCircle />}
                    </Fragment>
                );
            case MODE_KEYS.myTradesModeKey:
                return <MyTradesTable />;
            case MODE_KEYS.activeModeKey:
                return <ActiveTable />;
            case MODE_KEYS.filledModeKey:
                return <FilledTable />;
            case MODE_KEYS.reportsModeKey:
                return <Report />;
            case MODE_KEYS.accountsModeKey:
                return <Accounts />;

            case MODE_KEYS.orderHistoryModeKey:
                return <OrderHistory />;
            case MODE_KEYS.tradeHistoryModeKey:
                return <TradeHistory />;
            case MODE_KEYS.paymentHistoryModeKey:
                return <PaymentHistory />;
            case MODE_KEYS.navReportModeKey:
                return <NavReport />;
            case MODE_KEYS.myPortfolioModeKey:
                return <MyAccount />;
            case MODE_KEYS.tradingViewModeKey:
                return null;
            case MODE_KEYS.arbitrageModeKey:
                return null;
            default:
                return null;
        }
    };

    render() {
        return (
            <Wrapper>
                <InnerWrapper>{this.getContent()}</InnerWrapper>
            </Wrapper>
        );
    }
}

export default OrderHistoryAdv;
