/**
 * 班级点评指标数据层 —— 大屏端 & 平板端共用
 *
 * 职责：
 * 1. 从校级标签体系构建三级树
 * 2. 管理班级维度的忽略列表 + 自定义指标
 * 3. 输出最终的「该班级可用指标」扁平列表供点评弹窗使用
 */
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { MORAL_DIMENSION_INDICATORS } from '../constants'
import type { IndicatorConfigSyncPayload } from '../types'

// ========== 类型 ==========
export interface ReviewIndicatorItem {
  id: string
  label: string
  type: 'positive' | 'negative'
  points: number
  dimKey: string
  dimName: string
  dimIcon: string
  levelKey: string
  levelName: string
  isCustom: boolean
}

export interface ClassCustomIndicator {
  id: string
  label: string
  type: 'positive' | 'negative'
  points: number
  dimKey: string
  levelKey: string
}

// 关注等级定义
const LEVEL_DEFS = [
  { key: 'daily', name: '日常达标' },
  { key: 'warning', name: '底线预警' },
  { key: 'growth', name: '引领成长' },
  { key: 'outstanding', name: '特色发展' }
]

function classifyLevel(points: number): string {
  if (points === -5) return 'warning'
  if (points >= 3) return 'outstanding'
  if (points === 2) return 'growth'
  return 'daily'
}

// ========== Composable ==========
export function useClassReviewIndicators(classId: Ref<string>) {
  // 每个班级的忽略集合
  const ignoredMap = ref<Record<string, Set<string>>>({})
  // 每个班级的自定义指标
  const customIndicators = ref<ClassCustomIndicator[]>([])

  // --- 忽略 ---
  function isIgnored(indId: string): boolean {
    return ignoredMap.value[classId.value]?.has(indId) ?? false
  }

  function toggleIgnore(indId: string) {
    if (!ignoredMap.value[classId.value]) {
      ignoredMap.value[classId.value] = new Set()
    }
    const set = ignoredMap.value[classId.value]
    if (set.has(indId)) set.delete(indId)
    else set.add(indId)
  }

  // --- 自定义指标 ---
  function addCustom(data: { label: string; points: number; dimKey: string; levelKey: string }) {
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    customIndicators.value.push({
      id,
      label: data.label,
      type: data.points >= 0 ? 'positive' : 'negative',
      points: data.points,
      dimKey: data.dimKey,
      levelKey: data.levelKey
    })
  }

  function removeCustom(id: string) {
    const idx = customIndicators.value.findIndex(i => i.id === id)
    if (idx !== -1) customIndicators.value.splice(idx, 1)
  }

  function getClassCustom(): ClassCustomIndicator[] {
    return customIndicators.value.filter(i => true) // 目前单班级，后续可按 classId 过滤
  }

  // --- 从 WebSocket 接收配置同步 ---
  function applyRemoteConfig(payload: IndicatorConfigSyncPayload) {
    // 更新忽略列表
    ignoredMap.value[payload.classId] = new Set(payload.ignored)
    // 更新自定义指标（整体替换）
    customIndicators.value = payload.customIndicators.map(c => ({
      id: c.id,
      label: c.label,
      type: c.type,
      points: c.points,
      dimKey: c.dimKey,
      levelKey: c.levelKey
    }))
  }

  // --- 最终可用指标（供点评弹窗） ---
  const availableDimensions: ComputedRef<{
    key: string; name: string; icon: string; subtitle: string
    indicators: ReviewIndicatorItem[]
  }[]> = computed(() => {
    const ignored = ignoredMap.value[classId.value] || new Set<string>()
    const customs = customIndicators.value

    return MORAL_DIMENSION_INDICATORS.map(dim => {
      // 校级指标（排除已忽略的）
      const schoolInds: ReviewIndicatorItem[] = dim.indicators
        .filter(ind => !ignored.has(ind.id))
        .map(ind => ({
          id: ind.id,
          label: ind.label,
          type: ind.type,
          points: ind.points,
          dimKey: dim.key,
          dimName: dim.name,
          dimIcon: dim.icon,
          levelKey: classifyLevel(ind.points),
          levelName: LEVEL_DEFS.find(l => l.key === classifyLevel(ind.points))?.name || '',
          isCustom: false
        }))

      // 班级自定义指标
      const customInds: ReviewIndicatorItem[] = customs
        .filter(c => c.dimKey === dim.key)
        .map(c => ({
          id: c.id,
          label: c.label,
          type: c.type,
          points: c.points,
          dimKey: dim.key,
          dimName: dim.name,
          dimIcon: dim.icon,
          levelKey: c.levelKey,
          levelName: LEVEL_DEFS.find(l => l.key === c.levelKey)?.name || '',
          isCustom: true
        }))

      // 自定义指标置顶
      const allInds = [...customInds, ...schoolInds]

      // 提取 subtitle
      const match = dim.name.match(/（(.+)）/)
      const subtitle = match ? match[1] : ''

      return {
        key: dim.key,
        name: dim.name.split('（')[0],
        icon: dim.icon,
        subtitle,
        indicators: allInds
      }
    })
  })

  return {
    ignoredMap,
    customIndicators,
    isIgnored,
    toggleIgnore,
    addCustom,
    removeCustom,
    getClassCustom,
    applyRemoteConfig,
    availableDimensions
  }
}
