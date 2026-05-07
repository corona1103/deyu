<script setup lang="ts">
import { computed } from 'vue'
import type { Student, StatPeriod } from '@shared/types'
import { BaseCard, BaseAvatar } from '@/components/common'
import { useReportStore } from '@/stores/report'

interface Props {
  student: Student
  classId: string
  period: StatPeriod
}

const props = defineProps<Props>()
const reportStore = useReportStore()

// 分数概览
const scoreOverview = computed(() =>
  reportStore.getStudentScoreOverview(props.student.id, props.classId, props.period)
)

// 四维度评价
const dimensionData = computed(() =>
  reportStore.getStudentDimensionData(props.student.id, props.period)
)

// 综合评价
const evaluation = computed(() =>
  reportStore.generateStudentEvaluation(props.student.id, props.classId, props.period)
)

// 家校共育
const homeSchoolGuide = computed(() =>
  reportStore.generateHomeSchoolGuide(props.student.id, props.period)
)

// 行为明细
const behaviorDetails = computed(() =>
  reportStore.getStudentBehaviorDetails(props.student.id, props.period)
)

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    excellent: '#4CAF50',
    good: '#8BC34A',
    average: '#FF9800',
    poor: '#F44336'
  }
  return colors[level] || colors.average
}

function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    average: '中等',
    poor: '待提升'
  }
  return labels[level] || labels.average
}

function getDimensionColor(index: number): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
  return colors[index % colors.length]
}

