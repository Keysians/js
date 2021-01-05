import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Index from '@/views/Index.vue'
import Home from '@/views/home/Index.vue'
import wallet from '@/store/wallet'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      {
        path: '',
        component: Home,
        children: [{
          name: 'home',
          path: '',
          component: () => import('@/views/home/Market.vue')
        }, {
          name: 'market',
          path: '/market',
          component: () => import('@/views/home/Market.vue')
        }, {
          name: 'transaction',
          path: '/transaction',
          component: () => import('@/views/home/Transaction.vue')
        }
        ]
      },
      {
        path: ':page/connect',
        name: 'connect',
        component: () => import('@/views/connect/Index.vue')
      },
      ...['borrow', 'dashboard', 'deposit', 'borrow', 'settlement', 'staking', 'faq']
        .map(name => {
          return {
            path: name,
            name: name,
            component: () => import(`@/views/${name}/Index.vue`),
          }
        })
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const publics = ['connect', 'faq', 'deposit', 'borrow', 'home', 'market', 'transaction', 'staking']
  if (!wallet.connected && !publics.includes(to.name as string)) {
    return next({
      name: 'connect',
      params: {
        page: to.name as string,
      }
    })
  }
  next()
})

export default router
