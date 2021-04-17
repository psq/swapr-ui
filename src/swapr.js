import BigNum from 'bn.js'
import { useEffect } from 'react'
// import { BN } from 'bn.js'
import {
  // makeContractCall,

  deserializeCV,
  serializeCV,

  cvToString,
  contractPrincipalCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions'
import {
  useRecoilState,
  useRecoilCallback,
} from 'recoil'

import {
  SIDECAR_URL,
} from './StacksAccount'

import {
  accountAddressId,
  userDataId,
  pairList,
  tokenList,
  tokenFamily,
  pairFamily,
  tokenBalanceFamily,
  pairBalanceFamily,
  pairQuoteFamily,
} from './atoms'

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
    method: 'POST',
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
    console.log("getTokenBalanceOf.value", value.value.value, owner_principal)

    return value.value.value
  }
  console.log("getTokenBalanceOf: not okay")
  return new BigNum(0)
}

export async function getTokenName(token_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: 'POST',
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
    method: 'POST',
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
    method: 'POST',
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
    method: 'POST',
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

export async function getTokenURI(token_principal) {
  const { address, name } = parseTokenPrincipal(token_principal)
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${address}/${name}/get-token-uri`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenURI.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    // TODO(psq): handle case where it returns `none`, need a token (DIKO?)
    console.log("getTokenURI.value", value.value.value.data)
    return value.value.value.data
  }
  console.log("getTokenTotalSupply: not okay")
  return 'N/A'
}

export async function getPairCount() {
  const options = {
    method: 'POST',
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

export async function getPairBalances(token_x_id, token_y_id) {
  console.log("getPairBalances", token_x_id, token_y_id)
  const [token_x_addr, token_x_contract_name] = token_x_id.split('.')
  const [token_y_addr, token_y_contract_name] = token_y_id.split('.')
  console.log(token_x_addr, token_x_contract_name, token_y_addr, token_y_contract_name)
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[${cvToHex(contractPrincipalCV(token_x_addr, token_x_contract_name))},${cvToHex(contractPrincipalCV(token_y_addr, token_y_contract_name))}]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${SWAPR_ADDRESS}/${SWAPR_CONTRACT_NAME}/get-balances`
  const result = await fetch(url, options)
  const json = await result.json()
  // console.log("getPairBalances.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getPairBalances.value", value)
    return {
      balance_x: value.value.list[0].value.toString(),  // beware the recoil-persit serialization
      balance_y: value.value.list[1].value.toString(),
    }

  }
  console.log("getPairBalances: not okay")
  return null
}

export async function getPairShares(token_x_id, token_y_id) {
  console.log("getPairBalances", token_x_id, token_y_id)
  const [token_x_addr, token_x_contract_name] = token_x_id.split('.')
  const [token_y_addr, token_y_contract_name] = token_y_id.split('.')
  console.log(token_x_addr, token_x_contract_name, token_y_addr, token_y_contract_name)
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${SWAPR_ADDRESS}","arguments":[${cvToHex(contractPrincipalCV(token_x_addr, token_x_contract_name))},${cvToHex(contractPrincipalCV(token_y_addr, token_y_contract_name))}]}`,
  }
  const url = `${SIDECAR_URL}/v2/contracts/call-read/${SWAPR_ADDRESS}/${SWAPR_CONTRACT_NAME}/get-shares`
  const result = await fetch(url, options)
  const json = await result.json()
  // console.log("getPairShares.result", json)
  if (json.okay) {
    const value = deserializeCV(Buffer.from(json.result.slice(2), 'hex'))
    console.log("getPairShares.value", value)
    return value.value.value.toString()  // beware the recoil-persit serialization
  }
  console.log("getPairShares: not okay")
  return null
}

export async function getPairInfo(pair_id) {
  // console.log("getPairInfo", pair_id)
  const options = {
    method: 'POST',
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
    console.log("get-pair-contracts.value", value)
    const token_x = value.data['token-x']
    const token_y = value.data['token-y']
    // console.log("tokens", cvToString(token_x), cvToString(token_y))

    const options = {
      method: 'POST',
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

export async function getTokenMetadata(uri) {
  if (uri.length === 0) {
    return {
      name: 'N/A',
      description: 'N/A',
      image: 'https://swapr.finance/tokens/unknown.png',
      vector: 'https://swapr.finance/tokens/unknown.svg',
    }
  }
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
  }
  const url = `${uri}`
  const result = await fetch(url, options)
  const json = await result.json()
  console.log("getTokenMetadata", uri, json)
  return json
}

export async function useUpdatePairsRecoil() {
  const updatePairsAndTokens = useRecoilCallback(({snapshot, set}) => async () => {
    console.log("useRecoilCallback.snapshot", snapshot)

    const pair_list = []
    const retrieved_tokens = {}
    const token_list = []

    const account_address = snapshot.getLoadable(accountAddressId).contents
    console.log("account_address", account_address)
    if (account_address.length === 0) {  // too early
      return
    }

    const count = await getPairCount()
    console.log("count", count)
    for (let pair_idx = 0; pair_idx < count; pair_idx++) {
      const pair = await getPairInfo(pair_idx + 1)
      const pair_shares_total = await getPairShares(pair.token_x_principal, pair.token_y_principal)

      const pair_id = `${pair.token_x_principal}$${pair.token_y_principal}`
      set(pairFamily(pair_id), {...pair, pair_shares_total})
      pair_list.push({
        id: pair_id,
        name: pair.name,
      })

      if (!retrieved_tokens[pair.token_x_principal]) {
        retrieved_tokens[pair.token_x_principal] = {
          type: 'token',
          principal: pair.token_x_principal
        }
      }
      if (!retrieved_tokens[pair.token_y_principal]) {
        retrieved_tokens[pair.token_y_principal] = {
          type: 'token',
          principal: pair.token_y_principal
        }
      }
      if (!retrieved_tokens[pair.swapr_token_principal]) {
        retrieved_tokens[pair.swapr_token_principal] = {
          type: 'token',
          principal: pair.swapr_token_principal
        }
      }
      const pair_balances = await getPairBalances(pair.token_x_principal, pair.token_y_principal)
      console.log("pair_balances", pair_id, pair_balances)
      set(pairBalanceFamily(pair_id), pair_balances)
    }

    const keys = Object.keys(retrieved_tokens)
    console.log("get token info", keys)
    for (let key of keys) {
      const token = retrieved_tokens[key]
      console.log("retrieving information about", token.principal)
      const uri = await getTokenURI(token.principal)

      const full_token = {
        type: token.type,
        principal: token.principal,
        name: await getTokenName(token.principal),
        symbol: await getTokenSymbol(token.principal),
        decimals: await getTokenDecimals(token.principal),
        total_supply: await getTokenTotalSupply(token.principal),
        uri,
        metadata: await getTokenMetadata(uri),
      }

      token_list.push({
        id: full_token.principal,
        name: full_token.name,
      })
      console.log("full_token", full_token)

      set(tokenFamily(token.principal), full_token)

      // recoil persit does not persit BigNum correctly,
      set(tokenBalanceFamily(token.principal), (await getTokenBalanceOf(token.principal, account_address)).toString())
    }

    const token_list_sorted = token_list.sort((a, b) => a.name.localeCompare(b.name))
    console.log("token_list_sorted", token_list_sorted)

    set(pairList, pair_list);
    set(tokenList, token_list_sorted);
  })

  useEffect(() => {
    updatePairsAndTokens()
    // const id = setInterval(() => updatePairsAndTokens(), 60000)
    // return () => { clearInterval(id) }
  }, [/*updatePairsAndTokens*/])
}

