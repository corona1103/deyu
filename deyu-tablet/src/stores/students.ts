import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student, Group, SeatConfig } from '@shared/types'

// Mock 数据 —— c1 三年级1班
const mockStudents: Student[] = [
  { id: 's1', name: '徐婉云', score: 235, classId: 'c1', groupId: 'g1', seatRow: 0, seatCol: 0 },
  { id: 's2', name: '孙沐昀', score: 269, classId: 'c1', groupId: 'g1', seatRow: 0, seatCol: 1 },
  { id: 's3', name: '刘玥希', score: 127, classId: 'c1', groupId: 'g1', seatRow: 0, seatCol: 2 },
  { id: 's4', name: '毛昱涵', score: 160, classId: 'c1', groupId: 'g1', seatRow: 0, seatCol: 3 },
  { id: 's5', name: '李渡嘉', score: 270, classId: 'c1', groupId: 'g2', seatRow: 1, seatCol: 0 },
  { id: 's6', name: '张书斌', score: 244, classId: 'c1', groupId: 'g2', seatRow: 1, seatCol: 1 },
  { id: 's7', name: '邱翌泽', score: 154, classId: 'c1', groupId: 'g2', seatRow: 1, seatCol: 2 },
  { id: 's8', name: '张惟瑄', score: 189, classId: 'c1', groupId: 'g2', seatRow: 1, seatCol: 3 },
  { id: 's9', name: '马子扬', score: 154, classId: 'c1', groupId: 'g3', seatRow: 2, seatCol: 0 },
  { id: 's10', name: '张京钰', score: 197, classId: 'c1', groupId: 'g3', seatRow: 2, seatCol: 1 },
  { id: 's11', name: '刘燕杭', score: 212, classId: 'c1', groupId: 'g3', seatRow: 2, seatCol: 2 },
  { id: 's12', name: '王泊远', score: 173, classId: 'c1', groupId: 'g3', seatRow: 2, seatCol: 3 },
  { id: 's13', name: '程浩月', score: 214, classId: 'c1', groupId: 'g4', seatRow: 3, seatCol: 0 },
  { id: 's14', name: '孙雅诺', score: 142, classId: 'c1', groupId: 'g4', seatRow: 3, seatCol: 1 },
  { id: 's15', name: '陈翌泽', score: 141, classId: 'c1', groupId: 'g4', seatRow: 3, seatCol: 2 },
  { id: 's16', name: '李嘉懿', score: 112, classId: 'c1', groupId: 'g4', seatRow: 3, seatCol: 3 },
  // c2 三年级2班
  { id: 's17', name: '赵思语', score: 218, classId: 'c2', groupId: 'g5', seatRow: 0, seatCol: 0 },
  { id: 's18', name: '钱浩然', score: 195, classId: 'c2', groupId: 'g5', seatRow: 0, seatCol: 1 },
  { id: 's19', name: '周子涵', score: 240, classId: 'c2', groupId: 'g5', seatRow: 0, seatCol: 2 },
  { id: 's20', name: '吴语桐', score: 162, classId: 'c2', groupId: 'g5', seatRow: 0, seatCol: 3 },
  { id: 's21', name: '郑瑞祺', score: 203, classId: 'c2', groupId: 'g6', seatRow: 1, seatCol: 0 },
  { id: 's22', name: '王梓萱', score: 256, classId: 'c2', groupId: 'g6', seatRow: 1, seatCol: 1 },
  { id: 's23', name: '冯逸凡', score: 178, classId: 'c2', groupId: 'g6', seatRow: 1, seatCol: 2 },
  { id: 's24', name: '陈思远', score: 231, classId: 'c2', groupId: 'g6', seatRow: 1, seatCol: 3 },
  { id: 's25', name: '褚明轩', score: 149, classId: 'c2', groupId: 'g7', seatRow: 2, seatCol: 0 },
  { id: 's26', name: '卫诗雅', score: 267, classId: 'c2', groupId: 'g7', seatRow: 2, seatCol: 1 },
  { id: 's27', name: '蒋文博', score: 185, classId: 'c2', groupId: 'g7', seatRow: 2, seatCol: 2 },
  { id: 's28', name: '沈嘉怡', score: 199, classId: 'c2', groupId: 'g7', seatRow: 2, seatCol: 3 },
  { id: 's29', name: '韩宇轩', score: 224, classId: 'c2', groupId: 'g8', seatRow: 3, seatCol: 0 },
  { id: 's30', name: '杨欣妍', score: 137, classId: 'c2', groupId: 'g8', seatRow: 3, seatCol: 1 },
  { id: 's31', name: '朱俊杰', score: 211, classId: 'c2', groupId: 'g8', seatRow: 3, seatCol: 2 },
  { id: 's32', name: '秦若兮', score: 188, classId: 'c2', groupId: 'g8', seatRow: 3, seatCol: 3 },
]

