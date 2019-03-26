/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
import Main from '@/views/Main'
export default [
    {
        path: '/camera2',
        name: 'Camera2',
        component: () => import('@/views/Camera')
    },
    { path: '/', component: () => import('@/views/Login'), redirect: '/login', hidden: true },
    { path: '/login', component: () => import('@/views/Login'), hidden: true },
    {
        path: '/main',
        component: Main,
        redirect: '/main/home',
        children: [
            {path: '/main/home', component: () => import('@/views/Dashboard'), name: '报表展示'},
            {
                path: '/user-profile',
                name: '商户信息',
                component: () => import('@/views/UserProfile')
            },
            {
                path: '/table-list',
                name: '到店人群',
                component: () => import('@/views/TableList')
            },
            {
                path: '/camera',
                name: '实时监控',
                component: () => import('@/views/Camera')
            },
            {
                path: '/password',
                name: '密码修改',
                component: () => import('@/views/Password')
            }
        ]
    }
]
