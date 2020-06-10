import React, { useContext } from 'react'
import { Flex, Box, Text } from '@blockstack/ui'
import { BlockstackIcon } from '@blockstack/ui'
import { AppContext } from './AppContext'
import { /*Link,*/ useConnect } from '@blockstack/connect'
import { Link } from 'react-router-dom'

// interface HeaderProps {
//   signOut: () => void
// }

export const Header = ({ signOut }) => {
  const state = useContext(AppContext)
  const { doOpenAuth } = useConnect()

  return (
    <Flex as="nav" justifyContent="space-between" alignItems="center" height="64px" px={6}>
      <Box verticalAlign="center">
        <BlockstackIcon maxHeight="26px" display="inline-block" ml="-10px" />
        <Text display="inline-block" ml={3}>
          swapr
        </Text>
      </Box>
      {state.userData ? ([
        <Box key="1">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/exchange">Exchange</Link>
            </li>
            <li>
              <Link to="/pool">Pool</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </Box>,
        <Box key="2">
          <Text textstyle="caption.medium">{state.userData.username}</Text>
          <a href="#"
            display="inline-block"
            onClick={() => {
              signOut()
            }}
          >
            Logout
          </a>
        </Box>,]
      ) : (
        <Box>
          <a href="#"
            display="inline-block"
            onClick={() => {
              doOpenAuth(false, {authOrigin: 'http://localhost:5555'})
            }}
          >
            Register
          </a>
          <Text textstyle="caption">/</Text>
          <a href="#"
            display="inline-block"
            onClick={() => {
              doOpenAuth(true, {authOrigin: 'http://localhost:5555'})
            }}
          >
            Log in
          </a>
        </Box>
      )}
    </Flex>
  )
}
