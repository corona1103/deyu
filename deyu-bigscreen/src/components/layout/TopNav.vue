<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const classes = computed(() => userStore.classes)
const teacher = computed(() => userStore.teacher)
const showUserMenu = ref(false)

const navItems = [
  { name: 'review', label: '点评', path: '/review' },
  { name: 'ranking', label: '排行榜', path: '/ranking' },
  { name: 'homework', label: '交作业', path: '/homework' }
]

// 格式化教师名字为"X老师"格式
const teacherDisplayName = computed(() => {
  if (!teacher.value?.name) return '未登录'
  const name = teacher.value.name
  // 如果已经包含"老师"，直接返回
  if (name.includes('老师')) return name
  // 否则取姓+老师
  return name[0] + '老师'
})

function onClassChange(event: Event) {
  const classId = (event.target as HTMLSelectElement).value
  userStore.setCurrentClass(classId)
}

function goHome() {
  router.push('/home')
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleLogout() {
  showUserMenu.value = false
  userStore.logout()
  router.push('/login')
}

function closeUserMenu() {
  showUserMenu.value = false
}
</script>

<template>
  <nav class="top-nav">
    <div class="nav-left">
      <!-- 校徽 -->
      <div class="school-badge">
        <div class="badge-inner">北大</div>
      </div>
      <!-- 班级选择器 -->
      <div class="class-selector">
        <select :value="userStore.currentClassId" @change="onClassChange">
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>
        <span class="dropdown-icon">▼</span>
      </div>
    </div>

    <div class="nav-center">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.name === item.name }"
      >
        {{ item.label }}
      </router-link>
    </div>

    <div class="nav-right">
      <button class="nav-btn" @click="goHome">
        🏠 首页
      </button>
      <!-- 用户信息 + 下拉菜单 -->
      <div class="user-dropdown" @click="toggleUserMenu">
        <div class="user-info">
          <div class="user-avatar">{{ teacher?.name?.[0] || '?' }}</div>
          <span class="user-name">{{ teacherDisplayName }}</span>
          <span class="dropdown-arrow">▼</span>
        </div>
        <!-- 下拉菜单 -->
        <div v-if="showUserMenu" class="dropdown-menu" @click.stop>
          <div class="dropdown-item logout" @click="handleLogout">
            <span class="logout-icon">🚪</span>
            退出登录
          </div>
        </div>
      </div>
      <!-- 点击外部关闭菜单的遮罩 -->
      <div v-if="showUserMenu" class="dropdown-overlay" @click="closeUserMenu"></div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
// 学校品牌色
$school-primary: #8B0000;
$school-secondary: #A52A2A;

.top-nav {
  height: 70px;
  background: linear-gradient(90deg, white 0%, #FFF8F8 50%, white 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: var(--shadow-sm);
  border-bottom: 2px solid rgba($school-primary, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

// 校徽样式
.school-badge {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba($school-primary, 0.2);
}

.badge-inner {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, $school-primary, $school-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}

.class-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-bg-light);
  border-radius: var(--radius-xl);
  border: 1px solid rgba($school-primary, 0.1);

  select {
    border: none;
    background: transparent;
    font-size: 18px;
    color: var(--color-text-primary);
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    min-width: 120px;
  }

  .dropdown-icon {
    font-size: 12px;
    color: $school-primary;
  }
}

.nav-center {
  display: flex;
  gap: 20px;
}

.nav-item {
  font-size: 20px;
  color: var(--color-text-secondary);
  padding: 12px 28px;
  border-radius: var(--radius-xl);
  transition: var(--transition-normal);
  text-decoration: none;

  &:hover {
    background: rgba($school-primary, 0.05);
    color: $school-primary;
  }

  &.active {
    color: $school-primary;
    font-weight: bold;
    background: rgba($school-primary, 0.1);
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-xl);
  font-size: 16px;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-normal);

  &:hover {
    background: rgba($school-primary, 0.05);
    color: $school-primary;
  }
}

// 用户下拉容器
.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: var(--radius-xl);
  transition: var(--transition-normal);

  &:hover {
    background: rgba($school-primary, 0.05);
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, $school-primary, $school-secondary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  font-weight: bold;
}

.user-name {
  font-size: 16px;
  color: var(--color-text-primary);
}

// 下拉菜单
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 140px;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  font-size: 16px;
  color: var(--color-text-secondary);
  transition: var(--transition-normal);

  &:hover {
    background: #F5F5F5;
  }

  &.logout {
    color: #E53935;

    &:hover {
      background: #FFEBEE;
    }
  }
}

.logout-icon {
  font-size: 18px;
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--color-text-muted);
  margin-left: 4px;
}

// 遮罩层
.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
</style>
