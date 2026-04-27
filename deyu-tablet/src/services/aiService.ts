import type { VoiceReviewResult } from '@shared/types'
import { MORAL_DIMENSION_INDICATORS, getAllDimensionIndicators } from '@shared/constants'
import type { Student } from '@shared/types'

// 指标关键词映射
const INDICATOR_KEYWORDS: Record<string, string[]> = {
  // 快乐维度
  happy_1: ['情绪', '稳定', '开心', '快乐', '高兴'],
  happy_2: ['运动', '体育', '锻炼', '跑步', '活动'],
  happy_3: ['保护', '安全', '小心', '注意'],
  happy_4: ['情绪问题', '不开心', '难过', '哭', '焦虑', '需要关注'],

  // 进取维度
  prog_1: ['作业', '按时', '完成', '交作业', '写作业'],
  prog_2: ['提问', '问问题', '发言', '举手', '积极'],
  prog_3: ['坚持', '努力', '不放弃', '毅力'],
  prog_4: ['不交作业', '迟交', '没完成', '需要鼓励', '懈怠'],

  // 儒雅维度
  eleg_1: ['礼貌', '有礼', '懂事', '尊重', '问好'],
  eleg_2: ['倾听', '认真听', '听讲', '安静', '专注'],
  eleg_3: ['沟通', '温和', '友善', '耐心'],
  eleg_4: ['不礼貌', '粗鲁', '打断', '待改进', '大声喧哗'],

  // 大气维度
  gene_1: ['关心', '集体', '班级', '帮助同学'],
  gene_2: ['服务', '主动', '值日', '卫生', '打扫'],
  gene_3: ['责任', '担当', '负责', '班长', '组长'],
  gene_4: ['自私', '不合作', '需要引导', '不参与']
}

// 负面关键词
const NEGATIVE_KEYWORDS = ['没', '不', '未', '迟', '差', '问题', '需要', '缺']

/**
 * 解析输入文本，提取学生和行为
 */
export function parseVoiceReview(
  text: string,
  students: Student[]
): VoiceReviewResult[] {
  const results: VoiceReviewResult[] = []

  // 简单分句处理
  const sentences = text.split(/[，。；！？,;!?\n]+/).filter(s => s.trim())

  for (const sentence of sentences) {
    const result = parseSentence(sentence.trim(), students)
    if (result) {
      results.push(result)
    }
  }

  return results
}

/**
 * 解析单个句子
 */
function parseSentence(
  sentence: string,
  students: Student[]
): VoiceReviewResult | null {
  // 查找学生姓名
  let matchedStudent: Student | null = null
  let studentName = ''

  for (const student of students) {
    if (sentence.includes(student.name)) {
      matchedStudent = student
      studentName = student.name
      break
    }
  }

  // 如果没找到学生，尝试匹配姓
  if (!matchedStudent) {
    for (const student of students) {
      const lastName = student.name.charAt(0)
      // 匹配 "小明"、"小红" 这样的称呼
      if (sentence.includes(`小${lastName}`) || sentence.includes(`${lastName}同学`)) {
        matchedStudent = student
        studentName = sentence.includes(`小${lastName}`) ? `小${lastName}` : `${lastName}同学`
        break
      }
    }
  }

  if (!studentName) {
    // 尝试提取可能的名字（两到三个字）
    const nameMatch = sentence.match(/^([^\s]{2,3})/u)
    if (nameMatch) {
      studentName = nameMatch[1]
    }
  }

  // 查找匹配的指标
  const indicator = matchIndicator(sentence)
  if (!indicator) return null

  // 判断是否为负面评价
  const isNegative = indicator.type === 'negative' ||
    NEGATIVE_KEYWORDS.some(kw => sentence.includes(kw))

  // 生成建议（如果是负面评价）
  const suggestion = isNegative ? generateSuggestion(indicator.dimension, sentence) : undefined

  return {
    id: `vr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentName: studentName || '未识别',
    studentId: matchedStudent?.id,
    indicator: {
      id: indicator.id,
      label: indicator.label,
      dimension: indicator.dimension,
      points: indicator.points
    },
    suggestion,
    isNegative
  }
}

/**
 * 匹配最合适的指标
 */
function matchIndicator(text: string): {
  id: string
  label: string
  dimension: string
  points: number
  type: 'positive' | 'negative'
} | null {
  let bestMatch: typeof MORAL_DIMENSION_INDICATORS[0]['indicators'][0] | null = null
  let bestDimension = ''
  let maxScore = 0

  for (const dim of MORAL_DIMENSION_INDICATORS) {
    for (const ind of dim.indicators) {
      const keywords = INDICATOR_KEYWORDS[ind.id] || []
      let score = 0

      for (const kw of keywords) {
        if (text.includes(kw)) {
          score++
        }
      }

      // 也检查指标标签
      if (text.includes(ind.label)) {
        score += 2
      }

      if (score > maxScore) {
        maxScore = score
        bestMatch = ind
        bestDimension = dim.key
      }
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      ...bestMatch,
      dimension: bestDimension
    }
  }

  // 默认返回一个通用的正面指标
  const defaultDim = MORAL_DIMENSION_INDICATORS[1] // 进取
  const defaultInd = defaultDim.indicators[0] // 按时作业
  return {
    ...defaultInd,
    dimension: defaultDim.key
  }
}

/**
 * 生成建议
 */
function generateSuggestion(dimension: string, context: string): string {
  const suggestions: Record<string, string[]> = {
    happy: [
      '建议与学生进行一对一谈话，了解情绪变化原因',
      '可以组织一些轻松的活动帮助学生放松',
      '建议家长多关注孩子的心理状态'
    ],
    progress: [
      '可以设立小目标，帮助学生建立学习信心',
      '建议采用积分奖励制度激励学习',
      '推荐使用番茄工作法提高学习效率'
    ],
    elegant: [
      '建议通过角色扮演游戏学习礼仪',
      '可以设立"礼仪小标兵"激励学生',
      '推荐阅读《弟子规》等国学经典'
    ],
    generous: [
      '可以安排小组合作任务培养团队意识',
      '建议让学生担任班级小助手增强责任感',
      '组织班级公益活动培养奉献精神'
    ]
  }

  const dimSuggestions = suggestions[dimension] || suggestions.progress
  return dimSuggestions[Math.floor(Math.random() * dimSuggestions.length)]
}

/**
 * AI 服务 - 调用后端 API 进行更智能的解析（可选）
 */
export async function parseVoiceReviewWithAI(
  text: string,
  students: Student[]
): Promise<VoiceReviewResult[]> {
  // 目前使用本地解析，未来可以接入 AI API
  // 如果有后端 AI 服务，可以在这里调用
  return parseVoiceReview(text, students)
}

/**
 * 批量处理多条语音记录
 */
export function batchParseVoiceReview(
  texts: string[],
  students: Student[]
): VoiceReviewResult[] {
  const allResults: VoiceReviewResult[] = []

  for (const text of texts) {
    const results = parseVoiceReview(text, students)
    allResults.push(...results)
  }

  return allResults
}
