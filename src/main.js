import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'

// 3
import Button from '@/components/Button/Button.js'

import Message from '@/components/Message/Message.js'
import ShowLoading from '@/components/ShowLoading/ShowLoading.js'

Vue.prototype.$message = Message

Vue.config.productionTip = false
// echart挂载在原型上，每个Vue实例皆可使用
Vue.prototype.$echarts = echarts
// 4
Vue.use(Button)
Vue.use(ShowLoading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
