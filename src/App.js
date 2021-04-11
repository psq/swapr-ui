import React, { useEffect, useContext, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { AppConfig, UserSession } from '@stacks/connect'
import { Connect } from '@stacks/connect-react'
import { RecoilRoot } from 'recoil'
import { CContainer, CFade } from '@coreui/react'

import './scss/style.scss'

import {
  // getStacksAccount,
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
import {
  getAuthOrigin,
  is_mainnet,
} from './utils'

import routes from './routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const appConfig = new AppConfig([])
const userSession = new UserSession({ appConfig })

// console.log("appConfig", appConfig)

export default function App(props) {
  const [state, setState] = React.useState(defaultState)
  const dispatch = useDispatch()
  // const [userSession, setUserSession] = useState();
  // const {authenticated, userSession, userData, signIn, signOut, person} = useBlockstack()
  // console.log("authenticated", authenticated)
  // console.log("userSession", userSession)
  // console.log("userData", userData)
  // console.log("person", person)
  // console.log("signIn, signOut", signIn, signOut)
  // const [authResponse, setAuthResponse] = React.useState('')
  // const [appPrivateKey, setAppPrivateKey] = React.useState('')
  const [authResponse, setAuthResponse] = React.useState('')

  const authOrigin = getAuthOrigin()

  const signOut = () => {
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

  // const authOptions = useConnectOptions({
  //   authOrigin,
  //   finished: async ({ userSession, authResponse }) => {
  //     // didConnect({ userSession })
  //     console.log("authOptions.finished", userSession, authResponse)
  //     // TODO(psq): this gets called 3 times
  //     const userData = userSession.loadUserData()
  //     console.log("finished.userData", userData)
  //     // setAppPrivateKey(userData.appPrivateKey)
  //     // setAuthResponse(authResponse)
  //     const address = userData.profile.stxAddress
  //     const stx_balance = await fetchAccount(address)
  //     setState({ userData, stx_balance })
  //   },
  //   appDetails: {
  //     name: 'swapr',
  //     icon: `${document.location.origin}/swapr-square.png`,
  //   },
  // })


  // const authOptions: AuthOptions = {
  //   manifestPath: '/manifest.json',
  //   redirectTo: '/',
  //   userSession,
  //   finished: async ({ userSession, authResponse }) => {
  //     console.log("authOptions.finished", userSession, authResponse)
  //     // TODO(psq): this gets called 3 times
  //     const userData = userSession.loadUserData()
  //     console.log("finished.userData", userData)
  //     // setAppPrivateKey(userData.appPrivateKey)
  //     // setAuthResponse(authResponse)
  //     const address = userData.profile.stxAddress
  //     const stx_balance = await fetchAccount(address)
  //     setState({ userData, stx_balance })
  //   },
  //   authOrigin,
  //   appDetails: {
  //     name: 'swapr',
  //     icon: `${document.location.origin}/swapr-square.png`,
  //   },
  // }


  const authOptions: AuthOptions = {
    manifestPath: '/manifest.json',
    redirectTo: '/',
    userSession,
    finished: async ({ userSession, authResponse }) => {
      console.log("authOptions.finished", userSession, authResponse)
      const userData = userSession.loadUserData();
      console.log("finished.userData", userData)
      // setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse)

      const address = is_mainnet ? userData.profile.stxAddress.mainnet : userData.profile.stxAddress.mainnet
      const stx_balance = await fetchAccount(address)
      setState({ userData, stx_balance })

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


  // const { userData } = state
  // console.log("userData", userData)
  // console.log("app.state", state)
  return (
    <div className="App">
      <AppContext.Provider value={state}>
        <Connect authOptions={authOptions}>
          <RecoilRoot>
            <Router>
              {/*authResponse && <input type="hidden" id="auth-response" value={authResponse} />*/}
              {/*appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />*/}
              <Layout />
            </Router>
           </RecoilRoot>
        </Connect>
      </AppContext.Provider>
    </div>
  )
}
