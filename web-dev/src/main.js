import Vue from 'vue'
import App from './App'
import {router} from './router'
import VueTouch from 'vue-touch'
import 'babel-polyfill'
import store from 'store/index'
// 配置文件
import 'config.js'
// 引入全局工具类api
import Utils from './components/api/utils'
// 引入UI组件配置
import './ui-settings'

Vue.use(Utils)
Vue.use(VueTouch, {name: 'v-touch'})

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
