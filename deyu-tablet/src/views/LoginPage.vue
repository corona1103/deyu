<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { BaseButton, BaseInput } from '@/components/common'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('138****8888')
const code = ref('')
const agreed = ref(true)
const countdown = ref(0)

interface SavedAccount {
  id: string
  name: string
  className: string
}

const savedAccounts = ref<SavedAccount[]>([
  { id: '1', name: '张老师', className: '三年级1班' },
  { id: '2', name: '李老师', className: '三年级2班' }
])

const selectedAccountId = ref('1')

function selectAccount(id: string) {
  selectedAccountId.value = id
}

function sendCode() {
  if (countdown.value > 0) return
  countdown.value = 60

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

function login() {
  if (!agreed.value) {
    alert('请同意用户协议和隐私政策')
    return
  }

  // Mock 登录
  userStore.mockLogin()
  router.push('/home')
}
</script>

<template>
  <div class="login-page">
    <!-- 品牌头部 -->
    <div class="brand-header">
      <div class="brand-logo">
        <div class="brand-logo-inner">北大</div>
      </div>
      <div class="brand-title">北大附小AI德育系统</div>
      <div class="brand-subtitle">教师版</div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-container">
      <div class="login-title">登录账号</div>

      <!-- 账号切换 -->
      <div class="account-switcher hide-scrollbar">
        <div
          v-for="account in savedAccounts"
          :key="account.id"
          class="account-card touch-active"
          :class="{ active: selectedAccountId === account.id }"
          @click="selectAccount(account.id)"
        >
          <div class="account-avatar">{{ account.name.charAt(0) }}</div>
          <div class="account-info">
            <div class="account-name">{{ account.name }}</div>
            <div class="account-class">{{ account.className }}</div>
          </div>
        </div>
        <div class="add-account touch-active">+</div>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="login">
        <div class="form-group">
          <label class="form-label">手机号</label>
          <BaseInput
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
          />
        </div>

        <div class="form-group">
          <label class="form-label">验证码</label>
          <div class="code-input-group">
            <BaseInput
              v-model="code"
              placeholder="请输入验证码"
              maxlength="6"
            />
            <button
              type="button"
              class="get-code-btn"
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="login-type-switch">
          <a href="#">使用密码登录</a>
        </div>

        <BaseButton
          type="primary"
          size="lg"
          block
          @click="login"
        >
          登 录
        </BaseButton>

        <div class="agreement">
          <input v-model="agreed" type="checkbox" />
          <span>登录即表示同意 <a href="#">《用户协议》</a> 和 <a href="#">《隐私政策》</a></span>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  display: flex;
  flex-direction: column;

  @media (min-width: $breakpoint-md) {
    justify-content: center;
    align-items: center;
    padding: 40px;
  }
}

.brand-header {
  padding: 60px 20px 40px;
  text-align: center;
  color: white;

  @media (min-width: $breakpoint-md) {
    padding: 0 0 40px;
  }
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  @media (min-width: $breakpoint-md) {
    width: 100px;
    height: 100px;
  }
}

.brand-logo-inner {
  width: 66px;
  height: 66px;
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;

  @media (min-width: $breakpoint-md) {
    width: 84px;
    height: 84px;
    font-size: 22px;
  }
}

.brand-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;

  @media (min-width: $breakpoint-md) {
    font-size: 32px;
  }
}

.brand-subtitle {
  font-size: 14px;
  opacity: 0.8;

  @media (min-width: $breakpoint-md) {
    font-size: 16px;
  }
}

.login-container {
  flex: 1;
  background: white;
  border-radius: 30px 30px 0 0;
  padding: 40px 24px;

  @media (min-width: $breakpoint-md) {
    max-width: 450px;
    width: 100%;
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    flex: none;
  }
}

.login-title {
  font-size: 22px;
  font-weight: bold;
  color: $gray-800;
  text-align: center;
  margin-bottom: 30px;

  @media (min-width: $breakpoint-md) {
    font-size: 26px;
  }
}

.account-switcher {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.account-card {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: $gray-50;
  border-radius: $radius-md;
  border: 2px solid transparent;
  cursor: pointer;

  &.active {
    border-color: $primary;
    background: #FFF5F5;
  }
}

.account-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
}

.account-info {
  text-align: left;
}

.account-name {
  font-size: 14px;
  font-weight: bold;
  color: $gray-800;
}

.account-class {
  font-size: 12px;
  color: $gray-400;
}

.add-account {
  flex-shrink: 0;
  width: 50px;
  height: 64px;
  background: $gray-50;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: $gray-400;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: $gray-800;
  margin-bottom: 8px;
  font-weight: 500;
}

.code-input-group {
  display: flex;
  gap: 12px;

  :deep(.base-input) {
    flex: 1;
  }
}

.get-code-btn {
  width: 120px;
  height: 50px;
  background: $primary;
  color: white;
  border: none;
  border-radius: $radius-md;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    background: $gray-300;
  }

  @media (min-width: $breakpoint-md) {
    height: 55px;
  }
}

.login-type-switch {
  text-align: center;
  margin: 20px 0;

  a {
    color: $primary;
    font-size: 14px;
    text-decoration: none;
  }
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
  font-size: 12px;
  color: $gray-400;

  input {
    margin-top: 2px;
    accent-color: $primary;
  }

  a {
    color: $primary;
    text-decoration: none;
  }
}
</style>
