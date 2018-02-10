<template>
    <div>
        <br>
        <br>
        <br>
        <h1 class="text-center">题型编辑</h1>
        <br>
        <br>
        <!--  编辑题目组件  -->
        <keep-alive>
            <!-- 对战面板: 加载不同题型组件 -->
            <component :is="'breakBrick'">
                <!-- 组件在 vm.currentview 变化时改变！ -->
            </component>
        </keep-alive>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    // 对战题型编辑模板
    import {battleTpl} from '../../../config'

    export default {
        name: "create_questions",
        components: {
            ...battleTpl('edit')
        },
        data() {
            return {}
        },
        computed: {
            ...mapState([
                'ques_type'
            ])
        },
    }
</script>

<style scoped>

</style>
