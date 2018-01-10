import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import {mutations} from './mutations'

Vue.use(Vuex);

const state = {
    socket: {
        isConnected: false,
        message: '',
        reconnectError: false,
    },
    user: {
        id: Math.random(),
        name: Math.random().toString(36).substr(2)
    },
    // 题目列表
    quesData: {
        statu: false,
        time: 0,
        data: ''
    },
    // 分发题目加载状态
    distriLoading: false,
    // 匹配信息
    matching: {
        statu: false,
        userId: '',
        userName: ''
    },
    // 对方的答题信息
    otherChecks: [],
    // 排名数组
    rankList: []
}

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});

if (module.hot) {
    module.hot.accept([
        './getters',
        './actions',
        './mutations'
    ], () => {
        store.hotUpdate({
            getters: require('./getters'),
            actions: require('./actions'),
            mutations: require('./mutations').mutations
        })
    })
}

export default store
