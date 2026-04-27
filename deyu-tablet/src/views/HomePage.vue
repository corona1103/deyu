<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useResponsive } from '@/composables/useResponsive'
import { BaseAvatar, BaseModal } from '@/components/common'

const router = useRouter()
const userStore = useUserStore()
const { isMobile } = useResponsive()

const showHomeworkModal = ref(false)
const homeworkContent = ref('')
const isRecording = ref(false)

interface FunctionItem {
  path: string
  name: string
  desc: string
  icon: string
}

const functions: FunctionItem[] = [
  { path: '/review', name: '行为点评', desc: '给学生加减分', icon: '⭐' },
  { path: '/voice-review', name: '语音点评', desc: 'AI智能记录', icon: '🎙️' },
  { path: '/report', name: '德育报告', desc: '查看学生报告', icon: '📊' },
  { path: '/warning', name: '预警中心', desc: '关注问题学生', icon: '⚠️' },
  { path: '/ai-phone', name: 'AI电话亭', desc: '心理对话辅导', icon: '💬' },
  { path: '/class-manage', name: '班级管理', desc: '分组/座位/指标', icon: '👥' }
]

function navigateTo(path: string) {
  router.push(path)
}

function toggleRecording() {
  isRecording.value = !isRecording.value
}

function submitHomework() {
  if (!homeworkContent.value.trim()) {
    alert('请输入作业内容')
    return
  }
  // TODO: 发送作业
  showHomeworkModal.value = false
  homeworkContent.value = ''
}
</script>

<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-top">
        <div class="user-info">
          <BaseAvatar
            :name="userStore.teacher?.name || ''"
            size="lg"
            color="white"
          />
          <div class="user-detail">
            <div class="user-name">{{ userStore.teacher?.name }}</div>
            <div class="user-class">{{ userStore.currentClass?.name }}</div>
          </div>
        </div>
        <div class="header-actions">
          <div class="header-btn touch-active">🔔</div>
          <div class="header-btn touch-active">⚙️</div>
        </div>
      </div>

      <!-- 快速发布作业 -->
      <div
        class="quick-homework touch-active"
        @click="showHomeworkModal = true"
      >
        <div class="quick-homework-icon">📝</div>
        <div class="quick-homework-text">
          <div class="quick-homework-title">快速发布作业</div>
          <div class="quick-homework-hint">语音/打字快速布置，同步大屏</div>
        </div>
        <span class="quick-homework-arrow">›</span>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="section-title">功能入口</div>
      <div class="function-grid">
        <div
          v-for="(func, index) in functions"
          :key="func.path"
          class="function-card touch-active"
          @click="navigateTo(func.path)"
        >
          <div class="function-icon" :class="`color-${index}`">
            {{ func.icon }}
          </div>
          <div class="function-name">{{ func.name }}</div>
          <div class="function-desc">{{ func.desc }}</div>
        </div>
      </div>

      <!-- 今日概况 -->
      <div class="today-overview">
        <div class="overview-header">
          <span class="overview-title">今日概况</span>
          <span class="overview-more touch-active">查看详情 ›</span>
        </div>
        <div class="overview-stats">
          <div class="stat-card">
            <div class="stat-value">28</div>
            <div class="stat-label">今日点评人次</div>
          </div>
          <div class="stat-card warning">
            <div class="stat-value">3</div>
            <div class="stat-label">待关注学生</div>
          </div>
          <div class="stat-card danger">
            <div class="stat-value">5</div>
            <div class="stat-label">未交作业</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 发布作业弹窗 -->
    <BaseModal
      v-model="showHomeworkModal"
      title="发布作业"
      position="bottom"
    >
      <textarea
        v-model="homeworkContent"
        class="homework-input"
        placeholder="请输入作业内容，如：完成数学练习册第15页"
      />
      <div class="input-actions">
        <div
          class="voice-btn touch-active"
          :class="{ recording: isRecording }"
          @click="toggleRecording"
        >
          <span>🎙️</span>
          <span>{{ isRecording ? '录音中...' : '语音输入' }}</span>
        </div>
        <button class="submit-homework-btn" @click="submitHomework">
          发布
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.home-page {
  min-height: 100vh;
  background: $gray-100;
}

.header {
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  padding: 50px 20px 30px;
  color: white;

  @media (min-width: $breakpoint-md) {
    padding: 30px 40px;
  }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.base-avatar .avatar-initial) {
  background: white !important;
  color: $primary !important;
}

.user-detail {
  text-align: left;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
}

.user-class {
  font-size: 13px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.header-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}

.quick-homework {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.quick-homework-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.quick-homework-text {
  flex: 1;
}

.quick-homework-title {
  font-size: 16px;
  font-weight: bold;
}

.quick-homework-hint {
  font-size: 12px;
  opacity: 0.8;
}

.quick-homework-arrow {
  font-size: 20px;
  opacity: 0.6;
}

.main-content {
  padding: 20px;

  @media (min-width: $breakpoint-md) {
    padding: 30px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 15px;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

.function-card {
  background: white;
  border-radius: $radius-lg;
  padding: 25px 20px;
  text-align: center;
  box-shadow: $shadow-sm;
  cursor: pointer;

  @media (min-width: $breakpoint-md) {
    padding: 35px 25px;
  }
}

.function-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 28px;

  @media (min-width: $breakpoint-md) {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  &.color-0 { background: linear-gradient(135deg, #FFB6C1, #FFC0CB); }
  &.color-1 { background: linear-gradient(135deg, #87CEEB, #ADD8E6); }
  &.color-2 { background: linear-gradient(135deg, #98D8C8, #B8E6D9); }
  &.color-3 { background: linear-gradient(135deg, #F7DC6F, #F9E79F); }
  &.color-4 { background: linear-gradient(135deg, #E6E6FA, #D8BFD8); }
  &.color-5 { background: linear-gradient(135deg, #DDA0DD, #EE82EE); }
}

.function-name {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 5px;
}

.function-desc {
  font-size: 12px;
  color: $gray-400;
}

.today-overview {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: $shadow-sm;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.overview-title {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

.overview-more {
  font-size: 14px;
  color: $primary;
  cursor: pointer;
}

.overview-stats {
  display: flex;
  gap: 15px;
}

.stat-card {
  flex: 1;
  background: $gray-50;
  border-radius: $radius-md;
  padding: 15px;
  text-align: center;

  &.warning .stat-value {
    color: $warning;
  }

  &.danger .stat-value {
    color: $danger;
  }
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: $gray-800;
}

.stat-label {
  font-size: 12px;
  color: $gray-400;
  margin-top: 5px;
}

// 作业弹窗
.homework-input {
  width: 100%;
  height: 120px;
  border: 1px solid $gray-200;
  border-radius: 15px;
  padding: 15px;
  font-size: 16px;
  resize: none;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.voice-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: $gray-100;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-600;
  cursor: pointer;

  &.recording {
    background: #FFEBEE;
    color: $danger;
  }
}

.submit-homework-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
