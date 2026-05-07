import type { VoiceReviewResult } from '@shared/types'
import { MORAL_DIMENSION_INDICATORS } from '@shared/constants'
import type { Student } from '@shared/types'

// ========== 关键词 → 指标映射 ==========
interface KeywordRule {
  keywords: string[]
  indicatorId: string
  weight: number
}

const KEYWORD_RULES: KeywordRule[] = [
  // === 进取（创新素养）===
  { keywords: ['上课', '认真', '遵守纪律', '纪律', '课堂纪律'], indicatorId: 'p04', weight: 2 },
  { keywords: ['上课', '捣乱', '扰乱', '课堂秩序'], indicatorId: 'p05', weight: 2 },
  { keywords: ['举手', '发言', '回答', '主动回答', '积极发言', '互动'], indicatorId: 'p07', weight: 3 },
  { keywords: ['不发言', '不举手', '不主动'], indicatorId: 'p08', weight: 2 },
  { keywords: ['作业', '按时', '完成', '交作业'], indicatorId: 'p01', weight: 2 },
  { keywords: ['不交作业', '没交', '拖欠', '未完成'], indicatorId: 'p02', weight: 2 },
  { keywords: ['提问', '质疑', '问问题'], indicatorId: 'p12', weight: 2 },
  { keywords: ['不放弃', '坚持', '努力', '尝试'], indicatorId: 'p13', weight: 2 },
  { keywords: ['时间管理', '分配时间', '轻重缓急'], indicatorId: 'p14', weight: 2 },
  { keywords: ['目标', '计划', '制定'], indicatorId: 'p09', weight: 1 },
  // === 快乐（身心健康）===
  { keywords: ['保护', '安全', '小心'], indicatorId: 'h01', weight: 1 },
  { keywords: ['危险', '受伤', '不安全'], indicatorId: 'h02', weight: 2 },
  { keywords: ['情绪', '稳定', '开心', '快乐', '高兴'], indicatorId: 'h07', weight: 1 },
  { keywords: ['发泄', '发脾气', '生气', '暴怒'], indicatorId: 'h09', weight: 2 },
  { keywords: ['吃饭', '不挑食', '光盘', '吃完'], indicatorId: 'h11', weight: 2 },
  { keywords: ['挑食', '浪费', '倒饭'], indicatorId: 'h12', weight: 2 },
  { keywords: ['喝水', '饮水'], indicatorId: 'h13', weight: 2 },
  { keywords: ['课间操', '眼保健操', '做操'], indicatorId: 'h15', weight: 2 },
  { keywords: ['运动', '体育', '锻炼', '跑步', '跑跳'], indicatorId: 'h20', weight: 2 },
  { keywords: ['笑容', '开心'], indicatorId: 'h18', weight: 1 },
  // === 儒雅（儒雅品格）===
  { keywords: ['礼貌', '问好', '谢谢', '请', '对不起'], indicatorId: 'e09', weight: 2 },
  { keywords: ['不礼貌', '粗鲁', '没礼貌'], indicatorId: 'e10', weight: 2 },
  { keywords: ['倾听', '认真听', '听讲', '安静', '专注'], indicatorId: 'e11', weight: 2 },
  { keywords: ['打断', '插嘴'], indicatorId: 'e12', weight: 2 },
  { keywords: ['衣着', '整洁', '整齐'], indicatorId: 'e07', weight: 1 },
  { keywords: ['打架', '骂人', '欺负', '伤害', '欺凌'], indicatorId: 'e02', weight: 3 },
  { keywords: ['追逐', '打闹', '跑闹'], indicatorId: 'e14', weight: 2 },
  { keywords: ['轻步慢走', '不追逐'], indicatorId: 'e13', weight: 2 },
  { keywords: ['沟通', '温和', '友善'], indicatorId: 'e16', weight: 1 },
  { keywords: ['帮助同学', '关心同学', '主动帮'], indicatorId: 'e17', weight: 2 },
  { keywords: ['阅读', '看书', '读书'], indicatorId: 'e21', weight: 2 },
  // === 大气（责任担当）===
  { keywords: ['升旗', '国歌', '行礼'], indicatorId: 'g01', weight: 2 },
  { keywords: ['红领巾', '队旗'], indicatorId: 'g04', weight: 2 },
  { keywords: ['集体', '班级活动', '集体活动', '值日', '卫生', '打扫'], indicatorId: 'g07', weight: 2 },
  { keywords: ['不值日', '不做值日', '拒绝', '不参与'], indicatorId: 'g08', weight: 2 },
  { keywords: ['校园', '环境', '不乱扔', '爱护'], indicatorId: 'g09', weight: 1 },
  { keywords: ['乱扔', '垃圾', '破坏'], indicatorId: 'g10', weight: 2 },
  { keywords: ['分享', '乐于分享', '大方'], indicatorId: 'g12', weight: 2 },
  { keywords: ['服务', '主动服务', '为班级'], indicatorId: 'g13', weight: 2 },
  { keywords: ['非遗', '传统', '历史'], indicatorId: 'g14', weight: 1 },
]

