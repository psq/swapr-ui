import React, { useEffect, useContext, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { UserSession, AppConfig } from 'blockstack'
import { Connect, AuthOptions } from '@blockstack/connect'
import { addressToString } from '@blockstack/stacks-transactions'

import { CContainer, CFade } from '@coreui/react'

import './scss/style.scss'

import {
  getStacksAccount,
  fetchAccount,
} from './StacksAccount'

import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import TheSidebar from './TheSidebar'

import { defaultState, AppContext } from './AppContext'
import Landing from './Landing'
// import Exchange from './Exchange'
// import Main from './Main'
// import Pool from './Pool'
// import Profile from './Profile'
import { getAuthOrigin } from './utils'

import routes from './routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const appConfig = new AppConfig(['store_write'], document.location.href, '', '/manifest.json', 'https://test-registrar.blockstack.org')
const userSession = new UserSession({ appConfig })
console.log("appConfig", appConfig)

export default function App(props) {
  const [state, setState] = React.useState(defaultState)
  const dispatch = useDispatch()
  // const [authResponse, setAuthResponse] = React.useState('')
  // const [appPrivateKey, setAppPrivateKey] = React.useState('')

  const authOrigin = getAuthOrigin()

  const signOut = () => {
    userSession.signUserOut()
    setState({ userData: null, show_landing: true, })
    dispatch({type: 'set_stx', stx_balance: null})
  }

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      setState(state => ({ ...state, userData }))
    } else {
      setState(state => ({ ...state, show_landing: true }))
    }
  }, [])

  const TheContent = () => {
    const context = useContext(AppContext)

    return (
      <main className="c-main">
        <CContainer fluid>
          <Suspense fallback={loading}>
            {context.show_landing && <Landing/>}
            {context.userData &&
              <Switch>
                {routes.map((route, idx) => {
                  return route.component && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <CFade>
                          <route.component {...props} />
                        </CFade>
                      )} />
                  )
                })}
              </Switch>
            }
          </Suspense>
        </CContainer>
      </main>
    )
  }

  const Layout = () => {
    return (
      <div className="c-app c-default-layout">
        <TheSidebar/>
        <div className="c-wrapper">
          <TheHeader signOut={signOut}/>
          <div className="c-body">
            <TheContent/>
          </div>
          <TheFooter/>
        </div>
      </div>
    )
  }

  const authOptions: AuthOptions = {
    manifestPath: '/manifest.json',
    redirectTo: '/',
    userSession,
    finished: async ({ userSession, authResponse }) => {
      // TODO(psq): this gets called 3 times
      const userData = userSession.loadUserData()
      console.log("finished.userData", userData)
      // setAppPrivateKey(userData.appPrivateKey)
      // setAuthResponse(authResponse)
      const { address } = getStacksAccount(userData.appPrivateKey)
      const stx_balance = await fetchAccount(addressToString(address))
      setState({ userData, stx_balance })
    },
    authOrigin,
    appDetails: {
      name: 'swapr',
      icon: `${document.location.origin}/swapr-square.png`,
    },
  }

  // const { userData } = state
  // console.log("userData", userData)
  // console.log("app.state", state)
  return (
    <div className="App">
      <Connect authOptions={authOptions}>
        <AppContext.Provider value={state}>

          <Router>
            {/*authResponse && <input type="hidden" id="auth-response" value={authResponse} />*/}
            {/*appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />*/}
            <Layout />
          </Router>
        </AppContext.Provider>
      </Connect>
    </div>
  )
}
