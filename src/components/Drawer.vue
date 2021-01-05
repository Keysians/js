<template>
  <v-navigation-drawer
    :value="true"
    :mini-variant="mini"
    app
    clipped
    stateless
    touchless
    dark
    class="white"
    :width="200"
  >
    <div class="mx-5 mt-10 mb-5" v-if="!mini">
      <img draggable="false" :src="require('@/assets/logo2x.png')" width="100%" height="50px" class="mb-5" />
      <!-- 连接钱包 -->
      <v-btn
        v-if="!wallet.connected"
        color="button"
        class="d-block connect-btn caption"
        outlined
        width="100%"
        @click="connect"
      >
        <span class="d-inline-block text-truncate connect-text text-transform-none">Connect wallet</span>
      </v-btn>
      <!-- /连接钱包 -->
      <!-- 断开连接 -->
      <v-menu :close-on-content-click="false" v-else offset-y min-width="400px">
        <template v-slot:activator="{ on, attrs,value:expanded}">
          <v-btn color="button" class="d-block" v-bind="attrs" v-on="on" outlined width="100%">
            <v-icon color="green" class="mb-1" size="18">•</v-icon>
            <span class="d-inline-block text-truncate caption">{{wallet.address}}</span>
            <v-icon color="grey-dark" size="18">{{expanded?'expand_less':'expand_more'}}</v-icon>
          </v-btn>
        </template>
        <v-card>
          <div class="d-flex pl-5 pt-5">
            <v-icon color="green" class="mb-1 mr-1" size="18">•</v-icon>
            <div class="caption grey-dark--text">{{wallet.network}}</div>
          </div>
          <div class="ml-5 my-2 caption black--text">{{wallet.address}}</div>
          <v-divider></v-divider>
          <v-btn
            text
            block
            color="button"
            class="text-capitalize"
            @click="wallet.disconnect"
          >Disconnect</v-btn>
        </v-card>
      </v-menu>
      <!-- /断开连接 -->
    </div>
    <!-- 导航菜单 -->
    <v-list dense>
      <template v-for="(cate,i) in categories">
        <v-divider :key="i" v-if="cate==='divider'" class="my-2"></v-divider>
        <v-list-item :key="i" v-else link @click="$router.push({name:cate.icon})" class="mb-2">
          <v-list-item-icon class="ml-2 mr-3">
            <img
              :src="require(`@/assets/icon/${cate.icon}.svg`)"
              :style="{filter: cate.icon.toLowerCase()===$route.name ? 'brightness(0)':''}"
              width="24px"
              height="24px"
            />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="grey-dark--text text-capitalize"
              :class="{
              'black--text':$route.name===cate.icon.toLowerCase()
            }"
            >{{ cate.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <!-- /导航菜单 -->
    <template v-slot:append>
      <!-- 底部 -->
      <div class="grey-dark--text mb-5" v-if="!mini">
        <div class="mb-5 caption text-center" v-if="!mini">
          <div>
            <a
              class="text-decoration-none desc--text"
              href="/download/Keysians PRIVACY POLICY.pdf"
            >PRIVACY POLICY</a>
          </div>
          <div>
            <a class="text-decoration-none desc--text" href="/download/Keysians TERMS OF USE.pdf">TERMS OF USE</a>
          </div>
        </div>
        <div class="text-center">
          <template v-for="(item,i) in links">
            <v-btn icon :key="i" class="mx-1">
              <a :href="item.url" target="_blank">
                <img
                  draggable="false"
                  :src="require(`@/assets/icon/${item.icon}.svg`)"
                  width="20px"
                  height="20px"
                />
              </a>
            </v-btn>
          </template>
        </div>
      </div>
      <!-- /底部 -->
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import wallet from '@/store/wallet'
import Connect from '@/components/dialog/Connect.vue'

@Component
export default class Drawer extends Vue {
  mini = false
  categories = [
    { title: 'Home', icon: 'home' },
    { title: 'My', icon: 'dashboard' },
    { title: 'Lend', icon: 'deposit' },
    { title: 'Borrow', icon: 'borrow' },
    { title: 'Settle', icon: 'settlement' },
    { title: 'Staking', icon: 'staking' },
    'divider',
    { title: 'FAQ', icon: 'faq' }
  ]
  links = [
    { icon: 'twitter', url: 'https://twitter.com/keysians' },
    { icon: 'telegram', url: 'https://t.me/keysians' },
    { icon: 'medium', url: 'https://medium.com/@keysiansnetwork' }
  ]
  get wallet() {
    return wallet
  }
  async connect() {
    Connect.open()
  }
}
</script>
