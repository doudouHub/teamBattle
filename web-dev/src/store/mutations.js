import Vue from 'vue';
import * as types from './mutation-types'
import {router} from '../router/index'

export const mutations = {
    // 用户登陆信息更新
    [types.USER_LOGIN](state, data) {
        state.userInfo = data;
    },
    // 更新用户对战状态
    [types.UPADATE_BATTLE_STATU](state, data) {
        state.battle_statu = data.statu;
        state.ques_type = data.ques_type;
    },
    // 更新WEBSOCKET状态
    [types.UPDATE_WEBSOCKET_STATU](state, data) {
        state.websocket_statu = data;
    },
};
