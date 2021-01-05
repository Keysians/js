<template>
  <v-container>
    <div class="alert">
      <div class="text-h6 black--text font-italic text-center mb-5">{{tip}}</div>
      <div class="text-center">
        <v-btn class="px-10 text-capitalize" min-width="300px" large color="button" dark rounded @click="connect">Connect</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ConnectDialog from '@/components/dialog/Connect.vue'
import wallet from '@/store/wallet'
import { Watch } from 'vue-property-decorator'

@Component
export default class CConnect extends Vue {
  get connected() {
    return wallet.connected
  }
  get tip() {
    switch (this.$route.params.page) {
      case 'dashboard':
        return `Please connect your wallet to explore Keysians.`
      case 'deposit':
        return `We can't detect your wallet. Connect to your wallet for lend. You can gain interest and participate in transaction mining with USDT on the lend page.`
      case 'borrow':
        return `We can't detect your wallet. Connect to your wallet for collateral borrow, and you can borrow USDT and participate in the transaction mining on the Borrow page.`
      case 'settlement':
        return `We can't detect your wallet. Connect to your wallet for settle. KEN rewards from the defaulting party in the collateral liquidation of the DeFi protocol.`
      default:
        return `We can't detect your wallet. Connect to your wallet for deposit, and you can see your investment information on the Dashboard page.`
    }
  }
  @Watch('connected', { immediate :true})
  onConected(connected: boolean) {
    if (connected) {
      this.$router.push({
        name: [undefined, '', null, 'null'].includes(
          this.$router.currentRoute.params.page
        )
          ? 'dashboard'
          : this.$router.currentRoute.params.page
      })
    }
  }
  connect() {
    ConnectDialog.open()
  }
}
</script>

<style lang="less" scoped>
.alert {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 500px;
  height: 250px;
}
</style>