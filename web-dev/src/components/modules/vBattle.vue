<template>
    <div v-if="matching.statu">
        <!--  对战面板  -->
        <br>
        <h2 class="text-center">对战面板</h2>
        <div class="battle-panel">
            <div class="battle-head">
                <div v-if="!batterStatu">{{time.min}} : {{time.sec}}</div>
                <div class="over-title" v-else>对战结束</div>
                <!--  倒计时进度条  -->
                <el-progress
                    :stroke-width="2"
                    :percentage="progress>100?100:progress"
                    :status="progStatu"
                    :show-text="false"
                    :class="progress>100?'noTransition':''"
                ></el-progress>
            </div>
            <el-row class="battle-content">
                <el-col :span="12" class="battle-content-left">
                    <div class="battle-box-head">
                        {{$route.query.username}}
                    </div>
                    <!--  答题区域  -->
                    <ul class="answer-box">
                        <li class="ques-item"
                            v-for="(item,index) in quesOptions"
                            :key="item.id"
                            :disabled="(item.confirm||batterStatu)"
                            :aria-right="item.check && (item.confirm||batterStatu)"
                            :aria-wrong="!item.check && (item.confirm||batterStatu)"
                        >
                            <el-input placeholder="请输入答案" v-model="item.fillin">
                                <template slot="prepend">{{item.content}}</template>
                                <el-button slot="append" icon="el-icon-check"
                                           @click="confirmAnswer(index,item.fillin)"
                                           v-if="!item.confirm && !batterStatu">
                                    确认
                                </el-button>
                                <template slot="prepend" v-if="batterStatu">{{item.answer}}</template>
                            </el-input>
                            <i class="check-statu-icon el-icon-check animated fadeInRight"
                               v-if="item.check && (item.confirm||batterStatu)"></i>
                            <i class="check-statu-icon el-icon-close animated fadeInRight"
                               v-if="!item.check && (item.confirm||batterStatu)"></i>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="12" class="battle-content-right">
                    <div class="battle-box-head">
                        {{matching.userName}}
                    </div>
                    <!--  对方答题结果展示  -->
                    <ul class="answer-box">
                        <li class="ques-item"
                            v-for="item in otherChecks"
                            :key="item.id"
                            :aria-right="item.check && (item.confirm||batterStatu)"
                            :aria-wrong="!item.check && (item.confirm||batterStatu)"
                        >
                            <i class="check-statu-icon el-icon-check animated fadeInRight"
                               v-if="item.check && (item.confirm||batterStatu)"></i>
                            <i class="check-statu-icon el-icon-close animated fadeInRight"
                               v-else-if="!item.check && (item.confirm||batterStatu)"></i>
                            <div style="font-size: 16px;color: #666;" v-else>待作答...</div>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    const quesOptions = [
        {
            id: 1,
            content: '1+1=',
            answer: '2'
        },
        {
            id: 2,
            content: '2+2=',
            answer: '4'
        },
        {
            id: 3,
            content: '3+3=',
            answer: '6'
        },
        {
            id: 4,
            content: '4+4=',
            answer: '8'
        },
        {
            id: 5,
            content: '5+5=',
            answer: '10'
        },
        {
            id: 6,
            content: '6+6=',
            answer: '12'
        }
    ];
    export default {
        data() {
            return {
                time: {
                    min: '00',
                    sec: '00'
                },
                progress: 0,
                progStatu: 'success',
                battleTimer: null,
                // 对战状态 fasle 初始/正在对战，true 对战结束
                batterStatu: false,

                quesOptions: quesOptions
            }
        },
        computed: {
            ...mapGetters([
                'quesData',
                'matching',
                'user',
                'otherChecks'
            ])
        },
        watch: {
            'matching.statu'(val) {
                if (val) {
                    this.battleStart();
                }
            }
        },
        mounted() {
            const self = this;
            // 初始化对方作答区域
            let otherAnswerList = [];
            for (let i = 0; i < quesOptions.length; i++) {
                otherAnswerList.push({id: i})
            }
            this.$store.commit('updateAnswering', otherAnswerList);
        },
        methods: {
            // 对战开始
            battleStart() {
                const self = this;
                let total_time = this.quesData.time;

                this.time = this.formatTime(total_time);
                // 对战倒计时
                this.battleTimer = setInterval(function () {
                    if (!total_time) {
                        // 倒计时结束,对战结束
                        clearInterval(self.battleTimer);
                        self.battleOver();
                    } else {
                        total_time--;
                        self.progress = (1 - (total_time - 1) / self.quesData.time) * 100;
                        self.time = self.formatTime(total_time);
                        if ((total_time / self.quesData.time) > 40 && total_time > 10) {
                            self.progStatu = '';
                        } else if (total_time <= 10) {
                            self.progStatu = 'exception';
                        }
                    }
                }, 1000);
            },
            // 转换时间为分秒
            formatTime(time) {
                let sec = parseInt(time % 60),
                    min = parseInt(time / 60);

                return {
                    min: min < 10 ? ('0' + min) : min,
                    sec: sec < 10 ? ('0' + sec) : sec
                };
            },
            // 确认答案
            confirmAnswer(index, val) {
                if (val == '' || val == undefined) return;
                console.log(val)
                const self = this;
                let check = (this.quesOptions[index].answer === val);

                this.$set(this.quesOptions[index], 'confirm', true);
                this.$set(this.quesOptions[index], 'check', check);
                // 传递最新结果展示
                websocket.send(JSON.stringify({
                    type: 'result',
                    data: {
                        userId: self.$route.query.userid,
                        index: index,
                        check: check
                    }
                }));
            },
            // 对战结束
            battleOver() {
                const self = this;
                this.batterStatu = true;
            }
        }
    }
