<script setup lang="ts">
import { computed } from 'vue'
import { useHomeworkStore } from '@/stores/homework'
import { useUserStore } from '@/stores/user'
import PageHeader from '@/components/layout/PageHeader.vue'
import HomeworkList from '@/components/homework/HomeworkList.vue'
import PublishHomeworkModal from '@/components/homework/PublishHomeworkModal.vue'
import HomeworkDetail from '@/components/homework/HomeworkDetail.vue'

const store = useHomeworkStore()
const userStore = useUserStore()

const isTeachingClass = computed(() => store.getClassRole() === 'teaching')

function getClassLabel(cls: { id: string; name: string }) {
  const role = userStore.classRoles[cls.id]
  return role === 'teaching' ? `（授课）${cls.name}` : cls.name
}

function onClassChange(e: Event) {
  store.setSelectedClass((e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="homework-page">
    <PageHeader title="作业管理" :show-back="false">
      <template #right>
        <div class="class-selector-wrap">
          <select
            class="class-selector"
            :value="store.selectedClassId"
            @change="onClassChange"
          >
            <option
              v-for="cls in userStore.teacher?.classes || []"
              :key="cls.id"
              :value="cls.id"
            >
              {{ getClassLabel(cls) }}
            </option>
          </select>
        </div>
      </template>
    </PageHeader>

    <main class="page-content">
      <!-- 授课班级提示 -->
      <div v-if="isTeachingClass" class="teaching-hint">
        仅显示{{ userStore.teacherSubject }}学科作业（授课班级）
      </div>
      <HomeworkList />
    </main>

    <PublishHomeworkModal />
    <HomeworkDetail />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.homework-page {
  min-height: 100vh;
  background: $gray-100;
}

.page-content {
  padding: 20px;

  @media (min-width: $breakpoint-md) {
    padding: 30px 40px;
    max-width: 900px;
    margin: 0 auto;
  }
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

.teaching-hint {
  padding: 8px 14px;
  margin-bottom: 14px;
  background: #FFF8E1;
  border: 1px solid #FFE082;
  border-radius: $radius-md;
  font-size: 13px;
  color: #F57F17;
}
</style>
