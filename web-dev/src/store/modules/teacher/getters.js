import Vue from 'vue';

export const rankingList = state => {
    // let a = Vue.copyArr(state.battleList);
    // a.sort(Vue.sortBy('score')).reverse();
    // console.log(state.battleList)
    return Vue.copyArr(state.battleList).sort(Vue.sortBy('score')).reverse();
}
