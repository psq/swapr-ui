import BigNum from 'bn.js'
import React /*, { useContext }*/ from 'react'
import { Link } from "react-router-dom"
import { useRecoilState } from 'recoil'

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
  useUpdatePairsRecoil,
} from './swapr'

import {
  accountAddressId,
  pairList,
  tokenList,
  tokenFamily,
  pairFamily,
  tokenBalanceFamily,
  pairBalanceFamily,
  pairQuoteFamily,
} from './atoms'

// import {
//   useUpdateSTX,
// } from './StacksAccount'

import {
  BNWithCommas,
  is_mainnet,
} from './utils'

// import { AppContext } from './AppContext'

function TokenInfo(props) {
  const id = props.id
  const [token] = useRecoilState(tokenFamily(id))
  const [token_balance] = useRecoilState(tokenBalanceFamily(id))
  console.log(">>> TokenInfo", id, token, token_balance)
  if (!token || !token.metadata || token_balance === null) return "loading..."
  return <li style={{listStyleType: 'none'}}>
    <Link to={`/token/${id}`}>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px"}} src={token.metadata.vector} alt="Token icon"/>
      {token.name}:&nbsp;
      {(new BigNum(token_balance)).toNumber() / 10**token.decimals}
    </Link>
  </li>
}

function PairInfo(props) {
  const id = props.id
  const [pair] = useRecoilState(pairFamily(id))
  const [pair_balance] = useRecoilState(pairBalanceFamily(id))

  const [token_x] = useRecoilState(tokenFamily(pair.token_x_principal))
  const [token_y] = useRecoilState(tokenFamily(pair.token_y_principal))
  const [token_swapr] = useRecoilState(tokenFamily(pair.swapr_token_principal))
  const [token_swapr_balance] = useRecoilState(tokenBalanceFamily(pair.swapr_token_principal))

  console.log(">>> PairInfo", id, pair, pair_balance, token_x, token_y)
  if (!pair || /*!pair_balance ||*/ !token_x || !token_y || !token_x.metadata || !token_y.metadata) return "loading..."
  return <li style={{listStyleType: 'none'}}>
    <Link to={`/pair/${id}`}>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px", zIndex: 1000}} src={token_x.metadata.vector} alt="Token icon"/>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px", marginLeft: "-22px", zIndex: 1100}} src={token_y.metadata.vector} alt="Token icon"/>
      {pair.name}:&nbsp;
      {(new BigNum(token_swapr_balance)).toNumber() / 10**token_swapr.decimals}&nbsp;-&nbsp;
      {((new BigNum(token_swapr_balance)).toNumber() / (new BigNum(pair.pair_shares_total)).toNumber() * 100).toFixed(2)}%
    </Link>
  </li>
}


export default function Main(props) {
  // const context = useContext(AppContext)
  // const address = is_mainnet ? context.userData.profile.stxAddress.mainnet : context.userData.profile.stxAddress.testnet
  const [accountAddress, setAccountAddress] = useRecoilState(accountAddressId)

  console.log("accountAddress", accountAddress)

  const stx_balance = 0
  // const dispatch = useDispatch()
  // const stx_balance = useSelector(state => state.stx.stx_balance)
  // const wrapr_balance = useSelector(state => state.wrapr.wrapr_balance)

  // const sender = {
  //   stacksAddress: address,
  // }
  // useUpdateSTX(sender, dispatch, stx_balance)
  // useUpdateWRAPR(sender, dispatch, wrapr_balance)

  const [tokens] = useRecoilState(tokenList)
  const [pairs] = useRecoilState(pairList)
  const sorted_pairs = pairs.slice().sort((a, b) => a.name.localeCompare(b.name))
  useUpdatePairsRecoil()

  return (
    <div>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard color="">
            <CCardHeader>
              Wallet
            </CCardHeader>
            <CCardBody>
              Your address is {accountAddress}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard color="">
            <CCardHeader>
              Token Balances
            </CCardHeader>
            <CCardBody>
              <ul style={{paddingInlineStart: '10px'}}>
              {
                tokens.map(token => {
                  return <TokenInfo id={token.id} key={token.id}/>
                })
              }
              </ul>
              {
                // Your balance is {stx_balance !== null ? `${BNWithCommas(stx_balance)} STX` : `not available`
              }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard color="">
            <CCardHeader>
              Pair Balances
            </CCardHeader>
            <CCardBody>
              <ul style={{paddingInlineStart: '10px'}}>
              {
                sorted_pairs.map(paid => {
                  return <PairInfo id={paid.id} key={paid.id}/>
                })
              }
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      {/*
        display list of current liquidity pools for user with amounts
      */}

      {/*
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
      */}
    </div>
  )
}
