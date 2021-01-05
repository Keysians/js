<template>
  <v-dialog v-model="show" max-width="500px" persistent>
    <v-card>
      <v-btn small icon class="float-right mr-5 mt-5" @click="show = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-title class="align-center">
        <img
          v-if="options.icon"
          :src="require(`@/assets/tokens/${options.icon}.png`)"
          class="mr-2"
          width="32px"
          height="32px"
        />
        <span class="h6 mt-1">{{options.title}}</span>
      </v-card-title>
      <v-divider v-if="$slots.default" class="mx-5 my-2 mb-3"></v-divider>
      <v-stepper v-model="step" class="elevation-0">
        <v-stepper-items>
          <v-stepper-content step="0" class="pa-0 ma-0">
            <v-card-text style="padding: 10px 60px;" v-if="options">
              <slot :vm="this" />
            </v-card-text>
          </v-stepper-content>
          <v-stepper-content step="1">
            <submitted :submitting="!confirmed" :confirmed="confirmed" :hash="hash" approval />
          </v-stepper-content>
          <v-stepper-content step="2">
            <submitted
              :submitting="!confirmed"
              :confirmed="confirmed"
              :hash="hash"
              congradulations
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-divider v-if="$slots.default" class="mt-5 mx-5"></v-divider>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>
        <v-btn
          v-if="step===0"
          class="text-capitalize px-5 mx-1"
          color="button"
          dark
          :loading="loading"
          @click="confirm"
        >Confirm</v-btn>
        <v-btn
          v-if="step===1"
          class="text-transform-none px-5"
          color="button"
          @click="submit"
          :disabled="!confirmed"
          :dark="confirmed"
          :loading="loading"
        >Submit</v-btn>
        <v-btn
          v-if="step===2"
          class="text-transform-none px-5"
          color="button"
          @click="ok"
          dark
        >Finish</v-btn>
        <v-btn v-if="step!==2" class="text-capitalize px-5" outlined @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="tsx">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import wallet from '@/store/wallet'
import Submitted from './Submitted.vue'
import web3, { ethereum, token } from '@/libs/web3.ts'
import { AbiItem } from 'web3-utils'
import erc20 from '@/libs/erc20.json'

type options = {
  /** Dialog title */
  title: string
  /** The first param of Approve function, and submit address  */
  address: string
  /** confirm value */
  confirm: string
  /** Confirm address */
  approveAddress: string
  /** approve abi, default erc20 */
  approveAbi?: any
  /** submit abi  */
  abi: any
  /** method name of submit */
  method: string
  /** method's params */
  params: any[]
  icon?: number
}

@Component({
  components: {
    Submitted
  }
})
export default class CustomPay extends Vue {
  static resolve: () => void
  static reject: (err: string) => void
  static vm: CustomPay
  static open(options: options): Promise<void> {
    if (!CustomPay.vm) {
      console.error('Before call the method, you need to mount the component.')
    }
    return new Promise((resolve, reject) => {
      CustomPay.resolve = resolve
      CustomPay.reject = reject
      CustomPay.vm.show = true
      CustomPay.vm.options = options
      CustomPay.vm.step = 0
      CustomPay.vm.loading = false
      CustomPay.vm.confirmed = false
      CustomPay.vm.hash = ''
    })
  }
  show = false
  options: options = {} as any
  step = 0
  loading = false
  confirmed = false
  hash = ''
  get wallet() {
    return wallet
  }
  created() {
    CustomPay.vm = this
  }
  async confirm() {
    this.loading = true
    try {
      const abi = this.options.approveAbi
      const value = web3.utils.toWei(this.options.confirm)
      const contract = new web3.eth.Contract(
        this.options.approveAbi || (erc20 as any),
        this.options.approveAddress
      )
      const eventOptions = {
        filter: {
          owner: wallet.address,
          value
        }
      }
      const onApprove = (err: any, event: any) => {
        console.log(event)
        this.confirmed = true
      }
      contract.once('Approval', eventOptions, onApprove)
      if (abi) {
        await contract.methods.approve(wallet.address, value)
      } else {
        await ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: wallet.address,
              to: contract.options.address,
              data: web3.eth.abi.encodeFunctionCall(
                contract.options.jsonInterface.find(
                  j => j.name === 'approve'
                ) as AbiItem,
                [this.options.address, value]
              )
            }
          ]
        })
      }
      this.step++
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  }
  async submit() {
    const contract = new web3.eth.Contract(
      this.options.abi,
      this.options.address
    )
    const options = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: wallet.address,
          to: this.options.address,
          data: web3.eth.abi.encodeFunctionCall(
            this.options.abi.find(
              (j: any) => j.name === this.options.method
            ) as AbiItem,
            this.options.params
          )
        }
      ]
    }
    this.loading = true
    try {
      this.hash = await ethereum.request(options)
      this.step++
      console.log(this.hash)
    } catch (err) {
      console.error(err)
    }
    this.loading = false
  }
  ok() {
    this.show = false
    CustomPay.resolve()
  }
  cancel() {
    this.show = false
    CustomPay.reject('Cancel')
  }
}
</script>

<style scoped lang="less">
</style>
