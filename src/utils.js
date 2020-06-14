import { RPCClient } from '@blockstack/rpc-client'

export const getAuthOrigin = () => {
  let authOrigin = 'http://localhost:5555'
  // In order to have deploy previews use the same version of the authenticator,
  // we detect if this is a 'deploy preview' and change the origin to point to the
  // same PR's deploy preview in the authenticator.

  const { origin } = document.location

  if (origin.includes('deploy-preview')) {
    // Our netlify sites are called "authenticator-demo" for this app, and
    // "stacks-authenticator" for the authenticator.
    authOrigin = document.location.origin.replace('authenticator-demo', 'stacks-authenticator')
  } else if (origin.includes('authenticator-demo')) {
    authOrigin = 'https://app.blockstack.org'
  }

  return authOrigin
};

export const getRPCClient = () => {
  const { origin } = document.location
  const url = origin.includes('localhost')
    ? 'http://localhost:3999'
    : 'https://sidecar.staging.blockstack.xyz';
  return new RPCClient(url)
}

export function numberWithCommas(x) {
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function BNWithCommas(x, d = 2) {
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