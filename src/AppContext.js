import { createContext } from 'react'

console.log("--------------reset defaultState")
export const defaultState: AppState = {
  userData: null,
}

export const AppContext = createContext(defaultState)
