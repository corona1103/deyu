<script setup lang="ts">
import { computed } from 'vue'
import { BaseModal } from '@/components/common'
import { useHomeworkStore } from '@/stores/homework'
import { SUBJECT_COLORS } from '@shared/constants'

const store = useHomeworkStore()

const hw = computed(() => store.selectedHomework)

const stats = computed(() => {
  if (!hw.value) return { submitted: 0, late: 0, missing: 0, submitRate: 0, onTimeRate: 0 }
  const submitted = hw.value.submissions.filter(s => s.status === 'submitted').length
  const late = hw.value.submissions.filter(s => s.status === 'late').length
  const missing = hw.value.submissions.filter(s => s.status === 'missing').length
  const total = hw.value.totalStudents
  const submitRate = total > 0 ? Math.round(((submitted + late) / total) * 100) : 0
  const onTimeRate = (submitted + late) > 0 ? Math.round((submitted / (submitted + late)) * 100) : 0
  return { submitted, late, missing, submitRate, onTimeRate }
})

function formatTime(iso?: string) {
  if (!iso) return '-'
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || '#999'
}

function getStatusLabel(status: string) {
  if (status === 'submitted') return '已提交'
  if (status === 'late') return '迟交'
  return '未提交'
}

function getStatusClass(status: string) {
  if (status === 'submitted') return 'status-submitted'
  if (status === 'late') return 'status-late'
  return 'status-missing'
}
</script>

<template>
  <BaseModal
    v-model="store.showDetailModal"
    title="作业详情"
    position="bottom"
    @close="store.closeDetail"
  >
    <template v-if="hw">
      <!-- 作业信息 -->
      <div class="detail-header">
        <span
          class="subject-tag"
          :style="{ background: getSubjectColor(hw.subject) + '18', color: getSubjectColor(hw.subject) }"
        >
          {{ hw.subject }}
        </span>
        <span class="detail-status" :class="hw.status">
          {{ hw.status === 'active' ? '进行中' : '已结束' }}
        </span>
      </div>
      <div class="detail-title">{{ hw.title }}</div>
      <div class="detail-meta">
        {{ hw.createdBy }} 发布 &middot; 截止 {{ formatTime(hw.deadline) }}
      </div>

      <!-- 统计卡片 -->
      <div class="detail-stats">
        <div class="d-stat">
          <div class="d-stat-value">{{ stats.submitRate }}%</div>
          <div class="d-stat-label">提交率</div>
        </div>
        <div class="d-stat">
          <div class="d-stat-value success">{{ stats.submitted }}</div>
          <div class="d-stat-label">按时提交</div>
        </div>
        <div class="d-stat">
          <div class="d-stat-value warning">{{ stats.late }}</div>
          <div class="d-stat-label">迟交</div>
        </div>
        <div class="d-stat">
          <div class="d-stat-value danger">{{ stats.missing }}</div>
          <div class="d-stat-label">未交</div>
        </div>
      </div>

      <!-- 学生提交名单 -->
      <div class="student-list-header">学生提交情况</div>
      <div class="student-list">
        <div
          v-for="sub in hw.submissions"
          :key="sub.studentId"
          class="student-row"
        >
          <div class="student-name">{{ sub.studentName }}</div>
          <div class="student-time">{{ sub.status !== 'missing' ? formatTime(sub.submittedAt) : '' }}</div>
          <span class="student-status" :class="getStatusClass(sub.status)">
            {{ getStatusLabel(sub.status) }}
          </span>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.detail-header {
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

.detail-status {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: $radius-full;

  &.active {
    background: rgba($success, 0.1);
    color: $success;
  }

  &.ended {
    background: $gray-100;
    color: $gray-400;
  }
}

.detail-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 4px;
}

.detail-meta {
  font-size: 13px;
  color: $gray-400;
  margin-bottom: 20px;
}

// 统计卡片
.detail-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.d-stat {
  flex: 1;
  background: $gray-50;
  border-radius: $radius-sm;
  padding: 12px 8px;
  text-align: center;
}

.d-stat-value {
  font-size: 22px;
  font-weight: bold;
  color: $gray-800;

  &.success { color: $success; }
  &.warning { color: $warning; }
  &.danger { color: $danger; }
}

.d-stat-label {
  font-size: 11px;
  color: $gray-400;
  margin-top: 2px;
}

// 学生名单
.student-list-header {
  font-size: 14px;
  font-weight: 600;
  color: $gray-700;
  margin-bottom: 12px;
}

.student-list {
  max-height: 300px;
  overflow-y: auto;
}

.student-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    border-bottom: none;
  }
}

.student-name {
  flex: 1;
  font-size: 14px;
  color: $gray-800;
}

.student-time {
  font-size: 12px;
  color: $gray-400;
  margin-right: 12px;
}

.student-status {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: $radius-full;
  font-weight: 500;

  &.status-submitted {
    background: rgba($success, 0.1);
    color: $success;
  }

  &.status-late {
    background: rgba($warning, 0.1);
    color: $warning;
  }

  &.status-missing {
    background: rgba($danger, 0.08);
    color: $danger;
  }
}
</style>
