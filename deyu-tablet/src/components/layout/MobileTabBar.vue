<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface NavItem {
  path: string
  name: string
  icon: string
  activeIcon: string
}

const navItems: NavItem[] = [
  { path: '/home', name: '首页', icon: '🏠', activeIcon: '🏠' },
  { path: '/review', name: '点评', icon: '⭐', activeIcon: '⭐' },
  { path: '/report', name: '报告', icon: '📊', activeIcon: '📊' },
  { path: '/home', name: '我的', icon: '👤', activeIcon: '👤' }
]

function isActive(path: string) {
  return route.path === path
}

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="mobile-tab-bar">
    <div
      v-for="item in navItems"
      :key="item.path + item.name"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="navigateTo(item.path)"
    >
      <span class="nav-icon">{{ isActive(item.path) ? item.activeIcon : item.icon }}</span>
      <span class="nav-label">{{ item.name }}</span>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.mobile-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $bottom-nav-height;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-bottom: $safe-area-bottom;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: $gray-400;
  font-size: 12px;
  cursor: pointer;
  min-width: 60px;
  min-height: 44px;
  justify-content: center;
  transition: color 0.3s;

  &.active {
    color: $primary;
  }
}

.nav-icon {
  font-size: 24px;
}

.nav-label {
  font-size: 12px;
}
</style>
