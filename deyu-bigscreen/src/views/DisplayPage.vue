<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="display-page">
    <div class="content">
      <div class="logo">
        <div class="logo-inner">北大</div>
      </div>
      <h1 class="title">北大附小AI德育系统</h1>
      <p class="subtitle">智慧德育 启迪未来</p>
      <button class="enter-btn" @click="goToLogin">
        点击进入系统
      </button>
    </div>

    <footer class="footer">
      © 2024 北京大学附属小学 | 版权所有
    </footer>
  </div>
</template>

<style scoped lang="scss">
.display-page {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.content {
  text-align: center;
}

.logo {
  width: 180px;
  height: 180px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.logo-inner {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 42px;
  font-weight: bold;
}

.title {
  color: white;
  font-size: 72px;
  font-weight: bold;
  letter-spacing: 8px;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 32px;
  letter-spacing: 6px;
  margin-bottom: 60px;
}

.enter-btn {
  padding: 25px 80px;
  background: white;
  color: var(--color-primary);
  border-radius: 50px;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 4px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: var(--transition-normal);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  }
}

.footer {
  position: absolute;
  bottom: 30px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}
</style>
