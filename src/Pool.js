import React, { useContext } from 'react'

import { AppContext } from './AppContext'

export default function Landing (props) {
  const state = useContext(AppContext)

  console.log("state", state)
  console.log("userData", state.userData)
  return (
    <div className="Pool">
      Pool
    </div>
  )
}