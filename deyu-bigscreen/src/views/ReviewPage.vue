<script setup lang="ts">
import { ref, computed } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'

// 数据 - 6个小组，每组约10人
const groups = ref([
  {
    id: 1, name: '孙沐昀组', icon: '🐱', totalScore: 1070,
    students: [
      { id: '1-1', name: '徐婉云', score: 235 },
      { id: '1-2', name: '孙沐昀', score: 269 },
      { id: '1-3', name: '刘玥希', score: 127 },
      { id: '1-4', name: '毛昱涵', score: 160 },
      { id: '1-5', name: '陈思琪', score: 198 },
      { id: '1-6', name: '王子轩', score: 176 },
      { id: '1-7', name: '李欣怡', score: 145 },
      { id: '1-8', name: '张浩然', score: 132 },
      { id: '1-9', name: '刘雨桐', score: 118 },
      { id: '1-10', name: '周子墨', score: 105 }
    ]
  },
  {
    id: 2, name: '张书斌组', icon: '🐰', totalScore: 1300,
    students: [
      { id: '2-1', name: '李渡嘉', score: 270 },
      { id: '2-2', name: '张书斌', score: 244 },
      { id: '2-3', name: '邱翌泽', score: 154 },
      { id: '2-4', name: '张惟瑄', score: 189 },
      { id: '2-5', name: '赵晨曦', score: 201 },
      { id: '2-6', name: '吴佳琪', score: 167 },
      { id: '2-7', name: '郑宇航', score: 143 },
      { id: '2-8', name: '黄诗涵', score: 128 },
      { id: '2-9', name: '杨子涵', score: 112 },
      { id: '2-10', name: '孙梓萱', score: 98 }
    ]
  },
  {
    id: 3, name: '刘燕杭组', icon: '🦊', totalScore: 1000,
    students: [
      { id: '3-1', name: '马子扬', score: 154 },
      { id: '3-2', name: '张京钰', score: 197 },
      { id: '3-3', name: '刘燕杭', score: 212 },
      { id: '3-4', name: '王泊远', score: 173 },
      { id: '3-5', name: '林悦然', score: 165 },
      { id: '3-6', name: '何雨泽', score: 148 },
      { id: '3-7', name: '罗诗琪', score: 134 },
      { id: '3-8', name: '谢子豪', score: 121 },
      { id: '3-9', name: '唐欣妍', score: 108 },
      { id: '3-10', name: '冯浩宇', score: 95 }
    ]
  },
  {
    id: 4, name: '李嘉懿组', icon: '🐸', totalScore: 857,
    students: [
      { id: '4-1', name: '程浩月', score: 214 },
      { id: '4-2', name: '孙雅诺', score: 142 },
      { id: '4-3', name: '陈翌泽', score: 141 },
      { id: '4-4', name: '李嘉懿', score: 112 },
      { id: '4-5', name: '吕思远', score: 178 },
      { id: '4-6', name: '魏子轩', score: 156 },
      { id: '4-7', name: '蒋雨萱', score: 139 },
      { id: '4-8', name: '沈梓涵', score: 124 },
      { id: '4-9', name: '韩晓彤', score: 109 },
      { id: '4-10', name: '曹俊杰', score: 96 }
    ]
  },
  {
    id: 5, name: '徐奕洲组', icon: '🐻', totalScore: 863,
    students: [
      { id: '5-1', name: '李牧谦', score: 78 },
      { id: '5-2', name: '刘昕佳葆', score: 170 },
      { id: '5-3', name: '徐奕洲', score: 145 },
      { id: '5-4', name: '罗慕瑶', score: 136 },
      { id: '5-5', name: '潘子琪', score: 188 },
      { id: '5-6', name: '董雨欣', score: 162 },
      { id: '5-7', name: '袁浩然', score: 147 },
      { id: '5-8', name: '邓诗雨', score: 131 },
      { id: '5-9', name: '许子墨', score: 116 },
      { id: '5-10', name: '傅晨阳', score: 102 }
    ]
  },
  {
    id: 6, name: '王梓萱组', icon: '🦁', totalScore: 920,
    students: [
      { id: '6-1', name: '王梓萱', score: 225 },
      { id: '6-2', name: '陆子涵', score: 198 },
      { id: '6-3', name: '姚思琪', score: 176 },
      { id: '6-4', name: '崔浩宇', score: 158 },
      { id: '6-5', name: '钟雨桐', score: 143 },
      { id: '6-6', name: '谭子轩', score: 129 },
      { id: '6-7', name: '廖欣怡', score: 115 },
      { id: '6-8', name: '邱梓涵', score: 101 },
      { id: '6-9', name: '侯子墨', score: 88 },
      { id: '6-10', name: '龚晨曦', score: 75 }
    ]
  }
])

