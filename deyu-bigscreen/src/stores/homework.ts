import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Homework } from '@/types'

export const useHomeworkStore = defineStore('homework', () => {
  // 状态
  const homeworkList = ref<Homework[]>([])
  const selectedHomeworkId = ref<string>('')

  // 计算属性
  const selectedHomework = computed(() => {
    return homeworkList.value.find(h => h.id === selectedHomeworkId.value) || null
  })

  const submissionStats = computed(() => {
    if (!selectedHomework.value) return { submitted: 0, total: 0 }
    const submitted = selectedHomework.value.submissions.filter(s => s.submittedAt).length
    return {
      submitted,
      total: selectedHomework.value.submissions.length
    }
  })

  // 方法
  function setHomeworkList(list: Homework[]) {
    homeworkList.value = list
    const firstItem = list[0]
    if (firstItem && !selectedHomeworkId.value) {
      selectedHomeworkId.value = firstItem.id
    }
  }

  function selectHomework(id: string) {
    selectedHomeworkId.value = id
  }

  function addHomework(homework: Homework) {
    homeworkList.value.unshift(homework)
    selectedHomeworkId.value = homework.id
  }

  function markSubmission(homeworkId: string, studentId: string, isOnTime: boolean) {
    const homework = homeworkList.value.find(h => h.id === homeworkId)
    if (!homework) return

    const submission = homework.submissions.find(s => s.studentId === studentId)
    if (submission) {
      submission.submittedAt = new Date()
      submission.isOnTime = isOnTime
      submission.points = isOnTime ? 2 : 1
    }

    return submission?.points || 0
  }

  return {
    homeworkList,
    selectedHomeworkId,
    selectedHomework,
    submissionStats,
    setHomeworkList,
    selectHomework,
    addHomework,
    markSubmission
  }
})
