<script setup lang="ts">
import type { Student } from '@shared/types'
import BaseAvatar from '@/components/common/BaseAvatar.vue'

interface Props {
  student: Student
  selected?: boolean
  showScore?: boolean
  showChange?: boolean
  scoreChange?: number
}

withDefaults(defineProps<Props>(), {
  selected: false,
  showScore: true,
  showChange: true,
  scoreChange: 0
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="student-card touch-active"
    :class="{ selected }"
    @click="$emit('click')"
  >
    <div class="student-left">
      <BaseAvatar :name="student.name" size="sm" />
      <span class="student-name">{{ student.name }}</span>
    </div>
    <div v-if="showScore" class="student-score">
      <span class="score-value">{{ student.score }}</span>
      <span
        v-if="showChange && scoreChange !== 0"
        class="score-change"
        :class="{ negative: scoreChange < 0 }"
      >
        {{ scoreChange > 0 ? '+' : '' }}{{ scoreChange }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.student-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: $gray-50;
  border-radius: $radius-md;
  cursor: pointer;
  border: 2px solid transparent;
  min-height: 44px;

  &.selected {
    background: #E3F2FD;
    border-color: $secondary;
  }
}

.student-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-name {
  font-size: 15px;
  color: $gray-800;
  font-weight: 500;
}

.student-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-value {
  font-size: 14px;
  color: $gray-600;
}

.score-change {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #E8F5E9;
  color: $success;

  &.negative {
    background: #FFEBEE;
    color: $danger;
  }
}
</style>
