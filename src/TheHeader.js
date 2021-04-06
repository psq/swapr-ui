import React, { useContext } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CHeaderNav,
  CButton,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import { useConnect } from '@stacks/connect-react'

import { AppContext } from './AppContext'

const TheHeader = ({ signOut }) => {
  // const dispatch = useDispatch()
  // const sidebar_show = useSelector(state => state.sidebar.sidebar_show)
  const context = useContext(AppContext)
  const { doOpenAuth } = useConnect()

  console.log("context.userData", context.userData)

  // const toggleSidebar = () => {
  //   const val = [true, 'responsive'].includes(sidebar_show) ? false : 'responsive'
  //   dispatch({type: 'set_sidebar', sidebar_show: val})
  // }

  // const toggleSidebarMobile = () => {
  //   const val = [false, 'responsive'].includes(sidebar_show) ? true : 'responsive'
  //   dispatch({type: 'set_sidebar', sidebar_show: val})
  // }

  return (
    <CHeader>
      {context.userData ? (
        <CHeaderNav className="px-0 col-6 offset-md-6" >
          <div className="col-9 text-right">{context.userData.username || context.userData.identityAddress}</div>
          <CButton color="link" className="my-2 my-sm-2" type="submit" onClick={() => { signOut() }} >Sign off</CButton>
        </CHeaderNav>
      ) : (
        <CHeaderNav className="px-0 col-2 offset-md-10" >
          <CButton color="primary" className="my-2 my-sm-2" type="submit" onClick={() => {doOpenAuth(/*false, {authOrigin: 'https://app.blockstack.org' 'http://localhost:5555' TODO(url) }*/) }} >Register</CButton>
          <CButton color="link" className="my-2 my-sm-2" type="submit" onClick={() => {doOpenAuth(/*true, {authOrigin: 'https://app.blockstack.org' 'http://localhost:5555' TODO(url) }*/) }}>Sign in</CButton>
        </CHeaderNav>
      )}
    </CHeader>
  )
}

export default TheHeader
