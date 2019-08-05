import React from 'react';

import {
  NotificationWrapper,
  NotificationText
} from './Components';

class Notification extends React.Component {

  _timeout = [];

  state = {
    status: 'initial',
    duration: 7
  }

  componentDidMount() {
    this._timeout.push(setTimeout(() => this.setState({ status: 'start' }), 100));
    this._timeout.push(setTimeout(() => this.setState({ status: 'end'}), this.state.duration * 1000 + 100));
  }

  componentWillUnmount() {
    for (let i = 0; i < this._timeout.length; i++) {
        clearTimeout(this._timeout[i]);
    }
  }

  render() {
    const { msg } = this.props;
    const { status } = this.state;

    return (
      <NotificationWrapper status={status}>
        <NotificationText>{msg}</NotificationText>
      </NotificationWrapper>
    );
  }
}

export default Notification;