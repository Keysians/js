<template>
  <section>
    <v-row no-gutters class="mb-2">
      <div class="font-weight-bold text-h6">Asset can be used as collateral</div>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-text-field
          dense
          outlined
          rounded
          hide-details
          prepend-inner-icon="search"
          style="transform:scale(0.75);"
          v-model="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <borrow-table @mortgage="mortgage" @borrow="borrow" :list="tokens" />
    <collateral />
    <custom-pay>
      <div class="mb-1 font-weight-bold d-flex">
        <span class="mr-5 black--text">Can be used as colateral</span>
        <v-spacer></v-spacer>
        <span class="black--text mr-1 text-number">{{slot.balanceInWallet | decimal | currency}}</span>
        <span class="black--text">{{slot.symbol}}</span>
      </div>
      <number-input
        v-model="slot.mortgage"
        :disabled="slot.loading"
        placeholder="0"
        required
        :rules="[v=>!!v]"
        class="mt-5 text-number"
        outlined
        hide-details
        dense
      >
        <template #append>
          <span class="ma-1">{{slot.symbol}}</span>
        </template>
      </number-input>
      <v-row class="my-5" no-gutters>
        <v-col v-for="(item,i) in [100,75,50,25]" :key="i" :class="{'ml-1':i!==0,'mr-1':i!==3}">
          <v-btn
            block
            small
            color="background"
            class="grey-dark--text"
            dark
            @click="slot.mortgage = (slot.balanceInWallet * item /100).toString()"
          >{{item}}%</v-btn>
        </v-col>
      </v-row>
      <div class="mb-1 font-weight-bold black--text">Borrow amount</div>
      <number-input
        v-model="slot.amount"
        :disabled="slot.loading"
        required
        :rules="[v=>!!v]"
        placeholder="0"
        class="mt-5 text-number"
        outlined
        hide-details
        dense
      >
        <template #append>
          <span class="ma-1">USDT</span>
        </template>
      </number-input>
      <div class="font-weight-bold mt-5 mb-2 black--text">Borrow order time length</div>
      <div
        class="mb-2 black--text"
      >(The exact time will be decided by block height. You can borrow for at least 6500 blocks, which is 24 hours)</div>

      <v-layout align-center>
        <v-flex>
          <number-input
            :value="slot.blocks"
            @input="slot.inputBlocks($event)"
            :disabled="slot.loading"
            required
            :rules="[v=>!!v]"
            placeholder="0"
            dense
            outlined
            hide-details
            class="text-number"
            :min="6500"
          >
            <template #append>
              <span class="ma-1">Block</span>
            </template>
          </number-input>
        </v-flex>
        <v-flex xs2 shrink class="text-center text-h5">≈</v-flex>
        <v-flex>
          <number-input
            :value="slot.days"
            @input="slot.inputDays(($event))"
            :disabled="slot.loading"
            required
            :rules="[v=>!!v]"
            placeholder="0"
            dense
            outlined
            hide-details
            class="text-number"
            :min="1"
          >
            <template #append>
              <span class="ma-1">Day</span>
            </template>
          </number-input>
        </v-flex>
      </v-layout>
      <v-row class="mt-5 mb-2" no-gutters>
        <v-col v-for="(item,i) in [7,15,30,60]" :key="i" :class="{'ml-1':i!==0,'mr-1':i!==3}">
          <v-btn
            block
            small
            color="background"
            class="grey-dark--text"
            dark
            @click="slot.inputDays( item.toString()) "
          >{{item}}Days</v-btn>
        </v-col>
      </v-row>
      <div class="pl-1 desc--text">
        1 day around 6500 Blocks
        <!-- <span class="secondary--text mr-1">{{slot.days || 7}} days</span>
        <span>around</span>
        <span class="secondary--text ml-1">{{slot.blocks}} Blocks</span>-->
      </div>
      <div
        class="font-weight-bold black--text mb-2 mt-5"
      >APR and interest for this order(Interest will be deducted before you received USDT)</div>
      <v-layout align-center>
        <v-flex>
          <number-input
            :value="slot.interest"
            @input="slot.inputInterest($event)"
            :disabled="slot.loading"
            required
            :rules="[v=>!!v]"
            placeholder="0"
            dense
            outlined
            hide-details
            class="text-number"
          >
            <template #append>
              <span class="ma-1">%</span>
            </template>
          </number-input>
        </v-flex>
        <v-flex xs2 shrink class="text-center text-h5">≈</v-flex>
        <v-flex>
          <number-input
            :value="slot.fee"
            @input="slot.inputFee(($event))"
            :disabled="slot.loading"
            required
            :rules="[v=>!!v]"
            placeholder="0"
            dense
            outlined
            hide-details
            class="text-number"
          >
            <template #append>
              <span class="ma-1">USDT</span>
            </template>
          </number-input>
        </v-flex>
      </v-layout>
      <v-divider class="my-5"></v-divider>
      <div class="mb-2">Notes:</div>
      <p
        class="desc--text caption"
      >1. 1% of the borrow amount(USDT) is transaction fee that the borrower needs to pay to the platform.</p>
      <p
        class="desc--text caption"
      >2. If borrower fails to repay after order closing, this order will be settled and you are able to dispose of the collaterals.</p>
      <p
        class="desc--text cap"
      >3. The interest you choose to pay for remains the same, even if you choose to repay in advance.</p>
    </custom-pay>
  </section>
