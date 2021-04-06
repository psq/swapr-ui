import React, { /* useContext, */ } from 'react'
import { useParams } from "react-router-dom"

// import { AppContext } from './AppContext'

export default function Token(props) {
  // const context = useContext(AppContext)
  let { tokenId } = useParams()
  console.log("Token", tokenId)

  return (
    <div className="Token">
      <h1>{tokenId}</h1>
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