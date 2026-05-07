<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useVoiceReviewStore } from '@/stores/voiceReview'
import { useStudentsStore } from '@/stores/students'
import { useReviewStore } from '@/stores/review'
import { useUserStore } from '@/stores/user'
import { useWebSocket } from '@shared/composables'
import {
  analyzeInput, resolveFollowUp, resolveStudentChip, resolveIndicatorChip,
  parseVoiceReview, isClassWideIntent
} from '@/services/aiService'
import type { PendingContext, ChipOption, AnalysisResult, AIMessage } from '@/services/aiService'
import { MORAL_DIMENSION_INDICATORS } from '@shared/constants'
import type { VoiceReviewResult } from '@shared/types'
import aiRobotImg from '@/assets/images/ai-robot.png'
import aiAvatarImg from '@/assets/images/ai-avatar.png'

const voiceReviewStore = useVoiceReviewStore()
const studentsStore = useStudentsStore()
const reviewStore = useReviewStore()
const userStore = useUserStore()
const { connect, isConnected } = useWebSocket()


onMounted(() => {
  connect()
  // 自动发送 mock 消息
  setTimeout(() => {
    inputText.value = '全班上课认真，婉云主动举手'
    sendMessage()
  }, 800)
})

// ========== 类型 ==========
interface ReviewRow {
  id: string
  classId: string
  studentIds: string[]
  studentNames: string[]
  isClassWide: boolean
  indicatorId: string
  indicatorLabel: string
  indicatorDimension: string
  points: number
  isNegative: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  type: 'text' | 'review-card' | 'chips' | 'guidance'
  content: string
  timestamp: number
  reviewRows?: ReviewRow[]
  confirmed?: boolean
  discarded?: boolean
  chips?: ChipOption[]
}

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const chatAreaRef = ref<HTMLElement | null>(null)
const isRecording = ref(false)
const pendingCtx = ref<PendingContext | null>(null)

// 教师名
const teacherName = computed(() => userStore.teacher?.name || '老师')

// 当前班级的学生（用于 AI 分析）
const currentClassStudents = computed(() => {
  const classId = userStore.currentClassId || 'c1'
  const filtered = studentsStore.getStudentsByClass(classId)
  return filtered.length > 0 ? filtered : studentsStore.students
})

// 快捷建议
const quickSuggestions = [
  '同学们认真听讲，积极发言',
  '全班表现很好',
  '班级今日卫生非常干净',
]

// ========== 历史记录抽屉 ==========
const showHistoryDrawer = ref(false)
type DateRange = 'thisWeek' | 'lastWeek' | 'custom'
const activeDateRange = ref<DateRange>('thisWeek')
const customStartDate = ref('')
const customEndDate = ref('')

// Mock 历史数据（跨多天）
interface HistoryEntry {
  id: string
  date: Date
  userText: string
  studentName: string
  indicatorLabel: string
  dimension: string
  points: number
  isNegative: boolean
}

function generateMockHistory(): HistoryEntry[] {
  const now = new Date()
  const entries: HistoryEntry[] = []
  const names = ['徐婉云', '孙沐昀', '刘玥希', '毛昱涵', '李渡嘉', '张书斌', '马子扬', '程浩月']
  const indicators = [
    { label: '上课遵守纪律，不影响其他同学学习', dim: '进取（创新素养）', pts: 1 },
    { label: '课堂上主动举手回答问题，清晰表达自己的想法', dim: '进取（创新素养）', pts: 1 },
    { label: '按时完成所有作业', dim: '进取（创新素养）', pts: 1 },
    { label: '他人说话时能安静倾听，不随意打断', dim: '儒雅（儒雅品格）', pts: 1 },
    { label: '见到师长主动问好，常用礼貌用语', dim: '儒雅（儒雅品格）', pts: 1 },
    { label: '有集体荣誉感，积极参加集体活动，认真完成值日工作', dim: '大气（责任担当）', pts: 1 },
    { label: '认真参与眼保健操、课间操，动作标准规范', dim: '快乐（身心健康）', pts: 1 },
    { label: '上课扰乱课堂秩序，影响他人学习', dim: '进取（创新素养）', pts: -2 },
  ]
  const chatTexts = [
    '全班上课认真', '婉云主动举手', '沐昀作业完成很好',
    '玥希认真听讲', '全班表现不错', '书斌值日认真',
    '子扬上课积极发言', '昱涵课间操做得好', '渡嘉见到老师主动问好',
    '浩月上课说话了',
  ]

  // 生成过去 14 天的数据
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const day = new Date(now)
    day.setDate(day.getDate() - dayOffset)
    day.setHours(0, 0, 0, 0)

    // 每天 2~5 条
    const count = 2 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const h = 8 + Math.floor(Math.random() * 9)
      const m = Math.floor(Math.random() * 60)
      const date = new Date(day)
      date.setHours(h, m, 0, 0)

      const ind = indicators[Math.floor(Math.random() * indicators.length)]
      const name = names[Math.floor(Math.random() * names.length)]
      const chat = chatTexts[Math.floor(Math.random() * chatTexts.length)]

      entries.push({
        id: `hist_${dayOffset}_${i}`,
        date,
        userText: chat,
        studentName: ind.pts < 0 ? name : (Math.random() > 0.3 ? `全班16人` : name),
        indicatorLabel: ind.label,
        dimension: ind.dim,
        points: ind.pts,
        isNegative: ind.pts < 0
      })
    }
  }

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime())
}

const mockHistoryEntries = ref(generateMockHistory())

// 日期范围筛选
function getWeekRange(offset: number): [Date, Date] {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7 // 1=Mon..7=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1 + offset * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return [monday, sunday]
}

const filteredHistory = computed(() => {
  let start: Date
  let end: Date

  if (activeDateRange.value === 'thisWeek') {
    [start, end] = getWeekRange(0)
  } else if (activeDateRange.value === 'lastWeek') {
    [start, end] = getWeekRange(-1)
  } else {
    start = customStartDate.value ? new Date(customStartDate.value + 'T00:00:00') : new Date(0)
    end = customEndDate.value ? new Date(customEndDate.value + 'T23:59:59') : new Date()
  }

  return mockHistoryEntries.value.filter(e => e.date >= start && e.date <= end)
})

