<template>
  <div class="pa-5">
    <div v-if="congradulations" class="d-flex justify-center align-center flex-column">
      <div class="text-h6 primaty--text">Congratulations!</div>
      <div class="grey-dark--text text-center">Your request is successfully executed.</div>
      <div class="my-10">
        <img :src="require('@/assets/submitted.png')" />
      </div>
      <v-row class="d-flex justify-around" style="width:100%;">
        <v-col class="grey-dark--text">
          <template v-if="submitting">
            <v-progress-circular class="mr-2" size="14" width="3" indeterminate color="warning"></v-progress-circular>
            <span>Submitting</span>
          </template>
          <template v-else>
            <v-icon color="success mr-1" size="14">lens</v-icon>
            <span>Submitted</span>
          </template>
        </v-col>
        <v-col>
          <a
            :href="transactionDetailLink(hash)"
            class="grey-dark--text text-decoration-none"
            target="_blank"
            style="white-space:pre;"
          >
            <v-icon color="success" size="18">open_in_new</v-icon>
            <span class="ml-2">View transaction details</span>
          </a>
        </v-col>
      </v-row>
    </div>
    <div v-if="approval">
      <div class="d-flex align-center justify-center flex-column">
        <div class="mb-5">
          <template v-if="submitting">
            <v-progress-circular class="mr-2" size="14" width="3" indeterminate></v-progress-circular>
            <span>Waiting for transaction confirmation...</span>
          </template>
          <template v-if="confirmed">
            <v-icon color="success">lens</v-icon>
            <span class="ml-2">Confirmed transaction</span>
          </template>
        </div>
        <!-- <a
          :href="$store.getters.transactionDetailLink(hash)"
          class="grey-dark--text text-decoration-none"
          target="_blank"
        >
          <v-icon color="success" size="18">open_in_new</v-icon>
          <span class="ml-2">View approval details</span>
        </a>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import sta from '@/store/static'

@Component
export default class Submitted extends Vue {
  transactionDetailLink = sta.transactionDetailLink
  @Prop({
    type: Boolean,
    default: false
  })
  submitting!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  confirmed!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  approval!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  congradulations!: boolean

  @Prop({
    type: String,
    default: ''
  })
  hash!: string
}
</script>

<style scoped lang="less">
</style>
