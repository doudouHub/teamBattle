<!--  对战问答  -->
<template>
    <div>
        <div class="battle-panel qaBattle" :class="bgBlur">
            <h2 class="text-center">对战面板</h2>
            <br>
            <br>
            <div class="battle-head" :data-myname="$store.state.userInfo.name" :data-othername="matching[0].name">
                <div class="battle-score mine">{{total_score}}</div>
                <div class="battle-score other">{{otherScore}}</div>
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
                             :percentage="total_score_progress"
                             status="exception"
                             :stroke-width="10"
                             :show-text="false"></el-progress>
                <el-progress class="score-progress other"
                             :percentage="otherScore/full_marks_score*100"
                             :stroke-width="10"
                             :show-text="false"></el-progress>
                <br>
                <transition
                    name="fade"
                    enter-active-class="animated bounceIn"
                    leave-active-class="animated fadeOut"
                >
                    <div v-if="cur_ques_loaded">
                        <!--  题目标题  -->
                        <h2>{{ques_list[ques_run_index].title}}</h2>
                        <br>
                        <!--  题目选项 cur_options_select 个人已经做出选择后显示双方答案状态 -->
                        <ul class="battle-options list-none noselect"
                            :class="(cur_alluser_selected?'hasdone':'') +' '+ (cur_options_select?'hasSelect':'')">
                            <!--  class判断：1：当前我的选择位置；2：当前我的答案对错，3：当前对方选择位置并且在我完成后一并显示；4：当前对方答案对错  -->
                            <v-touch tag="li"
                                     v-for="(value, key) in ques_list[ques_run_index].options"
                                     :key="key"
                                     :class="(cur_options_select===key?(cur_check?'right-mine':'wrong-mine'):'')+' '+(otherAnswer[ques_run_index]===key && cur_alluser_selected?(otherChecks[ques_run_index].check?'right-other':'wrong-other'):'')+' '+(ques_list[ques_run_index].answer===key && otherAnswer[ques_run_index]?'right':'')"
                                     @tap="confirmAnswer(key)">
                                {{value}}
                                <i class="el-icon-close left" v-if="cur_options_select"></i>
                                <i class="el-icon-close right" v-if="otherAnswer[ques_run_index]"></i>
                            </v-touch>
                        </ul>
                    </div>
                </transition>
            </div>
        </div>
        <br><br>
        <battle-over :battle_over="battle_over" :myScore="total_score"></battle-over>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import battleOver from '../../student/modules/battle_over'

    export default {
        components: {
            battleOver
        },
        data () {
            return {
                // 背景模糊
                bgBlur: 'bgBlur',

                ques_list: [{
                    title: '',
                    answer: '',
                    options: []
                }],
                // 我的总分
                total_score: 0,
                // 题型的满分
                full_marks_score: 1,
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
                cur_check: false,
                // 当前题目状态为双方已答题
                cur_alluser_selected: false,
                // 当前题目是否加载显示
                cur_ques_loaded: true,

                // 对战结束状态
                battle_over: false
            }
        },
        computed: {
            ...mapState('student', [
                'matching',
                'otherChecks',
                'otherScore',
                'otherAnswer'
            ]),
            ...mapGetters('student', [
                'allReadyStart'
            ]),
            // 倒计时剩余百分比
            count_down_percent () {
                return this.count_down_left === this.count_down ? 100 : !this.count_down_left ? 0 : (this.count_down_left - 1) / this.count_down * 100
            },
            // 倒计时状态
            count_down_status () {
                return this.count_down_percent < 50 ? 'exception' : (this.count_down_percent < 80 ? '' : 'success')
            },
            // 我的分数进度
            total_score_progress () {
                return this.total_score / this.full_marks_score * 100;
            }
        },
        watch: {
            allReadyStart () {
                // 确认对方题型已经加载完毕,并且已经过完倒计时，执行竞赛开始
                this.battleStart();
            },
            otherAnswer (val) {
                // 如果手动对方提交了答案，判断我方是否答题，如果是则进行下一题
                if (this.cur_options_select && val[this.ques_run_index] !== 'false') this.nextQuestion();
            }
        },
        mounted () {
            const self = this;
            // 获得对应题型内容
            this.$http('GET', false, './static/dataJson/qaBattle.json', {}, (data) => {
                self.ques_list = data.list;
                self.count_down = data.pre_time;
                self.count_down_left = data.pre_time;
                // 统计总分
                let _result = 0;
                for (let i = 0; i < data.list.length; i++) {
                    _result += Number(data.list[i].score);
                }
                self.full_marks_score = _result;

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
            battleStart () {
                const self = this;

                // 去除背景模糊
                this.bgBlur = '';
                // 重置选择的答案
                this.cur_options_select = '';
                this.cur_alluser_selected = false;

                // 对战倒计时计时器
                this.count_down_timer = setInterval(function () {
                    // 恢复倒计时动画
                    self.count_down_animate = '';
                    self.count_down_left--;
                    if (self.count_down_left <= 0) {
                        // 结束计时器
                        self.clearTimer();
                        // 如果题目被提前结束，不在这里切换下一题
                        if (self.cur_alluser_selected) return;
                        self.nextQuestion();
                    }
                }, 1000);
            },
            // 开始下一题
            nextQuestion () {
                const self = this;
                // 如果倒计时结束还没有做出选择，系统直接默认选错提交
                if (!this.cur_options_select) this.confirmAnswer('false');
                this.cur_alluser_selected = true;

                setTimeout(() => {
                    // 提前结束计时器
                    self.clearTimer();

                    // 取消倒计时动画
                    self.count_down_animate = 'animate-none';
                    // 跳转到下一题
                    if (self.ques_list.length === (self.ques_run_index + 1)) {
                        self.battleOver();
                    } else {
                        self.toggleLoading();
                        self.ques_run_index++;
                        self.count_down_left = self.count_down;
                        self.battleStart();
                    }
                }, 2500)
            },
            // 清除计时器
            clearTimer () {
                // 清除上一题计时器
                if (this.count_down_timer) {
                    clearInterval(this.count_down_timer);
                    this.count_down_timer = null;
                }
            },
            // 题目切换载入动画设置
            toggleLoading () {
                const self = this;
                // 卸载就题目，500ms 后重新载入题型
                this.cur_ques_loaded = false;
                setTimeout(() => {
                    self.cur_ques_loaded = true;
                }, 300)
            },
            // 对战结束
            battleOver () {
                this.battle_over = true;
                // 添加背景模糊
                this.bgBlur = 'bgBlur';
            },
            // 确认答案
            confirmAnswer (val) {
                // 不可重复答题
                if (this.cur_options_select) return;

                const self = this;
                let cur_question = this.ques_list[this.ques_run_index],
                    check = (cur_question.answer === val);

                // 当前答案
                this.cur_options_select = val;
                // 当前的对错
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
                        answer: val,
                        total_score: self.total_score
                    }
                }));
                // 当对方也已经打完题，直接进入下一题
                if (this.otherAnswer[this.ques_run_index] && val !== 'false') this.nextQuestion();
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../styles/mixins";

    html {
        background-color: #f4f4f4;
    }

    /* 对战面板 */
    .battle-panel.qaBattle {
        width: 100%;
        max-width: 660px;
        margin: 0 auto;
        transition: filter .3s;
        &.bgBlur {
            -webkit-filter: blur(10px);
            filter: blur(10px);
        }
        .battle-head {
            position: relative;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #666;
            height: 50px;
            background-color: #fff;
            border-radius: 50px;
            border: 1px solid #ddd;
            &:before, &:after {
                @include stretch(0, false, false, false);
                line-height: 50px;
                font-size: 16px;
                z-index: 10;
                padding: 0 15px;
            }
            &:before {
                content: attr(data-myname);
                left: 0;
            }
            &:after {
                content: attr(data-othername);
                right: 0;
            }
            .battle-score {
                @include stretch(0, false, false, false);
                line-height: 50px;
                font-size: 16px;
                padding: 0 15px;
                &.mine {
                    right: 50%;
                    margin-right: 50px;
                }
                &.other {
                    left: 50%;
                    margin-left: 50px;
                }
            }
            .el-progress {
                position: relative;
                z-index: 10;
                background-color: #fff;
                border-radius: 50%;
                @include stretch(50%, false, false, 50%);
                margin: -40px auto auto -40px;
                &:after {
                    content: attr(aria-lefttime);
                    @include stretch(50%, false, false, 50%);
                    margin: -40px auto auto -40px;
                    width: 100%;
                    height: 100%;
                    line-height: 80px;
                    font-size: 30px;
                    text-align: center;
                }
                .el-progress-circle {
                    path {
                        transition-duration: 1s !important;
                        -webkit-transition-duration: 1s !important;
                        transition-timing-function: linear !important;
                        -webkit-transition-timing-function: linear !important;
                    }
                }
                &.animate-none {
                    .el-progress-circle {
                        path {
                            transition-duration: 0s !important;
                            -webkit-transition-duration: 0s !important;
                        }
                    }
                }
            }
        }

        .battle-content {
            position: relative;
            height: 400px;
            .score-progress {
                @include stretch(400px, false, false, false);
                transform: rotateZ(-90deg);
                -webkit-transform: rotateZ(-90deg);
                transform-origin: 0 50%;
                -webkit-transform-origin: 0 50%;
                width: 300px;
                .el-progress-bar__outer {
                    background-color: #fff;
                    border: 1px solid #eee;
                }
                .el-progress-bar__inner {
                    transition: width .3s;
                }
                &.mine {
                    left: 0;
                    margin-left: 10px;
                }
                &.other {
                    left: 100%;
                    margin-left: -10px;
                }
            }
        }
        .battle-options {
            transition: transform .5s;
            transition: -webkit-transform .5s;
            li {
                line-height: 44px;
                border: 1px solid #ddd;
                border-radius: 50px;
                margin: 0 auto 20px;
                background-color: #fff;
                font-size: 18px;
                width: 300px;
                cursor: pointer;
                transition: transform .5s, opacity .5s, background-color .5s;
                transition: -webkit-transform .5s, opacity .5s, background-color .5s;
                .el-icon-close {
                    display: none;
                    position: absolute;
                    top: 50%;
                    z-index: 100;
                    color: #fff;
                    margin-top: -9px;
                    font-weight: bold;
                }
                // 我的答案错误，我的答案正确，对方的答案错误，对方的答案正确
                &.wrong-mine, &.right-mine, &.wrong-other, &.right-other {
                    transform: scale3d(1.02, 1.02, 1);
                    -webkit-transform: scale3d(1.02, 1.02, 1);
                    opacity: 1 !important;
                    color: #fff;
                    font-weight: bold;
                }
                &.wrong-mine, &.wrong-other {
                    background-color: #f56c6c;
                    border-color: #f56c6c;
                }
                &.wrong-mine {
                    .el-icon-close.left {
                        display: block;
                        left: 20px;
                    }
                }
                &.wrong-other {
                    .el-icon-close.right {
                        display: block;
                        right: 20px;
                    }
                }
                &.right-mine, &.right-other {
                    background-color: #67c23a;
                    border-color: #67c23a;
                }
                &.right-mine:before, &.right-other:after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 50%;
                    z-index: 100;
                    width: 10px;
                    height: 10px;
                    border: 3px solid #fff;
                    border-radius: 50%;
                    margin-top: -8px;
                }
                &.right-mine:before {
                    left: 20px;
                }
                &.right-other:after {
                    right: 20px;
                }
            }
            // 选择后样式
            &.hasdone {
                transform: scale3d(.95, .95, 1);
                -webkit-transform: scale3d(.95, .95, 1);
                li {
                    opacity: .5;
                    // 正确答案
                    &.right {
                        transform: scale3d(1.06, 1.06, 1);
                        -webkit-transform: scale3d(1.06, 1.06, 1);
                        opacity: 1;
                        color: #fff;
                        font-weight: bold;
                        background-color: #67c23a;
                        border-color: #67c23a;
                    }
                }
            }
            &.hasSelect {
                li {
                    cursor: default;
                }
            }
        }
    }
</style>
