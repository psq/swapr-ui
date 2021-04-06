import { BN } from 'bn.js'

import { useEffect } from 'react'
import {
  // addressToString,
  createStacksPrivateKey,
  getPublicKey,
  addressFromPublicKeys,
  AddressVersion,
  AddressHashMode,
} from '@stacks/transactions'

import {
  StacksMainnet,
  StacksTestnet,
} from '@stacks/network'


import { balanceOf as wraprBalanceOf } from './clients/wrapr-client'
import { getAuthOrigin } from './utils'

// export const SIDECAR_URL = 'https://sidecar.staging.blockstack.xyz'
export const SIDECAR_URL = getAuthOrigin()
// export const SIDECAR_URL = 'https://stacks-node-api.blockstack.org'  // TODO(url)
export const STACK_API_URL = SIDECAR_URL + '/v2/transactions'
export const STACKS_API_ACCOUNTS_URL = SIDECAR_URL + '/v2/accounts'
export const STACKS_API_FAUCET = SIDECAR_URL + '/extended/v1/faucets/stx'
export const WRAPR_CONTRACT = {
  name: 'wrapr',
  stacksAddress: 'ST32N7A3G9P7J0VZ2JCJCG5DMB1TDWY8Q08KQ3B99',
}
export const SWAPR_CONTRACT = {
  stacksAddress: 'ST32N7A3G9P7J0VZ2JCJCG5DMB1TDWY8Q08KQ3B99'
}

export function getStacksAccount(appPrivateKey) {
  const privateKey = createStacksPrivateKey(appPrivateKey)
  const publicKey = getPublicKey(privateKey)
  const address = addressFromPublicKeys(
    AddressVersion.TestnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  )
  return { privateKey, address }
}

export async function fetchAccount(address) {
  // console.log('Checking account')
  const balanceUrl = `${STACKS_API_ACCOUNTS_URL}/${address}`
  const result = await fetch(balanceUrl)
  // console.log(result)
  const json = await result.json()
  // console.log("fetchAccount.result", json)
  const balance = new BN(json.balance.substring(2), 16)
  return balance
}

export async function getSTX(address) {
    const result = await fetch(
    `${STACKS_API_FAUCET}?address=${address}`,
    {
      method: 'POST',
    }
  )
  return result
}

export function useUpdateSTX(sender, dispatch, current_stx_balance) {
  useEffect(() => {
    const id = setInterval(async () => {
      const stx_balance = await fetchAccount(sender.stacksAddress)
      // console.log("stx_balance", stx_balance)
      if (current_stx_balance === null || !current_stx_balance.eq(stx_balance)) {
        dispatch({type: 'set_stx', stx_balance})
      }
    }, 2500)
    return () => { clearInterval(id) }
  }, [sender, dispatch, current_stx_balance])
}

export function useUpdateWRAPR(sender, dispatch, current_wrapr_balance) {
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const wrapr_balance = await wraprBalanceOf(sender, sender, WRAPR_CONTRACT)
        // console.log("wrapr_balance", wrapr_balance)
        if (current_wrapr_balance === null || !current_wrapr_balance.eq(wrapr_balance)) {
          dispatch({type: 'set_wrapr', wrapr_balance})
        }
      } catch(e) {
        console.log("error retrieving wrapr balance", e.message)
      }
    }, 2500)
    return () => { clearInterval(id) }
  }, [sender, dispatch, current_wrapr_balance])
}

export const network = new StacksTestnet()
network.coreApiUrl = SIDECAR_URL
