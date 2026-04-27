import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Teacher, ClassInfo } from '@shared/types'

export const useUserStore = defineStore('user', () => {
  const teacher = ref<Teacher | null>(null)
  const currentClassId = ref<string>('')

  const isLoggedIn = computed(() => teacher.value !== null)

  const currentClass = computed<ClassInfo | null>(() => {
    if (!teacher.value || !currentClassId.value) return null
    return teacher.value.classes.find(c => c.id === currentClassId.value) || null
  })

  function setTeacher(data: Teacher) {
    teacher.value = data
    if (data.classes.length > 0 && !currentClassId.value) {
      currentClassId.value = data.classes[0].id
    }
  }

  function setCurrentClass(classId: string) {
    currentClassId.value = classId
  }

  function logout() {
    teacher.value = null
    currentClassId.value = ''
  }

  // Mock 登录
  function mockLogin() {
    const mockTeacher: Teacher = {
      id: 't1',
      name: '张老师',
      phone: '138****8888',
      classes: [
        {
          id: 'c1',
          name: '三年级1班',
          grade: 3,
          classNumber: 1,
          students: [],
          groups: []
        },
        {
          id: 'c2',
          name: '三年级2班',
          grade: 3,
          classNumber: 2,
          students: [],
          groups: []
        }
      ]
    }
    setTeacher(mockTeacher)
  }

  return {
    teacher,
    currentClassId,
    isLoggedIn,
    currentClass,
    setTeacher,
    setCurrentClass,
    logout,
    mockLogin
  }
})
