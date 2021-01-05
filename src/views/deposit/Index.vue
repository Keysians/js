<template>
  <section>
    <template v-if="page.currencies">
      <div class="text-h6 pa-0">Popular asset</div>
      <v-row class="align-center justify-center" no-gutter>
        <v-col cols="8">
          <v-chip-group v-model="currency" active-class="font-weight-bold" :mandatory="false">
            <v-chip
              color="transparent"
              class="mr-5"
              style="min-width:160px;"
              v-for="(currency,i) in page.currencies"
              :key="i"
            >
              <img
                class="mr-2"
                width="24px"
                height="24px"
                :src="require(`@/assets/tokens/${currency.id}.png`)"
              />
              {{currency.name}}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-spacer></v-spacer>
        <div class="d-flex align-center mr-5" v-if="wallet.connected">
          <span class="mr-2">Wallet:</span>
          <v-chip
            class="white lighten-3 px-7 py-4"
            style="border:1px solid rgba(0,0,0,0.5)!important;"
          >
            <span
              class="primary--text mr-2 text-number"
            >{{dashboard.usdtBalance | decimal(5) | currency}}</span> USDT
          </v-chip>
          <div class="my-5"></div>
        </div>
      </v-row>
    </template>
    <div class="d-flex align-center mb-2">
      <span class="text-h6 mr-5">{{page.dTitle}}</span>
      <span v-if="page.description" class="desc--text caption mt-2 shrink">{{page.description}}</span>
    </div>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="2" v-for="(item,i) in headers" :key="i">
        <div
          class="d-flex align-center grey-dark--text body-2 font-weight-bold"
          :class="item.class"
          style="height:40px;"
        >{{item.name}}</div>
      </v-col>
    </v-row>
    <div class="t-table pa-2">
      <v-row class="t-row" v-for="(item,i) in list" :key="i">
        <v-col cols="2" class="d-flex justify-start align-center font-weight-bold black--text">
          <img
            class="mr-2 ml-3"
            :src="require(`@/assets/tokens/${item.tokenIn.id}.png`)"
            width="32px"
            height="32px"
          />
          {{item.tokenIn.name}}
        </v-col>
        <v-col cols="2" class="text-center d-flex justify-center align-center">
          <span
            class="font-weight-bold mr-1 black--text text-number"
          >{{item.amountOut || 0 | decimal | currency }}</span>
          <span class="grey-dark--text caption font-weight-bold mt-1">USDT</span>
        </v-col>
        <v-col cols="2" class="text-center d-flex justify-center align-center">
          <span
            class="font-weight-bold mr-1 black--text text-number"
          >{{item.amountIn || 0 | decimal | currency }}</span>
          <span class="grey-dark--text caption font-weight-bold mt-1">{{item.tokenIn.symbol}}</span>
        </v-col>
        <v-col cols="2">
          <div class="d-flex justify-center align-center text-number">
            <span class="font-weight-bold mr-1 black--text">{{item.interests}}</span>
            <span class="grey-dark--text caption font-weight-bold mt-1">/USDT</span>
          </div>
          <div class="caption d-flex justify-center align-center grey-dark--text">
            <span class="secondary--text mr-1 text-number">{{item | apy | decimal | currency}}%</span>
            <span>/APY</span>
          </div>
        </v-col>
        <v-col cols="2" class="text-center">
          <div class="d-flex justify-center align-center">
            <span
              class="font-weight-bold mr-1 black--text text-number"
            >{{item.duration | currency }}</span>
          </div>
          <div
            class="caption d-flex justify-center align-center grey-dark--text text-center text-number"
          >≈{{(item.duration / 270).toFixed(1)}}h</div>
        </v-col>
        <v-col cols="2" class="d-flex justify-end align-center pr-6">
          <v-btn
            v-for="(button,i) in page.actions"
            :key="i"
            :disabled="button.disabled && button.disabled(item)"
            :dark="!(button.disabled && button.disabled(item))"
            class="text-capitalize px-5 font-weight-bold"
            color="button"
            @click="button.click(item)"
          >{{button.label}}</v-btn>
        </v-col>
      </v-row>
      <no-data v-if="!list.length"></no-data>
    </div>
    <confirm>
      <div
        class="desc--text"
      >Anyone can create and name any ERC20 token on Ethereum, which means there might exist multiple tokens with exactly the same token ticker(token name). Similarto any Ethereum explorer instancing Etherscan, this site can load any ERC-20 tokens via token smart contract address. Please do your own research and verify the smart contract address of the collateral token before lending.</div>
      <div class="my-2 font-weight-bold body-1 black--text">
        {{slot.tokenIn.symbol}}:
        <template v-if="slot.tokenIn.symbol">
          <a
            :href="`https://etherscan.io/token/${slot.tokenIn.platform.token_address}`"
            class="secondary--text"
          >View on Ethereum</a>
          <span class="ml-2 desc--text caption">({{slot.tokenIn.platform.token_address}})</span>
        </template>
      </div>
    </confirm>
    <custom-transaction>
      <div class="text-h6 text-center mt-1 mb-5 balck--text">Settling Info</div>
      <div class="mx-10 pl-5">
        <div>
          <span>Collateral:</span>
          <span class="font-weight-bold mr-2 text-number">{{slot.amountIn}}</span>
          <span>{{slot.tokenIn.symbol}}</span>
        </div>
        <div>
          <span>Borrower:</span>
          <span class="font-weight-bold mr-2 text-number">-{{slot.amountIn}}</span>
          <span>{{slot.tokenIn.symbol}}</span>
        </div>
        <div>
          <span>Lender:</span>
          <span class="font-weight-bold mr-2 text-number">+{{slot.amountIn}}</span>
          <span>{{slot.tokenIn.symbol}}</span>
        </div>
      </div>
    </custom-transaction>
    <custom-pay>
      <div class="body-1 black--text mb-2">Lend amount:</div>
      <div class="text-center my-5">
        <span
          class="text-h4 mx-0 px-0 font-weight-bold black--text mr-2 text-number"
        >{{slot.amountOut}}</span>
        <span class="body-1 font-weight-bold black--text">USDT</span>
      </div>

      <div class="black--text">
        <span class="mr-1">Divident interest:</span>
        <span class="mr-1 secondary--text font-weight-bold text-number">{{slot.interests}}</span>
        <span>USDT</span>
      </div>

      <div class="black--text">
        <span class="mr-1">Divident interest:</span>
        <span
          class="mr-1 secondary--text font-weight-bold text-number"
        >{{slot.apy | decimal | currency }}</span>
        <span>%</span>
      </div>

      <div>
        <span class="mr-1">Order time length:</span>
        <span class="blue--text lighten-3 mr-1 text-number">{{slot.duration}} Blocks</span>
        <span>around</span>
        <span
          class="blue--text lighten-3 ml-1 text-number"
        >{{(parseFloat(slot.duration) / 6500) | decimal(4)}} days</span>
      </div>
      <v-divider class="my-5"></v-divider>
      <div class="mb-2">Notes:</div>
      <p
        class="desc--text caption"
      >1. 10% of the interest earned will be charged as fee, and such fee will be put into the staking pool.</p>
      <p
        class="desc--text caption"
      >2. If borrower fails to repay after order closing, this order will be settled and you are able to dispose of the collaterals.</p>
    </custom-pay>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import wallet from '@/store/wallet'
