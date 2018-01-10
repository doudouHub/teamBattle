<template>
    <div>
        <!--  接收题目弹窗  -->
        <el-dialog
            title="接收到的题目列表"
            :visible="quesData.statu && !matching.statu"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <span>
                <ul class="quesData-list">
                    <li>1+1=?</li>
                    <li>2+2=?</li>
                    <li>3+3=?</li>
                    <li>4+4=?</li>
                    <li>5+5=?</li>
                    <li>6+6=?</li>
                </ul>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="matchLoading" @click="matchAgainst">
                    <span v-if="!matchLoading">匹配对战</span>
                    <span v-else>正在匹配...</span>
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                matchLoading: false,
            }
        },
        computed: {
            ...mapGetters([
                'quesData',
                'matching',
                'user'
            ])
        },
        mounted() {
            const self = this;
        },
        methods: {
            // 匹配对战
            matchAgainst() {
                const self = this;

                websocket.send(JSON.stringify({
                    type: 'matching',
                    userId: self.$route.query.userId
                }));
                this.matchLoading = true;
            },
        }
    }
</script>

<style lang="scss">
    .quesData-list {
        font-size   : 18px;
        line-height : 30px;
    }
</style>
