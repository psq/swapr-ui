import {
  atom,
  atomFamily,
} from 'recoil'
import {
  recoilPersist,
} from 'recoil-persist'

const { persistAtom } = recoilPersist({ key: 'swapr-v0' })

export const pairList = atom({
  key: 'pairList',
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const tokenList = atom({
  key: 'tokenList',
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const tokenFamily = atomFamily({
  key: 'tokenFamily',
  default: {},
  effects_UNSTABLE: [persistAtom],
})

export const pairFamily = atomFamily({
  key: 'pairFamily',
  default: {},
  effects_UNSTABLE: [persistAtom],
})

export const tokenBalanceFamily = atomFamily({
  key: 'tokenBalanceFamily',
  default: 0,
  effects_UNSTABLE: [persistAtom],
})

export const pairBalanceFamily = atomFamily({
  key: 'pairBalanceFamily',
  default: 0,
  effects_UNSTABLE: [persistAtom],
})

export const pairQuoteFamily = atomFamily({
  key: 'pairQuoteFamily',
  default: {},
  effects_UNSTABLE: [persistAtom],
})