import sta from '@/store/static'
import { offer } from '@/libs/web3'
import borrow from '@/store/borrow'
import deposit from '@/store/deposit'
import CustomTransaction from '@/components/dialog/CustomTransaction.vue'
import CustomPay from '@/components/dialog/CustomPay.vue'
import offerApi from '@/libs/offer.json'
import dashboard from '@/store/dashboard'
import Confirm from '@/components/dialog/Confirm.vue'

@Component({
  components: {
    CustomTransaction,
    CustomPay,
    Confirm
  },
  mounted() {
    // @ts-ignore
    this.init()
  }
})
export default class Deposit extends Vue {
  currency: number | null = null
  headers = [
    { name: 'Asset', class: 'justify-start ml-10 pl-10' },
    { name: 'Amount', class: 'justify-center' },
    { name: 'Collateral', class: 'justify-center' },
    { name: 'Interest', class: 'justify-center' },
    { name: 'Blocks', class: 'justify-center' },
    { name: '', class: 'justify-center' }
  ]
  slot = {
    amountIn: '',
    amountOut: '',
    tokenIn: {},
    tokenOut: {},
    interests: '0',
    apy: '0',
    duration: '0'
  }
  get page() {
    const ctx = this
    const currency = this.currency
    return {
      currencies: sta.currencies,
      dTitle: 'Markets available',
      filter: (offer: offer) => {
        if (offer.state !== 'Opened') {
          return false
        }
        return typeof currency === 'number'
          ? sta.currencies[currency].symbol === offer.tokenIn.symbol
          : true
      },
      actions: [
        {
          label: 'Lend',
          disabled(item: offer) {
            return (
              !wallet.connected ||
              item.owner.toLowerCase() === wallet.address.toLowerCase()
            )
          },
          async click(item: offer) {
            ctx.slot.amountOut = item.amountOut
            ctx.slot.interests = item.interests
            ctx.slot.apy = item.apy
            ctx.slot.duration = item.duration
            const token = borrow.tokens.find(
              token => token.symbol === item.tokenOut.symbol
            )
            if (!token) return
            ctx.slot.tokenIn = item.tokenIn
            ctx.slot.tokenOut = item.tokenOut
            await Confirm.open({
              title: 'Notice before Lending!',
              okText: 'I understand',
              maxWidth: 700
            })
            await CustomPay.open({
              icon: item.tokenIn.id,
              title: item.tokenIn.symbol,
              address: item.contractAddress,
              confirm: item.amountOut,
              approveAddress: item.tokenOut.platform.token_address,
              abi: offerApi,
              method: 'take',
              params: []
            })
          }
        }
      ]
    }
  }
  get wallet() {
    return wallet
  }
  get dashboard() {
    return dashboard
  }
  get list() {
    return deposit.offers.filter(this.page.filter)
  }
  async init() {
    wallet.fetchBlockNumber()
  }
}
</script>

<style lang="less" scoped>
</style>
