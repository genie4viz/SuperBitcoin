export const MODE_KEYS = {
  depthChartKey: 'depth-chart',
  activeModeKey: 'active',
  filledModeKey: 'filled',
  myTradesModeKey: 'trades',
  reportsModeKey: 'reports',
  accountsModeKey: 'accounts',
  orderHistoryModeKey: 'order-history',
  tradeHistoryModeKey: 'trade-history',
  paymentHistoryModeKey: 'payment-history',
  navReportModeKey: 'nav-report',
  myPortfolioModeKey: 'my-portfolio',
};

export const MODE_LABELS = {
  [MODE_KEYS.activeModeKey]: 'Active',
  [MODE_KEYS.filledModeKey]: 'Filled and Cancelled',
  [MODE_KEYS.myTradesModeKey]: 'My Trades',
  [MODE_KEYS.depthChartKey]: 'Depth Chart',
  [MODE_KEYS.reportsModeKey]: 'Reports',
  [MODE_KEYS.accountsModeKey]: 'Accounts',
  [MODE_KEYS.orderHistoryModeKey]: 'Order History',
  [MODE_KEYS.tradeHistoryModeKey]: 'Trade History',
  [MODE_KEYS.paymentHistoryModeKey]: 'Payment History',
  [MODE_KEYS.navReportModeKey]: 'NAV Report',
  [MODE_KEYS.myPortfolioModeKey]: 'My Portfolio',
}

export const EXTRA_DROPMENU_LABELS = {
  [MODE_KEYS.activeModeKey]: [],
  [MODE_KEYS.filledModeKey]: ['Status'],
  // [MODE_KEYS.myTradesModeKey]: ['Trade', 'Source'],
  [MODE_KEYS.myTradesModeKey]: [],
}

export const DROPMENU_KEYS = [
  MODE_KEYS.myTradesModeKey,
  MODE_KEYS.depthChartKey,
  MODE_KEYS.activeModeKey,
  MODE_KEYS.filledModeKey
]