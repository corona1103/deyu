import type { ReviewIndicator } from '../types'

// 四维度德育指标（北大附小体系）
export interface DimensionIndicator {
  id: string
  label: string
  type: 'positive' | 'negative'
  points: number
}

export interface MoralDimension {
  name: string
  icon: string
  key: string
  indicators: DimensionIndicator[]
}

export const MORAL_DIMENSION_INDICATORS: MoralDimension[] = [
  {
    name: '快乐', icon: '😊', key: 'happy',
    indicators: [
      { id: 'happy_1', label: '情绪稳定', type: 'positive', points: 2 },
      { id: 'happy_2', label: '积极运动', type: 'positive', points: 2 },
      { id: 'happy_3', label: '保护自己', type: 'positive', points: 2 },
      { id: 'happy_4', label: '需要关注', type: 'negative', points: -1 }
    ]
  },
  {
    name: '进取', icon: '🚀', key: 'progress',
    indicators: [
      { id: 'prog_1', label: '按时作业', type: 'positive', points: 2 },
      { id: 'prog_2', label: '主动提问', type: 'positive', points: 2 },
      { id: 'prog_3', label: '坚持不懈', type: 'positive', points: 2 },
      { id: 'prog_4', label: '需要鼓励', type: 'negative', points: -1 }
    ]
  },
  {
    name: '儒雅', icon: '📚', key: 'elegant',
    indicators: [
      { id: 'eleg_1', label: '礼貌待人', type: 'positive', points: 2 },
      { id: 'eleg_2', label: '安静倾听', type: 'positive', points: 2 },
      { id: 'eleg_3', label: '温和沟通', type: 'positive', points: 2 },
      { id: 'eleg_4', label: '待改进', type: 'negative', points: -1 }
    ]
  },
  {
    name: '大气', icon: '💪', key: 'generous',
    indicators: [
      { id: 'gene_1', label: '关心集体', type: 'positive', points: 2 },
      { id: 'gene_2', label: '主动服务', type: 'positive', points: 2 },
      { id: 'gene_3', label: '责任担当', type: 'positive', points: 2 },
      { id: 'gene_4', label: '需要引导', type: 'negative', points: -1 }
    ]
  }
]

// 获取所有四维度指标的扁平列表
export function getAllDimensionIndicators(): (DimensionIndicator & { dimension: string })[] {
  return MORAL_DIMENSION_INDICATORS.flatMap(dim =>
    dim.indicators.map(ind => ({ ...ind, dimension: dim.key }))
  )
}

// 根据ID获取指标
export function getIndicatorById(id: string): (DimensionIndicator & { dimension: string }) | undefined {
  for (const dim of MORAL_DIMENSION_INDICATORS) {
    const indicator = dim.indicators.find(ind => ind.id === id)
    if (indicator) {
      return { ...indicator, dimension: dim.key }
    }
  }
  return undefined
}

// 旧版六维度指标（保留向后兼容）
// 加分指标
export const POSITIVE_INDICATORS: ReviewIndicator[] = [
  { id: 'listen', icon: '📚', name: '认真听讲', points: 2, type: 'positive', category: '课堂表现' },
  { id: 'speak', icon: '✋', name: '积极发言', points: 2, type: 'positive', category: '课堂表现' },
  { id: 'homework', icon: '📝', name: '作业优秀', points: 3, type: 'positive', category: '学习习惯' },
  { id: 'help', icon: '🤝', name: '乐于助人', points: 2, type: 'positive', category: '品德修养' },
  { id: 'duty', icon: '🧹', name: '值日认真', points: 2, type: 'positive', category: '劳动卫生' },
  { id: 'sports', icon: '🏃', name: '体育积极', points: 2, type: 'positive', category: '体育健康' },
  { id: 'creative', icon: '💡', name: '创意表现', points: 3, type: 'positive', category: '综合素质' },
  { id: 'teamwork', icon: '👥', name: '团队协作', points: 2, type: 'positive', category: '综合素质' },
]

// 扣分指标
export const NEGATIVE_INDICATORS: ReviewIndicator[] = [
  { id: 'distracted', icon: '😴', name: '上课走神', points: -1, type: 'negative', category: '课堂表现' },
  { id: 'phone', icon: '📱', name: '玩手机', points: -2, type: 'negative', category: '课堂表现' },
  { id: 'talk', icon: '🗣️', name: '课堂讲话', points: -1, type: 'negative', category: '课堂表现' },
  { id: 'no_homework', icon: '📋', name: '作业未交', points: -2, type: 'negative', category: '学习习惯' },
  { id: 'late', icon: '⏰', name: '迟到', points: -1, type: 'negative', category: '行为规范' },
  { id: 'fight', icon: '😤', name: '打架', points: -5, type: 'negative', category: '品德修养' },
]

// 所有指标
export const ALL_INDICATORS = [...POSITIVE_INDICATORS, ...NEGATIVE_INDICATORS]

// 小组图标选项
export const GROUP_ICONS = ['🐱', '🐰', '🦊', '🐸', '🐻', '🐼', '🦁', '🐯', '🐵', '🐧']

// 新版四维度（北大附小体系）
export const MORAL_DIMENSIONS_NEW = ['快乐', '进取', '儒雅', '大气']

// 旧版六维度（保留向后兼容）
export const MORAL_DIMENSIONS = [
  '品德修养',
  '学习习惯',
  '课堂表现',
  '劳动卫生',
  '体育健康',
  '综合素质'
]

// 评级标准
export const LEVEL_THRESHOLDS = {
  excellent: 90,
  good: 75,
  average: 60,
  poor: 0
}

// 颜色主题
export const THEME_COLORS = {
  primary: '#8B0000',
  primaryLight: '#A52A2A',
  secondary: '#4A90D9',
  secondaryLight: '#6BA3E0',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336'
}
