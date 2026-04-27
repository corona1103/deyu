<script setup lang="ts">
import { computed } from 'vue'
import type { Student } from '@shared/types'
import { BaseCard, BaseAvatar } from '@/components/common'
import { useReportStore } from '@/stores/report'

interface Props {
  student: Student
}

const props = defineProps<Props>()

const reportStore = useReportStore()

// 学生维度数据
const dimensionData = computed(() =>
  reportStore.getStudentDimensionData(props.student.id)
)

// AI评价
const aiEvaluation = computed(() =>
  reportStore.generateStudentAIEvaluation(props.student.id)
)

// 建议
const suggestions = computed(() =>
  reportStore.generateStudentSuggestions(props.student.id)
)

// 综合评分
const overallScore = computed(() =>
  Math.floor(props.student.score / 10)
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
</script>

<template>
  <div class="student-report">
    <!-- 分数概览 -->
    <BaseCard class="score-overview">
      <div class="overview-header">
        <BaseAvatar :name="student.name" size="xl" />
        <div class="overview-info">
          <div class="student-name">{{ student.name }}</div>
          <div class="student-meta">德育积分：{{ student.score }}</div>
        </div>
        <div class="total-score">
          <div class="score-value">{{ overallScore }}</div>
          <div class="score-label">综合评分</div>
        </div>
      </div>
    </BaseCard>

    <!-- 四维度评价 -->
    <div class="section-title">四维度评价</div>
    <div class="dimensions-grid">
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
        </div>
        <div class="dim-progress">
          <div
            class="progress-bar"
            :style="{
              width: `${Math.min(100, Math.max(5, (dim.score + 20) * 2))}%`,
              background: getDimensionColor(index)
            }"
          />
        </div>
        <div class="dim-score">
          {{ dim.score > 0 ? '+' : '' }}{{ dim.score }}分
        </div>
        <div v-if="dim.records.length > 0" class="dim-recent">
          最近：{{ dim.records.slice(-1)[0]?.description || '-' }}
        </div>
      </BaseCard>
    </div>

    <!-- AI综合评价 -->
    <div class="section-title">
      <span class="ai-icon">🤖</span>
      AI综合评价
    </div>
    <BaseCard class="ai-evaluation">
      <p class="evaluation-text">{{ aiEvaluation }}</p>
    </BaseCard>

    <!-- 干预建议 -->
    <div class="section-title">成长建议</div>
    <BaseCard class="suggestions-card">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        class="suggestion-item"
      >
        <span class="suggestion-icon">💡</span>
        <span class="suggestion-text">{{ suggestion }}</span>
      </div>
    </BaseCard>

    <!-- 行为记录摘要 -->
    <div class="section-title">近期行为记录</div>
    <BaseCard class="records-card">
      <template v-for="dim in dimensionData" :key="dim.name">
        <div v-if="dim.records.length > 0" class="records-section">
          <div class="records-dim-title">
            <span>{{ dim.icon }} {{ dim.name }}</span>
            <span class="records-count">{{ dim.records.length }}条</span>
          </div>
          <div class="records-list">
            <div
              v-for="record in dim.records.slice(-3)"
              :key="record.id"
              class="record-item"
              :class="{ negative: record.type === 'negative' }"
            >
              <span class="record-desc">{{ record.description }}</span>
              <span class="record-points">
                {{ record.points > 0 ? '+' : '' }}{{ record.points }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <div v-if="dimensionData.every(d => d.records.length === 0)" class="no-records">
        暂无行为记录
      </div>
    </BaseCard>
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

// 分数概览
.score-overview {
  margin-bottom: 5px;
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.overview-info {
  flex: 1;
}

.student-name {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 5px;
}

.student-meta {
  font-size: 14px;
  color: $gray-500;
}

.total-score {
  text-align: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: $radius-md;
  color: white;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
}

.score-label {
  font-size: 12px;
  opacity: 0.8;
}

// 维度网格
.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.dimension-card {
  padding: 15px;
}

.dim-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.dim-icon {
  font-size: 18px;
}

.dim-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: $gray-800;
}

.dim-level {
  font-size: 12px;
  font-weight: 500;
}

.dim-progress {
  height: 8px;
  background: $gray-100;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.dim-score {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: $gray-800;
  margin-bottom: 5px;
}

.dim-recent {
  font-size: 11px;
  color: $gray-500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// AI评价
.ai-evaluation {
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
}

.evaluation-text {
  font-size: 15px;
  line-height: 1.8;
  color: $gray-700;
  margin: 0;
}

// 建议
.suggestions-card {
  padding: 10px 15px;
}

.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    border-bottom: none;
  }
}

.suggestion-icon {
  font-size: 18px;
}

.suggestion-text {
  flex: 1;
  font-size: 14px;
  color: $gray-700;
  line-height: 1.5;
}

// 行为记录
.records-card {
  padding: 10px 15px;
}

.records-section {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.records-dim-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: $gray-700;
  margin-bottom: 8px;
}

.records-count {
  font-size: 12px;
  color: $gray-500;
  font-weight: normal;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #E8F5E9;
  border-radius: $radius-sm;
  font-size: 13px;

  &.negative {
    background: #FFEBEE;
  }
}

.record-desc {
  color: $gray-700;
}

.record-points {
  font-weight: bold;
  color: $success;

  .negative & {
    color: $danger;
  }
}

.no-records {
  padding: 30px;
  text-align: center;
  color: $gray-400;
  font-size: 14px;
}
</style>
