export const state = {
    userInfo: {
        id: '',
        name: '',
        // 账户类型
        account_type: ''
    },
    // 对战挑战状态：关闭/开启
    battle_statu: false,
    // 对战连接状态
    websocket_statu: false,
    ques_type:'',

    // 题目列表
    quesData: {
        statu: false,
        time: 120,
        data: ''
    },
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
