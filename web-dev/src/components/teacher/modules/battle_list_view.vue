<template>
    <div>
        <!--  查看对战界面  -->
        <h1 class="text-center">对战用户排名</h1>
        <!--  对战排名  -->
        <div class="battle-rankings">
            <div class="battle-head">

            </div>
            <div class="battle-content">
                <ul class="battle-rank-list list-none">
                    <li class="item" v-for="item in rankingList" :key="item.userId">
                        <div class="item-name pull-left">{{item.name}}</div>
                        <div class="item-score pull-right">{{item.score}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data: function () {
            return {}
        },
        computed: {
            ...mapGetters('teacher', [
                'rankingList'
            ]),
        },
        methods: {},
        mounted() {
            // 如果当前对战状态未开始,返回老师端首页
            if (!this.$store.state.battle_statu) {
                this.$router.push({path: '/teacher'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixins";

    html {
        background-color : #f4f4f4;
    }

    .battle-rankings {
        max-width        : 640px;
        border-radius    : 5px;
        border           : 1px solid #ddd;
        background-color : #fff;
        margin           : 20px auto 50px;
    }

    .battle-rank-list {
        margin  : 0;
        padding : 0;
        .item {
            border-bottom : 1px solid #ddd;
            line-height   : 50px;
            padding       : 0 15px;
            font-size     : 18px;
            overflow      : hidden;
            .item-score {
                font-weight : bold;
            }
            &:last-child {
                border-bottom : none;
            }
        }
    }
</style>
