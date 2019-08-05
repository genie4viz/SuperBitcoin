import React from 'react';
import COIN_DATA_MAP from '../../../../mock/coin-data-map';
import { NoFlag, ExchDropdownSearchIconSvg } from '../Components';

class CoinIcon extends React.Component {

  state = {
    error: false
  }

  getCoinIconUrl = () => {
    const { item } = this.props;

    switch (item.type) {
      case 'xignite':
        return `/img/xignite/${item.code.toLowerCase()}.png`;
      case 'country':
        return `/img/icons-coin/${item.currencyCode.toLowerCase()}.png`;
      case 'stock':
        return `https://storage.googleapis.com/iex/api/logos/${item.currencyCode}.png`
      default:
        if (COIN_DATA_MAP[item.currencyCode] && COIN_DATA_MAP[item.currencyCode].file) {
          if(COIN_DATA_MAP[item.currencyCode].file.indexOf('svg') < 0) {
            return `img/icons-coin/${COIN_DATA_MAP[item.currencyCode].file}`;
          }
          return `/img/sprite-coins-view.svg#coin-${item.currencyCode.toLowerCase()}`;
        }
        return `img/coin/coin-${item.currencyCode.toLowerCase()}.png`;
    }
  }

  handleError = () => {
    this.setState({ error: true });
  }

  render() {
    const { item } = this.props;
    const { error } = this.state;

    return (
      !error
        ? (item.type === 'xignite' ? (
            // <img src={this.getCoinIconUrl(item)} className="flag" alt="" onError={e => this.handleError(e)} style={{ borderRadius: 0 }}/>
            <ExchDropdownSearchIconSvg viewBox="0 0 100 100" x="0px" y="0px" onError={e => this.handleError(e)} style={{ width: '28px' }}>
                <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
                <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
            </ExchDropdownSearchIconSvg>
          ) : (
            <img src={this.getCoinIconUrl(item)} className="flag" alt="" onError={e => this.handleError(e)} onClick={this.props.click}/>
          ))
        : <NoFlag onClick={this.props.click} size={this.props.size} length={item.currencyCode.length}>{item.currencyCode}</NoFlag>      
    );
  }
}

export default CoinIcon;
