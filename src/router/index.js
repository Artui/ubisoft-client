import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import Index from '@/components/Index'
import Moderator from '@/components/AdminPanel'
import GameField from '@/components/GameField'

Vue.use(Router)
Vue.use(Vuetify)
Vue.use(VueResource)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/player',
      name: 'Player',
      component: GameField
    },
    {
      path: '/moderator',
      name: 'Moderator',
      component: Moderator
    }
  ]
})
let paths = ['/', '/player', '/moderator']

router.beforeEach((to, from, next) => {
  if (!paths.includes(to.path)) {
    next({
      path: '/',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
