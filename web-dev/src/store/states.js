export const state = {
    userInfo: {
        id: '',
        name:''
    },
    // 题目列表
    quesData: {
        statu: false,
        time: 120,
        data: ''
    },
    // 分发题目加载状态
    distriLoading: false,
    // 匹配信息
    matching: {
        statu: false,
        userId: '',
        userName: ''
    },
    // 对方的答题信息
    otherChecks: [],
    // 排名数组
    rankList: [],
}
