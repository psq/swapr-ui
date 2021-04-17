import BigNum from 'bn.js'
import React, { useCallback, useState } from 'react'
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useRecoilState } from 'recoil'

import { useConnect } from '@stacks/connect-react'
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  contractPrincipalCV,
  standardPrincipalCV,
  trueCV,
  PostConditionMode,
} from '@stacks/transactions'

// import withStyles from "@material-ui/core/styles/withStyles";
// import Button from "@material-ui/core/Button";

import {
  CButton,
  CInput,
  CLabel,

  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'

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

import {
  network,
} from './utils'

export default function Pair (props) {
  let { pairId } = useParams()
  console.log(">>> Pair", pairId)

  const [value_x, setValueX] = useState(0)
  const [value_y, setValueY] = useState(0)
  const [fee, setFee] = useState(0)

  const [accountAddress] = useRecoilState(accountAddressId)
  const [flip, setFlip] = useState(false)
  const [pair, setPair] = useRecoilState(pairFamily(pairId))
  const [pair_balances] = useRecoilState(pairBalanceFamily(pairId))
  const [token_x, setTokenX] = useRecoilState(tokenFamily(pair.token_x_principal))
  const [token_y, setTokenY] = useRecoilState(tokenFamily(pair.token_y_principal))
  const [token_swapr, setTokenySwape] = useRecoilState(tokenFamily(pair.swapr_token_principal))
  const [slippage, setSlippage] = useState(0.005)
  const [custom_slippage, setCustomSlippage] = useState('')
  const { doContractCall } = useConnect()


  useUpdatePairsRecoil()

  const exchange_rate = ((new BigNum(pair_balances.balance_y)).toNumber() / (new BigNum(pair_balances.balance_x)).toNumber()).toFixed(6) * 10**(token_x.decimals - token_y.decimals)

  // fee in basis points
  function curveXtoY(balance_x, balance_y, dx, fee) {
    console.log("curveXtoY", balance_x, balance_y, dx, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dy = (fee_adjustor * balance_y * dx) / (adjustor * balance_x + fee_adjustor * dx)
    const swapping_fee = dx * fee / 10_000
    return [dy, swapping_fee]
  }

  function curveYtoX(balance_x, balance_y, dy, fee) {
    console.log("curveYtoX", balance_x, balance_y, dy, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dx = (fee_adjustor * balance_x * dy) / (adjustor * balance_y + fee_adjustor * dy)
    const swapping_fee = dy * fee / 10_000
    return [dx, swapping_fee]
  }

  function curveXtoYReverse(balance_x, balance_y, dy, fee) {
    console.log("curveXtoYReverse", balance_x, balance_y, dy, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dx = (balance_x * dy * adjustor) / ((balance_y - dy) * fee_adjustor)
    const swapping_fee = (balance_x * dy * fee) / ((balance_y - dy) * fee_adjustor)
    return [dx, swapping_fee]
  }

  function curveYtoXReverse(balance_x, balance_y, dx, fee) {
    console.log("curveYtoXReverse", balance_x, balance_y, dx, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dy = (balance_y * dx * adjustor) / ((balance_x - dx) * fee_adjustor)
    const swapping_fee = (balance_y * dx * fee) / ((balance_x - dx) * fee_adjustor)
    return [dy, swapping_fee]
  }

  const flipTokens = useCallback(() => {
    setFlip(!flip)
    setValueX(0)
    setValueY(0)
    setFee(0)
  }, [flip])

  const onChangeSlippage = (data) => {
    setCustomSlippage(data.target.value)
    const new_slippage = parseFloat(data.target.value)
    if (!isNaN(new_slippage)) {
      setSlippage(new_slippage / 100)
    }
  }

  const onChangeSource = (data) => {
    console.log("onChangeSource", data.target.value, flip)
    setValueX(data.target.value)
    if (!flip) {
      const dx = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
      const [dy, swapping_fee] = curveXtoY((new BigNum(pair_balances.balance_x)).toNumber(), (new BigNum(pair_balances.balance_y)).toNumber(), dx * 10**token_x.decimals, 30)
      console.log("dy, swapping_fee", dy, swapping_fee)
      setValueY(dy / 10**token_y.decimals)
      setFee(swapping_fee / 10**token_x.decimals)
    } else {
      const dy = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
      const [dx, swapping_fee] = curveYtoX((new BigNum(pair_balances.balance_x)).toNumber(), (new BigNum(pair_balances.balance_y)).toNumber(), dy * 10**token_y.decimals, 30)
      console.log("dx, swapping_fee", dx, swapping_fee)
      setValueY(dx / 10**token_x.decimals)
      setFee(swapping_fee / 10**token_y.decimals)
    }
  }

  const onChangeDestination = useCallback((data) => {
    console.log("onChangeDestination", data.target)
    setValueY(data.target.value)
    if (!flip) {
      const dy = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
      const [dx, swapping_fee] = curveXtoYReverse((new BigNum(pair_balances.balance_x)).toNumber(), (new BigNum(pair_balances.balance_y)).toNumber(), dy * 10**token_y.decimals, 30)
      console.log("dy, swapping_fee", dy, swapping_fee)
      setValueX(dx / 10**token_x.decimals)
      setFee(swapping_fee / 10**token_x.decimals)
    } else {
      const dx = data.target.value.length > 0 ? parseFloat(data.target.value) :0
      const [dy, swapping_fee] = curveYtoXReverse((new BigNum(pair_balances.balance_x)).toNumber(), (new BigNum(pair_balances.balance_y)).toNumber(), dx * 10**token_x.decimals, 30)
      console.log("dx, swapping_fee", dx, swapping_fee)
      setValueX(dy / 10**token_y.decimals)
      setFee(swapping_fee / 10**token_y.decimals)
    }
  })

  const swapTokens = useCallback(async (token_x, token_y, dx, minimum_received, flip) => {
    console.log("swapTokens", token_x.name, token_y.name, dx * 10**token_x_swap.decimals, minimum_received * 10**token_x_swap, flip)

    const [token_x_addr, token_x_contract_name] = token_x.principal.split('.')
    const [token_y_addr, token_y_contract_name] = token_y.principal.split('.')

    const options = {
      network,
      contractAddress: process.env.REACT_APP_SWAPR_STX,
      contractName: process.env.REACT_APP_CONTRACT_NAME_SWAPR,
      functionName: flip ? 'swap-y-for-x' : 'swap-x-for-y',
      functionArgs: [
        contractPrincipalCV(token_x_addr, token_x_contract_name),
        contractPrincipalCV(token_y_addr, token_y_contract_name),
        uintCV(dx * 10**token_x_swap.decimals),
        uintCV(minimum_received * 10**token_x_swap.decimals),
      ],
      appDetails: {
        name: process.env.REACT_APP_NAME,
        icon: window.location.origin + '/swapr-square.png',
      },
      postConditionMode: PostConditionMode.Allow,  // TODO(psq): allow for now, there is no api to retrieve the token in sip-010!!!
      stxAddress: accountAddress,
      onFinish: data => {
        // TODO(psq): use a promise to return from await?
        console.log('Stacks Transaction:', data.stacksTransaction);
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
      },
    };

    const result = await doContractCall(options)
    console.log("swapTokens.result", result)
  })

  console.log("pair", pair)
  console.log("token_x", token_x)
  console.log("token_y", token_y)
  console.log("token_swapr", token_swapr)
  console.log("pair_balances", pair_balances.balance_x, pair_balances.balance_y)
  console.log("flip", flip)

  const token_x_swap = flip ? token_y : token_x
  const token_y_swap = flip ? token_x : token_y
  const balance_x_swap = flip ? pair_balances.balance_y : pair_balances.balance_x
  const balance_y_swap = flip ? pair_balances.balance_x : pair_balances.balance_y

  // TODO(psq): add max slipage .5% 1%, custom, show `get at least ...`
  // TODO(psq): calculate dest value, or source if input (constrain based on exchange plus known slippage)
  // TODO(psq): broadcast transaction

  if (!pair || !token_x || !token_y || !token_x.metadata || !token_y.metadata) {
    return "loading..."
  }

  console.log("====>", parseFloat(value_y), parseFloat(value_x), exchange_rate)
  const price_impact = (1 - (parseFloat(value_y) / (parseFloat(value_x) * 0.997) / (flip ? 1/exchange_rate : exchange_rate))) * 100
  const minimum_received = parseFloat(value_y) * (1 - slippage)

  return (
    <div className="Pair">
      <h1><img style={{width: "60px", height: "50px", paddingRight: "10px", zIndex: 1000}} src={token_x.metadata.vector} alt="Token icon"/><img style={{width: "60px", height: "50px", paddingRight: "10px", marginLeft: "-30px", zIndex: 1100}} src={token_y.metadata.vector} alt="Token icon"/>{pair.name} Pair</h1>
      <p>X Token: <Link to={`/token/${token_x.principal}`}>{token_x.name} ({token_x.symbol})</Link></p>
      <p>Y Token: <Link to={`/token/${token_y.principal}`}>{token_y.name} ({token_y.symbol})</Link></p>
      <p>swapr Token: <Link to={`/token/${token_swapr.principal}`}>{token_swapr.name} ({token_swapr.symbol})</Link></p>

      <p>{token_x.name} balance: {(new BigNum(pair_balances.balance_x)).toNumber() / 10**token_x.decimals} </p>
      <p>{token_y.name} balance: {(new BigNum(pair_balances.balance_y)).toNumber() / 10**token_y.decimals} </p>
      <p>Exchange rate: {exchange_rate}</p>
      <p>Shares: {(new BigNum(pair.pair_shares_total)).toNumber() / 10**token_swapr.decimals}</p>

      <div>
        <CRow>
          <CCol xs="12" sm="12" md="12">
            <CCard color="">
              <CCardHeader>
                Swap
              </CCardHeader>
              <CCardBody>
                <p>swap {token_x_swap.name} ({token_x_swap.symbol}) to {token_y_swap.name} ({token_y_swap.symbol})</p>
                <p>Exchange rate: {((new BigNum(balance_y_swap)).toNumber() / (new BigNum(balance_x_swap)).toNumber()).toFixed(6) * 10**(token_x_swap.decimals - token_y_swap.decimals) }</p>
                <p>{token_x_swap.name} balance: {(new BigNum(balance_x_swap)).toNumber() / 10**token_x_swap.decimals} </p>
                <p>{token_y_swap.name} balance: {(new BigNum(balance_y_swap)).toNumber() / 10**token_y_swap.decimals} </p>

                <p>{`flip: ${flip}`}</p>
                <CLabel>{`${token_x_swap.name} Amount`}</CLabel>
                <CInput
                  id={`value_x`}
                  onChange={e => onChangeSource(e)}
                  value={value_x}
                  placeholder="0"
                />
                <CLabel>{`${token_y_swap.name} Amount`}</CLabel>
                <CInput
                  id={`value_y`}
                  value={value_y}
                  onChange={e => onChangeDestination(e)}
                  placeholder="0"
                />
                <CLabel>{`Swapping fee: ${fee} ${token_x_swap.name}`}</CLabel>

                <div className="form-inline">
                  <CLabel>{`Max slippage:`}</CLabel>
                  <CButton color="primary" className={ `my-2 my-sm-2 btn-sm ml-2 ${slippage === 0.001 ? 'btn-primary' : 'btn-secondary'}` } type="submit" onClick={() => { setSlippage(0.001); setCustomSlippage('') }} >
                    0.1%
                  </CButton>
                  <CButton color="primary" className={`my-2 my-sm-2 btn-sm ml-2 ${slippage === 0.005 ? 'btn-primary' : 'btn-secondary'}`}  type="submit" onClick={() => { setSlippage(0.005); setCustomSlippage('') }} >
                    0.5%
                  </CButton>
                  <CButton color="primary" className={`my-2 my-sm-2 btn-sm ml-2 ${slippage === 0.01 ? 'btn-primary' : 'btn-secondary'}`}  type="submit" onClick={() => { setSlippage(0.01); setCustomSlippage('') }} >
                    1.0%
                  </CButton>
                  <CInput
                    className="form-control-sm mb-1 mr-sm-1 ml-2 mt-2"
                    id={`custom-slippage`}
                    value={custom_slippage}
                    onChange={e => onChangeSlippage(e)}
                    placeholder=""
                  />
                  => {slippage * 100}% Minimum Received: {minimum_received}
                </div>
                <p>Price Impact: {isNaN(price_impact) ? null : (price_impact < 0.01 ? '< 0.01%' : `${price_impact.toFixed(2)}%`)}</p>
                <div>
                  <CButton color="primary" className="my-2 my-sm-2 mr-3" type="submit" onClick={() => { swapTokens(token_x, token_y, value_x, minimum_received, flip) }} >
                    Swap
                  </CButton>
                  <CButton color="secondary" className="my-2 my-sm-2" type="submit" onClick={() => { flipTokens() }} >
                    Flip
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol xs="12" sm="12" md="12">
            <CCard color="">
              <CCardHeader>
                Add Liquidity
              </CCardHeader>
              <CCardBody>
                Body
            </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol xs="12" sm="12" md="12">
            <CCard color="">
              <CCardHeader>
                Remove Liquidity
              </CCardHeader>
              <CCardBody>
                Body
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/*
        get token pair list from contract
        pick pair
        input amount token1 or token2
        calculate amount for other token (using current exchange rate)
        fund

        or

        create new pair
        select token1 from list (add token by entering contract first?)
        select token2 from list (add token by entering contract first?)
        input amount token1
        input amount token2
        fund
      */}

    </div>
  )
}