<script lang="tsx">
import Component from 'vue-class-component'
import wallet from '@/store/wallet'
import borrow from '@/store/borrow'
import Deposit from '@/views/deposit/Index.vue'
import { offer } from '@/libs/web3'
import deposit from '@/store/deposit'
import CustomTransaction from '@/components/dialog/CustomTransaction.vue'
import offerApi from '@/libs/offer.json'

@Component
export default class Settlement extends Deposit {
  //@ts-ignore
  get page() {
    const ctx = this
    return {
      currencies: null,
      dTitle: 'Orders to settle',
      description:
        'Borrower of orders below fails to repay for his loan, thus anyone who settles the order will get the KEN mining reward and the order is then closed.',
      filter: (offer: offer): boolean =>
        offer.state === 'Taken' &&
        wallet.blockNumber > parseFloat(offer.expire),
      actions: [
        {
          label: 'Settle now',
          async click(item: offer) {
            ctx.slot.amountOut = item.amountOut
            ctx.slot.amountIn = item.amountIn
            ctx.slot.interests = item.interests
            ctx.slot.apy = item.apy
            ctx.slot.duration = item.duration
            const token = borrow.tokens.find(
              token => token.symbol === item.tokenOut.symbol
            )
            if (!token) return
            ctx.slot.tokenIn = item.tokenIn
            ctx.slot.tokenOut = item.tokenOut
            await CustomTransaction.open({
              title: 'Settlement',
              abi: offerApi as any,
              to: item.contractAddress,
              method: 'close'
            })
            deposit.init()
          }
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>