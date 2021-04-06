// import { RPCClient } from '@blockstack/rpc-client'

export const getAuthOrigin = () => {
  let authOrigin = 'https://stacks-api.nanorails.com' // mocknet

  const { origin } = document.location

  if (!origin.includes('localhost')) {
    authOrigin = 'https://stacks-node-api.mainnet.stacks.co'  // mainnet
  }

  return authOrigin
};

// export const getRPCClient = () => {
//   // const { origin } = document.location
//   // const url = origin.includes('localhost')
//   //   ? 'http://localhost:3999'
//   //   : 'https://sidecar.staging.blockstack.xyz';
//   // const url = 'https://stacks-node-api.blockstack.org'  // TODO(url)
//   const url = 'http://localhost:3999'  // TODO(url)
//   return new RPCClient(url)
// }

export function numberWithCommas(x) {
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function BNWithCommas(x, d = 3) {
  let s = x.toString()
  let l = s.length

  if (l < 7) {
    const s2 = '000000' + s
    const l2 = s2.length
    s = s2.slice(l2 - 7, l2)
    l = s.length
  }
  return s.slice(0, l - 6).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + s.slice(l - 6, l + d - 6)
}