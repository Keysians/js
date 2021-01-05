import Vue from "vue"
import App from "./App.vue"
import NumberInput from '@/components/NumberInput.vue'
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import i18n from './i18n'
import '@/filters'
import '@/libs/web3'

Vue.config.productionTip = false
Vue.component('no-data', {
  render(h) {
    return h('div', { class: 'text-center py-10 my-10 grey--text text--lighten-1' }, 'No data')
  }
})
Vue.component(NumberInput.name, NumberInput)


new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app")