// 按天分组
interface DayGroup {
  dateLabel: string
  dateKey: string
  entries: HistoryEntry[]
}

const groupedHistory = computed<DayGroup[]>(() => {
  const map = new Map<string, HistoryEntry[]>()

  for (const entry of filteredHistory.value) {
    const d = entry.date
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(entry)
  }

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

  const groups: DayGroup[] = []
  for (const [key, entries] of map) {
    let label = key
    if (key === todayKey) label = '今天'
    else if (key === yesterdayKey) label = '昨天'
    else {
      const [, m, d] = key.split('-')
      label = `${parseInt(m)}月${parseInt(d)}日`
    }
    groups.push({ dateLabel: label, dateKey: key, entries: entries.sort((a, b) => b.date.getTime() - a.date.getTime()) })
  }

  return groups.sort((a, b) => b.dateKey.localeCompare(a.dateKey))
})

function formatHistoryTime(date: Date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// ========== 展开全部聊天弹窗 ==========
interface DayChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  time: string
}

const showDayChatModal = ref(false)
const dayChatLabel = ref('')
const dayChatMessages = ref<DayChatMessage[]>([])

// 根据当天的 history entries 生成模拟的完整对话
function openDayChat(group: DayGroup) {
  dayChatLabel.value = group.dateLabel
  const msgs: DayChatMessage[] = []

  // 按时间正序排列
  const sorted = [...group.entries].sort((a, b) => a.date.getTime() - b.date.getTime())

  for (const entry of sorted) {
    const time = formatHistoryTime(entry.date)
    // 用户消息
    msgs.push({
      id: `dc_user_${entry.id}`,
      role: 'user',
      content: entry.userText,
      time
    })
    // AI 回复
    const pts = entry.points > 0 ? `+${entry.points}` : `${entry.points}`
    msgs.push({
      id: `dc_ai_${entry.id}`,
      role: 'ai',
      content: `识别到：${entry.studentName} — ${entry.indicatorLabel}（${pts}分）`,
      time
    })
  }

  dayChatMessages.value = msgs
  showDayChatModal.value = true
}

// ========== 学生多选弹窗 ==========
const showStudentPicker = ref(false)

// 学生选择弹窗中展示的学生（按编辑行的班级过滤）
const pickerStudents = computed(() => {
  const classId = editingRowRef.value?.classId || userStore.currentClassId || 'c1'
  const filtered = studentsStore.getStudentsByClass(classId)
  return filtered.length > 0 ? filtered : studentsStore.students
})
const editingRowRef = ref<ReviewRow | null>(null)
const tempSelectedStudentIds = ref<string[]>([])

function openStudentPicker(row: ReviewRow) {
  editingRowRef.value = row
  tempSelectedStudentIds.value = [...row.studentIds]
  showStudentPicker.value = true
}

function toggleStudentInPicker(studentId: string) {
  const idx = tempSelectedStudentIds.value.indexOf(studentId)
  if (idx === -1) {
    tempSelectedStudentIds.value.push(studentId)
  } else {
    tempSelectedStudentIds.value.splice(idx, 1)
  }
}

function selectAllStudents() {
  // 如果有编辑中的行，使用该行班级的学生；否则用当前班级
  const classId = editingRowRef.value?.classId || userStore.currentClassId || 'c1'
  const classStudents = studentsStore.getStudentsByClass(classId)
  tempSelectedStudentIds.value = classStudents.length > 0
    ? classStudents.map(s => s.id)
    : studentsStore.students.map(s => s.id)
}

function clearStudentSelection() {
  tempSelectedStudentIds.value = []
}

function confirmStudentPicker() {
  // Pending 模式：从对话上下文解决
  if (!editingRowRef.value && pendingCtx.value) {
    showStudentPicker.value = false
    if (tempSelectedStudentIds.value.length === 0) return

    const selectedStudents = tempSelectedStudentIds.value.map(id => {
      const s = studentsStore.getStudentById(id)
      return s ? { id: s.id, name: s.name } : null
    }).filter(Boolean) as { id: string; name: string }[]

    const nameStr = selectedStudents.length > 2
      ? `${selectedStudents[0].name}等${selectedStudents.length}人`
      : selectedStudents.map(s => s.name).join('、')

    messages.value.push({
      id: `user_pick_${Date.now()}`, role: 'user', type: 'text',
      content: `选择了：${nameStr}`, timestamp: Date.now()
    })

    const isAll = tempSelectedStudentIds.value.length === pickerStudents.value.length

    if (pendingCtx.value.matchedIndicator) {
      // 指标已知 → 直接出卡片
      const ind = pendingCtx.value.matchedIndicator
      const result: AnalysisResult = {
        reviewRows: [{
          studentIds: [...tempSelectedStudentIds.value],
          studentNames: selectedStudents.map(s => s.name),
          isClassWide: isAll,
          indicatorId: ind.id,
          indicatorLabel: ind.label,
          indicatorDimension: ind.dimension,
          points: ind.points,
          isNegative: ind.type === 'negative'
        }],
        aiMessages: [{ type: 'text', content: '好的，识别到以下点评' }],
        pendingContext: null
      }
      applyAnalysisResult(result)
    } else {
      // 指标未知 → 接下来问指标
      pendingCtx.value = {
        type: 'need-indicator',
        originalText: pendingCtx.value.originalText,
        matchedStudents: selectedStudents.map(id => studentsStore.students.find(s => s.id === (id as any).id || s.name === (id as any).name)!).filter(Boolean),
        isClassWide: isAll
      }
      messages.value.push({
        id: `ai_ask_ind_${Date.now()}`, role: 'ai', type: 'text',
        content: `好的，${nameStr}。具体是什么方面的表现呢？`, timestamp: Date.now()
      })
      messages.value.push({
        id: `ai_chips_ind_${Date.now()}`, role: 'ai', type: 'chips',
        content: '', timestamp: Date.now(),
        chips: [{ label: '选择指标', value: 'pick-indicator', type: 'action' }]
      })
      scrollToBottom()
    }
    return
  }

  // 正常模式：编辑已有行
  if (!editingRowRef.value) return
  const row = editingRowRef.value
  row.studentIds = [...tempSelectedStudentIds.value]
  row.studentNames = tempSelectedStudentIds.value.map(id => {
    const s = studentsStore.getStudentById(id)
    return s?.name || id
  })
  row.isClassWide = tempSelectedStudentIds.value.length === pickerStudents.value.length
  showStudentPicker.value = false
  editingRowRef.value = null
}

