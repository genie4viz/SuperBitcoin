import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';

import InitialLoader from '../../components-generic/InitialLoader';
import { STORE_KEYS } from '../../stores';

class InitialLoaderContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadFailed: false
        };
        this.props.setSafeTimeout(this.updateLoadFailed, 30000);
    }

    updateLoadFailed = () => {
        const { isAccountStoreLoaded } = this.props;

        if (!isAccountStoreLoaded) {
            this.setState({
                loadFailed: true
            });
        }
    };

    render() {
        const {
            [STORE_KEYS.YOURACCOUNTSTORE]: { isLoaded: isAccountStoreLoaded },
            [STORE_KEYS.INSTRUMENTS]: { isLoaded: isBaseQuotesLoaded },
            isMobileDevice
        } = this.props;

        const { loadFailed } = this.state;

        if (isMobileDevice || loadFailed) {
            return null;
        }

        const showLoader = !isBaseQuotesLoaded || !isAccountStoreLoaded;

        return showLoader && <InitialLoader />;
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(STORE_KEYS.YOURACCOUNTSTORE, STORE_KEYS.INSTRUMENTS),
    observer
);

export default enhanced(InitialLoaderContainer);
