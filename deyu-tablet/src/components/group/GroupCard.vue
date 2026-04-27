<script setup lang="ts">
import type { Group } from '@shared/types'
import { ref, computed } from 'vue'
import StudentGrid from '@/components/student/StudentGrid.vue'

interface Props {
  group: Group
  selectedStudentIds?: string[]
  expanded?: boolean
  colorIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  selectedStudentIds: () => [],
  expanded: true,
  colorIndex: 0
})

defineEmits<{
  selectStudent: [studentId: string]
  toggleExpand: []
}>()

const isExpanded = ref(props.expanded)

const bgColors = ['#FFE4B5', '#E6E6FA', '#B0E0E6', '#98D8C8', '#F7DC6F', '#DDA0DD']

const iconBgColor = computed(() => bgColors[props.colorIndex % bgColors.length])

// 格式化分数显示
function formatScore(score: number): string {
  if (score >= 1000) {
    return (score / 1000).toFixed(2) + 'k'
  }
  return score.toString()
}
</script>

<template>
  <div class="group-card">
    <div class="group-header" @click="isExpanded = !isExpanded">
      <div class="group-info">
        <div class="group-icon" :style="{ background: iconBgColor }">
          {{ group.icon }}
        </div>
        <div>
          <div class="group-name">{{ group.name }}</div>
          <div class="group-stats">
            <span class="group-stat">
              <span class="stat-icon">⭐</span>
              {{ formatScore(group.totalScore) }}
            </span>
            <span class="group-stat">
              <span class="stat-icon">👥</span>
              {{ group.students.length }}
            </span>
          </div>
        </div>
      </div>
      <span class="expand-btn" :class="{ expanded: isExpanded }">›</span>
    </div>

    <Transition name="expand">
      <div v-if="isExpanded" class="group-content">
        <StudentGrid
          :students="group.students"
          :selected-ids="selectedStudentIds"
          @select="$emit('selectStudent', $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.group-card {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: $shadow-sm;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-icon {
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.group-name {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 4px;
}

.group-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: $gray-600;
}

.group-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 12px;
}

.expand-btn {
  color: $gray-400;
  font-size: 20px;
  transition: transform 0.3s;

  &.expanded {
    transform: rotate(90deg);
  }
}

.group-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid $gray-100;
}

// 展开动画
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
