/* 配置文件 */
let ipHost = window.location.hostname

module.exports = {
    // 接口域名配置
    host: 'http://localhost:8080/',
    socket: 'ws://' + ipHost + ':8181',
    // 题型模板 -- type - play:播放组件 edit:编辑组件
    battleTpl(type) {
        let _path = './components/questions/' + type + '/'
        return {
            vArithmetic: resolve => require([_path + 'arithmetic.vue'], resolve),
            QABattle: resolve => require([_path + 'qaBattle.vue'], resolve),
            breakBrick: resolve => require([_path + 'breakBrick.vue'], resolve)
        }
    }
};
