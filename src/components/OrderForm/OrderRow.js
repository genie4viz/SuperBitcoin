import React from 'react';
import styled from 'styled-components/macro';
import { AutoSizer } from 'react-virtualized';
import OrderCell from './OrderCell';

const Wrapper = styled.div.attrs({ className: 'order-row' })`
    height: 40px;
`;

const Content = styled.div`
    width: ${props => props.width}px;
    height: 40px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${props => props.theme.palette.clrMainWindow};
    border: 2px solid ${props => props.theme.palette.clrBorder};
    font-size: 16px;
    font-weight: 600;
    position: relative;
    overflow: hidden;
`;

const OrderRow = ({ isBuy, isLeft, animation }) => (
    <Wrapper>
        <AutoSizer>
            {({ width }) => (
            <Content width={width}>
                <OrderCell width={width} isBuy={isBuy} isLeft={isLeft} animation={animation} />
                <OrderCell width={width} isBuy={isBuy} isLeft={isLeft} animation={animation} isHover />
            </Content>
            )}
        </AutoSizer>
    </Wrapper>
);

export default OrderRow;