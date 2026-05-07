<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

interface Props {
  title: string
  showBack?: boolean
  rightSlot?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: true,
  rightSlot: true
})

const router = useRouter()
const userStore = useUserStore()
const showUserMenu = ref(false)

// 确保已登录（mock 环境下自动登录）
onMounted(() => {
  if (!userStore.isLoggedIn) {
    userStore.mockLogin()
  }
})

function goBack() {
  router.back()
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleLogout() {
  showUserMenu.value = false
  userStore.logout()
  router.push('/login')
}

// 点击外部关闭菜单
function onClickOutside() {
  showUserMenu.value = false
}
</script>

<template>
  <header class="page-header">
    <div class="header-top">
      <button
        v-if="showBack"
        class="back-btn touch-active"
        @click="goBack"
      >
        <span class="back-icon">‹</span>
        <span>返回</span>
      </button>
      <div v-else class="back-placeholder" />

      <span class="page-title">{{ title }}</span>

      <div class="header-right-group">
        <div v-if="rightSlot" class="header-right">
          <slot name="right" />
        </div>
        <!-- 用户头像 -->
        <div v-if="userStore.isLoggedIn" class="user-avatar-wrap" @click.stop="toggleUserMenu">
          <div class="user-avatar">
            {{ userStore.teacher?.name?.charAt(0) || '师' }}
          </div>
          <!-- 下拉菜单 -->
          <Transition name="menu-fade">
            <div v-if="showUserMenu" class="user-menu" @click.stop>
              <div class="menu-header">
                <div class="menu-avatar">{{ userStore.teacher?.name?.charAt(0) || '师' }}</div>
                <div class="menu-info">
                  <div class="menu-name">{{ userStore.teacher?.name }}</div>
                  <div class="menu-phone">{{ userStore.teacher?.phone }}</div>
                </div>
              </div>
              <div class="menu-divider" />
              <div class="menu-item logout touch-active" @click="handleLogout">
                退出登录
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- 菜单遮罩 -->
    <Teleport to="body">
      <div v-if="showUserMenu" class="menu-overlay" @click="onClickOutside" />
    </Teleport>

    <slot name="tabs" />
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.page-header {
  background: white;
  padding: 50px 20px 15px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: $shadow-sm;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px 15px;
  }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: $gray-800;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  min-width: 60px;
}

.back-icon {
  font-size: 20px;
  font-weight: bold;
}

.back-placeholder {
  min-width: 60px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
}

.header-right-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-right {
  display: flex;
  gap: 10px;
}

// 用户头像
.user-avatar-wrap {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, #6B0000);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.92);
  }
}

// 下拉菜单
.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  z-index: 200;
  overflow: hidden;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.menu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, #6B0000);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
  min-width: 0;
}

.menu-name {
  font-size: 15px;
  font-weight: 600;
  color: $gray-800;
}

.menu-phone {
  font-size: 12px;
  color: $gray-400;
  margin-top: 2px;
}

.menu-divider {
  height: 1px;
  background: $gray-100;
  margin: 0 16px;
}

.menu-item {
  padding: 14px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: $gray-50;
  }

  &.logout {
    color: $danger;
  }
}

// 菜单动画
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<!-- 遮罩样式需要全局，因为 Teleport 到 body 后 scoped 不生效 -->
<style>
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
}
</style>
