import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import OrderHistoryAdv from '@/components/OrderHistoryAdv';
import ModeSwithMenu from "@/components/ModeSwithMenu";

const StyledRightLowerSectionGrid = styled.div`
    position: ${props => props.fullScreen ? 'absolute' : 'relative'};
    width: 100%;
    bottom: 0;
    z-index: 100;
    height: ${({ theme: { palette }, fullScreen, arbMode }) => {
        if (!fullScreen) {
            return palette.lowerSectionHeight;
        }

        if (arbMode) {
            return '100%';
        }

        return 'calc(100% + 72px)';
    }};
    transition: all 0.5s ease-in-out;

    margin-top: ${props => (props.hasMargin ? '12px' : '0')};
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

const RightLowerSectionGrid = ({ hasMargin, [STORE_KEYS.VIEWMODESTORE]: viewModeStore }) => {
    const {
        rightBottomSectionOpenMode,
        setRightBottomSectionOpenMode,
        rightBottomSectionFullScreenMode,
        setRightBottomSectionFullScreenMode,
        arbMode,
    } = viewModeStore;
    return (
        <StyledRightLowerSectionGrid
            id="rightLowerSectionGrid"
            hasMargin={hasMargin}
            fullScreen={rightBottomSectionFullScreenMode}
            arbMode={arbMode}
        >
            <OrderHistoryAdv
                rightBottomSectionOpenMode={rightBottomSectionOpenMode}
                setRightBottomSectionOpenMode={setRightBottomSectionOpenMode}
                rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}
                setRightBottomSectionFullScreenMode={setRightBottomSectionFullScreenMode}
                arbMode={arbMode}
            />
            {!arbMode && <ModeSwithMenu/>}
        </StyledRightLowerSectionGrid>
    );
};

export default inject(
    STORE_KEYS.VIEWMODESTORE,
)(observer(RightLowerSectionGrid));
