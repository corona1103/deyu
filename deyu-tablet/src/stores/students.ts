import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student, Group, SeatConfig } from '@shared/types'

// Mock 数据
const mockStudents: Student[] = [
  { id: 's1', name: '徐婉云', score: 235, groupId: 'g1', seatRow: 0, seatCol: 0 },
  { id: 's2', name: '孙沐昀', score: 269, groupId: 'g1', seatRow: 0, seatCol: 1 },
  { id: 's3', name: '刘玥希', score: 127, groupId: 'g1', seatRow: 0, seatCol: 2 },
  { id: 's4', name: '毛昱涵', score: 160, groupId: 'g1', seatRow: 0, seatCol: 3 },
  { id: 's5', name: '李渡嘉', score: 270, groupId: 'g2', seatRow: 1, seatCol: 0 },
  { id: 's6', name: '张书斌', score: 244, groupId: 'g2', seatRow: 1, seatCol: 1 },
  { id: 's7', name: '邱翌泽', score: 154, groupId: 'g2', seatRow: 1, seatCol: 2 },
  { id: 's8', name: '张惟瑄', score: 189, groupId: 'g2', seatRow: 1, seatCol: 3 },
  { id: 's9', name: '马子扬', score: 154, groupId: 'g3', seatRow: 2, seatCol: 0 },
  { id: 's10', name: '张京钰', score: 197, groupId: 'g3', seatRow: 2, seatCol: 1 },
  { id: 's11', name: '刘燕杭', score: 212, groupId: 'g3', seatRow: 2, seatCol: 2 },
  { id: 's12', name: '王泊远', score: 173, groupId: 'g3', seatRow: 2, seatCol: 3 },
  { id: 's13', name: '程浩月', score: 214, groupId: 'g4', seatRow: 3, seatCol: 0 },
  { id: 's14', name: '孙雅诺', score: 142, groupId: 'g4', seatRow: 3, seatCol: 1 },
  { id: 's15', name: '陈翌泽', score: 141, groupId: 'g4', seatRow: 3, seatCol: 2 },
  { id: 's16', name: '李嘉懿', score: 112, groupId: 'g4', seatRow: 3, seatCol: 3 },
]

