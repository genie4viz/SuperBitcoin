import { sortBy } from 'lodash';

const isSearched = (item, query) => {
    const lowerCaseQuery = query.toLowerCase();
    let symbolSrcStr;
    let nameSrcStr;

    try {
        symbolSrcStr = (item.symbol && item.symbol.length ? item.symbol : '').replace('F:', '').toLowerCase();
        nameSrcStr = (item.name && item.name.length ? item.name : '').toLowerCase();
    } catch (e) {
        return -1;
    }

    if (!query) {
        return 999;
    }

    const symbolContains = symbolSrcStr.includes(lowerCaseQuery);
    const nameContains = nameSrcStr.includes(lowerCaseQuery);

    const symbolWeight = Math.abs(lowerCaseQuery.length - symbolSrcStr.length);
    const nameWeight = Math.abs(lowerCaseQuery.length - nameSrcStr.length);

    let weight = -1;

    if (symbolContains) {
        weight = symbolWeight;
    }

    if (nameContains) {
        weight = weight < nameWeight && weight !== -1 ? weight : nameWeight;
    }

    return weight;
};

export const getTableItems = (
    { topGroupItems, timestamp, mainItems = [], isLeft, isOpen },
    { searchInputValue, selectedValue }
) => {
    if (!isOpen) {
        return null;
    }

    let tableItems = [];
    let searchedTopGroupItems = [];
    let searchedTopGroupItemsWeights = [];

    if (topGroupItems && topGroupItems.length && isLeft) {
        for (let i = 0; i < topGroupItems.length; i++) {
            const weight = isSearched(topGroupItems[i], searchInputValue);
            if (weight >= 0 && topGroupItems[i].file) {
                searchedTopGroupItemsWeights.push({
                    weight,
                    item: topGroupItems[i]
                });
            }
        }

        searchedTopGroupItemsWeights = sortBy(searchedTopGroupItemsWeights, item => item.weight);
        searchedTopGroupItems = searchedTopGroupItemsWeights.map(val => val.item);

        tableItems = tableItems.concat(searchedTopGroupItems);
    }

    let searchedMainItemsWeights = [];

    if (mainItems.length) {
        mainItems.forEach((item = {}) => {
            const weight = isSearched(item, searchInputValue);
            const shouldAdd = isLeft ? weight >= 0 && item.file : item.symbol === 'BTC' || item.symbol === 'USDT';
            if (shouldAdd) {
                searchedMainItemsWeights.push({
                    weight,
                    item
                });
            }
        });

        if (searchedMainItemsWeights.length) {
            searchedMainItemsWeights = sortBy(searchedMainItemsWeights, item => item.weight);
            tableItems = tableItems.concat(searchedMainItemsWeights.map(val => val.item));
        }
    }

    if (searchInputValue) {
        const lowerSearchInputValue = searchInputValue.toLowerCase();
        tableItems = tableItems.filter(tableItem => {
            const nameIndex = tableItem.name.toLowerCase().indexOf(lowerSearchInputValue);
            const symbolIndex = (tableItem.symbol ? tableItem.symbol.replace('F:', '') : '')
                .toLowerCase()
                .indexOf(lowerSearchInputValue);
            return symbolIndex === 0 || nameIndex === 0 || (nameIndex > 0 && tableItem.name[nameIndex - 1] === ' ');
        });
        tableItems = sortBy(tableItems, tableItem => {
            const nameIndex = tableItem.name.toLowerCase().indexOf(lowerSearchInputValue);
            const symbolIndex = tableItem.symbol
                .replace('F:', '')
                .toLowerCase()
                .indexOf(lowerSearchInputValue);
            return symbolIndex !== -1 ? symbolIndex : nameIndex + 20;
        });
    }

    tableItems.sort((x, y) => (x.symbol === selectedValue ? -1 : y === selectedValue ? 1 : 0));

    // Add AUM - Assets Under Management to be able to select it in dropdown
    if (!searchInputValue) {
        tableItems.unshift({
            name: 'AUM',
            symbol: 'AUM',
        })
    }

    return {
        tableItems,
        timestamp
    };
};