// 行为指标维度
const dimensions = [
  {
    name: '快乐',
    icon: '😊',
    indicators: [
      { label: '情绪稳定', type: 'positive', points: 2 },
      { label: '积极运动', type: 'positive', points: 2 },
      { label: '保护自己', type: 'positive', points: 2 },
      { label: '需要关注', type: 'negative', points: -1 }
    ]
  },
  {
    name: '进取',
    icon: '🚀',
    indicators: [
      { label: '按时作业', type: 'positive', points: 2 },
      { label: '主动提问', type: 'positive', points: 2 },
      { label: '坚持不懈', type: 'positive', points: 2 },
      { label: '需要鼓励', type: 'negative', points: -1 }
    ]
  },
  {
    name: '儒雅',
    icon: '📚',
    indicators: [
      { label: '礼貌待人', type: 'positive', points: 2 },
      { label: '安静倾听', type: 'positive', points: 2 },
      { label: '温和沟通', type: 'positive', points: 2 },
      { label: '待改进', type: 'negative', points: -1 }
    ]
  },
  {
    name: '大气',
    icon: '💪',
    indicators: [
      { label: '关心集体', type: 'positive', points: 2 },
      { label: '主动服务', type: 'positive', points: 2 },
      { label: '责任担当', type: 'positive', points: 2 },
      { label: '需要引导', type: 'negative', points: -1 }
    ]
  }
]

// 可选的小组图标
const availableIcons = ['🐱', '🐰', '🦊', '🐸', '🐻', '🦁', '🐼', '🐨', '🐯', '🦄', '🐶', '🐵', '🐷', '🐮', '🐹', '🦋', '🌸', '🌻', '⭐', '🌈']

// 状态
const viewMode = ref<'group' | 'all' | 'seat'>('group')
const timePeriod = ref('week')
const multiSelectMode = ref(false)
const selectedStudents = ref<string[]>([])
const showReviewModal = ref(false)
const selectedIndicators = ref<string[]>([])
const toastMessage = ref('')
const showToast = ref(false)

// 小组编辑状态
const showGroupEditModal = ref(false)
const editingGroup = ref<{ id: number; name: string; icon: string } | null>(null)
const editGroupName = ref('')
const editGroupIcon = ref('')

// 加分动效状态
const scoreAnimations = ref<Map<string, { points: number; show: boolean }>>(new Map())

// 计算属性
const allStudents = computed(() => {
  const all: { name: string; score: number; groupId: number; groupName: string }[] = []
  groups.value.forEach(g => {
    g.students.forEach(s => {
      all.push({ name: s.name, score: s.score, groupId: g.id, groupName: g.name })
    })
  })
  return all.sort((a, b) => b.score - a.score)
})

const totalStudentCount = computed(() => allStudents.value.length)

// 方法
function switchView(mode: 'group' | 'all' | 'seat') {
  viewMode.value = mode
}

function switchTime(period: string) {
  timePeriod.value = period
  toast(`已切换到「${getTimePeriodLabel(period)}」数据`)
}

function getTimePeriodLabel(period: string) {
  const labels: Record<string, string> = {
    day: '今日',
    week: '本周',
    month: '本月',
    semester: '本学期'
  }
  return labels[period] || period
}

function handleStudentClick(name: string) {
  if (multiSelectMode.value) {
    toggleStudentSelection(name)
  } else {
    openReviewModal([name])
  }
}

function toggleStudentSelection(name: string) {
  const index = selectedStudents.value.indexOf(name)
  if (index > -1) {
    selectedStudents.value.splice(index, 1)
  } else {
    selectedStudents.value.push(name)
  }
}

function isStudentSelected(name: string) {
  return selectedStudents.value.includes(name)
}

function enterMultiSelectMode() {
  multiSelectMode.value = true
  selectedStudents.value = []
  toast('点击学生进行选择')
}

function exitMultiSelectMode() {
  multiSelectMode.value = false
  selectedStudents.value = []
}

