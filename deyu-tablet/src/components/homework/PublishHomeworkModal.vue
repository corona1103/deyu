<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BaseModal } from '@/components/common'
import { useHomeworkStore } from '@/stores/homework'
import { useUserStore } from '@/stores/user'
import { SUBJECTS } from '@shared/constants'
import type { Subject } from '@shared/types'

const store = useHomeworkStore()
const userStore = useUserStore()

const title = ref('')
const selectedSubject = ref<Subject>('语文')

// 授课班级锁定学科
const isSubjectLocked = computed(() =>
  store.getClassRole() === 'teaching' && !!userStore.teacherSubject
)

// 当弹窗打开时，如果是授课班级则自动锁定学科
watch(() => store.showPublishModal, (v) => {
  if (v && isSubjectLocked.value) {
    selectedSubject.value = userStore.teacherSubject as Subject
  }
})

// 默认截止时间：明天17:00
function getDefaultDeadline() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(17, 0, 0, 0)
  // 转为 datetime-local 格式 YYYY-MM-DDTHH:MM
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const deadline = ref(getDefaultDeadline())

function handlePublish() {
  if (!title.value.trim()) {
    alert('请输入作业标题')
    return
  }
  store.publishHomework(
    title.value.trim(),
    selectedSubject.value,
    new Date(deadline.value).toISOString()
  )
  // reset
  title.value = ''
  selectedSubject.value = '语文'
  deadline.value = getDefaultDeadline()
}
</script>

<template>
  <BaseModal
    v-model="store.showPublishModal"
    title="发布作业"
    position="bottom"
  >
    <!-- 学科选择 -->
    <div class="field-label">学科 <span v-if="isSubjectLocked" class="lock-hint">（授课班级仅限{{ userStore.teacherSubject }}）</span></div>
    <div class="subject-grid">
      <div
        v-for="sub in SUBJECTS"
        :key="sub"
        class="subject-chip touch-active"
        :class="{ active: selectedSubject === sub, disabled: isSubjectLocked && sub !== userStore.teacherSubject }"
        @click="!isSubjectLocked || sub === userStore.teacherSubject ? (selectedSubject = sub as Subject) : null"
      >
        {{ sub }}
      </div>
    </div>

    <!-- 标题 -->
    <div class="field-label">作业标题</div>
    <input
      v-model="title"
      class="title-input"
      type="text"
      placeholder="请输入作业内容，如：完成数学练习册第15页"
      maxlength="50"
    />

    <!-- 截止时间 -->
    <div class="field-label">截止时间</div>
    <input
      v-model="deadline"
      class="deadline-input"
      type="datetime-local"
    />

    <template #footer>
      <button class="publish-btn touch-active" @click="handlePublish">
        发布作业
      </button>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: $gray-700;
  margin-bottom: 10px;
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }
}

.subject-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lock-hint {
  font-size: 12px;
  font-weight: 400;
  color: $gray-400;
}

.subject-chip {
  padding: 6px 16px;
  border-radius: $radius-full;
  font-size: 13px;
  color: $gray-600;
  background: $gray-50;
  border: 1px solid $gray-200;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: rgba($primary, 0.1);
    color: $primary;
    border-color: $primary;
    font-weight: 600;
  }

  &.disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

.title-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  font-size: 15px;
  color: $gray-800;
  background: $gray-50;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: $primary;
    background: white;
  }

  &::placeholder {
    color: $gray-300;
  }
}

.deadline-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  font-size: 15px;
  color: $gray-800;
  background: $gray-50;
  outline: none;

  &:focus {
    border-color: $primary;
    background: white;
  }
}

.publish-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  border: none;
  border-radius: $radius-md;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.98);
  }
}
</style>
