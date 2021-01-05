<template>
  <v-app id="app">
    <drawer />
    <v-main class="background">
      <v-container>
        <i-header />
        <router-view class="mt-10 mx-5" />
        <i-footer />
      </v-container>
    </v-main>
    <div class="loading" v-if="global.loading">
      <v-progress-linear indeterminate color="grey-dark" :size="20" width="4"></v-progress-linear>
    </div>
    <toast />
    <connect />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Drawer from '@/components/Drawer.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Component from 'vue-class-component'
import Toast from '@/components/dialog/Toast.vue'
import wallet from '@/store/wallet'
import global from '@/store/global'
import Connect from '@/components/dialog/Connect.vue'

@Component({
  components: {
    Drawer,
    IHeader: Header,
    IFooter: Footer,
    Toast,
    Connect
  }
})
export default class Index extends Vue {
  global = global
}
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  left: 00px;
  top: 0px;
  width: 100vw;
}
</style>