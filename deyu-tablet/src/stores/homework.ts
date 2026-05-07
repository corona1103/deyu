import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Homework, HomeworkSubmission, Subject } from '@shared/types'
import { useUserStore } from './user'

// 16个学生的名单（与 students store 一致）
const studentNames = [
  { id: 's1', name: '徐婉云' }, { id: 's2', name: '孙沐昀' },
  { id: 's3', name: '刘玥希' }, { id: 's4', name: '毛昱涵' },
  { id: 's5', name: '李渡嘉' }, { id: 's6', name: '张书斌' },
  { id: 's7', name: '邱翌泽' }, { id: 's8', name: '张惟瑄' },
  { id: 's9', name: '马子扬' }, { id: 's10', name: '张京钰' },
  { id: 's11', name: '刘燕杭' }, { id: 's12', name: '王泊远' },
  { id: 's13', name: '程浩月' }, { id: 's14', name: '孙雅诺' },
  { id: 's15', name: '陈翌泽' }, { id: 's16', name: '李嘉懿' },
]

function generateSubmissions(
  submittedCount: number,
  lateCount: number
): HomeworkSubmission[] {
  const shuffled = [...studentNames].sort(() => Math.random() - 0.5)
  return shuffled.map((s, i) => {
    if (i < submittedCount - lateCount) {
      return {
        studentId: s.id,
        studentName: s.name,
        submittedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        isOnTime: true,
        status: 'submitted' as const
      }
    } else if (i < submittedCount) {
      return {
        studentId: s.id,
        studentName: s.name,
        submittedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        isOnTime: false,
        status: 'late' as const
      }
    } else {
      return {
        studentId: s.id,
        studentName: s.name,
        status: 'missing' as const
      }
    }
  })
}

const now = new Date()
function daysAgo(n: number) {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}
function daysLater(n: number) {
  const d = new Date(now)
  d.setDate(d.getDate() + n)
  d.setHours(17, 0, 0, 0)
  return d.toISOString()
}

const mockHomeworks: Homework[] = [
  // ---- 三年级1班 (c1) —— 班主任班级，所有学科 ----
  {
    id: 'hw1', title: '古诗三首背诵默写', subject: '语文',
    deadline: daysLater(1), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(0), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(10, 1)
  },
  {
    id: 'hw2', title: '口算练习册第22页', subject: '数学',
    deadline: daysLater(0), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(1), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(14, 2)
  },
  {
    id: 'hw3', title: 'Unit 5 单词抄写', subject: '英语',
    deadline: daysAgo(0), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(2), status: 'ended', totalStudents: 16,
    submissions: generateSubmissions(15, 1)
  },
  {
    id: 'hw4', title: '阅读理解两篇', subject: '语文',
    deadline: daysAgo(1), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(3), status: 'ended', totalStudents: 16,
    submissions: generateSubmissions(13, 3)
  },
  {
    id: 'hw5', title: '观察日记：植物生长', subject: '其他',
    deadline: daysLater(2), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(0), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(6, 0)
  },
  {
    id: 'hw6', title: '乘法应用题10道', subject: '数学',
    deadline: daysAgo(2), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(4), status: 'ended', totalStudents: 16,
    submissions: generateSubmissions(16, 2)
  },
  {
    id: 'hw7', title: '英语对话练习录音', subject: '英语',
    deadline: daysLater(1), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(1), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(8, 1)
  },
  {
    id: 'hw8', title: '手抄报：我的家乡', subject: '其他',
    deadline: daysLater(3), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(0), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(4, 0)
  },
  {
    id: 'hw9', title: '跳绳打卡200个', subject: '其他',
    deadline: daysLater(0), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(1), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(12, 0)
  },
  {
    id: 'hw10', title: '写字本第三课生字', subject: '语文',
    deadline: daysAgo(3), classId: 'c1', createdBy: '张老师',
    createdAt: daysAgo(5), status: 'ended', totalStudents: 16,
    submissions: generateSubmissions(14, 4)
  },
  // ---- 三年级2班 (c2) —— 班主任班级 ----
  {
    id: 'hw11', title: '看图写话练习', subject: '语文',
    deadline: daysLater(1), classId: 'c2', createdBy: '张老师',
    createdAt: daysAgo(0), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(9, 2)
  },
  {
    id: 'hw12', title: '两位数加减法练习', subject: '数学',
    deadline: daysLater(0), classId: 'c2', createdBy: '张老师',
    createdAt: daysAgo(1), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(13, 1)
  },
  {
    id: 'hw13', title: 'Unit 4 听力练习', subject: '英语',
    deadline: daysAgo(1), classId: 'c2', createdBy: '张老师',
    createdAt: daysAgo(2), status: 'ended', totalStudents: 16,
    submissions: generateSubmissions(15, 3)
  },
  // ---- 四年级3班 (c3) —— 授课班级，仅数学 ----
  {
    id: 'hw14', title: '分数比较练习册', subject: '数学',
    deadline: daysLater(2), classId: 'c3', createdBy: '张老师',
    createdAt: daysAgo(0), status: 'active', totalStudents: 16,
    submissions: generateSubmissions(11, 1)
  },
  {
    id: 'hw15', title: '四则运算综合卷', subject: '数学',
    deadline: daysAgo(1), classId: 'c3', createdBy: '张老师',
    createdAt: daysAgo(3), status: 'ended', totalStudents: 16,
    submissions: generateSubmissions(14, 2)
  },
]

