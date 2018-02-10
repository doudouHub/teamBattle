<!--  算术题  -->
<template>
    <div :class="bgBlur">
        <h2 class="text-center">{{ques_title}}</h2>
        <div class="battle-panel breakBrick">
            <div class="battle-head" :data-myname="$store.state.userInfo.name" :data-othername="matching[0].name">
                <!--  双方的分数  -->
                <div class="battle-score mine">{{total_score}}</div>
                <div class="battle-score other">{{otherScore}}</div>

                <div v-if="!battle_over">{{battle_time.min}} : {{battle_time.sec}}</div>
                <div class="over-title" v-else>对战结束</div>
                <!--  倒计时进度条  -->
                <el-progress
                    :stroke-width="2"
                    :percentage="battle_progress>100?100:battle_progress"
                    :status="battle_progStatu"
                    :show-text="false"
                    :class="battle_progress>100?'noTransition':''"
                ></el-progress>
            </div>
            <div class="battle-content">
                <ul class="bricks-box list-none">
                    <v-touch
                        tag="li"
                        v-for="(item,index) in ques_list"
                        :key="item.id"
                        :class="(battle_started?'dropdown':'')+' '+(item.prop?'right':'wrong')+' '+(item.selected?'selected animated zoomOut':'')"
                        :style="'margin-left:'+ item.margin +'px;left:'+(item.posTimes*12)+'%;transition-duration: '+ item.speed +'s;-webkit-transition-duration: '+ item.speed +'s;transition-delay: '+ item.delay +'s;-webkit-transition-delay: '+ item.delay +'s;'"
                        @tap="breakBrick(index,item.prop)"
                        v-if="!item.confirm && !otherChecks[index].confirm">
                        {{item.title}}
                    </v-touch>
                </ul>
            </div>
        </div>
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
        data() {
            return {
                // 背景模糊
                bgBlur: 'bgBlur',

                total_time: 0,
                // 我的总分
                total_score: 0,
                battle_time: {
                    min: '00',
                    sec: '00'
                },
                battle_progress: 0,
                battle_progStatu: 'success',
                battle_timer: null, // 对战计时器
                battle_over: false, // 对战状态 true 初始/正在对战，false 对战结束
                battle_started: false, // 记录对战是否已经开始

                ques_list: [], // 题目列表
                ques_title: ''
            }
        },
        computed: {
            ...mapState('student', [
                'matching',
                'otherChecks',
                'otherScore'
            ]),
            ...mapGetters('student', [
                'allReadyStart'
            ]),
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
            this.$http('GET', false, './static/dataJson/breakBrick.json', {}, (data) => {
                self.ques_list = data.list;
                self.ques_title = data.title;
                self.total_time = data.total_time;
                // 通知对方已经准备就绪 - 并传递生成的对战规则
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
                // 去除背景模糊
                this.bgBlur = '';
                this.battle_started = true;

                let total_time = this.total_time;

                this.battle_time = this.formatTime(total_time);
                // 对战倒计时
                this.battle_timer = setInterval(function () {
                    if (!total_time) {
                        // 倒计时结束,对战结束
                        clearInterval(self.battle_timer);
                        self.battleOver();
                    } else {
                        total_time--;
                        self.battle_progress = (1 - (total_time - 1) / self.total_time) * 100;
                        self.battle_time = self.formatTime(total_time);
                        if ((total_time / self.total_time) > 40 && total_time > 10) {
                            self.battle_progStatu = '';
                        } else if (total_time <= 10) {
                            self.battle_progStatu = 'exception';
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
            // 对战结束
            battleOver() {
                this.battle_over = true;
                // 添加背景模糊
                this.bgBlur = 'bgBlur';
            },
            // 确认答案
            // confirmAnswer(index, val) {
            //     if (val == '' || val == undefined) return;
            //     // console.log(val)
            //     const self = this;
            //     let check = (this.ques_list[index].answer === val);
            //
            //     this.$set(this.ques_list[index], 'confirm', true);
            //     this.$set(this.ques_list[index], 'check', check);
            //     this.total_score += check ? this.ques_list[index].score : 0;
            //
            //     // 传递最新结果展示
            //     websocket.send(JSON.stringify({
            //         type: 'result',
            //         data: {
            //             userId: self.$store.state.userInfo.id,
            //             index: index,
            //             check: check,
            //             total_score: self.total_score
            //         }
            //     }));
            // },
            // 敲击砖块
            breakBrick(index, prop) {
                const self = this;
                this.$set(this.ques_list[index], 'selected', true);
                setTimeout(() => {
                    self.$set(this.ques_list[index], 'confirm', true);
                }, 1000);
                prop ? this.total_score++ : this.total_score--;
                // 传递最新结果展示
                websocket.send(JSON.stringify({
                    type: 'result',
                    data: {
                        userId: this.$store.state.userInfo.id,
                        index: index,
                        check: prop,
                        total_score: this.total_score
                    }
                }));
            }
        }
    }
</script>


<style lang="scss">
    @import "../../../styles/mixins";

    html {
        background-color : #f4f4f4;
    }

    // 砖块和的高度
    $box-height : 600px;

    /* 对战面板 */
    .battle-panel.breakBrick {
        border-radius    : 5px;
        border           : 1px solid #ddd;
        background-color : #fff;
        max-width        : 1200px;
        margin           : 20px auto 50px;
        transition       : filter .3s;
        &.bgBlur {
            -webkit-filter : blur(10px);
            filter         : blur(10px);
        }
        .battle-head {
            position    : relative;
            line-height : 80px;
            text-align  : center;
            font-size   : 32px;
            font-weight : bold;
            color       : #666;
            &:before, &:after {
                @include stretch(false, false, 100%, false);
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
                line-height : 80px;
                font-size   : 28px;
                padding     : 0 15px;
                &.mine {
                    left : 0;
                }
                &.other {
                    right : 0;
                }
            }
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
        .battle-content {
            height           : $box-height;
            background-color : #f2f2f2;
            overflow         : hidden;
            padding          : 0 30px;
        }
        .bricks-box {
            position : relative;
            width    : 100%;
            height   : 100%;
            margin   : 0;
            li {
                @include stretch(false, false, 100%, 0);
                z-index          : 100;
                padding          : 0 15px;
                white-space      : nowrap;
                text-overflow    : ellipsis;
                overflow         : hidden;
                width            : 10%;
                line-height      : 44px;
                background-color : #fff;
                border-radius    : 5px;
                border           : 1px solid #ddd;
                font-size        : 24px;
                text-align       : center;
                cursor           : pointer;
                transition       : transform 10s ease-in;
                transition       : -webkit-transform 10s ease-in;
                &.dropdown {
                    -webkit-transform : translate3d(0, $box-height+50, 0);
                    transform         : translate3d(0, $box-height+50, 0);
                }
                // 选中后的砖块
                &.selected {
                    color             : #fff;
                    -webkit-transform : translate3d(0, 300px, 0);
                    transform         : translate3d(0, 300px, 0);
                    &.right {
                        background-color : #67c23a;
                        border-color     : #67c23a;
                    }
                    &.wrong {
                        background-color : #f56c6c;
                        border-color     : #f56c6c;
                    }
                }
            }
        }
    }
</style>
