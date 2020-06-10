import React, { useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { UserSession, AppConfig } from 'blockstack'
import { Connect, AuthOptions } from '@blockstack/connect'

import { defaultState, AppContext } from './AppContext'
import Exchange from './Exchange'
import { Header } from "./Header"
import Landing from './Landing'
import Main from './Main'
import Pool from './Pool'
import Profile from './Profile'
import { getAuthOrigin } from './utils'


export default function App(props) {
  const [state, setState] = React.useState(defaultState)
  const [authResponse, setAuthResponse] = React.useState('')
  const [appPrivateKey, setAppPrivateKey] = React.useState('')

  const appConfig = new AppConfig(['store_write'], document.location.href, '', '/manifest.json', 'https://test-registrar.blockstack.org')
  console.log("appConfig", appConfig)
  const userSession = new UserSession({ appConfig })

  const authOrigin = getAuthOrigin()

  const signOut = () => {
    userSession.signUserOut()
    setState({ userData: null })
  }

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      setState({ userData })
    }
  }, [])

  const AppContent = () => {
    const state = useContext(AppContext)
    return (
      <div>
        {!state.userData && <Landing/>}
        {state.userData &&
          <div>
            <Switch>
              <Route path="/pool">
                <Pool />
              </Route>
              <Route path="/exchange">
                <Exchange />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/">
                <Main />
              </Route>
            </Switch>
          </div>
        }
      </div>
    )
  }

  const authOptions: AuthOptions = {
    manifestPath: '/manifest.json',
    redirectTo: '/',
    userSession,
    finished: ({ userSession, authResponse }) => {
      const userData = userSession.loadUserData()
      console.log("userData", userData)
      setAppPrivateKey(userData.appPrivateKey)
      setAuthResponse(authResponse)
      setState({ userData })
    },
    authOrigin,
    appDetails: {
      name: 'swapr',
      icon: `${document.location.origin}/swapr.png`,
    },
  }

  const { userData } = state

  console.log("userData", userData)

  return (
    <div className="App">
      <Connect authOptions={authOptions}>
        <AppContext.Provider value={state}>

          <Router>
            {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
            {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}

            <Header signOut={signOut}/>
            <AppContent />
          </Router>
        </AppContext.Provider>
      </Connect>
    </div>
  )
}
