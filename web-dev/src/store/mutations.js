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

    // 显示发加载动画
    showDistriLoading(state, self) {
        state.distriLoading = true;
        self.$router.push('/viewBattle');
    },
    // 更新匹配信息
    updateMatching(state, data) {
        state.matching = data;
    },
    // 添加排名成员信息
    addBattleRankings(state, data) {
        state.rankList.push(data);
    },
    // // 更新作答信息
    // updateAnswering(state, data) {
    //     // console.log(state.otherChecks);
    //     if (data.length) {
    //         state.otherChecks = data;
    //     } else {
    //         Vue.set(state.otherChecks[data.index], 'check', data.check);
    //         Vue.set(state.otherChecks[data.index], 'confirm', true);
    //     }
    // },
    // 更新排名信息
    updateBattleRankings(state, data) {
        // console.log(data)
        if (!data.data.check) return;  // 如果未得分则不处理
        for (let i = 0; i < state.rankList.length; i++) {
            if (state.rankList[i].userId === data.data.userId) {
                state.rankList[i].score++;
                break;
            }
        }
        state.rankList = state.rankList.sort(data.self.$sortBy('score')).reverse();
    },
};
