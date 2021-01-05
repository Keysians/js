import Web3 from 'web3'
import pleApi from './ple.json'
import poolApi from './pool.json'
import pledgeApi from './pledge.json'
import _tokens from '@/assets/tokens_dev.json'
import { POOL_CONTRACT, WEB3_ADDRESS, PLE_CONTRACT, PLEDGE_CONTRACT } from '@/const'
import Offer from './offer'
import offerApi from './offer.json'
import wallet from '@/store/wallet'
import erc20 from '@/libs/erc20.json'
import { AbiItem } from 'web3-utils'
import { clone, flatten } from 'lodash'

const provider = new Web3.providers.WebsocketProvider(WEB3_ADDRESS, {
  reconnect: {
    auto: true,
    delay: 500,
    maxAttempts: 9999999,
  }
})
const web3 = new Web3(provider)
// @ts-ignore
window.web3 = web3

export const ple = new web3.eth.Contract(pleApi as any, PLE_CONTRACT)
// @ts-ignore
window.ple = ple

export const pool = new web3.eth.Contract(poolApi as any, POOL_CONTRACT)
// @ts-ignore
window.pool = pool

export const pledge = new web3.eth.Contract(pledgeApi as any, PLEDGE_CONTRACT)
// @ts-ignore
window.pledge = pledge

export default web3
// @ts-ignore
export const ethereum = window.ethereum

export const TRANSACTION_DETAIL_LINK =
  process.env.NODE_ENV === 'development' ?
    'https://rinkeby.etherscan.io/tx/'
    : 'https://etherscan.io/tx/'


export const tokens: {
  id: number
  name: string
  symbol: string
  slug: string
  balanceInWallet: string
  balanceInPledge: string
  platform: {
    id: number
    name: string
    symbol: string
    slug: string
    token_address: string
  }
}[] = _tokens.filter((item: any) => {
  return item.platform ? item.platform.token_address.startsWith('0x') : false
}
).map((item: any) => {
  item.balanceInWallet = ''
  item.balanceInPledge = ''
  if (item.symbol === 'PLE') {
    item.platform['token_address'] = ple.options.address
  }
  return item
}) as any
export type token = typeof tokens[0]

export function fetchOffers(addresses: string[], resolve?: (offers: offer[]) => void) {
  const list: Offer[] = addresses.slice().reverse().map(address => new Offer(address))
  Promise.all(flatten(list.map(obj => obj.queues))).then(() => resolve && resolve(list))
  return list
}

export type offer = ReturnType<typeof fetchOffers>[0]
