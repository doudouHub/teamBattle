<template>
    <el-dialog
        title="对战结束"
        :visible.sync="battle_over"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <h1 class="text-center">{{battleResult}}</h1>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="backToHome('student')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {mapState,mapActions} from 'vuex'

    export default {
        name: "battle_over",
        props: ['battle_over', 'myScore'],
        data() {
            return {

            };
        },
        computed: {
            ...mapState('student', [
                'otherScore'
            ]),
            battleResult() {
                return (this.myScore === this.otherScore)?"平局！":(this.myScore > this.otherScore ? "YOU WIN!" : "YOU LOST!")
            }
        },
        methods:{
            ...mapActions([
                'backToHome'
            ])
        }
    }
</script>

<style scoped>

</style>
