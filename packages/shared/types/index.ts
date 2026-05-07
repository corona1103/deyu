// 学生类型
export interface Student {
  id: string
  name: string
  avatar?: string
  score: number
  classId?: string
  groupId?: string
  seatRow?: number
  seatCol?: number
}

// 小组类型
export interface Group {
  id: string
  name: string
  icon: string
  students: Student[]
  totalScore: number
}

// 班级类型
export interface ClassInfo {
  id: string
  name: string
  grade: number
  classNumber: number
  students: Student[]
  groups: Group[]
}

// 教师类型
export interface Teacher {
  id: string
  name: string
  avatar?: string
  phone?: string
  classes: ClassInfo[]
}

// 学科类型
export type Subject = '语文' | '数学' | '英语' | '其他'

// 作业状态
export type HomeworkStatus = 'active' | 'ended'

// 作业类型
export interface Homework {
  id: string
  title: string
  subject: Subject
  deadline: string          // ISO string，方便 mock 和序列化
  classId: string
  createdBy: string         // 教师姓名
  createdAt: string         // ISO string
  status: HomeworkStatus
  totalStudents: number
  submissions: HomeworkSubmission[]
}

// 作业提交类型
export interface HomeworkSubmission {
  studentId: string
  studentName: string
  submittedAt?: string      // ISO string
  isOnTime?: boolean
  status: 'submitted' | 'late' | 'missing'
}

// 排行榜项目类型
export interface RankingItem {
  rank: number
  student?: Student
  group?: Group
  score: number
  change?: number
}

// 行为记录类型
export interface BehaviorRecord {
  id: string
  studentId: string
  type: 'positive' | 'negative'
  category: string
  points: number
  description?: string
  createdAt: Date
  teacherId: string
}

// 点评指标类型
export interface ReviewIndicator {
  id: string
  icon: string
  name: string
  points: number
  type: 'positive' | 'negative'
  category: string
}

// 德育报告类型
export interface MoralReport {
  studentId: string
  period: StatPeriod
  totalScore: number
  dimensions: DimensionScore[]
  suggestions: string[]
  generatedAt: Date
}

// 维度评分类型
export interface DimensionScore {
  dimension: string
  score: number
  maxScore: number
  level: 'excellent' | 'good' | 'average' | 'poor'
  records: BehaviorRecord[]
}

// 预警信息类型
export interface WarningInfo {
  id: string
  studentId: string
  type: 'behavior' | 'homework' | 'attendance'
  level: 'low' | 'medium' | 'high'
  message: string
  createdAt: Date
  handled: boolean
}

// 统计周期类型
export type StatPeriod = 'day' | 'week' | 'month' | 'semester'

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// WebSocket消息类型
export interface WsMessage {
  type: 'score_update' | 'homework_submit' | 'ranking_update' | 'review_sync'
  payload: unknown
}

// 点评同步消息负载
export interface ReviewSyncPayload {
  studentIds: string[]
  indicatorId: string
  points: number
  teacherId: string
  timestamp: number
}

// 多指标点评同步消息负载（新版四维度系统）
export interface MultiReviewSyncPayload {
  studentIds: string[]
  indicators: {
    id: string
    points: number
    dimension: string
  }[]
  totalPoints: number
  teacherId: string
  timestamp: number
}

// 座位配置类型
export interface SeatConfig {
  rows: number
  cols: number
  layout: (string | null)[][] // studentId or null for empty
}

// 语音点评解析结果
export interface VoiceReviewResult {
  id: string
  studentName: string
  studentId?: string
  indicator: {
    id: string
    label: string
    dimension: string
    points: number
  }
  suggestion?: string
  isNegative: boolean
}

// 班级报告数据
export interface ClassReportData {
  classId: string
  period: StatPeriod
  dimensionStats: {
    dimension: string
    average: number
    max: number
    min: number
  }[]
  groupComparison: {
    groupId: string
    groupName: string
    scores: Record<string, number>
  }[]
  aiEvaluation: string
  generatedAt: Date
}
