import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ClassReportData, StatPeriod } from '@shared/types'
import { MORAL_DIMENSION_INDICATORS, MORAL_DIMENSIONS_NEW } from '@shared/constants'
import { useStudentsStore } from './students'
import { useReviewStore } from './review'

export const useReportStore = defineStore('report', () => {
  const studentsStore = useStudentsStore()
  const reviewStore = useReviewStore()

  const selectedPeriod = ref<StatPeriod>('week')

  // 计算班级各维度统计数据
  const classDimensionStats = computed(() => {
    return MORAL_DIMENSIONS_NEW.map((dimName) => {
      const dim = MORAL_DIMENSION_INDICATORS.find(d => d.name === dimName)
      if (!dim) return { dimension: dimName, average: 0, max: 0, min: 0 }

      // 计算每个学生在此维度的得分
      const studentScores = studentsStore.students.map(student => {
        const records = reviewStore.records.filter(r =>
          r.studentId === student.id && r.category === dim.name
        )
        return records.reduce((sum, r) => sum + r.points, 0)
      })

      const validScores = studentScores.filter(s => s !== 0)
      if (validScores.length === 0) {
        return { dimension: dimName, average: 0, max: 0, min: 0 }
      }

      return {
        dimension: dimName,
        average: Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length),
        max: Math.max(...validScores),
        min: Math.min(...validScores)
      }
    })
  })

  // 小组对比数据
  const groupComparison = computed(() => {
    return studentsStore.groups.map(group => {
      const scores: Record<string, number> = {}

      for (const dim of MORAL_DIMENSIONS_NEW) {
        const dimInfo = MORAL_DIMENSION_INDICATORS.find(d => d.name === dim)
        if (!dimInfo) continue

        const groupRecords = reviewStore.records.filter(r =>
          group.students.some(s => s.id === r.studentId) &&
          r.category === dimInfo.name
        )
        scores[dim] = groupRecords.reduce((sum, r) => sum + r.points, 0)
      }

      return {
        groupId: group.id,
        groupName: group.name,
        icon: group.icon,
        totalScore: group.totalScore,
        scores
      }
    })
  })

  // 获取学生的维度数据
  function getStudentDimensionData(studentId: string) {
    return MORAL_DIMENSIONS_NEW.map((dimName) => {
      const dim = MORAL_DIMENSION_INDICATORS.find(d => d.name === dimName)
      if (!dim) {
        return {
          name: dimName,
          score: 0,
          maxScore: 100,
          level: 'average' as const,
          records: []
        }
      }

      const records = reviewStore.records.filter(r =>
        r.studentId === studentId && r.category === dim.name
      )
      const score = records.reduce((sum, r) => sum + r.points, 0)

      // 简单评级逻辑
      let level: 'excellent' | 'good' | 'average' | 'poor' = 'average'
      if (score >= 20) level = 'excellent'
      else if (score >= 10) level = 'good'
      else if (score < 0) level = 'poor'

      return {
        name: dimName,
        icon: dim.icon,
        key: dim.key,
        score,
        maxScore: 100,
        level,
        records
      }
    })
  }

  // 生成AI评价（模拟）
  function generateClassAIEvaluation(): string {
    const stats = classDimensionStats.value

    // 找出最强和最弱的维度
    const sortedDims = [...stats].sort((a, b) => b.average - a.average)
    const strongest = sortedDims[0]
    const weakest = sortedDims[sortedDims.length - 1]

    const evaluations = [
      `本周班级整体表现良好。`,
      `在「${strongest.dimension}」方面表现突出，平均得分${strongest.average}分。`,
      `「${weakest.dimension}」维度还有提升空间，建议加强相关引导。`,
      `各小组间竞争激烈，整体氛围积极向上。`,
      `建议本周重点关注学生的情绪管理和团队协作能力培养。`
    ]

    return evaluations.join('')
  }

  // 生成学生AI评价（模拟）
  function generateStudentAIEvaluation(studentId: string): string {
    const student = studentsStore.getStudentById(studentId)
    if (!student) return ''

    const dimData = getStudentDimensionData(studentId)
    const sortedDims = [...dimData].sort((a, b) => b.score - a.score)

    const evaluations = [
      `${student.name}同学本周综合表现`,
      sortedDims[0].level === 'excellent' ? '优秀' : sortedDims[0].level === 'good' ? '良好' : '一般',
      `。在「${sortedDims[0].name}」方面表现亮眼`,
      sortedDims[0].score > 0 ? `，获得${sortedDims[0].score}分的好成绩` : '',
      `。建议在「${sortedDims[sortedDims.length - 1].name}」方面多加努力，`,
      `保持积极的学习态度，相信会有更大的进步！`
    ]

    return evaluations.join('')
  }

  // 生成学生建议
  function generateStudentSuggestions(studentId: string): string[] {
    const dimData = getStudentDimensionData(studentId)
    const suggestions: string[] = []

    for (const dim of dimData) {
      if (dim.level === 'poor' || dim.level === 'average') {
        const suggestionMap: Record<string, string> = {
          '快乐': '建议多参与课外活动，培养积极乐观的心态',
          '进取': '建议制定学习计划，每天坚持完成小目标',
          '儒雅': '建议多阅读经典书籍，培养文雅的气质',
          '大气': '建议积极参与班级活动，培养团队合作精神'
        }
        if (suggestionMap[dim.name]) {
          suggestions.push(suggestionMap[dim.name])
        }
      }
    }

    if (suggestions.length === 0) {
      suggestions.push('继续保持优秀表现，争取在各方面都有所突破')
      suggestions.push('可以尝试帮助其他同学，发挥榜样作用')
    }

    return suggestions.slice(0, 3)
  }

  return {
    selectedPeriod,
    classDimensionStats,
    groupComparison,
    getStudentDimensionData,
    generateClassAIEvaluation,
    generateStudentAIEvaluation,
    generateStudentSuggestions
  }
})
