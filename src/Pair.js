import React, { /* useContext, */ } from 'react'
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

// import { AppContext } from './AppContext'

export default function Pair (props) {
  // const context = useContext(AppContext)
  let { pairId } = useParams()
  console.log("Pair", pairId)
  const tokens = pairId.split('-')
  return (
    <div className="Pair">
      <h1>{pairId}</h1>
      <ul>
        {
          tokens.map(token => (<li key={token}><Link to={`/token/${token}`}>{token}</Link></li>))
        }
      </ul>

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