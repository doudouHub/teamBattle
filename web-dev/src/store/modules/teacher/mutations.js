import * as types from './mutation-types'
import {router} from '../../../router/index'

export default {
    [types.DISTRI_LOADING](state) {
        state.distriLoading = false;
    },
    [types.VIEW_BATTLE](state) {
        state.distriLoading = true;
        router.push({path: '/viewBattle'})
    },
}
