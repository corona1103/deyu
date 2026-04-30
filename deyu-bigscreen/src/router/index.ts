import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'display',
    component: () => import('@/views/DisplayPage.vue'),
    meta: { title: '系统展示页' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/review',
    name: 'review',
    component: () => import('@/views/ReviewPage.vue'),
    meta: { title: '点评', requiresAuth: true }
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: () => import('@/views/RankingPage.vue'),
    meta: { title: '排行榜', requiresAuth: true }
  },
  {
    path: '/homework',
    name: 'homework',
    component: () => import('@/views/HomeworkPage.vue'),
    meta: { title: '交作业', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory('/deyu/deyu-bigscreen/'),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `北大附小AI德育系统 - ${to.meta.title || ''}`

  // 检查登录状态
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
