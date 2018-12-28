import Vue from 'vue'
import Router from 'vue-router'
import Internal from '@/views/internal'
import SettingsOverview from '@/views/internal/Settings/SettingsOverview'
import DonatorsOverview from '@/views/internal/Donators/DonatorsOverview'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'internal',
      component: Internal,
      children: [
        {
          path: 'settings',
          redirect: 'settingsOverview'
        },
        {
          path: 'settings/overview',
          name: 'settingsOverview',
          component: SettingsOverview
        },
        {
          path: 'donators',
          redirect: 'donatorsOverview'
        },
        {
          path: 'donators/overview',
          name: 'donatorsOverview',
          component: DonatorsOverview
        }
      ]
    }
  ]
})
