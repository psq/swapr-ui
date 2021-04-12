import BigNum from 'bn.js'
import React, { /* useContext, */ } from 'react'
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useRecoilState } from 'recoil'

import {
  useUpdatePairsRecoil,
} from './swapr'

import {
  pairList,
  tokenList,
  tokenFamily,
  pairFamily,
  tokenBalanceFamily,
  pairBalanceFamily,
  pairQuoteFamily,
} from './atoms'

export default function Pair (props) {
  // const context = useContext(AppContext)
  let { pairId } = useParams()
  console.log(">>> Pair", pairId)

  const [pair, setPair] = useRecoilState(pairFamily(pairId))
  const [pair_balances] = useRecoilState(pairBalanceFamily(pairId))
  const [token_x, setTokenX] = useRecoilState(tokenFamily(pair.token_x_principal))
  const [token_y, setTokenY] = useRecoilState(tokenFamily(pair.token_y_principal))
  const [token_swapr, setTokenySwape] = useRecoilState(tokenFamily(pair.swapr_token_principal))
  useUpdatePairsRecoil()

  console.log("pair", pair)
  console.log("token_x", token_x)
  console.log("token_y", token_y)
  console.log("token_swapr", token_swapr)

  if (!pair || !token_x || !token_y || !token_x.metadata || !token_y.metadata) {
    return "loading..."
  }

  return (
    <div className="Pair">
      <h1><img style={{width: "60px", height: "50px", paddingRight: "10px", zIndex: 1000}} src={token_x.metadata.vector} alt="Token icon"/><img style={{width: "60px", height: "50px", paddingRight: "10px", marginLeft: "-30px", zIndex: 1100}} src={token_y.metadata.vector} alt="Token icon"/>{pair.name} Pair</h1>
      <p>X Token: <Link to={`/token/${token_x.principal}`}>{token_x.name} ({token_x.symbol})</Link></p>
      <p>Y Token: <Link to={`/token/${token_y.principal}`}>{token_y.name} ({token_y.symbol})</Link></p>
      <p>swapr Token: <Link to={`/token/${token_swapr.principal}`}>{token_swapr.name} ({token_swapr.symbol})</Link></p>

      <p>{token_x.name} balance: {(new BigNum(pair_balances.balance_x)).toNumber() / 10**token_x.decimals} </p>
      <p>{token_y.name} balance: {(new BigNum(pair_balances.balance_y)).toNumber() / 10**token_x.decimals} </p>
      <p>Exchange rate: {((new BigNum(pair_balances.balance_x)).toNumber() / (new BigNum(pair_balances.balance_y)).toNumber()).toFixed(6) }</p>
      <p>Shares: {(new BigNum(pair.pair_shares_total)).toNumber() / 10**token_swapr.decimals}</p>

      <div>
        <h4>Swap here</h4>
        <h4>Add Liquidity here</h4>
        <h4>Remove Liquidity here</h4>
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