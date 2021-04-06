import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  // CSidebarNavItem,
  CImg,
} from '@coreui/react'

import { CSidebarNavItem } from './SidebarNavItem'

// import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation from './nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebar.sidebar_show)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set_sidebar', sidebar_show: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg
          src="/swapr-logo-white.png"
          className="c-sidebar-brand-full"
          height={35}
        />
        <CImg
          src="/swapr-logo-white-min.png"
          className="c-sidebar-brand-minimized"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
