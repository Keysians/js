<template>
  <div class="pa-5"></div>
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
export default class Footer extends Vue {}
</script>

<style lang="less" scoped>
</style>