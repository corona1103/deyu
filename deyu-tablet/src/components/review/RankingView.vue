<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { MORAL_DIMENSION_INDICATORS } from '@shared/constants'

const studentsStore = useStudentsStore()

type RankTab = 'personal' | 'group' | 'category'
const activeTab = ref<RankTab>('personal')

const rankTabs = [
  { value: 'personal' as RankTab, label: '个人榜' },
  { value: 'group' as RankTab, label: '小组榜' },
  { value: 'category' as RankTab, label: '单项榜' },
]

// 个人榜：按分数排序
const personalRanking = computed(() =>
  [...studentsStore.students]
    .sort((a, b) => b.score - a.score)
    .map((s, i) => ({ ...s, rank: i + 1 }))
)

// 小组榜：按组总分排序
const groupRanking = computed(() =>
  [...studentsStore.groups]
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((g, i) => ({ ...g, rank: i + 1 }))
)

// 单项榜：四个维度各取 Top5
const categoryRankings = computed(() =>
  MORAL_DIMENSION_INDICATORS.map(dim => ({
    key: dim.key,
    name: dim.name,
    icon: dim.icon,
    topStudents: [...studentsStore.students]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s, i) => ({ ...s, rank: i + 1 }))
  }))
)

function getMedal(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}`
}
</script>

<template>
  <div class="ranking-view">
    <!-- 维度Tab -->
    <div class="rank-tabs">
      <div
        v-for="tab in rankTabs"
        :key="tab.value"
        class="rank-tab touch-active"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 个人榜 -->
    <template v-if="activeTab === 'personal'">
      <div class="personal-grid">
        <div
          v-for="student in personalRanking"
          :key="student.id"
          class="rank-card"
          :class="{ top3: student.rank <= 3 }"
        >
          <div class="rank-badge">{{ getMedal(student.rank) }}</div>
          <div class="rank-avatar">{{ student.name.charAt(0) }}</div>
          <div class="rank-name">{{ student.name }}</div>
          <div class="rank-score">{{ student.score }}分</div>
        </div>
      </div>
    </template>

    <!-- 小组榜 -->
    <template v-else-if="activeTab === 'group'">
      <div class="group-rank-grid">
        <div
          v-for="group in groupRanking"
          :key="group.id"
          class="group-rank-card"
        >
          <div class="group-rank-header">
            <span class="group-medal">{{ getMedal(group.rank) }}</span>
            <span class="group-icon">{{ group.icon }}</span>
            <span class="group-name">{{ group.name }}</span>
            <span class="group-total">{{ group.totalScore }}分</span>
          </div>
          <div class="group-members">
            <div
              v-for="s in group.students"
              :key="s.id"
              class="member-item"
            >
              <span class="member-name">{{ s.name }}</span>
              <span class="member-score">{{ s.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 单项榜 -->
    <template v-else>
      <div class="category-grid">
        <div
          v-for="cat in categoryRankings"
          :key="cat.key"
          class="category-card"
        >
          <div class="category-header">
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.name }}</span>
          </div>
          <div class="category-list">
            <div
              v-for="s in cat.topStudents"
              :key="s.id"
              class="cat-item"
            >
              <span class="cat-rank">{{ getMedal(s.rank) }}</span>
              <span class="cat-student-name">{{ s.name }}</span>
              <span class="cat-score">{{ s.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.ranking-view {
  padding-bottom: 30px;
}

// Tabs
.rank-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  background: white;
  border-radius: $radius-full;
  padding: 3px;
  box-shadow: $shadow-sm;
}

.rank-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-500;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: $primary;
    color: white;
  }
}

// 个人榜
.personal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.rank-card {
  background: white;
  border-radius: $radius-md;
  padding: 20px 15px;
  text-align: center;
  box-shadow: $shadow-sm;
  position: relative;

  &.top3 {
    border: 2px solid #FFD700;
    background: linear-gradient(135deg, #FFFDE7, #FFF9C4);
  }
}

.rank-badge {
  font-size: 20px;
  margin-bottom: 8px;
}

.rank-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  margin: 0 auto 8px;
}

.rank-name {
  font-size: 14px;
  font-weight: 600;
  color: $gray-800;
  margin-bottom: 4px;
}

.rank-score {
  font-size: 16px;
  font-weight: bold;
  color: $primary;
}

// 小组榜
.group-rank-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-rank-card {
  background: white;
  border-radius: $radius-md;
  padding: 16px;
  box-shadow: $shadow-sm;
}

.group-rank-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid $gray-100;
}

.group-medal {
  font-size: 20px;
}

.group-icon {
  font-size: 22px;
}

.group-name {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: $gray-800;
}

.group-total {
  font-size: 16px;
  font-weight: bold;
  color: $primary;
}

.group-members {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.member-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  background: $gray-50;
  border-radius: $radius-sm;
  font-size: 13px;
}

.member-name {
  color: $gray-700;
}

.member-score {
  color: $gray-500;
  font-weight: 600;
}

// 单项榜
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category-card {
  background: white;
  border-radius: $radius-md;
  padding: 16px;
  box-shadow: $shadow-sm;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid $gray-100;
}

.cat-icon {
  font-size: 20px;
}

.cat-name {
  font-size: 15px;
  font-weight: 600;
  color: $gray-800;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.cat-rank {
  font-size: 14px;
  min-width: 24px;
  text-align: center;
}

.cat-student-name {
  flex: 1;
  font-size: 13px;
  color: $gray-700;
}

.cat-score {
  font-size: 13px;
  font-weight: 600;
  color: $gray-500;
}
</style>
