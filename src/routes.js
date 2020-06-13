import React from 'react'

const Exchange = React.lazy(() => import('./Exchange'))
const Pool = React.lazy(() => import('./Pool'))
const Wrap = React.lazy(() => import('./Wrap'))
const Faucets = React.lazy(() => import('./Faucets'))
const Dashboard = React.lazy(() => import('./Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home', component: Dashboard },
  { path: '/exchange', name: 'Exchange', component: Exchange },
  { path: '/pool', name: 'Pool', component: Pool, exact: true },
  { path: '/wrapr', name: 'Wrap', component: Wrap },
  { path: '/faucets', name: 'Faucet', component: Faucets },
]

export default routes
