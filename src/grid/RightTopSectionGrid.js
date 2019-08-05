import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import CoinPairSearchV2 from '@/components/CoinPairSearchV2';
import GraphTool from '@/components/GraphTool';
import RightLowerSectionGrid from './RightLowerSectionGrid';
import ColdStorage from '@/components/ColdStorage';

const StyledRightTopSectionGrid = styled.div`
    position: relative;
    margin-left: 12px;
    ${props => (props.isMobilePortrait || props.isSmallWidth ? 'display: none;' : 'flex: 1;')}
`;

const GraphGrid = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const SearchBarGridArea = styled.div`
    grid-area: search;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    min-width: 0;
    background-color: ${props => props.theme.palette.clrChartBackground};
    z-index: ${props => (props.rightBottomSectionFullScreenMode ? '100' : '1000000')};
`;

const ChartGridArea = styled.div`
    flex: 1;
    position: relative;
    margin-top: 12px;
`;

class RightTopSectionGrid extends React.Component {
    render() {
        const {
            isMobilePortrait,
            isSmallWidth,
            isPayApp,
            rightBottomSectionFullScreenMode,
            isMobileDevice,
            arbMode,
        } = this.props;

        return (
            (!isPayApp || !isMobileDevice) && (
                <StyledRightTopSectionGrid
                    isMobilePortrait={isMobilePortrait}
                    isSmallWidth={isSmallWidth}
                    id="right-side"
                >
                    <GraphGrid>
                        <SearchBarGridArea
                            rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}
                        >
                            <CoinPairSearchV2 />
                        </SearchBarGridArea>
                        <ChartGridArea id="right-top">
                            {!arbMode ? <GraphTool /> : <ColdStorage />}
                        </ChartGridArea>
                        
                        <RightLowerSectionGrid hasMargin />
                    </GraphGrid>
                </StyledRightTopSectionGrid>
            )
        );
    }
}

const withStore = compose(
    inject(STORE_KEYS.VIEWMODESTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                isPayApp,
                viewMode,
                rightBottomSectionFullScreenMode,
                setRightBottomSectionOpenMode,
                arbMode
            },
        }) => ({
            isPayApp,
            viewMode,
            rightBottomSectionFullScreenMode,
            setRightBottomSectionOpenMode,
            arbMode
        })
    )
);

export default withStore(RightTopSectionGrid);
