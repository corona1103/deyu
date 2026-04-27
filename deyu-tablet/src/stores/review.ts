import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BehaviorRecord } from '@shared/types'
import type { DimensionIndicator } from '@shared/constants'
import { useStudentsStore } from './students'
import { useWebSocket } from '@shared/composables'

// 选中的指标类型
export interface SelectedIndicator extends DimensionIndicator {
  dimension: string
  dimensionName: string
}

export const useReviewStore = defineStore('review', () => {
  const records = ref<BehaviorRecord[]>([])
  const selectedIndicators = ref<SelectedIndicator[]>([])
  const isModalOpen = ref(false)

  const { sendReviewSync, isConnected, emit } = useWebSocket()

  // 计算已选指标的总分
  const totalSelectedPoints = computed(() =>
    selectedIndicators.value.reduce((sum, ind) => sum + ind.points, 0)
  )

  // 根据ID检查指标是否已选中
  function isIndicatorSelected(indicatorId: string): boolean {
    return selectedIndicators.value.some(ind => ind.id === indicatorId)
  }

  // 切换指标选中状态（多选）
  function toggleIndicator(indicator: DimensionIndicator, dimension: string, dimensionName: string) {
    const index = selectedIndicators.value.findIndex(ind => ind.id === indicator.id)
    if (index === -1) {
      selectedIndicators.value.push({
        ...indicator,
        dimension,
        dimensionName
      })
    } else {
      selectedIndicators.value.splice(index, 1)
    }
  }

  // 清除所有选中的指标
  function clearSelectedIndicators() {
    selectedIndicators.value = []
  }

  function openReviewModal() {
    isModalOpen.value = true
  }

  function closeReviewModal() {
    isModalOpen.value = false
    clearSelectedIndicators()
  }

  function confirmReview() {
    const studentsStore = useStudentsStore()

    if (selectedIndicators.value.length === 0 || studentsStore.selectedStudentIds.length === 0) {
      return
    }

    const studentIds = [...studentsStore.selectedStudentIds]
    const timestamp = Date.now()
    const totalPoints = totalSelectedPoints.value

    // 更新本地分数
    studentIds.forEach(studentId => {
      studentsStore.updateStudentScore(studentId, totalPoints)

      // 为每个选中的指标创建行为记录
      selectedIndicators.value.forEach(indicator => {
        const record: BehaviorRecord = {
          id: `r_${timestamp}_${studentId}_${indicator.id}`,
          studentId,
          type: indicator.type,
          category: indicator.dimensionName,
          points: indicator.points,
          description: indicator.label,
          createdAt: new Date(),
          teacherId: 't1'
        }
        records.value.push(record)
      })
    })

    // 发送 WebSocket 同步到大屏（使用新的多指标格式）
    if (isConnected.value) {
      emit('multi_review_sync', {
        studentIds,
        indicators: selectedIndicators.value.map(ind => ({
          id: ind.id,
          points: ind.points,
          dimension: ind.dimension,
          label: ind.label
        })),
        totalPoints,
        teacherId: 't1',
        timestamp
      })
    }

    // 清理状态
    studentsStore.clearSelection()
    closeReviewModal()
  }

  function getTodayRecords(): BehaviorRecord[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return records.value.filter(r => new Date(r.createdAt) >= today)
  }

  // 获取学生在某个维度的记录
  function getStudentDimensionRecords(studentId: string, dimension: string): BehaviorRecord[] {
    return records.value.filter(r =>
      r.studentId === studentId && r.category === dimension
    )
  }

  return {
    records,
    selectedIndicators,
    isModalOpen,
    totalSelectedPoints,
    isIndicatorSelected,
    toggleIndicator,
    clearSelectedIndicators,
    openReviewModal,
    closeReviewModal,
    confirmReview,
    getTodayRecords,
    getStudentDimensionRecords
  }
})