const mockGroups: Group[] = [
  {
    id: 'g1',
    name: '孙沐昀组',
    icon: '🐱',
    totalScore: 1070,
    students: mockStudents.filter(s => s.groupId === 'g1')
  },
  {
    id: 'g2',
    name: '张书斌组',
    icon: '🐰',
    totalScore: 1300,
    students: mockStudents.filter(s => s.groupId === 'g2')
  },
  {
    id: 'g3',
    name: '刘燕杭组',
    icon: '🦊',
    totalScore: 1000,
    students: mockStudents.filter(s => s.groupId === 'g3')
  },
  {
    id: 'g4',
    name: '李嘉懿组',
    icon: '🐸',
    totalScore: 857,
    students: mockStudents.filter(s => s.groupId === 'g4')
  },
]

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>(mockStudents)
  const groups = ref<Group[]>(mockGroups)
  const selectedStudentIds = ref<string[]>([])

  // 座位配置
  const seatConfig = ref<SeatConfig>({
    rows: 4,
    cols: 4,
    layout: []
  })

  const selectedStudents = computed(() =>
    students.value.filter(s => selectedStudentIds.value.includes(s.id))
  )

  // 初始化座位布局
  function initSeatLayout() {
    const layout: (string | null)[][] = []
    for (let r = 0; r < seatConfig.value.rows; r++) {
      layout[r] = []
      for (let c = 0; c < seatConfig.value.cols; c++) {
        const student = students.value.find(s => s.seatRow === r && s.seatCol === c)
        layout[r][c] = student?.id || null
      }
    }
    seatConfig.value.layout = layout
  }

  // 更新组的学生列表
  function refreshGroupStudents() {
    groups.value.forEach(group => {
      group.students = students.value.filter(s => s.groupId === group.id)
      group.totalScore = group.students.reduce((sum, s) => sum + s.score, 0)
    })
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

  function selectGroup(groupId: string) {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      selectedStudentIds.value = group.students.map(s => s.id)
    }
  }

  function updateStudentScore(studentId: string, points: number) {
    const student = students.value.find(s => s.id === studentId)
    if (student) {
      student.score += points
    }

    // 更新组总分
    refreshGroupStudents()
  }

  function getStudentById(id: string): Student | undefined {
    return students.value.find(s => s.id === id)
  }

  // ============ 分组管理方法 ============

  // 更新分组信息（名称、图标）
  function updateGroupInfo(groupId: string, updates: { name?: string; icon?: string }) {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      if (updates.name) group.name = updates.name
      if (updates.icon) group.icon = updates.icon
    }
  }

  // 将学生移动到另一个分组
  function moveStudentsToGroup(studentIds: string[], targetGroupId: string) {
    studentIds.forEach(studentId => {
      const student = students.value.find(s => s.id === studentId)
      if (student) {
        student.groupId = targetGroupId
      }
    })
    refreshGroupStudents()
  }

  // 删除分组（学生将移动到默认组或指定组）
  function deleteGroup(groupId: string, moveToGroupId?: string) {
    const groupIndex = groups.value.findIndex(g => g.id === groupId)
    if (groupIndex === -1) return

    // 如果有学生，移动到目标组
    const groupStudents = students.value.filter(s => s.groupId === groupId)
    if (groupStudents.length > 0 && moveToGroupId) {
      moveStudentsToGroup(groupStudents.map(s => s.id), moveToGroupId)
    } else if (groupStudents.length > 0) {
      // 如果没有指定目标组，移动到第一个其他组
      const otherGroup = groups.value.find(g => g.id !== groupId)
      if (otherGroup) {
        moveStudentsToGroup(groupStudents.map(s => s.id), otherGroup.id)
      }
    }

    // 删除组
    groups.value.splice(groupIndex, 1)
  }

  // 创建新分组
  function createGroup(name: string, icon: string): Group {
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name,
      icon,
      totalScore: 0,
      students: []
    }
    groups.value.push(newGroup)
    return newGroup
  }

  // 调整组内学生顺序
  function reorderStudentsInGroup(groupId: string, studentIds: string[]) {
    // 这主要用于UI展示顺序，实际实现可以添加order字段
    // 当前简化处理：不做实际操作
  }

  // ============ 座位表管理方法 ============

  // 获取座位布局
  function getSeatLayout(): (Student | null)[][] {
    const layout: (Student | null)[][] = []
    for (let r = 0; r < seatConfig.value.rows; r++) {
      layout[r] = []
      for (let c = 0; c < seatConfig.value.cols; c++) {
        const studentId = seatConfig.value.layout[r]?.[c]
        layout[r][c] = studentId ? getStudentById(studentId) || null : null
      }
    }
    return layout
  }

  // 更新学生座位
  function updateStudentSeat(studentId: string, row: number, col: number) {
    const student = students.value.find(s => s.id === studentId)
    if (student) {
      // 清除原位置
      if (student.seatRow !== undefined && student.seatCol !== undefined) {
        if (seatConfig.value.layout[student.seatRow]) {
          seatConfig.value.layout[student.seatRow][student.seatCol] = null
        }
      }
      // 设置新位置
      student.seatRow = row
      student.seatCol = col
      if (!seatConfig.value.layout[row]) {
        seatConfig.value.layout[row] = []
      }
      seatConfig.value.layout[row][col] = studentId
    }
  }

  // 交换两个座位
  function swapSeats(studentId1: string, studentId2: string) {
    const student1 = students.value.find(s => s.id === studentId1)
    const student2 = students.value.find(s => s.id === studentId2)

    if (student1 && student2) {
      const tempRow = student1.seatRow
      const tempCol = student1.seatCol

      student1.seatRow = student2.seatRow
      student1.seatCol = student2.seatCol
      student2.seatRow = tempRow
      student2.seatCol = tempCol

      // 更新layout
      initSeatLayout()
    }
  }

  // 清空座位
  function clearSeat(row: number, col: number) {
    const studentId = seatConfig.value.layout[row]?.[col]
    if (studentId) {
      const student = students.value.find(s => s.id === studentId)
      if (student) {
        student.seatRow = undefined
        student.seatCol = undefined
      }
      seatConfig.value.layout[row][col] = null
    }
  }

  // 设置座位配置（行列数）
  function setSeatConfig(rows: number, cols: number) {
    seatConfig.value.rows = rows
    seatConfig.value.cols = cols
    initSeatLayout()
  }

  // 获取未分配座位的学生
  function getUnseatedStudents(): Student[] {
    return students.value.filter(s => s.seatRow === undefined || s.seatCol === undefined)
  }

  // 初始化
  initSeatLayout()

  return {
    students,
    groups,
    selectedStudentIds,
    selectedStudents,
    seatConfig,
    toggleStudentSelection,
    clearSelection,
    selectGroup,
    updateStudentScore,
    getStudentById,
    // 分组管理
    updateGroupInfo,
    moveStudentsToGroup,
    deleteGroup,
    createGroup,
    reorderStudentsInGroup,
    refreshGroupStudents,
    // 座位表管理
    getSeatLayout,
    updateStudentSeat,
    swapSeats,
    clearSeat,
    setSeatConfig,
    getUnseatedStudents
  }
})
