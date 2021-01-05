import store from './index'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import wallet from '@/store/wallet'
import web3, { tokens, token } from '@/libs/web3.ts'
import erc20 from '@/libs/erc20.json'

@Module({
  name: 'borrow',
  dynamic: true,
  store,
  namespaced: true
})
export class Borrow extends VuexModule {
  tokens: token[] = tokens.slice(0, 20)
  @Mutation
  setTokens(arr: token[]) {
    this.tokens = arr
  }
  @Action({
    rawError: true
  })
  async init() {
    let arr: token[] = []
    for (const item of tokens.slice(0, 20)) {
      item.balanceInWallet = '0'
      item.balanceInPledge = '0'
      if (!wallet.connected) return
      const contract = new web3.eth.Contract(
        erc20 as any,
        item.platform.token_address
      )
      try {
        contract.methods
          .balanceOf(wallet.address)
          .call()
          .then((balance: string) => {
            item.balanceInWallet = web3.utils.fromWei(balance)
          })
        arr.push(item)
      } catch (err) {
        console.warn(item.name, 'balanceOf', err.message)
      }
    }
    arr = tokens.sort(
      (a: any, b: any) => b.balanceInWallet - a.balanceInWallet
    )
    this.setTokens(arr)
  }
}

const module = getModule(Borrow)

export default module