</script>

<style lang="scss">
    @import "../../styles/mixins";

    html {
        background-color : #f4f4f4;
    }

    /* 对战面板 */
    .battle-panel {
        border-radius    : 5px;
        border           : 1px solid #ddd;
        background-color : #fff;
        max-width        : 1200px;
        margin           : 20px auto 50px;
        .over-title {

        }
        .battle-head {
            position    : relative;
            line-height : 80px;
            text-align  : center;
            font-size   : 32px;
            font-weight : bold;
            color       : #666;
            .el-progress {
                position : absolute;
                left     : 0;
                right    : 0;
                bottom   : 0;
                z-index  : 1;
                &.noTransition {
                    .el-progress-bar__inner {
                        transition : none;
                    }
                }
            }
            .el-progress-bar__inner {
                width      : 0;
                transition : width linear 1s;
            }
            .el-progress-bar__outer, .el-progress-bar__inner {
                border-radius : 0;
            }
        }
        .battle-content .el-col {
            font-size : 18px;
            &:first-child {
                border-right : 1px solid #ddd;
            }
        }
        .battle-box-head {
            line-height      : 44px;
            border-bottom    : 1px solid #f5f5f5;
            background-color : #fafafa;
            text-align       : center;
        }
    }

    /* 答题区域 */
    .battle-content-left {
        .check-statu-icon {
            @include stretch(50%, 30px, false, false);
            margin-top : -20px;
        }
    }

    .battle-content-right {
        .check-statu-icon {
            line-height : 80px;
        }
    }

    .answer-box {
        margin     : 0;
        padding    : 0;
        list-style : none;
        font-size  : 24px;
        text-align : center;

        .check-statu-icon {
            font-size   : 40px;
            font-weight : bold;
            z-index     : 10;
        }

        .ques-item {
            position      : relative;
            margin        : 0;
            line-height   : 80px;
            height        : 80px;
            padding       : 0 90px;
            border-bottom : 1px solid #ddd;
            transition    : background-color linear .2s;
            &[disabled]:before {
                content : '';
                @include stretch();
                z-index : 100;
            }
            &[aria-right='true'] {
                background-color : #f0f9eb;
                .check-statu-icon {
                    color : #67c23a;
                }
            }
            &[aria-wrong='true'] {
                background-color : #fef0f0;
                .check-statu-icon {
                    color : #f56c6c;
                }
            }
            .el-input {
                max-width : 360px;
                margin    : 0 auto;
                input {
                    font-size : 18px;
                }
            }
        }
        .el-input-group__prepend {
            width            : 40%;
            font-size        : 24px;
            background-color : transparent;
            border           : none;
            text-align       : right;
            color            : #333;
        }
    }
</style>
