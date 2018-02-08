/***
 * websocket 方法集中管理
 **/
import config from '../../config.js'
import store from '../../store/index'
import {router} from '../../router/index'

let wsInit = userInfo => {
    window.websocket = new WebSocket(config.socket);
    let websocketTimer = null;
    // websocket连接成功
    websocket.onopen = () => {
        let sendMsg = {
            type: 'connect',
            userId: userInfo ? userInfo.id : store.state.userInfo.id,
            userName: userInfo ? userInfo.name : store.state.userInfo.name
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
                store.commit('UPDATE_WEBSOCKET_STATU', true);
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
                store.dispatch('teacher/viewBattle', null, {root: true});
                // 初始化对战
                store.dispatch('student/updateMatching', {
                    type: 'battle_init',
                    data: res.data.ques_length
                });
                store.commit('UPADATE_BATTLE_STATU', {
                    statu: true,
                    ques_type: res.data.ques_type,
                });
                break;
            case 'matched':
                // 匹配成功 - 传递对方的useId
                store.dispatch('student/updateMatching', {
                    type: 'matched',
                    data: res.data
                });
                break;
            case 'battle_isReady':
                // console.log('准备就绪')
                store.dispatch('student/updateMatching', {type: 'ready'});
                break;
            case 'update_result':
                // 接收对方的答案 - 对学生
                store.dispatch('student/updateMatching', {
                    type: 'answering',
                    data: res.data
                });
                break;
            case 'matched_mem':
                // 添加排名成员信息
                store.dispatch('teacher/updateRanking', {
                    type: 'member',
                    data: res.data
                });
                break;
            case 'updata_rank':
                // 更新排名信息 - 对老师
                store.dispatch('teacher/updateRanking', {
                    type: 'rankings',
                    data: res.data
                });
                break;
        }
    };

    // websocket连接关闭
    websocket.onclose = () => {
        clearInterval(websocketTimer);
        console.warn('ws连接断开');
        store.commit('UPDATE_WEBSOCKET_STATU', false);
        store.commit('UPADATE_BATTLE_STATU', false);
        // websocket = new WebSocket(config.scoket);
    };
};
// console.log('websocket连接载入...');
if (!window.websocket) {
    if (store.state.userInfo.id === '') {
        // 如果当前没有登陆id，则取用会话存储值
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (!userInfo) {
            // 如果已经退出登陆状态，回到登陆界面
            router.push({path: '/login'});
        } else {
            store.dispatch('loginTo', userInfo);
            wsInit(userInfo);
        }
    } else {
        wsInit(false);
    }
}