function selectAllStudents() {
  selectedStudents.value = allStudents.value.map(s => s.name)
  toast(`已全选 ${selectedStudents.value.length} 名学生`)
}

function selectGroup(groupId: number) {
  const group = groups.value.find(g => g.id === groupId)
  if (!group) return

  const groupNames = group.students.map(s => s.name)
  const allSelected = groupNames.every(name => selectedStudents.value.includes(name))

  if (allSelected) {
    // 取消本组
    groupNames.forEach(name => {
      const index = selectedStudents.value.indexOf(name)
      if (index > -1) selectedStudents.value.splice(index, 1)
    })
    toast(`已取消 ${group.name}`)
  } else {
    // 选择本组
    groupNames.forEach(name => {
      if (!selectedStudents.value.includes(name)) {
        selectedStudents.value.push(name)
      }
    })
    toast(`已选择 ${group.name}`)
  }
}

function isGroupSelected(groupId: number) {
  const group = groups.value.find(g => g.id === groupId)
  if (!group) return false
  return group.students.every(s => selectedStudents.value.includes(s.name))
}

function clearSelection() {
  selectedStudents.value = []
}

function confirmMultiReview() {
  if (selectedStudents.value.length === 0) {
    toast('请先选择要点评的学生')
    return
  }
  openReviewModal(selectedStudents.value)
}

function openReviewModal(students: string[]) {
  selectedStudents.value = students
  selectedIndicators.value = []
  showReviewModal.value = true
}

function closeReviewModal() {
  showReviewModal.value = false
  selectedIndicators.value = []
}

function toggleIndicator(indicator: string) {
  const index = selectedIndicators.value.indexOf(indicator)
  if (index > -1) {
    selectedIndicators.value.splice(index, 1)
  } else {
    selectedIndicators.value.push(indicator)
  }
}

function isIndicatorSelected(indicator: string) {
  return selectedIndicators.value.includes(indicator)
}

function submitReview() {
  if (selectedIndicators.value.length === 0) {
    toast('请选择至少一个评价指标')
    return
  }

  // 计算总分
  let totalPoints = 0
  dimensions.forEach(dim => {
    dim.indicators.forEach(ind => {
      if (selectedIndicators.value.includes(ind.label)) {
        totalPoints += ind.points
      }
    })
  })

  // 更新学生分数并显示动效
  const reviewedStudents = [...selectedStudents.value]

  if (totalPoints !== 0) {
    // 更新分数
    groups.value.forEach(group => {
      group.students.forEach(student => {
        if (reviewedStudents.includes(student.name)) {
          student.score += totalPoints
          // 更新小组总分
          group.totalScore += totalPoints
        }
      })
    })

    // 显示加分动效（仅对加分显示）
    if (totalPoints > 0) {
      reviewedStudents.forEach(name => {
        scoreAnimations.value.set(name, { points: totalPoints, show: true })
      })

      // 2秒后隐藏动效
      setTimeout(() => {
        reviewedStudents.forEach(name => {
          scoreAnimations.value.delete(name)
        })
      }, 2000)
    }
  }

  // 显示提示
  if (totalPoints > 0) {
    toast(`✅ 点评成功！${reviewedStudents.length}名学生各+${totalPoints}分`)
  } else if (totalPoints < 0) {
    toast(`✅ 点评已记录`)
  } else {
    toast(`✅ 点评已记录`)
  }

  closeReviewModal()
  if (multiSelectMode.value) exitMultiSelectMode()
}

function toast(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2500)
}

// 小组编辑方法
function openGroupEditModal(group: typeof groups.value[0]) {
  editingGroup.value = { id: group.id, name: group.name, icon: group.icon }
  editGroupName.value = group.name
  editGroupIcon.value = group.icon
  showGroupEditModal.value = true
}

function closeGroupEditModal() {
  showGroupEditModal.value = false
  editingGroup.value = null
}

function selectGroupIcon(icon: string) {
  editGroupIcon.value = icon
}

function saveGroupEdit() {
  if (!editingGroup.value) return

  const group = groups.value.find(g => g.id === editingGroup.value!.id)
  if (group) {
    group.name = editGroupName.value
    group.icon = editGroupIcon.value
    toast(`小组「${editGroupName.value}」已更新`)
  }
  closeGroupEditModal()
}

// 获取学生加分动效
function getScoreAnimation(name: string) {
  return scoreAnimations.value.get(name)
}

