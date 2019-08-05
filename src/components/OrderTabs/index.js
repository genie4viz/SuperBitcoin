import React, { Component, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import {
    FormHeader,
    TabsWrapper,
    DropdownWrapper,
    SelectedItem,
    ArrowIcon,
    Dropdown,
    Item,
    SubItem,
    RowWrapper,
    SubRowWrapper
} from './Components';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import { noop } from '@/utils';
import { graphViewModeKeys } from '@/stores/ViewModeStore';
import { MODE_KEYS } from '@/components/OrderHistoryAdv/Constants';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';

class OrderTabs extends Component {
    state = {
        formIndex: 0,
        isOpened: false,
        isSubItemOpened: false,
        selectedBase: this.props.selectedBase,
        arbMode: this.props.arbMode,
        showPortfolio: false,
        selectedTabIndex: -1
    };

    wrapperRef = React.createRef();

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.arbMode !== nextProps.arbMode || prevState.selectedBase !== nextProps.selectedBase) {
            return {
                arbMode: nextProps.arbMode,
                selectedBase: nextProps.selectedBase,
                formIndex: nextProps.arbMode ? 1 : 0,
                showPortfolio: nextProps.arbMode
            };
        }

        return {};
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (
            this.state.isOpened &&
            this.wrapperRef.current &&
            this.wrapperRef.current.contains &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            this.setState({
                isOpened: false
            });
        }
    };

    handleTabChange = (isOption, index) => () => {

        const { setRightBottomSectionOpenMode, setArbMode, arbMode, connectedExchanges } = this.props;
        const { formIndex } = this.state;
        if (arbMode) {
            if (formIndex === 0) {
                this.props.setPortPriceGraphViewMode(graphViewModeKeys.valueMode);
            } else if (formIndex === 1) {
                this.props.setPortPriceGraphViewMode(graphViewModeKeys.numberMode);
            } else if (formIndex === 2) {
                this.props.setPortPriceGraphViewMode(graphViewModeKeys.unfixedMode);
            }
            setArbMode(false);
            this.setState({ formIndex: 0, showPortfolio: false, isOpened: false });
            setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
        }
        // Disable toggle if there no connected exchanges
        if (connectedExchanges.length > 0) {
            if (!isOption) {
                this.setState({ formIndex: index });
            }
            this.setState({ isOpened: false });
        }
    };

    openDropdown = () => {
        this.setState({ isOpened: true });
    };

    closeDropdown = () => {        
        this.setState({ 
            isOpened: false, 
            selectedTabIndex: -1,
            isSubItemOpened: false
        });
    };

    handleTabMouseEnter = (event, index) => {
        event.preventDefault();
        event.stopPropagation();
        
        this.setState({selectedTabIndex: index});
        if(index > 1){
            this.setState({isSubItemOpened: true});
        }else{
            this.setState({isSubItemOpened: false});
        }
    };  

    render() {
        const { formIndex: formIdx, isOpened, isSubItemOpened, showPortfolio, selectedTabIndex } = this.state;
        const { children, tabs, subtabs, arbMode, activeCoin: act } = this.props;
        const activeCoin = (act || '').replace('F:', '');
        const optionEnabled = activeCoin === 'USDT' || !arbMode || showPortfolio;
        const formIndex = arbMode ? 0 : formIdx;
        let childIndex = formIndex;
        if (arbMode) {
            childIndex += 5;
        }
        const selectedTab = tabs[0];

        return (
            <Fragment>
                <FormHeader id="form-header">
                    <ExchangesLabel />
                    <TabsWrapper>
                        <DropdownWrapper ref={this.wrapperRef}>
                            <SelectedItem 
                                onMouseEnter={optionEnabled ? this.openDropdown : noop}
                                onMouseLeave={optionEnabled ? this.closeDropdown : noop}
                            >
                                <span>
                                    {selectedTab && selectedTab[formIndex]}
                                </span>
                                {optionEnabled && <ArrowIcon open={isOpened} />}
                                <div className="dropdown_wrapper_space" />
                            </SelectedItem>
                            {optionEnabled && (
                                <Dropdown isHovered={isOpened}
                                    onMouseEnter={optionEnabled ? this.openDropdown : noop}
                                    onMouseLeave={optionEnabled ? this.closeDropdown : noop}
                                >
                                    {tabs.map((tab, index) => {
                                        if ((!arbMode || showPortfolio) && index < 1) {
                                            return tab.map((item, mIndex) => {
                                                const subItems = [];
                                                if(selectedTabIndex > 0){// market, stop, limit, stop limit
                                                    subtabs.forEach((subItem, sIndex) => {
                                                        subItems.push(
                                                            <SubItem 
                                                                key={`${selectedTabIndex}-${sIndex}`}
                                                            >
                                                                {subItem}
                                                            </SubItem>
                                                        );
                                                    });
                                                }
                                                return <RowWrapper key={`${index}-${mIndex}`}>
                                                    <Item
                                                        active={!index && formIndex === mIndex}
                                                        isHovered={mIndex === selectedTabIndex}
                                                        onMouseEnter={(event) => this.handleTabMouseEnter(event, mIndex)}
                                                        onClick={this.handleTabChange(false, mIndex)}
                                                    >
                                                        {item}
                                                    </Item>
                                                    {selectedTabIndex === mIndex && selectedTabIndex > 0 &&
                                                        <SubRowWrapper
                                                            onMouseLeave={optionEnabled && !isSubItemOpened ? this.closeDropdown : noop}
                                                        >
                                                            {subItems}
                                                        </SubRowWrapper>
                                                    }
                                                </RowWrapper>
                                            })
                                        }
                                        if (arbMode && index === 2) {
                                            return tab.map((item, mIndex) => {
                                                return (
                                                    <Item
                                                        key={`${index}-${mIndex}`}
                                                        active={formIndex === mIndex}
                                                        onClick={this.handleTabChange(false, mIndex, item)}
                                                    >
                                                        {item}
                                                    </Item>
                                                );
                                            });
                                        }

                                        return null;
                                    })}
                                    <div className="dropdown_space" />
                                    <CaretArrowIcon fillColor="#454c73" borderColor="#020518" className="dropdown_arrow"/>
                                </Dropdown>
                            )}
                        </DropdownWrapper>
                    </TabsWrapper>
                </FormHeader>
                {children[childIndex]}
            </Fragment>
        );
    }
}

export default compose(
    inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.ARBITRAGESTORE, STORE_KEYS.EXCHANGESSTORE, STORE_KEYS.INSTRUMENTS),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: { setAdvancedAPIMode, arbMode, setPortPriceGraphViewMode, setRightBottomSectionOpenMode },
            [STORE_KEYS.ARBITRAGESTORE]: { activeCoin },
            [STORE_KEYS.EXCHANGESSTORE]: { connectedExchanges, getActiveExchanges, marketExchanges, exchanges },
            [STORE_KEYS.INSTRUMENTS]: { selectedBase }
        }) => ({
            setAdvancedAPIMode,
            arbMode,
            setPortPriceGraphViewMode,
            setRightBottomSectionOpenMode,
            activeCoin,
            connectedExchanges,
            getActiveExchanges,
            marketExchanges,
            exchanges,
            selectedBase
        })
    )
)(OrderTabs);
