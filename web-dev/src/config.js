/* 配置文件 */
let ipHost = window.location.hostname;

module.exports = {
    // 接口域名配置
    host: process.env.NODE_ENV === 'development'?'':'http://localhost:8080/',
    socket: 'ws://' + ipHost + ':8181',
    // 题型模板
    battleTpl: {
        vArithmetic: resolve => require(['components/questions/arithmetic.vue'], resolve),
        QABattle: resolve => require(['components/questions/qaBattle.vue'], resolve)
    }
};
