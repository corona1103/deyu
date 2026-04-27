// 学生类型
export interface Student {
  id: string
  name: string
  avatar?: string
  score: number
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
  classes: ClassInfo[]
}

// 作业类型
export interface Homework {
  id: string
  title: string
  subject: '语文' | '数学' | '英语'
  deadline: Date
  classId: string
  createdAt: Date
  submissions: HomeworkSubmission[]
}

// 作业提交类型
export interface HomeworkSubmission {
  studentId: string
  submittedAt?: Date
  isOnTime?: boolean
  points?: number
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
  type: 'score_update' | 'homework_submit' | 'ranking_update'
  payload: unknown
}
