import React, { /*useContext, useEffect, useState*/ } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"

// import { AppContext } from './AppContext'

import {
  checkPairDifferences,
  useUpdatePairs,
} from './swapr'

export default function Pairs (props) {
  // const context = useContext(AppContext)

  const dispatch = useDispatch()
  const { pairs } = useSelector(state => state.pairs, (item, previous) => {
    return checkPairDifferences(item, previous)
  })
  useUpdatePairs(dispatch)
  console.log("Exchange", pairs)

  return (
    <div className="Pairs">
      <h1>Pairs</h1>
        Pairs: {pairs.length}
        <ul>
          {
            pairs.map(pair => {
              return <li key={pair.id}>
                <Link to={`/pair/${pair.token_x_principal}$${pair.token_y_principal}`}>{pair.name}</Link>
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