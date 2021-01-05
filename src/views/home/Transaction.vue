<template>
  <section>
    <div class="text-h6 font-weight-black mb-4">Dividend pool of transaction mining</div>
    <v-card class="shadow">
      <v-row no-gutters>
        <v-col cols="5">
          <v-card-text class="pa-5 pb-10 mt-5 d-flex flex-column fill-height">
            <div class="desc--text mb-2">KEN dividend to distribute</div>
            <div class="text-h5 mr-2 font-weight-black text-number">
              {{dashboard.distributeAmount | decimal(8) | currency}}
              <span
                class="desc--text text-body-2"
              >KEN</span>
            </div>
            <v-spacer></v-spacer>
            <small
              class="desc--text text-number"
            >Predicted reward per block: {{dashboard.pieceIncome | decimal(8) | currency}} KEN</small>
          </v-card-text>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <v-card-text class="pa-5 d-flex flex-column fill-height">
            <v-row class="align-center">
              <v-col class="desc--text">
                <div class>My KEN balance</div>
                <div class="text-h6 font-weight-black black--text text-number">
                  {{dashboard.pleBalance | decimal(8) | currency}}
                  <span
                    class="desc--text text-body-2"
                  >KEN</span>
                </div>
              </v-col>
              <v-col class="shrink">
                <!-- <v-btn outlined class="text-capitalize" @click="withdraw">Withdraw</v-btn> -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mt-5 shadow">
      <v-row no-gutters>
        <v-col cols="5">
          <v-card-text class="pa-5 pb-1 d-flex flex-column fill-height">
            <v-row class="align-center">
              <v-col class="desc--text">
                <div class>USDT earned</div>
                <div class="text-h6 font-weight-black black--text text-number">
                  {{dashboard.usdtEarned | decimal(8) | currency}}
                  <span
                    class="desc--text text-body-2"
                  >USDT</span>
                </div>
              </v-col>
              <v-col class="shrink">
                <v-btn
                  outlined
                  class="text-capitalize mr-5"
                  @click="collectUsdt"
                  :loading="loading.collect"
                  :disabled="!wallet.address"
                >Collect</v-btn>
              </v-col>
            </v-row>
            <v-spacer></v-spacer>
          </v-card-text>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <v-card-text class="d-flex flex-column">
            <v-row class="align-center">
              <v-col class="desc--text">
                <div class>My USDT balance</div>
                <div class="text-h6 font-weight-black black--text text-number">
                  {{dashboard.usdtBalance | decimal(8) | currency}}
                  <span
                    class="desc--text text-body-2"
                  >USDT</span>
                </div>
              </v-col>
              <v-col class="shrink">
                <!-- <v-btn outlined class="text-capitalize">Withdraw</v-btn> -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <div class="mt-10 text-h6 font-weight-black">KEN staking</div>
    <div class="caption desc--text">Share platform transaction fee by staking KEN</div>
    <v-card class="mt-5 shadow">
      <v-row no-gutters>
        <v-col cols="5" class="d-flex flex-column align-center justify-center">
          <v-card-text class="pa-5">
            <div class="desc--text mb-2">Staked</div>
            <div class="text-h5 mr-2 font-weight-black text-number">
              {{dashboard.totalStake | decimal(8)}}
              <span class="desc--text text-body-2">KEN</span>
            </div>
          </v-card-text>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <v-card-text class="d-flex flex-column">
            <div class="desc--text pa-5">
              <div>
                <span>Balance available：</span>
                <span class="mr-2 text-number">{{dashboard.pleBalance | decimal(8) | currency}}</span>
                <span class="desc--text text-body-2">KEN</span>
              </div>
              <number-input
                class="align-center text-number"
                v-model="stakeVal"
                placeholder="0.000"
                outlined
                hide-details
                dense
                :max="parseFloat(dashboard.pleBalance)"
              >
                <template #append>
                  <span class="ma-1">KEN</span>
                </template>
                <template #append-outer>
                  <v-btn
                    class="mb-1 text-capitalize px-7"
                    outlined
                    @click="stake"
                    :disabled="!wallet.address"
                  >Stake</v-btn>
                </template>
              </number-input>
            </div>
            <v-divider></v-divider>
            <div class="desc--text pa-5">
              <div>
                <span class="mr-1">Your KEN staked:</span>
                <span class="mr-1 text-number">{{dashboard.unlockAmount | decimal(8) | currency}}</span>
                <span>KEN</span>
              </div>
              <number-input
                class="align-center text-number"
                v-model="unstakeVal"
                placeholder="0.000"
                outlined
                hide-details
                dense
                :max="parseFloat(dashboard.unlockAmount)"
              >
                <template #append>
                  <span class="ma-1">KEN</span>
                </template>
                <template #append-outer>
                  <v-btn
                    class="mb-1 text-capitalize"
                    outlined
                    @click="unstake"
                    :loading="loading.unstake"
                    :disabled="!wallet.address"
                  >unstake</v-btn>
                </template>
              </number-input>
              <!-- <small>
                Takes up {{
                parseFloat(dashboard.unlockAmount) &&
                parseFloat(dashboard.totalStake) &&
                (parseFloat(dashboard.unlockAmount) / parseFloat(dashboard.totalStake)) | decimal(2)}}% of total amount staked
              </small>-->
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <div class="my-10"></div>
    <custom-pay />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import web3, { tokens, pool, ethereum } from '@/libs/web3'
import wallet from '@/store/wallet'
import dashboard from '@/store/dashboard'
import CustomPay from '@/components/dialog/CustomPay.vue'
import Toast from '@/components/dialog/Toast.vue'
import { POOL_CONTRACT } from '@/const'
import poolApi from '@/libs/pool.json'

@Component({
  components: {
    CustomPay
  }
})
export default class Transaction extends Vue {
  stakeVal = ''
  unstakeVal = ''
  loading = {
    collect: false,
    unstake: false
  }
  get dashboard() {
    return dashboard
  }
  get wallet() {
    return wallet
  }
  async mounted() {
    if (!wallet.address) return
  }
  async collectUsdt() {
    this.loading.collect = true
    const options = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: wallet.address,
          to: pool.options.address,
          data: web3.eth.abi.encodeFunctionCall(
            poolApi.find(j => j.name === 'mintShare') as any,
            []
          )
        }
      ]
    }
    try {
      await ethereum.request(options)
      Toast.open({
        text: 'Your request is successfully executed.',
        color: 'green'
      })
      this.loading.collect = false
    } catch (err) {
      console.error(err)
      this.loading.collect = false
    }
  }
  async stake() {
    if (!this.stakeVal) return
    await CustomPay.open({
      title: `Stake`,
      address: POOL_CONTRACT,
      confirm: web3.utils.toWei(this.stakeVal),
      approveAddress: tokens.find(t => t.name === 'KEN')?.platform
        ?.token_address as string,
      abi: poolApi,
      approveAbi: null,
      method: 'stake',
      params: [web3.utils.toWei(this.stakeVal)]
    })
    this.stakeVal = ''
  }
  async unstake() {
    if (!this.unstakeVal) return
    this.loading.unstake = true
    const options = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: wallet.address,
          to: pool.options.address,
          data: web3.eth.abi.encodeFunctionCall(
            poolApi.find(j => j.name === 'withdraw') as any,
            [web3.utils.toWei(dashboard.unlockAmount)]
          )
        }
      ]
    }
    try {
      await ethereum.request(options)
      Toast.open({
        text: 'Your request is successfully executed.',
        color: 'green'
      })
      this.unstakeVal = ''
      this.loading.unstake = false
    } catch (err) {
      console.error(err)
      this.loading.unstake = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