const mockGroups: Group[] = [
  // c1 三年级1班分组
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
  // c2 三年级2班分组
  {
    id: 'g5',
    name: '周子涵组',
    icon: '🐼',
    totalScore: 815,
    students: mockStudents.filter(s => s.groupId === 'g5')
  },
  {
    id: 'g6',
    name: '王梓萱组',
    icon: '🦁',
    totalScore: 868,
    students: mockStudents.filter(s => s.groupId === 'g6')
  },
  {
    id: 'g7',
    name: '卫诗雅组',
    icon: '🐯',
    totalScore: 800,
    students: mockStudents.filter(s => s.groupId === 'g7')
  },
  {
    id: 'g8',
    name: '韩宇轩组',
    icon: '🐻',
    totalScore: 760,
    students: mockStudents.filter(s => s.groupId === 'g8')
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
    layout: [],
    aisleAfterCols: []
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

  // 按班级筛选学生
  function getStudentsByClass(classId: string): Student[] {
    return students.value.filter(s => s.classId === classId)
  }

  // 按班级筛选分组
  function getGroupsByClass(classId: string): Group[] {
    const classStudentIds = new Set(students.value.filter(s => s.classId === classId).map(s => s.id))
    return groups.value.filter(g => g.students.some(s => classStudentIds.has(s.id)))
  }

  // 获取学生所属班级名
  function getStudentClassName(studentId: string): string {
    const student = students.value.find(s => s.id === studentId)
    if (!student?.classId) return ''
    const classMap: Record<string, string> = { c1: '三年级1班', c2: '三年级2班', c3: '四年级3班' }
    return classMap[student.classId] || ''
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

  // 将学生移动到另一个分组（targetGroupId 为空字符串表示移出分组）
  function moveStudentsToGroup(studentIds: string[], targetGroupId: string) {
    studentIds.forEach(studentId => {
      const student = students.value.find(s => s.id === studentId)
      if (student) {
        student.groupId = targetGroupId || undefined
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

  // ============ 座位增删行列 + 过道 ============

  function addSeatRow() {
    const cols = seatConfig.value.cols
    seatConfig.value.layout.push(new Array(cols).fill(null))
    seatConfig.value.rows++
  }

  function removeSeatRow() {
    if (seatConfig.value.rows <= 1) return
    const lastRow = seatConfig.value.layout[seatConfig.value.rows - 1]
    if (lastRow) {
      lastRow.forEach(studentId => {
        if (studentId) {
          const student = students.value.find(s => s.id === studentId)
          if (student) {
            student.seatRow = undefined
            student.seatCol = undefined
          }
        }
      })
    }
    seatConfig.value.layout.pop()
    seatConfig.value.rows--
  }

  function addSeatCol() {
    seatConfig.value.layout.forEach(row => row.push(null))
    seatConfig.value.cols++
  }

  function removeSeatCol() {
    if (seatConfig.value.cols <= 1) return
    const colIndex = seatConfig.value.cols - 1
    seatConfig.value.layout.forEach(row => {
      const studentId = row[colIndex]
      if (studentId) {
        const student = students.value.find(s => s.id === studentId)
        if (student) {
          student.seatRow = undefined
          student.seatCol = undefined
        }
      }
      row.pop()
    })
    seatConfig.value.cols--
    // 移除超出范围的过道标记
    if (seatConfig.value.aisleAfterCols) {
      seatConfig.value.aisleAfterCols = seatConfig.value.aisleAfterCols.filter(c => c < seatConfig.value.cols - 1)
    }
  }

  function toggleAisle(colIndex: number) {
    if (!seatConfig.value.aisleAfterCols) {
      seatConfig.value.aisleAfterCols = []
    }
    const idx = seatConfig.value.aisleAfterCols.indexOf(colIndex)
    if (idx === -1) {
      seatConfig.value.aisleAfterCols.push(colIndex)
      seatConfig.value.aisleAfterCols.sort((a, b) => a - b)
    } else {
      seatConfig.value.aisleAfterCols.splice(idx, 1)
    }
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
    getStudentsByClass,
    getGroupsByClass,
    getStudentClassName,
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
    getUnseatedStudents,
    addSeatRow,
    removeSeatRow,
    addSeatCol,
    removeSeatCol,
    toggleAisle
  }
})
