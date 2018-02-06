import Vue from 'vue';
import App from './App';
import {router} from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill";
import store from 'store/index'
// 配置文件
import config from 'config.js'
// 引入全局工具类api
import Utils from './components/api/utils'

Vue.use(ElementUI);
Vue.use(Utils);

const vm = new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
