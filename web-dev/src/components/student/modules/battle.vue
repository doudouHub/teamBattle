<template>
    <div>
        <!--  对战面板  -->
        <br>
        <h2 class="text-center">对战面板</h2>

        <keep-alive>
            <!-- 对战面板: 加载不同题型组件 -->
            <component :is="ques_type">
                <!-- 组件在 vm.currentview 变化时改变！ -->
            </component>
        </keep-alive>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    // 对战题型模板
    import {battleTpl} from '../../../config'

    export default {
        components: battleTpl,
        data() {
            return {
            }
        },
        computed: {
            ...mapState([
                'ques_type'
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
    @import "../../../styles/mixins";

</style>
