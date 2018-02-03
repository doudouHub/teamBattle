import * as types from './mutation-types'

export const loginTo = ({commit}, data) => {
    commit(types.USER_LOGIN, data)
}
