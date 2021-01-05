<template>
  <v-dialog v-model="show" max-width="500px" persistent>
    <v-card>
      <v-btn small icon class="float-right mr-5 mt-5" @click="show = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-title class="text-center">
        <div class="d-flex align-center">
          <template v-if="step===0">
            <img :src="require(`@/assets/icon/${info.icon}.png`)" class="mr-2" />
            <span class="h6 mt-1">{{info.name}}</span>
          </template>
          <template v-else>
            <v-btn text class="text-capitalize" @click="step--">
              <v-icon>chevron_left</v-icon>Back
            </v-btn>
          </template>
        </div>
      </v-card-title>
      <v-divider class="mx-5"></v-divider>

      <v-stepper v-model="step" class="elevation-0">
        <v-stepper-items>
          <v-stepper-content step="0" class="pa-0 ma-0">
            <v-card-text style="padding: 0 60px;">
              <div class="text-center my-5">
                <v-btn-toggle borderless dense mandatory v-model="tab" class="borrow-btn-group">
                  <v-btn class="px-5">
                    <span class="hidden-sm-and-down">Collateral</span>
                  </v-btn>
                  <v-btn class="px-5">
                    <span class="hidden-sm-and-down">Withdraw</span>
                  </v-btn>
                </v-btn-toggle>
              </div>
              <div class="mb-1 font-weight-bold d-flex">
                <span class="mr-5 black--text">Your balance in {{tab?'awllet':'pledge'}}</span>
                <v-spacer></v-spacer>
                <span class="black--text mr-1 text-number">{300.00000}</span>
                <span class="black--text">DAI</span>
              </div>
              <number-input class="mt-2" placeholder="0" outlined hide-details dense>
                <template #append>
                  <span class="ma-1 font-weight-bold">DAI</span>
                </template>
              </number-input>
              <v-row class="white my-3" no-gutters>
                <v-col
                  v-for="(percent,i) in [100,75,50,25]"
                  :key="i"
                  :class="{'ml-1':i!==0,'mr-1':i!==3}"
                >
                  <v-btn block small color="background" class="grey-dark--text text-number" dark>{{percent}}%</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-content>
          <v-stepper-content step="1">
            <submitted />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-divider class="mt-5 mx-5"></v-divider>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>
        <template v-if="step===0">
          <v-btn class="text-capitalize px-5" color="button" dark @click="step++">Continue</v-btn>
          <v-btn class="text-capitalize px-5" color="button" outlined @click="cancel">Cancel</v-btn>
        </template>
        <template v-else>
          <v-btn
            class="text-transform-none px-5"
            color="button"
            dark
            @click="step=0"
          >Go to dashboard</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="tsx">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { nil } from '@/libs/helper'
import Submitted from './Submitted.vue'

const defaultOptions = {
  name: 'DAI',
  icon: 'dai'
}

@Component({
  components: {
    Submitted
  }
})
export default class CollateralDialog extends Vue {
  static resolve = nil
  static reject = nil
  static vm: CollateralDialog
  static open(): Promise<void> {
    if (!CollateralDialog.vm) {
      console.error('Before call the method, you need to mount the component.')
    }
    return new Promise((resolve, reject) => {
      CollateralDialog.resolve = resolve
      CollateralDialog.reject = reject
      CollateralDialog.vm.show = true
    })
  }
  show = false
  info = defaultOptions
  tab = 0
  step = 0
  created() {
    CollateralDialog.vm = this
  }
  ok() {
    this.show = false
    CollateralDialog.resolve()
  }
  cancel() {
    this.show = false
    CollateralDialog.reject()
  }
}
</script>

<style lang="less">
.borrow-btn-group {
  button {
    background: #f1f2f6 !important;
    span {
      color: #949aab !important;
    }
    &.v-btn--active {
      background: #949aab !important;
      span {
        color: white !important;
      }
    }
  }
}
</style>
