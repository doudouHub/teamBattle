<!--  对战问答  -->
<template>
    <div>
        <br>
        <br>
        <div class="battle-panel">
            <div class="battle-head" :data-myname="$store.state.userInfo.name" :data-othername="matching[0].name">
                <div class="battle-score mine">{{total_score}}</div>
                <div class="battle-score other">208</div>
                <el-progress
                    type="circle"
                    :class="count_down_animate"
                    :percentage="count_down_percent"
                    :width="80"
                    :stroke-width="10"
                    :aria-lefttime="count_down_left"
                    :status="count_down_status"
                    :show-text="false">
                </el-progress>
            </div>
            <div class="battle-content text-center">
                <!--  竖直分数进度  -->
                <el-progress class="score-progress mine"
                             :percentage="40"
                             status="exception"
                             :stroke-width="10"
                             :show-text="false"></el-progress>
                <el-progress class="score-progress other"
                             :percentage="80"
                             :stroke-width="10"
                             :show-text="false"></el-progress>
                <br>
                <!--  题目标题  -->
                <h2>{{ques_list[ques_run_index].title}}</h2>
                <br>
                <!--  题目选项  -->
                <ul class="battle-options list-none noselect" :class="cur_options_select?'hasdone':''">
                    <li v-for="(value, key) in ques_list[ques_run_index].options"
                        :class="cur_options_select===key?(cur_check?'right':'wrong'):''"
                        @click="confirmAnswer(key)">
                        {{value}}
                        <i class="el-icon-close"></i>
                    </li>
                </ul>
            </div>
        </div>
        <br><br>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                ques_list: [{
                    title: '',
                    options: []
                }],
                // 我的总分
                total_score: 0,
                // 题目列表
                ques_run_index: 0,
                // 单题倒计时
                count_down: 10,
                // 单题剩余时间
                count_down_left: 10,
                // 单题倒计时计时器
                count_down_timer: null,
                // 倒计时动画状态 animate-none 无动画
                count_down_animate: 'animate-none',

                // 当前题目选择的答案
                cur_options_select: '',
                // 当前题目答案的对错
                cur_check: false
            }
        },
        computed: {
            ...mapState('student', [
                'matching',
                'otherChecks'
            ]),
            ...mapGetters('student', [
                'allReadyStart'
            ]),
            // 倒计时剩余百分比
            count_down_percent() {
                return this.count_down_left === this.count_down ? 100 : !this.count_down_left ? 0 : (this.count_down_left - 1) / this.count_down * 100
            },
            // 倒计时状态
            count_down_status() {
                return this.count_down_percent < 50 ? 'exception' : (this.count_down_percent < 80 ? '' : 'success')
            },
        },
        watch: {
            allReadyStart(val) {
                // 确认对方题型已经加载完毕,并且已经过完倒计时，执行竞赛开始
                this.battleStart();
            }
        },
        mounted() {
            const self = this;
            // 获得对应题型内容
            this.$http('GET', false, './static/dataJson/qaBattle.json', {}, (data) => {
                self.ques_list = data.list;
                self.count_down = data.pre_time;
                self.count_down_left = data.pre_time;
                // 通知对方已经准备就绪
                websocket.send(JSON.stringify({type: 'battle_isReady'}));
                if (self.otherIsReady) {
                    // 如果对方已经准备好，直接开始
                    self.battleStart();
                }
            })
        },
        methods: {
            // 对战开始
            battleStart() {
                const self = this;
                // 对战倒计时计时器
                this.count_down_timer = setInterval(function () {
                    // 恢复倒计时动画
                    self.count_down_animate = '';
                    self.count_down_left--;
                    if (!self.count_down_left) {
                        self.nextQuestion();
                    }
                }, 1000);
            },
            // 开始下一题
            nextQuestion() {
                const self = this;
                clearInterval(this.count_down_timer);
                this.count_down_timer = null;
                setTimeout(() => {
                    // 取消倒计时动画
                    self.count_down_animate = 'animate-none';
                    // 跳转到下一题
                    if (self.ques_list.length === (self.ques_run_index + 1)) {
                        self.battleOver();
                    } else {
                        self.ques_run_index++;
                        self.count_down_left = self.count_down;
                        self.battleStart();
                    }
                }, 1000)
            },
            // 对战结束
            battleOver() {
                const self = this;
            },
            // 确认答案
            confirmAnswer(val) {
                const self = this;
                let cur_question = this.ques_list[this.ques_run_index],
                    check = (cur_question.answer === val);

                this.cur_options_select = val;
                this.cur_check = check;

                this.$set(cur_question, 'confirm', true);
                this.$set(cur_question, 'check', check);
                // 累积个人总分
                this.total_score += Number(check ? cur_question.score : 0);

                // 传递最新结果展示
                websocket.send(JSON.stringify({
                    type: 'result',
                    data: {
                        userId: self.$store.state.userInfo.id,
                        index: this.ques_run_index,
                        check: check,
                        total_score: self.total_score
                    }
                }));
            },
        }
    }
