import {createRouter, createWebHistory} from 'vue-router'

// 定义路由
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // 首页/home 及其子路由
        {
            path: '/',
            name: 'login',
            component: () => import('../views/welcome/login.vue')
        },


        {
            path: '/home',
            name: 'home',
            component: () => import('../components/bottomNav.vue'),
            children: [
                {
                    path: 'act',
                    name: 'act',
                    component: () => import('../views/activity.vue'),
                },
                {
                    path: 'search',
                    name: 'search',
                    component: () => import('../views/search.vue'),
                },
                {
                    path: 'hot',
                    name: 'hot',
                    component: () => import('../views/hot.vue'),
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('../views/profile.vue'),
                },
                {
                    path: 'seat',
                    name: 'seat',
                    component: () => import('../views/seat.vue'),
                },
            ]
        },
        {
            path: '/home/seat/select',
            name: 'select',
            component: () => import('../views/seat/select.vue'),
        },
        {
            path: '/home/seat/history',
            name: 'orderHistory',
            component: () => import('../views/seat/history.vue'),
        },
        {
            path: '/home/seat/select/:areaId',
            name: 'seatSelection',
            component: () => import('../views/seat/seatSelect.vue'),
        },

        {
            path: '/:catchAll(.*)', // 匹配所有未定义路径
            name: '404',
            component: () => import('../components/404.vue')
        },
        {
            path: '/home/bookDetail/:bookId',
            name: 'bookDetail',
            component: () => import('../views/bookDetail.vue')
        },
        // 新增profile_BooksList页面
        {
            path: '/home/profile_BooksList',
            name: 'profile_BooksList',
            component: () => import('../views/profile_BooksList.vue'),
        },
        {
            path: '/home/profile_info',
            name: 'profile_info',
            component: () => import('../views/profile_info.vue'),
        },
        {
            path: '/home/profile_Cluster',
            name: 'profile_Cluster',
            component: () => import('../views/profile_Cluster.vue'),
        },
        {
            path: '/home/profile_History',
            name: 'profile_History',
            component: () => import('../views/profile_History.vue'),
        },
        //search.vue --> category.vue
        {
            path: '/home/search/category/:typeName', // 动态参数 :name 表示分类名称
            name: 'category',
            component: () => import('../views/search/category.vue')
        },
        {
            path: '/home/search/searchBook/:info', // 动态参数 :name 表示分类名称
            name: 'searchBook',
            component: () => import('../views/search/searchBook.vue')

        }

    ]
})

export default router