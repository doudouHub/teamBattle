<template>
    <div>
        <div class="login-wrap">
            <h1 class="text-center">互动答题</h1>
            <el-button @click="openToLogin('teacher')">教师登陆</el-button>
            <el-button @click="openToLogin('student')" type="primary">学生登录</el-button>
        </div>
        <el-dialog title="登陆" :visible.sync="dialogFormVisible" width="480px" center>
            <el-form :model="formData" :rules="rules" ref="formData" :label-width="formLabelWidth">
                <el-form-item label="用户ID" prop="id">
                    <el-input v-model="formData.id" autofocus></el-input>
                </el-form-item>
                <el-form-item label="账户" prop="name">
                    <el-input v-model="formData.name" @keyup.enter.native="loginToClient('formData')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="loginToClient('formData')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                dialogFormVisible: false,
                formData: {
                    id: '',
                    name: ''
                },
                rules: {
                    id: [{required: true, message: '请输入账户id', trigger: 'blur'}],
                    name: [
                        {required: true, message: '请输入账户名称', trigger: 'blur'},
                        {min: 1, max: 18, message: '长度在 1 到 18个字符', trigger: 'blur'}
                    ],
                },
                formLabelWidth: '70px',
                // 登陆的账户端
                account_type: ''
            }
        },
        methods: {
            // 打开登陆窗口
            openToLogin(client) {
                const self = this;
                this.dialogFormVisible = true;
                this.account_type = client;
            },
            // 登陆到对应界面
            loginToClient(formName) {
                const self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _data = {
                            id: this[formName].id,
                            name: this[formName].name,
                            account_type: this.account_type
                        };
                        // 存储会话数据
                        this.$sessionSave.set('userInfo', _data);
                        this.$store.dispatch('loginTo', _data);
                        this.$router.push('/' + this.account_type);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
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
