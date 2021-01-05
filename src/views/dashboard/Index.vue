<template>
  <section>
    <v-row class="align-center">
      <v-col cols="5">
        <v-tabs color="black" background-color="background" class="mb-5" v-model="tab">
          <v-tab
            v-for="(tab,i) in tabs"
            :key="i"
            value="tab"
            class="text-capitalize text-h6"
          >{{tab}}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <div class="mr-5 text-number">Latest block: {{wallet.blockNumber}}</div>
    </v-row>
    <v-row no-gutters class="pa-2">
      <v-col v-for="(item,i) in headers" :key="i" :cols="item.cols">
        <div
          class="d-flex align-center grey-dark--text body-2 font-weight-bold"
          :class="item.class"
          style="height:40px;"
        >{{item.name}}</div>
      </v-col>
    </v-row>
    <div class="t-table pa-2">
      <v-row class="t-row py-4" no-gutters v-for="(item,i) in list" :key="i">
        <v-col class="d-flex justify-start align-center black--text">
          <img
            class="mr-2 ml-5"
            :src="require(`@/assets/tokens/${item.tokenIn.id}.png`)"
            width="32px"
            height="32px"
          />
          {{item.tokenIn.name}}
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <span
            class="font-weight-bold mr-1 black--text text-number"
          >{{item.amountOut || 0 | currency }}</span>
          <span class="grey-dark--text caption font-weight-bold mt-1">USDT</span>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <span
            class="font-weight-bold mr-1 black--text text-number"
          >{{item.amountIn || 0 | currency }}</span>
          <span class="grey-dark--text caption font-weight-bold mt-1">{{item.tokenIn.symbol}}</span>
        </v-col>
        <v-col cols="3" class="d-flex flex-column justify-center align-center">
          <div class="d-flex justify-center align-center">
            <span
              class="font-weight-bold mr-1 black--text text-number"
            >{{item.expire === '0' ? '0' : (item.expire - item.duration) | decimal }}</span>
            <span
              class="secondary--text font-weight-bold grey-dark--text text-number"
            >/{{item.expire | decimal}}</span>
          </div>
          <div
            v-if="(item.expire-wallet.blockNumber) > 0"
            class="caption d-flex justify-center align-center grey-dark--text text-center text-number"
          >{{item.expire-wallet.blockNumber}} block(s) ≈ {{((item.expire-wallet.blockNumber) / 270 / 24).toFixed(2)}}day(s) before ending</div>
        </v-col>
        <v-col class="d-flex flex-column justify-center align-center">
          <div class="d-flex justify-center align-center">
            <span
              class="font-weight-bold mr-1 black--text text-number"
            >{{item.interests | decimal | currency }}</span>
            <span class="grey-dark--text caption font-weight-bold">/USDT</span>
          </div>
          <div class="caption d-flex justify-center align-center grey-dark--text">
            <span class="secondary--text mr-1 text-number">{{item | apy | decimal | currency}}%</span>
            <span>/{{tab===0?'APY':'APR'}}</span>
          </div>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <span class="font-weight-bold mr-1 black--text text-number">
            <template v-if="tab===0">{{parseFloat(item.interests) * 0.1 | decimal | currency }}</template>
            <template v-else>{{parseFloat(item.amountOut) * 0.01 | decimal | currency }}</template>
            USDT
          </span>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <span class="font-weight-bold mr-1 black--text text-capitalize">{{item.state2}}</span>
        </v-col>
        <v-col cols="1" class="d-flex justify-end align-center flex-wrap">
          <template v-if="tab===1">
            <v-btn
              v-if="item.state==='Taken'"
              dark
              class="text-capitalize font-weight-bold mr-5 my-1"
              color="button"
              @click="repay(item)"
            >repay</v-btn>
            <v-btn
              v-if="item.state==='Paidback'"
              dark
              class="text-capitalize font-weight-bold mr-5 my-1"
              color="button"
              @click="close(item)"
            >Close</v-btn>
            <v-btn
              v-if="item.state==='Opened'"
              dark
              class="text-capitalize font-weight-bold mr-5 my-1"
              color="button"
              @click="cancel(item)"
            >Cancel</v-btn>
          </template>
        </v-col>
      </v-row>
      <no-data v-if="!list.length"></no-data>
    </div>

    <custom-pay>
      <div class="mb-1 black--text">
        <span class="mr-1">Wallet:</span>
        <span
          class="secondary--text font-weight-bold mr-1 text-number"
        >{{slot.balance | decimal(5) | currency}}</span>
        <span>USDT</span>
      </div>
      <div class="mb-1 black--text">
        <span class="mr-1">You need to repay：</span>
        <span class="secondary--text font-weight-bold mr-1 text-number">{{slot.amountOut}}</span>
        <span>USDT</span>
      </div>
    </custom-pay>
    <custom-transaction>
      <template v-if="custom === 'close'">
        You need to settle the order for asset allocation and distribution.
        If you settle the order now, the KEN transaction mining rewards will end in this block.
        You can also choose to settle when reaching the ending block of the order.
        You will receive your collateral and KEN rewards only if you settle the order.
      </template>
      <template v-if="custom === 'cancel'">Confirm cancel the order</template>
    </custom-transaction>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import sta from '@/store/static'
