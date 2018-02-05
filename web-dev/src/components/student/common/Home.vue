<template>
    <div class="wrapper">
        <monitor-window></monitor-window>
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import '../../../assets/scripts/websoket'
    import monitorWindow from '../../common/Monitor_window';
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import config from '../../../config.js'
    import {mapState} from 'vuex'

    export default {
        components: {
            vHead, vSidebar,monitorWindow
        },
        data() {
            return {}
        },
        computed: mapState([
            'userInfo'
        ]),
        mounted() {
            const self = this;

        },
        methods: {}
    }
</script>

<style>

</style>
