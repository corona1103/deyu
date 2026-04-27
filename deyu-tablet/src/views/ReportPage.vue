<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseAvatar } from '@/components/common'
import StudentReport from '@/components/report/StudentReport.vue'
import ClassReport from '@/components/report/ClassReport.vue'

const studentsStore = useStudentsStore()

// Tab 类型
type ReportTab = 'student' | 'class'
const currentTab = ref<ReportTab>('student')

const tabs = [
  { value: 'student', label: '个人报告', icon: '👤' },
  { value: 'class', label: '班级报告', icon: '📊' }
]

// 选中的学生（用于个人报告）
const selectedStudentId = ref(studentsStore.students[0]?.id || '')

const selectedStudent = computed(() =>
  studentsStore.getStudentById(selectedStudentId.value)
)

function selectStudent(id: string) {
  selectedStudentId.value = id
}
</script>

<template>
  <div class="report-page">
    <PageHeader title="德育报告" />

    <main class="main-content">
      <!-- Tab 切换 -->
      <div class="report-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="report-tab touch-active"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value as ReportTab"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>

      <!-- 个人报告 -->
      <template v-if="currentTab === 'student'">
        <!-- 学生选择器 -->
        <div class="student-selector hide-scrollbar">
          <div
            v-for="student in studentsStore.students"
            :key="student.id"
            class="selector-item touch-active"
            :class="{ active: selectedStudentId === student.id }"
            @click="selectStudent(student.id)"
          >
            <BaseAvatar :name="student.name" size="sm" />
            <span class="selector-name">{{ student.name }}</span>
          </div>
        </div>

        <!-- 个人报告内容 -->
        <StudentReport
          v-if="selectedStudent"
          :student="selectedStudent"
        />
      </template>

      <!-- 班级报告 -->
      <template v-else>
        <ClassReport />
      </template>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.report-page {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 1000px;
    margin: 0 auto;
  }
}

.report-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.report-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: white;
  border-radius: $radius-full;
  font-size: 15px;
  color: $gray-600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &.active {
    border-color: $primary;
    color: $primary;
    background: #FFF5F5;
  }
}

.tab-icon {
  font-size: 18px;
}

.student-selector {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.selector-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: white;
  border-radius: $radius-full;
  cursor: pointer;
  border: 2px solid transparent;

  &.active {
    border-color: $primary;
    background: #FFF5F5;
  }
}

.selector-name {
  font-size: 14px;
  color: $gray-700;
  white-space: nowrap;
}
</style>