</script>


<style lang="scss" slot-scoped>
    @import "../../styles/mixins";

    html {
        background-color : #f4f4f4;
    }

    /* 对战面板 */
    .battle-panel {
        width     : 100%;
        max-width : 660px;
        margin    : 0 auto;
        .battle-head {
            position         : relative;
            text-align       : center;
            font-size        : 32px;
            font-weight      : bold;
            color            : #666;
            height           : 50px;
            background-color : #fff;
            border-radius    : 50px;
            border           : 1px solid #ddd;
            &:before, &:after {
                @include stretch(0, false, false, false);
                line-height : 50px;
                font-size   : 16px;
                z-index     : 10;
                padding     : 0 15px;
            }
            &:before {
                content : attr(data-myname);
                left    : 0;
            }
            &:after {
                content : attr(data-othername);
                right   : 0;
            }
            .battle-score {
                @include stretch(0, false, false, false);
                line-height : 50px;
                font-size   : 16px;
                padding     : 0 15px;
                &.mine {
                    right        : 50%;
                    margin-right : 50px;
                }
                &.other {
                    left        : 50%;
                    margin-left : 50px;
                }
            }
            .el-progress {
                position         : relative;
                z-index          : 10;
                background-color : #fff;
                border-radius    : 50%;
                @include stretch(50%, false, false, 50%);
                margin           : -40px auto auto -40px;
                &:after {
                    content     : attr(aria-lefttime);
                    @include stretch(50%, false, false, 50%);
                    margin      : -40px auto auto -40px;
                    width       : 100%;
                    height      : 100%;
                    line-height : 80px;
                    font-size   : 30px;
                    text-align  : center;
                }
                .el-progress-circle {
                    path {
                        transition-duration                : 1s !important;
                        -webkit-transition-duration        : 1s !important;
                        transition-timing-function         : linear !important;
                        -webkit-transition-timing-function : linear !important;
                    }
                }
                &.animate-none {
                    .el-progress-circle {
                        path {
                            transition-duration         : 0s !important;
                            -webkit-transition-duration : 0s !important;
                        }
                    }
                }
            }
        }

        .battle-content {
            position : relative;
            height   : 400px;
            .score-progress {
                @include stretch(400px, false, false, false);
                transform                : rotateZ(-90deg);
                -webkit-transform        : rotateZ(-90deg);
                transform-origin         : 0 50%;
                -webkit-transform-origin : 0 50%;
                width                    : 300px;
                .el-progress-bar__outer {
                    background-color : #fff;
                    border           : 1px solid #eee;
                }
                &.mine {
                    left        : 0;
                    margin-left : 10px;
                }
                &.other {
                    left        : 100%;
                    margin-left : -10px;
                }
            }
        }
        .battle-options {
            transition : transform .5s;
            transition : -webkit-transform .5s;
            li {
                line-height      : 44px;
                border           : 1px solid #ddd;
                border-radius    : 50px;
                margin           : 0 auto 20px;
                background-color : #fff;
                font-size        : 18px;
                width            : 300px;
                cursor           : pointer;
                transition       : transform .5s, opacity .5s, background-color .5s;
                transition       : -webkit-transform .5s, opacity .5s, background-color .5s;
            }
            &.hasdone {
                transform         : scale3d(.98, .98, 1);
                -webkit-transform : scale3d(.98, .98, 1);
                li {
                    opacity : .5;
                    .el-icon-close {
                        display     : none;
                        @include stretch(50%, 20px, false, false);
                        z-index     : 100;
                        color       : #fff;
                        margin-top  : -9px;
                        font-weight : bold;
                    }
                    &.wrong, &.right {
                        transform         : scale3d(1.02, 1.02, 1);
                        -webkit-transform : scale3d(1.02, 1.02, 1);
                        opacity           : 1;
                        color             : #fff;
                        font-weight       : bold;
                    }
                    &.wrong {
                        background-color : #f56c6c;
                        border-color     : #f56c6c;
                        .el-icon-close {
                            display : block;
                        }
                    }
                    &.right {
                        background-color : #67c23a;
                        border-color     : #67c23a;
                        &:before {
                            content       : '';
                            display       : block;
                            @include stretch(50%, false, false, 20px);
                            z-index       : 100;
                            width         : 10px;
                            height        : 10px;
                            border        : 3px solid #fff;
                            border-radius : 50%;
                            margin-top    : -8px;
                        }
                    }
                }

            }
        }
    }
</style>
