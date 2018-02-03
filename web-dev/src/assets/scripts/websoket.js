/***
 * websocket 方法集中管理
 **/
import config from '../../config.js'
import store from '../../store/index'
import {router} from '../../router/index'

if (store.state.userInfo.id === '') {
    // 如果当前没有登陆id，则取用链接的id存储
    router.afterEach((to, from) => {
        store.dispatch('loginTo', {
            id: to.query.userid,
            name: to.query.username,
            loginToPath: '/'
        });
    })
}

window.websocket = new WebSocket(config.socket);

let websocketTimer = null;
// websocket连接成功
websocket.onopen = () => {
    let sendMsg = {
        type: 'connect',
        userId: store.state.userInfo.id,
        userName: store.state.userInfo.name
    };
    websocket.send(JSON.stringify(sendMsg).toString(2));
};

// websocket接收消息
websocket.onmessage = (evt) => {
    let res = JSON.parse(evt.data);

    switch (res.code) {
        case 'connected':
            // 建立关系成功
            // 发送心跳包
            console.info('%cwebsocket连接成功', 'color:#96b97d;');
            websocketTimer = setInterval(function () {
                // console.log("连接检测_5s");
                websocket.send(0);
            }, 5000);
            break;
        case 'error':
            // socket报错
            websocket.close();
            Notification.error({
                title: '连接失败',
                message: res.msg
            });
            break;
        case 'deliver':
            // 对战题目发送成功，查看对战榜
            store.dispatch('teacher/viewBattle');
            // 接收题目
            store.commit('showQuesModal', {
                statu: true,
                time: res.data.time,
                type: res.data.type,
                data: res.data.quesData
            });
            break;
        case 'matched':
            // 匹配成功 - 传递对方的useId
            store.commit('updateMatching', {
                statu: true,
                userId: res.data.userId,
                userName: res.data.userName
            });
            break;
        case 'update_result':
            // 接收对方的答案 - 对学生
            store.commit('updateAnswering', res.data);
            break;
        case 'matched_mem':
            // 添加排名成员信息
            store.commit('addBattleRankings', res.data);
            break;
        case 'updata_rank':
            // 更新排名信息 - 对老师
            store.commit('updateBattleRankings', {
                data: res.data,
                self: ''
            });
            break;
    }
};

// websocket连接关闭
websocket.onclose = () => {
    clearInterval(websocketTimer);
    console.warn('ws连接断开');
    // websocket = new WebSocket(config.scoket);
};
