import store from './index'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import web3, { ethereum, pledge, ple } from '@/libs/web3'
import router from '@/router/index'
import borrow from './borrow'
import dashboard from './dashboard'
import deposit from './deposit'
import global from './global'

@Module({
  name: 'wallet',
  dynamic: true,
  store,
  namespaced: true
})
export class Wallet extends VuexModule {
  address = ''
  chainId = 0
  blockNumber = 0
  get connected() {
    return !!this.address
  }
  get network() {
    const map = {
      [1]: 'Ethereum Main Network (MainNet)',
      [3]: 'Ropsten Test Network',
      [4]: 'Rinkeby Test Network',
      [5]: 'Goerli Test Network',
      [42]: 'Kovan Test Network'
    } as any
    if (this.chainId === 0) return 'unknow'
    return map[this.chainId]
  }
  @Action({
    rawError: true
  })
  async init() {
    try {
      if (!ethereum) return
      const address = ethereum.selectedAddress
      if (!address) return
      const chainId = parseInt(ethereum.chainId, 16)
      this.setWallet({ address, chainId })
      this.fetchBlockNumber()
    } catch (err) {
      console.error(err)
    }
  }
  @Action({
    rawError: true
  })
  async fetchBlockNumber() {
    const blockNumber = await web3.eth.getBlockNumber()
    this.setWallet({ blockNumber })
  }
  @Mutation
  setWallet(options: { address?: string, chainId?: number, blockNumber?: number }) {
    this.address = options.address || this.address
    this.chainId = options.chainId || this.chainId
    this.blockNumber = options.blockNumber || this.blockNumber
  }
  @Mutation
  disconnect() {
    this.address = ''
    router.push({
      name: 'connect',
      params: {
        page: router.currentRoute.name as string
      }
    })
  }
}

const module = getModule(Wallet)
setTimeout(() => {
  const init = () => {
    module.init()
    dashboard.init()
    borrow.init()
    deposit.init()
  }
  init()
  ethereum?.on('accountsChanged', ([address]: string[]) => {
    console.log('account changed', address)
    init()
    !address && module.disconnect()
  })
  ethereum?.on('chainChanged', init)
}, 0)

setInterval(() => module.fetchBlockNumber(),3000)

export default module