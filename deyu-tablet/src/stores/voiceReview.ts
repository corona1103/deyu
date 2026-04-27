import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { VoiceReviewResult, BehaviorRecord } from '@shared/types'
import { parseVoiceReview } from '@/services/aiService'
import { useStudentsStore } from './students'
import { useReviewStore } from './review'
import { useWebSocket } from '@shared/composables'

export const useVoiceReviewStore = defineStore('voiceReview', () => {
  const studentsStore = useStudentsStore()
  const reviewStore = useReviewStore()
  const { emit, isConnected } = useWebSocket()

  // 解析结果
  const parsedResults = ref<VoiceReviewResult[]>([])

  // 是否正在解析
  const isParsing = ref(false)

  // 输入文本
  const inputText = ref('')

  // 是否有结果
  const hasResults = computed(() => parsedResults.value.length > 0)

  // 总分预览
  const totalPoints = computed(() =>
    parsedResults.value.reduce((sum, r) => sum + r.indicator.points, 0)
  )

  /**
   * 解析输入文本
   */
  async function parseInput() {
    if (!inputText.value.trim()) {
      return
    }

    isParsing.value = true

    try {
      const results = parseVoiceReview(inputText.value, studentsStore.students)

      // 为没有匹配到学生的结果尝试智能匹配
      for (const result of results) {
        if (!result.studentId && result.studentName !== '未识别') {
          // 尝试模糊匹配
          const matched = studentsStore.students.find(s =>
            s.name.includes(result.studentName) ||
            result.studentName.includes(s.name.substring(0, 2))
          )
          if (matched) {
            result.studentId = matched.id
            result.studentName = matched.name
          }
        }
      }

      parsedResults.value = results
    } finally {
      isParsing.value = false
    }
  }

  /**
   * 删除单条解析结果
   */
  function removeResult(resultId: string) {
    const index = parsedResults.value.findIndex(r => r.id === resultId)
    if (index !== -1) {
      parsedResults.value.splice(index, 1)
    }
  }

  /**
   * 更新解析结果
   */
  function updateResult(resultId: string, updates: Partial<VoiceReviewResult>) {
    const result = parsedResults.value.find(r => r.id === resultId)
    if (result) {
      Object.assign(result, updates)
    }
  }

  /**
   * 更新结果的学生
   */
  function updateResultStudent(resultId: string, studentId: string) {
    const result = parsedResults.value.find(r => r.id === resultId)
    const student = studentsStore.getStudentById(studentId)
    if (result && student) {
      result.studentId = studentId
      result.studentName = student.name
    }
  }

  /**
   * 确认并提交所有解析结果
   */
  function confirmAll() {
    const timestamp = Date.now()
    const validResults = parsedResults.value.filter(r => r.studentId)

    if (validResults.length === 0) {
      return false
    }

    // 更新本地分数并创建记录
    validResults.forEach(result => {
      if (result.studentId) {
        studentsStore.updateStudentScore(result.studentId, result.indicator.points)

        // 创建行为记录
        const record: BehaviorRecord = {
          id: `vr_${timestamp}_${result.studentId}_${result.indicator.id}`,
          studentId: result.studentId,
          type: result.isNegative ? 'negative' : 'positive',
          category: result.indicator.dimension,
          points: result.indicator.points,
          description: result.indicator.label,
          createdAt: new Date(),
          teacherId: 't1'
        }
        reviewStore.records.push(record)
      }
    })

    // 发送 WebSocket 同步到大屏
    if (isConnected.value) {
      const syncData = validResults.map(result => ({
        studentId: result.studentId,
        studentName: result.studentName,
        indicator: result.indicator,
        isNegative: result.isNegative,
        suggestion: result.suggestion
      }))

      emit('voice_review_sync', {
        results: syncData,
        teacherId: 't1',
        timestamp
      })
    }

    // 清理状态
    clearAll()

    return true
  }

  /**
   * 清空所有结果
   */
  function clearAll() {
    parsedResults.value = []
    inputText.value = ''
  }

  return {
    parsedResults,
    isParsing,
    inputText,
    hasResults,
    totalPoints,
    parseInput,
    removeResult,
    updateResult,
    updateResultStudent,
    confirmAll,
    clearAll
  }
})
