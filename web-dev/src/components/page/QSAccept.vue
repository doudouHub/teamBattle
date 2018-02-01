<template>
    <div>
        <div style="padding: 0 30px;">
            <h1>接收题目</h1>
            <div>用户：{{$route.query.username}}</div>
            题目列表：{{quesData.data}}
        </div>

        <!--  对战面板  -->
        <v-battle></v-battle>

        <!--  接收题目弹窗  -->
        <v-recive-ques></v-recive-ques>
    </div>
</template>

<script>
    import vBattle from '../modules/vBattle'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        components: {
            vBattle,
            vReciveQues: resolve => require(['../modules/vReciveQues.vue'], resolve)
        },
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'quesData',
                'matching',
                'user'
            ])
        },
        mounted() {
            const self = this;
        },
        methods: {

            //
        }
    }
</script>

<style lang="scss">
    .quesData-list {
        font-size   : 18px;
        line-height : 30px;
    }
</style>