// 全班关键词
const CLASS_WIDE_KEYWORDS = ['全班', '所有人', '大家', '每个人', '所有同学', '全体', '同学们']

// ========== 负面行为指导建议 ==========
const NEGATIVE_GUIDANCE: Record<string, string> = {
  'e02': '老师，发现学生间的冲突行为，建议您：\n1. 先将当事学生分开，确保安全\n2. 安抚受影响学生的情绪\n3. 分别了解事情经过\n4. 如有同学出现伤情，建议尽快联系校医和家长，并提醒家长保留就医单据以便后续报销流程',
  'e03': '这是比较严重的校园欺凌行为，建议您立即：\n1. 制止行为并隔离当事人\n2. 检查受伤学生伤情，必要时送校医院\n3. 通知学校德育处和双方家长\n4. 保留证据，填写校园安全事件记录表',
  'e05': '建议了解破坏行为的原因，是无意还是故意。如果是故意的，需要让学生认识到后果，并承担一定的修复责任。建议及时通知家长了解情况。',
  'e10': '建议找合适的时机和学生聊聊，用正面引导的方式，如"如果你能主动打招呼会更棒"，而非直接批评。也可以设立"礼仪小标兵"来带动班级氛围。',
  'e14': '校内追逐打闹容易造成意外伤害。建议引导学生到操场等开阔场地活动，课间可以组织安静有趣的游戏作为替代。',
  'h02': '请确认学生目前是否安全。建议检查是否有受伤，并提醒全班注意安全。如果是高频行为，建议与家长沟通，了解学生情况。',
  'h03': '这是严重的安全隐患。建议立即制止并确保学生安全，检查是否有伤情，通知学校安全负责人并联系家长通报情况。',
  'h09': '老师，您是否已及时进行控场隔离，帮助学生平复情绪？建议给学生一个安静空间冷静下来，等情绪稳定后再进行沟通引导。如果情绪持续激动，可以联系心理老师协助。',
  'h10': '这是比较严重的情绪失控行为。建议确保周围同学安全，温和引导学生到安静空间，联系心理辅导老师介入，并及时通知家长了解近期家庭情况。',
  'h12': '建议观察学生是否有特殊饮食需求或身体不适。可以通过"光盘行动"等趣味活动引导学生珍惜食物。',
  'p02': '建议课后单独和学生谈谈，了解未完成作业的原因——可能是作业量大、不会做、或家庭原因。根据具体情况提供针对性帮助。',
  'p03': '长期拖欠作业需要重点关注。建议与学生一对一沟通、联系家长了解家庭学习环境、制定"作业小目标"逐步改善，也可安排"学习伙伴"互助。',
  'p05': '建议先用"暂停信号"提醒该同学，如多次提醒无效，可安排其到"冷静角"调整状态。课后可以单独和学生聊聊，了解是否有什么困扰。',
  'p06': '严重的课堂扰乱行为需要特别关注。建议先温和但坚定地制止，如无法控制可请隔壁班老师或德育处协助。课后深入了解原因，与家长沟通制定行为改善计划。',
  'g02': '建议在班会上讲解升旗礼仪的意义和规范，让学生理解国旗仪式的庄严性，培养爱国意识。',
  'g08': '建议了解学生不参与的原因，是否有身体不适或其他困扰。可以安排"小组长轮值"制度，增强集体责任感。',
  'g10': '建议引导学生参与班级卫生维护，培养环保意识。可以安排"环保小卫士"轮值，形成良好班风。',
}

