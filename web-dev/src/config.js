/* 配置文件 */
let ipHost = window.location.hostname;

module.exports = {
    // 接口域名配置
    host: 'http://localhost:8080/',
    socket: 'ws://' + ipHost + ':8181'
};
