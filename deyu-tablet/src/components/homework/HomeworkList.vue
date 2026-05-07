<script setup lang="ts">
import { useHomeworkStore } from '@/stores/homework'
import type { TimeFilter } from '@/stores/homework'
import { SUBJECTS, SUBJECT_COLORS } from '@shared/constants'
import type { Homework, Subject } from '@shared/types'

const store = useHomeworkStore()

const filterTabs: (Subject | '全部')[] = ['全部', ...SUBJECTS as unknown as Subject[]]

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'semester', label: '本学期' },
  { value: 'all', label: '全部' },
]

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || '#999'
}

function formatDeadline(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')

  if (d.getTime() < now.getTime()) {
    return '已截止'
  }
  if (isToday) {
    return `今天 ${hh}:${mm}`
  }
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${month}-${String(day).padStart(2, '0')} ${hh}:${mm}`
}

function formatCreatedAt(iso: string) {
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hh}:${mm}`
}

function getSubmitCounts(hw: Homework) {
  const onTime = hw.submissions.filter(s => s.status === 'submitted').length
  const late = hw.submissions.filter(s => s.status === 'late').length
  const missing = hw.submissions.filter(s => s.status === 'missing').length
  return { onTime, late, missing }
}

function formatDeadlineLabel(iso: string) {
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hh}:${mm}截止`
}

function isExpired(hw: Homework) {
  return new Date(hw.deadline) < new Date()
}
</script>

<template>
  <div class="homework-list">
    <!-- 概览卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-value">{{ store.weekHomeworkCount }}</div>
        <div class="stat-label">本周作业数</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">{{ store.avgSubmitRate }}%</div>
        <div class="stat-label">提交率</div>
      </div>
      <div class="stat-card primary">
        <div class="stat-value">{{ store.avgOnTimeRate }}%</div>
        <div class="stat-label">按时率</div>
      </div>
    </div>

    <!-- 时间筛选条 -->
    <div class="time-filter-bar">
      <div
        v-for="opt in timeFilterOptions"
        :key="opt.value"
        class="time-filter-tab touch-active"
        :class="{ active: store.timeFilter === opt.value }"
        @click="store.setTimeFilter(opt.value)"
      >
        {{ opt.label }}
      </div>
    </div>

    <!-- 学科筛选条 -->
    <div class="filter-bar">
      <div
        v-for="tab in filterTabs"
        :key="tab"
        class="filter-tab touch-active"
        :class="{ active: store.activeFilter === tab }"
        @click="store.setFilter(tab)"
      >
        {{ tab }}
      </div>
    </div>

    <!-- 作业卡片列表 -->
    <div v-if="store.filteredHomeworks.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无作业</div>
    </div>

    <div
      v-for="hw in store.filteredHomeworks"
      :key="hw.id"
      class="hw-card touch-active"
      @click="store.openDetail(hw.id)"
    >
      <div class="hw-card-header">
        <span
          class="subject-tag"
          :style="{ background: getSubjectColor(hw.subject) + '18', color: getSubjectColor(hw.subject) }"
        >
          {{ hw.subject }}
        </span>
        <span class="hw-deadline" :class="{ expired: isExpired(hw) }">
          {{ formatDeadlineLabel(hw.deadline) }}
        </span>
      </div>
      <div class="hw-title">{{ hw.title }}</div>
      <div class="hw-meta">{{ hw.createdBy }}老师发布于 {{ formatCreatedAt(hw.createdAt) }}</div>

      <!-- 三项统计 -->
      <div class="submit-counts">
        <span class="count-ontime">按时提交 {{ getSubmitCounts(hw).onTime }}</span>
        <span class="count-late">补交 {{ getSubmitCounts(hw).late }}</span>
        <span class="count-missing">未交 {{ getSubmitCounts(hw).missing }}</span>
      </div>
    </div>

    <!-- FAB 发布按钮 -->
    <div class="fab touch-active" @click="store.showPublishModal = true">
      <span>+</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.homework-list {
  padding-bottom: 100px;
}

// 概览卡片
.stat-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: $radius-md;
  padding: 16px 12px;
  text-align: center;
  box-shadow: $shadow-sm;

  .stat-value {
    font-size: 26px;
    font-weight: bold;
    color: $gray-800;
  }

  .stat-label {
    font-size: 12px;
    color: $gray-400;
    margin-top: 4px;
  }

  &.success .stat-value { color: $success; }
  &.primary .stat-value { color: $secondary; }
}

// 时间筛选条
.time-filter-bar {
  display: flex;
  gap: 0;
  margin-bottom: 12px;
  background: white;
  border-radius: $radius-full;
  padding: 3px;
  box-shadow: $shadow-sm;
}

.time-filter-tab {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  border-radius: $radius-full;
  font-size: 13px;
  color: $gray-500;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: $primary;
    color: white;
  }
}

// 学科筛选条
.filter-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 16px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { display: none; }
}

.filter-tab {
  flex-shrink: 0;
  padding: 6px 16px;
  border-radius: $radius-full;
  font-size: 13px;
  color: $gray-500;
  background: white;
  border: 1px solid $gray-200;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: $primary;
    color: white;
    border-color: $primary;
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: $gray-400;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 15px;
}

// 作业卡片
.hw-card {
  background: white;
  border-radius: $radius-md;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.98);
  }
}

.hw-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subject-tag {
  padding: 2px 10px;
  border-radius: $radius-full;
  font-size: 12px;
  font-weight: 600;
}

.hw-deadline {
  font-size: 12px;
  color: $gray-400;

  &.expired {
    color: $danger;
  }
}

.hw-title {
  font-size: 16px;
  font-weight: 600;
  color: $gray-800;
  margin-bottom: 4px;
}

.hw-meta {
  font-size: 12px;
  color: $gray-400;
  margin-bottom: 10px;
}

// 三项统计
.submit-counts {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.count-ontime {
  color: $success;
  font-weight: 600;
}

.count-late {
  color: $warning;
  font-weight: 600;
}

.count-missing {
  color: $gray-400;
  font-weight: 600;
}

// FAB
.fab {
  position: fixed;
  right: 24px;
  bottom: 100px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: $shadow-md;
  cursor: pointer;
  z-index: 50;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.92);
  }

  @media (min-width: $breakpoint-md) {
    right: 40px;
    bottom: 40px;
  }
}
</style>
