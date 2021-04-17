import React from 'react'
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

function TokenInfo(props) {
  const id = props.id
  const [token, setToken] = useRecoilState(tokenFamily(id))
  console.log(">>> TokenInfo", id, token)
  if (!token || !token.metadata) return "loading..."
  return <li style={{listStyleType: 'none'}} key={token.id}>
    <Link to={`/token/${id}`}>
    <img style={{width: "50px", height: "40px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px"}} src={token.metadata.vector} alt="Token icon"/>{token.name}</Link>
  </li>
}

export default function Tokens (props) {
  const [tokens, setTokens] = useRecoilState(tokenList)
  useUpdatePairsRecoil()
  console.log(">>> Tokens", tokens)

  if (!tokens) return "loading..."

  return (
    <div className="Pairs">
      <h1>Tokens</h1>
        Count: {tokens.length}
        <ul>
          {
            tokens.map(token => {
              return <TokenInfo key={token.id} id={token.id}/>
            })
          }
        </ul>
    </div>
  )
}