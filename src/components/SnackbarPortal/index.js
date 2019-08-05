import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import SimpleSnackbar from '../../components-generic/Snackbar';
import { STORE_KEYS } from '../../stores';

const SnackbarPortal = inject(STORE_KEYS.SNACKBARSTORE)(observer(
    ({
        [STORE_KEYS.SNACKBARSTORE]: { SnackBarProps, open, onClose, isRight},
    }) => {
        return (
            <React.Fragment>
                {Object.keys(SnackBarProps).length > 0 && (
                    ReactDOM.createPortal(
                        <SimpleSnackbar
                            {...SnackBarProps}
                            open={open}
                            onClose={onClose}
                            isRight={isRight}
                        />,
                        document.getElementById('snackbar'),
                    )
                )}
            </React.Fragment>
        );
    }
));

export default SnackbarPortal;
