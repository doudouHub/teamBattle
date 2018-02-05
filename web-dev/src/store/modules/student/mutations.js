import Vue from 'vue';
import * as types from './mutation-types'
import {router} from '../../../router/index'

export default {
    // 更新匹配信息
    [types.UPDATE_MATCHING](state, data) {
        switch (data.type) {
            case 'matched':
                // 匹配人员成功
                state.matching.push(data.data);
                router.push({path: '/student/battle'});
                break;
            case 'battle_init':
                // 初始化对战
                state.otherChecks = data.data;
                break;
            case 'answering':
                // 更新对方作答状况
                if (data.data.length) {
                    state.otherChecks = data.data;
                } else {
                    Vue.set(state.otherChecks[data.data.index], 'check', data.data.check);
                    Vue.set(state.otherChecks[data.data.index], 'confirm', true);
                }
                break;
        }
    },
}
