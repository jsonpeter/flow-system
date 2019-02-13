/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
import Main from '@/views/Main'
export default [
    { path: '/', component: () => import('@/views/Login'), redirect: '/login', hidden: true },
    { path: '/login', component: () => import('@/views/Login'), hidden: true },
    {
        path: '/main',
        component: Main,
        redirect: '/main/home',
        children: [
            {path: '/main/home', component: () => import('@/views/Dashboard'), name: 'dashboard'},
            {
                path: '/user-profile',
                name: 'User Profile',
                component: () => import('@/views/UserProfile')
            },
            {
                path: '/table-list',
                name: 'Table List',
                component: () => import('@/views/TableList')
            },
            {
                path: '/password',
                name: 'Password',
                component: () => import('@/views/Password')
            }
        ]
    }
]