export type TimeFilter = 'today' | 'week' | 'semester' | 'all'

export const useHomeworkStore = defineStore('homework', () => {
  const homeworks = ref<Homework[]>(mockHomeworks)
  const activeFilter = ref<Subject | '全部'>('全部')
  const timeFilter = ref<TimeFilter>('week')
  const selectedHomeworkId = ref<string | null>(null)
  const showPublishModal = ref(false)
  const showDetailModal = ref(false)

  // 本模块独立的班级筛选状态（不影响全局）
  const selectedClassId = ref('c1')

  function setSelectedClass(classId: string) {
    selectedClassId.value = classId
  }

  function setTimeFilter(filter: TimeFilter) {
    timeFilter.value = filter
  }

  // 当前选中班级的角色
  function getClassRole(): 'homeroom' | 'teaching' {
    const userStore = useUserStore()
    return userStore.classRoles[selectedClassId.value] || 'homeroom'
  }

  // 按筛选条件过滤
  const filteredHomeworks = computed(() => {
    const userStore = useUserStore()
    let list = homeworks.value

    // 按本模块选中的班级过滤
    if (selectedClassId.value) {
      list = list.filter(h => h.classId === selectedClassId.value)
    }

    // 授课班级仅显示自己学科
    const role = userStore.classRoles[selectedClassId.value] || 'homeroom'
    if (role === 'teaching' && userStore.teacherSubject) {
      list = list.filter(h => h.subject === userStore.teacherSubject)
    }

    // 学科筛选
    if (activeFilter.value !== '全部') {
      list = list.filter(h => h.subject === activeFilter.value)
    }

    // 时间筛选
    if (timeFilter.value !== 'all') {
      const now = new Date()
      let start: Date
      if (timeFilter.value === 'today') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      } else if (timeFilter.value === 'week') {
        start = new Date(now)
        start.setDate(start.getDate() - start.getDay() + 1)
        start.setHours(0, 0, 0, 0)
      } else {
        // semester: 近 5 个月
        start = new Date(now)
        start.setMonth(start.getMonth() - 5)
        start.setHours(0, 0, 0, 0)
      }
      list = list.filter(h => new Date(h.createdAt) >= start)
    }

    // 按创建时间倒序
    return [...list].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  // 当前选中班级的作业列表（用于统计，仅按班级+学科权限过滤）
  const classHomeworks = computed(() => {
    const userStore = useUserStore()
    let list = homeworks.value
    if (selectedClassId.value) {
      list = list.filter(h => h.classId === selectedClassId.value)
    }
    const role = userStore.classRoles[selectedClassId.value] || 'homeroom'
    if (role === 'teaching' && userStore.teacherSubject) {
      list = list.filter(h => h.subject === userStore.teacherSubject)
    }
    return list
  })

  // 本周作业数
  const weekHomeworkCount = computed(() => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    weekStart.setHours(0, 0, 0, 0)
    return classHomeworks.value.filter(
      h => new Date(h.createdAt) >= weekStart
    ).length
  })

  // 平均提交率
  const avgSubmitRate = computed(() => {
    if (classHomeworks.value.length === 0) return 0
    const rates = classHomeworks.value.map(h => {
      const submitted = h.submissions.filter(s => s.status !== 'missing').length
      return submitted / h.totalStudents
    })
    return Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100)
  })

  // 平均按时率
  const avgOnTimeRate = computed(() => {
    if (classHomeworks.value.length === 0) return 0
    const rates = classHomeworks.value.map(h => {
      const submitted = h.submissions.filter(s => s.status !== 'missing').length
      if (submitted === 0) return 1
      const onTime = h.submissions.filter(s => s.status === 'submitted').length
      return onTime / submitted
    })
    return Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100)
  })

  // 选中的作业详情
  const selectedHomework = computed(() =>
    homeworks.value.find(h => h.id === selectedHomeworkId.value) || null
  )

  function setFilter(subject: Subject | '全部') {
    activeFilter.value = subject
  }

  function openDetail(id: string) {
    selectedHomeworkId.value = id
    showDetailModal.value = true
  }

  function closeDetail() {
    showDetailModal.value = false
    selectedHomeworkId.value = null
  }

  function publishHomework(title: string, subject: Subject, deadline: string) {
    const userStore = useUserStore()
    const newHw: Homework = {
      id: `hw${Date.now()}`,
      title,
      subject,
      deadline,
      classId: selectedClassId.value || 'c1',
      createdBy: userStore.teacher?.name || '张老师',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalStudents: 16,
      submissions: studentNames.map(s => ({
        studentId: s.id,
        studentName: s.name,
        status: 'missing' as const
      }))
    }
    homeworks.value.unshift(newHw)
    showPublishModal.value = false
  }

  return {
    homeworks,
    activeFilter,
    timeFilter,
    selectedClassId,
    selectedHomeworkId,
    showPublishModal,
    showDetailModal,
    filteredHomeworks,
    weekHomeworkCount,
    avgSubmitRate,
    avgOnTimeRate,
    selectedHomework,
    setFilter,
    setTimeFilter,
    setSelectedClass,
    getClassRole,
    openDetail,
    closeDetail,
    publishHomework
  }
})
