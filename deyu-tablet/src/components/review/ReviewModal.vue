<script setup lang="ts">
import { computed } from 'vue'
import type { Student } from '@shared/types'
import BaseModal from '@/components/common/BaseModal.vue'
import IndicatorGrid from './IndicatorGrid.vue'
import { useReviewStore } from '@/stores/review'

interface Props {
  modelValue: boolean
  selectedStudents: Student[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const reviewStore = useReviewStore()

const hasSelection = computed(() => reviewStore.selectedIndicators.length > 0)

function handleConfirm() {
  if (!hasSelection.value) {
    alert('请至少选择一个指标')
    return
  }
  reviewStore.confirmReview()
  emit('confirm')
  emit('update:modelValue', false)
}

function handleClose() {
  reviewStore.clearSelectedIndicators()
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="行为点评"
    position="bottom"
    @update:model-value="handleClose"
  >
    <!-- 选中的学生 -->
    <div class="selected-students">
      <div class="students-label">已选学生：</div>
      <div class="students-list">
        <div
          v-for="student in selectedStudents"
          :key="student.id"
          class="student-tag"
        >
          <span>{{ student.name }}</span>
        </div>
      </div>
    </div>

    <!-- 分数预览 -->
    <div class="score-preview" :class="{ negative: reviewStore.totalSelectedPoints < 0 }">
      <span class="preview-label">预计{{ reviewStore.totalSelectedPoints >= 0 ? '加' : '扣' }}分：</span>
      <span class="preview-value">
        {{ reviewStore.totalSelectedPoints > 0 ? '+' : '' }}{{ reviewStore.totalSelectedPoints }}
      </span>
    </div>

    <!-- 四维度指标网格 -->
    <IndicatorGrid />

    <!-- 已选指标摘要 -->
    <div v-if="reviewStore.selectedIndicators.length > 0" class="selected-summary">
      <div class="summary-label">已选指标：</div>
      <div class="summary-tags">
        <span
          v-for="indicator in reviewStore.selectedIndicators"
          :key="indicator.id"
          class="summary-tag"
          :class="{ negative: indicator.type === 'negative' }"
        >
          {{ indicator.dimensionName }} - {{ indicator.label }}
          ({{ indicator.points > 0 ? '+' : '' }}{{ indicator.points }})
        </span>
      </div>
    </div>

    <!-- 确认按钮 -->
    <button
      class="confirm-btn"
      :class="{ disabled: !hasSelection }"
      :disabled="!hasSelection"
      @click="handleConfirm"
    >
      确认点评 ({{ reviewStore.totalSelectedPoints > 0 ? '+' : '' }}{{ reviewStore.totalSelectedPoints }}分)
    </button>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.selected-students {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid $gray-100;
}

.students-label {
  font-size: 14px;
  color: $gray-600;
  flex-shrink: 0;
  padding-top: 4px;
}

.students-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.student-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #E8F4FD;
  border-radius: $radius-full;
  font-size: 14px;
  color: $secondary;
}

.score-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  border-radius: $radius-md;
  margin-bottom: 15px;

  &.negative {
    background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
  }
}

.preview-label {
  font-size: 16px;
  color: $gray-700;
}

.preview-value {
  font-size: 28px;
  font-weight: bold;
  color: $success;

  .negative & {
    color: $danger;
  }
}

.selected-summary {
  margin-top: 15px;
  padding: 12px;
  background: $gray-50;
  border-radius: $radius-md;
}

.summary-label {
  font-size: 13px;
  color: $gray-600;
  margin-bottom: 8px;
}

.summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.summary-tag {
  padding: 4px 10px;
  background: #E8F5E9;
  border-radius: $radius-full;
  font-size: 12px;
  color: $success;

  &.negative {
    background: #FFEBEE;
    color: $danger;
  }
}

.confirm-btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, $success, lighten($success, 10%));
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.2s, opacity 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
