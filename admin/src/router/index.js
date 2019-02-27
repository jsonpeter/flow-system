import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/list',
    name: 'List',
    children: [{
      path: 'list',
      meta: { title: '商户列表', icon: 'nested' },
      component: () => import('@/views/list/index')
    }]
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Add',
        component: () => import('@/views/add/index'),
        meta: { title: '商户添加', icon: 'form' }
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    children: [
      {
        path: 'add',
        name: 'store_add',
        component: () => import('@/views/stores/add'),
        meta: { title: '门店添加', icon: 'link' }
      }, {
        path: 'index',
        name: 'store_list',
        component: () => import('@/views/stores/index'),
        meta: { title: '门店管理', icon: 'example' }
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
