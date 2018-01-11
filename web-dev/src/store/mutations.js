import Vue from 'vue';

export const mutations = {
    // 显示接收题目弹窗
    showQuesModal(state, data) {
        state.quesData = data;
        state.distriLoading = false;
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
    // 更新作答信息
    updateAnswering(state, data) {
        // console.log(state.otherChecks);
        if (data.length) {
            state.otherChecks = data;
        } else {
            Vue.set(state.otherChecks[data.index], 'check', data.check);
            Vue.set(state.otherChecks[data.index], 'confirm', true);
        }
    },
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
