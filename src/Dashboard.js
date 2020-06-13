import React, { useContext, useEffect } from 'react'
import { addressToString } from '@blockstack/stacks-transactions'
import { useSelector, useDispatch } from 'react-redux'

import {
  // CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  // CLink,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import {
  fetchAccount,
  getStacksAccount,
} from './StacksAccount'

import {
  numberWithCommas,
} from './utils'

import { AppContext } from './AppContext'

export default function Main(props) {
  const context = useContext(AppContext)
  // console.log("dashboard.context", context)
  const { address } = getStacksAccount(context.userData.appPrivateKey)

  const dispatch = useDispatch()
  const stx_balance = useSelector(state => state.stx.stx_balance)
  // console.log("dashboard.stx_balance", stx_balance)

  useEffect(() => {
    // console.log("useEffect start")
    const id = setInterval(async () => {
      // console.log("refresh STX Dash", addressToString(address))
      const stx_balance = await fetchAccount(addressToString(address))
      console.log("stx_balance", stx_balance)
      dispatch({type: 'set_stx', stx_balance})
    }, 2500)
    return () => {/*console.log("useEffect end");*/ clearInterval(id)}
  }, [address, dispatch])

  return (
    <div>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard color="">
            <CCardHeader>
              Wallet
            </CCardHeader>
            <CCardBody>
              Your address is {addressToString(address)}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard color="">
            <CCardHeader>
              STX balance
            </CCardHeader>
            <CCardBody>
              Your balance is {stx_balance !== null ? `${numberWithCommas(stx_balance)} uSTX` : `not available`}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </div>
  )
}
