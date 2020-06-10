import { createContext } from 'react'

export const defaultState: AppState = {
  userData: null,
}

export const AppContext = createContext(defaultState)
