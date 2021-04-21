import BigNum from 'bn.js'
import React, { useCallback, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useRecoilCallback, useRecoilState } from 'recoil'

import { useConnect } from '@stacks/connect-react'

import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { withStyles, makeStyles } from '@material-ui/core/styles'

import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  contractPrincipalCV,
  standardPrincipalCV,
  trueCV,
  PostConditionMode,
} from '@stacks/transactions'

import {
  useUpdatePairsRecoil,
} from './swapr'

import {
  userDataId,
  accountAddressId,
  pairList,
  tokenList,
  tokenFamily,
  pairFamily,
  tokenBalanceFamily,
  pairBalanceFamily,
  pairQuoteFamily,
} from './atoms'

import {
  network,
} from './utils'


const useStyles = makeStyles({
  name: {
    fontWeight: 800,
    width: '140px',
  },
  root: {
    flexGrow: 1,
  },
  underline: {
    color: '#0f0',
    borderColor: '#0f0',
    borderWidth: 0,
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
})

const button_styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6BeB 30%, #c151ff 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 38,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
}

const text_field_styles = {
  underline: {
    color: '#f00',
    borderColor: '#f00',
    borderWidth: 0,
  },
}

function ClassNames(props) {
  const { classes, children, className, ...other } = props;

  return (
    <Button className={clsx(classes.root, className)} {...other}>
      {children || 'class names'}
    </Button>
  );
}

const StyledButton = withStyles(button_styles)(ClassNames)

const CustomTextField = props => {
  const { classes, ...rest } = props
  return (
    <TextField InputProps={{ classes: {underline: classes.underline} }} {...rest} />
  )
}

const StyledTextField = withStyles(text_field_styles)(CustomTextField)

function PairInfo(props) {
  const id = props.id
  const [pair, setPair] = useRecoilState(pairFamily(id))
  const [token_x] = useRecoilState(tokenFamily(pair.token_x_principal))
  const [token_y] = useRecoilState(tokenFamily(pair.token_y_principal))
  console.log(">>> PairInfo", id, pair)
  return <li style={{listStyleType: 'none'}}>
    <Link to={`/pair/${id}`}>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px", zIndex: 1000}} src={token_x.metadata.vector} alt="Token icon"/>
      <img style={{width: "45px", height: "35px", paddingTop: '3px', paddingBottom: '3px', paddingRight: "10px", marginLeft: "-22px", zIndex: 1100}} src={token_y.metadata.vector} alt="Token icon"/>
      {pair.name}
    </Link>
</li>
}

function TokenOption(props) {
  const id = props.id
  const [token] = useRecoilState(tokenFamily(id))
  console.log(">>> TokenOption", id, token)
  if (!token || !token.metadata) {
    return "no token"
  }
  return (
    <React.Fragment>
      <img width={'20px'} className="mr-10" src={token.metadata.vector}/>
      {token.name}
    </React.Fragment>
  )
}

