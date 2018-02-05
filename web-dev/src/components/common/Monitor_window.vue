<template>
    <!--  监测窗口  -->
    <div class="monitor-window">
        websocket连接状态：{{websocket_statu?'开启':'未连接'}} <br>
        对战赛状态：{{battle_statu?'已开启':'未开启'}} <br>
        用户名：{{userInfo.name}}<br>
        用户ID：{{userInfo.id}}<br>
        身份：{{userInfo.account_type}}
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "monitor_window",
        computed: {
            ...mapState([
                'websocket_statu',
                'battle_statu',
                'userInfo'
            ])
        },
    }
</script>

<style scoped>
    .monitor-window {
        position         : fixed;
        top              : 5px;
        right            : 5px;
        width            : 300px;
        min-height       : 200px;
        padding          : 10px 15px;
        background-color : rgba(0, 0, 0, .6);
        color            : #fff;
        border           : 1px solid #333;
        border-radius    : 5px;
        line-height      : 30px;
    }
</style>
