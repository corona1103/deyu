import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BehaviorRecord, StatPeriod } from '@shared/types'
import { MORAL_DIMENSION_INDICATORS, MORAL_DIMENSIONS_NEW } from '@shared/constants'
import { useStudentsStore } from './students'

// ============ Mock 行为记录数据 ============

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60))
  return d
}

// 为每个学生生成丰富的 mock 行为记录，覆盖四个维度、跨多周
function generateMockRecords(): BehaviorRecord[] {
  const records: BehaviorRecord[] = []
  let rid = 1

  // c1 学生记录 (s1-s16)
  const c1Records: { sid: string; dim: string; indId: string; desc: string; points: number; type: 'positive' | 'negative'; day: number }[] = [
    // ---- 徐婉云 s1 ----
    { sid: 's1', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己，不做有危险的举动', points: 1, type: 'positive', day: 1 },
    { sid: 's1', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事，经常面带笑容', points: 2, type: 'positive', day: 3 },
    { sid: 's1', dim: '快乐（身心健康）', indId: 'h20', desc: '大课间主动到室外运动', points: 2, type: 'positive', day: 5 },
    { sid: 's1', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's1', dim: '进取（创新素养）', indId: 'p07', desc: '课堂上主动举手回答问题', points: 1, type: 'positive', day: 2 },
    { sid: 's1', dim: '进取（创新素养）', indId: 'p12', desc: '主动向老师提问', points: 2, type: 'positive', day: 4 },
    { sid: 's1', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 1 },
    { sid: 's1', dim: '儒雅（儒雅品格）', indId: 'e17', desc: '同学遇到困难时主动帮助', points: 2, type: 'positive', day: 6 },
    { sid: 's1', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 2 },
    { sid: 's1', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 7 },
    // 月度记录
    { sid: 's1', dim: '快乐（身心健康）', indId: 'h22', desc: '长期坚持跳绳运动', points: 3, type: 'positive', day: 15 },
    { sid: 's1', dim: '进取（创新素养）', indId: 'p16', desc: '主动从多角度思考问题', points: 3, type: 'positive', day: 20 },
    { sid: 's1', dim: '儒雅（儒雅品格）', indId: 'e21', desc: '保持每天安静阅读', points: 3, type: 'positive', day: 18 },

    // ---- 孙沐昀 s2 ----
    { sid: 's2', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己，不做有危险的举动', points: 1, type: 'positive', day: 1 },
    { sid: 's2', dim: '快乐（身心健康）', indId: 'h07', desc: '能合理判断自己的情绪状态', points: 1, type: 'positive', day: 3 },
    { sid: 's2', dim: '快乐（身心健康）', indId: 'h11', desc: '不挑食，按需打餐', points: 1, type: 'positive', day: 5 },
    { sid: 's2', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's2', dim: '进取（创新素养）', indId: 'p04', desc: '上课遵守纪律', points: 1, type: 'positive', day: 2 },
    { sid: 's2', dim: '进取（创新素养）', indId: 'p13', desc: '面对有难度的任务不轻言放弃', points: 2, type: 'positive', day: 4 },
    { sid: 's2', dim: '进取（创新素养）', indId: 'p19', desc: '了解人工智能等最新科技发明', points: 3, type: 'positive', day: 10 },
    { sid: 's2', dim: '儒雅（儒雅品格）', indId: 'e01', desc: '不用言语行为故意伤害他人', points: 1, type: 'positive', day: 1 },
    { sid: 's2', dim: '儒雅（儒雅品格）', indId: 'e07', desc: '衣着得体整洁', points: 1, type: 'positive', day: 3 },
    { sid: 's2', dim: '大气（责任担当）', indId: 'g01', desc: '升旗时主动行礼、大声唱国歌', points: 1, type: 'positive', day: 2 },
    { sid: 's2', dim: '大气（责任担当）', indId: 'g12', desc: '乐于分享自己的知识', points: 2, type: 'positive', day: 6 },
    { sid: 's2', dim: '大气（责任担当）', indId: 'g14', desc: '了解家乡传统节日习俗并主动分享', points: 2, type: 'positive', day: 12 },

    // ---- 刘玥希 s3 (表现一般，有扣分) ----
    { sid: 's3', dim: '快乐（身心健康）', indId: 'h09', desc: '不开心时随意发泄情绪', points: -2, type: 'negative', day: 2 },
    { sid: 's3', dim: '快乐（身心健康）', indId: 'h12', desc: '挑食、随意浪费食物', points: -1, type: 'negative', day: 4 },
    { sid: 's3', dim: '快乐（身心健康）', indId: 'h15', desc: '认真参与眼保健操', points: 1, type: 'positive', day: 5 },
    { sid: 's3', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 1 },
    { sid: 's3', dim: '进取（创新素养）', indId: 'p05', desc: '上课扰乱课堂秩序', points: -2, type: 'negative', day: 3 },
    { sid: 's3', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 6 },
    { sid: 's3', dim: '儒雅（儒雅品格）', indId: 'e02', desc: '用言语故意伤害同学', points: -2, type: 'negative', day: 3 },
    { sid: 's3', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 5 },
    { sid: 's3', dim: '大气（责任担当）', indId: 'g08', desc: '不认真完成值日', points: -1, type: 'negative', day: 2 },
    { sid: 's3', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 7 },
    // 月度
    { sid: 's3', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 15 },
    { sid: 's3', dim: '儒雅（儒雅品格）', indId: 'e12', desc: '随意打断他人说话', points: -1, type: 'negative', day: 18 },

    // ---- 毛昱涵 s4 ----
    { sid: 's4', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己，不做有危险的举动', points: 1, type: 'positive', day: 1 },
    { sid: 's4', dim: '快乐（身心健康）', indId: 'h13', desc: '每天在校至少喝500ml水', points: 1, type: 'positive', day: 3 },
    { sid: 's4', dim: '进取（创新素养）', indId: 'p07', desc: '课堂上主动举手回答问题', points: 1, type: 'positive', day: 2 },
    { sid: 's4', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 4 },
    { sid: 's4', dim: '儒雅（儒雅品格）', indId: 'e11', desc: '他人说话时能安静倾听', points: 1, type: 'positive', day: 2 },
    { sid: 's4', dim: '大气（责任担当）', indId: 'g09', desc: '爱护校园一草一木', points: 1, type: 'positive', day: 3 },

    // ---- 李渡嘉 s5 (优秀生) ----
    { sid: 's5', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己，不做有危险的举动', points: 1, type: 'positive', day: 1 },
    { sid: 's5', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事', points: 2, type: 'positive', day: 2 },
    { sid: 's5', dim: '快乐（身心健康）', indId: 'h22', desc: '长期坚持篮球运动', points: 3, type: 'positive', day: 8 },
    { sid: 's5', dim: '快乐（身心健康）', indId: 'h24', desc: '有自己特别感兴趣的事', points: 3, type: 'positive', day: 14 },
    { sid: 's5', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's5', dim: '进取（创新素养）', indId: 'p07', desc: '课堂上主动举手回答问题', points: 1, type: 'positive', day: 2 },
    { sid: 's5', dim: '进取（创新素养）', indId: 'p12', desc: '主动向老师提问', points: 2, type: 'positive', day: 3 },
    { sid: 's5', dim: '进取（创新素养）', indId: 'p16', desc: '主动从多个角度思考问题', points: 3, type: 'positive', day: 10 },
    { sid: 's5', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 1 },
    { sid: 's5', dim: '儒雅（儒雅品格）', indId: 'e17', desc: '同学遇到困难时主动帮助', points: 2, type: 'positive', day: 4 },
    { sid: 's5', dim: '儒雅（儒雅品格）', indId: 'e21', desc: '保持每天安静阅读', points: 3, type: 'positive', day: 12 },
    { sid: 's5', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 1 },
    { sid: 's5', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 5 },
    { sid: 's5', dim: '大气（责任担当）', indId: 'g14', desc: '了解家乡传统节日习俗', points: 2, type: 'positive', day: 9 },

    // ---- 张书斌 s6 ----
    { sid: 's6', dim: '快乐（身心健康）', indId: 'h20', desc: '大课间主动到室外运动', points: 2, type: 'positive', day: 1 },
    { sid: 's6', dim: '快乐（身心健康）', indId: 'h07', desc: '能合理判断自己的情绪状态', points: 1, type: 'positive', day: 3 },
    { sid: 's6', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's6', dim: '进取（创新素养）', indId: 'p14', desc: '能按轻重缓急给事情分类', points: 2, type: 'positive', day: 5 },
    { sid: 's6', dim: '儒雅（儒雅品格）', indId: 'e13', desc: '在学校楼道轻步慢走', points: 1, type: 'positive', day: 2 },
    { sid: 's6', dim: '儒雅（儒雅品格）', indId: 'e16', desc: '与同学小摩擦时能温和沟通', points: 2, type: 'positive', day: 4 },
    { sid: 's6', dim: '大气（责任担当）', indId: 'g01', desc: '升旗时主动行礼', points: 1, type: 'positive', day: 2 },
    { sid: 's6', dim: '大气（责任担当）', indId: 'g15', desc: '主动关心社会时事', points: 2, type: 'positive', day: 8 },

    // ---- 邱翌泽 s7 (中等，偶有扣分) ----
    { sid: 's7', dim: '快乐（身心健康）', indId: 'h16', desc: '不认真参与校内2操', points: -1, type: 'negative', day: 2 },
    { sid: 's7', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 4 },
    { sid: 's7', dim: '进取（创新素养）', indId: 'p08', desc: '课堂上不主动发言', points: -1, type: 'negative', day: 1 },
    { sid: 's7', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 3 },
    { sid: 's7', dim: '儒雅（儒雅品格）', indId: 'e10', desc: '见到师长不问好', points: -1, type: 'negative', day: 3 },
    { sid: 's7', dim: '儒雅（儒雅品格）', indId: 'e07', desc: '衣着得体整洁', points: 1, type: 'positive', day: 5 },
    { sid: 's7', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 2 },

    // ---- 张惟瑄 s8 ----
    { sid: 's8', dim: '快乐（身心健康）', indId: 'h19', desc: '身体不舒服时主动向老师求助', points: 2, type: 'positive', day: 3 },
    { sid: 's8', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's8', dim: '进取（创新素养）', indId: 'p07', desc: '课堂上主动举手回答问题', points: 1, type: 'positive', day: 4 },
    { sid: 's8', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 2 },
    { sid: 's8', dim: '儒雅（儒雅品格）', indId: 'e11', desc: '他人说话时能安静倾听', points: 1, type: 'positive', day: 5 },
    { sid: 's8', dim: '大气（责任担当）', indId: 'g09', desc: '爱护校园一草一木', points: 1, type: 'positive', day: 3 },

    // ---- 马子扬 s9 ----
    { sid: 's9', dim: '快乐（身心健康）', indId: 'h02', desc: '做出危险举动', points: -2, type: 'negative', day: 2 },
    { sid: 's9', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 5 },
    { sid: 's9', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 1 },
    { sid: 's9', dim: '进取（创新素养）', indId: 'p04', desc: '上课遵守纪律', points: 1, type: 'positive', day: 4 },
    { sid: 's9', dim: '儒雅（儒雅品格）', indId: 'e14', desc: '校内楼道追逐打闹', points: -1, type: 'negative', day: 3 },
    { sid: 's9', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 6 },

    // ---- 张京钰 s10 ----
    { sid: 's10', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事', points: 2, type: 'positive', day: 2 },
    { sid: 's10', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's10', dim: '进取（创新素养）', indId: 'p09', desc: '有清晰的目标意识', points: 1, type: 'positive', day: 4 },
    { sid: 's10', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 1 },
    { sid: 's10', dim: '儒雅（儒雅品格）', indId: 'e23', desc: '懂得欣赏多样性', points: 3, type: 'positive', day: 10 },
    { sid: 's10', dim: '大气（责任担当）', indId: 'g12', desc: '乐于分享自己的知识', points: 2, type: 'positive', day: 5 },

    // ---- 刘燕杭 s11 ----
    { sid: 's11', dim: '快乐（身心健康）', indId: 'h15', desc: '认真参与眼保健操', points: 1, type: 'positive', day: 1 },
    { sid: 's11', dim: '快乐（身心健康）', indId: 'h20', desc: '大课间主动到室外运动', points: 2, type: 'positive', day: 3 },
    { sid: 's11', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's11', dim: '进取（创新素养）', indId: 'p13', desc: '面对有难度的任务不轻言放弃', points: 2, type: 'positive', day: 4 },
    { sid: 's11', dim: '儒雅（儒雅品格）', indId: 'e01', desc: '不用言语行为故意伤害他人', points: 1, type: 'positive', day: 2 },
    { sid: 's11', dim: '儒雅（儒雅品格）', indId: 'e19', desc: '保持稳定的情绪状态', points: 3, type: 'positive', day: 12 },
    { sid: 's11', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 6 },

    // ---- 王泊远 s12 ----
    { sid: 's12', dim: '快乐（身心健康）', indId: 'h14', desc: '在校每日饮水不足500ml', points: -1, type: 'negative', day: 2 },
    { sid: 's12', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 4 },
    { sid: 's12', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's12', dim: '儒雅（儒雅品格）', indId: 'e08', desc: '个人物品摆放杂乱', points: -1, type: 'negative', day: 3 },
    { sid: 's12', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 5 },
    { sid: 's12', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 2 },

    // ---- 程浩月 s13 ----
    { sid: 's13', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 1 },
    { sid: 's13', dim: '快乐（身心健康）', indId: 'h07', desc: '能合理判断自己的情绪状态', points: 1, type: 'positive', day: 3 },
    { sid: 's13', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's13', dim: '进取（创新素养）', indId: 'p12', desc: '主动向老师提问', points: 2, type: 'positive', day: 5 },
    { sid: 's13', dim: '儒雅（儒雅品格）', indId: 'e17', desc: '同学遇到困难时主动帮助', points: 2, type: 'positive', day: 4 },
    { sid: 's13', dim: '大气（责任担当）', indId: 'g01', desc: '升旗时主动行礼', points: 1, type: 'positive', day: 2 },
    { sid: 's13', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 7 },

    // ---- 孙雅诺 s14 ----
    { sid: 's14', dim: '快乐（身心健康）', indId: 'h12', desc: '挑食、随意浪费食物', points: -1, type: 'negative', day: 2 },
    { sid: 's14', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's14', dim: '进取（创新素养）', indId: 'p08', desc: '课堂上不主动发言', points: -1, type: 'negative', day: 3 },
    { sid: 's14', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 1 },
    { sid: 's14', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 4 },

    // ---- 陈翌泽 s15 (表现欠佳，作业问题) ----
    { sid: 's15', dim: '快乐（身心健康）', indId: 'h09', desc: '不开心时随意发泄情绪', points: -2, type: 'negative', day: 1 },
    { sid: 's15', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 5 },
    { sid: 's15', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 1 },
    { sid: 's15', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 4 },
    { sid: 's15', dim: '进取（创新素养）', indId: 'p05', desc: '上课扰乱课堂秩序', points: -2, type: 'negative', day: 6 },
    { sid: 's15', dim: '儒雅（儒雅品格）', indId: 'e02', desc: '用言语故意伤害同学', points: -2, type: 'negative', day: 3 },
    { sid: 's15', dim: '儒雅（儒雅品格）', indId: 'e14', desc: '校内楼道追逐打闹', points: -1, type: 'negative', day: 5 },
    { sid: 's15', dim: '大气（责任担当）', indId: 'g08', desc: '不认真完成值日', points: -1, type: 'negative', day: 2 },
    // 少量正面记录
    { sid: 's15', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 7 },
    // 月度
    { sid: 's15', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 12 },
    { sid: 's15', dim: '快乐（身心健康）', indId: 'h02', desc: '做出危险举动', points: -2, type: 'negative', day: 16 },

    // ---- 李嘉懿 s16 (有预警信号) ----
    { sid: 's16', dim: '快乐（身心健康）', indId: 'h02', desc: '做出危险举动', points: -2, type: 'negative', day: 1 },
    { sid: 's16', dim: '快乐（身心健康）', indId: 'h09', desc: '不开心时随意发泄情绪', points: -2, type: 'negative', day: 3 },
    { sid: 's16', dim: '快乐（身心健康）', indId: 'h10', desc: '情节严重的情绪发泄', points: -5, type: 'negative', day: 5 },
    { sid: 's16', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 1 },
    { sid: 's16', dim: '进取（创新素养）', indId: 'p05', desc: '上课扰乱课堂秩序', points: -2, type: 'negative', day: 4 },
    { sid: 's16', dim: '儒雅（儒雅品格）', indId: 'e02', desc: '用言语故意伤害同学', points: -2, type: 'negative', day: 2 },
    { sid: 's16', dim: '儒雅（儒雅品格）', indId: 'e03', desc: '情节严重的校园欺凌行为', points: -5, type: 'negative', day: 6 },
    { sid: 's16', dim: '大气（责任担当）', indId: 'g08', desc: '不认真完成值日', points: -1, type: 'negative', day: 2 },
    { sid: 's16', dim: '大气（责任担当）', indId: 'g10', desc: '乱扔垃圾', points: -1, type: 'negative', day: 4 },
    // 少量正面
    { sid: 's16', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 7 },
    // 月度
    { sid: 's16', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 15 },
    { sid: 's16', dim: '儒雅（儒雅品格）', indId: 'e02', desc: '用言语故意伤害同学', points: -2, type: 'negative', day: 20 },
  ]

  // c2 学生记录 (s17-s32) -- 简化版，每人5-8条
  const c2Records: typeof c1Records = [
    // 赵思语 s17
    { sid: 's17', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事', points: 2, type: 'positive', day: 1 },
    { sid: 's17', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's17', dim: '进取（创新素养）', indId: 'p07', desc: '课堂上主动举手回答问题', points: 1, type: 'positive', day: 3 },
    { sid: 's17', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 2 },
    { sid: 's17', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 4 },
    { sid: 's17', dim: '大气（责任担当）', indId: 'g12', desc: '乐于分享', points: 2, type: 'positive', day: 6 },
    // 钱浩然 s18
    { sid: 's18', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 1 },
    { sid: 's18', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 2 },
    { sid: 's18', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 5 },
    { sid: 's18', dim: '儒雅（儒雅品格）', indId: 'e07', desc: '衣着得体整洁', points: 1, type: 'positive', day: 3 },
    { sid: 's18', dim: '大气（责任担当）', indId: 'g01', desc: '升旗时主动行礼', points: 1, type: 'positive', day: 2 },
    // 周子涵 s19 (优秀)
    { sid: 's19', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事', points: 2, type: 'positive', day: 1 },
    { sid: 's19', dim: '快乐（身心健康）', indId: 'h22', desc: '长期坚持游泳运动', points: 3, type: 'positive', day: 10 },
    { sid: 's19', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's19', dim: '进取（创新素养）', indId: 'p16', desc: '主动从多角度思考问题', points: 3, type: 'positive', day: 5 },
    { sid: 's19', dim: '儒雅（儒雅品格）', indId: 'e17', desc: '同学遇到困难时主动帮助', points: 2, type: 'positive', day: 3 },
    { sid: 's19', dim: '儒雅（儒雅品格）', indId: 'e21', desc: '保持每天安静阅读', points: 3, type: 'positive', day: 8 },
    { sid: 's19', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 4 },
    { sid: 's19', dim: '大气（责任担当）', indId: 'g14', desc: '了解家乡传统节日习俗', points: 2, type: 'positive', day: 12 },
    // 吴语桐 s20
    { sid: 's20', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 1 },
    { sid: 's20', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 2 },
    { sid: 's20', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 3 },
    { sid: 's20', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 4 },
    // 郑瑞祺 s21
    { sid: 's21', dim: '快乐（身心健康）', indId: 'h15', desc: '认真参与眼保健操', points: 1, type: 'positive', day: 1 },
    { sid: 's21', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's21', dim: '进取（创新素养）', indId: 'p12', desc: '主动向老师提问', points: 2, type: 'positive', day: 4 },
    { sid: 's21', dim: '儒雅（儒雅品格）', indId: 'e11', desc: '他人说话时能安静倾听', points: 1, type: 'positive', day: 2 },
    { sid: 's21', dim: '大气（责任担当）', indId: 'g09', desc: '爱护校园一草一木', points: 1, type: 'positive', day: 3 },
    { sid: 's21', dim: '大气（责任担当）', indId: 'g15', desc: '主动关心社会时事', points: 2, type: 'positive', day: 7 },
    // 王梓萱 s22 (优秀)
    { sid: 's22', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事', points: 2, type: 'positive', day: 1 },
    { sid: 's22', dim: '快乐（身心健康）', indId: 'h24', desc: '有自己特别感兴趣的事', points: 3, type: 'positive', day: 8 },
    { sid: 's22', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's22', dim: '进取（创新素养）', indId: 'p17', desc: '发现可优化的地方，尝试行动', points: 3, type: 'positive', day: 6 },
    { sid: 's22', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 1 },
    { sid: 's22', dim: '儒雅（儒雅品格）', indId: 'e19', desc: '保持稳定的情绪状态', points: 3, type: 'positive', day: 10 },
    { sid: 's22', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 3 },
    { sid: 's22', dim: '大气（责任担当）', indId: 'g17', desc: '积极参与跨区域交流', points: 3, type: 'positive', day: 14 },
    // 冯逸凡 s23
    { sid: 's23', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 2 },
    { sid: 's23', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's23', dim: '进取（创新素养）', indId: 'p08', desc: '课堂上不主动发言', points: -1, type: 'negative', day: 3 },
    { sid: 's23', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 2 },
    { sid: 's23', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 4 },
    // 陈思远 s24
    { sid: 's24', dim: '快乐（身心健康）', indId: 'h20', desc: '大课间主动到室外运动', points: 2, type: 'positive', day: 1 },
    { sid: 's24', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's24', dim: '进取（创新素养）', indId: 'p14', desc: '能按轻重缓急给事情分类', points: 2, type: 'positive', day: 4 },
    { sid: 's24', dim: '儒雅（儒雅品格）', indId: 'e16', desc: '与同学小摩擦时能温和沟通', points: 2, type: 'positive', day: 3 },
    { sid: 's24', dim: '大气（责任担当）', indId: 'g12', desc: '乐于分享', points: 2, type: 'positive', day: 5 },
    // 褚明轩 s25 (表现欠佳)
    { sid: 's25', dim: '快乐（身心健康）', indId: 'h02', desc: '做出危险举动', points: -2, type: 'negative', day: 2 },
    { sid: 's25', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 1 },
    { sid: 's25', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 5 },
    { sid: 's25', dim: '进取（创新素养）', indId: 'p05', desc: '上课扰乱课堂秩序', points: -2, type: 'negative', day: 3 },
    { sid: 's25', dim: '儒雅（儒雅品格）', indId: 'e02', desc: '用言语故意伤害同学', points: -2, type: 'negative', day: 4 },
    { sid: 's25', dim: '大气（责任担当）', indId: 'g08', desc: '不认真完成值日', points: -1, type: 'negative', day: 2 },
    { sid: 's25', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 6 },
    // 卫诗雅 s26 (优秀)
    { sid: 's26', dim: '快乐（身心健康）', indId: 'h18', desc: '每天做一件让自己开心的事', points: 2, type: 'positive', day: 1 },
    { sid: 's26', dim: '快乐（身心健康）', indId: 'h22', desc: '长期坚持舞蹈练习', points: 3, type: 'positive', day: 10 },
    { sid: 's26', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's26', dim: '进取（创新素养）', indId: 'p13', desc: '面对有难度的任务不轻言放弃', points: 2, type: 'positive', day: 4 },
    { sid: 's26', dim: '儒雅（儒雅品格）', indId: 'e17', desc: '同学遇到困难时主动帮助', points: 2, type: 'positive', day: 3 },
    { sid: 's26', dim: '儒雅（儒雅品格）', indId: 'e21', desc: '保持每天安静阅读', points: 3, type: 'positive', day: 8 },
    { sid: 's26', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 5 },
    // 蒋文博 s27
    { sid: 's27', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 2 },
    { sid: 's27', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's27', dim: '进取（创新素养）', indId: 'p07', desc: '课堂上主动举手回答问题', points: 1, type: 'positive', day: 3 },
    { sid: 's27', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 2 },
    { sid: 's27', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 4 },
    // 沈嘉怡 s28
    { sid: 's28', dim: '快乐（身心健康）', indId: 'h07', desc: '能合理判断自己的情绪状态', points: 1, type: 'positive', day: 1 },
    { sid: 's28', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's28', dim: '进取（创新素养）', indId: 'p09', desc: '有清晰的目标意识', points: 1, type: 'positive', day: 4 },
    { sid: 's28', dim: '儒雅（儒雅品格）', indId: 'e11', desc: '他人说话时能安静倾听', points: 1, type: 'positive', day: 2 },
    { sid: 's28', dim: '大气（责任担当）', indId: 'g09', desc: '爱护校园一草一木', points: 1, type: 'positive', day: 3 },
    // 韩宇轩 s29
    { sid: 's29', dim: '快乐（身心健康）', indId: 'h20', desc: '大课间主动到室外运动', points: 2, type: 'positive', day: 1 },
    { sid: 's29', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's29', dim: '进取（创新素养）', indId: 'p12', desc: '主动向老师提问', points: 2, type: 'positive', day: 3 },
    { sid: 's29', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 2 },
    { sid: 's29', dim: '儒雅（儒雅品格）', indId: 'e23', desc: '懂得欣赏多样性', points: 3, type: 'positive', day: 9 },
    { sid: 's29', dim: '大气（责任担当）', indId: 'g13', desc: '主动为集体服务', points: 2, type: 'positive', day: 5 },
    // 杨欣妍 s30 (有扣分)
    { sid: 's30', dim: '快乐（身心健康）', indId: 'h09', desc: '不开心时随意发泄情绪', points: -2, type: 'negative', day: 2 },
    { sid: 's30', dim: '进取（创新素养）', indId: 'p02', desc: '未按时完成作业', points: -2, type: 'negative', day: 3 },
    { sid: 's30', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 5 },
    { sid: 's30', dim: '儒雅（儒雅品格）', indId: 'e12', desc: '随意打断他人说话', points: -1, type: 'negative', day: 4 },
    { sid: 's30', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 6 },
    // 朱俊杰 s31
    { sid: 's31', dim: '快乐（身心健康）', indId: 'h01', desc: '保护自己', points: 1, type: 'positive', day: 1 },
    { sid: 's31', dim: '快乐（身心健康）', indId: 'h15', desc: '认真参与眼保健操', points: 1, type: 'positive', day: 3 },
    { sid: 's31', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's31', dim: '进取（创新素养）', indId: 'p13', desc: '面对有难度的任务不轻言放弃', points: 2, type: 'positive', day: 5 },
    { sid: 's31', dim: '儒雅（儒雅品格）', indId: 'e01', desc: '不用言语行为故意伤害他人', points: 1, type: 'positive', day: 2 },
    { sid: 's31', dim: '大气（责任担当）', indId: 'g07', desc: '积极参加集体活动', points: 1, type: 'positive', day: 4 },
    // 秦若兮 s32
    { sid: 's32', dim: '快乐（身心健康）', indId: 'h07', desc: '能合理判断自己的情绪状态', points: 1, type: 'positive', day: 1 },
    { sid: 's32', dim: '进取（创新素养）', indId: 'p01', desc: '按时完成所有作业', points: 1, type: 'positive', day: 1 },
    { sid: 's32', dim: '儒雅（儒雅品格）', indId: 'e09', desc: '见到师长主动问好', points: 1, type: 'positive', day: 2 },
    { sid: 's32', dim: '儒雅（儒雅品格）', indId: 'e16', desc: '与同学小摩擦时能温和沟通', points: 2, type: 'positive', day: 4 },
    { sid: 's32', dim: '大气（责任担当）', indId: 'g01', desc: '升旗时主动行礼', points: 1, type: 'positive', day: 3 },
    { sid: 's32', dim: '大气（责任担当）', indId: 'g12', desc: '乐于分享', points: 2, type: 'positive', day: 6 },
  ]

  for (const r of [...c1Records, ...c2Records]) {
    records.push({
      id: `mr_${rid++}`,
      studentId: r.sid,
      type: r.type,
      category: r.dim,
      points: r.points,
      description: r.desc,
      createdAt: daysAgo(r.day),
      teacherId: 't1'
    })
  }

  return records
}

// ============ Store ============

export const useReportStore = defineStore('report', () => {
  const studentsStore = useStudentsStore()

  const selectedPeriod = ref<StatPeriod>('week')
  const allRecords = ref<BehaviorRecord[]>(generateMockRecords())

  // 时段过滤：按周/月/学期
  function getPeriodCutoff(period: StatPeriod): Date {
    const now = new Date()
    const cutoff = new Date(now)
    switch (period) {
      case 'week':
        cutoff.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoff.setDate(now.getDate() - 30)
        break
      case 'semester':
        cutoff.setMonth(now.getMonth() - 5)
        break
      default:
        cutoff.setDate(now.getDate() - 7)
    }
    cutoff.setHours(0, 0, 0, 0)
    return cutoff
  }

  // 按时段+班级过滤记录
  function getFilteredRecords(classId: string, period?: StatPeriod): BehaviorRecord[] {
    const p = period || selectedPeriod.value
    const cutoff = getPeriodCutoff(p)
    const classStudentIds = new Set(studentsStore.getStudentsByClass(classId).map(s => s.id))
    return allRecords.value.filter(r =>
      classStudentIds.has(r.studentId) && new Date(r.createdAt) >= cutoff
    )
  }

  // 学生在时段内的记录
  function getStudentRecords(studentId: string, period?: StatPeriod): BehaviorRecord[] {
    const p = period || selectedPeriod.value
    const cutoff = getPeriodCutoff(p)
    return allRecords.value.filter(r =>
      r.studentId === studentId && new Date(r.createdAt) >= cutoff
    )
  }

  // ============ 分数概览 ============

  function getStudentScoreOverview(studentId: string, classId: string, period?: StatPeriod) {
    const records = getStudentRecords(studentId, period)
    const plusTotal = records.filter(r => r.points > 0).reduce((s, r) => s + r.points, 0)
    const minusTotal = records.filter(r => r.points < 0).reduce((s, r) => s + r.points, 0)
    const total = plusTotal + minusTotal

    // 班级排名
    const classStudents = studentsStore.getStudentsByClass(classId)
    const classScores = classStudents.map(s => {
      const sr = getStudentRecords(s.id, period)
      return { id: s.id, total: sr.reduce((sum, r) => sum + r.points, 0) }
    }).sort((a, b) => b.total - a.total)
    const classRank = classScores.findIndex(s => s.id === studentId) + 1

    // 小组排名
    const student = studentsStore.getStudentById(studentId)
    let groupRank = 0
    let groupName = ''
    if (student?.groupId) {
      const groups = studentsStore.getGroupsByClass(classId)
      const group = groups.find(g => g.id === student.groupId)
      groupName = group?.name || ''
      if (group) {
        const groupScores = group.students.map(s => {
          const sr = getStudentRecords(s.id, period)
          return { id: s.id, total: sr.reduce((sum, r) => sum + r.points, 0) }
        }).sort((a, b) => b.total - a.total)
        groupRank = groupScores.findIndex(s => s.id === studentId) + 1
      }
    }

    return {
      total,
      plusTotal,
      minusTotal,
      classRank,
      classTotal: classStudents.length,
      groupRank,
      groupName,
      groupTotal: student?.groupId
        ? studentsStore.groups.find(g => g.id === student.groupId)?.students.length || 0
        : 0
    }
  }

  // ============ 单项榜单（进入前10的指标） ============

  function getStudentLeaderboards(studentId: string, classId: string, period?: StatPeriod) {
    const classStudents = studentsStore.getStudentsByClass(classId)
    const leaderboards: { indicatorLabel: string; rank: number; score: number; dimension: string }[] = []

    // 收集该学生所有得分的指标
    const myRecords = getStudentRecords(studentId, period)
    const myIndicators = new Map<string, { label: string; score: number; dimension: string }>()

    for (const r of myRecords) {
      if (r.points <= 0) continue
      const key = r.description || r.category
      const existing = myIndicators.get(key)
      if (existing) {
        existing.score += r.points
      } else {
        myIndicators.set(key, { label: key, score: r.points, dimension: r.category })
      }
    }

    // 对每个指标，计算全班排名
    for (const [key, info] of myIndicators) {
      const allStudentScores = classStudents.map(s => {
        const sr = getStudentRecords(s.id, period)
        const score = sr
          .filter(r => (r.description || r.category) === key && r.points > 0)
          .reduce((sum, r) => sum + r.points, 0)
        return { id: s.id, score }
      }).filter(s => s.score > 0).sort((a, b) => b.score - a.score)

      const rank = allStudentScores.findIndex(s => s.id === studentId) + 1
      if (rank > 0 && rank <= 10) {
        leaderboards.push({
          indicatorLabel: info.label,
          rank,
          score: info.score,
          dimension: info.dimension
        })
      }
    }

    return leaderboards.sort((a, b) => a.rank - b.rank)
  }

  // ============ 四维度评价 ============

  function getStudentDimensionData(studentId: string, period?: StatPeriod) {
    return MORAL_DIMENSION_INDICATORS.map((dim) => {
      const records = getStudentRecords(studentId, period).filter(r => r.category === dim.name)
      const plusRecords = records.filter(r => r.points > 0)
      const minusRecords = records.filter(r => r.points < 0)
      const score = records.reduce((sum, r) => sum + r.points, 0)

      let level: 'excellent' | 'good' | 'average' | 'poor' = 'average'
      if (score >= 8) level = 'excellent'
      else if (score >= 4) level = 'good'
      else if (score < 0) level = 'poor'

      // 优势评价
      const strengthTexts: Record<string, string[]> = {
        '快乐（身心健康）': [
          '身心健康意识强，能主动运动和管理情绪',
          '生活习惯良好，注重自我保护',
          '积极乐观，每天保持好心情'
        ],
        '进取（创新素养）': [
          '学习态度端正，按时完成作业',
          '课堂表现积极，善于提问和思考',
          '有目标意识，勇于挑战困难任务'
        ],
        '儒雅（儒雅品格）': [
          '文明礼貌，尊重师长和同学',
          '善于倾听，与同学相处融洽',
          '关心他人，乐于助人'
        ],
        '大气（责任担当）': [
          '集体荣誉感强，积极参与集体活动',
          '有担当精神，主动为集体服务',
          '爱国爱校，乐于分享'
        ]
      }

      const suggestionTexts: Record<string, string[]> = {
        '快乐（身心健康）': [
          '可以尝试培养一项长期坚持的体育爱好',
          '注意情绪管理，不开心时可以找老师聊聊',
          '注意饮食均衡，多喝水保持精力充沛'
        ],
        '进取（创新素养）': [
          '课堂上可以更积极地举手发言',
          '尝试给自己制定每周小目标',
          '遇到困难时不要放弃，多尝试不同方法'
        ],
        '儒雅（儒雅品格）': [
          '见到老师和同学多主动打招呼',
          '别人说话时耐心倾听，不随意打断',
          '保持个人物品整洁有序'
        ],
        '大气（责任担当）': [
          '积极参与班级活动，多为集体做贡献',
          '认真完成值日工作，爱护校园环境',
          '多了解传统文化和社会时事'
        ]
      }

      const strengths = strengthTexts[dim.name] || []
      const suggestions = suggestionTexts[dim.name] || []

      // 根据表现级别选择评价
      let strengthText = ''
      let suggestionText = ''
      if (level === 'excellent' || level === 'good') {
        strengthText = strengths[Math.min(plusRecords.length, strengths.length) - 1] || strengths[0] || ''
        suggestionText = level === 'excellent' ? '继续保持，争做同学们的榜样' : suggestions[0] || ''
      } else if (level === 'poor') {
        strengthText = plusRecords.length > 0 ? '有一定的基础，需要更多引导和鼓励' : '这个维度还需要老师多关注和引导'
        suggestionText = suggestions[Math.floor(Math.random() * suggestions.length)] || ''
      } else {
        strengthText = plusRecords.length > 0 ? strengths[0] || '' : '表现中等，有提升空间'
        suggestionText = suggestions[0] || ''
      }

      return {
        name: dim.name,
        icon: dim.icon,
        key: dim.key,
        score,
        level,
        strengthText,
        suggestionText,
        plusRecords,
        minusRecords,
        records
      }
    })
  }

  // ============ 学生综合评价 (~200字) ============

  function generateStudentEvaluation(studentId: string, classId: string, period?: StatPeriod): string {
    const student = studentsStore.getStudentById(studentId)
    if (!student) return ''

    const overview = getStudentScoreOverview(studentId, classId, period)
    const dims = getStudentDimensionData(studentId, period)
    const sortedDims = [...dims].sort((a, b) => b.score - a.score)
    const bestDim = sortedDims[0]
    const weakDim = sortedDims[sortedDims.length - 1]

    const name = student.name

    // 整体评级
    const isExcellent = overview.total >= 15
    const isGood = overview.total >= 8
    const isPoor = overview.total < 0

    let text = ''

    if (isExcellent) {
      text += `${name}同学在本阶段表现非常出色！`
      text += `在「${bestDim.name.replace(/（.*）/, '')}」方面尤为突出，`
      if (bestDim.plusRecords.length > 0) {
        text += `${bestDim.plusRecords.slice(0, 2).map(r => r.description).join('、')}等方面表现亮眼。`
      }
      text += `综合积分${overview.total}分，在班级${overview.classTotal}人中排名第${overview.classRank}，成绩优异。`
      text += `希望${name}继续保持这份热情和努力，同时也可以在「${weakDim.name.replace(/（.*）/, '')}」维度继续探索成长。`
      text += `老师很期待看到你更多精彩的表现！`
    } else if (isGood) {
      text += `${name}同学本阶段总体表现良好。`
      text += `在「${bestDim.name.replace(/（.*）/, '')}」方面表现突出，`
      if (bestDim.plusRecords.length > 0) {
        text += `尤其在${bestDim.plusRecords[0].description}方面值得表扬。`
      }
      text += `综合积分${overview.total}分，班级排名第${overview.classRank}。`
      if (weakDim.score < 2) {
        text += `在「${weakDim.name.replace(/（.*）/, '')}」方面还有提升空间，`
      }
      text += `相信通过持续努力，${name}会取得更大的进步。老师看好你！`
    } else if (isPoor) {
      text += `${name}同学本阶段在部分方面遇到了一些挑战。`
      if (bestDim.score > 0) {
        text += `不过在「${bestDim.name.replace(/（.*）/, '')}」方面有不错的表现，`
        if (bestDim.plusRecords.length > 0) {
          text += `例如${bestDim.plusRecords[0].description}，这一点值得鼓励。`
        }
      }
      text += `在「${weakDim.name.replace(/（.*）/, '')}」方面需要重点关注和改善。`
      text += `老师相信每个孩子都有自己的闪光点，希望${name}能在老师和家长的帮助下，找到自己的节奏，一步步进步。加油！`
    } else {
      text += `${name}同学本阶段表现稳定。`
      text += `在「${bestDim.name.replace(/（.*）/, '')}」方面有较好表现。`
      text += `综合积分${overview.total}分，在班级排名第${overview.classRank}。`
      text += `建议在「${weakDim.name.replace(/（.*）/, '')}」方面多加努力，`
      text += `每天进步一点点，相信${name}会越来越优秀！老师会一直支持你。`
    }

    return text
  }

  // ============ 家校共育指南 ============

  function generateHomeSchoolGuide(studentId: string, period?: StatPeriod): {
    hasWarning: boolean
    warningIssues: string[]
    teacherAdvice: string[]
    parentAdvice: string[]
  } {
    const student = studentsStore.getStudentById(studentId)
    if (!student) return { hasWarning: false, warningIssues: [], teacherAdvice: [], parentAdvice: [] }

    const dims = getStudentDimensionData(studentId, period)
    const warningIssues: string[] = []
    const teacherAdvice: string[] = []
    const parentAdvice: string[] = []

    for (const dim of dims) {
      if (dim.level === 'poor') {
        const shortName = dim.name.replace(/（.*）/, '')
        if (dim.name.includes('快乐')) {
          warningIssues.push(`「${shortName}」维度得分偏低，可能存在情绪管理或健康习惯方面的问题`)
          teacherAdvice.push(`关注${student.name}的情绪变化，多给予正向引导和鼓励，课间可多关注其活动状态`)
          parentAdvice.push(`在家多与孩子沟通心情，鼓励孩子表达情绪，周末安排户外运动，培养积极乐观的生活态度`)
        } else if (dim.name.includes('进取')) {
          warningIssues.push(`「${shortName}」维度得分偏低，学习动力或习惯可能需要关注`)
          teacherAdvice.push(`课堂上多给${student.name}表现机会，适当降低难度让其体验成功感，及时肯定点滴进步`)
          parentAdvice.push(`帮助孩子建立每日学习计划，陪伴完成作业但不代劳，对努力过程给予表扬而非只看结果`)
        } else if (dim.name.includes('儒雅')) {
          warningIssues.push(`「${shortName}」维度得分偏低，社交行为或文明礼仪方面需要引导`)
          teacherAdvice.push(`多安排${student.name}与性格温和的同学合作，发现其闪光点在班级中表扬，引导文明用语`)
          parentAdvice.push(`在家庭中营造互相尊重的氛围，教孩子用语言表达需求而非行为，多进行亲子阅读培养静心能力`)
        } else if (dim.name.includes('大气')) {
          warningIssues.push(`「${shortName}」维度得分偏低，集体意识和责任感需要培养`)
          teacherAdvice.push(`给${student.name}分配适当的班级任务增强责任感，多让其参与集体活动体会团队合作的乐趣`)
          parentAdvice.push(`带孩子参与社区公益活动，讲述家乡历史文化故事，在日常生活中培养分享和担当意识`)
        }
      }
    }

    // 没有预警维度时的默认建议
    if (warningIssues.length === 0) {
      teacherAdvice.push(`${student.name}表现良好，可以在擅长领域给予更多挑战性任务，帮助其发挥榜样作用`)
      parentAdvice.push(`继续保持家校配合，鼓励孩子的兴趣发展，适时给予独立尝试的空间`)
    }

    return {
      hasWarning: warningIssues.length > 0,
      warningIssues,
      teacherAdvice,
      parentAdvice
    }
  }

  // ============ 行为明细（按维度分组） ============

  function getStudentBehaviorDetails(studentId: string, period?: StatPeriod) {
    return MORAL_DIMENSION_INDICATORS.map(dim => {
      const records = getStudentRecords(studentId, period).filter(r => r.category === dim.name)
      const plusRecords = records.filter(r => r.points > 0).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      const minusRecords = records.filter(r => r.points < 0).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      return {
        dimension: dim.name,
        icon: dim.icon,
        key: dim.key,
        plusRecords,
        minusRecords,
        totalPlus: plusRecords.reduce((s, r) => s + r.points, 0),
        totalMinus: minusRecords.reduce((s, r) => s + r.points, 0)
      }
    })
  }

  // ============ 班级报告相关 ============

  function getClassDimensionStats(classId: string, period?: StatPeriod) {
    const classStudents = studentsStore.getStudentsByClass(classId)
    return MORAL_DIMENSION_INDICATORS.map(dim => {
      const studentScores = classStudents.map(student => {
        const records = getStudentRecords(student.id, period).filter(r => r.category === dim.name)
        return records.reduce((sum, r) => sum + r.points, 0)
      })
      const validScores = studentScores.filter(s => s !== 0)
      return {
        dimension: dim.name,
        icon: dim.icon,
        average: validScores.length > 0
          ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
          : 0,
        max: validScores.length > 0 ? Math.max(...validScores) : 0,
        min: validScores.length > 0 ? Math.min(...validScores) : 0
      }
    })
  }

  function getGroupComparison(classId: string, period?: StatPeriod) {
    const groups = studentsStore.getGroupsByClass(classId)
    return groups.map(group => {
      const scores: Record<string, number> = {}
      for (const dim of MORAL_DIMENSION_INDICATORS) {
        const groupRecords = group.students.flatMap(s =>
          getStudentRecords(s.id, period).filter(r => r.category === dim.name)
        )
        scores[dim.name] = groupRecords.reduce((sum, r) => sum + r.points, 0)
      }
      const totalScore = Object.values(scores).reduce((s, v) => s + v, 0)
      return {
        groupId: group.id,
        groupName: group.name,
        icon: group.icon,
        totalScore,
        scores
      }
    }).sort((a, b) => b.totalScore - a.totalScore)
  }

  function generateClassAIEvaluation(classId: string, period?: StatPeriod): string {
    const stats = getClassDimensionStats(classId, period)
    const sortedDims = [...stats].sort((a, b) => b.average - a.average)
    const strongest = sortedDims[0]
    const weakest = sortedDims[sortedDims.length - 1]

    const periodLabel = selectedPeriod.value === 'week' ? '本周' : selectedPeriod.value === 'month' ? '本月' : '本学期'

    return [
      `${periodLabel}班级整体表现良好。`,
      `在「${strongest.dimension.replace(/（.*）/, '')}」方面表现突出，平均得分${strongest.average}分。`,
      `「${weakest.dimension.replace(/（.*）/, '')}」维度还有提升空间，建议加强相关引导。`,
      `各小组间竞争激烈，整体氛围积极向上。`,
      `建议${periodLabel}重点关注学生的情绪管理和团队协作能力培养。`
    ].join('')
  }

  return {
    selectedPeriod,
    allRecords,
    getFilteredRecords,
    getStudentRecords,
    getStudentScoreOverview,
    getStudentLeaderboards,
    getStudentDimensionData,
    generateStudentEvaluation,
    generateHomeSchoolGuide,
    getStudentBehaviorDetails,
    getClassDimensionStats,
    getGroupComparison,
    generateClassAIEvaluation
  }
})
