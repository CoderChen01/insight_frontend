import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './element-ui'
// perform this module code makes localStorage work
import 'utils/localStorageSecure'

import {
  STORE_USER_INFO,
  DELETE_USER_INFO
} from 'store/mutationTypes'
import {isExpired} from 'api/login'


Vue.config.productionTip = false

// custom directive
Vue.directive('title', {
  bind: function (el, binding) {
    let {value} = binding
    if(value) {
      document.title = value
    }
  }
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){
    const userInfoRaw = localStorage.getItem('userInfo')
    if (userInfoRaw) {
      const userInfo = JSON.parse(userInfoRaw)
      store.commit(STORE_USER_INFO, userInfo)
      isExpired(userInfo.token)
        .then(res => {
          if (!res.code) {
            store.commit(DELETE_USER_INFO, userInfo)
            alert('登录已过期，请重新登录')
            next({name: 'login'})
          } else {
            next()
          }
        })
    }
    else {
      next({name: 'login'})
    }
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

