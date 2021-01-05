<template>
  <v-dialog v-model="show" max-width="450px" persistent>
    <v-card>
      <v-btn small icon class="float-right mr-5 mt-5" @click="show = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-title class="text-left">{{options.title}}</v-card-title>
      <v-divider class="mx-5 my-2 mb-3"></v-divider>

      <v-stepper v-model="step" class="elevation-0">
        <v-stepper-items>
          <v-stepper-content step="0" class="pa-0 ma-0">
            <v-card-text class="pt-2 px-6 desc--text">
              <slot />
            </v-card-text>
          </v-stepper-content>
          <v-stepper-content step="1">
            <submitted
              :submitting="!confirmed"
              :confirmed="confirmed"
              :congradulations="confirmed"
              :hash="hash"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-divider class="mt-10 mx-5"></v-divider>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>
        <v-btn
          v-if="step===0"
          class="text-capitalize px-5 mx-1"
          color="button"
          dark
          :loading="loading"
          @click="submit"
        >Submit</v-btn>
        <v-btn
          v-if="step===1"
          class="text-transform-none px-5"
          color="button"
          dark
          @click="ok"
        >Finish</v-btn>
        <v-btn v-if="step!==1" class="text-capitalize px-5" outlined @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="tsx">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { nil } from '@/libs/helper.ts'
import Submitted from './Submitted.vue'
import web3, { offer, tokens, pledge, ethereum } from '@/libs/web3.ts'
import erc20 from '@/libs/erc20.json'
import wallet from '@/store/wallet'
import { AbiItem } from 'web3-utils'
import offerApi from '@/libs/offer.json'

const defaultOptions = ({} as any) as {
  title: string
  abi: AbiItem
  to: string
  method: string
}

@Component({
  components: {
    Submitted
  }
})
export default class CustomTransaction extends Vue {
  static resolve = nil
  static reject = nil
  static vm: CustomTransaction
  static open(options: typeof defaultOptions): Promise<any> {
    if (!CustomTransaction.vm) {
      console.error('Before call the method, you need to mount the component.')
    }
    return new Promise((resolve, reject) => {
      CustomTransaction.resolve = resolve
      CustomTransaction.reject = reject
      CustomTransaction.vm.show = true
      CustomTransaction.vm.options = options
      CustomTransaction.vm.step = 0
      CustomTransaction.vm.loading = false
      CustomTransaction.vm.confirmed = false
      CustomTransaction.vm.hash = ''
    })
  }
  show = false
  options = defaultOptions
  step = 1
  loading = false
  confirmed = false
  hash = ''
  created() {
    CustomTransaction.vm = this
  }
  async submit() {
    const contract = new web3.eth.Contract(
      this.options.abi as any,
      this.options.to
    )
    const options = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: wallet.address,
          to: this.options.to,
          data: web3.eth.abi.encodeFunctionCall(
            offerApi.find(j => j.name === this.options.method) as AbiItem,
            []
          )
        }
      ]
    }
    console.log(options)
    this.loading = true
    try {
      this.hash = await ethereum.request(options)
      this.confirmed = true
      this.step++
      console.log(this.hash)
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  }
  ok() {
    this.show = false
    CustomTransaction.resolve()
  }
  cancel() {
    this.show = false
    CustomTransaction.reject()
  }
}
</script>

<style scoped lang="less">
</style>
