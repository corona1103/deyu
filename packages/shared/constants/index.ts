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
      // ── 日常达标：安全行为 ──
      { id: 'H01', label: '课间活动遵守安全规则，不翻越栏杆、不攀爬窗台', type: 'positive', points: 1 },
      { id: 'H02', label: '发现同学做危险动作时主动劝阻或报告老师', type: 'positive', points: 1 },
      // ── 日常达标：情绪管理 ──
      { id: 'H03', label: '能用语言表达自己当前的情绪', type: 'positive', points: 1 },
      { id: 'H04', label: '不开心时不随便发泄负面情绪', type: 'positive', points: 1 },
      // ── 日常达标：饮食健康 ──
      { id: 'H05', label: '不挑食，按需打餐，尽量吃完所有食物', type: 'positive', points: 1 },
      { id: 'H06', label: '挑食、随意浪费食物', type: 'negative', points: -1 },
      { id: 'H07', label: '每天在校至少喝500ml水', type: 'positive', points: 1 },
      { id: 'H08', label: '在校每日饮水不足500ml', type: 'negative', points: -1 },
      // ── 日常达标：卫生习惯 ──
      { id: 'H09', label: '午餐后主动漱口、洗手，保持个人卫生习惯', type: 'positive', points: 1 },
      { id: 'H10', label: '主动调整坐姿，保持正确的读写姿势', type: 'positive', points: 1 },
      { id: 'H11', label: '按时作息，课间不趴桌睡觉、精神状态饱满', type: 'positive', points: 1 },
      // ── 日常达标：体育锻炼 ──
      { id: 'H12', label: '认真参与眼保健操、课间操，动作标准规范', type: 'positive', points: 1 },
      { id: 'H13', label: '不认真参与校内两操，动作敷衍不标准', type: 'negative', points: -1 },
      { id: 'H14', label: '每日完成100个跳绳', type: 'positive', points: 1 },
      { id: 'H15', label: '课间主动到室外呼吸新鲜空气、适当活动', type: 'positive', points: 1 },
      { id: 'H16', label: '体育课、体育锻炼消极懈怠', type: 'negative', points: -1 },
      // ── 引领成长：积极心态 ──
      { id: 'H17', label: '主动做一件让自己开心的事，并向同学分享快乐', type: 'positive', points: 2 },
      { id: 'H18', label: '遇到困难时能自我鼓励，说"我再试试"而不是放弃', type: 'positive', points: 2 },
      // ── 引领成长：情绪调节 ──
      { id: 'H19', label: '能用深呼吸、暂时离开等方式自主调节负面情绪', type: 'positive', points: 2 },
      { id: 'H20', label: '身体不舒服或情绪不好时，能主动向老师/家长求助', type: 'positive', points: 2 },
      { id: 'H21', label: '同学不开心时主动安慰、陪伴，帮助他人调节情绪', type: 'positive', points: 2 },
      // ── 引领成长：运动社交 ──
      { id: 'H22', label: '大课间、小课间主动到室外跑跳、运动', type: 'positive', points: 2 },
      { id: 'H23', label: '课间主动邀请落单的同学一起运动或游戏', type: 'positive', points: 2 },
      // ── 特色发展：运动坚持 ──
      { id: 'H24', label: '坚持参加一项体育运动（如跑步、篮球、跳绳等），本周有3次以上运动记录', type: 'positive', points: 3 },
      { id: 'H25', label: '参加运动会、体育比赛', type: 'positive', points: 3 },
      { id: 'H26', label: '在体育活动中取得进步（如跳绳数量提升、跑步成绩进步）', type: 'positive', points: 3 },
      { id: 'H27', label: '主动在班级分享自己的运动心得或健康小知识', type: 'positive', points: 3 },
      // ── 特色发展：兴趣发展 ──
      { id: 'H28', label: '有自己特别感兴趣的事，能在班级展示或分享自己的成果', type: 'positive', points: 3 },
      // ── 特色发展：突出成果 ──
      { id: 'H29', label: '参加运动会或体育比赛取得名次', type: 'positive', points: 5 },
      { id: 'H30', label: '兴趣特长在校级及以上活动中展示或获奖', type: 'positive', points: 5 },
      // ── 底线预警：自我安全 ──
      { id: 'H31', label: '做出危险举动，未做好自我保护', type: 'negative', points: -2 },
      { id: 'H32', label: '情节严重的危险举动/自我保护缺失行为', type: 'negative', points: -5 },
      // ── 底线预警：他人安全 ──
      { id: 'H33', label: '主动靠近他人危险行为，未做好安全规避', type: 'negative', points: -2 },
      { id: 'H34', label: '情节严重的违规靠近他人危险行为', type: 'negative', points: -5 },
      // ── 底线预警：情绪失控 ──
      { id: 'H35', label: '不开心时随意发泄情绪，影响他人', type: 'negative', points: -2 },
      { id: 'H36', label: '情节严重的情绪发泄、攻击他人行为', type: 'negative', points: -5 },
    ]
  },
  {
    name: '进取（创新素养）', icon: '🚀', key: 'progress',
    indicators: [
      // ── 日常达标：作业提交 ──
      { id: 'P01', label: '按时完成作业', type: 'positive', points: 1 },
      { id: 'P02', label: '作业超时但主动补交完成', type: 'positive', points: 1 },
      { id: 'P03', label: '未交作业且未主动说明原因', type: 'negative', points: -1 },
      // ── 日常达标：作业质量 ──
      { id: 'P04', label: '作业书写工整、格式规范', type: 'positive', points: 1 },
      { id: 'P05', label: '订正作业认真及时', type: 'positive', points: 1 },
      { id: 'P06', label: '作业质量不佳（字迹潦草、错误多、不完整）', type: 'negative', points: -1 },
      { id: 'P07', label: '未订正作业或订正不认真', type: 'negative', points: -1 },
      // ── 日常达标：课堂纪律 ──
      { id: 'P08', label: '上课遵守纪律，不影响其他同学学习', type: 'positive', points: 1 },
      { id: 'P09', label: '课堂纪律差（不认真听讲、做小动作、讲话）', type: 'negative', points: -1 },
      // ── 日常达标：课堂参与 ──
      { id: 'P10', label: '课堂上主动举手回答问题，清晰表达自己的想法', type: 'positive', points: 1 },
      { id: 'P11', label: '积极参与课堂展示或小组活动', type: 'positive', points: 1 },
      { id: 'P12', label: '被老师点名后拒绝回答问题或参与讨论', type: 'negative', points: -1 },
      // ── 日常达标：目标规划 ──
      { id: 'P13', label: '能给自己设定本周学习小目标并努力完成', type: 'positive', points: 1 },
      { id: 'P14', label: '不会合理安排课间和放学后的时间，经常拖延', type: 'negative', points: -1 },
      // ── 日常达标：考试 ──
      { id: 'P15', label: '考试合格', type: 'positive', points: 1 },
      // ── 日常达标：艺术参与 ──
      { id: 'P16', label: '按时认真完成艺术类作业（美术/音乐）', type: 'positive', points: 1 },
      { id: 'P17', label: '积极参与课堂互动，乐于展示才艺', type: 'positive', points: 1 },
      { id: 'P18', label: '积极参与艺术作品讨论，发表自己的看法', type: 'positive', points: 1 },
      { id: 'P19', label: '不参与课堂艺术讨论，消极应付', type: 'negative', points: -1 },
      // ── 引领成长：作业 ──
      { id: 'P20', label: '提前完成并提交作业', type: 'positive', points: 2 },
      { id: 'P21', label: '作业完成质量良好，获得老师表扬', type: 'positive', points: 2 },
      // ── 引领成长：思维与探究 ──
      { id: 'P22', label: '主动向老师提问，敢于对知识点提出质疑', type: 'positive', points: 2 },
      { id: 'P23', label: '面对有难度的任务不轻言放弃，愿意主动尝试', type: 'positive', points: 2 },
      { id: 'P24', label: '能按轻重缓急给事情分类，科学分配自己的时间', type: 'positive', points: 2 },
      // ── 引领成长：考试 ──
      { id: 'P25', label: '考试良好', type: 'positive', points: 3 },
      // ── 引领成长：艺术创作 ──
      { id: 'P26', label: '艺术作品（美术、手工等）具有创意，获得认可', type: 'positive', points: 2 },
      { id: 'P27', label: '尝试运用不同的绘画工具或材料进行创作', type: 'positive', points: 2 },
      // ── 特色发展：作业 ──
      { id: 'P28', label: '作业被评为"优秀作业"并在班级展示', type: 'positive', points: 3 },
      // ── 特色发展：创新思维 ──
      { id: 'P29', label: '主动从多个角度思考和解决问题', type: 'positive', points: 2 },
      { id: 'P30', label: '发现可优化的地方，尝试用行动推动改变', type: 'positive', points: 2 },
      { id: 'P31', label: '发现班级或学校中的问题并提出改进方案，被老师采纳', type: 'positive', points: 3 },
      // ── 特色发展：科技素养 ──
      { id: 'P32', label: '了解人工智能等最新科技发明，在班级做科技分享', type: 'positive', points: 3 },
      { id: 'P33', label: '完成一项科技小制作或编程作品并在班级展示', type: 'positive', points: 5 },
      // ── 特色发展：考试 ──
      { id: 'P34', label: '考试进步大', type: 'positive', points: 3 },
      { id: 'P35', label: '考试优秀', type: 'positive', points: 5 },
      // ── 特色发展：艺术特长 ──
      { id: 'P36', label: '积极参加艺术活动、艺术社团或校级演出', type: 'positive', points: 2 },
      // ── 底线预警：作业 ──
      { id: 'P37', label: '未按时完成作业，拖欠作业', type: 'negative', points: -2 },
      { id: 'P38', label: '情节严重的作业拖欠/拒不完成行为', type: 'negative', points: -5 },
      // ── 底线预警：课堂 ──
      { id: 'P39', label: '上课扰乱课堂秩序，影响他人学习', type: 'negative', points: -2 },
      { id: 'P40', label: '情节严重的课堂扰乱行为', type: 'negative', points: -5 },
      // ── 底线预警：考试 ──
      { id: 'P41', label: '考试不合格', type: 'negative', points: -2 },
      { id: 'P42', label: '考试退步大', type: 'negative', points: -2 },
    ]
  },
  {
    name: '儒雅（儒雅品格）', icon: '📚', key: 'elegant',
    indicators: [
      // ── 日常达标：文明礼貌 ──
      { id: 'E01', label: '见到师长主动问好，常用礼貌用语', type: 'positive', points: 1 },
      { id: 'E02', label: '见到师长不问好，日常不使用礼貌用语', type: 'negative', points: -1 },
      { id: 'E03', label: '他人说话时能安静倾听，不随意打断', type: 'positive', points: 1 },
      { id: 'E04', label: '随意打断他人说话，不尊重发言者', type: 'negative', points: -1 },
      { id: 'E05', label: '轻拿轻放餐具，用餐时保持安静', type: 'positive', points: 1 },
      { id: 'E06', label: '讲粗话、脏话', type: 'negative', points: -1 },
      // ── 日常达标：仪容整洁 ──
      { id: 'E07', label: '衣着得体整洁，个人物品摆放有序', type: 'positive', points: 1 },
      { id: 'E08', label: '衣着不整洁、个人物品摆放杂乱无章', type: 'negative', points: -1 },
      { id: 'E09', label: '个人卫生良好，衣着整洁', type: 'positive', points: 1 },
      { id: 'E10', label: '个人物品、课桌、地面等不整洁', type: 'negative', points: -1 },
      // ── 日常达标：秩序纪律 ──
      { id: 'E11', label: '在学校楼道和室内场所轻步慢走、不追逐打闹', type: 'positive', points: 1 },
      { id: 'E12', label: '校内楼道、室内场所追逐打闹、不遵守公共秩序', type: 'negative', points: -1 },
      // ── 日常达标：诚信品格 ──
      { id: 'E13', label: '勇于承认错误、及时改正', type: 'positive', points: 1 },
      { id: 'E14', label: '捡到东西及时交还、借的东西按时归还', type: 'positive', points: 1 },
      { id: 'E15', label: '说谎、掩饰错误、言而无信', type: 'negative', points: -1 },
      // ── 日常达标：尊重财物 ──
      { id: 'E16', label: '不用言语、行为故意伤害他人', type: 'positive', points: 1 },
      { id: 'E17', label: '不随意拿取别人物品、不破坏学校及公共财物', type: 'positive', points: 1 },
      // ── 日常达标：劳动值日 ──
      { id: 'E18', label: '及时完成值日任务', type: 'positive', points: 1 },
      { id: 'E19', label: '未及时完成值日任务', type: 'negative', points: -1 },
      { id: 'E20', label: '不愿意参加劳动，逃避值日或打扫', type: 'negative', points: -1 },
      // ── 引领成长：同伴关系 ──
      { id: 'E21', label: '与同学有小摩擦时能温和沟通，积极向老师寻求帮助', type: 'positive', points: 2 },
      { id: 'E22', label: '同学遇到困难或情绪低落时，能主动关心并提供帮助', type: 'positive', points: 2 },
      // ── 引领成长：整洁卫生 ──
      { id: 'E23', label: '个人物品、课桌、地面等日常保持整洁', type: 'positive', points: 2 },
      { id: 'E24', label: '主动维护教室的良好卫生', type: 'positive', points: 2 },
      { id: 'E25', label: '值日主动认真，打扫卫生干净彻底', type: 'positive', points: 2 },
      // ── 引领成长：劳动服务 ──
      { id: 'E26', label: '主动帮助他人劳动（如帮同学打扫、搬东西）', type: 'positive', points: 2 },
      { id: 'E27', label: '担任公益劳动或志愿服务的小志愿者', type: 'positive', points: 2 },
      // ── 引领成长：生活能力 ──
      { id: 'E28', label: '在家能制作简单的食物（如水果拼盘、三明治）', type: 'positive', points: 2 },
      // ── 特色发展：情绪品格 ──
      { id: 'E29', label: '遇到挫折或批评时能冷静应对，不发脾气、不哭闹', type: 'positive', points: 3 },
      // ── 特色发展：阅读习惯 ──
      { id: 'E30', label: '每天坚持安静阅读至少15分钟', type: 'positive', points: 3 },
      // ── 特色发展：包容品格 ──
      { id: 'E31', label: '懂得欣赏多样性，倾听并包容不一样的想法', type: 'positive', points: 3 },
      // ── 特色发展：社会实践 ──
      { id: 'E32', label: '积极参加社会实践活动（如社区服务、环保行动）', type: 'positive', points: 3 },
      // ── 特色发展：突出成果 ──
      { id: 'E33', label: '获评校级或年级文明礼仪标兵', type: 'positive', points: 5 },
      { id: 'E34', label: '组织或参与社会实践活动并在班级做分享汇报', type: 'positive', points: 5 },
      // ── 底线预警：伤害他人 ──
      { id: 'E35', label: '用言语、行为故意伤害同学/他人', type: 'negative', points: -2 },
      { id: 'E36', label: '情节严重的校园欺凌/伤害他人行为', type: 'negative', points: -5 },
      // ── 底线预警：财物破坏 ──
      { id: 'E37', label: '随意拿取他人物品、破坏公物/校园设施', type: 'negative', points: -2 },
      { id: 'E38', label: '情节严重的盗窃/恶意破坏公物行为', type: 'negative', points: -5 },
      // ── 底线预警：诚信违规 ──
      { id: 'E39', label: '抄作业', type: 'negative', points: -2 },
      { id: 'E40', label: '考试作弊', type: 'negative', points: -3 },
      { id: 'E41', label: '私自携带违禁物品（如手机、危险物品）', type: 'negative', points: -2 },
    ]
  },
  {
    name: '大气（责任担当）', icon: '💪', key: 'generous',
    indicators: [
      // ── 日常达标：爱国礼仪 ──
      { id: 'G01', label: '升旗时主动行礼、大声唱国歌、全程肃立', type: 'positive', points: 1 },
      { id: 'G02', label: '不损坏国旗、队旗等标志，规范佩戴红领巾', type: 'positive', points: 1 },
      { id: 'G03', label: '能认真倾听国旗下讲话，了解每周德育主题', type: 'positive', points: 1 },
      // ── 日常达标：校园环境 ──
      { id: 'G04', label: '热爱学校，爱护校园一草一木，不乱扔垃圾', type: 'positive', points: 1 },
      { id: 'G05', label: '主动捡起地上的垃圾，即使不是自己扔的', type: 'positive', points: 1 },
      { id: 'G06', label: '看到教室门窗未关、电灯未关时主动处理', type: 'positive', points: 1 },
      { id: 'G07', label: '节约用水用电，不浪费学校公共资源', type: 'positive', points: 1 },
      { id: 'G08', label: '破坏校园环境、乱扔垃圾、损坏花草树木', type: 'negative', points: -1 },
      // ── 日常达标：集体活动 ──
      { id: 'G09', label: '有集体荣誉感，积极参加集体活动，认真完成值日工作', type: 'positive', points: 1 },
      { id: 'G10', label: '善于沟通，与同学关系和谐', type: 'positive', points: 1 },
      { id: 'G11', label: '拒绝参与集体活动、不认真完成值日', type: 'negative', points: -1 },
      { id: 'G12', label: '不参加集体活动，消极应付', type: 'negative', points: -1 },
      { id: 'G13', label: '在集体活动中与同学产生冲突', type: 'negative', points: -1 },
      // ── 引领成长：分享服务 ──
      { id: 'G14', label: '遇事对人不斤斤计较，乐于分享自己的物品/知识', type: 'positive', points: 2 },
      { id: 'G15', label: '主动为集体服务，为班级、学校做力所能及的事', type: 'positive', points: 2 },
      { id: 'G16', label: '主动承担班级任务（如收发作业、整理图书角、管理班级物品）', type: 'positive', points: 2 },
      { id: 'G17', label: '发现班级问题时主动向老师提建议，而不是抱怨或忽视', type: 'positive', points: 2 },
      // ── 引领成长：集体表现 ──
      { id: 'G18', label: '在集体活动中表现突出，获得老师或同学认可', type: 'positive', points: 2 },
      { id: 'G19', label: '乐于参加集体活动并承担组织或协调角色', type: 'positive', points: 2 },
      // ── 引领成长：视野认知 ──
      { id: 'G20', label: '了解家乡非遗、传统节日习俗或历史人物故事，并主动分享', type: 'positive', points: 2 },
      { id: 'G21', label: '主动关心社会时事，对祖国发展感到自豪', type: 'positive', points: 2 },
      { id: 'G22', label: '主动阅读新闻或科普读物，并在班级分享自己的见闻', type: 'positive', points: 2 },
      { id: 'G23', label: '在班级讨论中能理解和尊重不同同学的观点，不嘲笑他人意见', type: 'positive', points: 2 },
      // ── 特色发展：公益担当 ──
      { id: 'G24', label: '参加学校或社区组织的公益活动（如义卖、环保行动、敬老院慰问）', type: 'positive', points: 3 },
      // ── 特色发展：文化传播 ──
      { id: 'G25', label: '积极传播本土先进文化（如向外国友人介绍中国文化）', type: 'positive', points: 3 },
      { id: 'G26', label: '制作传统文化作品（如书法、手工、小报）并在校内展示', type: 'positive', points: 5 },
      // ── 特色发展：国际视野 ──
      { id: 'G27', label: '能向同学介绍一个其他国家或民族的文化特色，展现国际视野', type: 'positive', points: 3 },
      { id: 'G28', label: '积极参与跨区域、跨国家的交流与学习', type: 'positive', points: 3 },
      { id: 'G29', label: '参加跨区域或跨国家的交流活动，并在班级做分享汇报', type: 'positive', points: 5 },
      // ── 底线预警：爱国礼仪 ──
      { id: 'G30', label: '升旗时不遵守礼仪，不行礼、不唱国歌', type: 'negative', points: -2 },
      { id: 'G31', label: '情节严重的升旗礼仪违规行为', type: 'negative', points: -5 },
      { id: 'G32', label: '损坏国旗、队旗、红领巾等标志', type: 'negative', points: -2 },
      { id: 'G33', label: '情节严重的国旗/队旗/红领巾损毁行为', type: 'negative', points: -5 },
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
