import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from './AppContext'
import { useSelector, useDispatch } from 'react-redux'
import {
  addressToString,
} from '@blockstack/stacks-transactions'

import {
  CContainer,
  CRow,
  CCol,
  // CCard,
  // CCardHeader,
  // CCardBody,
  CButton,
  CWidgetDropdown,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import {
  getStacksAccount,
  useUpdateSTX,
  useUpdateWRAPR,
  WRAPR_CONTRACT,
} from './StacksAccount'

import {
  wrap,
  unwrap,
} from './clients/wrapr-client'

import {
  BNWithCommas,
} from './utils'

export default function Landing (props) {
  const context = useContext(AppContext)
  const [state, setState] = useState({ amount: '', wrap: true})
  const [action, setAction] = useState({type: '', amount: 0})
  const { address } = getStacksAccount(context.userData.appPrivateKey)
  const dispatch = useDispatch()
  const stx_balance = useSelector(state => state.stx.stx_balance)
  const wrapr_balance = useSelector(state => state.wrapr.wrapr_balance)
  const sender = {
    stacksAddress: addressToString(address),
    secretKey: context.userData.appPrivateKey,
  }

  // console.log("state", state)
  // console.log("action", action)
  useUpdateSTX(sender, dispatch, stx_balance)
  useUpdateWRAPR(sender, dispatch, wrapr_balance)
  useEffect(() => {
    let cleaned_up = false
    const wait = async () => {
      await new Promise(accept => {setTimeout(() => {accept()}, 5000)})

      // TODO(psq): convert to micro (* 1,000,000)
      const amount = Math.round(parseFloat(action.amount) * 1000000)
      if (action.type === 'wrap') {
        console.log("wrap", amount)
        try {
          const result = await wrap(amount, sender, WRAPR_CONTRACT)
          console.log("result", result)
        } catch (e) {
          console.log(e)
        }
      } else if (action.type === 'unwrap') {
        console.log("wrap", amount)
        try {
          const result = await unwrap(amount, sender, WRAPR_CONTRACT)
          console.log("result", result)
        } catch (e) {
          console.log(e)
        }
      }
      if (!cleaned_up) {
        // avoid nasty: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
        setAction({type: '', amount: 0})
      }
    }
    if (action.type !== '') {
      wait()
    }
    return () => {
      cleaned_up = true
    }
  }, [action, sender])

  const handleInputChange = (event) => {
    const value = event.target.value
    const name = event.target.name;
    setState({...state, [name]: value })
  }

  const toggle = () => {
    // console.log("toggle")
    setState({...state, wrap: !state.wrap })
  }

  const doAction = () => {
    // console.log("click", state.wrap ? 'wrap' : 'unwrap', state.amount)
    if (state.wrap) {
      setAction({type: 'wrap', amount: state.amount})
    } else {
      setAction({type: 'unwrap', amount: state.amount})
    }
    setState({...state, amount: ''})
  }

  const CSTX = () => (
    <CWidgetDropdown
      color="gradient-primary"
      header={stx_balance !== null ? `${BNWithCommas(stx_balance)} STX${state.wrap ? ' available' : ''}` : 'n/a'}
      text={state.wrap ? 'from' : 'to'}
      footerSlot={
        <div
          className={'text-center'}
          style={{ height: '40px' }}
        >
        </div>
      }
    >
    </CWidgetDropdown>
  )
  const CWRAPR = () => (
    <CWidgetDropdown
      color="gradient-info"
      header={wrapr_balance !== null ? `${BNWithCommas(wrapr_balance)} WRAPR${state.wrap ? '' : ' available'}` : 'n/a'}
      text={state.wrap ? 'to' : 'from'}
      footerSlot={
        <div
          className={'text-center'}
          style={{ height: '40px' }}
        >
        </div>
      }
    >
    </CWidgetDropdown>
  )
  const LeftWidget = state.wrap ? CSTX : CWRAPR
  const RightWidget = state.wrap ? CWRAPR : CSTX

  return (
    <CContainer>
      <CRow>
        <CCol sm="5" lg="5">
          <LeftWidget/>
        </CCol>
        <CCol sm="2" lg="2">
          <CIcon name="cil-swap-horizontal" className="mx-auto d-block" size={'6xl'} onClick={toggle}/>
        </CCol>
        <CCol sm="5" lg="5">
          <RightWidget/>
        </CCol>
      </CRow>
      <CRow className="offset-md-4" sm="6" lg="6">
        <CForm className="col-lg-6 col-sm-6" action="" method="post">
          <CFormGroup className="">
            <CLabel htmlFor="nf-amount">{`Amount to ${state.wrap ? 'wrap' : 'unwrap'}`}</CLabel>
            <CInput
              className=""
              type="amount"
              id="amount"
              name="amount"
              value={state.amount}
              placeholder="Enter amount.."
              autoComplete="amount"
              onChange={handleInputChange}
            />
            <CFormText className="help-block">Please enter your amount</CFormText>
          </CFormGroup>
          <CRow>
            <CCol>
              <CButton disabled = {state.amount === ''} color="primary" className="px-4" onClick={doAction}>
                {state.wrap ? 'Wrap' : 'Unwrap'}
              </CButton>
              <div
                role="status"
                className={`${action.type === '' ? 'd-none ' : ''}spinner-border spinner-border-sm text-info align-text-top ml-2`}
              />
            </CCol>
          </CRow>
        </CForm>
      </CRow>
    </CContainer>
  )
}