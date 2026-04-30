<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import schoolBadge from '@/assets/images/school-badge.png'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const classes = computed(() => userStore.classes)
const teacher = computed(() => userStore.teacher)
const showUserMenu = ref(false)

const navItems = [
  { name: 'display', label: '首页', path: '/' },
  { name: 'review', label: '点评', path: '/review' },
  { name: 'ranking', label: '排行榜', path: '/ranking' },
  { name: 'homework', label: '交作业', path: '/homework' }
]

// 格式化教师名字为"X老师"格式
const teacherDisplayName = computed(() => {
  if (!teacher.value?.name) return '未登录'
  const name = teacher.value.name
  if (name.includes('老师')) return name
  return name[0] + '老师'
})

function onClassChange(event: Event) {
  const classId = (event.target as HTMLSelectElement).value
  userStore.setCurrentClass(classId)
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
      <img :src="schoolBadge" alt="校徽" class="school-badge" />
      <div class="school-info">
        <div class="school-name">北京大学附属小学</div>
        <div class="school-sub">九章爱学德育系统</div>
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
      <!-- 班级选择器 -->
      <div class="class-selector">
        <select :value="userStore.currentClassId" @change="onClassChange">
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>
        <span class="dropdown-icon">▼</span>
      </div>
      <!-- 用户信息 + 下拉菜单 -->
      <div class="user-dropdown" @click="toggleUserMenu">
        <div class="user-info">
          <div class="user-avatar">{{ teacher?.name?.[0] || '?' }}</div>
          <span class="user-name">{{ teacherDisplayName }}</span>
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
$school-primary: #9D0808;
$school-secondary: #A52A2A;

.top-nav {
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 50;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.school-badge {
  width: 46px;
  height: 46px;
  object-fit: contain;
}

.school-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.school-name {
  font-size: 20px;
  font-weight: bold;
  color: #9D0808;
  letter-spacing: 1px;
}

.school-sub {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.5px;
}

.nav-center {
  display: flex;
  gap: 12px;
}

.nav-item {
  font-size: 18px;
  color: #666;
  padding: 10px 28px;
  border-radius: 25px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: $school-primary;
  }

  &.active {
    color: $school-primary;
    font-weight: bold;
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.class-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 25px;
  border: 1px solid #eee;

  select {
    border: none;
    background: transparent;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    min-width: 100px;
  }

  .dropdown-icon {
    font-size: 10px;
    color: #999;
  }
}

.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba($school-primary, 0.05);
  }
}

.user-avatar {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #f0a0a0, #e08080);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: white;
  font-weight: bold;
}

.user-name {
  font-size: 16px;
  color: #333;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
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
  color: #666;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
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

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
</style>