// ========== 指标选择弹窗 ==========
const showIndicatorPicker = ref(false)
const indicatorEditingRow = ref<ReviewRow | null>(null)

function openIndicatorPicker(row: ReviewRow) {
  indicatorEditingRow.value = row
  showIndicatorPicker.value = true
}

function selectIndicator(dimKey: string, ind: { id: string; label: string; points: number; type: string }) {
  // Pending 模式
  if (!indicatorEditingRow.value && pendingCtx.value) {
    showIndicatorPicker.value = false

    messages.value.push({
      id: `user_pick_ind_${Date.now()}`, role: 'user', type: 'text',
      content: `选择了：${ind.label}`, timestamp: Date.now()
    })

    const result = resolveIndicatorChip(ind.id, currentClassStudents.value, pendingCtx.value)
    if (result) {
      applyAnalysisResult(result)
    } else if (pendingCtx.value.type === 'need-both' || !pendingCtx.value.matchedStudents?.length) {
      // 有指标但没学生 → 问学生
      pendingCtx.value = {
        type: 'need-student',
        originalText: pendingCtx.value.originalText,
        matchedIndicator: { id: ind.id, label: ind.label, dimension: dimKey, points: ind.points, type: ind.type as 'positive' | 'negative' }
      }
      messages.value.push({
        id: `ai_ask_stu_${Date.now()}`, role: 'ai', type: 'text',
        content: `好的，"${ind.label}"。请问是哪位同学？`, timestamp: Date.now()
      })
      messages.value.push({
        id: `ai_chips_stu_${Date.now()}`, role: 'ai', type: 'chips',
        content: '', timestamp: Date.now(),
        chips: [
          { label: '全班同学', value: 'whole-class', type: 'action' },
          { label: '选择同学', value: 'pick-student', type: 'action' }
        ]
      })
      scrollToBottom()
    }
    return
  }

  // 正常模式
  if (!indicatorEditingRow.value) return
  const row = indicatorEditingRow.value
  row.indicatorId = ind.id
  row.indicatorLabel = ind.label
  row.indicatorDimension = dimKey
  row.points = ind.points
  row.isNegative = ind.type === 'negative'
  showIndicatorPicker.value = false
  indicatorEditingRow.value = null
}

// ========== 辅助函数 ==========
function formatStudentDisplay(row: ReviewRow): string {
  if (row.isClassWide) {
    return `全班${row.studentIds.length}人`
  }
  if (row.studentIds.length === 0) return '未选择'
  if (row.studentIds.length === 1) return row.studentNames[0]
  return `${row.studentNames[0]}等${row.studentIds.length}人`
}

function getDimensionName(key: string) {
  return MORAL_DIMENSION_INDICATORS.find(d => d.key === key)?.name || key
}

// 获取班级名称
function getClassName(classId: string): string {
  const cls = userStore.teacher?.classes.find(c => c.id === classId)
  return cls?.name || classId
}

// 切换点评行的班级
function changeRowClass(row: ReviewRow, e: Event) {
  const newClassId = (e.target as HTMLSelectElement).value
  row.classId = newClassId
  // 如果是全班点评，更新学生列表为该班级的学生
  if (row.isClassWide) {
    const classStudents = studentsStore.getStudentsByClass(newClassId)
    row.studentIds = classStudents.map(s => s.id)
    row.studentNames = classStudents.map(s => s.name)
  }
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function scrollToBottom() {
  nextTick(() => {
    if (chatAreaRef.value) {
      chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
    }
  })
}


// ========== 语音/快捷 ==========
function toggleRecording() {
  isRecording.value = !isRecording.value
  if (!isRecording.value && inputText.value.trim()) {
    sendMessage()
  }
}

function useSuggestion(text: string) {
  inputText.value = text
  sendMessage()
}

// ========== 发送消息 ==========
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  messages.value.push({
    id: `user_${Date.now()}`, role: 'user', type: 'text',
    content: text, timestamp: Date.now()
  })
  inputText.value = ''
  scrollToBottom()

  await new Promise(resolve => setTimeout(resolve, 600))

  // 判断是否有待跟进的上下文（使用当前班级学生）
  const students = currentClassStudents.value
  let result: AnalysisResult
  if (pendingCtx.value) {
    result = resolveFollowUp(text, students, pendingCtx.value)
  } else {
    result = analyzeInput(text, students)
  }

  applyAnalysisResult(result)
}

/**
 * 将分析结果转化为聊天消息
 */
function applyAnalysisResult(result: AnalysisResult) {
  const now = Date.now()

  // 更新 pending 上下文
  pendingCtx.value = result.pendingContext

  // 渲染 AI 消息
  for (let i = 0; i < result.aiMessages.length; i++) {
    const msg = result.aiMessages[i]
    const ts = now + i

    if (msg.type === 'text') {
      messages.value.push({
        id: `ai_text_${ts}`, role: 'ai', type: 'text',
        content: msg.content, timestamp: ts
      })
    } else if (msg.type === 'guidance') {
      messages.value.push({
        id: `ai_guide_${ts}`, role: 'ai', type: 'guidance',
        content: msg.content, timestamp: ts
      })
    } else if (msg.type === 'chips' && msg.chips) {
      messages.value.push({
        id: `ai_chips_${ts}`, role: 'ai', type: 'chips',
        content: msg.content, timestamp: ts,
        chips: msg.chips
      })
    }
  }

  // 渲染点评卡片
  if (result.reviewRows.length > 0) {
    const defaultClassId = userStore.currentClassId || userStore.homeroomClasses[0]?.id || 'c1'
    const reviewRows: ReviewRow[] = result.reviewRows.map(r => ({
      id: `row_${now}_${Math.random().toString(36).substr(2, 6)}`,
      classId: defaultClassId,
      ...r
    }))
    messages.value.push({
      id: `ai_card_${now}`, role: 'ai', type: 'review-card',
      content: '', timestamp: now + result.aiMessages.length,
      reviewRows,
      confirmed: false
    })
  }

  scrollToBottom()
}

