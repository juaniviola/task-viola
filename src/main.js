// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import EventBus from './event'

import router from './routes'
import store from './store'

import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'

import moment from 'moment'
import 'moment/locale/es'
import vueMoment from 'vue-moment'

import VueScrollTo from 'vue-scrollto'

Vue.use(Toast, {
  duration: 3500
})

Vue.use(vueMoment, {
  moment
})

Vue.use(VueScrollTo, {
  duration: 350
})

Vue.use(VueRouter)
Vue.use(EventBus)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})