function formatDate(date: Date): string {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<template>
  <div class="student-report">
    <!-- 1. 分数概览 -->
    <BaseCard class="score-overview">
      <div class="overview-header">
        <BaseAvatar :name="student.name" size="xl" />
        <div class="overview-info">
          <div class="student-name">{{ student.name }}</div>
          <div class="score-summary">
            <span class="score-total">{{ scoreOverview.total }}分</span>
            <span class="score-plus">+{{ scoreOverview.plusTotal }}</span>
            <span class="score-minus">{{ scoreOverview.minusTotal }}</span>
          </div>
        </div>
      </div>
      <div class="ranking-row">
        <div class="ranking-item">
          <span class="ranking-label">班级排名</span>
          <span class="ranking-value">{{ scoreOverview.classRank }}/{{ scoreOverview.classTotal }}</span>
        </div>
        <div v-if="scoreOverview.groupName" class="ranking-item">
          <span class="ranking-label">{{ scoreOverview.groupName }}</span>
          <span class="ranking-value">{{ scoreOverview.groupRank }}/{{ scoreOverview.groupTotal }}</span>
        </div>
      </div>
    </BaseCard>

    <!-- 2. 四维度评价 -->
    <div class="section-title">四维度评价</div>
    <div class="dimensions-list">
      <BaseCard
        v-for="(dim, index) in dimensionData"
        :key="dim.name"
        class="dimension-card"
      >
        <div class="dim-header">
          <span class="dim-icon">{{ dim.icon }}</span>
          <span class="dim-name">{{ dim.name }}</span>
          <span
            class="dim-level"
            :style="{ color: getLevelColor(dim.level) }"
          >
            {{ getLevelLabel(dim.level) }}
          </span>
          <span class="dim-score-badge" :style="{ background: getDimensionColor(index) }">
            {{ dim.score > 0 ? '+' : '' }}{{ dim.score }}分
          </span>
        </div>
        <div class="dim-progress">
          <div
            class="progress-bar"
            :style="{
              width: `${Math.min(100, Math.max(5, (dim.score + 10) * 3))}%`,
              background: getDimensionColor(index)
            }"
          />
        </div>
        <div v-if="dim.strengthText" class="dim-strength">
          <span class="strength-label">优势：</span>{{ dim.strengthText }}
        </div>
        <div v-if="dim.suggestionText" class="dim-suggestion">
          <span class="suggestion-label">建议：</span>{{ dim.suggestionText }}
        </div>
      </BaseCard>
    </div>

    <!-- 3. 综合评价与成长建议 -->
    <div class="section-title">
      <span class="ai-icon">🤖</span>
      综合评价
    </div>
    <BaseCard class="evaluation-card">
      <p class="evaluation-text">{{ evaluation }}</p>
    </BaseCard>

    <!-- 4. 家校共育指南 -->
    <div class="section-title">
      <span class="ai-icon">🏠</span>
      家校共育指南
    </div>
    <BaseCard class="guide-card">
      <template v-if="homeSchoolGuide.hasWarning">
        <div class="guide-section warning-section">
          <div class="guide-label warning-label">预警信号</div>
          <div
            v-for="(issue, i) in homeSchoolGuide.warningIssues"
            :key="i"
            class="guide-item warning-item"
          >
            {{ issue }}
          </div>
        </div>
      </template>
      <div class="guide-section">
        <div class="guide-label teacher-label">老师建议</div>
        <div
          v-for="(advice, i) in homeSchoolGuide.teacherAdvice"
          :key="'t' + i"
          class="guide-item"
        >
          {{ advice }}
        </div>
      </div>
      <div class="guide-section">
        <div class="guide-label parent-label">家长建议</div>
        <div
          v-for="(advice, i) in homeSchoolGuide.parentAdvice"
          :key="'p' + i"
          class="guide-item"
        >
          {{ advice }}
        </div>
      </div>
    </BaseCard>

    <!-- 5. 行为明细 -->
    <div class="section-title">行为明细</div>
    <div class="behavior-details">
      <BaseCard
        v-for="detail in behaviorDetails"
        :key="detail.key"
        class="detail-card"
      >
        <div class="detail-header">
          <span class="detail-icon">{{ detail.icon }}</span>
          <span class="detail-dim-name">{{ detail.dimension }}</span>
          <span class="detail-stats">
            <span class="detail-plus">+{{ detail.totalPlus }}</span>
            <span class="detail-minus">{{ detail.totalMinus }}</span>
          </span>
        </div>

        <!-- 加分明细 -->
        <template v-if="detail.plusRecords.length > 0">
          <div class="record-group-title plus">加分记录</div>
          <div
            v-for="r in detail.plusRecords"
            :key="r.id"
            class="record-row plus"
          >
            <span class="record-date">{{ formatDate(r.createdAt) }}</span>
            <span class="record-desc">{{ r.description }}</span>
            <span class="record-pts">+{{ r.points }}</span>
          </div>
        </template>

        <!-- 扣分明细 -->
        <template v-if="detail.minusRecords.length > 0">
          <div class="record-group-title minus">扣分记录</div>
          <div
            v-for="r in detail.minusRecords"
            :key="r.id"
            class="record-row minus"
          >
            <span class="record-date">{{ formatDate(r.createdAt) }}</span>
            <span class="record-desc">{{ r.description }}</span>
            <span class="record-pts">{{ r.points }}</span>
          </div>
        </template>

        <div
          v-if="detail.plusRecords.length === 0 && detail.minusRecords.length === 0"
          class="no-records"
        >
          暂无记录
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.student-report {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.ai-icon {
  font-size: 18px;
}

// ========== 1. 分数概览 ==========
.score-overview {
  padding: 20px;
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.overview-info {
  flex: 1;
}

.student-name {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 6px;
}

.score-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-total {
  font-size: 24px;
  font-weight: bold;
  color: $primary;
}

.score-plus {
  font-size: 14px;
  color: $success;
  background: #E8F5E9;
  padding: 2px 8px;
  border-radius: $radius-sm;
}

.score-minus {
  font-size: 14px;
  color: $danger;
  background: #FFEBEE;
  padding: 2px 8px;
  border-radius: $radius-sm;
}

.ranking-row {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid $gray-100;
}

.ranking-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ranking-label {
  font-size: 12px;
  color: $gray-500;
}

.ranking-value {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
}

// ========== 2. 四维度评价 ==========
.dimensions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dimension-card {
  padding: 15px;
}

.dim-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.dim-icon {
  font-size: 20px;
}

.dim-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: $gray-800;
}

.dim-level {
  font-size: 13px;
  font-weight: 500;
}

.dim-score-badge {
  padding: 2px 10px;
  border-radius: $radius-full;
  font-size: 13px;
  font-weight: bold;
  color: white;
}

.dim-progress {
  height: 6px;
  background: $gray-100;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.dim-strength {
  font-size: 13px;
  color: $gray-600;
  line-height: 1.6;
  margin-bottom: 4px;
}

.strength-label {
  color: $success;
  font-weight: 500;
}

.dim-suggestion {
  font-size: 13px;
  color: $gray-600;
  line-height: 1.6;
}

.suggestion-label {
  color: #FF9800;
  font-weight: 500;
}

// ========== 3. 综合评价 ==========
.evaluation-card {
  background: linear-gradient(135deg, #FFF8F7, #FFECEC);
  border: 1px solid #FFD6D6;
}

.evaluation-text {
  font-size: 15px;
  line-height: 1.8;
  color: $gray-700;
  margin: 0;
}

// ========== 4. 家校共育 ==========
.guide-card {
  padding: 15px;
}

.guide-section {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.guide-label {
  font-size: 13px;
  font-weight: bold;
  padding: 3px 10px;
  border-radius: $radius-sm;
  display: inline-block;
  margin-bottom: 8px;
}

.warning-label {
  background: #FFEBEE;
  color: $danger;
}

.teacher-label {
  background: #E3F2FD;
  color: #1565C0;
}

.parent-label {
  background: #E8F5E9;
  color: #2E7D32;
}

.guide-item {
  font-size: 14px;
  color: $gray-700;
  line-height: 1.7;
  padding-left: 12px;
  position: relative;
  margin-bottom: 6px;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: $gray-400;
  }
}

.warning-item {
  color: $danger;

  &::before {
    color: $danger;
  }
}

.warning-section {
  padding-bottom: 12px;
  border-bottom: 1px solid #FFCDD2;
}

// ========== 5. 行为明细 ==========
.behavior-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-card {
  padding: 15px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid $gray-100;
}

.detail-icon {
  font-size: 18px;
}

.detail-dim-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: $gray-800;
}

.detail-stats {
  display: flex;
  gap: 8px;
}

.detail-plus {
  font-size: 13px;
  color: $success;
  font-weight: 500;
}

.detail-minus {
  font-size: 13px;
  color: $danger;
  font-weight: 500;
}

.record-group-title {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 0 4px;

  &.plus {
    color: $success;
  }

  &.minus {
    color: $danger;
  }
}

.record-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: $radius-sm;
  font-size: 13px;
  margin-bottom: 4px;

  &.plus {
    background: #F1F8E9;
  }

  &.minus {
    background: #FFF3E0;
  }
}

.record-date {
  color: $gray-400;
  font-size: 12px;
  min-width: 36px;
}

.record-desc {
  flex: 1;
  color: $gray-700;
}

.record-pts {
  font-weight: bold;
  min-width: 30px;
  text-align: right;

  .plus & {
    color: $success;
  }

  .minus & {
    color: $danger;
  }
}

.no-records {
  padding: 15px;
  text-align: center;
  color: $gray-400;
  font-size: 13px;
}
</style>
