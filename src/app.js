/**
 * Created by rford on 9/23/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
//import { Provider } from 'react-redux';
require("babel-core/register");
require("babel-polyfill");

//import store from './store';

import App from './components/App';

// ReactDOM.render(
//     <Provider store={store}>
//         <App></App>
//     </Provider>,
//     document.getElementById('app')
// );
ReactDOM.render(<App></App>,document.getElementById('app'));
