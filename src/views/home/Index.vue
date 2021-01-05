<template>
  <section>
    <v-tabs color="black" background-color="transparent">
      <v-tab
        v-for="(tab,i) in tabs"
        :key="i"
        class="text-transform-none text-h6 desc--text font-weight-normal px-0 mr-5"
        active-class="black--text"
        @click="$router.push({name:tab.routeName})"
      >{{tab.tabName}}</v-tab>
    </v-tabs>
    <router-view class="mt-10"></router-view>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Drawer from '@/components/Drawer.vue'
import Component from 'vue-class-component'

@Component({
  components: {
    Drawer
  }
})
export default class Home extends Vue {
  tabs = [
    {
      tabName: 'Market',
      routeName: 'market'
    },
    {
      tabName: 'Transaction mining',
      routeName: 'transaction'
    }
  ]
}
</script>

<style lang="less" scoped>
</style>