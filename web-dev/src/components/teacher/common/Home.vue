<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import config from '../../../config.js'
    import {mapState} from 'vuex'

    export default {
        components: {
            vHead, vSidebar
        },
        data() {
            return {
                websocketTimer: null
            }
        },
        computed: mapState([
            'user'
        ]),
        mounted() {
            const self = this;
            window.websocket = new WebSocket(config.socket);
            // websocket连接成功
            websocket.onopen = () => {
                let sendMsg = {
                    type: 'connect',
                    userId: self.$route.query.userid,
                    userName: self.$route.query.username
                };
                websocket.send(JSON.stringify(sendMsg).toString(2));
            };
            // websocket接收消息
            websocket.onmessage = (evt) => {
                let res = JSON.parse(evt.data);
                // console.log(res);

                switch (res.code) {
                    case 'connected':
                        // 建立关系成功
                        // 发送心跳包
                        console.info('%cwebsocket连接成功', 'color:#96b97d;');
                        self.websocketTimer = setInterval(function () {
                            // console.log("连接检测_5s");
                            websocket.send(0);
                        }, 5000);
                        break;
                    case 'error':
                        // socket报错
                        websocket.close();
                        this.$notify.error({
                            title: '连接失败',
                            message: res.msg
                        });
                        break;
                    case 'matched_mem':
                        // 添加排名成员信息
                        self.$store.commit('addBattleRankings', res.data);
                        break;
                    case 'updata_rank':
                        // 更新排名信息 - 对老师
                        self.$store.commit('updateBattleRankings', {
                            data: res.data,
                            self: self
                        });
                        break;
                }
            };

            // websocket连接关闭
            websocket.onclose = () => {
                clearInterval(self.websocketTimer);
                console.warn('ws连接断开');
                // websocket = new WebSocket(config.scoket);
            }
        },
        methods: {}
    }
</script>

<style>

</style>
