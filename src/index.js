import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import './polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
import { RecoilRoot } from 'recoil'

import { icons } from './icons'

import App from './App.js'
// import store from './store'

React.icons = icons

// ReactDOM.render(
//   <Provider store={store}>
//     <RecoilRoot>
//       <App/>
//     </RecoilRoot>
//   </Provider>,
//   document.getElementById('App'),
// )
ReactDOM.render(
  <RecoilRoot>
    <App/>
  </RecoilRoot>,
  document.getElementById('App'),
)