export function getGuidanceForIndicator(indicatorId: string): string | null {
  return NEGATIVE_GUIDANCE[indicatorId] || null
}

// ========== 类型定义 ==========
export interface ChipOption {
  label: string
  value: string
  type: 'student' | 'indicator' | 'action' | 'class'
}

export interface PendingContext {
  type: 'need-student' | 'need-indicator' | 'need-both'
  originalText: string
  // 已识别的部分
  matchedStudents?: Student[]
  matchedIndicator?: { id: string; label: string; dimension: string; points: number; type: 'positive' | 'negative' } | null
  isClassWide?: boolean
  // 候选
  candidateStudents?: Student[]
  candidateIndicators?: { id: string; label: string; dimension: string; points: number; type: string }[]
  rawNameText?: string
}

export interface AIMessage {
  type: 'text' | 'guidance' | 'chips'
  content: string
  chips?: ChipOption[]
}

export interface AnalysisResult {
  // 高置信度的结果行（直接出卡片）
  reviewRows: {
    studentIds: string[]
    studentNames: string[]
    isClassWide: boolean
    indicatorId: string
    indicatorLabel: string
    indicatorDimension: string
    points: number
    isNegative: boolean
  }[]
  // AI 消息列表
  aiMessages: AIMessage[]
  // 是否有需要跟进的上下文
  pendingContext: PendingContext | null
}

// ========== 核心函数 ==========

export function isClassWideIntent(text: string): boolean {
  return CLASS_WIDE_KEYWORDS.some(kw => text.includes(kw))
}

/**
 * 匹配指标，返回结果 + 置信度分数
 */
function matchIndicatorWithScore(text: string): {
  indicator: { id: string; label: string; dimension: string; points: number; type: 'positive' | 'negative' } | null
  score: number
  candidates: { id: string; label: string; dimension: string; points: number; type: string }[]
} {
  // 1. 关键词规则匹配
  let bestRuleMatch: KeywordRule | null = null
  let bestRuleScore = 0

  for (const rule of KEYWORD_RULES) {
    let score = 0
    for (const kw of rule.keywords) {
      if (text.includes(kw)) {
        score += rule.weight
      }
    }
    if (score > bestRuleScore) {
      bestRuleScore = score
      bestRuleMatch = rule
    }
  }

  if (bestRuleMatch && bestRuleScore >= 2) {
    for (const dim of MORAL_DIMENSION_INDICATORS) {
      const ind = dim.indicators.find(i => i.id === bestRuleMatch!.indicatorId)
      if (ind) {
        return {
          indicator: { ...ind, dimension: dim.key },
          score: bestRuleScore,
          candidates: []
        }
      }
    }
  }

  // 2. 直接匹配指标标签
  let bestLabelMatch: typeof MORAL_DIMENSION_INDICATORS[0]['indicators'][0] | null = null
  let bestLabelDim = ''
  let bestLabelScore = 0

  for (const dim of MORAL_DIMENSION_INDICATORS) {
    for (const ind of dim.indicators) {
      const labelWords = ind.label.replace(/[，。、/]/g, ' ').split(/\s+/).filter(w => w.length >= 2)
      let score = 0
      for (const w of labelWords) {
        if (text.includes(w)) score += 2
      }
      if (score > bestLabelScore) {
        bestLabelScore = score
        bestLabelMatch = ind
        bestLabelDim = dim.key
      }
    }
  }

  if (bestLabelMatch && bestLabelScore >= 2) {
    return {
      indicator: { ...bestLabelMatch, dimension: bestLabelDim },
      score: bestLabelScore,
      candidates: []
    }
  }

  // 3. 低置信度 — 收集候选指标
  const candidates: { id: string; label: string; dimension: string; points: number; type: string }[] = []

  // 收集所有得分 > 0 的规则匹配
  const scored: { rule: KeywordRule; score: number }[] = []
  for (const rule of KEYWORD_RULES) {
    let score = 0
    for (const kw of rule.keywords) {
      if (text.includes(kw)) score += rule.weight
    }
    if (score > 0) scored.push({ rule, score })
  }
  scored.sort((a, b) => b.score - a.score)

  for (const { rule } of scored.slice(0, 4)) {
    for (const dim of MORAL_DIMENSION_INDICATORS) {
      const ind = dim.indicators.find(i => i.id === rule.indicatorId)
      if (ind && !candidates.find(c => c.id === ind.id)) {
        candidates.push({ ...ind, dimension: dim.key })
      }
    }
  }

  return { indicator: null, score: 0, candidates }
}

