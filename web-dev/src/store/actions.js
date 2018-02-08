import * as types from './mutation-types'

export const loginTo = ({commit}, data) => {
    commit(types.USER_LOGIN, data)
}

export const backToHome = ({commit}, data) => {
    commit(types.BACK_TO_HOME, data)
}
