<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface NavItem {
  path: string
  name: string
  icon: string
}

const navItems: NavItem[] = [
  { path: '/home', name: '首页', icon: '🏠' },
  { path: '/review', name: '行为点评', icon: '⭐' },
  { path: '/voice-review', name: '语音点评', icon: '🎙️' },
  { path: '/report', name: '德育报告', icon: '📊' },
  { path: '/warning', name: '预警中心', icon: '⚠️' },
  { path: '/ai-phone', name: 'AI电话亭', icon: '💬' },
  { path: '/class-manage', name: '班级管理', icon: '👥' }
]

function isActive(path: string) {
  return route.path === path
}

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <aside class="tablet-sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">北大</div>
      <div class="logo-text">AI德育系统</div>
    </div>

    <!-- 导航菜单 -->
    <nav class="sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="navigateTo(item.path)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.name }}</span>
      </div>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.tablet-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: white;
  padding: 30px 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 30px;
  border-bottom: 1px solid $gray-200;
  margin-bottom: 30px;
}

.logo-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.logo-text {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-radius: 12px;
  color: $gray-600;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 44px;

  &:hover {
    background: $gray-50;
  }

  &.active {
    background: rgba($primary, 0.1);
    color: $primary;
  }
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 15px;
}
</style>