/**
 * 在学生列表中查找：精确匹配 + 模糊匹配
 */
function matchStudents(text: string, students: Student[]): {
  matched: Student[]
  candidates: Student[]
  rawNameText: string
} {
  const matched: Student[] = []

  // 精确全名匹配
  for (const s of students) {
    if (text.includes(s.name)) matched.push(s)
  }
  if (matched.length > 0) return { matched, candidates: [], rawNameText: '' }

  // 模糊匹配：名字后两字
  for (const s of students) {
    const partName = s.name.length >= 3 ? s.name.substring(1) : s.name
    if (text.includes(partName)) matched.push(s)
  }
  if (matched.length > 0) return { matched, candidates: [], rawNameText: '' }

  // 尝试提取名字文本
  const nameMatch = text.match(/^([^\s,，]{2,3})/u)
  const rawNameText = nameMatch ? nameMatch[1] : ''

  // 未匹配到 → 收集候选（同姓或名字部分相似）
  const candidates: Student[] = []
  if (rawNameText) {
    // 同姓
    for (const s of students) {
      if (s.name[0] === rawNameText[0]) candidates.push(s)
    }
    // 如果同姓太少，取名字有交集字符的
    if (candidates.length < 2) {
      for (const s of students) {
        if (!candidates.includes(s)) {
          const overlap = [...rawNameText].some(ch => s.name.includes(ch))
          if (overlap) candidates.push(s)
        }
      }
    }
  }

  return { matched: [], candidates: candidates.slice(0, 6), rawNameText }
}

/**
 * 推荐常用正面指标（当行为描述模糊时）
 */
function suggestCommonIndicators(): { id: string; label: string; dimension: string; points: number; type: string }[] {
  const commonIds = ['p04', 'p07', 'p01', 'e11', 'e09', 'g07', 'h15']
  const result: { id: string; label: string; dimension: string; points: number; type: string }[] = []
  for (const id of commonIds) {
    for (const dim of MORAL_DIMENSION_INDICATORS) {
      const ind = dim.indicators.find(i => i.id === id)
      if (ind) {
        result.push({ ...ind, dimension: dim.key })
        break
      }
    }
  }
  return result
}

// ========== 主入口：智能分析 ==========

/**
 * 分析老师的输入，返回结构化的分析结果
 * 支持：明确匹配 / 学生不明确 / 指标不明确 / 负面行为指导 / 无法匹配
 */