</template>

<script lang="tsx">
import Vue from 'vue'
import Component from 'vue-class-component'
import Collateral from '@/components/dialog/Collateral.vue'
import wallet from '@/store/wallet'
import borrow from '@/store/borrow'
import sta from '@/store/static'
import CustomPay from '@/components/dialog/CustomPay.vue'
import web3, { pledge, tokens } from '@/libs/web3'
import { currency, decimal } from '@/filters'
import { Watch } from 'vue-property-decorator'

export const BorrowTable = Vue.component('borrow-table', {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    const list = this.list
    return (
      <div class="t-table pa-2">
        <v-row class="ma-0 mb-5">
          <v-col
            cols="5"
            class="d-flex justify-start align-center pl-10 grey-dark--text body-2 font-weight-bold text-center"
            style="height:30px;"
          >
            Amount
          </v-col>
          <v-col
            cols="5"
            class="d-flex justify-start align-center grey-dark--text body-2 font-weight-bold"
            style="height:30px;"
          >
            <div style="width:150px;text-align:center;"> Wallet</div>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        {list.map((item: any, i) => {
          return (
            <v-row class="t-row" key={i}>
              <v-col
                cols="5"
                class="caption black--text d-flex align-center pl-6"
              >
                <img
                  class="mr-2"
                  width="32px"
                  height="32px"
                  src={require(`@/assets/tokens/${item.id}.png`)}
                />
                {item.name}
              </v-col>
              <v-col cols="5" class="d-flex justify-start align-center">
                <div style="width:150px;text-align:center;">
                  <span class="mr-1 font-weight-bold black--text text-number">
                    {(() => {
                      if (item.balanceInWallet === -1) {
                        return (
                          <v-progress-circular
                            size="12"
                            width="1"
                            indeterminate
                          ></v-progress-circular>
                        )
                      } else {
                        return currency(decimal(item.balanceInWallet, 5))
                      }
                    })()}
                  </span>
                  <span class="grey-dark--text caption font-weight-bold">
                    {item.symbol}
                  </span>
                </div>
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <v-btn
                  min-width="130px"
                  onclick={() => this.$emit('borrow', item)}
                  class="text-capitalize px-5 font-weight-bold mr-3"
                  color="button"
                  dark={!(item.symbol === 'USDT' || !wallet.connected)}
                  disabled={item.symbol === 'USDT' || !wallet.connected}
                >
                  Borrow USDT
                </v-btn>
              </v-col>
            </v-row>
          )
        })}
      </div>
    )
  }
})

