<template>
    <div class="login-wrap">
        <h1 class="text-center">互动答题</h1>
        <el-button @click="loginToClient('tea')">教师登陆</el-button>
        <el-button @click="loginToClient('stu')" type="primary">学生登录</el-button>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                ws: null,
                wsTimer: null
            }
        },
        methods: {
            // 跳转至对应的界面端
            loginToClient(client) {
                const self = this;
                switch (client) {
                    case 'tea':
                        this.$router.push('/tea?userid=1&username=老师');
                        break;
                    case 'stu':
                        this.$router.push('/stu?userid=2&username=学生A');
                        break;
                }
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss">
    .login-wrap {
        padding-top : 100px;
        .el-button {
            display : block;
            margin  : 30px auto;
        }
    }
</style>
