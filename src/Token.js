import React from 'react'
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
    </div>
  )
}