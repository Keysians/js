<template>
  <v-snackbar
    v-model="show"
    :bottom="options.y === 'bottom'"
    :color="options.color"
    :left="options.x === 'left'"
    :multi-line="options.multiLine"
    :right="options.x === 'right'"
    :timeout="options.timeout"
    :top="options.y === 'top'"
    :vertical="options.vertical"
    :dark="options.dark"
  >
    {{ options.text }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script lang="tsx">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

const defaultOptions: {
  text: string
  color?: string
  multiLine?: boolean
  snackbar?: boolean
  vertical?: boolean
  dark?: boolean
  timeout?: number
  x?: 'left' | 'right'
  y?: 'top' | 'bottom'
} = {
  text: "Hello, I'm a snackbar",
  color: undefined,
  multiLine: false,
  snackbar: false,
  vertical: false,
  dark: false,
  timeout: 6000,
  x: undefined,
  y: 'top'
}

@Component
export default class Toast extends Vue {
  static resolve: () => void
  static reject: () => void
  static vm: Toast
  static open(options: typeof defaultOptions): Promise<void> {
    if (!Toast.vm) {
      console.error('Before call the method, you need to mount the component.')
    }
    return new Promise((resolve, reject) => {
      Toast.resolve = resolve
      Toast.reject = reject
      Toast.vm.show = true
      Toast.vm.options = Object.assign({}, defaultOptions, options)
    })
  }
  show = false
  options = defaultOptions
  created() {
    Toast.vm = this
  }
  ok() {
    this.show = false
    Toast.resolve()
  }
  cancel() {
    this.show = false
    Toast.reject()
  }
}
</script>

<style scoped lang="less">
</style>
