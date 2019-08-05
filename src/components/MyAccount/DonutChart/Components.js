import styled  from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border-right: 1px solid ${props => props.theme.palette.orderFormBorder}7f;
`;

export const BalanceLabel = styled.div`
    position: absolute;
    height: 50%;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: ${props => props.theme.palette.donutTotalBalanceLabel};
    font-size: 20px;
    text-align: center;
    font-weight: bold;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > div {
        color: ${props => props.theme.palette.clrHighContrast};
        padding-bottom: 5px;
    }

    > span {
        font-size: 11px;
        text-transform: uppercase;
        color: ${props => props.theme.palette.clrPurple};
    }

    .title {
        display: flex;
        align-items: center;
        color: white;
        font-size: 20px;
    }

    .details {
        font-size: 13px;
    }

    .title div:first-of-type {
        margin-right: 5px;
        border: ${props => props.isEOS ? '2px solid white' : 'none'};
    }
`;