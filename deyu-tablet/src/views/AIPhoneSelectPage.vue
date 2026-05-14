<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useStudentsStore } from '@/stores/students'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseAvatar } from '@/components/common'

const router = useRouter()
const userStore = useUserStore()
const studentsStore = useStudentsStore()

const selectedClassId = ref(userStore.homeroomClasses[0]?.id || 'c1')

const classStudents = computed(() =>
  studentsStore.getStudentsByClass(selectedClassId.value)
)

function onClassChange(e: Event) {
  selectedClassId.value = (e.target as HTMLSelectElement).value
}

function selectStudent(studentId: string) {
  router.push({ path: '/ai-phone/chat', query: { studentId } })
}
</script>

<template>
  <div class="ai-phone-select-page">
    <PageHeader title="AI电话亭" :show-back="false">
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
      <div class="section-hint">选择学生开始AI对话</div>

      <div class="student-grid">
        <div
          v-for="student in classStudents"
          :key="student.id"
          class="student-card"
          @click="selectStudent(student.id)"
        >
          <BaseAvatar :name="student.name" size="lg" />
          <span class="student-name">{{ student.name }}</span>
        </div>
      </div>

      <div v-if="classStudents.length === 0" class="empty-state">
        暂无学生数据
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.ai-phone-select-page {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 800px;
    margin: 0 auto;
  }
}

.section-hint {
  font-size: 14px;
  color: $gray-500;
  margin-bottom: 16px;
}

.student-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }
}

.student-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.96);
    box-shadow: $shadow-md;
  }
}

.student-name {
  font-size: 13px;
  color: $gray-700;
  font-weight: 500;
  text-align: center;
  word-break: keep-all;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: $gray-400;
  font-size: 15px;
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
