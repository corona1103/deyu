<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard, BaseAvatar } from '@/components/common'

interface Warning {
  id: string
  studentName: string
  type: 'behavior' | 'homework' | 'attendance'
  level: 'low' | 'medium' | 'high'
  message: string
  time: string
}

const warnings = ref<Warning[]>([
  { id: '1', studentName: '李嘉懿', type: 'behavior', level: 'high', message: '本周连续3天课堂表现不佳', time: '2小时前' },
  { id: '2', studentName: '陈翌泽', type: 'homework', level: 'medium', message: '已连续2次未交数学作业', time: '4小时前' },
  { id: '3', studentName: '王泊远', type: 'attendance', level: 'low', message: '本周迟到1次', time: '昨天' },
])

const currentTab = ref<'all' | 'unhandled'>('all')

function getLevelColor(level: string) {
  const colors: Record<string, string> = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50'
  }
  return colors[level]
}

function getTypeIcon(type: string) {
  const icons: Record<string, string> = {
    behavior: '⚠️',
    homework: '📋',
    attendance: '⏰'
  }
  return icons[type]
}

function handleWarning(id: string) {
  alert(`处理预警 ${id}`)
}
</script>

<template>
  <div class="warning-page">
    <PageHeader title="预警中心" />

    <main class="main-content">
      <!-- Tab 切换 -->
      <div class="tab-bar">
        <div
          class="tab-item"
          :class="{ active: currentTab === 'all' }"
          @click="currentTab = 'all'"
        >
          全部预警
        </div>
        <div
          class="tab-item"
          :class="{ active: currentTab === 'unhandled' }"
          @click="currentTab = 'unhandled'"
        >
          待处理
        </div>
      </div>

      <!-- 预警列表 -->
      <div class="warning-list">
        <BaseCard
          v-for="warning in warnings"
          :key="warning.id"
          class="warning-card"
          hoverable
          @click="handleWarning(warning.id)"
        >
          <div class="warning-header">
            <div class="warning-left">
              <BaseAvatar :name="warning.studentName" size="md" />
              <div class="warning-info">
                <div class="warning-name">{{ warning.studentName }}</div>
                <div class="warning-time">{{ warning.time }}</div>
              </div>
            </div>
            <div
              class="warning-level"
              :style="{ background: getLevelColor(warning.level) }"
            >
              {{ warning.level === 'high' ? '紧急' : warning.level === 'medium' ? '中等' : '轻微' }}
            </div>
          </div>
          <div class="warning-content">
            <span class="warning-icon">{{ getTypeIcon(warning.type) }}</span>
            <span class="warning-message">{{ warning.message }}</span>
          </div>
          <div class="warning-actions">
            <button class="action-btn call">电话沟通</button>
            <button class="action-btn mark">标记已处理</button>
          </div>
        </BaseCard>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.warning-page {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 800px;
    margin: 0 auto;
  }
}

.tab-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tab-item {
  padding: 10px 0;
  font-size: 16px;
  color: $gray-500;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  &.active {
    color: $primary;
    border-color: $primary;
    font-weight: bold;
  }
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.warning-card {
  padding: 15px;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.warning-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warning-info {
  text-align: left;
}

.warning-name {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

.warning-time {
  font-size: 12px;
  color: $gray-400;
}

.warning-level {
  padding: 4px 12px;
  border-radius: $radius-full;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: $gray-50;
  border-radius: $radius-md;
  margin-bottom: 12px;
}

.warning-icon {
  font-size: 18px;
}

.warning-message {
  flex: 1;
  font-size: 14px;
  color: $gray-700;
  line-height: 1.5;
}

.warning-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: $radius-md;
  font-size: 14px;
  cursor: pointer;

  &.call {
    background: #E3F2FD;
    color: $secondary;
  }

  &.mark {
    background: #E8F5E9;
    color: $success;
  }
}
</style>
