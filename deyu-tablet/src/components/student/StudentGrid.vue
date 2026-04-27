<script setup lang="ts">
import type { Student } from '@shared/types'
import { useResponsive } from '@/composables/useResponsive'
import StudentCard from './StudentCard.vue'

interface Props {
  students: Student[]
  selectedIds?: string[]
  showScore?: boolean
}

withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
  showScore: true
})

defineEmits<{
  select: [studentId: string]
}>()

const { gridCols } = useResponsive()
</script>

<template>
  <div
    class="students-grid"
    :style="{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }"
  >
    <StudentCard
      v-for="student in students"
      :key="student.id"
      :student="student"
      :selected="selectedIds.includes(student.id)"
      :show-score="showScore"
      :score-change="20"
      @click="$emit('select', student.id)"
    />
  </div>
</template>

<style lang="scss" scoped>
.students-grid {
  display: grid;
  gap: 10px;
}
</style>
