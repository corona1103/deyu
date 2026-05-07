<script setup lang="ts">
import { ref } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useReviewStore } from '@/stores/review'
import ReviewModal from './ReviewModal.vue'

const studentsStore = useStudentsStore()
const reviewStore = useReviewStore()

type ViewMode = 'group' | 'student' | 'seat'
type TimePeriod = 'today' | 'week' | 'month' | 'semester'

const currentView = ref<ViewMode>('group')
const timePeriod = ref<TimePeriod>('week')

const viewTabs = [
  { value: 'group' as ViewMode, icon: '🏠', label: '小组' },
  { value: 'student' as ViewMode, icon: '👥', label: '全部学生' },
  { value: 'seat' as ViewMode, icon: '🪑', label: '座位表' },
]

const timeTabs = [
  { value: 'today' as TimePeriod, label: '今日' },
  { value: 'week' as TimePeriod, label: '本周' },
  { value: 'month' as TimePeriod, label: '本月' },
  { value: 'semester' as TimePeriod, label: '本学期' },
]

// 分数浮动动效
const scoreAnimations = ref<{ id: string; x: number; y: number; points: number }[]>([])

function formatScore(score: number): string {
  if (score >= 1000) {
    return (score / 1000).toFixed(2) + 'k'
  }
  return score.toString()
}

function handleSelectStudent(studentId: string) {
  studentsStore.toggleStudentSelection(studentId)
}

function handleSelectGroup(groupId: string) {
  const group = studentsStore.groups.find(g => g.id === groupId)
  if (!group) return
  // 如果该组所有学生都已选中，则取消选择
  const allSelected = group.students.every(s => studentsStore.selectedStudentIds.includes(s.id))
  if (allSelected) {
    group.students.forEach(s => {
      const idx = studentsStore.selectedStudentIds.indexOf(s.id)
      if (idx !== -1) studentsStore.selectedStudentIds.splice(idx, 1)
    })
  } else {
    group.students.forEach(s => {
      if (!studentsStore.selectedStudentIds.includes(s.id)) {
        studentsStore.selectedStudentIds.push(s.id)
      }
    })
  }
}

function handleReviewMultiple() {
  if (studentsStore.selectedStudentIds.length === 0) {
    alert('请先点击选择学生')
    return
  }
  reviewStore.openReviewModal()
}

function handleConfirmReview() {
  const points = reviewStore.totalSelectedPoints
  if (points !== 0) {
    const id = `anim_${Date.now()}`
    scoreAnimations.value.push({
      id,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      points
    })
    setTimeout(() => {
      scoreAnimations.value = scoreAnimations.value.filter(a => a.id !== id)
    }, 1200)
  }
}
</script>

