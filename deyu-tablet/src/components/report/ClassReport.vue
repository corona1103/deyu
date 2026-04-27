<script setup lang="ts">
import { computed } from 'vue'
import { BaseCard } from '@/components/common'
import { useReportStore } from '@/stores/report'
import { MORAL_DIMENSIONS_NEW } from '@shared/constants'

const reportStore = useReportStore()

// 雷达图数据（简化版，使用进度条替代）
const radarData = computed(() => {
  return reportStore.classDimensionStats.map(stat => ({
    ...stat,
    percentage: Math.min(100, Math.max(0, (stat.average + 20) * 2)) // 转换为百分比
  }))
})

// AI评价
const aiEvaluation = computed(() => reportStore.generateClassAIEvaluation())

// 小组排名
const groupRanking = computed(() => {
  return [...reportStore.groupComparison].sort((a, b) => b.totalScore - a.totalScore)
})

function getDimensionColor(index: number): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
  return colors[index % colors.length]
}

function getScoreColor(score: number): string {
  if (score >= 15) return '#4CAF50'
  if (score >= 5) return '#8BC34A'
  if (score >= 0) return '#FF9800'
  return '#F44336'
}
</script>

<template>
  <div class="class-report">
    <!-- 四维度雷达图（简化版） -->
    <BaseCard class="radar-card">
      <div class="card-title">班级四维度表现</div>
      <div class="dimensions-radar">
        <div
          v-for="(stat, index) in radarData"
          :key="stat.dimension"
          class="radar-item"
        >
          <div class="radar-label">{{ stat.dimension }}</div>
          <div class="radar-bar">
            <div
              class="radar-fill"
              :style="{
                width: `${stat.percentage}%`,
                background: getDimensionColor(index)
              }"
            />
          </div>
          <div class="radar-value">{{ stat.average }}分</div>
        </div>
      </div>
    </BaseCard>

    <!-- 维度详细统计 -->
    <BaseCard class="stats-card">
      <div class="card-title">维度详细统计</div>
      <div class="stats-table">
        <div class="stats-header">
          <span class="stat-col dim">维度</span>
          <span class="stat-col avg">平均分</span>
          <span class="stat-col max">最高分</span>
          <span class="stat-col min">最低分</span>
        </div>
        <div
          v-for="stat in reportStore.classDimensionStats"
          :key="stat.dimension"
          class="stats-row"
        >
          <span class="stat-col dim">{{ stat.dimension }}</span>
          <span class="stat-col avg" :style="{ color: getScoreColor(stat.average) }">
            {{ stat.average }}
          </span>
          <span class="stat-col max">{{ stat.max }}</span>
          <span class="stat-col min">{{ stat.min }}</span>
        </div>
      </div>
    </BaseCard>

    <!-- 小组对比 -->
    <BaseCard class="groups-card">
      <div class="card-title">小组对比排名</div>
      <div class="groups-ranking">
        <div
          v-for="(group, index) in groupRanking"
          :key="group.groupId"
          class="group-rank-item"
          :class="{ 'top-3': index < 3 }"
        >
          <div class="rank-badge" :class="`rank-${index + 1}`">
            {{ index + 1 }}
          </div>
          <div class="group-info">
            <span class="group-icon">{{ group.icon }}</span>
            <span class="group-name">{{ group.groupName }}</span>
          </div>
          <div class="group-score">{{ group.totalScore }}分</div>
          <div class="dimension-scores">
            <span
              v-for="dim in MORAL_DIMENSIONS_NEW"
              :key="dim"
              class="dim-score"
              :title="dim"
            >
              {{ group.scores[dim] || 0 }}
            </span>
          </div>
        </div>
      </div>
      <div class="dimension-legend">
        <span v-for="dim in MORAL_DIMENSIONS_NEW" :key="dim" class="legend-item">
          {{ dim }}
        </span>
      </div>
    </BaseCard>

    <!-- AI综合评价 -->
    <BaseCard class="ai-card">
      <div class="card-title">
        <span class="ai-icon">🤖</span>
        AI班级综合评价
      </div>
      <div class="ai-content">
        {{ aiEvaluation }}
      </div>
    </BaseCard>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.class-report {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

// 雷达图卡片
.radar-card {
  padding: 20px;
}

.dimensions-radar {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.radar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.radar-label {
  width: 50px;
  font-size: 14px;
  font-weight: 500;
  color: $gray-700;
}

.radar-bar {
  flex: 1;
  height: 20px;
  background: $gray-100;
  border-radius: 10px;
  overflow: hidden;
}

.radar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.radar-value {
  width: 50px;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  color: $gray-800;
}

// 统计表格
.stats-card {
  padding: 20px;
}

.stats-table {
  overflow-x: auto;
}

.stats-header, .stats-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid $gray-100;
}

.stats-header {
  font-weight: bold;
  color: $gray-600;
  font-size: 13px;
}

.stats-row {
  font-size: 14px;
  color: $gray-800;
}

.stat-col {
  &.dim { flex: 1.2; }
  &.avg, &.max, &.min { flex: 1; text-align: center; }
}

// 小组排名
.groups-card {
  padding: 20px;
}

.groups-ranking {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: $gray-50;
  border-radius: $radius-md;

  &.top-3 {
    background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  }
}

.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: $gray-300;
  color: white;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &.rank-1 { background: #FFD700; }
  &.rank-2 { background: #C0C0C0; }
  &.rank-3 { background: #CD7F32; }
}

.group-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.group-icon {
  font-size: 20px;
}

.group-name {
  font-size: 14px;
  font-weight: 500;
  color: $gray-800;
}

.group-score {
  font-size: 16px;
  font-weight: bold;
  color: $primary;
  min-width: 60px;
  text-align: right;
}

.dimension-scores {
  display: flex;
  gap: 8px;
}

.dim-score {
  width: 32px;
  height: 24px;
  background: white;
  border-radius: $radius-sm;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $gray-600;
}

.dimension-legend {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid $gray-100;
}

.legend-item {
  font-size: 12px;
  color: $gray-500;
}

// AI评价
.ai-card {
  padding: 20px;
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
}

.ai-icon {
  font-size: 20px;
}

.ai-content {
  font-size: 15px;
  line-height: 1.8;
  color: $gray-700;
}
</style>
