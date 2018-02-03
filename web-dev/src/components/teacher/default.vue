<template>
    <div>
        <!--  老师端首页  -->
        <h1>老师端首页</h1>
        <v-question></v-question>
    </div>
</template>

<script>
    // 题型组件
    import vQuestion from './modules/question_view'
    export default {
        name: "teacher",
        components: {
            vQuestion
        },
    }
</script>

<style scoped>

</style>
