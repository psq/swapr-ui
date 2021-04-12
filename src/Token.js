import React, { /* useContext, */ } from 'react'
import { Link, useParams } from "react-router-dom"
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

export default function Token(props) {
  // const context = useContext(AppContext)
  let { tokenId } = useParams()
  const [token, setToken] = useRecoilState(tokenFamily(tokenId))
  useUpdatePairsRecoil()
  console.log(">>> Token", tokenId, token)

  if (!token || !token.metadata) return "loading..."

  return (
    <div className="Token">
      <h1><img style={{width: "60px", height: "50px", paddingRight: "10px"}} src={token.metadata.vector} alt="Token icon"/>{token.name} Token</h1>
      <p>Description: {token.metadata.description}</p>
      <p>Symbol: {token.symbol}</p>
      <p>Decimals: {token.decimals}</p>
      <p>Supply: {token.total_supply / 10**token.decimals}</p>
      <p>Metadata URI: <a href={token.uri}>{token.uri.length !== 0 ? token.uri : 'N/A'}</a></p>

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