<template>
  <div class="review-content">
    <!-- 工具栏：左侧视图切换 + 右侧时间筛选 -->
    <div class="content-toolbar">
      <div class="view-tabs">
        <div
          v-for="tab in viewTabs"
          :key="tab.value"
          class="view-tab touch-active"
          :class="{ active: currentView === tab.value }"
          @click="currentView = tab.value"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </div>
      </div>
      <div class="time-tabs">
        <div
          v-for="t in timeTabs"
          :key="t.value"
          class="time-tab touch-active"
          :class="{ active: timePeriod === t.value }"
          @click="timePeriod = t.value"
        >
          {{ t.label }}
        </div>
      </div>
    </div>

    <!-- 小组视图（复刻大屏） -->
    <template v-if="currentView === 'group'">
      <div class="groups-grid">
        <div
          v-for="group in studentsStore.groups"
          :key="group.id"
          class="group-card"
        >
          <!-- 组头：图标+组名+奖杯分 -->
          <div class="group-header" @click="handleSelectGroup(group.id)">
            <div class="group-left">
              <span class="group-icon">{{ group.icon }}</span>
              <span class="group-name">{{ group.name }}</span>
            </div>
            <div class="group-score-badge">
              <span class="trophy">🏆</span>
              <span class="score-text">{{ formatScore(group.totalScore) }}</span>
            </div>
          </div>

          <!-- 学生网格：名字+星分 -->
          <div class="students-flat-grid">
            <div
              v-for="student in group.students"
              :key="student.id"
              class="student-flat touch-active"
              :class="{ selected: studentsStore.selectedStudentIds.includes(student.id) }"
              @click="handleSelectStudent(student.id)"
            >
              <div class="flat-name">{{ student.name }}</div>
              <div class="flat-score">
                <span class="star-icon">⭐</span>
                <span>{{ student.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 全部学生视图 -->
    <template v-else-if="currentView === 'student'">
      <div class="all-students-grid">
        <div
          v-for="student in studentsStore.students"
          :key="student.id"
          class="student-flat-card touch-active"
          :class="{ selected: studentsStore.selectedStudentIds.includes(student.id) }"
          @click="handleSelectStudent(student.id)"
        >
          <div class="flat-name">{{ student.name }}</div>
          <div class="flat-score">
            <span class="star-icon">⭐</span>
            <span>{{ student.score }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 座位表视图 -->
    <template v-else>
      <div class="seat-grid">
        <div class="podium">讲台</div>
        <div class="seats-container">
          <div
            v-for="(row, rowIdx) in studentsStore.getSeatLayout()"
            :key="rowIdx"
            class="seat-row"
          >
            <div
              v-for="(student, colIdx) in row"
              :key="`${rowIdx}-${colIdx}`"
              class="seat-cell touch-active"
              :class="{
                occupied: !!student,
                selected: student && studentsStore.selectedStudentIds.includes(student.id)
              }"
              @click="student && handleSelectStudent(student.id)"
            >
              <template v-if="student">
                <div class="seat-name">{{ student.name }}</div>
                <div class="seat-score-inline">
                  <span class="star-icon-sm">⭐</span>{{ student.score }}
                </div>
              </template>
              <template v-else>
                <div class="seat-empty">空</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 底部：点评多人按钮 -->
    <div class="bottom-action">
      <button class="review-btn touch-active" @click="handleReviewMultiple">
        <span class="btn-icon">👥</span>
        点评多人
        <span v-if="studentsStore.selectedStudentIds.length > 0" class="btn-count">
          ({{ studentsStore.selectedStudentIds.length }})
        </span>
      </button>
    </div>

    <!-- 点评弹窗 -->
    <ReviewModal
      v-model="reviewStore.isModalOpen"
      :selected-students="studentsStore.selectedStudents"
      @confirm="handleConfirmReview"
    />

    <!-- 分数浮动动效 -->
    <Teleport to="body">
      <div
        v-for="anim in scoreAnimations"
        :key="anim.id"
        class="score-float"
        :class="{ negative: anim.points < 0 }"
        :style="{ left: anim.x + 'px', top: anim.y + 'px' }"
      >
        {{ anim.points > 0 ? '+' : '' }}{{ anim.points }}
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.review-content {
  padding-bottom: 100px;
}

// === 工具栏 ===
.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.view-tabs {
  display: flex;
  gap: 0;
  background: white;
  border-radius: $radius-full;
  padding: 3px;
  box-shadow: $shadow-sm;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &.active {
    background: $primary;
    color: white;
  }
}

.tab-icon {
  font-size: 16px;
}

.time-tabs {
  display: flex;
  gap: 0;
  background: white;
  border-radius: $radius-full;
  padding: 3px;
  box-shadow: $shadow-sm;
}

.time-tab {
  padding: 10px 18px;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &.active {
    background: $primary;
    color: white;
  }
}

// === 小组网格（复刻大屏 3 列） ===
.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.group-card {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  box-shadow: $shadow-sm;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
}

.group-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  font-size: 28px;
}

.group-name {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
}

.group-score-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: $gray-50;
  border-radius: $radius-full;
  border: 1px solid $gray-200;
}

.trophy {
  font-size: 16px;
}

.score-text {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

// 学生扁平网格
.students-flat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px 16px;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.student-flat {
  text-align: center;
  padding: 10px 4px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: $gray-50;
  }

  &.selected {
    background: #FFF3E0;
    outline: 2px solid $primary;
    border-radius: $radius-md;
  }
}

.flat-name {
  font-size: 15px;
  color: $gray-800;
  margin-bottom: 4px;
}

.flat-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 14px;
  font-weight: 600;
  color: $primary;
}

.star-icon {
  font-size: 12px;
}

// === 全部学生视图 ===
.all-students-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.student-flat-card {
  background: white;
  border-radius: $radius-md;
  padding: 16px 10px;
  text-align: center;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: $gray-50;
  }

  &.selected {
    background: #FFF3E0;
    outline: 2px solid $primary;
  }

  .flat-name {
    font-size: 15px;
    margin-bottom: 6px;
  }
}

// === 座位表视图 ===
.seat-grid {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  box-shadow: $shadow-sm;
}

.podium {
  text-align: center;
  padding: 10px;
  background: $gray-100;
  border-radius: $radius-md;
  color: $gray-500;
  font-size: 14px;
  margin-bottom: 20px;
}

.seats-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.seat-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.seat-cell {
  width: 80px;
  height: 70px;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $gray-50;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &.occupied:hover {
    background: $gray-100;
  }

  &.selected {
    background: #FFF3E0;
    border-color: $primary;
  }

  @media (min-width: $breakpoint-md) {
    width: 100px;
    height: 80px;
  }
}

.seat-name {
  font-size: 13px;
  font-weight: 500;
  color: $gray-800;
}

.seat-score-inline {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  color: $primary;
}

.star-icon-sm {
  font-size: 10px;
}

.seat-empty {
  font-size: 12px;
  color: $gray-300;
}

// === 底部按钮 ===
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 20px;
  padding-bottom: calc(20px + $safe-area-bottom);
  pointer-events: none;
  z-index: 50;

  @media (min-width: $breakpoint-lg) {
    left: 250px; // sidebar width offset
  }
}

.review-btn {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 40px;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba($primary, 0.4);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.96);
  }
}

.btn-icon {
  font-size: 20px;
}

.btn-count {
  opacity: 0.85;
}

// === 分数浮动动效 ===
.score-float {
  position: fixed;
  font-size: 36px;
  font-weight: bold;
  color: $success;
  pointer-events: none;
  z-index: 9999;
  animation: float-up 1.2s ease-out forwards;

  &.negative {
    color: $danger;
  }
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-80px) scale(1.5);
  }
}
</style>
