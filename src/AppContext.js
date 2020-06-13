import { createContext } from 'react'

export const defaultState: AppState = {
  userData: null,
  show_landing: false,
}

export const AppContext = createContext(defaultState)