// 座位表相关
function selectColumn(colIndex: number) {
  const rows = 5
  const seatsPerRow = 6
  const columnStudents: string[] = []
  const colNames = ['A', 'B', 'C', 'D', 'E', 'F']

  for (let row = 0; row < rows; row++) {
    const studentIndex = row * seatsPerRow + colIndex
    const student = allStudents.value[studentIndex]
    if (student) {
      columnStudents.push(student.name)
    }
  }

  const allSelected = columnStudents.every(name => selectedStudents.value.includes(name))

  if (allSelected) {
    columnStudents.forEach(name => {
      const index = selectedStudents.value.indexOf(name)
      if (index > -1) selectedStudents.value.splice(index, 1)
    })
    toast(`已取消 ${colNames[colIndex]} 列`)
  } else {
    columnStudents.forEach(name => {
      if (!selectedStudents.value.includes(name)) {
        selectedStudents.value.push(name)
      }
    })
    toast(`已选择 ${colNames[colIndex]} 列 (${columnStudents.length}人)`)
  }
}

function getSeatStudent(row: number, col: number) {
  const index = row * 6 + col
  return index < allStudents.value.length ? allStudents.value[index] : null
}
</script>

<template>
  <div class="review-page">
    <TopNav />

    <!-- 子导航和时间筛选 -->
    <div class="sub-nav">
      <div class="view-tabs">
        <button
          class="view-tab"
          :class="{ active: viewMode === 'group' }"
          @click="switchView('group')"
        >
          🏠 小组
        </button>
        <button
          class="view-tab"
          :class="{ active: viewMode === 'all' }"
          @click="switchView('all')"
        >
          👥 全部学生
        </button>
        <button
          class="view-tab"
          :class="{ active: viewMode === 'seat' }"
          @click="switchView('seat')"
        >
          🪑 座位表
        </button>
      </div>
      <div class="time-filter">
        <button
          v-for="period in ['day', 'week', 'month', 'semester']"
          :key="period"
          class="time-btn"
          :class="{ active: timePeriod === period }"
          @click="switchTime(period)"
        >
          {{ getTimePeriodLabel(period) }}
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="main-content" :class="{ 'multi-select-mode': multiSelectMode }">
      <!-- 小组视图 -->
      <div v-if="viewMode === 'group'" class="groups-grid">
        <div v-for="group in groups" :key="group.id" class="group-card">
          <div class="group-header">
            <div class="group-left">
              <div class="group-icon" @click.stop="openGroupEditModal(group)" title="点击修改图标">{{ group.icon }}</div>
              <span class="group-name" @click.stop="openGroupEditModal(group)" title="点击修改名称">{{ group.name }}</span>
            </div>
            <button
              v-if="multiSelectMode"
              class="group-select-btn"
              :class="{ selected: isGroupSelected(group.id) }"
              @click="selectGroup(group.id)"
            >
              {{ isGroupSelected(group.id) ? '取消本组' : '全选本组' }}
            </button>
            <div class="group-score">
              <span class="score-icon">🏆</span>
              {{ group.totalScore >= 1000 ? (group.totalScore / 1000).toFixed(2) + 'k' : group.totalScore }}
            </div>
          </div>
          <div class="students-list">
            <div
              v-for="student in group.students"
              :key="student.id"
              class="student-card"
              :class="{
                selected: isStudentSelected(student.name),
                'has-animation': getScoreAnimation(student.name)?.show
              }"
              @click="handleStudentClick(student.name)"
            >
              <div v-if="multiSelectMode" class="student-checkbox">✓</div>
              <div class="student-name">{{ student.name }}</div>
              <div class="student-score">
                <span class="score-star">⭐</span>
                <span class="score-value">{{ student.score }}</span>
              </div>
              <!-- 加分动效 -->
              <div
                v-if="getScoreAnimation(student.name)?.show"
                class="score-animation"
              >
                +{{ getScoreAnimation(student.name)?.points }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 全部学生视图 -->
      <div v-if="viewMode === 'all'" class="all-students-view">
        <div class="all-students-header">
          <span class="all-students-title">👥 全班学生（共 {{ totalStudentCount }} 人）</span>
        </div>
        <div class="all-students-grid">
          <div
            v-for="student in allStudents"
            :key="student.name"
            class="mini-card"
            :class="{ selected: isStudentSelected(student.name) }"
            @click="handleStudentClick(student.name)"
          >
            <div v-if="multiSelectMode" class="mini-checkbox">✓</div>
            <div class="mini-name">{{ student.name }}</div>
            <div class="mini-score">{{ student.score }}</div>
          </div>
        </div>
      </div>

      <!-- 座位表视图 -->
      <div v-if="viewMode === 'seat'" class="seat-view">
        <div class="classroom-container">
          <div class="blackboard">📖 黑 板</div>

          <!-- 列选择按钮 -->
          <div v-if="multiSelectMode" class="column-select-bar">
            <div class="column-group">
              <span class="column-label">左组</span>
              <button class="column-btn" @click="selectColumn(0)">A列</button>
              <button class="column-btn" @click="selectColumn(1)">B列</button>
            </div>
            <div class="column-divider"></div>
            <div class="column-group">
              <span class="column-label">中组</span>
              <button class="column-btn" @click="selectColumn(2)">C列</button>
              <button class="column-btn" @click="selectColumn(3)">D列</button>
            </div>
            <div class="column-divider"></div>
            <div class="column-group">
              <span class="column-label">右组</span>
              <button class="column-btn" @click="selectColumn(4)">E列</button>
              <button class="column-btn" @click="selectColumn(5)">F列</button>
            </div>
          </div>

          <div class="desk-rows">
            <div v-for="row in 5" :key="row" class="desk-row">
              <div class="desk-group">
                <div
                  v-for="col in 2"
                  :key="col"
                  class="seat-cell"
                  :class="{
                    empty: !getSeatStudent(row - 1, col - 1),
                    selected: getSeatStudent(row - 1, col - 1) && isStudentSelected(getSeatStudent(row - 1, col - 1)!.name)
                  }"
                  @click="getSeatStudent(row - 1, col - 1) && handleStudentClick(getSeatStudent(row - 1, col - 1)!.name)"
                >
                  <template v-if="getSeatStudent(row - 1, col - 1)">
                    <div v-if="multiSelectMode" class="seat-checkbox">✓</div>
                    <div class="seat-name">{{ getSeatStudent(row - 1, col - 1)!.name }}</div>
                    <div class="seat-score">{{ getSeatStudent(row - 1, col - 1)!.score }}</div>
                  </template>
                </div>
              </div>
              <div class="aisle"></div>
              <div class="desk-group">
                <div
                  v-for="col in 2"
                  :key="col"
                  class="seat-cell"
                  :class="{
                    empty: !getSeatStudent(row - 1, col + 1),
                    selected: getSeatStudent(row - 1, col + 1) && isStudentSelected(getSeatStudent(row - 1, col + 1)!.name)
                  }"
                  @click="getSeatStudent(row - 1, col + 1) && handleStudentClick(getSeatStudent(row - 1, col + 1)!.name)"
                >
                  <template v-if="getSeatStudent(row - 1, col + 1)">
                    <div v-if="multiSelectMode" class="seat-checkbox">✓</div>
                    <div class="seat-name">{{ getSeatStudent(row - 1, col + 1)!.name }}</div>
                    <div class="seat-score">{{ getSeatStudent(row - 1, col + 1)!.score }}</div>
                  </template>
                </div>
              </div>
              <div class="aisle"></div>
              <div class="desk-group">
                <div
                  v-for="col in 2"
                  :key="col"
                  class="seat-cell"
                  :class="{
                    empty: !getSeatStudent(row - 1, col + 3),
                    selected: getSeatStudent(row - 1, col + 3) && isStudentSelected(getSeatStudent(row - 1, col + 3)!.name)
                  }"
                  @click="getSeatStudent(row - 1, col + 3) && handleStudentClick(getSeatStudent(row - 1, col + 3)!.name)"
                >
                  <template v-if="getSeatStudent(row - 1, col + 3)">
                    <div v-if="multiSelectMode" class="seat-checkbox">✓</div>
                    <div class="seat-name">{{ getSeatStudent(row - 1, col + 3)!.name }}</div>
                    <div class="seat-score">{{ getSeatStudent(row - 1, col + 3)!.score }}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部工具栏 - 普通模式 -->
    <footer v-if="!multiSelectMode" class="bottom-toolbar">
      <button class="tool-btn primary" @click="enterMultiSelectMode">
        <span class="tool-icon">👥</span>
        <span>点评多人</span>
      </button>
    </footer>

    <!-- 底部工具栏 - 多选模式 -->
    <footer v-else class="bottom-toolbar multi-select-bar">
      <button class="select-btn" @click="selectAllStudents">
        <span>📋</span> 全选
      </button>
      <div class="selected-count">
        已选择 <strong>{{ selectedStudents.length }}</strong> 人
      </div>
      <button class="select-btn outline" @click="clearSelection">清空选择</button>
      <button class="confirm-btn" @click="confirmMultiReview">
        <span>✨</span> 确认点评
      </button>
      <button class="cancel-btn" @click="exitMultiSelectMode">取消</button>
    </footer>

    <!-- 点评弹窗 -->
    <div v-if="showReviewModal" class="review-modal" @click="closeReviewModal">
      <div class="review-panel" @click.stop>
        <div class="review-panel-header">
          <h3 class="review-panel-title">📝 学生点评</h3>
          <button class="review-panel-close" @click="closeReviewModal">×</button>
        </div>
        <div class="review-panel-body">
          <div class="review-students">
            <span v-for="name in selectedStudents" :key="name" class="review-student-tag">
              👤 {{ name }}
            </span>
          </div>

          <div v-for="dim in dimensions" :key="dim.name" class="dimension-section">
            <div class="dimension-title">{{ dim.icon }} {{ dim.name }}</div>
            <div class="dimension-grid">
              <button
                v-for="ind in dim.indicators"
                :key="ind.label"
                class="indicator-btn"
                :class="[ind.type, { selected: isIndicatorSelected(ind.label) }]"
                @click="toggleIndicator(ind.label)"
              >
                {{ ind.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="review-panel-footer">
          <button class="btn-cancel" @click="closeReviewModal">取消</button>
          <button class="btn-confirm" @click="submitReview">确认点评</button>
        </div>
      </div>
    </div>

    <!-- 小组编辑弹窗 -->
    <div v-if="showGroupEditModal" class="group-edit-modal" @click="closeGroupEditModal">
      <div class="group-edit-panel" @click.stop>
        <div class="group-edit-header">
          <h3 class="group-edit-title">✏️ 编辑小组</h3>
          <button class="group-edit-close" @click="closeGroupEditModal">×</button>
        </div>
        <div class="group-edit-body">
          <!-- 小组名称 -->
          <div class="edit-field">
            <label class="edit-label">小组名称</label>
            <input
              v-model="editGroupName"
              type="text"
              class="edit-input"
              placeholder="请输入小组名称"
            >
          </div>

          <!-- 小组图标选择 -->
          <div class="edit-field">
            <label class="edit-label">选择图标</label>
            <div class="icon-grid">
              <div
                v-for="icon in availableIcons"
                :key="icon"
                class="icon-option"
                :class="{ selected: editGroupIcon === icon }"
                @click="selectGroupIcon(icon)"
              >
                {{ icon }}
              </div>
            </div>
          </div>

          <!-- 预览 -->
          <div class="edit-preview">
            <span class="preview-label">预览：</span>
            <div class="preview-group">
              <span class="preview-icon">{{ editGroupIcon }}</span>
              <span class="preview-name">{{ editGroupName }}</span>
            </div>
          </div>
        </div>
        <div class="group-edit-footer">
          <button class="btn-cancel" @click="closeGroupEditModal">取消</button>
          <button class="btn-save" @click="saveGroupEdit">保存</button>
        </div>
      </div>
    </div>

    <!-- Toast 消息 -->
    <div class="toast" :class="{ show: showToast }">{{ toastMessage }}</div>
  </div>
</template>

<style scoped lang="scss">
.review-page {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(180deg, #E8F4FD 0%, #F5F9FC 100%);
  display: flex;
  flex-direction: column;
}

.sub-nav {
  height: 80px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.view-tabs {
  display: flex;
  gap: 12px;
}

.view-tab {
  padding: 18px 40px;
  border-radius: 30px;
  font-size: 30px;
  color: #666;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #E8F4FD;
  }

  &.active {
    background: var(--color-secondary);
    color: white;
  }
}

.time-filter {
  display: flex;
  gap: 12px;
}

.time-btn {
  padding: 16px 36px;
  border-radius: 28px;
  font-size: 27px;
  color: #666;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #E8F4FD;
  }

  &.active {
    background: var(--color-secondary);
    color: white;
  }
}

.main-content {
  flex: 1;
  padding: 30px 50px;
  overflow-y: auto;

  &.multi-select-mode {
    .student-card, .mini-card, .seat-cell:not(.empty) {
      cursor: pointer;

      .student-checkbox, .mini-checkbox, .seat-checkbox {
        display: flex;
      }
    }
  }
}

// 小组视图 - 自适应折行布局
.groups-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: flex-start;
}

.group-card {
  background: white;
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #F0F0F0;
  // 3列布局，考虑gap
  flex: 0 0 calc((100% - 48px) / 3);
  min-width: 320px;
  max-width: 600px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F5F5F5;
}

.group-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: #FFF3E0;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}

.group-name {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  cursor: pointer;

  &:hover {
    color: var(--color-secondary);
  }
}

.group-select-btn {
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 21px;
  background: #E8F4FD;
  color: var(--color-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover, &.selected {
    background: var(--color-secondary);
    color: white;
  }
}

.group-score {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 24px;
  color: #666;
  background: #FFFBF0;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid #FFE4B5;

  .score-icon {
    font-size: 24px;
  }
}

// 学生列表 - 网格布局，自动折行
.students-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.student-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  min-width: 80px;
  position: relative;

  &:hover {
    background: rgba(74, 144, 217, 0.08);
  }

  &.selected {
    background: #E3F2FD;
    border-color: var(--color-secondary);

    .student-checkbox {
      background: var(--color-secondary);
      color: white;
    }
  }

  &.has-animation {
    animation: cardPulse 0.5s ease-out;
    background: rgba(76, 175, 80, 0.1);
  }
}

// 加分动效
.score-animation {
  position: absolute;
  top: -12px;
  right: -8px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  font-size: 21px;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 14px;
  animation: scoreFloat 2s ease-out forwards;
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.4);
  z-index: 10;
}

