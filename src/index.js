import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '@/config/polyfills';  // custom polyfill
import 'react-virtualized/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from './App';
import { getClientLive, getClientTrade } from './lib/bct-ws';
import * as serviceWorker from './serviceWorker';
import telegramLogin from './lib/tg-auth';

// TODO: set dsn in .env or config, don't hardcore here
Sentry.init(
    {dsn: "https://9e37162aad8c4b7e86d3a8e2396be980@sentry.bct.tools//2"});



getClientLive();
getClientTrade()
.catch(e => console.log(e.message || 'can not getClientTrade'));
// TODO refactoring: do we need this?
telegramLogin();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
