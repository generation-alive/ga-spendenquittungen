import Vue from 'vue'
import Router from 'vue-router'
import Internal from '@/views/internal'
import SettingsOverview from '@/views/internal/Settings/SettingsOverview'
import SettingsEditGeneral from '@/views/internal/Settings/SettingsEditGeneral'
import SettingsEditOrganization from '@/views/internal/Settings/SettingsEditOrganization'
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
          path: 'settings/general',
          name: 'settingsGeneral',
          component: SettingsEditGeneral
        },
        {
          path: 'settings/organization',
          name: 'settingsOrganization',
          component: SettingsEditOrganization
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
