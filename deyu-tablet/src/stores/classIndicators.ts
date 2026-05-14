import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TagIndicator } from './tags'
import { useWebSocket } from '@shared/composables'
import type { IndicatorConfigSyncPayload } from '@shared/types'

// 班级自定义指标
export interface ClassCustomIndicator extends TagIndicator {
  dimKey: string
  levelKey: string
  classId: string
}

export const useClassIndicatorsStore = defineStore('classIndicators', () => {
  // 每个班级忽略的校级指标 ID 集合
  const ignoredMap = ref<Record<string, Set<string>>>({})

  // 每个班级的自定义指标
  const customIndicators = ref<ClassCustomIndicator[]>([])

  // WebSocket —— 用于广播配置变更
  const { emit, isConnected } = useWebSocket()

  // 广播当前班级的指标配置给大屏端
  function broadcastConfig(classId: string) {
    if (!isConnected.value) return
    const payload: IndicatorConfigSyncPayload = {
      classId,
      ignored: Array.from(ignoredMap.value[classId] || []),
      customIndicators: customIndicators.value
        .filter(i => i.classId === classId)
        .map(i => ({
          id: i.id,
          label: i.label,
          type: i.type,
          points: i.points,
          dimKey: i.dimKey,
          levelKey: i.levelKey
        }))
    }
    emit('indicator_config_sync', payload)
  }

  // ============ 忽略 / 恢复 ============
  function isIgnored(classId: string, indicatorId: string): boolean {
    return ignoredMap.value[classId]?.has(indicatorId) ?? false
  }

  function toggleIgnore(classId: string, indicatorId: string) {
    if (!ignoredMap.value[classId]) {
      ignoredMap.value[classId] = new Set()
    }
    const set = ignoredMap.value[classId]
    if (set.has(indicatorId)) {
      set.delete(indicatorId)
    } else {
      set.add(indicatorId)
    }
    broadcastConfig(classId)
  }

  function getIgnoredCount(classId: string): number {
    return ignoredMap.value[classId]?.size ?? 0
  }

  // ============ 自定义指标 CRUD ============
  function getCustomIndicators(classId: string): ClassCustomIndicator[] {
    return customIndicators.value.filter(i => i.classId === classId)
  }

  function getCustomByLevel(classId: string, dimKey: string, levelKey: string): ClassCustomIndicator[] {
    return customIndicators.value.filter(
      i => i.classId === classId && i.dimKey === dimKey && i.levelKey === levelKey
    )
  }

  function addCustomIndicator(classId: string, data: {
    label: string
    points: number
    dimKey: string
    levelKey: string
  }): ClassCustomIndicator {
    const ind: ClassCustomIndicator = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: data.label,
      type: data.points >= 0 ? 'positive' : 'negative',
      points: data.points,
      dimKey: data.dimKey,
      levelKey: data.levelKey,
      classId
    }
    customIndicators.value.push(ind)
    broadcastConfig(classId)
    return ind
  }

  function removeCustomIndicator(classId: string, id: string) {
    const idx = customIndicators.value.findIndex(i => i.id === id)
    if (idx !== -1) customIndicators.value.splice(idx, 1)
    broadcastConfig(classId)
  }

  function getCustomCount(classId: string): number {
    return customIndicators.value.filter(i => i.classId === classId).length
  }

  return {
    ignoredMap,
    customIndicators,
    isIgnored,
    toggleIgnore,
    getIgnoredCount,
    getCustomIndicators,
    getCustomByLevel,
    addCustomIndicator,
    removeCustomIndicator,
    getCustomCount,
    broadcastConfig
  }
})
