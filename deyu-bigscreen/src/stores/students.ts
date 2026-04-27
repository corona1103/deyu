import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student, Group } from '@/types'

export const useStudentsStore = defineStore('students', () => {
  // 状态
  const students = ref<Student[]>([])
  const groups = ref<Group[]>([])
  const selectedStudentIds = ref<string[]>([])
  const viewMode = ref<'group' | 'all' | 'seat'>('group')

  // 计算属性
  const selectedStudents = computed(() => {
    return students.value.filter(s => selectedStudentIds.value.includes(s.id))
  })

  const studentsByGroup = computed(() => {
    const result: Record<string, Student[]> = {}
    groups.value.forEach(g => {
      result[g.id] = students.value.filter(s => s.groupId === g.id)
    })
    return result
  })

  // 方法
  function setStudents(studentList: Student[]) {
    students.value = studentList
  }

  function setGroups(groupList: Group[]) {
    groups.value = groupList
  }

  function toggleStudentSelection(studentId: string) {
    const index = selectedStudentIds.value.indexOf(studentId)
    if (index === -1) {
      selectedStudentIds.value.push(studentId)
    } else {
      selectedStudentIds.value.splice(index, 1)
    }
  }

  function clearSelection() {
    selectedStudentIds.value = []
  }

  function setViewMode(mode: 'group' | 'all' | 'seat') {
    viewMode.value = mode
  }

  function updateStudentScore(studentId: string, delta: number) {
    const student = students.value.find(s => s.id === studentId)
    if (student) {
      student.score += delta
    }
  }

  return {
    students,
    groups,
    selectedStudentIds,
    viewMode,
    selectedStudents,
    studentsByGroup,
    setStudents,
    setGroups,
    toggleStudentSelection,
    clearSelection,
    setViewMode,
    updateStudentScore
  }
})
