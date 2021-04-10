import React, { /*useContext, useEffect, useState*/ } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"

// import { AppContext } from './AppContext'

import {
  checkTokenDifferences,
  useUpdatePairs,
} from './swapr'

export default function Tokens (props) {
  // const context = useContext(AppContext)

  const dispatch = useDispatch()
  const { tokens } = useSelector(state => state.tokens, (item, previous) => {
    return checkTokenDifferences(item, previous)
  })
  useUpdatePairs(dispatch)
  console.log("Tokens", tokens)
  const token_array = Object.keys(tokens).map(k => tokens[k])
  const token_array_sorted = token_array.sort((a, b) => a.name.localeCompare(b.name))
  return (
    <div className="Tokens">
      <h1>Tokens</h1>
        Tokens: {tokens.length}
        <ul>
          {
            token_array_sorted.map(token => {
              return <li key={token.principal}>
                <Link to={`/token/${token.principal}`}>{token.name} ({token.symbol})</Link>
              </li>
            })
          }
        </ul>
      { /*
          get token pair list from contract
          pick pair
          pick source/destination (with flip)
          input amount of source or dest
          calculate amount of the other
          swap
        */
      }
    </div>
  )
}