import React, { memo } from 'react';

import { SwipArrowIcon } from 'components-generic/ArrowIcon';

const CoinSwapToggle = memo(({ isShortSell, isSwapMode, isSwapped, toggleSwap }) => (
    <button
        className={`exch-head__switch ${!isShortSell && !isSwapMode && 'shortsell'} ${isSwapped && 'switched'}`}
        onClick={isShortSell || isSwapMode ? toggleSwap : undefined}
    >
        <SwipArrowIcon />
    </button>
));

export default CoinSwapToggle;
