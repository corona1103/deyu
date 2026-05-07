<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHomeworkStore } from '@/stores/homework'
import { useStudentsStore } from '@/stores/students'
import { SUBJECT_COLORS } from '@shared/constants'

const homeworkStore = useHomeworkStore()
const studentsStore = useStudentsStore()

const selectedHwId = ref<string | null>(
  homeworkStore.homeworks.find(h => h.status === 'active')?.id || null
)

// 活跃的作业列表
const activeHomeworks = computed(() =>
  homeworkStore.homeworks
    .filter(h => h.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
)

// 当前选中的作业
const currentHw = computed(() =>
  homeworkStore.homeworks.find(h => h.id === selectedHwId.value) || null
)

// 按组分学生提交状态
const groupedSubmissions = computed(() => {
  if (!currentHw.value) return []
  return studentsStore.groups.map(group => ({
    ...group,
    students: group.students.map(s => {
      const sub = currentHw.value!.submissions.find(sub => sub.studentId === s.id)
      return {
        ...s,
        submitted: sub?.status !== 'missing',
        submittedAt: sub?.submittedAt
      }
    })
  }))
})

// 提交计数
const submitCount = computed(() => {
  if (!currentHw.value) return { done: 0, total: 0 }
  const done = currentHw.value.submissions.filter(s => s.status !== 'missing').length
  return { done, total: currentHw.value.totalStudents }
})

// 名字消失特效追踪
const disappearingIds = ref<Set<string>>(new Set())
// 加分浮动动效追踪
const floatingScores = ref<{ id: string; studentId: string; points: number }[]>([])

function handleStudentClick(studentId: string) {
  if (!currentHw.value) return

  const sub = currentHw.value.submissions.find(s => s.studentId === studentId)
  if (!sub || sub.status !== 'missing') return

  // 标记已提交
  sub.status = 'submitted'
  sub.submittedAt = new Date().toISOString()
  sub.isOnTime = true

  const isChineseHw = currentHw.value.subject === '语文'

  if (isChineseHw) {
    // 语文作业：名字消失特效
    disappearingIds.value.add(studentId)
    setTimeout(() => {
      disappearingIds.value.delete(studentId)
    }, 800)
  } else {
    // 其他作业：+2分浮动动画
    const animId = `float_${Date.now()}_${studentId}`
    floatingScores.value.push({ id: animId, studentId, points: 2 })
    studentsStore.updateStudentScore(studentId, 2)
    setTimeout(() => {
      floatingScores.value = floatingScores.value.filter(f => f.id !== animId)
    }, 1200)
  }
}

function selectHomework(hwId: string) {
  selectedHwId.value = hwId
}

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || '#999'
}
</script>

