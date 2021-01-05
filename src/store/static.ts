import store from './index'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { TRANSACTION_DETAIL_LINK, tokens } from '@/libs/web3'

@Module({
  name: 'static',
  dynamic: true,
  store,
  namespaced: false
})
export class Static extends VuexModule {
  get currencies() {
    return tokens.slice(0, 5)
  }
  get transactionDetailLink() {
    return (hash: string) => `${TRANSACTION_DETAIL_LINK}${hash}`
  }
}

const module = getModule(Static)

export default module