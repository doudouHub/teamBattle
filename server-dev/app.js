(function () {
    var path = require('path');
    var events = require('events'); // 引入 events 模块
    var express = require('express');
    var uuid = require('uuid/v1');
    var WebSocket = require('ws');

    var app = express();

    // 定义静态档案目录
    app.use(express.static(path.join(__dirname, 'public')));
    app.listen(8888, function () {
        console.log('app listening on port 8888');
    });

    // 创建 eventEmitter 对象
    var event = new events.EventEmitter();
    var WebSocketServer = WebSocket.Server,
        wss = new WebSocketServer({port: 8181});

    // 所有ws客户端的链接存储
    var clients = {};
    // 等待匹配客户端
    var matchingClients = [];
    var clientIndex = 0;

    /***
     * 向客户端广播消息
     * to 客户端发送对象连接id数组
     * data 传递的数据
     **/
    var wsSend = function (to, data) {
        var clientSocket = null;
        data = (typeof data === 'string') ? data : JSON.stringify(data);

        // try {
        if (typeof to === 'object') {
            if (!isNaN(to.length)) {
                // 当id类型为数组，表示向特定客户端传播信息
                for (var i = 0; i < to.length; i++) {
                    clientSocket = clients[to[i]].ws;
                    if (clientSocket.readyState === WebSocket.OPEN) {
                        clientSocket.send(data);
                    }
                }
            } else {
                // 当id类型为对象，表示向所有客户端传播信息
                for (var key in clients) {
                    clientSocket = clients[key].ws;
                    if (clientSocket.readyState === WebSocket.OPEN) {
                        clientSocket.send(data);
                    }
                }
            }
        }
        else {
            // 当id类型为字符串，表示向单一客户端传播信息
            clientSocket = clients[to].ws;
            if (clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(data);
            }
        }
        // } catch (err) {
        //     console.error("报错信息1：" + err);
        // }
    };

    // socket报错
    var wsError = function (code, ws) {
        switch (code) {
            case 'user_null':
                // 用户账户空
                ws.send(JSON.stringify({"code": 'error', "msg": '账户信息不符合'}));
                break;
        }
    };

    // 发布题目 - 记录发布题目的人
    event.on('publish_ques', function (client_uuid) {
        var clientSocket = null;
        for (var key in clients) {
            client = clients[key];
            client.pub_client = client_uuid;
        }
    });

    // 客户端和服务端可以用一个端口建立多个socket链接
    wss.on('connection', function (ws) {
        var client_uuid = uuid();
        // 接收消息
        ws.on('message', function (msg) {
            if (msg === '0') {
                // 心跳检测
                ws.send('1');
            } else {
                msg = JSON.parse(msg);
                switch (msg.type) {
                    case 'connect':
                        // 连接账户为空则不进行关联
                        if (msg.userId == undefined || msg.userName == undefined) {
                            wsError('user_null', ws);
                        }

                        // 建立用户关联
                        clients[client_uuid] = {"ws": ws, 'userId': msg.userId, 'userName': msg.userName};
                        clientIndex += 1;
                        wsSend(client_uuid, {
                            "code": 'connected',
                            "data": '', "msg": '连接成功'
                        });
                        console.log('新增用户：' + msg.userName, '，客户端连接数量：' + clientIndex);
                        break;
                    case 'distribute':
                        // 发布题目 - 记录发布题目的人
                        event.emit('publish_ques', client_uuid);
                        wsSend({}, {
                            "code": 'deliver',
                            "data": msg.data
                        });
                        break;
                    case 'matching':
                        // 发起匹配
                        try {
                            // 如果已经匹配过则不重复匹配
                            if (clients[client_uuid].matchTo || (client_uuid === matchingClients[0])) return;
                            if (matchingClients.length) {
                                // 完成匹配的一对客户端
                                var matchedClients = [client_uuid, matchingClients[0]];
                                console.log(matchingClients, '待匹配客户端');

                                // 当匹配容器中有等待人员则直接互相匹配
                                clients[client_uuid].matchTo = matchingClients[0];
                                clients[client_uuid].matchName = clients[matchingClients[0]].userName;
                                clients[matchingClients[0]].matchTo = client_uuid;
                                clients[matchingClients[0]].matchName = clients[client_uuid].userName;
                                // 清除已经匹配完成的客户端列表
                                matchingClients.splice(0, 1);

                                for (var i = 0; i < matchedClients.length; i++) {
                                    // 匹配成功 - 向关联的客户端发送通知
                                    wsSend(matchedClients[i], {
                                        "code": 'matched',
                                        "data": {
                                            userId: clients[clients[matchedClients[i]].matchTo].userId,
                                            userName: clients[matchedClients[i]].matchName
                                        }
                                    });
                                    // 向主客户端发送对战成员信息
                                    wsSend(clients[matchedClients[i]].pub_client, {
                                        "code": 'matched_mem',
                                        "data": {
                                            userId: clients[matchedClients[i]].userId,
                                            userName: clients[matchedClients[i]].userName,
                                            score: 0
                                        }
                                    });
                                }
                            } else {
                                matchingClients.push(client_uuid);
                            }
                        } catch (err) {
                            throw new Error("报错信息2：" + err)
                        }
                        break;
                    case 'result':
                        // 传递实时对战结果
                        wsSend(clients[client_uuid].matchTo, {
                            "code": 'update_result', // 发送对方的答案
                            data: msg.data
                        });

                        wsSend(clients[client_uuid].pub_client, {
                            "code": 'updata_rank', // 发送对方的答案
                            data: msg.data
                        });
                        break;
                    case 'battle_over':
                        // 结束对战匹配

                        break;
                }
            }
        });

        var closeSocket = function (customMessage) {
            try {
                console.warn(clients[client_uuid].userName + '断开连接');
                // wsSend(client_uuid, {code:'-1',msg:'连接已断开‘});
                // 删除客户端连接
                delete clients[client_uuid];
                clientIndex--;
            } catch (err) {
            }
        };

        ws.on('close', function () {
            closeSocket();
        });

        process.on('SIGINT', function () {
            console.log("Closing things");
            closeSocket('Server has disconnected');
            process.exit();
        });

        // process.on('uncaughtException', function (err) {
        //     console.error("报错信息3：" + err);
        // })
        process.setMaxListeners(0);
    });

    // 广播消息
    wss.broadcast = function broadcast(msg) {
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    };

    // 查看所有客户端用户名
    global.viewClients = {
        length: function () {
            var len = 0;

            for (var key in clients) {
                len++;
            }
            console.group('连接客户端数量：');
            console.log(len);
            console.groupEnd();
            return '';
        },
        name: function () {
            var names = '';
            for (var key in clients) {
                if (names === '') {
                    names = clients[key].userName;
                } else {
                    names = clients[key].userName + ', ' + names;
                }
            }
            console.group('连接客户端用户：');
            console.log(names);
            console.groupEnd();
            return '';
        }
    };
})();