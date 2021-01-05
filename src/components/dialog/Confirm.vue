<template>
  <v-dialog v-model="show" :max-width="options.maxWidth || 500" persistent>
    <v-card>
      <v-card-title class="h6 mt-1 align-center justify-center text-center">{{options.title}}</v-card-title>
      <v-divider v-if="options.message || $slots.default" class="mx-5 my-2 mb-3"></v-divider>
      <v-card-text style="padding: 10px 60px;">
        <slot />
        <template v-if="$slots.default">{{options.message}}</template>
      </v-card-text>
      <v-divider v-if="options.message" class="mt-5 mx-5"></v-divider>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>
        <v-btn class="text-transform-none mr-5" dark @click="ok">{{options.okText || 'OK'}}</v-btn>
        <v-btn class="text-transform-none" text @click="cancel">{{options.canceltext || 'Cancel'}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="tsx">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
type options = {
  title: string
  message?: string
  okText?: string
  cancelText?: string
  maxWidth?: number
}
@Component
export default class Confirm extends Vue {
  static resolve: () => void
  static reject: () => void
  static vm: Confirm
  static open(options: options): Promise<void> {
    if (!Confirm.vm) {
      console.error('Before call the method, you need to mount the component.')
    }
    return new Promise((resolve, reject) => {
      Confirm.resolve = resolve
      Confirm.reject = reject
      Confirm.vm.show = true
      Confirm.vm.options = options
    })
  }
  show = false
  options = {} as any
  created() {
    Confirm.vm = this
  }
  ok() {
    this.show = false
    Confirm.resolve()
  }
  cancel() {
    this.show = false
    Confirm.reject()
  }
}
</script>

<style scoped lang="less">
</style>