export function analyzeInput(text: string, students: Student[]): AnalysisResult {
  const sentences = text.split(/[，。；！？,;!?\n]+/).filter(s => s.trim())
  const allRows: AnalysisResult['reviewRows'] = []
  const allMessages: AIMessage[] = []
  let pendingContext: PendingContext | null = null
  const guidanceSet = new Set<string>() // 避免重复指导

  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue

    const isWholeClass = isClassWideIntent(trimmed)

    // 匹配学生
    const studentResult = isWholeClass
      ? { matched: [] as Student[], candidates: [] as Student[], rawNameText: '' }
      : matchStudents(trimmed, students)

    // 匹配指标
    const indicatorResult = matchIndicatorWithScore(trimmed)

    const hasStudent = isWholeClass || studentResult.matched.length > 0
    const hasIndicator = indicatorResult.indicator !== null

    // Case 1: 完全匹配 → 生成行
    if (hasStudent && hasIndicator) {
      const ind = indicatorResult.indicator!
      const studentIds: string[] = []
      const studentNames: string[] = []

      if (isWholeClass) {
        students.forEach(s => { studentIds.push(s.id); studentNames.push(s.name) })
      } else {
        studentResult.matched.forEach(s => { studentIds.push(s.id); studentNames.push(s.name) })
      }

      allRows.push({
        studentIds,
        studentNames,
        isClassWide: isWholeClass,
        indicatorId: ind.id,
        indicatorLabel: ind.label,
        indicatorDimension: ind.dimension,
        points: ind.points,
        isNegative: ind.type === 'negative'
      })

      // 负面行为 → 追加指导建议
      if (ind.type === 'negative' && !guidanceSet.has(ind.id)) {
        const guidance = getGuidanceForIndicator(ind.id)
        if (guidance) {
          guidanceSet.add(ind.id)
          allMessages.push({ type: 'guidance', content: guidance })
        }
      }
      continue
    }

    // Case 2: 有指标但没学生
    if (hasIndicator && !hasStudent) {
      const ind = indicatorResult.indicator!
      if (studentResult.candidates.length > 0) {
        // 有候选学生 → 提供选择
        allMessages.push({
          type: 'text',
          content: `我在班级名单中没有找到"${studentResult.rawNameText}"，您是指以下哪位同学？`
        })
        allMessages.push({
          type: 'chips',
          content: '',
          chips: [
            ...studentResult.candidates.map(s => ({
              label: s.name, value: s.id, type: 'student' as const
            })),
            { label: '选择其他同学', value: 'pick-student', type: 'action' as const }
          ]
        })
        pendingContext = {
          type: 'need-student',
          originalText: trimmed,
          matchedIndicator: ind,
          candidateStudents: studentResult.candidates,
          rawNameText: studentResult.rawNameText
        }
      } else {
        // 完全没有学生线索 → 请老师指定
        allMessages.push({
          type: 'text',
          content: `已识别到行为"${ind.label}"，请问是哪位同学？`
        })
        allMessages.push({
          type: 'chips',
          content: '',
          chips: [
            { label: '全班同学', value: 'whole-class', type: 'action' as const },
            { label: '选择同学', value: 'pick-student', type: 'action' as const }
          ]
        })
        pendingContext = {
          type: 'need-student',
          originalText: trimmed,
          matchedIndicator: ind
        }
      }
      continue
    }

    // Case 3: 有学生但没指标
    if (hasStudent && !hasIndicator) {
      const nameDisplay = isWholeClass ? '全班同学' : studentResult.matched.map(s => s.name).join('、')

      if (indicatorResult.candidates.length > 0) {
        // 有候选指标
        allMessages.push({
          type: 'text',
          content: `${nameDisplay}的行为，您是指以下哪种情况？`
        })
        allMessages.push({
          type: 'chips',
          content: '',
          chips: [
            ...indicatorResult.candidates.slice(0, 3).map(c => ({
              label: c.label.length > 12 ? c.label.substring(0, 12) + '…' : c.label,
              value: c.id,
              type: 'indicator' as const
            })),
            { label: '选择其他指标', value: 'pick-indicator', type: 'action' as const }
          ]
        })
      } else {
        // 推荐常用指标
        const common = suggestCommonIndicators()
        allMessages.push({
          type: 'text',
          content: `${nameDisplay}具体是什么方面的表现呢？可以从以下常用指标中选择：`
        })
        allMessages.push({
          type: 'chips',
          content: '',
          chips: [
            ...common.slice(0, 3).map(c => ({
              label: c.label.length > 12 ? c.label.substring(0, 12) + '…' : c.label,
              value: c.id,
              type: 'indicator' as const
            })),
            { label: '选择其他指标', value: 'pick-indicator', type: 'action' as const }
          ]
        })
      }
      pendingContext = {
        type: 'need-indicator',
        originalText: trimmed,
        matchedStudents: isWholeClass ? [] : studentResult.matched,
        isClassWide: isWholeClass,
        candidateIndicators: indicatorResult.candidates.length > 0 ? indicatorResult.candidates : suggestCommonIndicators()
      }
      continue
    }

    // Case 4: 都没匹配到
    if (studentResult.rawNameText) {
      allMessages.push({
        type: 'text',
        content: `抱歉，我没有完全理解"${trimmed}"。请描述得更具体一些，比如"XX同学上课认真听讲"或"XX同学和同学打架了"。`
      })
    } else {
      allMessages.push({
        type: 'text',
        content: `请描述学生的表现，我来帮您记录。比如"小明上课认真听讲"、"全班今天值日做得好"。`
      })
    }
    allMessages.push({
      type: 'chips',
      content: '',
      chips: [
        { label: '选择同学+指标', value: 'pick-both', type: 'action' as const },
        { label: '创建自定义指标', value: 'custom-indicator', type: 'action' as const }
      ]
    })
    pendingContext = {
      type: 'need-both',
      originalText: trimmed,
      rawNameText: studentResult.rawNameText
    }
  }

  // 如果有成功解析的行，先加一条确认文字
  if (allRows.length > 0) {
    allMessages.unshift({ type: 'text', content: '好的，识别到以下点评' })
  }

  return { reviewRows: allRows, aiMessages: allMessages, pendingContext }
}

