import React, { Component, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Swipeable } from 'react-swipeable';

import { STORE_KEYS } from '@/stores';
import { getScreenInfo } from '@/utils';
import documentVisibilityListener from '@/utils/documentVisibilityListener';
import DataLoader from '@/components-generic/DataLoader';

import OrderBookTable from './OrderBookTable';

const IS_MOBILE = getScreenInfo().isMobileDevice;
const Wrapper = IS_MOBILE ? Swipeable : Fragment;

class OrderBook extends Component {
    state = {
        isLoading: false
    };

    componentDidMount() {
        if (IS_MOBILE) {
            this.props.createSubscription();
        }

        this.removeVisibilityListener = documentVisibilityListener(this.onChangeTabVisibility);
    }

    componentWillUnmount() {
        if (IS_MOBILE) {
            this.props.removeSubscription();
        }

        this.removeVisibilityListener();
    }

    shouldComponentUpdate(nextProps) {
        return this.tabStatus !== 'hidden' && this.props !== nextProps;
    }

    onChangeTabVisibility = status => {
        this.tabStatus = status;
    };

    swipeHandler = event => {
        const { setPageIndexOfSmart, setIsPayApp, setArbMode } = this.props;

        if (event.dir === 'Left') {
            setPageIndexOfSmart(1);
            setIsPayApp(true);
        } else if (event.dir === 'Right') {
            this.setState({
                isLoading: true
            });
            setPageIndexOfSmart(-1);
            setIsPayApp(false);
            setArbMode(true);
        }
    };

    setSettingsExchangeViewMode = () => {
        const {
            isLoggedIn,
            isUserDropDownOpen,
            setUserDropDownOpen,
            setSettingsExchangeViewMode,
            setAppStoreDropDownOpen
        } = this.props;

        if (isLoggedIn) {
            setUserDropDownOpen(!isUserDropDownOpen);
            setSettingsExchangeViewMode(true);
            setAppStoreDropDownOpen(false);
        }
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return <DataLoader width={100} height={100} />;
        }

        const wrapperProps = IS_MOBILE ? { onSwiped: this.swipeHandler, style: { height: '100%' } } : {};

        const props = {
            setSettingsExchangeViewMode: this.setSettingsExchangeViewMode
        };

        return (
            <Wrapper {...wrapperProps}>
                <OrderBookTable {...props} />
            </Wrapper>
        );
    }
}

const withOrderInstruments = compose(
    inject(
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.TELEGRAMSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: {
                createSubscription,
                removeSubscription,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                setSettingsExchangeViewMode,
                setAppStoreDropDownOpen,
                setPageIndexOfSmart,
                setIsPayApp,
                isUserDropDownOpen,
                setUserDropDownOpen,
                setArbMode,
            },
            [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
        }) => ({
            createSubscription,
            removeSubscription,
            setSettingsExchangeViewMode,
            setAppStoreDropDownOpen,
            setPageIndexOfSmart,
            setIsPayApp,
            isUserDropDownOpen,
            setUserDropDownOpen,
            isLoggedIn,
            setArbMode,
        })
    )
);

export default withOrderInstruments(OrderBook);