@keyframes scoreFloat {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translateY(0) scale(1.2);
  }
  40% {
    transform: translateY(-5px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
}

@keyframes cardPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  }
  100% {
    transform: scale(1);
  }
}

.student-checkbox {
  display: none;
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E0E0E0;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #999;
}

.student-name {
  font-size: 24px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
  line-height: 1.4;
  white-space: nowrap;
}

.student-score {
  display: flex;
  align-items: center;
  gap: 4px;

  .score-star {
    font-size: 20px;
  }

  .score-value {
    font-size: 22px;
    color: #FF9800;
    font-weight: 600;
  }
}

// 全部学生视图
.all-students-view {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.all-students-header {
  margin-bottom: 20px;
}

.all-students-title {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}

.all-students-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 12px;
}

.mini-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background: #F8FAFC;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    background: #E8F4FD;
    transform: translateY(-2px);
  }

  &.selected {
    background: #E3F2FD;
    border-color: var(--color-secondary);

    .mini-checkbox {
      background: var(--color-secondary);
      color: white;
    }
  }
}

.mini-checkbox {
  display: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #E0E0E0;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #999;
  margin-bottom: 8px;
}

.mini-name {
  font-size: 21px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
  white-space: nowrap;
}

.mini-score {
  font-size: 20px;
  color: #FF9800;
  font-weight: bold;
}

