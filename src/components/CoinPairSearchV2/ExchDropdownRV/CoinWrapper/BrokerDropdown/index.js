import React, { memo, useState, useEffect } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';
import Spinner from '@/components-generic/Spinner';
import {
    Wrapper,
    SelectWrapper,
    Selector,
    DropdownWrapper,
    StyleWrapper,
    SelectItem,
    TxtNoMatch
} from './styles'
import { DEALERS_URL } from '@/config/constants';

const BrokerSelect = memo(({ placeholder }) => {

    const [dropdownShow, setDropdownShow] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [brokers, setBrokers] = useState([])
    const [filteredBrokers, setFilteredBrokers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        fetch(DEALERS_URL)
            .then(response => response.json())
            .then(data => {
                setLoading(false)
                setBrokers(data.data)
                setFilteredBrokers(data.data)
            })
            .catch(console.log);
    }, []);

    const isSearched = (item, query) => {
        const lowerCaseQuery = query.toString().toLowerCase();
        const srcStr = item.toString().toLowerCase();

        return srcStr.includes(lowerCaseQuery);
    };

    const onSelect = () => {
        setDropdownShow(!dropdownShow);
    }

    const onClickItem = item => {
        setSearchValue(item);
        setDropdownShow(false);
    }

    const handleChangeSearchValue = e => {
        const strSearch = (e && e.target && e.target.value) || '';
        const filteredBrokers = !strSearch ? brokers : brokers.filter(broker => isSearched(broker[0], strSearch))
        setSearchValue(strSearch);
        setFilteredBrokers(filteredBrokers)
    };

    const handleScroll = ({ scrollTop }) => {
        setScrollTop(scrollTop);
    };

    const cellRenderer = width => ({ rowIndex }) => {
        const broker = filteredBrokers[rowIndex];

        if (!broker) {
            return;
        }

        return (
            <SelectItem
                key={rowIndex}
                width={width}
                onClick={() => onClickItem(broker[0])}
            >
                {broker[0]}
            </SelectItem>
        );
    };

    return (
        <Wrapper>
            <SelectWrapper>
                <Selector onClick={onSelect}>
                    <input
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={handleChangeSearchValue}
                    />
                    <CaretArrowIcon fillColor="#454c73" />
                </Selector>
                {dropdownShow &&
                    <DropdownWrapper>
                        {
                            <AutoSizer>
                                {({ width, height }) => {
                                    return (
                                        <StyleWrapper width={width} height={height}>
                                            {loading
                                                ? <Spinner />
                                                : <PerfectScrollbar onScrollY={handleScroll}>
                                                    {filteredBrokers.length === 0 && (
                                                        <TxtNoMatch>
                                                            Your search - {searchValue} - did not match any brokers
                                                    </TxtNoMatch>
                                                    )}

                                                    <Table
                                                        autoHeight
                                                        width={width}
                                                        height={height}
                                                        headerHeight={0}
                                                        disableHeader
                                                        rowCount={filteredBrokers.length}
                                                        rowGetter={({ index }) => filteredBrokers[index]}
                                                        rowHeight={50}
                                                        overscanRowCount={0}
                                                        scrollTop={scrollTop}
                                                    >
                                                        <Column dataKey="name" width={width} cellRenderer={cellRenderer(width)} />
                                                    </Table>
                                                </PerfectScrollbar>
                                            }
                                        </StyleWrapper>
                                    );
                                }}
                            </AutoSizer>
                        }
                    </DropdownWrapper>
                }
            </SelectWrapper>
        </Wrapper>
    );
});

export default BrokerSelect;
