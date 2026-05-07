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

  // 教师角色与班级的关系：班主任 or 授课教师
  // classRoles: { classId → 'homeroom' | 'teaching' }
  const classRoles = ref<Record<string, 'homeroom' | 'teaching'>>({})
  const teacherSubject = ref<string>('')  // 授课教师的学科

  // 当前班级角色
  const currentClassRole = computed(() => {
    if (!currentClassId.value) return 'homeroom'
    return classRoles.value[currentClassId.value] || 'homeroom'
  })

  // 是否为当前班级的班主任
  const isHomeroom = computed(() => currentClassRole.value === 'homeroom')

  // 班主任管辖的班级列表（不含授课班级）
  const homeroomClasses = computed(() => {
    if (!teacher.value) return []
    return teacher.value.classes.filter(c => classRoles.value[c.id] === 'homeroom')
  })

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
        },
        {
          id: 'c3',
          name: '四年级3班',
          grade: 4,
          classNumber: 3,
          students: [],
          groups: []
        }
      ]
    }
    setTeacher(mockTeacher)
    // c1, c2 是班主任班级；c3 是授课班级（只教数学）
    classRoles.value = { c1: 'homeroom', c2: 'homeroom', c3: 'teaching' }
    teacherSubject.value = '数学'
  }

  return {
    teacher,
    currentClassId,
    isLoggedIn,
    currentClass,
    classRoles,
    teacherSubject,
    currentClassRole,
    isHomeroom,
    homeroomClasses,
    setTeacher,
    setCurrentClass,
    logout,
    mockLogin
  }
})
