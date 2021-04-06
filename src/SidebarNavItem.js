import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CIcon from '@coreui/icons-react'


import { CLink, CBadge } from '@coreui/react'
// import { iconProps } from './CSidebarNavDropdown'

export var iconProps = function iconProps(icon) {
  // if (typeof icon === 'object') {
  //   var _extends2;

  //   var key = icon.size ? 'className' : 'customClasses';
  //   return _extends(_extends({}, icon), {}, (_extends2 = {}, _extends2["" + key] = icon.customClasses || "c-sidebar-nav-icon " + icon.className, _extends2));
  // } else {
    return {
      customClasses: 'c-sidebar-nav-icon',
      name: icon
    };
  // }
}; //component - CoreUI / CSidebarNavDropdown


//component - CoreUI / SidebarNavItem copied/tweaked
export const CSidebarNavItem = props => {
  // console.log("CSidebarNavItem", props)

  const {
    children,
    className,
    //
    innerRef,
    name,
    icon,
    fontIcon,
    badge,
    addLinkClass,
    label,
    color,
    ...rest
  } = props

  //render
  const classes = classNames(
    'c-sidebar-nav-item',
    className
  )
  // console.log("classes", classes)
  const linkClasses = classNames(
    label ? 'c-sidebar-nav-label' : 'c-sidebar-nav-link',
    color && `c-sidebar-nav-link-${color}`,
    addLinkClass
  )
  // console.log("linkClasses", linkClasses)
  const routerLinkProps = rest.to && { isActive: (a, {pathname}) => { return pathname === rest.to || (rest.to === '/tokens' && pathname.startsWith('/token')) || (rest.to === '/pairs' && pathname.startsWith('/pair')) }, activeClassName: 'c-active'}
  // console.log("routerLinkProps", routerLinkProps)
  // console.log("children", children)
  // console.log("rest", rest)
  return (
    <li className={classes} ref={innerRef}>
      { children || 
        <CLink
          className={linkClasses}
          {...routerLinkProps}
          {...rest}
          active={true}
        >
          { icon && <CIcon {...iconProps(icon)}/>}
          { fontIcon && <i className={`c-sidebar-nav-icon ${fontIcon}`}/>}
          {name}
          { badge && <CBadge {...{...badge, text: null}}>{badge.text}</CBadge>}
        </CLink>
      }
  </li>
  )
}

CSidebarNavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  fontIcon: PropTypes.string,
  badge: PropTypes.object,
  addLinkClass: PropTypes.string,
  label: PropTypes.bool,
  name: PropTypes.string,
  color: PropTypes.string
}

// export default SidebarNavItem