@Component({
  components: {
    BorrowTable,
    Collateral,
    CustomPay
  }
})
export default class Borrow extends Vue {
  search = ''
  slot = {
    balanceInWallet: '',
    symbol: '',
    mortgage: '',
    loading: false,
    percent: 0,
    amount: '',
    blocks: '',
    days: '',
    interest: '',
    fee: '',
    inputInterest(v: string) {
      this.interest = v
      if (!this.amount || !this.days) return
      const amount = parseFloat(this.amount)
      const days = parseFloat(this.days)
      const interest = parseFloat(this.interest)
      const fee = (((interest / 100) * amount) / 365) * days
      this.fee = fee.toFixed(2)
    },
    inputFee(v: string) {
      this.fee = v
      if (!this.amount || !this.days) return
      const amount = parseFloat(this.amount)
      const days = parseFloat(this.days)
      const interest = parseFloat(this.interest)
      const fee = parseFloat(this.fee)
      this.interest = ((fee / days / amount) * 365 * 100).toFixed(2)
    },
    updateInterestAndFee() {
      if (!this.amount || !this.days) return
      const amount = parseFloat(this.amount)
      const days = parseFloat(this.days)
      const interest = parseFloat(this.interest)
      const fee = parseFloat(this.fee)
      if (this.interest) {
        const fee = (((interest / 100) * amount) / 365) * days
        this.fee = fee.toFixed(2)
      } else if (this.fee) {
        this.interest = ((fee / days / amount) * 365).toFixed(2)
      }
    },
    inputBlocks(v: string) {
      this.blocks = v
      if (!v) return
      this.days = (parseFloat(v) / 6500).toString()
    },
    inputDays(v: string) {
      this.days = v
      if (!v) return
      this.blocks = (parseFloat(v) * 6500).toString()
    }
  }
  get currencies() {
    return sta.currencies
  }
  get tokens() {
    if (!this.search) return borrow.tokens
    return borrow.tokens.filter(
      item => item.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
    )
  }
  get wallet() {
    return wallet
  }
  @Watch('slot.amount')
  onAmounChange() {
    this.slot.updateInterestAndFee()
  }
  @Watch('slot.days')
  onDaysChange(days: string) {
    this.slot.updateInterestAndFee()

    if (parseFloat(days) < 0) {
      this.$nextTick().then(() => {
        this.slot.days = '0'
      })
    }
  }
  mortgage(item: typeof borrow.tokens[0]) {
    Collateral.open()
  }
  async borrow(item: typeof borrow.tokens[0]) {
    const ctx = this
    this.slot.mortgage = ''
    this.slot.percent = '' as any
    this.slot.amount = ''
    this.slot.interest = ''
    this.slot.fee = ''
    this.slot.balanceInWallet = item.balanceInWallet
    this.slot.symbol = item.symbol
    const tokenOutAddress = tokens.find(item => item.symbol === 'USDT')
      ?.platform.token_address
    if (tokenOutAddress === item.platform.token_address) {
      return console.warn(
        `Fail with error 'input token address can not be the same as the output token address.'`
      )
    }
    await CustomPay.open({
      icon: item.id,
      title: item.symbol,
      address: pledge.options.address,
      get confirm() {
        return web3.utils.toWei(ctx.slot.mortgage)
      },
      approveAddress: item.platform.token_address,
      abi: pledge.options.jsonInterface,
      method: 'createOffer',
      get params() {
        return [
          // _tokenIn 
          item.platform.token_address,
          // _tokenOut 
          // @ts-ignorer
          tokenOutAddress,
          // _amountIn 
          web3.utils.toWei(ctx.slot.mortgage),
          // _amountOut 
          web3.utils.toWei(ctx.slot.amount),
          // _duration 
          ctx.slot.blocks.toString(),
          // _interests 
          web3.utils.toWei(ctx.slot.fee)
        ]
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>