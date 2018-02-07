<template>
    <div>
        <!--  倒计时组件  -->
        <v-countdown
            :count_time="count_time"
            end_text="Go!"
            :end_close="true"
            v-if="$store.state.student.otherIsReady">
        </v-countdown>

        <!--  对战面板  -->
        <br>
        <br>
        <br>
        <br>
        <h2 class="text-center"
            v-loading.fullscreen.lock="battle_statu && !$store.state.student.otherIsReady"
            element-loading-text="等待对方准备就绪...">
            对战面板
        </h2>

        <keep-alive>
            <!-- 对战面板: 加载不同题型组件 -->
            <component :is="ques_type">
                <!-- 组件在 vm.currentview 变化时改变！ -->
            </component>
        </keep-alive>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    // 对战题型模板
    import {battleTpl} from '../../../config'
    // 引入倒计时组件
    import vCountdown from '../../common/Count_down'

    export default {
        components: {
            vCountdown,
            ...battleTpl
        },
        data() {
            return {
                // 准备倒计时
                count_time: 3
            }
        },
        computed: {
            ...mapState([
                'ques_type',
                'battle_statu'
            ])
        },
        mounted() {
            // 如果当前对战状态未开始,返回学生端首页
            if (!this.battle_statu) {
                this.$router.push({path: '/student'})
            }
        },
        methods: {
            // 对战开始

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixins";

</style>
