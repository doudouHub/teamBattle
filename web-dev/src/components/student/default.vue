<template>
    <div>
        <!--  学生端首页  -->
        <h1>学生端首页</h1>
        <!--  互动对战已经开启  -->
        <el-button type="primary" :loading="matchLoading" @click="matchAgainst">
            <span v-if="!matchLoading">匹配对战</span>
            <span v-else>正在匹配...</span>
        </el-button>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "student",
        data() {
            return {
                matchLoading: false
            }
        },
        computed: {
            ...mapState('student', [
                'userInfo'
            ])
        },
        mounted() {
            const self = this;
        },
        methods: {
            // 匹配对战
            matchAgainst() {
                const self = this;

                // 发送请求匹配信息
                websocket.send(JSON.stringify({
                    type: 'matching',
                    userId: self.$route.query.userid
                }));
                this.matchLoading = true;
            },
        }
    }
</script>

<style scoped>

</style>
