import React, { useEffect, /*useContext,*/ Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { AppConfig, UserSession } from '@stacks/connect'
import { Connect } from '@stacks/connect-react'
import { CContainer, CFade } from '@coreui/react'

import './scss/style.scss'

import {
  fetchAccount,
} from './StacksAccount'

import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import TheSidebar from './TheSidebar'

import Landing from './Landing'

import {
  getAuthOrigin,
  is_mainnet,
} from './utils'

import routes from './routes'

import {
  userDataId,
  accountAddressId,
  pairList,
  tokenList,
  tokenFamily,
  pairFamily,
  tokenBalanceFamily,
  pairBalanceFamily,
  pairQuoteFamily,
} from './atoms'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const appConfig = new AppConfig([])
const userSession = new UserSession({ appConfig })

export default function App(props) {
  const [userData, setUserData] = useRecoilState(userDataId)
  const [accountAddress, setAccountAddress] = useRecoilState(accountAddressId)
  const [authResponse, setAuthResponse] = React.useState('')

  const authOrigin = getAuthOrigin()

  const signOut = () => {
    console.log("signOut")
    userSession.signUserOut()
    setAccountAddress('')
    setUserData('')
  }

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      const address = is_mainnet ? userData.profile.stxAddress.mainnet : userData.profile.stxAddress.testnet
      setAccountAddress(address)
      setUserData(userData)
      console.log()
    } else {
    }
  }, [])

  const TheContent = () => {
    return (
      <main className="c-main">
        <CContainer fluid>
          <Suspense fallback={loading}>
            {
              userData ?
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
              :
              <Landing/>
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
      console.log("authOptions.finished", userSession, authResponse)
      const userData = userSession.loadUserData();
      console.log("finished.userData", userData)
      setAuthResponse(authResponse)

      const address = is_mainnet ? userData.profile.stxAddress.mainnet : userData.profile.stxAddress.testnet
      setAccountAddress(address)
      setUserData(userData)

      console.log("authOptions.finished - done")
    },
    onCancel: () => {
      console.log('popup closed!');
    },
    authOrigin,
    appDetails: {
      name: 'swapr',
      icon: `${document.location.origin}/swapr-square.png`,
    },
  };

  return (
    <div className="App">
      <Connect authOptions={authOptions}>
        <Router>
          <Layout />
        </Router>
      </Connect>
    </div>
  )
}
