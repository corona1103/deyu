<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useReviewStore } from '@/stores/review'
import { useUserStore } from '@/stores/user'
import { useWebSocket } from '@shared/composables'
import PageHeader from '@/components/layout/PageHeader.vue'
import ViewTabs from '@/components/review/ViewTabs.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import BottomToolbar from '@/components/review/BottomToolbar.vue'
import ReviewModal from '@/components/review/ReviewModal.vue'

const studentsStore = useStudentsStore()
const reviewStore = useReviewStore()
const userStore = useUserStore()
const { connect, isConnected, joinClass } = useWebSocket()

const currentView = ref('group')

const viewTabs = [
  { value: 'group', label: '小组-常规' },
  { value: 'student', label: '学生' },
  { value: 'seat', label: '座位表' }
]

onMounted(() => {
  // 连接 WebSocket
  connect()

  // 加入班级房间
  if (userStore.currentClassId) {
    joinClass(userStore.currentClassId)
  }
})

function handleSelectStudent(studentId: string) {
  studentsStore.toggleStudentSelection(studentId)
}

function handlePlus() {
  if (studentsStore.selectedStudentIds.length === 0) {
    alert('请先选择学生')
    return
  }
  reviewStore.openReviewModal()
}

function handleMinus() {
  if (studentsStore.selectedStudentIds.length === 0) {
    alert('请先选择学生')
    return
  }
  reviewStore.openReviewModal()
}

function handleConfirmReview() {
  // Review confirmation is handled in the store
}

function handleTool(action: string) {
  switch (action) {
    case 'random':
      // 随机点名
      const students = studentsStore.students
      const randomStudent = students[Math.floor(Math.random() * students.length)]
      studentsStore.selectedStudentIds = [randomStudent.id]
      alert(`随机抽到：${randomStudent.name}`)
      break
    case 'multi':
      // 多人点评模式
      break
    default:
      break
  }
}
</script>

<template>
  <div class="review-page">
    <PageHeader title="行为点评">
      <template #right>
        <div class="header-btn">
          <span class="ws-indicator" :class="{ connected: isConnected }" />
          {{ userStore.currentClass?.name }}
        </div>
      </template>
      <template #tabs>
        <ViewTabs
          v-model="currentView"
          :tabs="viewTabs"
        />
      </template>
    </PageHeader>

    <main class="main-content">
      <!-- 小组视图 -->
      <template v-if="currentView === 'group'">
        <GroupCard
          v-for="(group, index) in studentsStore.groups"
          :key="group.id"
          :group="group"
          :color-index="index"
          :selected-student-ids="studentsStore.selectedStudentIds"
          @select-student="handleSelectStudent"
        />
      </template>

      <!-- 学生视图 -->
      <template v-else-if="currentView === 'student'">
        <div class="students-all-grid">
          <div
            v-for="student in studentsStore.students"
            :key="student.id"
            class="student-item touch-active"
            :class="{ selected: studentsStore.selectedStudentIds.includes(student.id) }"
            @click="handleSelectStudent(student.id)"
          >
            <div class="student-avatar">{{ student.name.charAt(0) }}</div>
            <div class="student-name">{{ student.name }}</div>
            <div class="student-score">{{ student.score }}</div>
          </div>
        </div>
      </template>

      <!-- 座位表视图 -->
      <template v-else>
        <div class="seat-placeholder">
          <div class="placeholder-icon">📋</div>
          <div class="placeholder-text">座位表视图开发中...</div>
        </div>
      </template>
    </main>

    <!-- 底部工具栏 -->
    <BottomToolbar
      @plus="handlePlus"
      @minus="handleMinus"
      @tool="handleTool"
    />

    <!-- 点评弹窗（四维度多选） -->
    <ReviewModal
      v-model="reviewStore.isModalOpen"
      :selected-students="studentsStore.selectedStudents"
      @confirm="handleConfirmReview"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.review-page {
  min-height: 100vh;
  background: $gray-100;
  padding-bottom: $bottom-toolbar-height;

  @media (min-width: $breakpoint-lg) {
    padding-bottom: 100px;
  }
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: $gray-100;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-600;
}

.ws-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $danger;

  &.connected {
    background: $success;
  }
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

// 学生视图网格
.students-all-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.student-item {
  background: white;
  border-radius: $radius-md;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: $shadow-sm;

  &.selected {
    background: #E3F2FD;
    border-color: $secondary;
  }
}

.student-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  margin: 0 auto 10px;
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: $gray-800;
  margin-bottom: 5px;
}

.student-score {
  font-size: 13px;
  color: $gray-500;
}

// 占位符
.seat-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.placeholder-text {
  font-size: 16px;
  color: $gray-500;
}
</style>
