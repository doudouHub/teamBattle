import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            meta: {
                title: '登陆'
            },
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/teacher',
            meta: {
                title: '教师端'
            },
            component: resolve => require(['../components/teacher/common/home.vue'], resolve),
            children: [
                {
                    path: '/',
                    meta: {
                        title: '教师端'
                    },
                    component: resolve => require(['../components/teacher/default.vue'], resolve),
                },
                {
                    path: '/viewBattle',
                    meta: {
                        title: '教师端'
                    },
                    component: resolve => require(['../components/teacher/modules/battle_list_view.vue'], resolve),
                }
            ]
        },
        {
            path: '/student',
            meta: {
                title: '学生端'
            },
            component: resolve => require(['../components/student/common/home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/student/default.vue'], resolve),
                },
                {
                    path: '/battle',
                    component: resolve => require(['../components/student/modules/battle.vue'], resolve),
                }
            ]
        },
        // 路由错误，404page
        {path: '*', component: resolve => require(['../components/page/page404.vue'], resolve)},


        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/tea',
                    component: resolve => require(['../components/page/QSDistribution.vue'], resolve),
                },
                {
                    path: '/stu',
                    component: resolve => require(['../components/page/QSAccept.vue'], resolve)
                },
                {
                    path: '/viewBattle',
                    component: resolve => require(['../components/page/viewBattle.vue'], resolve),
                }
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
})
