import store from './index'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import { offer, fetchOffers, pledge } from '@/libs/web3'
import { uniqBy, debounce } from 'lodash'
import dashboard from '@/store/dashboard'

@Module({
  name: 'deposit',
  dynamic: true,
  store,
  namespaced: true
})
export class Deposit extends VuexModule {
  offers: offer[] = []
  @Mutation
  setOffers(arr: offer[]) {
    this.offers = uniqBy(arr, 'contractAddress')
  }
  @Action({
    rawError: true
  })
  async init() {
    const length = await pledge.methods.getOfferLength().call()
    const states = [0, 1, 2]
    states.forEach(state => {
      pledge.methods
        .getOfferByState(0, length, state)
        .call()
        .then((addresses: string[]) => {
          const offers = fetchOffers(addresses, (offers) => {
            const newList = this.offers.slice()
            offers.forEach(offer => {
              const exist = this.offers.findIndex(item => item.contractAddress === offer.contractAddress)
              if (exist === -1) {
                newList.unshift(offer)
                return
              }
              newList.splice(exist, 1, offer)
            })
            this.setOffers(newList)
          })
          this.setOffers([...this.offers, ...offers])
        })
    })
  }
}

const module = getModule(Deposit)
pledge.events.OfferCreated({}, debounce((err: any, event: any) => {
  console.log('Offer created: ', err, event)
  module.init()
  dashboard.init()
}, 1000))

export default module