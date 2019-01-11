import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMDCAdapter from 'vue-mdc-adapter'
import VueCurrencyFilter from 'vue-currency-filter'

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

window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
