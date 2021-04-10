import { BN } from 'bn.js'

import {
  // makeSmartContractDeploy,
  // makeContractCall,
  // TransactionVersion,
  // FungibleConditionCode,

  // serializeCV,
  deserializeCV,
  // standardPrincipalCV,
  // uintCV,

  // BooleanCV,
  // PrincipalCV,
  // UIntCV,

  // ChainID,
  // makeStandardSTXPostCondition,
  // makeContractSTXPostCondition,
  // StacksTestnet,
  // broadcastTransaction,
  // PostConditionMode,
} from '@blockstack/stacks-transactions'

// import {
//   waitForTX,
// } from './tx-utils'

import {
  network,
} from '../StacksAccount'

export async function getTokens(keys_sender, contract) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${keys_sender.stacksAddress}","arguments":[]}`,
  }
  const response = await fetch(`${network.coreApiUrl}/v2/contracts/call-read/${contract.stacksAddress}/${contract.name}/get-tokens`, options)

  if (response.ok) {
    const result = await response.json()
    if (result.okay) {
      const result_data = deserializeCV(Buffer.from(result.result.slice(2), 'hex'))
      console.log("result_data", result_data)
      return result_data.value.value
    } else {
      console.log(result)
      throw new Error(result.cause)
    }
  } else {
    console.log("not 200 response", response)
    throw new Error('not 200')
  }

}

export async function getPairs(keys_sender, contract) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${keys_sender.stacksAddress}","arguments":[]}`,
  }
  const response = await fetch(`${network.coreApiUrl}/v2/contracts/call-read/${contract.stacksAddress}/${contract.name}/get-pairs`, options)

  if (response.ok) {
    const result = await response.json()
    if (result.okay) {
      const result_data = deserializeCV(Buffer.from(result.result.slice(2), 'hex'))
      console.log("result_data", result_data)
      return result_data.value.value
    } else {
      console.log(result)
      throw new Error(result.cause)
    }
  } else {
    console.log("not 200 response", response)
    throw new Error('not 200')
  }

}
