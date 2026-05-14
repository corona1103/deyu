<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface NavItem {
  path: string
  name: string
  icon: string
}

interface NavGroup {
  name: string
  icon: string
  basePath: string
  children: { tab: string; name: string; icon: string }[]
}

const navItems: NavItem[] = [
  { path: '/home', name: '首页', icon: '🏠' },
  { path: '/review', name: '行为点评', icon: '⭐' },
  { path: '/voice-review', name: 'AI点评助手', icon: '🤖' },
  { path: '/homework', name: '作业管理', icon: '📝' },
  { path: '/report', name: '德育报告', icon: '📊' },
  { path: '/warning', name: '预警中心', icon: '⚠️' },
  { path: '/ai-phone', name: 'AI电话亭', icon: '💬' },
  { path: '/class-manage', name: '班级管理', icon: '👥' }
]

const navGroups: NavGroup[] = [
  {
    name: '学校管理',
    icon: '🏫',
    basePath: '/school-manage',
    children: [
      { tab: 'students', name: '学生管理', icon: '🎓' },
      { tab: 'classes', name: '班课管理', icon: '📚' },
      { tab: 'teachers', name: '老师管理', icon: '👨‍🏫' },
      { tab: 'tags', name: '标签管理', icon: '🏷️' },
      { tab: 'knowledge', name: '知识库', icon: '📖' },
      { tab: 'settings', name: '配置中心', icon: '⚙️' }
    ]
  }
]

const expandedGroups = ref<Set<string>>(new Set())

function isActive(path: string) {
  return route.path === path
}

function isGroupActive(basePath: string) {
  return route.path === basePath
}

function isGroupChildActive(basePath: string, tab: string) {
  return route.path === basePath && route.query.tab === tab
}

function navigateTo(path: string) {
  router.push(path)
}

function toggleGroup(groupName: string) {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
}

function navigateToChild(basePath: string, tab: string, groupName: string) {
  expandedGroups.value.add(groupName)
  router.push({ path: basePath, query: { tab } })
}

// 如果当前就在分组页面，自动展开
if (navGroups.some(g => route.path === g.basePath)) {
  const group = navGroups.find(g => route.path === g.basePath)
  if (group) expandedGroups.value.add(group.name)
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

      <!-- 分组导航（学校管理） -->
      <div v-for="group in navGroups" :key="group.name" class="nav-group">
        <div
          class="nav-item group-header"
          :class="{ active: isGroupActive(group.basePath) }"
          @click="toggleGroup(group.name); navigateTo(group.basePath)"
        >
          <span class="nav-icon">{{ group.icon }}</span>
          <span class="nav-label">{{ group.name }}</span>
          <span class="expand-arrow" :class="{ expanded: expandedGroups.has(group.name) }">›</span>
        </div>

        <transition name="slide">
          <div v-if="expandedGroups.has(group.name)" class="group-children">
            <div
              v-for="child in group.children"
              :key="child.tab"
              class="nav-item child-item"
              :class="{ active: isGroupChildActive(group.basePath, child.tab) }"
              @click.stop="navigateToChild(group.basePath, child.tab, group.name)"
            >
              <span class="nav-icon child-icon">{{ child.icon }}</span>
              <span class="nav-label">{{ child.name }}</span>
            </div>
          </div>
        </transition>
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
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 30px;
  border-bottom: 1px solid $gray-200;
  margin-bottom: 30px;
  flex-shrink: 0;
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
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
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
  flex: 1;
}

// 分组导航
.nav-group {
  margin-top: 4px;
}

.group-header {
  position: relative;
}

.expand-arrow {
  font-size: 18px;
  color: $gray-400;
  transition: transform 0.2s;

  &.expanded {
    transform: rotate(90deg);
  }
}

.group-children {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 2px solid $gray-100;
  overflow: hidden;
}

.child-item {
  padding: 10px 12px;
  min-height: 38px;
}

.child-icon {
  font-size: 16px;
}

.child-item .nav-label {
  font-size: 14px;
}

// 展开/收起动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  max-height: 300px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
