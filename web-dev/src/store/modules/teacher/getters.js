import Vue from 'vue';

export const rankingList = state => {
    return Vue.copyArr(state.battleList).sort(Vue.sortBy('score')).reverse();
}
