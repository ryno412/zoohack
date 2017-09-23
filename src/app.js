/**
 * Created by rford on 9/23/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initStore from './state/store';
import { withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainContainer from './containers/MainContainer';
require('babel-core/register');
require('babel-polyfill');

const store = initStore();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <MuiThemeProvider>
        <MainContainer />
      </MuiThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
);
