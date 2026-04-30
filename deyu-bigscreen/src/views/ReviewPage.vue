<script setup lang="ts">
import { ref, computed } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'
import coinIcon from '@/assets/images/coin.svg'

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

// 行为指标维度（来自行为指标规则CSV）
const dimensions = [
  {
    name: '快乐',
    subtitle: '身心健康',
    icon: '😊',
    indicators: [
      { label: '保护自己，不做有危险的举动', type: 'positive', points: 1 },
      { label: '能判断他人的危险行为，并主动保持安全距离', type: 'positive', points: 1 },
      { label: '能合理判断自己的情绪状态', type: 'positive', points: 1 },
      { label: '不开心时不随便发泄负面情绪', type: 'positive', points: 1 },
      { label: '不挑食，按需打餐，尽量吃完所有食物', type: 'positive', points: 1 },
      { label: '每天在校至少喝 500ml 水', type: 'positive', points: 1 },
      { label: '认真参与眼保健操、课间操，动作标准规范', type: 'positive', points: 1 },
      { label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { label: '每天做一件让自己开心的事，经常面带笑容', type: 'positive', points: 2 },
      { label: '身体不舒服或情绪不好时，能主动向老师/家长求助', type: 'positive', points: 2 },
      { label: '大课间、小课间主动到室外跑跳、运动', type: 'positive', points: 2 },
      { label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { label: '长期坚持一项自己喜欢的体育运动，养成运动习惯', type: 'positive', points: 3, custom: true },
      { label: '体育运动长期坚持满 1 个月', type: 'positive', points: 5, custom: true },
      { label: '有自己特别感兴趣的事，长期坚持并从中获得快乐', type: 'positive', points: 3, custom: true },
      { label: '兴趣爱好长期坚持满 1 个月', type: 'positive', points: 5, custom: true },
      { label: '做出危险举动，未做好自我保护', type: 'negative', points: -2 },
      { label: '情节严重的危险举动/自我保护缺失行为', type: 'negative', points: -5 },
      { label: '主动靠近他人危险行为，未做好安全规避', type: 'negative', points: -2 },
      { label: '情节严重的违规靠近他人危险行为', type: 'negative', points: -5 },
      { label: '不开心时随意发泄情绪，影响他人', type: 'negative', points: -2 },
      { label: '情节严重的情绪发泄、攻击他人行为', type: 'negative', points: -5 },
      { label: '挑食、随意浪费食物', type: 'negative', points: -1 },
      { label: '在校每日饮水不足 500ml', type: 'negative', points: -1 },
      { label: '不认真参与校内 2 操，动作敷衍不标准', type: 'negative', points: -1 },
    ]
  },
  {
    name: '进取',
    subtitle: '创新素养',
    icon: '🚀',
    indicators: [
      { label: '按时完成所有作业', type: 'positive', points: 1 },
      { label: '上课遵守纪律，不影响其他同学学习', type: 'positive', points: 1 },
      { label: '课堂上主动举手回答问题，清晰表达自己的想法', type: 'positive', points: 1 },
      { label: '有清晰的目标意识，能给自己制定合理的短期计划', type: 'positive', points: 1 },
      { label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { label: '主动向老师提问，学会对知识点提出质疑', type: 'positive', points: 2 },
      { label: '面对有难度的任务不轻言放弃，愿意主动尝试', type: 'positive', points: 2 },
      { label: '能按轻重缓急给事情分类，科学分配自己的时间', type: 'positive', points: 2 },
      { label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { label: '主动从多个角度思考和解决问题', type: 'positive', points: 3 },
      { label: '发现学校/社区/社会可优化的地方，尝试用行动推动改变', type: 'positive', points: 3, custom: true },
      { label: '行为优化落地成果显著', type: 'positive', points: 5, custom: true },
      { label: '了解人工智能等最新科技发明，在生活/学习中寻找技术应用场景', type: 'positive', points: 3, custom: true },
      { label: '科技应用落地成果显著', type: 'positive', points: 5, custom: true },
      { label: '未按时完成作业，拖欠作业', type: 'negative', points: -2 },
      { label: '情节严重的作业拖欠/拒不完成行为', type: 'negative', points: -5 },
      { label: '上课扰乱课堂秩序，影响他人学习', type: 'negative', points: -2 },
      { label: '情节严重的课堂扰乱行为', type: 'negative', points: -5 },
      { label: '课堂上不主动发言，拒绝表达自己的想法', type: 'negative', points: -1 },
      { label: '无目标意识，不会制定短期学习/生活计划', type: 'negative', points: -1 },
    ]
  },
  {
    name: '儒雅',
    subtitle: '儒雅品格',
    icon: '📚',
    indicators: [
      { label: '不用言语、行为故意伤害他人', type: 'positive', points: 1 },
      { label: '不随意拿取别人物品、不破坏学校及公共财物', type: 'positive', points: 1 },
      { label: '衣着得体整洁，个人物品摆放有序', type: 'positive', points: 1 },
      { label: '见到师长主动问好，日常常用礼貌用语', type: 'positive', points: 1 },
      { label: '他人说话时能安静倾听，不随意打断', type: 'positive', points: 1 },
      { label: '在学校楼道和室内场所轻步慢走、不追逐打闹', type: 'positive', points: 1 },
      { label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { label: '与同学有小摩擦时能温和沟通，积极向老师寻求帮助', type: 'positive', points: 2 },
      { label: '同学遇到困难或情绪低落时，能主动关心并提供帮助', type: 'positive', points: 2 },
      { label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { label: '保持稳定的情绪状态，不会轻易被外界小事影响', type: 'positive', points: 3 },
      { label: '情绪稳定表现持续满 1 个月', type: 'positive', points: 5, custom: true },
      { label: '保持每天安静阅读的良好习惯', type: 'positive', points: 3 },
      { label: '每日阅读习惯持续满 1 个月', type: 'positive', points: 5, custom: true },
      { label: '懂得欣赏多样性，能倾听并包容不一样的想法', type: 'positive', points: 3 },
      { label: '包容差异、尊重他人表现持续满 1 个月', type: 'positive', points: 5, custom: true },
      { label: '用言语、行为故意伤害同学/他人', type: 'negative', points: -2 },
      { label: '情节严重的校园欺凌/伤害他人行为', type: 'negative', points: -5 },
      { label: '随意拿取他人物品、破坏公物/校园设施', type: 'negative', points: -2 },
      { label: '情节严重的盗窃/恶意破坏公物行为', type: 'negative', points: -5 },
      { label: '衣着不整洁、个人物品摆放杂乱无章', type: 'negative', points: -1 },
      { label: '见到师长不问好，日常不使用礼貌用语', type: 'negative', points: -1 },
      { label: '随意打断他人说话，不尊重发言者', type: 'negative', points: -1 },
      { label: '校内楼道、室内场所追逐打闹、不遵守公共秩序', type: 'negative', points: -1 },
    ]
  },
  {
    name: '大气',
    subtitle: '责任担当',
    icon: '💪',
    indicators: [
      { label: '升旗时主动行礼、大声唱国歌、全程肃立', type: 'positive', points: 1 },
      { label: '不损坏国旗、队旗，规范佩戴、爱护红领巾', type: 'positive', points: 1 },
      { label: '有集体荣誉感，积极参加集体活动，认真完成值日工作', type: 'positive', points: 1 },
      { label: '热爱学校，爱护校园的一草一木，不乱扔垃圾', type: 'positive', points: 1 },
      { label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { label: '遇事对人不斤斤计较，乐于分享自己的物品/知识', type: 'positive', points: 2 },
      { label: '主动为集体服务，为班级、学校做力所能及的事', type: 'positive', points: 2 },
      { label: '了解家乡的非遗、传统节日习俗或历史人物故事，并主动分享', type: 'positive', points: 2 },
      { label: '主动关心社会时事，对祖国发展与进步感到自豪', type: 'positive', points: 2 },
      { label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { label: '积极参与跨区域、跨国家的交流与学习，主动拓展视野', type: 'positive', points: 3, custom: true },
      { label: '跨文化交流学习成果显著', type: 'positive', points: 5, custom: true },
      { label: '积极传播本土先进文化，不盲目推崇他国文化', type: 'positive', points: 3, custom: true },
      { label: '本土文化传播成果显著', type: 'positive', points: 5, custom: true },
      { label: '升旗时不遵守礼仪，不行礼、不唱国歌、随意走动/说话', type: 'negative', points: -2 },
      { label: '情节严重的升旗礼仪违规行为', type: 'negative', points: -5 },
      { label: '损坏国旗、队旗、红领巾等标志，不规范佩戴红领巾', type: 'negative', points: -2 },
      { label: '情节严重的国旗/队旗/红领巾损毁行为', type: 'negative', points: -5 },
      { label: '无集体荣誉感，拒绝参与集体活动、不认真完成值日', type: 'negative', points: -1 },
      { label: '破坏校园环境、乱扔垃圾、损坏校园花草树木', type: 'negative', points: -1 },
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

// 点评弹窗维度Tab
const activeDimTab = ref(0)

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
  activeDimTab.value = 0
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
          :class="{ active: viewMode === 'all' }"
          @click="switchView('all')"
        >全部</button>
        <button
          class="view-tab"
          :class="{ active: viewMode === 'group' }"
          @click="switchView('group')"
        >小组</button>
        <button
          class="view-tab"
          :class="{ active: viewMode === 'seat' }"
          @click="switchView('seat')"
        >座位表</button>
      </div>
      <div class="time-filter">
        <button
          v-for="p in [{key:'day',label:'日榜'},{key:'week',label:'周榜'},{key:'month',label:'月榜'},{key:'semester',label:'学期榜'}]"
          :key="p.key"
          class="time-btn"
          :class="{ active: timePeriod === p.key }"
          @click="switchTime(p.key)"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="main-content" :class="{ 'multi-select-mode': multiSelectMode }">
      <!-- 小组视图 -->
      <div v-if="viewMode === 'group'" class="groups-grid">
        <div v-for="group in groups" :key="group.id" class="group-card">
          <div class="group-header">
            <span class="group-icon">{{ group.icon }}</span>
            <span class="group-name" @click.stop="openGroupEditModal(group)">{{ group.name }}（{{ group.students.length }}人）</span>
            <span class="group-score">{{ group.totalScore }} <img :src="coinIcon" class="coin" alt="coin" /></span>
            <button
              v-if="multiSelectMode"
              class="group-select-btn"
              :class="{ selected: isGroupSelected(group.id) }"
              @click="selectGroup(group.id)"
            >{{ isGroupSelected(group.id) ? '取消' : '全选' }}</button>
          </div>
          <div class="students-grid">
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
              <div class="student-name">{{ student.name }}</div>
              <div class="student-score">
                <span class="score-value">{{ student.score }}</span>
                <img :src="coinIcon" class="coin-s" alt="coin" />
              </div>
              <div
                v-if="getScoreAnimation(student.name)?.show"
                class="score-animation"
              >+{{ getScoreAnimation(student.name)?.points }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 全部学生视图 -->
      <div v-if="viewMode === 'all'" class="all-students-view">
        <div class="all-students-header">
          <span class="all-students-title">全班学生（共 {{ totalStudentCount }} 人）</span>
        </div>
        <div class="all-students-grid">
          <div
            v-for="student in allStudents"
            :key="student.name"
            class="student-card"
            :class="{
              selected: isStudentSelected(student.name),
              'has-animation': getScoreAnimation(student.name)?.show
            }"
            @click="handleStudentClick(student.name)"
          >
            <div class="student-name">{{ student.name }}</div>
            <div class="student-score">
              <span class="score-value">{{ student.score }}</span>
              <img :src="coinIcon" class="coin-s" alt="coin" />
            </div>
            <div
              v-if="getScoreAnimation(student.name)?.show"
              class="score-animation"
            >+{{ getScoreAnimation(student.name)?.points }}</div>
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
                    <div class="seat-name">{{ getSeatStudent(row - 1, col - 1)!.name }}</div>
                    <div class="seat-score">
                      <span>{{ getSeatStudent(row - 1, col - 1)!.score }}</span>
                      <img :src="coinIcon" class="coin-xs" alt="coin" />
                    </div>
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
                    <div class="seat-name">{{ getSeatStudent(row - 1, col + 1)!.name }}</div>
                    <div class="seat-score">
                      <span>{{ getSeatStudent(row - 1, col + 1)!.score }}</span>
                      <img :src="coinIcon" class="coin-xs" alt="coin" />
                    </div>
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
                    <div class="seat-name">{{ getSeatStudent(row - 1, col + 3)!.name }}</div>
                    <div class="seat-score">
                      <span>{{ getSeatStudent(row - 1, col + 3)!.score }}</span>
                      <img :src="coinIcon" class="coin-xs" alt="coin" />
                    </div>
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
      <button class="tool-btn primary" @click="enterMultiSelectMode">点评多人</button>
    </footer>

    <!-- 底部工具栏 - 多选模式 -->
    <footer v-else class="bottom-toolbar multi-select-bar">
      <button class="select-btn" @click="selectAllStudents">全选</button>
      <div class="selected-count">
        已选择 <strong>{{ selectedStudents.length }}</strong> 人
      </div>
      <button class="select-btn outline" @click="clearSelection">清空选择</button>
      <button class="confirm-btn" @click="confirmMultiReview">确认点评</button>
      <button class="cancel-btn" @click="exitMultiSelectMode">取消</button>
    </footer>

    <!-- 点评弹窗 -->
    <div v-if="showReviewModal" class="review-modal" @click="closeReviewModal">
      <div class="review-panel" @click.stop>
        <div class="review-panel-header">
          <h3 class="review-panel-title">学生点评</h3>
          <div class="review-students-inline">
            <span v-for="name in selectedStudents.slice(0, 5)" :key="name" class="review-student-tag">{{ name }}</span>
            <span v-if="selectedStudents.length > 5" class="review-student-tag more">+{{ selectedStudents.length - 5 }}人</span>
          </div>
          <button class="review-panel-close" @click="closeReviewModal">×</button>
        </div>
        <div class="review-panel-body">
          <!-- 维度Tab栏 -->
          <div class="dim-tabs">
            <button
              v-for="(dim, idx) in dimensions"
              :key="dim.name"
              class="dim-tab"
              :class="{ active: activeDimTab === idx }"
              @click="activeDimTab = idx"
            >
              <span class="dim-tab-icon">{{ dim.icon }}</span>
              <span class="dim-tab-name">{{ dim.name }}</span>
              <span class="dim-tab-sub">{{ dim.subtitle }}</span>
            </button>
          </div>

          <!-- 指标列表 -->
          <div class="indicator-list">
            <!-- 加分项 -->
            <div class="indicator-group-label positive-label">加分项</div>
            <div class="indicator-grid">
              <div
                v-for="ind in [...dimensions[activeDimTab].indicators.filter(i => i.type === 'positive' && i.custom), ...dimensions[activeDimTab].indicators.filter(i => i.type === 'positive' && !i.custom)]"
                :key="ind.label"
                class="indicator-block positive"
                :class="{ selected: isIndicatorSelected(ind.label) }"
                @click="toggleIndicator(ind.label)"
              >
                <span v-if="ind.custom" class="custom-tag">特色</span>
                <div class="block-text">{{ ind.label }}</div>
                <div class="block-score positive">+{{ ind.points }}</div>
              </div>
            </div>

            <!-- 扣分项 -->
            <div class="indicator-group-label negative-label">扣分项</div>
            <div class="indicator-grid">
              <div
                v-for="ind in [...dimensions[activeDimTab].indicators.filter(i => i.type === 'negative' && i.custom), ...dimensions[activeDimTab].indicators.filter(i => i.type === 'negative' && !i.custom)]"
                :key="ind.label"
                class="indicator-block negative"
                :class="{ selected: isIndicatorSelected(ind.label) }"
                @click="toggleIndicator(ind.label)"
              >
                <span v-if="ind.custom" class="custom-tag">特色</span>
                <div class="block-text">{{ ind.label }}</div>
                <div class="block-score negative">{{ ind.points }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="review-panel-footer">
          <div class="footer-summary" v-if="selectedIndicators.length > 0">
            已选 <strong>{{ selectedIndicators.length }}</strong> 项
          </div>
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
$primary: #EE595B;
$primary-bg: #FFDBDB;

.review-page {
  width: 1920px;
  height: 1080px;
  background: #FFF8F7;
  display: flex;
  flex-direction: column;
}

.sub-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 50px;
  flex-shrink: 0;
}

.view-tabs {
  display: flex;
  gap: 36px;
}

.view-tab {
  font-size: 22px;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  position: relative;
  font-weight: 500;
  transition: color 0.3s;

  &:hover { color: $primary; }

  &.active {
    color: $primary;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: $primary;
      border-radius: 2px;
    }
  }
}

.time-filter {
  display: flex;
  background: white;
  border-radius: 30px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.time-btn {
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 16px;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;

  &:hover { color: $primary; }

  &.active {
    background: $primary;
    color: white;
    font-weight: bold;
  }
}

.main-content {
  flex: 1;
  padding: 10px 50px 0;
  overflow-y: auto;

  &.multi-select-mode {
    .student-card, .mini-card, .seat-cell:not(.empty) {
      cursor: pointer;
    }
  }
}

// 小组视图
.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.group-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.group-icon {
  font-size: 26px;
  flex-shrink: 0;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.group-score {
  font-size: 18px;
  font-weight: bold;
  color: $primary;
  display: flex;
  align-items: center;
  gap: 4px;

  .coin { width: 20px; height: 20px; vertical-align: middle; }
}

.group-select-btn {
  margin-left: auto;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 15px;
  border: 1.5px solid $primary;
  background: white;
  color: $primary;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: rgba($primary, 0.08);
  }

  &.selected {
    background: rgba($primary, 0.08);
  }
}

// 学生网格
.students-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.student-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  background: white;
  border-radius: 12px;
  border: 1.5px solid #FFD6D6;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: $primary;
    background: #FFF5F5;
  }

  &.selected {
    border-color: $primary;
    background: #FFF0F0;
    box-shadow: 0 0 0 1px $primary;
  }

  &.has-animation {
    animation: cardPulse 0.5s ease-out;
    background: rgba(238, 89, 91, 0.08);
  }
}

.student-name {
  font-size: 17px;
  color: #333;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
}

.student-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;

  .score-value {
    font-size: 16px;
    color: $primary;
    font-weight: bold;
  }

  .coin-s { width: 16px; height: 16px; vertical-align: middle; }
}

// 加分动效
.score-animation {
  position: absolute;
  top: -10px;
  right: -6px;
  background: linear-gradient(135deg, #EE595B, #FF8A80);
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 12px;
  animation: scoreFloat 2s ease-out forwards;
  box-shadow: 0 2px 10px rgba(238, 89, 91, 0.4);
  z-index: 10;
}

@keyframes scoreFloat {
  0% { opacity: 0; transform: translateY(10px) scale(0.5); }
  20% { opacity: 1; transform: translateY(0) scale(1.2); }
  40% { transform: translateY(-5px) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
}

@keyframes cardPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(238, 89, 91, 0.3); }
  100% { transform: scale(1); }
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
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.all-students-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
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
  color: $primary;
  border: 1px solid $primary;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: $primary;
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
  padding: 12px 10px;
  background: white;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid #FFD6D6;

  &:hover:not(.empty) {
    border-color: $primary;
    background: #FFF5F5;
  }

  &.empty {
    background: #F5F5F5;
    border-color: transparent;
    cursor: default;
  }

  &.selected {
    border-color: $primary;
    background: #FFF0F0;
    box-shadow: 0 0 0 1px $primary;
  }
}

.seat-name {
  font-size: 17px;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  margin-bottom: 2px;
}

.seat-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 16px;
  color: $primary;
  font-weight: bold;
  margin-top: 2px;
}

.coin-xs {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

// 底部工具栏
.bottom-toolbar {
  height: 80px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  &.multi-select-bar {
    gap: 30px;
  }
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 200px;
  height: 63px;
  border-radius: 60px;
  font-size: 20px;
  color: #666;
  background: rgba(#FFDBDB, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(#FFDBDB, 0.7);
    color: $primary;
  }

  &.primary {
    width: 272px;
    height: 63px;
    border-radius: 60px;
    background: #EE595B;
    color: white;
    font-size: 20px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(#EE595B, 0.4);
    }
  }
}

.select-btn {
  padding: 14px 28px;
  border-radius: 24px;
  font-size: 18px;
  background: rgba(#FFDBDB, 0.4);
  color: $primary;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(#FFDBDB, 0.7);
  }

  &.outline {
    border: 1px solid $primary;
    background: transparent;
  }
}

.selected-count {
  font-size: 20px;
  color: #333;
  padding: 0 24px;

  strong {
    color: $primary;
    font-size: 28px;
  }
}

.confirm-btn {
  width: 272px;
  height: 63px;
  border-radius: 60px;
  font-size: 20px;
  background: #EE595B;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
  letter-spacing: 2px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(#EE595B, 0.4);
  }
}

.cancel-btn {
  padding: 14px 28px;
  border-radius: 24px;
  font-size: 18px;
  background: rgba(#FFDBDB, 0.4);
  color: $primary;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(#FFDBDB, 0.7);
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
  width: 80%;
  height: 80%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.review-panel-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 32px;
  background: $primary;
  color: white;
  flex-shrink: 0;
}

.review-panel-title {
  font-size: 26px;
  font-weight: bold;
  flex-shrink: 0;
}

.review-students-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.review-student-tag {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  font-size: 16px;
  white-space: nowrap;

  &.more {
    background: rgba(255, 255, 255, 0.3);
    font-weight: bold;
  }
}

.review-panel-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
  margin-left: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.review-panel-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 维度Tab
.dim-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #f0f0f0;
  flex-shrink: 0;
}

.dim-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  color: #999;
  font-size: 18px;

  &:hover {
    color: $primary;
    background: #FFF8F7;
  }

  &.active {
    color: $primary;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 20%;
      width: 60%;
      height: 3px;
      background: $primary;
      border-radius: 2px;
    }
  }
}

.dim-tab-icon {
  font-size: 22px;
}

.dim-tab-name {
  font-size: 20px;
  font-weight: 600;
}

.dim-tab-sub {
  font-size: 14px;
  opacity: 0.7;
}

// 指标列表
.indicator-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 32px;
}

.indicator-group-label {
  font-size: 15px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  margin: 12px 0 8px;

  &:first-child {
    margin-top: 0;
  }

  &.positive-label {
    background: #E8F5E9;
    color: #2E7D32;
  }

  &.negative-label {
    background: #FFF3E0;
    color: #E65100;
  }
}

.indicator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.indicator-block {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid #e8e8e8;
  background: #FAFAFA;

  &.positive {
    &:hover {
      border-color: #81C784;
      background: #F1F8E9;
    }

    &.selected {
      background: #E8F5E9;
      border-color: #4CAF50;
      box-shadow: 0 0 0 1px #4CAF50;
    }
  }

  &.negative {
    &:hover {
      border-color: #FFB74D;
      background: #FFF8E1;
    }

    &.selected {
      background: #FFF3E0;
      border-color: #FF9800;
      box-shadow: 0 0 0 1px #FF9800;
    }
  }
}

.block-text {
  flex: 1;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
}

.block-score {
  flex-shrink: 0;
  font-size: 16px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;

  &.positive {
    color: #2E7D32;
    background: #E8F5E9;
  }

  &.negative {
    color: #E65100;
    background: #FFF3E0;
  }

  .indicator-block.selected &.positive {
    background: #4CAF50;
    color: white;
  }

  .indicator-block.selected &.negative {
    background: #FF9800;
    color: white;
  }
}

.custom-tag {
  position: absolute;
  top: -6px;
  right: 8px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FF9800, #FFC107);
  padding: 1px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  line-height: 18px;
}

.review-panel-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
  padding: 20px 32px;
  background: #F8FAFC;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.footer-summary {
  margin-right: auto;
  font-size: 18px;
  color: #666;

  strong {
    color: $primary;
    font-size: 22px;
  }
}

.btn-cancel {
  padding: 14px 36px;
  border-radius: 28px;
  font-size: 20px;
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
  padding: 14px 44px;
  border-radius: 28px;
  font-size: 20px;
  background: $primary;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba($primary, 0.4);
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
