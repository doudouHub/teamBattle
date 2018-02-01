<template>
    <div v-if="matching.statu">
        <!--  对战面板  -->
        <br>
        <h2 class="text-center">对战面板</h2>

        <keep-alive>
            <!-- 对战面板: 加载不同题型组件 -->
            <component :is="quesData.type">
                <!-- 组件在 vm.currentview 变化时改变！ -->
            </component>
        </keep-alive>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    // 对战题型模板
    import {battleTpl} from '../../config'

    export default {
        components: battleTpl,
        data() {
            return {
                currentView: 'vArithmetic', // 当前对战题型模板
            }
        },
        computed: {
            ...mapGetters([
                'quesData',
                'matching'
            ])
        },
        watch: {

        },
        mounted() {

        },
        methods: {
            // 对战开始

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixins";

</style>
