<template>
    <div class="text-center">
        <br>
        <br>
        <h1>发布题目</h1>
        <br>

        <div>
            <el-radio v-model="qsType" label="vArithmetic" border @change="getQues">算术题</el-radio>
            <el-radio v-model="qsType" label="QABattle" border @change="getQues">对战问答</el-radio>
        </div>
        <br>
        <br>
        <br>
        <br>

        <!--<div class="ques-list-group">-->
        <!--<el-checkbox-group-->
        <!--v-model="checkedQues" v-if="qsTypeSelect==='vArithmetic'">-->
        <!--<el-checkbox v-for="item in quesOptions" :label="item.id" :key="item.id" border>{{item.content}}-->
        <!--</el-checkbox>-->
        <!--</el-checkbox-group>-->

        <!--<el-checkbox-group-->
        <!--v-model="checkedQues" v-else-if="qsTypeSelect==='QABattle'">-->
        <!--<el-checkbox v-for="item in quesOptions" :label="item.id" :key="item.id" border>{{item.content}}-->
        <!--</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</div>-->

        <el-button class="btn-distribute" @click="distribute" type="primary" icon="el-icon-upload2"
                   :loading="distriLoading">发布题目
        </el-button>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                qsType: 1,
                qsTypeSelect: '',
                checkedQues: [1],
                quesOptions: [
                    {
                        id: 1,
                        content: '1+1=?'
                    },
                    {
                        id: 2,
                        content: '2+2=?'
                    },
                    {
                        id: 3,
                        content: '3+3=?'
                    },
                    {
                        id: 4,
                        content: '4+4=?'
                    },
                    {
                        id: 5,
                        content: '5+5=?'
                    },
                    {
                        id: 6,
                        content: '6+6=?'
                    }
                ]
            };
        },
        methods: {
            // 分布题目
            distribute() {
                const self = this;
                // 分发题目
                websocket.send(JSON.stringify({
                    type: 'distribute', // 分发题目
                    data: {
                        time: 120, // 答题时间
                        type: self.qsTypeSelect,
                        quesData: self.checkedQues.join(',')
                    }
                }));
                this.$store.commit('showDistriLoading', this);
            },
            // 获得对应题型
            getQues(val) {
                this.qsTypeSelect = val;
            }
        },
        computed: mapGetters([
            'quesData',
            'distriLoading'
        ])
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
