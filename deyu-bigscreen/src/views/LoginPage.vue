<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref<'qr' | 'phone'>('qr')
const phone = ref('')
const code = ref('')
const rememberLogin = ref(true)

function switchTab(tab: 'qr' | 'phone') {
  activeTab.value = tab
}

function getCode() {
  // TODO: 调用验证码API
  alert('验证码已发送')
}

function login() {
  // TODO: 调用登录API
  // 模拟登录成功 - 班主任姓名从系统配置获取，显示为"姓+老师"
  userStore.setTeacher({
    id: '1',
    name: '张明',  // 系统配置的班主任全名，界面显示时取姓+"老师"
    classes: [
      { id: '3-1', name: '三年级1班', grade: 3, classNumber: 1, students: [], groups: [] },
      { id: '3-2', name: '三年级2班', grade: 3, classNumber: 2, students: [], groups: [] }
    ]
  })

  localStorage.setItem('isLoggedIn', 'true')
  router.push('/home')
}
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand-section">
      <div class="brand-decoration brand-decoration-1"></div>
      <div class="brand-decoration brand-decoration-2"></div>
      <div class="brand-logo">
        <div class="brand-logo-inner">北大</div>
      </div>
      <div class="brand-title">北大附小AI德育系统</div>
      <div class="brand-subtitle">智慧德育 启迪未来</div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-section">
      <div class="login-card">
        <div class="login-title">班主任登录</div>

        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <div
            class="login-tab"
            :class="{ active: activeTab === 'qr' }"
            @click="switchTab('qr')"
          >
            扫码登录
          </div>
          <div
            class="login-tab"
            :class="{ active: activeTab === 'phone' }"
            @click="switchTab('phone')"
          >
            手机号登录
          </div>
        </div>

        <!-- 扫码登录 -->
        <div v-if="activeTab === 'qr'" class="qr-login">
          <div class="qr-code">
            <div class="qr-placeholder"></div>
          </div>
          <div class="qr-hint">请使用微信扫描二维码登录</div>
        </div>

        <!-- 手机号登录 -->
        <div v-else class="phone-login">
          <div class="form-group">
            <label class="form-label">手机号</label>
            <input
              v-model="phone"
              type="tel"
              class="form-input"
              placeholder="请输入手机号"
            >
          </div>

          <div class="form-group">
            <label class="form-label">验证码</label>
            <div class="code-input-group">
              <input
                v-model="code"
                type="text"
                class="form-input"
                placeholder="请输入验证码"
              >
              <button class="get-code-btn" @click="getCode">获取验证码</button>
            </div>
          </div>

          <div class="remember-row">
            <input
              v-model="rememberLogin"
              type="checkbox"
              class="remember-checkbox"
              id="remember"
            >
            <label class="remember-label" for="remember">记住登录状态</label>
          </div>

          <button class="login-btn" @click="login">登 录</button>
        </div>

        <router-link to="/" class="back-link">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  width: 1920px;
  height: 1080px;
  display: flex;
}

.brand-section {
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.brand-decoration {
  position: absolute;
  background: white;
  opacity: 0.1;
  border-radius: 50%;
}

.brand-decoration-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
}

.brand-decoration-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
}

.brand-logo {
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  z-index: 10;
}

.brand-logo-inner {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: bold;
}

.brand-title {
  color: white;
  font-size: 56px;
  font-weight: bold;
  letter-spacing: 6px;
  margin-bottom: 20px;
  z-index: 10;
}

.brand-subtitle {
  color: white;
  font-size: 24px;
  opacity: 0.9;
  letter-spacing: 4px;
  z-index: 10;
}

.login-section {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.login-card {
  width: 600px;
  background: white;
  border-radius: 30px;
  padding: 60px;
  box-shadow: var(--shadow-lg);
}

.login-title {
  font-size: 36px;
  font-weight: bold;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 50px;
}

.login-tabs {
  display: flex;
  margin-bottom: 40px;
  border-bottom: 2px solid #f0f0f0;
}

.login-tab {
  flex: 1;
  padding: 15px;
  text-align: center;
  font-size: 20px;
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: var(--transition-normal);

  &.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }
}

.qr-login {
  text-align: center;
  padding: 20px;
}

.qr-code {
  width: 240px;
  height: 240px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 20px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  width: 180px;
  height: 180px;
  background: linear-gradient(45deg, #eee 25%, #fff 25%, #fff 50%, #eee 50%, #eee 75%, #fff 75%);
  background-size: 20px 20px;
  border-radius: 10px;
}

.qr-hint {
  font-size: 18px;
  color: var(--color-text-secondary);
}

.phone-login {
  .form-group {
    margin-bottom: 25px;
  }

  .form-label {
    display: block;
    font-size: 18px;
    color: var(--color-text-primary);
    margin-bottom: 10px;
  }

  .form-input {
    width: 100%;
    height: 60px;
    border: 2px solid var(--color-border);
    border-radius: 15px;
    padding: 0 20px;
    font-size: 20px;
    transition: border-color var(--transition-normal);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  .code-input-group {
    display: flex;
    gap: 15px;

    .form-input {
      flex: 1;
    }
  }

  .get-code-btn {
    width: 160px;
    height: 60px;
    background: var(--color-primary);
    color: white;
    border-radius: 15px;
    font-size: 18px;
    transition: background var(--transition-normal);

    &:hover {
      background: var(--color-primary-light);
    }
  }

  .remember-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
  }

  .remember-checkbox {
    width: 22px;
    height: 22px;
    accent-color: var(--color-primary);
  }

  .remember-label {
    font-size: 18px;
    color: var(--color-text-secondary);
  }

  .login-btn {
    width: 100%;
    height: 65px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: white;
    border-radius: 15px;
    font-size: 24px;
    font-weight: bold;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(139, 0, 0, 0.3);
    }
  }
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 30px;
  color: var(--color-text-muted);
  font-size: 16px;

  &:hover {
    color: var(--color-primary);
  }
}
</style>
