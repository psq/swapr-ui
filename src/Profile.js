import React, { Component } from 'react'
// import BlockstackContext from 'react-blockstack/dist/context'
import { addressToString } from '@blockstack/stacks-transactions'
import { AppContext } from './AppContext'

import {
  getStacksAccount,
  STACKS_API_ACCOUNTS_URL,
  STACKS_API_FAUCET,
  fetchAccount,
} from './StacksAccount'

// Demonstrating BlockstackContext for legacy React Class Components.

export default class Profile extends Component {
  static contextType = AppContext

  state = {
    account: undefined,
    address: undefined,
    balanceBrowserUrl: undefined,
    status: undefined,
  }

  constructor(props) {
    super(props)
    this.spinner = React.createRef()
    this.faucetSpinner = React.createRef()
  }

  componentDidMount() {
    this.onContextChanged()
  }

  async onContextChanged() {
    const { userData } = this.context
    console.log("userData++", userData)
    // const { userData } = this.props

    const { address } = getStacksAccount(userData.appPrivateKey)
    const addressAsString = addressToString(address)
    this.setState({
      address,
      balanceBrowserUrl: `${STACKS_API_ACCOUNTS_URL}/${addressAsString}`,
    })
    this.onRefreshBalance(addressAsString)
  }

  async onRefreshBalance(addressAsString) {
    this.setState({ status: undefined })
    this.spinner.current.classList.remove('d-none')
    try {
      const acc = await fetchAccount(addressAsString)
      console.log(acc)
      this.setState({ account: acc })
      this.spinner.current.classList.add('d-none')
    } catch(e) {
      this.setStatus('Refresh failed')
      console.log(e)
      this.spinner.current.classList.add('d-none')
    }
  }

  setStatus(status) {
    this.setState({ status })
    setTimeout(() => {
      this.setState({ status: undefined })
    }, 2000)
  }

  async claimTestTokens(addressAsString) {
    this.setState({ status: undefined })
    this.faucetSpinner.current.classList.remove('d-none')

    try {
      const result = await fetch(
        `${STACKS_API_FAUCET}?address=${addressAsString}`,
        {
          method: 'POST',
        }
      )
      if (result.status === 200) {
        this.setStatus('Tokens will arrive soon.')
      } else {
        this.setStatus('Claiming tokens failed.')
      }
      console.log(result)
      this.faucetSpinner.current.classList.add('d-none')
    } catch(e) {
      this.setStatus('Claiming tokens failed.')
      console.log(e)
      this.faucetSpinner.current.classList.add('d-none')
    }
  }

  render() {
    const { userData } = this.context
    const { account, address, status } = this.state

    console.log("userData--", userData)

    console.log("account", account)
    console.log("address", address)
    console.log("status", status)


    const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png'
    return (
      <div className="Profile">
        <div className="avatar-section text-center">
          <img
            src={/*(person && person.avatarUrl()) ||*/ avatarFallbackImage}
            className="img-rounded avatar"
            id="avatar-image"
            alt="Avatar"
          />
        </div>
        <h1 className="text-center mt-2">
          Hello,{' '}
          <span id="heading-name">
            {userData.username || 'swapr user'}
          </span>
          !
        </h1>
        {address && (
          <p>
            Your STX address: {addressToString(address)} <br />
          </p>
        )}
        {account && (
          <p>
            You balance: {parseInt(account.balance, 16)}uSTX.
            <br />
          </p>
        )}
        <button
          className="btn btn-outline-secondary mt-1"
          onClick={e => {
            this.onRefreshBalance(addressToString(address));
          }}
        >
          <div
            ref={this.spinner}
            role="status"
            className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
          />
          Refresh balance
        </button>{' '}
        <button
          className="btn btn-outline-secondary mt-1"
          onClick={() => {
            this.claimTestTokens(addressToString(address));
          }}
        >
          <div
            ref={this.faucetSpinner}
            role="status"
            className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
          />
          Claim test tokens from faucet
        </button>
        {status && (
          <p>
            <br />
            <p>{status}</p>
          </p>
        )}

      </div>
    )
  }
}

