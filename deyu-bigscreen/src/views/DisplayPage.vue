<script setup lang="ts">
import { useRouter } from 'vue-router'
import landingBg from '@/assets/images/landing-bg.png'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="display-page">
    <img :src="landingBg" alt="AI德育系统" class="bg-image" />
    <button class="enter-btn" @click="goToLogin">
      <span class="enter-text">点击进入</span>
      <span class="enter-arrow">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="rgba(255,255,255,0.3)"/>
          <path d="M12 9l5 5-5 5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.display-page {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.enter-btn {
  position: absolute;
  right: 345px;
  bottom: 298px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 44px 20px 52px;
  background: #9D0808;
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(157, 8, 8, 0.4);
  z-index: 10;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(157, 8, 8, 0.5);
    background: #B00A0A;
  }

  &:active {
    transform: translateY(-1px);
  }
}

.enter-text {
  white-space: nowrap;
}

.enter-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
