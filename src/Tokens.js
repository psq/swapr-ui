import React, { /*useContext, useEffect, useState*/ } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
    <Link to={`/token/${id}`}><img style={{width: "45px", height: "35px", paddingRight: "10px"}} src={token.metadata.vector} alt="Token icon"/>{token.name}</Link>
  </li>
}

// import { AppContext } from './AppContext'


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
            tokens.map(token_id => {
              return <TokenInfo key={token_id} id={token_id}/>
            })
          }
        </ul>
    </div>
  )

  // const dispatch = useDispatch()
  // const { tokens } = useSelector(state => state.tokens, (item, previous) => {
  //   return checkTokenDifferences(item, previous)
  // })
  // // useUpdatePairs(dispatch)
  // console.log("Tokens", tokens)
  // const token_array = Object.keys(tokens).map(k => tokens[k])
  // const token_array_sorted = token_array.sort((a, b) => a.name.localeCompare(b.name))
  // return (
  //   <div className="Tokens">
  //     <h1>Tokens</h1>
  //       Tokens: {tokens.length}
  //       <ul>
  //         {
  //           token_array_sorted.map(token => {
  //             return <li key={token.principal}>
  //               <Link to={`/token/${token.principal}`}>{token.name} ({token.symbol})</Link>
  //             </li>
  //           })
  //         }
  //       </ul>
  //     { /*
  //         get token pair list from contract
  //         pick pair
  //         pick source/destination (with flip)
  //         input amount of source or dest
  //         calculate amount of the other
  //         swap
  //       */
  //     }
  //   </div>
  // )
}