// 座位表视图
.seat-view {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.classroom-container {
  background: white;
  border-radius: 25px;
  padding: 30px 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.blackboard {
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  color: white;
  text-align: center;
  padding: 20px 80px;
  border-radius: 10px;
  font-size: 27px;
  margin-bottom: 30px;
  letter-spacing: 10px;
}

.column-select-bar {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
  padding: 18px;
  background: #F8FAFC;
  border-radius: 14px;
}

.column-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.column-label {
  font-size: 20px;
  color: #666;
}

.column-btn {
  padding: 10px 22px;
  border-radius: 18px;
  font-size: 20px;
  background: white;
  color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--color-secondary);
    color: white;
  }
}

.column-divider {
  width: 1px;
  height: 30px;
  background: #E0E0E0;
}

.desk-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.desk-row {
  display: flex;
  justify-content: center;
  gap: 0;
}

.desk-group {
  display: flex;
  gap: 4px;
}

.aisle {
  width: 40px;
}

.seat-cell {
  width: 120px;
  padding: 16px 10px;
  background: #F0F7FF;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover:not(.empty) {
    background: #E3F2FD;
    transform: scale(1.02);
  }

  &.empty {
    background: #F5F5F5;
    cursor: default;
  }

  &.selected {
    background: #BBDEFB;
    border-color: var(--color-secondary);

    .seat-checkbox {
      background: var(--color-secondary);
      color: white;
    }
  }
}

