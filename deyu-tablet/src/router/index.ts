import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { hideLayout: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import('@/views/ReviewPage.vue')
  },
  {
    path: '/voice-review',
    name: 'VoiceReview',
    component: () => import('@/views/VoiceReviewPage.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/ReportPage.vue')
  },
  {
    path: '/warning',
    name: 'Warning',
    component: () => import('@/views/WarningPage.vue')
  },
  {
    path: '/ai-phone',
    name: 'AIPhoneSelect',
    component: () => import('@/views/AIPhoneSelectPage.vue')
  },
  {
    path: '/ai-phone/chat',
    name: 'AIPhoneChat',
    component: () => import('@/views/AIPhoneChatPage.vue')
  },
  {
    path: '/class-manage',
    name: 'ClassManage',
    component: () => import('@/views/ClassManagePage.vue')
  },
  {
    path: '/homework',
    name: 'Homework',
    component: () => import('@/views/HomeworkPage.vue')
  },
  {
    path: '/school-manage',
    name: 'SchoolManage',
    component: () => import('@/views/SchoolManagePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/deyu/deyu-tablet/'),
  routes
})

export default router
