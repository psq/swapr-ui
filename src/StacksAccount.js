import {
  createStacksPrivateKey,
  getPublicKey,
  addressFromPublicKeys,
  AddressVersion,
  AddressHashMode,
} from '@blockstack/stacks-transactions'

// export const SIDECAR_URL = 'https://sidecar.staging.blockstack.xyz'
export const SIDECAR_URL = 'http://localhost:3999'
export const STACK_API_URL = SIDECAR_URL + '/v2/transactions'
export const STACKS_API_ACCOUNTS_URL = SIDECAR_URL + '/v2/accounts'
export const STACKS_API_FAUCET = SIDECAR_URL + '/sidecar/v1/debug/faucet'

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
  const balance = parseInt(json.balance, 16)
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