// ========== 跟进解析 ==========

/**
 * 用户在上下文中回复后，尝试解析跟进内容
 */
export function resolveFollowUp(
  text: string,
  students: Student[],
  ctx: PendingContext
): AnalysisResult {
  // --- 需要学生 ---
  if (ctx.type === 'need-student' && ctx.matchedIndicator) {
    const ind = ctx.matchedIndicator
    const isWholeClass = isClassWideIntent(text)

    if (isWholeClass) {
      return {
        reviewRows: [{
          studentIds: students.map(s => s.id),
          studentNames: students.map(s => s.name),
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
    }

    // 匹配学生
    const studentResult = matchStudents(text, students)
    if (studentResult.matched.length > 0) {
      const rows: AnalysisResult['reviewRows'] = [{
        studentIds: studentResult.matched.map(s => s.id),
        studentNames: studentResult.matched.map(s => s.name),
        isClassWide: false,
        indicatorId: ind.id,
        indicatorLabel: ind.label,
        indicatorDimension: ind.dimension,
        points: ind.points,
        isNegative: ind.type === 'negative'
      }]
      const msgs: AIMessage[] = [{ type: 'text', content: '好的，识别到以下点评' }]
      if (ind.type === 'negative') {
        const guidance = getGuidanceForIndicator(ind.id)
        if (guidance) msgs.push({ type: 'guidance', content: guidance })
      }
      return { reviewRows: rows, aiMessages: msgs, pendingContext: null }
    }

    // 仍然无法匹配
    return {
      reviewRows: [],
      aiMessages: [
        { type: 'text', content: '抱歉，还是没有找到这位同学。请直接输入学生全名，或点击下方按钮选择。' },
        { type: 'chips', content: '', chips: [
          { label: '选择同学', value: 'pick-student', type: 'action' },
          { label: '全班同学', value: 'whole-class', type: 'action' }
        ]}
      ],
      pendingContext: ctx
    }
  }

  // --- 需要指标 ---
  if (ctx.type === 'need-indicator' && (ctx.matchedStudents || ctx.isClassWide)) {
    const indResult = matchIndicatorWithScore(text)
    if (indResult.indicator) {
      const ind = indResult.indicator
      const studentIds: string[] = []
      const studentNames: string[] = []
      if (ctx.isClassWide) {
        students.forEach(s => { studentIds.push(s.id); studentNames.push(s.name) })
      } else {
        ctx.matchedStudents!.forEach(s => { studentIds.push(s.id); studentNames.push(s.name) })
      }
      const rows: AnalysisResult['reviewRows'] = [{
        studentIds,
        studentNames,
        isClassWide: !!ctx.isClassWide,
        indicatorId: ind.id,
        indicatorLabel: ind.label,
        indicatorDimension: ind.dimension,
        points: ind.points,
        isNegative: ind.type === 'negative'
      }]
      const msgs: AIMessage[] = [{ type: 'text', content: '好的，识别到以下点评' }]
      if (ind.type === 'negative') {
        const guidance = getGuidanceForIndicator(ind.id)
        if (guidance) msgs.push({ type: 'guidance', content: guidance })
      }
      return { reviewRows: rows, aiMessages: msgs, pendingContext: null }
    }

    return {
      reviewRows: [],
      aiMessages: [
        { type: 'text', content: '我还是不太确定您说的是哪个行为指标，请从下方选择或描述得更具体些。' },
        { type: 'chips', content: '', chips: [
          { label: '选择指标', value: 'pick-indicator', type: 'action' }
        ]}
      ],
      pendingContext: ctx
    }
  }

  // --- 都需要 → 当作全新输入 ---
  return analyzeInput(text, students)
}

// ========== 通过 chip 选择解决 pending ==========

/**
 * 用户点击 chip 选择了一个学生
 */
export function resolveStudentChip(
  studentId: string,
  students: Student[],
  ctx: PendingContext
): AnalysisResult | null {
  if (!ctx.matchedIndicator) return null
  const ind = ctx.matchedIndicator
  const student = students.find(s => s.id === studentId)
  if (!student) return null

  const msgs: AIMessage[] = [{ type: 'text', content: '好的，识别到以下点评' }]
  if (ind.type === 'negative') {
    const guidance = getGuidanceForIndicator(ind.id)
    if (guidance) msgs.push({ type: 'guidance', content: guidance })
  }

  return {
    reviewRows: [{
      studentIds: [student.id],
      studentNames: [student.name],
      isClassWide: false,
      indicatorId: ind.id,
      indicatorLabel: ind.label,
      indicatorDimension: ind.dimension,
      points: ind.points,
      isNegative: ind.type === 'negative'
    }],
    aiMessages: msgs,
    pendingContext: null
  }
}

/**
 * 用户点击 chip 选择了一个指标
 */
export function resolveIndicatorChip(
  indicatorId: string,
  students: Student[],
  ctx: PendingContext
): AnalysisResult | null {
  // 查找指标
  let foundInd: { id: string; label: string; dimension: string; points: number; type: 'positive' | 'negative' } | null = null
  for (const dim of MORAL_DIMENSION_INDICATORS) {
    const ind = dim.indicators.find(i => i.id === indicatorId)
    if (ind) {
      foundInd = { ...ind, dimension: dim.key }
      break
    }
  }
  if (!foundInd) return null

  const studentIds: string[] = []
  const studentNames: string[] = []
  if (ctx.isClassWide) {
    students.forEach(s => { studentIds.push(s.id); studentNames.push(s.name) })
  } else if (ctx.matchedStudents && ctx.matchedStudents.length > 0) {
    ctx.matchedStudents.forEach(s => { studentIds.push(s.id); studentNames.push(s.name) })
  } else {
    return null
  }

  const msgs: AIMessage[] = [{ type: 'text', content: '好的，识别到以下点评' }]
  if (foundInd.type === 'negative') {
    const guidance = getGuidanceForIndicator(foundInd.id)
    if (guidance) msgs.push({ type: 'guidance', content: guidance })
  }

  return {
    reviewRows: [{
      studentIds,
      studentNames,
      isClassWide: !!ctx.isClassWide,
      indicatorId: foundInd.id,
      indicatorLabel: foundInd.label,
      indicatorDimension: foundInd.dimension,
      points: foundInd.points,
      isNegative: foundInd.type === 'negative'
    }],
    aiMessages: msgs,
    pendingContext: null
  }
}

// ========== 兼容旧接口 ==========

export function parseVoiceReview(
  text: string,
  students: Student[]
): VoiceReviewResult[] {
  const results: VoiceReviewResult[] = []
  const sentences = text.split(/[，。；！？,;!?\n]+/).filter(s => s.trim())
  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue
    const sentenceResults = parseSentenceLegacy(trimmed, students)
    results.push(...sentenceResults)
  }
  return results
}

function matchBestIndicator(text: string) {
  const { indicator } = matchIndicatorWithScore(text)
  if (indicator) return indicator
  // 兜底
  const negativeWords = ['没', '不', '未', '迟', '差', '问题', '缺', '违', '坏', '吵', '打']
  const isNegative = negativeWords.some(w => text.includes(w))
  if (isNegative) {
    return { id: 'p05', label: '上课扰乱课堂秩序，影响他人学习', dimension: 'progress', type: 'negative' as const, points: -2 }
  }
  return { id: 'p04', label: '上课遵守纪律，不影响其他同学学习', dimension: 'progress', type: 'positive' as const, points: 1 }
}

function parseSentenceLegacy(sentence: string, students: Student[]): VoiceReviewResult[] {
  const isWholeClass = isClassWideIntent(sentence)
  const matchedStudents: Student[] = []
  if (!isWholeClass) {
    for (const student of students) {
      if (sentence.includes(student.name)) matchedStudents.push(student)
    }
    if (matchedStudents.length === 0) {
      for (const student of students) {
        const partName = student.name.length >= 3 ? student.name.substring(1) : student.name
        if (sentence.includes(partName)) matchedStudents.push(student)
      }
    }
  }
  const indicator = matchBestIndicator(sentence)
  if (!indicator) return []
  const isNegative = indicator.type === 'negative'

  if (isWholeClass) {
    return [{
      id: `vr_${Date.now()}_class`,
      studentName: `全班${students.length}人`,
      studentId: undefined,
      indicator: { id: indicator.id, label: indicator.label, dimension: indicator.dimension, points: indicator.points },
      isNegative,
      isClassWide: true
    } as VoiceReviewResult & { isClassWide?: boolean }]
  }

  if (matchedStudents.length > 0) {
    return matchedStudents.map(s => ({
      id: `vr_${Date.now()}_${s.id}`,
      studentName: s.name,
      studentId: s.id,
      indicator: { id: indicator.id, label: indicator.label, dimension: indicator.dimension, points: indicator.points },
      isNegative
    }))
  }

  const nameMatch = sentence.match(/^([^\s,，]{2,3})/u)
  return [{
    id: `vr_${Date.now()}_unknown`,
    studentName: nameMatch ? nameMatch[1] : '未识别',
    studentId: undefined,
    indicator: { id: indicator.id, label: indicator.label, dimension: indicator.dimension, points: indicator.points },
    isNegative
  }]
}

export function generateAIResponse(results: VoiceReviewResult[], isClassWide: boolean): string {
  if (results.length === 0) {
    return '抱歉，我没有理解您的点评内容。请再描述一下学生的表现，例如"小明今天认真听讲"。'
  }
  return '好的，识别到以下点评'
}

export function generateSuggestion(dimension: string): string {
  const suggestions: Record<string, string[]> = {
    happy: ['建议与学生进行一对一谈话，了解情绪变化原因', '可以组织一些轻松的活动帮助学生放松'],
    progress: ['可以设立小目标，帮助学生建立学习信心', '建议采用积分奖励制度激励学习'],
    elegant: ['建议通过角色扮演游戏学习礼仪', '可以设立"礼仪小标兵"激励学生'],
    generous: ['可以安排小组合作任务培养团队意识', '建议让学生担任班级小助手增强责任感']
  }
  const dimSuggestions = suggestions[dimension] || suggestions.progress
  return dimSuggestions[Math.floor(Math.random() * dimSuggestions.length)]
}
