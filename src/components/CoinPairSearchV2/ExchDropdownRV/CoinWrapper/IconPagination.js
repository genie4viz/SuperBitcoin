import React, {memo, useState, useEffect, useRef} from 'react';
import styled from 'styled-components/macro';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';

const PaginationWrapper = styled.div`    
    display: flex;
    padding: 0px 10px !important;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-direction: row;
    width: 250px;
    height: 32px;
`;
const StageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 220px;
    height: 100%;
    .carousel-stage {        
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
`;
const ArrowWrapper = styled.div`
    width: 16px;
    height: 100%;
    display: flex;
    z-index: 300;
    justify-content:center;
    align-items: center;
    text-align: center;
    .blank-space{
        width: 16px;
    }
`;

const showCounts = 7;

const IconPagination = memo(({socialItems}) => {
    const [curIndex, setCurIndex] = useState(0);
    const currentItems = useRef(socialItems.filter((_, i) => i < showCounts));
    useEffect(() => {
        currentItems.current = socialItems.filter((_, i) => i < showCounts);
        setCurIndex(0);
    }, [socialItems]);

    const adjustIndex = (value) => {
        currentItems.current = socialItems.filter((e, i) => i >= value && i < showCounts + value);
        setCurIndex(value);
    }
    const slideNext = () => adjustIndex(curIndex + 1);
    const slidePrev = () => adjustIndex(curIndex - 1);
        
    return (
        <PaginationWrapper>
            {socialItems.length > showCounts
                ?   <>
                        <ArrowWrapper>
                            {curIndex > 0 ? <CaretArrowIcon degree={90} onClick={slidePrev}/> : <div className="blank-space" />}
                        </ArrowWrapper>
                        <StageWrapper>
                            <div className="carousel-stage">
                                {currentItems.current}
                            </div>
                        </StageWrapper>
                        <ArrowWrapper>
                            {curIndex < socialItems.length % showCounts ? <CaretArrowIcon degree={-90} onClick={slideNext}/> : <div className="blank-space" />}
                        </ArrowWrapper>
                    </>
                :   <div className="carousel-stage">
                        {socialItems}
                    </div>
            }
        </PaginationWrapper>
    );
});

export default IconPagination;
