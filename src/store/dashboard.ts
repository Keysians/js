import store from './index'
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import web3, { offer, fetchOffers, ple, tokens, pledge, pool } from '@/libs/web3'
import global from './global'
import erc20 from '@/libs/erc20.json'
import wallet from './wallet'
import BigNumber from 'bignumber.js'
import { POOL_CONTRACT } from '@/const'

@Module({
  name: 'dashboard',
  dynamic: true,
  store,
  namespaced: true
})
export class Dashboard extends VuexModule {
  borrowings: offer[] = []
  deposits: offer[] = []
  pleBalance = '0'
  pleEarned = '0'
  usdtBalance = '0'
  usdtPending = '0'
  usdtEarned = '0'
  marketSize = '0'
  totalStake = '0'
  pieceIncome = '0'
  unlockAmount = '0'
  mintCumulation = '0'
  distributeAmount = '0'
  @Mutation
  setBorrowings(arr: offer[]) {
    this.borrowings = arr
  }
  @Mutation
  setDeposits(arr: offer[]) {
    this.deposits = arr
  }
  @Mutation
  set([key, val]: any) {
    // @ts-ignore
    this[key] = val
  }
  @Action({
    rawError: true
  })
  async init() {
    const setWei = (key: string) => (wei: string) => this.set([key, web3.utils.fromWei(wei)])
    ple.methods.mintCumulation().call().then(setWei('mintCumulation')).catch(console.error)
    Promise.all([ple.methods.totalSupply().call(), ple.methods.maxSupply().call()]).then(([totalSupply, maxSupply]) => {
      const distributeAmount = parseFloat(maxSupply) - parseFloat(totalSupply)
      this.set(['distributeAmount', web3.utils.fromWei(BigInt(distributeAmount).toString())])
    })
      .catch(console.error)
    const erc = new web3.eth.Contract(erc20 as any, tokens.find(item => item.symbol === 'USDT')?.platform.token_address)
    erc.methods.balanceOf(POOL_CONTRACT).call().then(setWei('usdtPending')).catch(console.error)
    pledge.methods.marketSize().call().then(setWei('marketSize')).catch(console.error)
    pool.methods.totalStake().call().then(setWei('totalStake')).catch(console.error)

    if (!wallet.address) return

    ple.methods.balanceOf(wallet.address).call().then(setWei('pleBalance')).catch(console.error)
    ple.methods.take().call({ from: wallet.address }).then(setWei('pleEarned')).catch(console.error)
    erc.methods.balanceOf(wallet.address).call().then(setWei('usdtBalance')).catch(console.error)
    pool.methods.queryShare().call({ from: wallet.address }).then((obj: any) => this.set(['usdtEarned', web3.utils.fromWei(obj.userShare)])).catch(console.error)
    pool.methods.queryUnlockAmount().call({ from: wallet.address }).then((obj: any) => this.set(['unlockAmount', web3.utils.fromWei(obj.unlockAmount)])).catch(console.error)
    const getUserOffers = pledge.methods
      .getUserOffers()
      .call({ from: wallet.address })
      .then(fetchOffers)
      .then(this.setBorrowings)
      .catch(console.error)

    const getOfferLength = pledge.methods.getOfferLength().call()
      .then((length: number) => {
        return pledge.methods
          .getOfferByTaker(0, length, wallet.address)
          .call()
      })
      .then(fetchOffers)
      .then(this.setDeposits)
      .catch(console.error)

    Promise.all([getUserOffers, getOfferLength])
      .then(async () => {
        const offers = [...this.deposits, ...this.borrowings]
        if (!offers.length) return
        try {
          const amountPerBlock = await ple.methods.amountPerBlock().call() || 0
          let productivity = 0
          let platform = 0
          for (const offer of offers) {
            const currentProductivity = await ple.methods.getProductivity(offer.contractAddress).call()
            productivity += currentProductivity[0] / 2
            platform = currentProductivity[1]
          }
          if (productivity === 0 || platform === 0 || parseFloat(amountPerBlock) === 0) return
          // @ts-ignore
          const pieceIncome = (parseInt(productivity / platform * amountPerBlock)).toString()
          this.set(['pieceIncome', web3.utils.fromWei(pieceIncome)])
        } catch (err) {
          console.error(err)
        }
      })
      .catch(console.error)
  }
}

const module = getModule(Dashboard)

export default module