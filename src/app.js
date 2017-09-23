/**
 * Created by rford on 9/23/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initStore from './state/store';
import { withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
require('babel-core/register');
require('babel-polyfill');
import MainContainer from './containers/MainContainer';

const store = initStore();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <MainContainer />
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
);
