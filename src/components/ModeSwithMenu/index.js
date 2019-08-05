import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { DropdownWrapper, DropMenuIcon, SelectedItemLabel, Dropdown, DropdownItem } from './Components';
import { STORE_KEYS } from '@/stores/index';
import { MODE_KEYS, MODE_LABELS } from '@/components/OrderHistoryAdv/Constants';

class ModeSwithMenu extends Component {
    state = {
        isOpen: false
    };

    wrapperRef = React.createRef();

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (
            this.state.isOpen &&
            this.wrapperRef.current &&
            this.wrapperRef.current.contains &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            this.setState({
                isOpen: false
            });
        }
    };

    toggleDropDown = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    };

    onSelectItem = mode => {
        const { setRightBottomSectionOpenMode, setArbMode, setTradingViewMode } = this.props;

        setRightBottomSectionOpenMode(mode);
        if (mode === MODE_KEYS.myPortfolioModeKey) {
            setArbMode(true);
            setTradingViewMode(false);
        } else {
            setArbMode(false);
        }
        this.toggleDropDown();
    };

    render() {
        const { isOpen } = this.state;
        const { rightBottomSectionOpenMode, rightBottomSectionFullScreenMode, activeReports } = this.props;

        if (rightBottomSectionFullScreenMode) {
            return null;
        }
        const height = this.dropdownRef && this.dropdownRef.scrollHeight;
        const item_min_height = 45;
        return (
            <DropdownWrapper ref={this.wrapperRef}>
                <SelectedItemLabel onClick={this.toggleDropDown}>
                    <span>{MODE_LABELS[rightBottomSectionOpenMode]}</span>
                    <DropMenuIcon isOpened={isOpen} />
                </SelectedItemLabel>

                <Dropdown 
                    activeReportLength={activeReports.length} 
                    isOpened={isOpen && !!activeReports.length}
                    height={activeReports.length ? item_min_height * activeReports.length : height}
                    ref={ref => this.dropdownRef = ref}
                >
                    {activeReports.map(key => (
                        <DropdownItem
                            key={key}
                            active={rightBottomSectionOpenMode === key}
                            minHeight={item_min_height}
                            onClick={() => this.onSelectItem(key)}
                        >
                            {MODE_LABELS[key]}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </DropdownWrapper>
        );
    }
}

export default compose(
    inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.SETTINGSSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                rightBottomSectionOpenMode,
                setRightBottomSectionOpenMode,
                rightBottomSectionFullScreenMode,
                setArbMode,
                setTradingViewMode
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                activeReports
            }
        }) => ({
            rightBottomSectionOpenMode,
            setRightBottomSectionOpenMode,
            rightBottomSectionFullScreenMode,
            setArbMode,
            setTradingViewMode,
            activeReports
        })
    )
)(ModeSwithMenu);
