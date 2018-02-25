<template>
    <div>
        <!--  学生端首页  -->
        <h1>学生端首页</h1>
        <el-button type="primary" :disabled="!battle_statu" :loading="matchLoading" @click="matchAgainst">
            <span v-if="!matchLoading">匹配对战</span>
            <span v-else>正在匹配...</span>
        </el-button>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "student",
        data () {
            return {
                matchLoading: false
            }
        },
        computed: {
            ...mapState([
                'userInfo',
                'battle_statu'
            ])
        },
        mounted () {
            // const self = this;
            // 存储学生状态默认值
            this.$sessionSave.set('student_state_default', this.$store.state.student);
        },
        methods: {
            // 匹配对战
            matchAgainst () {
                // const self = this;

                // 发送请求匹配信息
                websocket.send(JSON.stringify({type: 'matching'}));
                this.matchLoading = true;
            }
        }
    }
</script>

<style scoped>

</style>
