<template>
  <section>
    <v-card class="shadow">
      <v-card-text class="pa-10">
        <div class="mb-1 desc--text">Current market size</div>
        <div class="black--text">
          <span
            class="text-h5 mr-2 font-weight-black text-number"
          >{{dashboard.marketSize | decimal | currency}}</span>
          <span class>USDT</span>
        </div>
      </v-card-text>
    </v-card>
    <v-card class="mt-5 shadow">
      <v-card-text class="pa-10">
        <div class="mb-1 desc--text">Total KEN staking amount</div>
        <div class="black--text">
          <span
            class="text-h5 mr-2 font-weight-black text-number"
          >{{dashboard.totalStake | decimal(8) | currency}}</span>
          <span class>KEN</span>
        </div>
      </v-card-text>
    </v-card>
    <v-card class="mt-5 shadow">
      <v-card-text class="pa-10">
        <v-row no-gutters>
          <v-col cols="3">
            <div class="mb-1 desc--text">Dividend distributed</div>
            <div class="black--text">
              <span
                class="text-h5 mr-2 font-weight-black text-number"
              >{{dashboard.mintCumulation | decimal(8) | currency}}</span>
              <span>KEN</span>
            </div>
          </v-col>
          <v-col cols="1" class="justify-center">
            <div style="height:100%;border-left: 1px solid lightgrey;"></div>
          </v-col>
          <v-col cols="8">
            <div class="mb-1 desc--text">Dividend to distribute</div>
            <div class="black--text">
              <span
                class="text-h5 mr-2 font-weight-black text-number"
              >{{dashboard.distributeAmount | decimal(8) | currency}}</span>
              <span class>KEN</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import dashboard from '@/store/dashboard'

@Component
export default class Market extends Vue {
  dashboard = dashboard
}
</script>

<style scoped lang="less">
</style>
