import React, { useEffect, /*useContext,*/ Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { AppConfig, UserSession } from '@stacks/connect'
import { Connect } from '@stacks/connect-react'
import { CContainer, CFade } from '@coreui/react'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

// import './scss/style.scss'

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

const theme = createMuiTheme({
  typography: {
    fontWeight: 500,
    fontFamily: [
      'Dosis',
      'sans-serif',
    ].join(','),
  },
})


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const appConfig = new AppConfig([])
const userSession = new UserSession({ appConfig })

export default function App(props) {
  console.log("==== App")
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

  const SwaprContent = () => {
    console.log("== SwaprContent")
    return (
      <div className="sp-container">
        <div className="sp-graphic"></div>
        <Suspense fallback={loading}>
          {
            <Switch>
              {routes.map((route, idx) => {
                return route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => {
                      console.log("===== render", props)
                      props.signOut = signOut
                      return (
                      <CFade>
                        <route.component {...props}  />
                      </CFade>
                    )}} />
                )
              })}
            </Switch>
          }
        </Suspense>
      </div>
    )
  }

  const SwaprLayout = () => {
    console.log("=== SwaprLayout")
    return [
      <header key={1}>
        <nav className="nav-white nav-transparent full-width dark-overlay core-nav nav-core-sticky on-scroll">
          <div className="nav-container">
            <div className="nav-header right">
              <a href="/" className="brand">
                <img src="/images/brand/swapr.png" alt="" className="nom-logo"/>
                <img src="/images/brand/swapr.png" alt="" className="st-logo"/>
              </a>
            </div>
            <div className="wrap-core-nav-list right">
              <ul className="menu core-nav-list">
                  <li className=""><a href="">Pairs</a></li>
                  <li className=""><a href="">Tokens</a></li>
                  <li className="active"><a href="/app/swap/">Swap</a></li>
                  <li className=""><a href="/app/pool/">Pool</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>,
      <SwaprContent key={2}/>,
      <footer className="footer bg-black pt-25" key={3}>
          <div className="container">
              <div className="footer-copyright mt-20">
                  <div className="row">
                      <div className="col-lg-6 col-md-6">
                          <p className="mt-05"> ©Copyright <span id="copyright">2021</span> <a href="https://swapr.finance"> swapr </a> All Rights Reserved </p>
                      </div>
                      <div className="col-lg-6 col-md-6 text-left text-md-right">
                          <div className="social-icons color-hover mt-05">
                              <ul>
                                  <li className="social-discord"><a href="https://discord.gg/NYyH8uHHpe"><i className="fab fa-discord"></i></a></li>
                                  <li className="social-twitter"><a href="https://twitter.com/swapr_finance"><i className="fa fa-twitter"></i></a></li>
                                  <li className="social-rss"><a href="/feed.xml"><i className="fa fa-rss"></i> </a></li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </footer>,
    ]
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
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Connect authOptions={authOptions}>
          <Router>
            <SwaprLayout/>
          </Router>
        </Connect>
      </ThemeProvider>
    </div>
  )
}