export default function Pairs(props) {
  console.log("===== pairs")
  const { signOut } = props
  const { doOpenAuth } = useConnect()
  const [userData] = useRecoilState(userDataId)
  const [accountAddress] = useRecoilState(accountAddressId)

  const [pairs, setPairs] = useRecoilState(pairList)
  // const [token_x_id, setTokenXId] = useState('')
  // const [token_y_id, setTokenYId] = useState('')

  useUpdatePairsRecoil()
  const sorted_pairs = pairs.slice().sort((a, b) => a.name.localeCompare(b.name))
  console.log(">>> Pairs", sorted_pairs)
  const [tokens, setTokens] = useRecoilState(tokenList)
  console.log(">>> Tokens", tokens)
  const sorted_tokens = tokens.slice().filter(token => token.paired).sort((a, b) => a.name.localeCompare(b.name))
  console.log(">>> Tokens.filtered.sorted", sorted_tokens)
  const sorted_token_ids = sorted_tokens.map(t => t.id)
  const tokens_by_ids = []
  for (let token of sorted_tokens) {
    tokens_by_ids[token.id] = token
  }
  console.log("tokens_by_ids", tokens_by_ids)

  const [value_x, setValueX] = React.useState(sorted_token_ids[0])
  const [input_value_x, setInputValueX] = React.useState('')
  const [value_y, setValueY] = React.useState(null)
  const [input_value_y, setInputValueY] = React.useState('')
  console.log("value_x", value_x)
  console.log("value_y", value_y)
  console.log("input_value_x", input_value_x)
  console.log("input_value_y", input_value_y)

  const [token_x] = useRecoilState(tokenFamily(value_x ? value_x : 'none'))
  const [token_y] = useRecoilState(tokenFamily(value_y ? value_y : 'none'))
  console.log("token_x", token_x)
  console.log("token_y", token_y)

  const history = useHistory()
  const location = useLocation()
  console.log("location", location)
  console.log("location.hash", location.hash)
  const [token_x_url, token_y_url] = location.hash.slice(1).split('$')
  if (tokens_by_ids[token_x_url] && value_x !== token_x_url) {
    setValueX(token_x_url)
  }
  if (tokens_by_ids[token_y_url] && value_y !== token_y_url) {
    setValueY(token_y_url)
  }


  const [token_balance_x] = useRecoilState(tokenBalanceFamily(value_x))
  const [token_balance_y] = useRecoilState(tokenBalanceFamily(value_y))
  console.log("token_balance_x", token_balance_x, value_x)
  console.log("token_balance_y", token_balance_y, value_y)

  const [amount_x, setAmountX] = useState(0)
  const [amount_y, setAmountY] = useState(0)
  const [fee, setFee] = useState(0)
  const [slippage, setSlippage] = useState(0.005)

  const { doContractCall } = useConnect()

  // when token_x - token_y is a valid pair (or flipped)
  // const [valid_pair, setValidPair] = useState(false)
  // const [flip, setFlip] = useState(false)

  const pair_info = []
  const getPairs = useRecoilCallback(({snapshot}) => () => {
    console.log("examining pairs", pairs)
    for (let pair of pairs) {
      const info = snapshot.getLoadable(pairFamily(pair.id)).contents
      console.log("retrieved", pair.id, info)
      pair_info.push(info)
    }
  })
  getPairs()
  console.log("pair_info", pair_info)

  let valid_pair = false
  let valid_pair_id = null
  let flipped = null
  for (let pair of pair_info) {
    console.log(pair.token_x_principal, pair.token_y_principal)
    if (pair.token_x_principal === value_x && pair.token_y_principal === value_y) {
      console.log("match", pair, false)
      valid_pair = true
      valid_pair_id = `${pair.token_x_principal}$${pair.token_y_principal}`
      flipped = false
    } else if (pair.token_x_principal === value_y && pair.token_y_principal === value_x) {
      console.log("match", pair, false)
      valid_pair = true
      valid_pair_id = `${pair.token_x_principal}$${pair.token_y_principal}`
      flipped = true
    }
  }
  console.log("valid_pair", valid_pair, valid_pair_id, flipped)
  const [pair_balances] = useRecoilState(pairBalanceFamily(valid_pair_id))
  console.log("pair_balances", pair_balances)


  // fee in basis points
  function curveXtoY(balance_x, balance_y, dx, fee) {
    console.log("curveXtoY", balance_x, balance_y, dx, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dy = (fee_adjustor * balance_y * dx) / (adjustor * balance_x + fee_adjustor * dx)
    const swapping_fee = dx * fee / 10_000
    return [dy, swapping_fee]
  }

  function curveYtoX(balance_x, balance_y, dy, fee) {
    console.log("curveYtoX", balance_x, balance_y, dy, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dx = (fee_adjustor * balance_x * dy) / (adjustor * balance_y + fee_adjustor * dy)
    const swapping_fee = dy * fee / 10_000
    return [dx, swapping_fee]
  }

  function curveXtoYReverse(balance_x, balance_y, dy, fee) {
    console.log("curveXtoYReverse", balance_x, balance_y, dy, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dx = (balance_x * dy * adjustor) / ((balance_y - dy) * fee_adjustor)
    const swapping_fee = (balance_x * dy * fee) / ((balance_y - dy) * fee_adjustor)
    return [dx, swapping_fee]
  }

  function curveYtoXReverse(balance_x, balance_y, dx, fee) {
    console.log("curveYtoXReverse", balance_x, balance_y, dx, fee)
    const adjustor = 10_000  // TODO(psq): find a better name?
    const fee_adjustor = adjustor - fee
    const dy = (balance_y * dx * adjustor) / ((balance_x - dx) * fee_adjustor)
    const swapping_fee = (balance_y * dx * fee) / ((balance_x - dx) * fee_adjustor)
    return [dy, swapping_fee]
  }

  const flipTokens = () => {
    // TODO(psq): instead of resetting, flip should keep user input value, and calculate the other one
    // depdending on where input is, as if user had entered that value in the new location
    setValueX(value_y)
    setValueY(value_x)
    setFee(0)
    setAmountX(0)
    setAmountY(0)
  }

  const onChangeAmountX = (data) => {
    console.log("onChangeAmountX", data.target.value, flipped)
    setAmountX(data.target.value)
    if (!flipped) {
      const dx = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
      const [dy, swapping_fee] = curveXtoY((new BigNum(pair_balances.balance_x)).toNumber(), (new BigNum(pair_balances.balance_y)).toNumber(), dx * 10**token_x.decimals, 30)
      console.log("dy, swapping_fee", dy, swapping_fee)
      setAmountY((dy / 10**token_y.decimals).toFixed(6))
      setFee(swapping_fee / 10**token_x.decimals)
    } else {
      const dy = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
      const [dx, swapping_fee] = curveYtoX((new BigNum(pair_balances.balance_x)).toNumber(), (new BigNum(pair_balances.balance_y)).toNumber(), dy * 10**token_x.decimals, 30)
      console.log("dx, swapping_fee", dx, swapping_fee)
      setAmountY((dx / 10**token_y.decimals).toFixed(6))
      setFee(swapping_fee / 10**token_y.decimals)
    }
  }

  const onChangeAmountY = (data) => {
    console.log("onChangeAmountY", data.target.value, flipped)
    setAmountY(data.target.value)
    if (!flipped) {
    //   const dx = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
    //   const [dy, swapping_fee] = curveXtoY((new BigNum(token_balance_x)).toNumber(), (new BigNum(token_balance_y)).toNumber(), dx * 10**token_x.decimals, 30)
    //   console.log("dy, swapping_fee", dy, swapping_fee)
    //   setValueY(dy / 10**token_y.decimals)
    //   setFee(swapping_fee / 10**token_x.decimals)
    } else {
    //   const dy = data.target.value.length > 0 ? parseFloat(data.target.value) : 0
    //   const [dx, swapping_fee] = curveYtoX((new BigNum(token_balance_x)).toNumber(), (new BigNum(token_balance_y)).toNumber(), dy * 10**token_y.decimals, 30)
    //   console.log("dx, swapping_fee", dx, swapping_fee)
    //   setValueY(dx / 10**token_x.decimals)
    //   setFee(swapping_fee / 10**token_y.decimals)
    }
  }



  const connectStacksWallet = () => {
    console.log("connect")
    doOpenAuth()
  }

  // const onChangeX = (data) => {
  //   console.log("onChangeX", data.target.value)
  //   setTokenXId(data.target.value)
  // }

  const SelectorX = (props) => {
    const classes = useStyles()

    return (
      <Autocomplete
        id="selector-x"
        className="sp-form-section-token"
        options={ sorted_token_ids }
        autoHighlight
        getOptionLabel={(option_id) => tokens_by_ids[option_id].name}
        renderOption={(option_id) => (<TokenOption id={option_id}/>)}
        renderInput={(params) => {
          // console.log("renderInput", params)
          return (<React.Fragment>
            <Grid container style={{paddingLeft: '10px'}} className={classes.root} spacing={1} alignItems="flex-end">
              <Grid item>
                {token_x && token_x.metadata ? <img style={{marginBottom: '7px'}} width={'30px'} className="mr-05" src={token_x.metadata.vector}/> : null}
              </Grid>
              <Grid style={{width: '140px'}} item>
                <TextField
                  {...params}
                  InputProps={{ ...params.InputProps, disableUnderline: true, }}
                  inputProps={{
                    ...params.inputProps,
                    style: {color: '#333333', width: '5ch', fontWeight: 600, fontSize: '26px'},
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              </Grid>
            </Grid>

          </React.Fragment>
        )}}
        value={value_x}
        onChange={(event, newValue, kind) => {
          console.log("onChange - value_x", newValue, event, kind)
          setValueX(newValue)
          setAmountX(0)
          setAmountY(0)

          history.replace(`pairs#${newValue}$${value_y}`)

          // TODO(psq): set possible Ys

          // setValidPair(false)
          // setFlip(false)
          // for (let pair of pair_info) {
          //   console.log(pair.token_x_principal, pair.token_y_principal)
          //   if (pair.token_x_principal === value_x && pair.token_y_principal === value_y) {
          //     setValidPair(true)
          //     setFlip(false)
          //   } else if (pair.token_x_principal === value_y && pair.token_y_principal === value_x) {
          //     setValidPair(true)
          //     setFlip(true)
          //   }
          // }

        }}
        inputValue={input_value_x}
        onInputChange={(event, newInputValue, kind) => {
          console.log("onInputChange - value_x", newInputValue, event, kind)
          setInputValueX(newInputValue)
        }}
      />
    );
  }

  const SelectorY = (props) => {
    const classes = useStyles()

    return (
      <Autocomplete
        id="selector-y"
        className="sp-form-section-token"
        options={ sorted_token_ids }
        autoHighlight
        getOptionLabel={(option_id) => tokens_by_ids[option_id].name}
        renderOption={(option_id) => (<TokenOption id={option_id}/>)}
        renderInput={(params) => {
          // console.log("renderInput", params)
          return (<React.Fragment>
            <Grid container  style={{paddingLeft: '10px'}} className={classes.root} spacing={1} alignItems="flex-end">
              <Grid item>
                {token_y && token_y.metadata ? <img style={{marginBottom: '7px'}} width={'30px'} className="mr-05" src={token_y.metadata.vector}/> : null}
              </Grid>
              <Grid style={{width: '140px'}} item>
                <TextField
                  {...params}
                  InputProps={{ ...params.InputProps, disableUnderline: true, }}
                  inputProps={{
                    ...params.inputProps,
                    style: {color: '#333333', width: '5ch', fontWeight: 600, fontSize: '26px'},
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              </Grid>
            </Grid>

          </React.Fragment>
        )}}
        value={value_y}
        onChange={(event, newValue, kind) => {
          console.log("onChange - value_y", newValue, event, kind)
          setValueY(newValue)
          setAmountX(0)
          setAmountY(0)

          history.replace(`pairs#${value_x}$${newValue}`)

          // TODO(psq): set possible Xs

        }}
        inputValue={input_value_y}
        onInputChange={(event, newInputValue, kind) => {
          console.log("onInputChange - value_y", newInputValue, event, kind)
          setInputValueY(newInputValue)
        }}
      />
    );
  }

  const swapTokens = useCallback(async (token_x, token_y, dx, minimum_received, flip) => {
    const token_x_swap = flipped ? token_y : token_y
    const token_y_swap = flipped ? token_x : token_y
    console.log("swapTokens", token_x.name, token_y.name, dx * 10**token_x_swap.decimals, minimum_received * 10**token_x_swap, flip)

    const [token_x_addr, token_x_contract_name] = token_x.principal.split('.')
    const [token_y_addr, token_y_contract_name] = token_y.principal.split('.')

    const options = {
      network,
      contractAddress: process.env.REACT_APP_SWAPR_STX,
      contractName: process.env.REACT_APP_CONTRACT_NAME_SWAPR,
      functionName: flip ? 'swap-y-for-x' : 'swap-x-for-y',
      functionArgs: [
        contractPrincipalCV(token_x_addr, token_x_contract_name),
        contractPrincipalCV(token_y_addr, token_y_contract_name),
        uintCV(dx * 10**token_x_swap.decimals),
        uintCV(minimum_received * 10**token_y_swap.decimals),
      ],
      appDetails: {
        name: process.env.REACT_APP_NAME,
        icon: window.location.origin + '/swapr-square.png',
      },
      postConditionMode: PostConditionMode.Allow,  // TODO(psq): allow for now, there is no api to retrieve the token in sip-010!!!
      stxAddress: accountAddress,
      onFinish: data => {
        // TODO(psq): use a promise to return from await?
        // TODO(psq): this may get called multiple times, so only record once to display status
        // TODO(psq): display pending transaction status in a small toast near top left of screen?
        console.log('Stacks Transaction:', data.stacksTransaction);
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
      },
    };

    await doContractCall(options)  // this does not awaits anything, returns as soon as extenstion windows shows up
  })

  console.log("token_balance", token_balance_x, token_balance_y, token_balance_x / 10**token_x.decimals, token_balance_y / 10**token_y.decimals)
  const exchange_rate = pair_balances ?
   (flipped ?
     ((new BigNum(pair_balances.balance_x)).toNumber() / (new BigNum(pair_balances.balance_y)).toNumber()) * 10**(token_x.decimals - token_y.decimals)
     :
     ((new BigNum(pair_balances.balance_y)).toNumber() / (new BigNum(pair_balances.balance_x)).toNumber()) * 10**(token_x.decimals - token_y.decimals)
   )
   :
   0
  const price_impact = (1 - (parseFloat(amount_y) / (parseFloat(amount_x) * 0.997) / exchange_rate)) * 100
  const minimum_received = parseFloat(amount_y) * (1 - slippage)

  console.log("exchange_rate", exchange_rate, valid_pair_id)
  console.log("price_impact", price_impact)
  console.log("minimum_received", minimum_received)
// import material-ui autocomplete?  other option

  return (
    <div className="Pairs">
      {
      // <h1>Pairs</h1>
      // Count: {pairs.length}
      // <ul style={{paddingInlineStart: '10px'}}>
      //   {
      //     sorted_pairs.map(pair => {
      //       return <PairInfo key={pair.id} id={pair.id}/>
      //     })
      //   }
      // </ul>
      }
      {
      //   <p>stacks connection: {userData ? (userData.username || userData.identityAddress) : 'not connected'}</p>
      //   <p>value_x: {value_x}</p>
      //   <p>value_y: {value_y}</p>
      //   <p>token_balance_x: {token_balance_x}</p>
      //   <p>token_balance_y: {token_balance_y}</p>
      //   <p>fee: {fee}</p>
      //   <p>exchange_rate: {exchange_rate}</p>
      //   <p>price_impact: {price_impact}</p>
      //   <p>Price Impact: {isNaN(price_impact) ? null : (price_impact < 0.01 ? '< 0.01%' : `${price_impact.toFixed(2)}%`)}</p>
      //   <p>minimum_received: {minimum_received}</p>
      //   <p>valid_pair: {valid_pair.toString()}</p>
      //   <p>flipped: {flipped !== null ? flipped.toString() : 'n/a'}</p>
      }
      <p>flipped: {flipped !== null ? flipped.toString() : 'n/a'}</p>

      <div className="sp-form" id="swapForm" style={{display: 'block'}}>
        <div className="sp-form-tabs">
          <button className="sp-form-tab sp-form-tab--active">Swap</button>
          <button className="sp-form-tab" id="spPoolTab">Pool</button>
        </div>
        <div className="sp-form-settings">
          <button>
            <i className="icon icon-settings-white"></i>
          </button>
        </div>
        <div className="sp-form-section">
          {
          // <p>value_x: {JSON.stringify(value_x)}</p>
          // <p>input_value_x: {JSON.stringify(input_value_x)}</p>
          }
          <div className="sp-form-section-title">From</div>
          <div className="sp-form-section-value">
            <TextField
              id="amount-x"
              className="sp-form-section-value-num"
              type="number"
              placeholder="0.000000"
              InputProps={{
                disableUnderline: true,
                style: {color: '#333333', fontWeight: 600, fontSize: '26px'},
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={amount_x}
              onChange={e=> onChangeAmountX(e)}
            />
            <SelectorX/>
          </div>
        </div>
        <div className="sp-form-section-arrow">
          <i className="icon icon-swap"></i>
        </div>
        <div className="sp-form-section">
          <div className="sp-form-section-title">To</div>
          <div className="sp-form-section-value">
          <TextField
            id="amount-y"
            className="sp-form-section-value-num"
            type="number"
            placeholder="0.000000"
            disabled={true}
            InputProps={{
              disableUnderline: true,
              style: {color: '#333333', fontWeight: 600, fontSize: '26px'},
            }}
            InputLabelProps={{
              shrink: true,
            }}
            value={amount_y}
            onChange={e=> onChangeAmountY(e)}
          />
            <SelectorY/>
          </div>
        </div>
        {
          (() => {
            if (valid_pair && amount_x.length > 0) {
              return (
                <Box>
                  <Tooltip title={<p style={{marginBlockEnd: '0px'}}>Based on the slippage, you'll receive at least this amount, or the transaction will abort</p>}>
                    <Box className="f-w5 fs-15 ml-25">
                      Minimum Received: {minimum_received.toFixed(4)} {token_y.name}
                    </Box>
                  </Tooltip>
                  <Tooltip title={<p style={{marginBlockEnd: '0px'}}>Based on available liquidity, how much will the transaction affect the price1</p>}>
                    <Box style={price_impact > 5 ? {color: 'red'} : null} className="f-w5 fs-15 ml-25">
                      Price Impact: {isNaN(price_impact) ? null : (price_impact < 0.01 ? '< 0.01%' : `${price_impact.toFixed(2)}%`)}
                    </Box>
                  </Tooltip>
                  <Tooltip title={<p style={{marginBlockEnd: '0px'}}>The fee received by Liquidity Providers as an incentive</p>}>
                    <Box className="f-w5 fs-15 ml-25">
                      LP fee: {fee.toFixed(4)} {token_x.name}
                    </Box>
                  </Tooltip>
                  <StyledButton className="sp-form-action mt-20 mb-20 ml-25" onClick={() => { swapTokens(token_x, token_y, amount_x, minimum_received, flipped) }}>
                    Swap
                  </StyledButton>

                </Box>
              )
            } else if (!valid_pair) {
              return (
                <Box className="f-w5 fs-15 ml-25">
                  No pair available to proceeed with a swap
                </Box>
              )
            } else {
              return null
          }})()
        }
        {
          !userData ?
            (<StyledButton className="sp-form-action ml-25" onClick={() => {connectStacksWallet()}}>
              Connect Stacks Wallet
            </StyledButton>)
          :
            null
        }

      </div>
      <Box bgcolor="black" color="#c151ff" p={2} position="absolute" top={110} right={30} zIndex="tooltip">
        <Box>{(userData.username || userData.identityAddress)}</Box>
        <Box>{accountAddress}</Box>
        <StyledButton className="mt-10" variant="outlined" color="secondary" onClick={ () => { userData ? signOut() : doOpenAuth() } }>{userData ? 'Disconnect wallet' : 'Connect wallet'}</StyledButton>
      </Box>
    </div>
  )
}