.seat-checkbox {
  display: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E0E0E0;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  margin: 0 auto 6px;
}

.seat-name {
  font-size: 20px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

.seat-score {
  font-size: 18px;
  color: #FF9800;
  margin-top: 4px;
}

// 底部工具栏
.bottom-toolbar {
  height: 90px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  &.multi-select-bar {
    gap: 30px;
    background: linear-gradient(90deg, #E3F2FD, #F3E5F5);
  }
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 50px;
  border-radius: 35px;
  font-size: 27px;
  color: #666;
  background: #F5F5F5;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #E8F4FD;
    color: var(--color-secondary);
  }

  &.primary {
    background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(74, 144, 217, 0.4);
    }
  }

  .tool-icon {
    font-size: 32px;
  }
}

.select-btn {
  padding: 14px 28px;
  border-radius: 24px;
  font-size: 22px;
  background: white;
  color: var(--color-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--color-secondary);
    color: white;
  }

  &.outline {
    border: 1px solid var(--color-secondary);
    background: transparent;
  }
}

.selected-count {
  font-size: 22px;
  color: #333;
  padding: 0 24px;

  strong {
    color: var(--color-secondary);
    font-size: 30px;
  }
}

.confirm-btn {
  padding: 16px 40px;
  border-radius: 28px;
  font-size: 24px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 144, 217, 0.4);
  }
}

