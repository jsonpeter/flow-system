// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Components
import './components'

// Plugins
import './plugins'
// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
import router from '@/router'
import store from '@/store'
import echarts from 'echarts'
import axios from '@/plugins/axios'

Vue.prototype.$echarts = echarts;
Vue.prototype.$serverPath = 'http://localhost:3100';
Vue.prototype.$http = axios;
// Sync store with router
sync(store, router)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
