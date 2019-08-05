import styled from 'styled-components';

export const DataLoaderWrapper = styled.div`
    position: relative;
    margin-left: 30px;
`;

export const ExchangeRateWrapper = styled.div`
    padding: 0 12px;
    margin: 0;
    line-height: 1;
    font-size: 40px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    position: relative;
    text-transform: uppercase;
    color: ${props => props.theme.palette.coinPairSelectText2};
`;