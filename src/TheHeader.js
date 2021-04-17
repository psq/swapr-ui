import React /*, { useContext }*/ from 'react'
import { useRecoilState } from 'recoil'
import {
  CHeader,
  CHeaderNav,
  CButton,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import { useConnect } from '@stacks/connect-react'

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

const TheHeader = ({ signOut }) => {
  const { doOpenAuth } = useConnect()
  const [userData] = useRecoilState(userDataId)

  console.log("TheHeader.userData", userData)

  return (
    <CHeader>
      {userData ? (
        <CHeaderNav className="px-0 col-6 offset-md-6" >
          <div className="col-9 text-right">{userData.username || userData.identityAddress}</div>
          <CButton color="link" className="my-2 my-sm-2" type="submit" onClick={() => { signOut() }}>Sign off</CButton>
        </CHeaderNav>
      ) : (
        <CHeaderNav className="px-0 col-2 offset-md-10" >
          <CButton color="primary" className="my-2 my-sm-2" type="submit" onClick={() => {doOpenAuth(/*false, {authOrigin: 'https://app.blockstack.org' 'http://localhost:5555' TODO(url) }*/) }} >Connect to Stacks Wallet</CButton>
        </CHeaderNav>
      )}
    </CHeader>
  )
}

export default TheHeader
