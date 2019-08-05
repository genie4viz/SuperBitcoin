import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components/macro';
import { withStyles } from "@material-ui/core/styles";
import { BUY_SIDE, SELL_SIDE } from '@/config/constants';

const StyledSnackbar = styled(Snackbar)`
    margin-left: 50px;
    color: ${props => props.theme.palette.contrastText};
    background: ${props => props.theme.palette.backgroundHighContrast};
    
    @media(max-width: 1500px) {
        transform:scale(0.75);
        transform-origin:left bottom;
    }
    
    @media(max-width: 1080px) { 
        transform:scale(0.65);
        transform-origin:left bottom;
    }
    
    @media(max-width: 940px) {
        transform:scale(0.55);
        transform-origin:left bottom;
    }
    
    @media(max-width: 790px) {
        transform:scale(0.45);
        transform-origin:left bottom;
    }
    
    @media(max-width: 700px) {
        transform:scale(0.35);
        transform-origin:left bottom;
    }
`;

const customStyle = () => ({
    default: {
        'margin-left': '0 !important',
    },
    buyPosition: {
        'bottom': '300px',
        'width': '300px',
        'margin-left': '0 !important',
    },
    sellPosition: {
        'left': '17.5%',
        'bottom': '300px',
        'width': '300px',
        'margin-left': '0 !important',
    }
});

const SimpleSnackbar = ({
    open,
    message,
    onClose,
    snackbarPositionType,
    isRight,
    classes,
    ...props
}) => {
    const msg = typeof message === 'function' ? message : () => message;
    let customPositionClass = classes.default;

    switch (snackbarPositionType) {
        case BUY_SIDE:
            customPositionClass = classes.buyPosition;
            break;
        case SELL_SIDE:
            customPositionClass = classes.sellPosition;
            break;
        default:
            break;
    }
    if (isRight) {
        customPositionClass = classes.buyPosition;
    }

    return (
        <StyledSnackbar
            {...props}
            key={new Date().toString()}
            open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={4000}
            onClose={onClose}
            message={
                <React.Fragment>
                    <span>{msg()}</span>
                </React.Fragment>
            }
            action={[
                <IconButton key={new Date().toString()} color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ]}
            className={customPositionClass}
        />
    );
};

export default withStyles(customStyle)(SimpleSnackbar);
