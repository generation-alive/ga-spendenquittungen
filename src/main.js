import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMDCAdapter from 'vue-mdc-adapter'
import VueCurrencyFilter from 'vue-currency-filter'
import moment from 'moment'
import de from 'moment/locale/de'
import VuePageTitle from 'vue-page-title'

moment.locale('de', de)

Vue.use(VueMDCAdapter)

Vue.use(VueCurrencyFilter, {
  symbol: '€',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'back',
  symbolSpacing: false
})

Vue.config.productionTip = false

Vue.use(VuePageTitle, {
  suffix: ' - GA Spendenquittung'
})

window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
