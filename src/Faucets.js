import React, { useContext, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

import { addressToString } from '@blockstack/stacks-transactions'

import { AppContext } from './AppContext'
import {
  fetchAccount,
  getStacksAccount,
  getSTX,
} from './StacksAccount'

export default function Faucet (props) {
  const context = useContext(AppContext)
  const [state, setState] = React.useState({ stx_status: null, refresh: false, stx_current: null})
  const dispatch = useDispatch()
  const stx_current = useSelector(state => state.stx.stx_balance)
  const stx_spinner = useRef(null)
  const { refresh, stx_status } = state

  const { address } = getStacksAccount(context.userData.appPrivateKey)

  const setThenResetStatus = (state, reset_state) => {
    setState(state)
    setTimeout(() => {
      // console.log("resetting state", reset_state)
      setState(state => ({...state, ...reset_state}))
    }, 5000)
  }

  useEffect(() => {
    if (refresh) {
      // console.log("useEffect start-faucet")
      const id = setInterval(async () => {
        // console.log("refresh STX-faucet", addressToString(address))
        const stx_balance = await fetchAccount(addressToString(address))
        // console.log("stx_balance", stx_balance)
        if (stx_balance !== stx_current) {
          console.log("updating store", stx_balance, stx_current)
          dispatch({type: 'set_stx', stx_balance})
          setState(state => ({...state, refresh: false, stx_current: null}))
        }
      }, 2500)
      return () => {/*console.log("useEffect end-faucet");*/ clearInterval(id)}
    }
  }, [address, dispatch, refresh, stx_current])

  const claimSTXTestTokens = async (address) => {
    stx_spinner.current.classList.remove('d-none')
    // const { refreshSTX } = props.context_updaters

    try {
      const result = await getSTX(address)
      if (result.status === 200) {
        setThenResetStatus({ stx_status: 'Tokens will arrive soon.', refresh: true, stx_current}, { stx_status: null})
      } else if (result.status === 429) {
        setThenResetStatus({ stx_status: 'Claiming tokens failed, too many requests.'}, { stx_status: null})
      } else {
        setThenResetStatus({ stx_status: `Claiming tokens failed (${result.status})`}, { stx_status: null})
      }
      console.log("claim.result", result)
      stx_spinner.current.classList.add('d-none')
    } catch(e) {
      setThenResetStatus({ stx_status: 'Claiming tokens failed.'}, { stx_status: null})
      console.log(e)
      stx_spinner.current.classList.add('d-none')
    }
  }

  return (
    <div className="Faucets">
      <CContainer>
        <CRow>
          <CCol lg="3" className="py-3 row align-items-center">
            <div className="">STX Faucet</div>
          </CCol>
          <CCol md="3" className="py-3">
            <CButton color="primary" className="my-2 my-sm-2" type="submit" onClick={() => { claimSTXTestTokens(addressToString(address)) }} >
              <div
                ref={stx_spinner}
                role="status"
                className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
              />
              Claim
            </CButton>
          </CCol>
          <CCol md="6" className="py-3 row align-items-center">
            { stx_status }
          </CCol>
        </CRow>
      </CContainer>

    </div>
  )
}