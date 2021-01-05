import web3, { tokens, token } from './web3'
import offerApi from './offer.json'
import { } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { apy } from '@/filters'
import dashbaord from '@/store/dashboard'
import { debounce } from 'lodash'

export default class Offer {
  contractAddress = ''
  owner = ''
  pledger = ''
  amountIn = ''
  amountOut = ''
  expire = ''
  duration = ''
  taker = ''
  interests = ''
  state = ''
  state2 = ''
  apy = ''
  tokenInAddress = ''
  tokenIn = Object.assign({}, tokens[0], {
    name: '',
    id: 10001
  })
  tokenOutAddress = ''
  tokenOut = Object.assign({}, tokens[0], {
    name: '',
    id: 10001
  })
  contract!: Contract
  queues: any[] = []
  loaded = false
  constructor(address: string) {
    this.contractAddress = address
    const contract = this.contract = new web3.eth.Contract(offerApi as any, address)
    const owner = contract.methods.owner().call().then((owner: string) => this.owner = owner).catch(console.error)
    const pledger = contract.methods.pledger().call().then((pledger: string) => this.pledger = pledger).catch(console.error)
    const mountIn = contract.methods.amountIn().call().then((amount: string) => {
      this.amountIn = web3.utils.fromWei(amount)
    }).catch(console.error)
    const amountOut = contract.methods.amountOut().call()
    amountOut.then((amount: string) => {
      this.amountOut = web3.utils.fromWei(amount)
    }).catch(console.error)
    contract.methods.expire().call().then((expire: string) => {
      this.expire = expire
    }).catch(console.error)
    const duration = contract.methods.duration().call()
    duration.then((duration: string) => {
      this.duration = duration
    }).catch(console.error)
    const taker = contract.methods.taker().call().then((taker: string) => {
      this.taker = taker
    }).catch(console.error)
    const interests = contract.methods.interests().call()
    interests.then((interests: string) => {
      this.interests = web3.utils.fromWei(interests)
    }).catch(console.error)
    const updateState = (state: string) => {
      this.state = state
      switch (state) {
        case 'Created': return this.state2 = 'Opened'
        case 'Opened': return this.state2 = 'Opened'
        case 'Taken': return this.state2 = 'Ongoing'
        case 'Paidback': return this.state2 = 'Closed alredy'
        case 'Expired': return this.state2 = 'To settle'
        case 'Closed': return this.state2 = 'Closed alredy'
        default: return this.state2 = ''
      }
    }
    const getState = contract.methods.getState().call().then(updateState)
    Promise.all([interests, duration, amountOut]).then(() => {
      this.apy = apy(this)
    }).catch(console.error)

    const tokenIn = contract.methods.tokenIn().call().then((address: string) => {
      this.tokenInAddress = address
      this.tokenIn = tokens.find(
        item => item.platform.token_address === address
      ) as token
    }).catch(console.error)
    const tokenOut = contract.methods.tokenOut().call().then((address: string) => {
      this.tokenOutAddress = address
      this.tokenOut = tokens.find(
        item => item.platform.token_address === address
      ) as token
    }).catch(console.error)
    this.queues.push(owner, pledger, mountIn, amountOut, duration, taker, interests, getState, tokenIn, tokenOut)
    Promise.all(this.queues).then(() => {
      this.loaded = true
      contract.events.StateChange({
        filter: {
        },
      }).on('data', debounce((event: any) => {
        const { _curr: newState } = event
        console.log('state change:', event)
        updateState(newState)
        dashbaord.init()
      }, 1000))
    }).catch(console.error)
  }
}