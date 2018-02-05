import * as types from './mutation-types'

// 更新匹配信息
export const updateMatching = ({commit},data) => {
    commit(types.UPDATE_MATCHING, data)
}