<template>
  <div class="homework-track">
    <div class="track-layout">
      <!-- 左侧作业列表 -->
      <div class="hw-sidebar">
        <div class="sidebar-title">待交作业</div>
        <div class="hw-list-scroll">
          <div
            v-for="hw in activeHomeworks"
            :key="hw.id"
            class="hw-item touch-active"
            :class="{ active: selectedHwId === hw.id }"
            @click="selectHomework(hw.id)"
          >
            <span
              class="hw-subject-dot"
              :style="{ background: getSubjectColor(hw.subject) }"
            />
            <div class="hw-item-info">
              <div class="hw-item-title">{{ hw.title }}</div>
              <div class="hw-item-sub">{{ hw.subject }}</div>
            </div>
          </div>
          <div v-if="activeHomeworks.length === 0" class="no-hw">
            暂无待交作业
          </div>
        </div>
      </div>

      <!-- 右侧学生提交面板 -->
      <div class="submit-panel">
        <template v-if="currentHw">
          <div class="panel-header">
            <div class="panel-title">
              <span
                class="subject-badge"
                :style="{ background: getSubjectColor(currentHw.subject) }"
              >
                {{ currentHw.subject }}
              </span>
              {{ currentHw.title }}
            </div>
            <div class="submit-progress">
              {{ submitCount.done }}/{{ submitCount.total }}
            </div>
          </div>

          <!-- 按分组展示 -->
          <div
            v-for="group in groupedSubmissions"
            :key="group.id"
            class="group-section"
          >
            <div class="group-title">
              <span>{{ group.icon }} {{ group.name }}</span>
            </div>
            <div class="group-students-grid">
              <div
                v-for="student in group.students"
                :key="student.id"
                class="submit-student touch-active"
                :class="{
                  submitted: student.submitted,
                  disappearing: disappearingIds.has(student.id)
                }"
                @click="handleStudentClick(student.id)"
              >
                <div class="submit-avatar" :class="{ done: student.submitted }">
                  {{ student.submitted ? '✓' : student.name.charAt(0) }}
                </div>
                <div class="submit-name">{{ student.name }}</div>

                <!-- 浮动+2分动效 -->
                <div
                  v-for="f in floatingScores.filter(a => a.studentId === student.id)"
                  :key="f.id"
                  class="float-score"
                >
                  +{{ f.points }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="no-selection">
          <div class="no-sel-icon">📋</div>
          <div class="no-sel-text">请从左侧选择一项作业</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.homework-track {
  padding-bottom: 30px;
}

.track-layout {
  display: flex;
  gap: 16px;
  min-height: 500px;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

// 左侧作业列表
.hw-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    width: 100%;
  }
}

.sidebar-title {
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 600;
  color: $gray-800;
  border-bottom: 1px solid $gray-100;
}

.hw-list-scroll {
  max-height: 450px;
  overflow-y: auto;

  @media (max-width: $breakpoint-md) {
    max-height: 200px;
    display: flex;
    gap: 8px;
    padding: 10px;
    overflow-x: auto;
  }
}

.hw-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: $gray-50;
  }

  &.active {
    background: #E3F2FD;
    border-left-color: $secondary;
  }

  @media (max-width: $breakpoint-md) {
    flex-shrink: 0;
    border-left: none;
    border-radius: $radius-md;
    border: 1px solid $gray-200;
    padding: 10px 14px;

    &.active {
      border-color: $secondary;
    }
  }
}

.hw-subject-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hw-item-info {
  min-width: 0;
}

.hw-item-title {
  font-size: 13px;
  font-weight: 500;
  color: $gray-800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hw-item-sub {
  font-size: 11px;
  color: $gray-400;
}

.no-hw {
  padding: 30px;
  text-align: center;
  color: $gray-400;
  font-size: 14px;
}

// 右侧面板
.submit-panel {
  flex: 1;
  min-width: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 14px 16px;
  background: white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: $gray-800;
}

.subject-badge {
  padding: 2px 10px;
  border-radius: $radius-full;
  font-size: 12px;
  color: white;
}

.submit-progress {
  font-size: 20px;
  font-weight: bold;
  color: $success;
}

// 分组
.group-section {
  margin-bottom: 16px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: $gray-700;
  margin-bottom: 10px;
}

.group-students-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.submit-student {
  background: white;
  border-radius: $radius-md;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  box-shadow: $shadow-sm;
  transition: all 0.2s;
  position: relative;

  &.submitted {
    opacity: 0.5;
    cursor: default;
  }

  &.disappearing {
    animation: disappear 0.8s ease-out forwards;
  }

  &:not(.submitted):active {
    transform: scale(0.95);
  }
}

.submit-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  margin: 0 auto 8px;

  &.done {
    background: $success;
    font-size: 20px;
  }
}

.submit-name {
  font-size: 13px;
  color: $gray-700;
}

// 浮动分数
.float-score {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
  color: $success;
  animation: float-up 1.2s ease-out forwards;
  pointer-events: none;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50px);
  }
}

@keyframes disappear {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.6);
  }
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.no-sel-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.no-sel-text {
  font-size: 15px;
  color: $gray-500;
}
</style>
