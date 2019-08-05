import React from 'react';
import { Column, Table } from 'react-virtualized';
import styled from 'styled-components/macro';
import PerfectScrollBar from 'react-perfect-scrollbar';
import CoinIcon from '@/components-generic/CoinIcon';

const StyleWrapper = styled.div.attrs({ className: 'coin-select-wrapper' })`
    position: absolute;
    top: 100%;
    left: -1px;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    z-index: 50;
    
    opacity: 0;
    visibility: hidden;
    
    &.open {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    div.coin-dropdown-list {
        width: 370px;
        height: 240px;
        
        .scrollbar-container {
            height: auto;
            max-height: 240px;
                        
            box-shadow: 0 2px 10px rgba(0,0,0,.35);
            border: 1px solid ${props => props.theme.palette.sendCoinsModalBorder};
            border-radius: 0 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius};
            background: ${props => props.theme.palette.sendCoinsModalItemBg};
            overflow: hidden;
            
            .ps__rail-y {
                opacity: 1 !important;
                border-left: 1px solid ${props => props.theme.palette.sendCoinsModalBorder};
                background: ${props => props.theme.palette.sendCoinsModalItemBg};

                .ps__thumb-y {
                    &:before {
                        background: ${props => props.theme.palette.sendCoinsModalBorder};
                    }
                    cursor: pointer;
                }
            }
        }
    }
    
    div.coin-dropdown-list__item {
        padding: 6px 15px;
        height: 58px;
        background-color: ${props => props.theme.palette.sendCoinsModalItemBg};
        display: flex;
        align-items: center;
        border-bottom: 1px solid ${props => props.theme.palette.sendCoinsModalItemBorder};
        
        &:hover {
            cursor: pointer;
            background: ${props => props.theme.palette.sendCoinsModalItemHoverBg} !important;
            
            p {
                color: ${props => props.theme.palette.sendCoinsModalItemHoverText} !important;
            }
        }
        
        &.selected {
            p {
                color: ${props => props.theme.palette.sendCoinsModalItemActiveText} !important;
            }
        }
    }
    
    div.name-wrapper {
        margin-left: 10px;
        display: flex;
        align-items: center;
    }

    p.text-delimiter {
        margin: 0 3px;
        font-size: 16px;
        color: ${props => props.theme.palette.sendCoinsModalItemText};
    }
    
    p.short-name {
        margin: 0;
        font-weight: 600;
        font-size: 16px;
        color: ${props => props.theme.palette.sendCoinsModalItemText};
    }
    
    p.full-name {
        margin: 0;
        font-weight: 300;
        font-size: 16px;
        color: ${props => props.theme.palette.sendCoinsModalItemText};
    }
    
    .ReactVirtualized__Table__rowColumn {
        margin-left: 0;
        text-overflow: inherit;
        overflow: initial !important;
    }
    
    .ReactVirtualized__Table__row {
        .ReactVirtualized__Table__rowColumn {
            &:last-child {
                margin-right: 0;
            }
        }
    }
    
    .ReactVirtualized__Table__Grid {
        outline: none !important;
        box-shadow: 7px 6px 11px rgba(0, 0, 0, .05);
    }
`;

class CoinSelect extends React.PureComponent {
    constructor(props) {
        super(props);

        this.scrollRef = null;

        this.state = {
            scrollTop: 0,
        };
    }

    onSelectItem = value => {
        this.props.onChange(value);
    };

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    cellRenderer = ({ rowIndex }) => {
        const item = this.props.items[rowIndex];

        if (!item) {
            return;
        }

        return (
            <div
                className={`coin-dropdown-list__item ${this.props.value && item.symbol && this.props.value.symbol === item.symbol ? 'selected' : ''}`}
                key={rowIndex}
                role="button"
                tabIndex={0}
                onClick={() => this.onSelectItem(item)}
            >
                <CoinIcon value={item} size={22}/>
                <div className="name-wrapper">
                    <p className="short-name">{(item.symbol || '').replace('F:', '')}</p>
                    <p className="text-delimiter">-</p>
                    <p className="full-name">{(item.name || '').replace('F:', '')}</p>
                </div>
            </div>
        );
    };

    render() {
        const { scrollTop } = this.state;
        const { items, isOpen } = this.props;

        return (
            <StyleWrapper className={isOpen ? 'open' : ''}>
                <div className="coin-dropdown-list">
                    {/* <AutoSizer> */}
                    {/* {({ width, height }) => { */}
                    {/* return ( */}
                    <PerfectScrollBar
                        containerRef={ref => { this.scrollRef = ref; }}
                        options={{
                            suppressScrollX: true,
                            minScrollbarLength: 30,
                        }}
                        onScrollY={this.handleScroll}
                    >
                        <Table
                            autoHeight={true}
                            width={370}
                            height={240}
                            headerHeight={0}
                            disableHeader={true}
                            rowCount={items.length}
                            rowGetter={({ index }) => items[index]}
                            rowHeight={58}
                            overscanRowCount={0}
                            scrollTop={scrollTop}
                        >
                            <Column
                                dataKey="name"
                                width={370}
                                cellRenderer={this.cellRenderer}
                            />
                        </Table>
                    </PerfectScrollBar>
                    {/* ); */}
                    {/* }} */}
                    {/* </AutoSizer> */}
                </div>
            </StyleWrapper>
        );
    }
}

export default CoinSelect;
