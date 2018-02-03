<template>
    <!--  查看题型界面  -->
    <div class="text-center">
        <br>
        <br>
        <h1>发布题目</h1>
        <br>

        <div>
            <el-radio-group v-model="ques_type_selectid">
                <el-radio v-for="(item,index) in ques_type_list" :label="item.id" :key="item.id" border
                          @change="getQues(index)">{{item.title}}
                </el-radio>
            </el-radio-group>
        </div>
        <br>
        <br>
        <br>
        <br>

        <!--<div class="ques-list-group">-->
        <!--<el-checkbox-group-->
        <!--v-model="ques_list_selectid" v-if="qsTypeSelect==='vArithmetic'">-->
        <!--<el-checkbox v-for="item in ques_list" :label="item.id" :key="item.id" border>{{item.content}}-->
        <!--</el-checkbox>-->
        <!--</el-checkbox-group>-->

        <!--<el-checkbox-group-->
        <!--v-model="ques_list_selectid" v-else-if="qsTypeSelect==='QABattle'">-->
        <!--<el-checkbox v-for="item in ques_list" :label="item.id" :key="item.id" border>{{item.content}}-->
        <!--</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</div>-->

        <el-button class="btn-distribute" @click="distribute" type="primary" icon="el-icon-upload2"
                   :loading="distriLoading">发布题目
        </el-button>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                // 题型列表
                ques_type_list: [],
                // 选择的题型id
                ques_type_selectid: 1,
                // 题目列表
                ques_list: [],
                // 选择的题目id列表
                ques_list_selectid: [1],
            };
        },
        computed: {
            ...mapState('teacher', [
                'quesData',
                'distriLoading'
            ])
        },
        mounted() {
            const self = this;
            // 获取题型列表
            this.$http('GET', '/static/dataJson/ques_type.json', {}, (data) => {
                self.ques_type_list = data.list;
            })
        },
        methods: {
            // 分布题目
            distribute() {
                const self = this;
                // 向学生端分发题目
                websocket.send(JSON.stringify({
                    type: 'distribute', // 分发题目
                    data: {
                        time: 120, // 答题时间
                        type: self.ques_type_selectid,
                        quesData: self.ques_list_selectid.join(',')
                    }
                }));
                this.$store.dispatch('teacher/distriForLoading');
            },
            // 获得对应题型内容
            getQues(index) {
                const self = this;
                this.$http('GET', '/static/dataJson/' + this.ques_type_list[index].type + '.json', {}, (data) => {
                    self.ques_list = data.list;
                })
            }
        },
    };
</script>
<style lang="scss">
    .ques-list-group {
        max-width : 600px;
        margin    : 50px auto;
        label {
            display : block;
            margin  : 15px auto !important;
            height  : auto !important;
        }
        .el-checkbox__label {
            font-size   : 18px;
            line-height : normal;
        }
        .btn-distribute {
            display : block;
            margin  : 30px auto;
        }
    }
</style>
