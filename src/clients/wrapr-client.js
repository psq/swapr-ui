import { BN } from 'bn.js'

import {
  // makeSmartContractDeploy,
  makeContractCall,
  // TransactionVersion,
  // FungibleConditionCode,

  serializeCV,
  deserializeCV,
  standardPrincipalCV,
  uintCV,

  // BooleanCV,
  // PrincipalCV,
  // UIntCV,

  // ChainID,
  // makeStandardSTXPostCondition,
  // makeContractSTXPostCondition,
  // StacksTestnet,
  broadcastTransaction,
  PostConditionMode,
} from '@blockstack/stacks-transactions'

import {
  waitForTX,
} from './tx-utils'

import {
  network,
} from '../StacksAccount'

export async function wrap(amount, keys_sender, contract) {
  console.log("wrap", keys_sender.stacksAddress, amount)
  const fee = new BN(256)
  const transaction = await makeContractCall({
    contractAddress: contract.stacksAddress,
    contractName: contract.name,
    functionName: "wrap",
    functionArgs: [uintCV(amount)],
    senderKey: keys_sender.secretKey,
    network,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [
      // makeStandardSTXPostCondition(
      //   keys_sender.stacksAddress,
      //   FungibleConditionCode.Equal,
      //   new BN(amount)
      // ),
      // makeStandardFungiblePostCondition(
      // ),
    ],
    fee,
    // nonce: new BN(0),
  })
  const tx_id = await broadcastTransaction(transaction, network)
  const tx = await waitForTX(network.coreApiUrl, tx_id, 10000)

  const result = deserializeCV(Buffer.from(tx.tx_result.hex.substr(2), "hex"))
  return result
}

export async function unwrap(amount, keys_sender, contract) {
  console.log("unwrap", keys_sender.stacksAddress, amount)
  const fee = new BN(256)
  const transaction = await makeContractCall({
    contractAddress: contract.stacksAddress,
    contractName: contract.name,
    functionName: "unwrap",
    functionArgs: [uintCV(amount)],
    senderKey: keys_sender.secretKey,
    network,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [
      // makeStandardSTXPostCondition(  // TODO(psq): should be the other way around
      //   keys_sender.stacksAddress,
      //   FungibleConditionCode.Equal,
      //   new BN(amount)
      // ),
      // makeStandardFungiblePostCondition(
      // ),
    ],
    fee,
    // nonce: new BN(0),
  })
  const tx_id = await broadcastTransaction(transaction, network)
  const tx = await waitForTX(network.coreApiUrl, tx_id, 10000)

  const result = deserializeCV(Buffer.from(tx.tx_result.hex.substr(2), "hex"))
  return result
}

export async function balanceOf(keys_owner, keys_sender, contract) {
  // console.log("balanceOf with sender", keys_owner.stacksAddress, keys_sender.stacksAddress)
  const owner = serializeCV(standardPrincipalCV(keys_owner.stacksAddress))

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"sender":"${keys_sender.stacksAddress}","arguments":["0x${owner.toString("hex")}"]}`,
  }
  const response = await fetch(`${network.coreApiUrl}/v2/contracts/call-read/${contract.stacksAddress}/${contract.name}/balance-of`, options)

  if (response.ok) {
    const result = await response.json()
    if (result.okay) {
      const result_data = deserializeCV(Buffer.from(result.result.substr(2), "hex"))
      // console.log("result_data", result_data)
      return result_data.value.value
    } else {
      // console.log(result)
      throw new Error(result.cause)
    }
  } else {
    console.log("not 200 response", response)
    throw new Error('not 200')
  }

}
