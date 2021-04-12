import React, { /*useContext, useEffect, useState*/ } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import { useRecoilState } from 'recoil'

import {
  // checkPairDifferences,
  // useUpdatePairs,
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


function PairInfo(props) {
  const id = props.id
  const [pair, setPair] = useRecoilState(pairFamily(id))
  console.log(">>> PairInfo", id, pair)
  return <li key={pair.id}>
    <Link to={`/pair/${id}`}>{pair.name}</Link>
  </li>
}

export default function Pairs(props) {
  // const context = useContext(AppContext)

  // const dispatch = useDispatch()
  // const { pairs } = useSelector(state => state.pairs, (item, previous) => {
  //   return checkPairDifferences(item, previous)
  // })
  // useUpdatePairs(dispatch)

  const [pairs, setPairs] = useRecoilState(pairList)
  useUpdatePairsRecoil()
  console.log(">>> Pairs", pairs)

  return (
    <div className="Pairs">
      <h1>Pairs</h1>
        Count: {pairs.length}
        <ul>
          {
            pairs.map(pair_id => {
              return <PairInfo key={pair_id} id={pair_id}/>
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