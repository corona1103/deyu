<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const showModal = ref(false)
const teacher = computed(() => userStore.teacher)
const classes = computed(() => userStore.classes)

function onClassChange(event: Event) {
  const classId = (event.target as HTMLSelectElement).value
  userStore.setCurrentClass(classId)
}

function showTabletPrompt() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function goToReview() {
  router.push('/review')
}
</script>

<template>
  <div class="home-page">
    <!-- 顶部区域 -->
    <header class="header">
      <div class="header-left">
        <div class="school-badge">
          <div class="school-badge-inner">北大</div>
        </div>
        <h1 class="header-title">北大附小AI德育系统</h1>
      </div>
      <div class="header-right">
        <div class="class-selector">
          <select :value="userStore.currentClassId" @change="onClassChange">
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>
        <div class="user-info">
          <div class="user-avatar">{{ teacher?.name?.[0] || '?' }}</div>
          <span>{{ teacher?.name || '未登录' }}</span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 功能卡片 -->
      <div class="function-cards">
        <router-link to="/ranking" class="function-card">
          <div class="function-icon pink">🏆</div>
          <div class="function-title">排行榜</div>
        </router-link>
        <router-link to="/homework" class="function-card">
          <div class="function-icon blue">📝</div>
          <div class="function-title">交作业</div>
        </router-link>
        <a href="#" class="function-card" @click.prevent="showTabletPrompt">
          <div class="function-icon green">💬</div>
          <div class="function-title">我想说</div>
        </a>
      </div>

      <!-- 进入点评按钮 -->
      <button class="enter-review-btn" @click="goToReview">
        <span class="enter-review-text">进入点评</span>
      </button>
    </main>

    <!-- 底部信息 -->
    <footer class="footer">
      北京大学附属小学 | 智慧德育 启迪未来
    </footer>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">📱</div>
        <div class="modal-text">请前往老师平板端使用</div>
        <button class="modal-btn" @click="closeModal">我知道了</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.school-badge {
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.school-badge-inner {
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.header-title {
  color: white;
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.class-selector {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 30px;
  border-radius: 30px;
  display: flex;
  align-items: center;

  select {
    background: transparent;
    border: none;
    color: white;
    font-size: 22px;
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    option {
      color: var(--color-text-primary);
      background: white;
    }
  }

  &::after {
    content: '▼';
    color: white;
    font-size: 12px;
    margin-left: 10px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 20px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.function-cards {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40px;
  padding: 60px 80px;
  display: flex;
  gap: 60px;
  margin-bottom: 50px;
  box-shadow: var(--shadow-lg);
}

.function-card {
  width: 220px;
  height: 280px;
  background: white;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  border: 3px solid #f0f0f0;

  &:hover {
    transform: translateY(-10px);
    border-color: var(--color-primary);
    box-shadow: 0 15px 40px rgba(139, 0, 0, 0.2);
  }
}

.function-icon {
  width: 100px;
  height: 100px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  font-size: 48px;

  &.pink {
    background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
  }

  &.blue {
    background: linear-gradient(135deg, #87CEEB, #ADD8E6);
  }

  &.green {
    background: linear-gradient(135deg, #98D8C8, #B8E6D9);
  }
}

.function-title {
  font-size: 36px;
  font-weight: bold;
  color: var(--color-primary);
  letter-spacing: 4px;
  writing-mode: vertical-rl;
  text-orientation: upright;
}

.enter-review-btn {
  width: 800px;
  padding: 30px 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), white, rgba(255, 255, 255, 0.9));
  border-radius: 50px;
  text-align: center;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-lg);
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 6px;
    background: var(--color-primary);
    border-radius: 3px;
    top: 50%;
    transform: translateY(-50%);
  }

  &::before {
    left: 60px;
  }

  &::after {
    right: 60px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  }
}

.enter-review-text {
  font-size: 42px;
  font-weight: bold;
  color: var(--color-primary);
  letter-spacing: 8px;
}

.footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-top: 30px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 50px 60px;
  border-radius: 25px;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.modal-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.modal-text {
  font-size: 28px;
  color: var(--color-text-primary);
  margin-bottom: 30px;
}

.modal-btn {
  padding: 15px 50px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border-radius: 30px;
  font-size: 20px;
  transition: transform var(--transition-normal);

  &:hover {
    transform: translateY(-3px);
  }
}
</style>
