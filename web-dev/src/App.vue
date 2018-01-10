<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style lang="scss">
    @import 'styles/main';

    ::-webkit-scrollbar {
        width    : 10px;
        height   : 10px;
        overflow : auto;
    }

    ::-webkit-scrollbar-thumb {
        background-color : #d5d5d5;
        min-height       : 25px;
        min-width        : 25px;
        border           : 1px solid #e0e0e0;
    }

    ::-webkit-scrollbar-track {
        background-color : #f7f7f7;
        border           : 1px solid #efefef;
    }
</style>
