import * as types from './mutation-types'
import {router} from '../../../router/index'

export default {
    // 发布中加载动画
    [types.DISTRI_LOADING] (state, data) {
        state.distriLoading = data;
    },
    // 进入查看对战榜/对战状态
    [types.VIEW_BATTLE] (state, account_type) {
        state.distriLoading = false;
        if (account_type === 'teacher') {
            router.push({path: '/teacher/viewBattle'})
        }
    },
    // 更新排行榜
    [types.UPDATE_RANKINGS] (state, data) {
        switch (data.type) {
            case 'member':
                console.log(data.data);
                // 更新人员名单
                state.battleList.push(data.data);
                break;
            case 'rankings':
                // 更新排名
                // if (!data.data.check) return;  // 如果未得分则不处理
                for (let i = 0; i < state.battleList.length; i++) {
                    // console.log(state.battleList[i].id, data.data.userId)
                    if (state.battleList[i].id === data.data.userId) {
                        state.battleList[i].score = Number(data.data.total_score);
                        break;
                    }
                }
                break;
        }
    }
}
