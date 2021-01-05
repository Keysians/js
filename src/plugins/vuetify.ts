import Vue from "vue"
import Vuetify from "vuetify"
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import "@mdi/font/css/materialdesignicons.css"
import '@/styles/vuetify.css'
import '@/styles/global.less'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
  theme: {
    themes: {
      light: {
        background: '#f0f3f8',
        'grey-dark': '#949AAB',
        desc: '#565f6c',
        button: '#2C3848',
        black: '#011D37',
        purple: '#8F20B8',
        primary: 'black',
        secondary: '#FB327B',
        success: '#14B5B2',
        warning: '#FF9D02',
      },
    }
  }
})
