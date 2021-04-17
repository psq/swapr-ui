import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import './polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import { icons } from './icons'
import App from './App.js'

React.icons = icons

ReactDOM.render(
  <RecoilRoot>
    <App/>
  </RecoilRoot>,
  document.getElementById('App'),
)
