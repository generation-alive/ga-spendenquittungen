import Vue from 'vue'
import Router from 'vue-router'
import Internal from './views/internal'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'internal',
      component: Internal
    }
  ]
})