/**
 * 处理用户点击建议 chip
 */
function handleChipClick(chip: ChipOption) {
  const now = Date.now()

  if (chip.type === 'student' && pendingCtx.value) {
    // 点击学生名 → 直接解决
    messages.value.push({
      id: `user_chip_${now}`, role: 'user', type: 'text',
      content: chip.label, timestamp: now
    })
    const result = resolveStudentChip(chip.value, currentClassStudents.value, pendingCtx.value)
    if (result) {
      applyAnalysisResult(result)
    }
    return
  }

  if (chip.type === 'indicator' && pendingCtx.value) {
    // 点击指标 → 直接解决
    messages.value.push({
      id: `user_chip_${now}`, role: 'user', type: 'text',
      content: chip.label, timestamp: now
    })
    const result = resolveIndicatorChip(chip.value, currentClassStudents.value, pendingCtx.value)
    if (result) {
      applyAnalysisResult(result)
    }
    return
  }

  if (chip.type === 'action') {
    if (chip.value === 'pick-student') {
      // 打开学生选择弹窗（特殊模式 — 选完后提交）
      openStudentPickerForPending()
      return
    }
    if (chip.value === 'pick-indicator') {
      // 打开指标选择弹窗
      openIndicatorPickerForPending()
      return
    }
    if (chip.value === 'whole-class' && pendingCtx.value) {
      messages.value.push({
        id: `user_chip_${now}`, role: 'user', type: 'text',
        content: '全班同学', timestamp: now
      })
      // 用当前班级全班解决
      if (pendingCtx.value.matchedIndicator) {
        const ind = pendingCtx.value.matchedIndicator
        const classId = userStore.currentClassId || 'c1'
        const classStudents = studentsStore.getStudentsByClass(classId)
        const allStudents = classStudents.length > 0 ? classStudents : studentsStore.students
        const result: AnalysisResult = {
          reviewRows: [{
            studentIds: allStudents.map(s => s.id),
            studentNames: allStudents.map(s => s.name),
            isClassWide: true,
            indicatorId: ind.id,
            indicatorLabel: ind.label,
            indicatorDimension: ind.dimension,
            points: ind.points,
            isNegative: ind.type === 'negative'
          }],
          aiMessages: [{ type: 'text', content: '好的，识别到以下点评' }],
          pendingContext: null
        }
        applyAnalysisResult(result)
      }
      return
    }
    if (chip.value === 'pick-both') {
      openStudentPickerForPending()
      return
    }
    if (chip.value === 'custom-indicator') {
      openIndicatorPickerForPending()
      return
    }
  }
}

// 从 pending 上下文打开学生选择弹窗
function openStudentPickerForPending() {
  tempSelectedStudentIds.value = []
  showStudentPicker.value = true
  // confirmStudentPicker 会被调用，需要特殊处理
  editingRowRef.value = null // 标记为 pending 模式
}

// 从 pending 上下文打开指标选择弹窗
function openIndicatorPickerForPending() {
  indicatorEditingRow.value = null // 标记为 pending 模式
  showIndicatorPicker.value = true
}

// ========== 提交 ==========
function handleConfirmSubmit(msgId: string) {
  const msg = messages.value.find(m => m.id === msgId)
  if (!msg?.reviewRows || msg.confirmed) return

  const validRows = msg.reviewRows.filter(r => r.studentIds.length > 0)
  if (validRows.length === 0) {
    alert('没有有效的点评记录')
    return
  }

  // 展开每行 → 每个学生一条 VoiceReviewResult
  const allResults: VoiceReviewResult[] = []
  for (const row of validRows) {
    for (const sid of row.studentIds) {
      const s = studentsStore.getStudentById(sid)
      allResults.push({
        id: `vr_${Date.now()}_${sid}_${row.indicatorId}`,
        studentName: s?.name || sid,
        studentId: sid,
        indicator: {
          id: row.indicatorId,
          label: row.indicatorLabel,
          dimension: row.indicatorDimension,
          points: row.points
        },
        isNegative: row.isNegative
      })
    }
  }

  voiceReviewStore.parsedResults = allResults
  const success = voiceReviewStore.confirmAll()

  if (success) {
    msg.confirmed = true
    const now = Date.now()

    messages.value.push({
      id: `ai_done_${now}`, role: 'ai', type: 'text',
      content: `已成功提交 ${allResults.length} 条点评并同步到大屏！`,
      timestamp: now
    })
    scrollToBottom()
  }
}

function handleDiscardReview(msgId: string) {
  const msg = messages.value.find(m => m.id === msgId)
  if (!msg?.reviewRows || msg.confirmed) return
  msg.confirmed = true
  ;(msg as any).discarded = true
  messages.value.push({
    id: `ai_discard_${Date.now()}`, role: 'ai', type: 'text',
    content: '已放弃本次点评。', timestamp: Date.now()
  })
  scrollToBottom()
}
</script>

