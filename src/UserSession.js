// // import { AppConfig } from 'blockstack'
// import { didConnect } from 'react-blockstack'
// import { addressToString } from '@blockstack/stacks-transactions'
// import { getStacksAccount } from './StacksAccount'

// // TODO(psq): why it this there twice (see index.js)
// // export const appConfig = new AppConfig(['store_write', 'publish_data'])
// export const STX_JSON_PATH = 'swapr-stx.json'

// export const connectOptions = session => {
//   return {
//     finished: async ({ userSession }) => {
//       didConnect({ userSession })

//       const userData = userSession.loadUserData()
//       const { address } = getStacksAccount(userData.appPrivateKey)
//       console.log(JSON.stringify({ address: addressToString(address) }))
//       try {
//         await userSession.putFile(
//           STX_JSON_PATH,
//           JSON.stringify({ address: addressToString(address) }),
//           { encrypt: false }
//         )
//         console.log('STX address published')
//       } catch (e) {
//         console.log(e)
//         console.log('STX address NOT published, retrying')
//         try {
//           await userSession.deleteFile(STX_JSON_PATH)
//           await userSession.putFile(
//             STX_JSON_PATH,
//             JSON.stringify({ address: addressToString(address) }),
//             { encrypt: false }
//           )
//           console.log('STX address published on second attempt')
//         } catch (e) {
//           console.log(e)
//           console.log('STX address NOT published on second attempt')
//         }
//       }
//     },
//     authOrigin: 'http://localhost:8888',
//     appDetails: {
//       name: 'swapr',
//       icon: "https://swapr.runkodapps.com/swapr.png"
//     },
//     userSession: session,
//   }
// }