import CustomPay from '@/components/dialog/CustomPay.vue'
import dashboard from '@/store/dashboard'
import deposit from '@/store/deposit'
import wallet from '@/store/wallet'
import { offer } from '@/libs/web3'
import borrow from '@/store/borrow'
import offerApi from '@/libs/offer.json'
import CustomTransaction from '@/components/dialog/CustomTransaction.vue'

@Component({
  components: {
    CustomPay,
    CustomTransaction
  }
})
export default class Dashboard extends Vue {
  currencies = sta.currencies
  headers = [
    { name: 'Asset', cols: undefined, class: 'justify-start pl-10' },
    { name: 'Amount', cols: undefined, class: 'justify-center' },
    { name: 'Collateral', cols: undefined, class: 'justify-center' },
    { name: 'Start and end block', cols: 3, class: 'justify-center' },
    { name: 'Interest', cols: undefined, class: 'justify-center' },
    { name: 'Transaction fee', cols: undefined, class: 'justify-center' },
    { name: 'Order status', cols: undefined, class: 'justify-center' },
    { name: '', cols: 1 }
  ]
  tabs = ['My lending', 'My borrowing']
  tab = 0
  slot = {
    confirmValue: '',
    amountOut: '',
    balance: '',
    symbol: ''
  }
  wallet = wallet
  custom = ''
  get dashboard() {
    return dashboard
  }
  get list() {
    if (this.tab === 0) {
      return this.dashboard.deposits
    } else {
      return this.dashboard.borrowings
    }
  }
  async repay(item: offer) {
    const dashboard = this
    this.slot.amountOut = item.amountOut
    this.slot.confirmValue = item.amountOut
    const token = borrow.tokens.find(
      token => token.symbol === item.tokenOut.symbol
    )
    if (!token) return
    this.slot.balance = token.balanceInWallet as any
    this.slot.symbol = token.symbol as any
    await CustomPay.open({
      icon: item.tokenIn.id,
      title: item.tokenIn.symbol,
      address: item.contractAddress,
      get confirm() {
        return dashboard.slot.confirmValue
      },
      approveAddress: item.tokenOut.platform.token_address,
      abi: offerApi,
      method: 'payback',
      params: []
    })
  }
  async close(item: offer) {
    this.custom = 'close'
    await CustomTransaction.open({
      title: 'Close',
      abi: offerApi as any,
      to: item.contractAddress,
      method: 'close'
    })
    deposit.init()
  }
  async cancel(item: offer) {
    this.custom = 'cancel'
    await CustomTransaction.open({
      title: 'Cancel',
      abi: offerApi as any,
      to: item.contractAddress,
      method: 'cancel'
    })
    deposit.init()
  }
}
</script>

<style lang="less" scoped>
</style>
