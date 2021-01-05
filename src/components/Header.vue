<template>
  <header class="d-flex my-5 justify-center align-center">
    <!-- <img draggable="false" :src="require('@/assets/logo2x.png')" height="36px" /> -->
    <v-spacer></v-spacer>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Drawer from '@/components/Drawer.vue'
import Component from 'vue-class-component'
import wallet from '@/store/wallet'
import dashboard from '@/store/dashboard'

@Component({
  components: {
    Drawer
  }
})
export default class Header extends Vue {
  get dashboard() {
    return dashboard
  }
  get wallet() {
    return wallet
  }
}
</script>

<style lang="less" scoped>
</style>