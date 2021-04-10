import { useEffect } from 'react'
// import { BN } from 'bn.js'
import {
  // makeContractCall,

  deserializeCV,
  serializeCV,

  cvToString,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions'

import {
  SIDECAR_URL,
} from './StacksAccount'

const cvToHex = val => `"0x${serializeCV(val).toString('hex')}"`

export const SWAPR_ADDRESS = process.env.REACT_APP_SWAPR_STX
export const SWAPR_CONTRACT_NAME = process.env.REACT_APP_CONTRACT_NAME_SWAPR

console.log("SWAPR_ADDRESS", SWAPR_ADDRESS)
console.log("SWAPR_CONTRACT_NAME", SWAPR_CONTRACT_NAME)

function parseTokenPrincipal(token_principal) {
  const parts = token_principal.split('.')
  return {
    address: parts[0],
    name: parts[1],
  }
}

export async function getTokenBalanceOf(token_principal, owner_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[${cvToHex(standardPrincipalCV(owner_principal))}]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${address}/${name}/get-balance-of`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenBalanceOf.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getTokenBalanceOf.value", value.value.value)

    return value.value.value
  }
  console.log("getTokenBalanceOf: not okay")
  return 'N/A'
}

export async function getTokenName(token_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${address}/${name}/get-name`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenName.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getTokenName.value", value.value.data)

    return value.value.data
  }
  console.log("getTokenName: not okay")
  return 'N/A'
}

export async function getTokenSymbol(token_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${address}/${name}/get-symbol`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenSymbol.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getTokenSymbol.value", value.value.data)

    return value.value.data
  }
  console.log("getTokenSymbol: not okay")
  return 'N/A'
}

export async function getTokenDecimals(token_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${address}/${name}/get-decimals`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenDecimals.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getTokenDecimals.value", value.value.value.toNumber())

    return value.value.value.toNumber()
  }
  console.log("getTokenDecimals: not okay")
  return 'N/A'
}

export async function getTokenTotalSupply(token_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${address}/${name}/get-total-supply`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenTotalSupply.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getTokenTotalSupply.value", value.value.value.toNumber())

    return value.value.value.toNumber()
  }
  console.log("getTokenTotalSupply: not okay")
  return 'N/A'
}

export async function getPairCount() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${SWAPR_ADDRESS}/${SWAPR_CONTRACT_NAME}/get-pair-count`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getPairCount.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getPairCount.value", value.value.value.toNumber())

    return value.value.value.toNumber()
  }
  console.log("getPairCount: not okay")
  return 0
}

export async function getPairInfo(pair_id) {
  // console.log("getPairInfo", pair_id)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[${cvToHex(uintCV(pair_id))}]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${SWAPR_ADDRESS}/${SWAPR_CONTRACT_NAME}/get-pair-contracts`
  const result = await fetch(url, options)
  const json = await result.json()
  // console.log("getPairInfo.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    // console.log("getPairInfo.value", value)
    const token_x = value.data['token-x']
    const token_y = value.data['token-y']
    // console.log("tokens", cvToString(token_x), cvToString(token_y))

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"sender":"${SWAPR_ADDRESS}","arguments":[${cvToHex(token_x)}, ${cvToHex(token_y)}]}`,
    }
    const url = `${SIDECAR_URL}/v2/contracts/call-read/${SWAPR_ADDRESS}/${SWAPR_CONTRACT_NAME}/get-pair-details`
    const result = await fetch(url, options)
    const json2 = await result.json()
    // console.log("getPairDetails.result", json2)
    const value2 = deserializeCV(Buffer.from(json2.result.slice(2), 'hex'))
    // console.log("getPairDetails.value", value2)

    return {
      token_x_principal: cvToString(token_x),
      token_x_cv: token_x,
      token_y_principal: cvToString(token_y),
      token_y_cv: token_y,
      name: value2.data.name.data,
      swapr_token_principal: cvToString(value2.data['swapr-token']),
      swapr_token_cv: value2.data['swapr-token'],
      shares_total: value2.data['shares-total'].value, // BN
      id: pair_id,
    }
  }
  console.log("getPairInfo: not okay")
  return null

}

export function checkPairDifferences(new_pairs, old_pairs) {
  for (let i = 0; i < new_pairs.pairs.length; i++) {
    const old_pair = old_pairs.pairs[i]
    const new_pair = new_pairs.pairs[i]
    if (!old_pair) {
      return false
    }
    if (old_pair.token_x_principal !== new_pair.token_x_principal) {
      return false
    }
    if (old_pair.token_y_principal !== new_pair.token_y_principal) {
      return false
    }
    if (old_pair.name !== new_pair.name) {
      return false
    }
    if (old_pair.swapr_token_principal !== new_pair.swapr_token_principal) {
      return false
    }
    if (!old_pair.shares_total.eq(new_pair.shares_total)) {
      return false
    }
    if (old_pair.id !== new_pair.id) {
      return false
    }
  }
  return true
}

export function checkTokenDifferences(new_tokens, old_tokens) {
  for (let i = 0; i < new_tokens.tokens.length; i++) {
    const old_token = old_tokens.tokens[i]
    const new_token = new_tokens.tokens[i]
    if (!old_token) {
      return false
    }
    if (old_token.total_supply !== new_token.total_supply) {
      return false
    }
    // TODO(psq): add price once available
    // TODO(psq): add volume once available
    // the rest shoudl be immutable
  }
  return true
}

async function updatePairs (dispatch) {
    const count = await getPairCount()
    const pairs = []
    const tokens = {}
    for (let pair_id = 0; pair_id < count; pair_id++) {
      const pair = await getPairInfo(pair_id + 1)
      pairs[pair_id] = pair
      if (!tokens[pair.token_x_principal]) {
        tokens[pair.token_x_principal] = {
          type: 'token',
          principal: pair.token_x_principal
        }
      }
      if (!tokens[pair.token_y_principal]) {
        tokens[pair.token_y_principal] = {
          type: 'token',
          principal: pair.token_y_principal
        }
      }
      if (!tokens[pair.swapr_token_principal]) {
        tokens[pair.swapr_token_principal] = {
          type: 'token',
          principal: pair.swapr_token_principal
        }
      }
      console.log("get token info", tokens)
      Object.keys(tokens).forEach(async k => {
        const token = tokens[k]
        token.name = await getTokenName(token.principal)
        token.symbol = await getTokenSymbol(token.principal)
        token.decimals = await getTokenDecimals(token.principal)
        token.total_supply = await getTokenTotalSupply(token.principal)
        console.log("token", token)
      })

    }

    // TODO(psq):
    // also get more token information: name, symbol, contract, decimals, total-supply, balance-of(user if logged in)
    // hopefully, read-only calls can work now, or make them read-only
    // build token list in redux
    // check user's pair balance as well: balance-of swapr token if logged in, get-balances(token-x, token-y)
    // that's a lot of calls (maybe caching to local storage would help?)


    dispatch({type: 'set_tokens', tokens})
    dispatch({type: 'set_pairs', pairs})
  }

export async function useUpdatePairs(dispatch) {
  useEffect(() => {
    updatePairs(dispatch)
    const id = setInterval(() => updatePairs(dispatch), 10000)
    return () => { clearInterval(id) }
  }, [dispatch])
}


