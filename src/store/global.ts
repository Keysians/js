import store from './index'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'

@Module({
  name: 'global',
  dynamic: true,
  store,
  namespaced: true
})
export class Global extends VuexModule {
  loading = false
  @Mutation
  openLoading() {
    this.loading = true
  }
  @Mutation
  closeLoading() {
    this.loading = false
  }
}

const module = getModule(Global)

export default module