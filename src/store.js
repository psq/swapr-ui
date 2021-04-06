import { createStore, combineReducers } from 'redux'

const updateTokens = (state = {tokens: []}, {type, tokens, token}) => {
  if (type === 'set_tokens') {
    console.log("updateTokens reducer", tokens)
    return {...state, tokens}
  } else if (type === 'set_token') {
    // console.log("updateTokens reducer", tokens)
    const tokens = state.tokens
    tokens[token.principal] = token
    return {...state, tokens}
  } else {
    return state
  }
}

const updatePairs = (state = {pairs: []}, {type, pairs}) => {
  if (type === 'set_pairs') {
    // console.log("updatePairs reducer", pairs)
    return {...state, pairs}
  } else {
    return state
  }
}

const updateSTXReducer = (state = {stx_balance: null}, {type, stx_balance}) => {
  if (type === 'set_stx') {
    return {...state, stx_balance}
  } else {
    return state
  }
}

const updateWRAPRReducer = (state = {wrapr_balance: null}, {type, wrapr_balance}) => {
  if (type === 'set_wrapr') {
    return {...state, wrapr_balance}
  } else {
    return state
  }
}

const changeSidebarState = (state = {sidebar_show: 'responsive'}, { type, ...rest }) => {
  switch (type) {
    case 'set_sidebar':
      return {...state, ...rest }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  tokens: updateTokens,
  pairs: updatePairs,
  stx: updateSTXReducer,
  wrapr: updateWRAPRReducer,
  sidebar: changeSidebarState,
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export default store