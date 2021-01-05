<template>
  <v-dialog v-model="show" max-width="370px" persistent>
    <v-card>
      <v-btn small icon class="float-right mr-5 mt-5" @click="show = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-title>
        <span class="h6 mt-1"></span>
      </v-card-title>
      <v-card-text class="pa-5">
        <div class="text-center mb-5">
          <img :src="require('@/assets/logo2x.png')" height="36px" />
        </div>
        <div class="black--text text-h6 text-center">Connect wallet</div>
        <div class="grey-dark--text text-center">To start using Keysians</div>
        <v-list class="my-10 px-10">
          <v-list-item class="pa-2 px-5 background" @click="connect" :disabled="waiting">
            <v-list-item-title>
              <img :src="require(`@/assets/icon/metamask.png`)" height="40px" />
            </v-list-item-title>
            <v-list-item-action>
              <img
                v-if="!waiting"
                :src="require(`@/assets/icon/arrow_right_primary.png`)"
                height="12px"
              />
              <!-- <v-icon v-if="!waiting" color="secondary">arrow_forward</v-icon> -->
              <v-progress-circular indeterminate color="#fa8909" v-else></v-progress-circular>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div class="grey-dark--text text-center mb-2">By connecting, I accept the platform's</div>
        <div class="text-center">
          <a
            class="secondary--text font-weight-bold text-center"
            href="/download/terms of use"
          >TERMS OF USE</a>
        </div>
        <div class="mb-5"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="tsx">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Web3 from 'web3'
import web3, { ethereum } from '@/libs/web3'
import wallet from '@/store/wallet'
import { nil } from '@/libs/helper'
import Toast from '@/components/dialog/Toast.vue'

@Component
export default class Connect extends Vue {
  static resolve = nil
  static reject = nil
  static vm: Connect
  static open(): Promise<void> {
    if (!Connect.vm) {
      console.error('Before call the method, you need to mount the component.')
    }
    return new Promise((resolve, reject) => {
      Connect.resolve = resolve
      Connect.reject = reject
      Connect.vm.show = true
    })
  }
  show = false
  waiting = false
  created() {
    Connect.vm = this
  }
  ok() {
    this.show = false
    Connect.resolve()
  }
  cancel() {
    this.show = false
    Connect.reject()
  }
  async connect() {
    if (!ethereum) {
      console.error('Browser wallet not detected.')
      return
    }
    try {
      this.waiting = true
      await ethereum.request({ method: 'eth_requestAccounts' })
      await wallet.init()
      this.waiting = false
      this.ok()
    } catch (err) {
      console.error(err.message)
      Toast.open({
        text: err.message,
        dark: true,
        color: this.$vuetify.theme.themes.light.error as string
      })
      this.waiting = false
    }
  }
}
</script>

<style scoped lang="less">
</style>