<template>
  <div class="voice-review-page">
    <PageHeader title="AI点评助手" :show-back="false" :right-slot="false" />

    <div class="page-body">
      <!-- 左侧：聊天区域 -->
      <div class="chat-panel">
        <div ref="chatAreaRef" class="chat-area">
          <!-- 欢迎横幅 -->
          <div class="welcome-banner">
            <div class="welcome-left">
              <div class="welcome-title">你好！我是AI德育助手</div>
              <div class="welcome-sub">当前班级：{{ userStore.currentClass?.name || '未选择' }} · 请描述学生的表现，我会自动识别并记录</div>
            </div>
            <div class="welcome-right">
              <div
                class="history-link"
                @click="showHistoryDrawer = true"
              >
                历史记录 ›
              </div>
            </div>
            <img :src="aiRobotImg" alt="AI助手" class="welcome-robot" />
          </div>

          <!-- 猜你想说 -->
          <div class="suggestions-section">
            <div class="suggestions-title">💡 猜你想说</div>
            <div class="suggestions-list">
              <div
                v-for="(s, i) in quickSuggestions"
                :key="i"
                class="suggestion-chip"
                @click="useSuggestion(s)"
              >
                <span class="chip-icon">✨</span>
                <span class="chip-text">{{ s }}</span>
                <span class="chip-arrow">›</span>
              </div>
            </div>
          </div>

          <!-- 聊天消息 -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message"
            :class="msg.role"
          >
            <!-- 用户消息 -->
            <template v-if="msg.role === 'user'">
              <div class="msg-meta user-meta">
                <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
                <span class="msg-name">{{ teacherName }}</span>
                <div class="user-avatar-circle">{{ teacherName[0] }}</div>
              </div>
              <div class="bubble user-bubble">
                <div class="bubble-text">{{ msg.content }}</div>
              </div>
            </template>

            <!-- AI消息 -->
            <template v-else>
              <div class="msg-meta ai-meta">
                <img :src="aiAvatarImg" alt="AI" class="ai-avatar-img" />
                <span class="msg-name ai-name">AI德育助手</span>
                <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
              </div>

              <!-- 文字消息 -->
              <div v-if="msg.type === 'text'" class="bubble ai-bubble">
                <div class="bubble-text">{{ msg.content }}</div>
              </div>

              <!-- 德育指导建议 -->
              <div v-else-if="msg.type === 'guidance'" class="guidance-bubble">
                <div class="guidance-icon">💡</div>
                <div class="guidance-content">
                  <div class="guidance-title">德育建议</div>
                  <div class="guidance-text">{{ msg.content }}</div>
                </div>
              </div>

              <!-- 建议选项 chips -->
              <div v-else-if="msg.type === 'chips' && msg.chips" class="chips-wrap">
                <div
                  v-for="chip in msg.chips"
                  :key="chip.value"
                  class="ai-chip"
                  :class="chip.type"
                  @click="handleChipClick(chip)"
                >
                  {{ chip.label }}
                </div>
              </div>

              <!-- 点评卡片 -->
              <div v-else-if="msg.type === 'review-card' && msg.reviewRows" class="review-card-wrap">
                <div class="review-card" :class="{ discarded: msg.discarded }">
                  <div class="card-header">
                    <span class="card-icon">📋</span>
                    <span class="card-title">点评明细</span>
                  </div>

                  <!-- 表头 -->
                  <div class="review-row review-row-header">
                    <div class="review-row-class">班级</div>
                    <div class="review-row-student">学生</div>
                    <div class="review-row-indicator">行为指标</div>
                    <div class="review-row-points">分值</div>
                  </div>

                  <div
                    v-for="row in msg.reviewRows"
                    :key="row.id"
                    class="review-row"
                  >
                    <div class="review-row-class">
                      <select
                        v-if="!msg.confirmed"
                        class="class-select"
                        :value="row.classId"
                        @change="changeRowClass(row, $event)"
                      >
                        <option
                          v-for="cls in userStore.teacher?.classes || []"
                          :key="cls.id"
                          :value="cls.id"
                        >
                          {{ cls.name }}
                        </option>
                      </select>
                      <span v-else class="class-label">{{ getClassName(row.classId) }}</span>
                    </div>
                    <div
                      class="review-row-student"
                      @click="!msg.confirmed && openStudentPicker(row)"
                    >
                      <span class="review-student-name">{{ formatStudentDisplay(row) }}</span>
                      <span v-if="!msg.confirmed" class="review-dropdown-icon">▾</span>
                    </div>
                    <div
                      class="review-row-indicator"
                      @click="!msg.confirmed && openIndicatorPicker(row)"
                    >
                      <span class="review-indicator-text">{{ row.indicatorLabel }}</span>
                      <span v-if="!msg.confirmed" class="review-dropdown-icon">▾</span>
                    </div>
                    <div class="review-row-points" :class="{ negative: row.points < 0 }">
                      {{ row.points > 0 ? '+' : '' }}{{ row.points }} 🪙
                    </div>
                  </div>

                  <div v-if="!msg.confirmed" class="card-actions">
                    <button class="btn-discard" @click="handleDiscardReview(msg.id)">放弃</button>
                    <button class="btn-confirm" @click="handleConfirmSubmit(msg.id)">确定</button>
                  </div>
                  <div v-else-if="msg.discarded" class="discarded-badge">已放弃</div>
                  <div v-else class="confirmed-badge">✅ 已提交</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 底部吸底输入区 -->
        <div class="input-bar">
          <div
            class="voice-btn touch-active"
            :class="{ recording: isRecording }"
            @click="toggleRecording"
          >
            <span class="voice-icon">🎙️</span>
          </div>
          <input
            v-model="inputText"
            type="text"
            class="chat-input"
            placeholder="描述学生表现，或按住语音输入..."
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" @click="sendMessage">发送</button>
        </div>
      </div>

    </div>

    <!-- 历史记录抽屉 -->
    <Teleport to="body">
      <div v-if="showHistoryDrawer" class="drawer-overlay" @click="showHistoryDrawer = false">
        <div class="history-drawer" @click.stop>
          <div class="drawer-header">
            <span class="drawer-title">📋 历史评价记录</span>
            <button class="drawer-close" @click="showHistoryDrawer = false">×</button>
          </div>

          <!-- 日期范围选择 -->
          <div class="date-range-bar">
            <div
              class="range-tab"
              :class="{ active: activeDateRange === 'thisWeek' }"
              @click="activeDateRange = 'thisWeek'"
            >本周</div>
            <div
              class="range-tab"
              :class="{ active: activeDateRange === 'lastWeek' }"
              @click="activeDateRange = 'lastWeek'"
            >上周</div>
            <div
              class="range-tab"
              :class="{ active: activeDateRange === 'custom' }"
              @click="activeDateRange = 'custom'"
            >自定义</div>

            <div v-if="activeDateRange === 'custom'" class="custom-dates">
              <input v-model="customStartDate" type="date" class="date-input" />
              <span class="date-sep">—</span>
              <input v-model="customEndDate" type="date" class="date-input" />
            </div>
          </div>

          <div class="drawer-stats">
            共 <strong>{{ filteredHistory.length }}</strong> 条记录
          </div>

          <!-- 按天分组列表 -->
          <div class="drawer-body">
            <div v-if="groupedHistory.length === 0" class="drawer-empty">
              <div class="empty-icon">📋</div>
              <div class="empty-text">该时间段暂无记录</div>
            </div>

            <div v-for="group in groupedHistory" :key="group.dateKey" class="day-group">
              <div class="day-header">
                <span class="day-label">{{ group.dateLabel }}</span>
                <span class="day-chat-expand" @click="openDayChat(group)">展开全部聊天</span>
                <span class="day-count">{{ group.entries.length }}条</span>
              </div>
              <div class="day-entries">
                <div
                  v-for="entry in group.entries"
                  :key="entry.id"
                  class="history-entry"
                  :class="{ negative: entry.isNegative }"
                >
                  <div class="entry-time">{{ formatHistoryTime(entry.date) }}</div>
                  <div class="entry-main">
                    <div class="entry-chat">
                      <span class="entry-chat-label">💬</span>
                      <span class="entry-chat-text">"{{ entry.userText }}"</span>
                    </div>
                    <div class="entry-result">
                      <span class="entry-student">{{ entry.studentName }}</span>
                      <span class="entry-indicator">{{ entry.indicatorLabel }}</span>
                      <span class="entry-points" :class="{ negative: entry.isNegative }">
                        {{ entry.points > 0 ? '+' : '' }}{{ entry.points }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 当天全部聊天弹窗 -->
    <Teleport to="body">
      <div v-if="showDayChatModal" class="picker-overlay" @click="showDayChatModal = false">
        <div class="day-chat-dialog" @click.stop>
          <div class="picker-header">
            <span class="picker-title">{{ dayChatLabel }} 全部对话</span>
            <button class="indicator-close" @click="showDayChatModal = false">×</button>
          </div>
          <div class="day-chat-body">
            <div
              v-for="msg in dayChatMessages"
              :key="msg.id"
              class="day-chat-msg"
              :class="msg.role"
            >
              <div class="day-chat-time">{{ msg.time }}</div>
              <div class="day-chat-bubble" :class="msg.role">
                <span v-if="msg.role === 'ai'" class="day-chat-role-tag">AI</span>
                {{ msg.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 学生多选弹窗 -->
    <Teleport to="body">
      <div v-if="showStudentPicker" class="picker-overlay" @click="showStudentPicker = false">
        <div class="picker-dialog" @click.stop>
          <div class="picker-header">
            <span class="picker-title">选择学生</span>
            <div class="picker-quick-actions">
              <span class="quick-action" @click="selectAllStudents">全选</span>
              <span class="quick-action" @click="clearStudentSelection">清空</span>
            </div>
          </div>
          <div class="picker-count">已选 {{ tempSelectedStudentIds.length }} 人</div>
          <div class="picker-grid">
            <div
              v-for="student in pickerStudents"
              :key="student.id"
              class="picker-item"
              :class="{ selected: tempSelectedStudentIds.includes(student.id) }"
              @click="toggleStudentInPicker(student.id)"
            >
              <div class="picker-avatar">{{ student.name[0] }}</div>
              <span class="picker-name">{{ student.name }}</span>
              <span v-if="tempSelectedStudentIds.includes(student.id)" class="picker-check">✓</span>
            </div>
          </div>
          <div class="picker-footer">
            <button class="picker-btn-cancel" @click="showStudentPicker = false">取消</button>
            <button class="picker-btn-confirm" @click="confirmStudentPicker">确定</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 指标选择弹窗 -->
    <Teleport to="body">
      <div v-if="showIndicatorPicker" class="picker-overlay" @click="showIndicatorPicker = false">
        <div class="indicator-dialog" @click.stop>
          <div class="picker-header">
            <span class="picker-title">选择行为指标</span>
            <button class="indicator-close" @click="showIndicatorPicker = false">×</button>
          </div>
          <div class="indicator-body">
            <div
              v-for="dim in MORAL_DIMENSION_INDICATORS"
              :key="dim.key"
              class="indicator-dim"
            >
              <div class="dim-header">
                <span class="dim-icon">{{ dim.icon }}</span>
                <span class="dim-name">{{ dim.name }}</span>
              </div>
              <div class="dim-indicators">
                <div
                  v-for="ind in dim.indicators"
                  :key="ind.id"
                  class="dim-indicator-item"
                  :class="{
                    positive: ind.type === 'positive',
                    negative: ind.type === 'negative',
                    active: indicatorEditingRow?.indicatorId === ind.id
                  }"
                  @click="selectIndicator(dim.key, ind)"
                >
                  <span class="ind-label">{{ ind.label }}</span>
                  <span class="ind-points" :class="ind.type">
                    {{ ind.points > 0 ? '+' : '' }}{{ ind.points }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

$purple: #7C5CFC;
$purple-light: #A78BFA;
$purple-bg: #EDE9FE;
$purple-gradient: linear-gradient(135deg, #7C5CFC, #A78BFA);

.voice-review-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $gray-100;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ws-status {
  padding: 6px 12px;
  background: #FFEBEE;
  border-radius: $radius-full;
  font-size: 12px;
  color: $danger;

  &.connected {
    background: #E8F5E9;
    color: $success;
  }
}

// ========== 页面主体 ==========
.page-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

// ========== 左侧聊天面板 ==========
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;

  @media (min-width: $breakpoint-md) {
    padding: 24px 32px;
  }
}

// ========== 欢迎横幅 ==========
.welcome-banner {
  background: linear-gradient(135deg, #E8E0FF 0%, #D4E4FF 50%, #E0F0FF 100%);
  border-radius: 20px;
  padding: 24px 28px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  min-height: 100px;
}

.welcome-left {
  flex: 1;
  z-index: 1;
}

.welcome-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.welcome-sub {
  font-size: 14px;
  color: #555;
}

.welcome-right {
  flex-shrink: 0;
  z-index: 1;
}

.history-link {
  font-size: 14px;
  color: $purple;
  font-weight: 500;
  cursor: pointer;
  padding: 7px 18px;
  border-radius: $radius-full;
  border: 1.5px solid rgba($purple, 0.35);
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;

  &:hover {
    color: white;
    background: $purple;
    border-color: $purple;
  }
}

.welcome-robot {
  position: absolute;
  right: 140px;
  top: 50%;
  transform: translateY(-50%);
  height: 110px;
  object-fit: contain;
  pointer-events: none;
}

// ========== 猜你想说 ==========
.suggestions-section {
  margin-bottom: 24px;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  color: $purple;
  margin-bottom: 12px;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 1px solid #E8E0FF;
  border-radius: $radius-full;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: $purple-bg;
    border-color: $purple-light;
  }
}

.chip-icon { font-size: 14px; }
.chip-text { white-space: nowrap; }
.chip-arrow { color: #bbb; font-size: 16px; }

// ========== 消息 ==========
.message {
  margin-bottom: 20px;

  &.user {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &.ai {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.msg-time { font-size: 12px; color: #999; }
.msg-name { font-size: 13px; font-weight: 500; color: #333; }
.ai-name { color: $purple; font-weight: 600; }

.user-avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E8E0FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: $purple;
  font-weight: 600;
}

.ai-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

// ========== 气泡 ==========
.bubble {
  max-width: 80%;
  padding: 14px 20px;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.6;
}

.user-bubble {
  background: $purple-gradient;
  color: white;
  border-top-right-radius: 6px;
}

.ai-bubble {
  background: #F0ECFF;
  color: #333;
  border-top-left-radius: 6px;
}

.bubble-text { white-space: pre-wrap; }

// ========== 点评卡片 ==========
.review-card-wrap {
  max-width: 92%;
  width: 100%;
}

.review-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.card-icon { font-size: 18px; }
.card-title { font-size: 16px; font-weight: 600; color: #333; }

.review-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  &:last-of-type { margin-bottom: 0; }

  &.review-row-header {
    margin-bottom: 4px;

    .review-row-class,
    .review-row-student,
    .review-row-indicator,
    .review-row-points {
      font-size: 12px;
      font-weight: 600;
      color: #999;
      background: none;
      border: none;
      padding: 4px 6px;
      cursor: default;

      &:hover { background: none; border: none; }
    }
  }
}

.review-row-class {
  min-width: 100px;
  flex-shrink: 0;
}

.class-select {
  width: 100%;
  padding: 7px 24px 7px 10px;
  background: #F8F8FA url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 8px center;
  border: 1px solid #E8E8EB;
  border-radius: 10px;
  font-size: 13px;
  color: #333;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: $purple-light; background-color: $purple-bg; }
  &:focus { outline: none; border-color: $purple-light; }
}

.class-label {
  font-size: 13px;
  color: #333;
  padding: 7px 10px;
  display: block;
}

.review-row-student {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #F8F8FA;
  border: 1px solid #E8E8EB;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  min-width: 90px;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover { border-color: $purple-light; background: $purple-bg; }
}

.review-student-name { font-weight: 500; white-space: nowrap; }
.review-dropdown-icon { color: #bbb; font-size: 12px; margin-left: auto; }

.review-row-indicator {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #F8F8FA;
  border: 1px solid #E8E8EB;
  border-radius: 10px;
  font-size: 14px;
  color: #555;
  min-width: 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: $purple-light; background: $purple-bg; }
}

.review-indicator-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-row-points {
  font-size: 16px;
  font-weight: 700;
  color: $purple;
  white-space: nowrap;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;

  &.negative { color: $danger; }
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-discard {
  padding: 10px 36px;
  background: white;
  color: #999;
  border: 1px solid #ddd;
  border-radius: $radius-full;
  font-size: 15px;
  cursor: pointer;

  &:hover { background: #f5f5f5; color: #666; }
}

.btn-confirm {
  padding: 10px 48px;
  background: $purple-gradient;
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba($purple, 0.3);
  }
}

.confirmed-badge {
  text-align: center;
  margin-top: 12px;
  padding: 10px;
  color: $success;
  font-weight: 600;
  font-size: 15px;
}

.discarded-badge {
  text-align: center;
  margin-top: 12px;
  padding: 10px;
  color: #bbb;
  font-weight: 500;
  font-size: 14px;
}

// 放弃状态：整卡置灰
.review-card.discarded {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.6);
}

// ========== 德育指导建议气泡 ==========
.guidance-bubble {
  display: flex;
  gap: 12px;
  max-width: 90%;
  padding: 16px 20px;
  background: linear-gradient(135deg, #FFF8E1, #FFF3E0);
  border: 1px solid #FFE0B2;
  border-radius: 16px;
  border-top-left-radius: 6px;
}

.guidance-icon {
  font-size: 22px;
  flex-shrink: 0;
  line-height: 1;
}

.guidance-content {
  flex: 1;
  min-width: 0;
}

.guidance-title {
  font-size: 13px;
  font-weight: 700;
  color: #E65100;
  margin-bottom: 6px;
}

.guidance-text {
  font-size: 13px;
  color: #5D4037;
  line-height: 1.7;
  white-space: pre-line;
}

// ========== 建议 chips ==========
.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 90%;
  padding: 4px 0;
}

.ai-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #E8E0FF;
  background: white;
  color: $purple;
  font-weight: 500;

  &:hover {
    background: $purple-bg;
    border-color: $purple-light;
  }

  &.action {
    background: $purple-bg;
    border-color: $purple-light;
    color: $purple;

    &:hover {
      background: $purple;
      color: white;
    }
  }

  &.student {
    background: #F3E8FF;
    border-color: #D8B4FE;
    color: #7C3AED;

    &:hover {
      background: #7C3AED;
      color: white;
    }
  }

  &.indicator {
    background: #EDE9FE;
    border-color: #C4B5FD;
    color: #6D28D9;

    &:hover {
      background: #6D28D9;
      color: white;
    }
  }

  &.class {
    background: #FFF3E0;
    border-color: #FFE0B2;
    color: #E65100;

    &:hover {
      background: #E65100;
      color: white;
    }
  }
}

// ========== 底部吸底输入区 ==========
.input-bar {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
  background: white;
  border-top: 1px solid #eee;
  align-items: center;
  flex-shrink: 0;

  @media (min-width: $breakpoint-md) {
    padding: 14px 32px;
  }
}

.voice-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: $gray-100;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &.recording {
    background: #FFEBEE;
    animation: pulse-recording 1.5s infinite;
  }
}

.voice-icon { font-size: 22px; }

@keyframes pulse-recording {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 12px 4px rgba(244, 67, 54, 0); }
}

.chat-input {
  flex: 1;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: $radius-full;
  padding: 0 20px;
  font-size: 15px;
  background: #F8F8FA;

  &:focus {
    outline: none;
    border-color: $purple-light;
    background: white;
    box-shadow: 0 0 0 3px rgba($purple, 0.1);
  }
}

.send-btn {
  padding: 0 24px;
  height: 44px;
  background: $purple-gradient;
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}

// ========== 历史记录抽屉 ==========
.drawer-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.history-drawer {
  width: 480px;
  max-width: 92vw;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.25s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.drawer-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.drawer-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover { background: #eee; color: #666; }
}

.date-range-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-bottom: 1px solid #f5f5f5;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.range-tab {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  background: #f5f5f5;

  &:hover { background: $purple-bg; color: $purple; }

  &.active {
    background: $purple;
    color: white;
    font-weight: 600;
  }
}

.custom-dates {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.date-input {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  outline: none;

  &:focus { border-color: $purple-light; }
}

.date-sep {
  color: #ccc;
  font-size: 14px;
}

.drawer-stats {
  padding: 10px 24px;
  font-size: 13px;
  color: #999;
  border-bottom: 1px solid #f5f5f5;
  flex-shrink: 0;

  strong { color: $purple; font-weight: 700; }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  min-height: 0;
}

.drawer-empty {
  text-align: center;
  padding: 60px 20px;
  color: #bbb;

  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 15px; }
}

.day-group {
  margin-bottom: 24px;

  &:last-child { margin-bottom: 0; }
}

.day-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
}

.day-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.day-chat-expand {
  font-size: 12px;
  color: $purple;
  cursor: pointer;
  padding: 3px 12px;
  border-radius: 12px;
  background: $purple-bg;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba($purple, 0.2);
  }
}

.day-count {
  margin-left: auto;
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 10px;
  border-radius: 10px;
}

.day-entries {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-entry {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  background: #FAFAFA;
  border-radius: 12px;
  border-left: 3px solid $purple;
  transition: all 0.2s;

  &.negative { border-left-color: $danger; }

  &:hover { background: #F5F3FF; }
}

.entry-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  padding-top: 2px;
  min-width: 40px;
}

.entry-main {
  flex: 1;
  min-width: 0;
}

.entry-chat {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}

.entry-chat-label {
  font-size: 13px;
  flex-shrink: 0;
}

.entry-chat-text {
  font-size: 13px;
  color: #888;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-result {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.entry-student {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  background: $purple-bg;
  padding: 2px 10px;
  border-radius: 8px;
  white-space: nowrap;
}

.entry-indicator {
  font-size: 12px;
  color: #666;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-points {
  font-size: 14px;
  font-weight: 700;
  color: $purple;
  white-space: nowrap;

  &.negative { color: $danger; }
}

// ========== 弹窗通用 ==========
.picker-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

// ========== 学生多选弹窗 ==========
.picker-dialog {
  background: white;
  border-radius: 20px;
  padding: 24px;
  max-width: 480px;
  width: 92%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.picker-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.picker-quick-actions {
  display: flex;
  gap: 12px;
}

.quick-action {
  font-size: 14px;
  color: $purple;
  cursor: pointer;
  font-weight: 500;

  &:hover { text-decoration: underline; }
}

.picker-count {
  font-size: 13px;
  color: #999;
  margin-bottom: 14px;
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  margin-bottom: 16px;
}

.picker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.15s;
  position: relative;

  &:hover { background: $purple-bg; }

  &.selected {
    background: $purple-bg;
    border-color: $purple;
  }
}

.picker-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8E0FF, #D4E4FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: $purple;
  font-weight: 600;
}

.picker-name { font-size: 12px; color: #555; }

.picker-check {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: $purple;
  color: white;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.picker-footer {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.picker-btn-cancel {
  padding: 10px 32px;
  background: #f5f5f5;
  border: none;
  border-radius: $radius-full;
  font-size: 15px;
  color: #666;
  cursor: pointer;
}

.picker-btn-confirm {
  padding: 10px 40px;
  background: $purple-gradient;
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

// ========== 指标选择弹窗 ==========
.indicator-dialog {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 94%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.indicator-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { background: #eee; }
}

.indicator-dialog .picker-header {
  padding: 20px 24px 14px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.indicator-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 24px;
}

.indicator-dim {
  margin-bottom: 20px;

  &:last-child { margin-bottom: 0; }
}

.dim-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
}

.dim-icon { font-size: 20px; }

.dim-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.dim-indicators {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dim-indicator-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;

  &.positive { background: #F8F9FF; }
  &.negative { background: #FFF8F6; }

  &:hover {
    border-color: $purple-light;
    background: $purple-bg;
  }

  &.active {
    border-color: $purple;
    background: $purple-bg;
    box-shadow: 0 0 0 2px rgba($purple, 0.15);
  }
}

.ind-label {
  flex: 1;
  font-size: 13px;
  color: #444;
  line-height: 1.4;
}

.ind-points {
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;
  white-space: nowrap;

  &.positive { color: $purple; }
  &.negative { color: $danger; }
}

// ========== 当天全部聊天弹窗 ==========
.day-chat-dialog {
  background: white;
  border-radius: 20px;
  max-width: 520px;
  width: 92%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.day-chat-dialog .picker-header {
  padding: 20px 24px 14px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.day-chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.day-chat-msg {
  display: flex;
  flex-direction: column;

  &.user { align-items: flex-end; }
  &.ai { align-items: flex-start; }
}

.day-chat-time {
  font-size: 11px;
  color: #bbb;
  margin-bottom: 4px;
}

.day-chat-bubble {
  max-width: 85%;
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;

  &.user {
    background: $purple-gradient;
    color: white;
    border-top-right-radius: 4px;
  }

  &.ai {
    background: #F0ECFF;
    color: #333;
    border-top-left-radius: 4px;
  }
}

.day-chat-role-tag {
  display: inline-block;
  background: $purple;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 6px;
  margin-right: 6px;
  vertical-align: middle;
}
</style>
