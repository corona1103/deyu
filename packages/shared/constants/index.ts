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
    name: '快乐（身心健康）', icon: '😊', key: 'happy',
    indicators: [
      { id: 'h01', label: '保护自己，不做有危险的举动', type: 'positive', points: 1 },
      { id: 'h02', label: '做出危险举动，未做好自我保护', type: 'negative', points: -2 },
      { id: 'h03', label: '情节严重的危险举动/自我保护缺失行为', type: 'negative', points: -5 },
      { id: 'h04', label: '能判断他人的危险行为，并主动保持安全距离', type: 'positive', points: 1 },
      { id: 'h05', label: '主动靠近他人危险行为，未做好安全规避', type: 'negative', points: -2 },
      { id: 'h06', label: '情节严重的违规靠近他人危险行为', type: 'negative', points: -5 },
      { id: 'h07', label: '能合理判断自己的情绪状态', type: 'positive', points: 1 },
      { id: 'h08', label: '不开心时不随便发泄负面情绪', type: 'positive', points: 1 },
      { id: 'h09', label: '不开心时随意发泄情绪，影响他人', type: 'negative', points: -2 },
      { id: 'h10', label: '情节严重的情绪发泄、攻击他人行为', type: 'negative', points: -5 },
      { id: 'h11', label: '不挑食，按需打餐，尽量吃完所有食物', type: 'positive', points: 1 },
      { id: 'h12', label: '挑食、随意浪费食物', type: 'negative', points: -1 },
      { id: 'h13', label: '每天在校至少喝500ml水', type: 'positive', points: 1 },
      { id: 'h14', label: '在校每日饮水不足500ml', type: 'negative', points: -1 },
      { id: 'h15', label: '认真参与眼保健操、课间操，动作标准规范', type: 'positive', points: 1 },
      { id: 'h16', label: '不认真参与校内2操，动作敷衍不标准', type: 'negative', points: -1 },
      { id: 'h17', label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { id: 'h18', label: '每天做一件让自己开心的事，经常面带笑容', type: 'positive', points: 2 },
      { id: 'h19', label: '身体不舒服或情绪不好时，能主动向老师/家长求助', type: 'positive', points: 2 },
      { id: 'h20', label: '大课间、小课间主动到室外跑跳、运动', type: 'positive', points: 2 },
      { id: 'h21', label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { id: 'h22', label: '长期坚持一项自己喜欢的体育运动，养成运动习惯', type: 'positive', points: 3 },
      { id: 'h23', label: '体育运动长期坚持满1个月', type: 'positive', points: 5 },
      { id: 'h24', label: '有自己特别感兴趣的事，长期坚持并从中获得快乐', type: 'positive', points: 3 },
      { id: 'h25', label: '兴趣爱好长期坚持满1个月', type: 'positive', points: 5 },
    ]
  },
  {
    name: '进取（创新素养）', icon: '🚀', key: 'progress',
    indicators: [
      { id: 'p01', label: '按时完成所有作业', type: 'positive', points: 1 },
      { id: 'p02', label: '未按时完成作业，拖欠作业', type: 'negative', points: -2 },
      { id: 'p03', label: '情节严重的作业拖欠/拒不完成行为', type: 'negative', points: -5 },
      { id: 'p04', label: '上课遵守纪律，不影响其他同学学习', type: 'positive', points: 1 },
      { id: 'p05', label: '上课扰乱课堂秩序，影响他人学习', type: 'negative', points: -2 },
      { id: 'p06', label: '情节严重的课堂扰乱行为', type: 'negative', points: -5 },
      { id: 'p07', label: '课堂上主动举手回答问题，清晰表达自己的想法', type: 'positive', points: 1 },
      { id: 'p08', label: '课堂上不主动发言，拒绝表达自己的想法', type: 'negative', points: -1 },
      { id: 'p09', label: '有清晰的目标意识，能给自己制定合理的短期计划', type: 'positive', points: 1 },
      { id: 'p10', label: '无目标意识，不会制定短期学习/生活计划', type: 'negative', points: -1 },
      { id: 'p11', label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { id: 'p12', label: '主动向老师提问，学会对知识点提出质疑', type: 'positive', points: 2 },
      { id: 'p13', label: '面对有难度的任务不轻言放弃，愿意主动尝试', type: 'positive', points: 2 },
      { id: 'p14', label: '能按轻重缓急给事情分类，科学分配自己的时间', type: 'positive', points: 2 },
      { id: 'p15', label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { id: 'p16', label: '主动从多个角度思考和解决问题', type: 'positive', points: 3 },
      { id: 'p17', label: '发现可优化的地方，尝试用行动推动改变', type: 'positive', points: 3 },
      { id: 'p18', label: '行为优化落地成果显著', type: 'positive', points: 5 },
      { id: 'p19', label: '了解人工智能等最新科技发明，寻找技术应用场景', type: 'positive', points: 3 },
      { id: 'p20', label: '科技应用落地成果显著', type: 'positive', points: 5 },
    ]
  },
  {
    name: '儒雅（儒雅品格）', icon: '📚', key: 'elegant',
    indicators: [
      { id: 'e01', label: '不用言语、行为故意伤害他人', type: 'positive', points: 1 },
      { id: 'e02', label: '用言语、行为故意伤害同学/他人', type: 'negative', points: -2 },
      { id: 'e03', label: '情节严重的校园欺凌/伤害他人行为', type: 'negative', points: -5 },
      { id: 'e04', label: '不随意拿取别人物品、不破坏学校及公共财物', type: 'positive', points: 1 },
      { id: 'e05', label: '随意拿取他人物品、破坏公物/校园设施', type: 'negative', points: -2 },
      { id: 'e06', label: '情节严重的盗窃/恶意破坏公物行为', type: 'negative', points: -5 },
      { id: 'e07', label: '衣着得体整洁，个人物品摆放有序', type: 'positive', points: 1 },
      { id: 'e08', label: '衣着不整洁、个人物品摆放杂乱无章', type: 'negative', points: -1 },
      { id: 'e09', label: '见到师长主动问好，常用礼貌用语', type: 'positive', points: 1 },
      { id: 'e10', label: '见到师长不问好，日常不使用礼貌用语', type: 'negative', points: -1 },
      { id: 'e11', label: '他人说话时能安静倾听，不随意打断', type: 'positive', points: 1 },
      { id: 'e12', label: '随意打断他人说话，不尊重发言者', type: 'negative', points: -1 },
      { id: 'e13', label: '在学校楼道和室内场所轻步慢走、不追逐打闹', type: 'positive', points: 1 },
      { id: 'e14', label: '校内楼道、室内场所追逐打闹、不遵守公共秩序', type: 'negative', points: -1 },
      { id: 'e15', label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { id: 'e16', label: '与同学有小摩擦时能温和沟通，积极向老师寻求帮助', type: 'positive', points: 2 },
      { id: 'e17', label: '同学遇到困难或情绪低落时，能主动关心并提供帮助', type: 'positive', points: 2 },
      { id: 'e18', label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { id: 'e19', label: '保持稳定的情绪状态，不会轻易被外界小事影响', type: 'positive', points: 3 },
      { id: 'e20', label: '情绪稳定表现持续满1个月', type: 'positive', points: 5 },
      { id: 'e21', label: '保持每天安静阅读的良好习惯', type: 'positive', points: 3 },
      { id: 'e22', label: '每日阅读习惯持续满1个月', type: 'positive', points: 5 },
      { id: 'e23', label: '懂得欣赏多样性，倾听并包容不一样的想法', type: 'positive', points: 3 },
      { id: 'e24', label: '包容差异、尊重他人表现持续满1个月', type: 'positive', points: 5 },
    ]
  },
  {
    name: '大气（责任担当）', icon: '💪', key: 'generous',
    indicators: [
      { id: 'g01', label: '升旗时主动行礼、大声唱国歌、全程肃立', type: 'positive', points: 1 },
      { id: 'g02', label: '升旗时不遵守礼仪，不行礼、不唱国歌', type: 'negative', points: -2 },
      { id: 'g03', label: '情节严重的升旗礼仪违规行为', type: 'negative', points: -5 },
      { id: 'g04', label: '不损坏国旗、队旗等标志，规范佩戴红领巾', type: 'positive', points: 1 },
      { id: 'g05', label: '损坏国旗、队旗、红领巾等标志', type: 'negative', points: -2 },
      { id: 'g06', label: '情节严重的国旗/队旗/红领巾损毁行为', type: 'negative', points: -5 },
      { id: 'g07', label: '有集体荣誉感，积极参加集体活动，认真完成值日工作', type: 'positive', points: 1 },
      { id: 'g08', label: '无集体荣誉感，拒绝参与集体活动、不认真完成值日', type: 'negative', points: -1 },
      { id: 'g09', label: '热爱学校，爱护校园一草一木，不乱扔垃圾', type: 'positive', points: 1 },
      { id: 'g10', label: '破坏校园环境、乱扔垃圾、损坏花草树木', type: 'negative', points: -1 },
      { id: 'g11', label: '单日日常达标行为全项完成', type: 'positive', points: 1 },
      { id: 'g12', label: '遇事对人不斤斤计较，乐于分享自己的物品/知识', type: 'positive', points: 2 },
      { id: 'g13', label: '主动为集体服务，为班级、学校做力所能及的事', type: 'positive', points: 2 },
      { id: 'g14', label: '了解家乡非遗、传统节日习俗或历史人物故事，并主动分享', type: 'positive', points: 2 },
      { id: 'g15', label: '主动关心社会时事，对祖国发展感到自豪', type: 'positive', points: 2 },
      { id: 'g16', label: '单日引领成长行为全项完成', type: 'positive', points: 1 },
      { id: 'g17', label: '积极参与跨区域、跨国家的交流与学习', type: 'positive', points: 3 },
      { id: 'g18', label: '跨文化交流学习成果显著', type: 'positive', points: 5 },
      { id: 'g19', label: '积极传播本土先进文化，不盲目推崇他国文化', type: 'positive', points: 3 },
      { id: 'g20', label: '本土文化传播成果显著', type: 'positive', points: 5 },
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

// 学科列表
export const SUBJECTS = ['语文', '数学', '英语', '其他'] as const

// 学科颜色（用于标签）
export const SUBJECT_COLORS: Record<string, string> = {
  '语文': '#E53935',
  '数学': '#1E88E5',
  '英语': '#43A047',
  '其他': '#78909C'
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
