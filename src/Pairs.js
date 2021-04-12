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
  const [token_x] = useRecoilState(tokenFamily(pair.token_x_principal))
  const [token_y] = useRecoilState(tokenFamily(pair.token_y_principal))
  console.log(">>> PairInfo", id, pair)
  return <li style={{listStyleType: 'none'}}>
    <Link to={`/pair/${id}`}>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px", zIndex: 1000}} src={token_x.metadata.vector} alt="Token icon"/>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px", marginLeft: "-22px", zIndex: 1100}} src={token_y.metadata.vector} alt="Token icon"/>
      {pair.name}
    </Link>
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
  const sorted_pairs = pairs.slice().sort((a, b) => a.name.localeCompare(b.name))
  console.log(">>> Pairs", sorted_pairs)

  return (
    <div className="Pairs">
      <h1>Pairs</h1>
        Count: {pairs.length}
        <ul style={{paddingInlineStart: '10px'}}>
          {
            sorted_pairs.map(pair => {
              return <PairInfo key={pair.id} id={pair.id}/>
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