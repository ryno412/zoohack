/**
 * Created by rford on 9/23/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initStore from './state/store';
import { withRouter } from 'react-router-dom';
require('babel-core/register');
require('babel-polyfill');
import Main from './components/Main';

const store = initStore();

ReactDOM.render(
  <Provider store={store}>{withRouter(Main)}</Provider>,
  document.getElementById('app')
);