.cancel-btn {
  padding: 14px 28px;
  border-radius: 24px;
  font-size: 22px;
  background: #F5F5F5;
  color: #666;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #E0E0E0;
  }
}

// 点评弹窗
.review-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.review-panel {
  width: 750px;
  max-height: 85vh;
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.review-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 36px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: white;
}

.review-panel-title {
  font-size: 33px;
  font-weight: bold;
}

.review-panel-close {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 32px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.review-panel-body {
  padding: 30px 36px;
  max-height: 55vh;
  overflow-y: auto;
}

.review-students {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.review-student-tag {
  padding: 10px 20px;
  background: #E8F4FD;
  color: var(--color-secondary);
  border-radius: 24px;
  font-size: 21px;
}

.dimension-section {
  margin-bottom: 24px;
}

.dimension-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.indicator-btn {
  padding: 16px 12px;
  border-radius: 14px;
  font-size: 21px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;

  &.positive {
    background: #E8F5E9;
    color: #2E7D32;

    &:hover, &.selected {
      background: #4CAF50;
      color: white;
      border-color: #2E7D32;
    }
  }

  &.negative {
    background: #FFF3E0;
    color: #E65100;

    &:hover, &.selected {
      background: #FF9800;
      color: white;
      border-color: #E65100;
    }
  }
}

.review-panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  padding: 24px 36px;
  background: #F8FAFC;
}

.btn-cancel {
  padding: 16px 40px;
  border-radius: 28px;
  font-size: 24px;
  background: #F5F5F5;
  color: #666;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #E0E0E0;
  }
}

.btn-confirm {
  padding: 16px 50px;
  border-radius: 28px;
  font-size: 24px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 144, 217, 0.4);
  }
}

// 小组编辑弹窗
.group-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.group-edit-panel {
  width: 500px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.group-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #FF9800, #FFB74D);
  color: white;
}

.group-edit-title {
  font-size: 22px;
  font-weight: bold;
}

.group-edit-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.group-edit-body {
  padding: 28px;
}

.edit-field {
  margin-bottom: 24px;
}

.edit-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.edit-input {
  width: 100%;
  height: 50px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 18px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #FF9800;
  }
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
}

.icon-option {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: #F5F5F5;

  &:hover {
    background: #FFF3E0;
    transform: scale(1.1);
  }

  &.selected {
    background: #FF9800;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4);
  }
}

.edit-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
}

.preview-label {
  font-size: 14px;
  color: #666;
}

.preview-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-icon {
  font-size: 24px;
}

.preview-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.group-edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  background: #F8FAFC;
}

.btn-save {
  padding: 12px 36px;
  border-radius: 25px;
  font-size: 16px;
  background: linear-gradient(135deg, #FF9800, #FFB74D);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
  }
}

// Toast
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 15px 40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 30px;
  font-size: 16px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 2000;

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
