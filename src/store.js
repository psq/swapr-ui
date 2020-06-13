import { createStore, combineReducers } from 'redux'

const updateSTXReducer = (state = {stx_balance: null}, {type, stx_balance}) => {
  // console.log("updateSTXReducer", type, stx_balance)
  if (type === 'set_stx') {
    return {...state, stx_balance}
  } else {
    return state
  }
}

const changeSidebarState = (state = {sidebar_show: 'responsive'}, { type, ...rest }) => {
  // console.log("changeSidebarState", {...rest})
  switch (type) {
    case 'set_sidebar':
      return {...state, ...rest }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  stx: updateSTXReducer,
  sidebar: changeSidebarState,
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export default store