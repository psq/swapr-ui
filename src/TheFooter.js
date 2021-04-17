import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://swapr.finance" target="_blank" rel="noopener noreferrer">swapr</a>
        <span className="ml-1">&copy; 2021 swapr All Rights Reserved</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
