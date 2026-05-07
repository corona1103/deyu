<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentsStore } from '@/stores/students'
import { useUserStore } from '@/stores/user'
import { useReportStore } from '@/stores/report'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseAvatar } from '@/components/common'
import StudentReport from '@/components/report/StudentReport.vue'
import ClassReport from '@/components/report/ClassReport.vue'
import type { StatPeriod } from '@shared/types'

const route = useRoute()
const studentsStore = useStudentsStore()
const userStore = useUserStore()
const reportStore = useReportStore()

// 本模块独立的班级筛选（仅班主任班级）
const selectedClassId = ref(
  (route.query.classId as string) || userStore.homeroomClasses[0]?.id || 'c1'
)

// 时段筛选
const periods: { value: StatPeriod; label: string }[] = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'semester', label: '本学期' }
]

// 当前班级的学生
const classStudents = computed(() =>
  studentsStore.getStudentsByClass(selectedClassId.value)
)

// Tab 类型
type ReportTab = 'student' | 'class'
const currentTab = ref<ReportTab>('student')

const tabs = [
  { value: 'student', label: '个人报告', icon: '👤' },
  { value: 'class', label: '班级报告', icon: '📊' }
]

// 选中的学生（用于个人报告）
const initialStudentId = (route.query.studentId as string) || classStudents.value[0]?.id || ''
const selectedStudentId = ref(initialStudentId)

const selectedStudent = computed(() =>
  studentsStore.getStudentById(selectedStudentId.value)
)

// 切换班级时重置选中学生
watch(selectedClassId, () => {
  selectedStudentId.value = classStudents.value[0]?.id || ''
})

function selectStudent(id: string) {
  selectedStudentId.value = id
}

function onClassChange(e: Event) {
  selectedClassId.value = (e.target as HTMLSelectElement).value
}

function onPeriodChange(period: StatPeriod) {
  reportStore.selectedPeriod = period
}
</script>

<template>
  <div class="report-page">
    <PageHeader title="德育报告" :show-back="false">
      <template #right>
        <div class="class-selector-wrap">
          <select
            class="class-selector"
            :value="selectedClassId"
            @change="onClassChange"
          >
            <option
              v-for="cls in userStore.homeroomClasses"
              :key="cls.id"
              :value="cls.id"
            >
              {{ cls.name }}
            </option>
          </select>
        </div>
      </template>
    </PageHeader>

    <main class="main-content">
      <!-- 时段筛选器 -->
      <div class="period-filter">
        <div
          v-for="p in periods"
          :key="p.value"
          class="period-chip touch-active"
          :class="{ active: reportStore.selectedPeriod === p.value }"
          @click="onPeriodChange(p.value)"
        >
          {{ p.label }}
        </div>
      </div>

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
            v-for="student in classStudents"
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
          :class-id="selectedClassId"
          :period="reportStore.selectedPeriod"
        />
      </template>

      <!-- 班级报告 -->
      <template v-else>
        <ClassReport
          :class-id="selectedClassId"
          :period="reportStore.selectedPeriod"
        />
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

.period-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.period-chip {
  padding: 8px 18px;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-600;
  background: white;
  cursor: pointer;
  border: 1px solid $gray-200;
  transition: all 0.2s;

  &.active {
    background: $primary;
    color: white;
    border-color: $primary;
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

.class-selector-wrap {
  display: flex;
  align-items: center;
}

.class-selector {
  padding: 6px 28px 6px 12px;
  border: 1px solid $gray-200;
  border-radius: $radius-full;
  font-size: 13px;
  color: $gray-700;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 10px center;
  appearance: none;
  cursor: pointer;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}
</style>
