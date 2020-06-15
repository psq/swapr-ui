import React, { useContext } from 'react'
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
  getStacksAccount,
  useUpdateSTX,
  useUpdateWRAPR,
} from './StacksAccount'

import {
  BNWithCommas,
} from './utils'

import { AppContext } from './AppContext'

export default function Main(props) {
  const context = useContext(AppContext)
  const { address } = getStacksAccount(context.userData.appPrivateKey)
  const dispatch = useDispatch()
  const stx_balance = useSelector(state => state.stx.stx_balance)
  const wrapr_balance = useSelector(state => state.wrapr.wrapr_balance)

  const sender = {
    stacksAddress: addressToString(address),
    secretKey: context.userData.appPrivateKey,
  }
  useUpdateSTX(sender, dispatch, stx_balance)
  useUpdateWRAPR(sender, dispatch, wrapr_balance)

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
              Your balance is {stx_balance !== null ? `${BNWithCommas(stx_balance)} STX` : `not available`}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard color="">
            <CCardHeader>
              WRAPR balance
            </CCardHeader>
            <CCardBody>
              Your balance is {wrapr_balance !== null ? `${BNWithCommas(wrapr_balance)} WRAPR` : `not available`}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </div>
  )
}
