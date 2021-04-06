import React from 'react'

const Pair = React.lazy(() => import('./Pair'))
const Token = React.lazy(() => import('./Token'))
const Pairs = React.lazy(() => import('./Pairs'))
const Tokens = React.lazy(() => import('./Tokens'))
const Faucets = React.lazy(() => import('./Faucets'))
const Dashboard = React.lazy(() => import('./Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home', component: Dashboard },
  { path: '/tokens', name: 'Tokens', component: Tokens },
  { path: '/pairs', name: 'Pairs', component: Pairs },
  { path: '/pair/:pairId', name: 'Pair', component: Pair, exact: true },
  { path: '/token/:tokenId', name: 'Pair', component: Token, exact: true },
  // { path: '/wrapr', name: 'Wrap', component: Wrap },
  { path: '/faucets', name: 'Faucet', component: Faucets },
]

export default routes
