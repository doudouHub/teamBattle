<template>
    <!--  读秒倒计时  -->
    <div class="v-countdown" v-if="count_show">
        <div class="cuount-down-box">
            {{time}}
        </div>
        <div class="cover"></div>
    </div>
</template>

<script>
    export default {
        name: "count_down",
        props: ['count_time', 'end_text', 'end_close'],
        data () {
            return {
                count_show: true,
                time: 0,
                timer: null
            }
        },
        mounted () {
            const self = this;
            this.time = this.count_time;
            this.timer = setInterval(() => {
                self.time--;
                if (!self.time) {
                    if (self.end_text) {
                        self.time = self.end_text;
                        setTimeout(() => {
                            self.closeTimer();
                        }, 500)
                    } else {
                        self.closeTimer();
                    }
                }
            }, 1000)
        },
        methods: {
            // 关闭计时器
            closeTimer () {
                if (this.end_close) this.count_show = false;
                clearInterval(this.timer);
                this.$store.dispatch('student/updateMatching', {type: 'count_over'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixins";

    .v-countdown {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .cuount-down-box {
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            background-color: #f2f2f2;
            font-size: 45px;
            font-weight: bold;
            border-radius: 50%;
            border: 1px solid #ddd;
            @include stretch(50%, false, false, 50%);
            margin: {
                left: -50px;
                top: -50px;
            }
            z-index: 100;
        }
        .cover {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .4);
        }
    }
</style>
