import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

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

import {
  fetchAccount,
  getSTX,
} from './StacksAccount'

import {
  is_mainnet,
} from './utils'

// TODO(psq): need faucets for test tokens, which needs to be added to contracts
// maybe ok on testnet for those fake ones, which have no value
// don't even need a limit?

export default function Faucet (props) {
  const [state, setState] = useState({ stx_status: null, refresh: false, stx_current: null})
  const [action, setAction] = useState('')
  const [userData] = useRecoilState(userDataId)
  const { refresh, stx_status } = state

  const address = is_mainnet ? userData.profile.stxAddress.mainnet : userData.profile.stxAddress.testnet

  const setThenResetStatus = (state, reset_state) => {
    setState(state)
    setTimeout(() => {
      // console.log("resetting state", reset_state)
      setState(state => ({...state, ...reset_state}))
    }, 5000)
  }

  // useEffect(() => {
  //   if (refresh) {
  //     // console.log("useEffect start-faucet")
  //     const id = setInterval(async () => {
  //       // console.log("refresh STX-faucet", addressToString(address))
  //       const stx_balance = await fetchAccount(address)
  //       // console.log("stx_balance", stx_balance)
  //       if (stx_balance !== stx_current) {
  //         // console.log("updating store", stx_balance, stx_current)
  //         dispatch({type: 'set_stx', stx_balance})
  //         setState(state => ({...state, refresh: false, stx_current: null}))
  //       }
  //     }, 2500)
  //     return () => {/*console.log("useEffect end-faucet");*/ clearInterval(id)}
  //   }
  // }, [address, dispatch, refresh, stx_current])

  // TODO(psq): replace with useEffect that can be properly cleaned up
  // const claimSTXTestTokens = async (address) => {
  //   setAction('claim')
  //   try {
  //     const result = await getSTX(address)
  //     if (result.status === 200) {
  //       setThenResetStatus({ stx_status: 'Tokens will arrive soon.', refresh: true, stx_current}, { stx_status: null})
  //     } else if (result.status === 429) {
  //       setThenResetStatus({ stx_status: 'Claiming tokens failed, too many requests.'}, { stx_status: null})
  //     } else {
  //       setThenResetStatus({ stx_status: `Claiming tokens failed (${result.status})`}, { stx_status: null})
  //     }
  //   } catch(e) {
  //     setThenResetStatus({ stx_status: 'Claiming tokens failed.'}, { stx_status: null})
  //     console.log(e)
  //   }
  //   setAction('')
  // }

  return (
    <div className="Faucets">
      <CContainer>
        <CRow>
          <CCol lg="3" className="py-3 row align-items-center">
            <div className="">STX Faucet</div>
          </CCol>
          <CCol md="3" className="py-3">
            <CButton color="primary" className="my-2 my-sm-2" type="submit" onClick={() => { /*claimSTXTestTokens(address)*/ }} >
              Claim
            </CButton>
            <div
              role="status"
              className={`${action === '' ? 'd-none ' : ''}spinner-border spinner-border-sm text-info align-text-top ml-2`}
            />
          </CCol>
          <CCol md="6" className="py-3 row align-items-center">
            { stx_status }
          </CCol>
        </CRow>
      </CContainer>

    </div>
  )
}