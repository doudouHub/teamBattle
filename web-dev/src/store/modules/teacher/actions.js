import * as types from './mutation-types'

export const distriForLoading = ({commit}) => {
    commit(types.DISTRI_LOADING)
}
export const viewBattle = ({dispatch, commit, rootState}) => {
    commit(types.VIEW_BATTLE, rootState.userInfo.account_type);
}
