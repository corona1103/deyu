import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Teacher } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 默认数据 - 用于演示
  const defaultTeacher: Teacher = {
    id: '1',
    name: '张明',  // 系统配置的班主任全名，界面显示时取姓+"老师"
    classes: [
      { id: '3-1', name: '三年级1班', grade: 3, classNumber: 1, students: [], groups: [] },
      { id: '3-2', name: '三年级2班', grade: 3, classNumber: 2, students: [], groups: [] }
    ]
  }

  // 状态 - 默认初始化为演示数据
  const teacher = ref<Teacher | null>(defaultTeacher)
  const currentClassId = ref<string>('3-1')  // 默认选中三年级1班
  const isLoggedIn = ref(true)

  // 计算属性
  const currentClass = computed(() => {
    if (!teacher.value || !currentClassId.value) return null
    return teacher.value.classes.find(c => c.id === currentClassId.value) || null
  })

  const classes = computed(() => teacher.value?.classes || [])

  // 方法
  function setTeacher(t: Teacher) {
    teacher.value = t
    isLoggedIn.value = true
    // 默认选中第一个班级
    const firstClass = t.classes[0]
    if (firstClass && !currentClassId.value) {
      currentClassId.value = firstClass.id
    }
  }

  function setCurrentClass(classId: string) {
    currentClassId.value = classId
  }

  function logout() {
    teacher.value = null
    currentClassId.value = ''
    isLoggedIn.value = false
  }

  return {
    teacher,
    currentClassId,
    isLoggedIn,
    currentClass,
    classes,
    setTeacher,
    setCurrentClass,
    logout
  }
})
