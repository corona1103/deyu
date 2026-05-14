import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MORAL_DIMENSION_INDICATORS } from '@shared/constants'

// ========== 类型 ==========
export interface TagIndicator {
  id: string
  label: string
  type: 'positive' | 'negative'
  points: number
}

export interface TagLevel {
  key: string
  name: string
  color: string
  indicators: TagIndicator[]
}

export interface TagDimension {
  key: string
  name: string
  icon: string
  levels: TagLevel[]
}

// ========== 默认等级模板 ==========
const DEFAULT_LEVEL_COLORS = ['#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0', '#607D8B']

function getAttentionLevel(points: number): string {
  if (points === -5) return 'warning'
  if (points >= 3) return 'outstanding'
  if (points === 2) return 'growth'
  return 'daily'
}

// 从常量初始化树结构
function buildInitialTree(): TagDimension[] {
  return MORAL_DIMENSION_INDICATORS.map(dim => {
    const levelDefs = [
      { key: 'daily', name: '日常达标', color: '#4CAF50' },
      { key: 'warning', name: '底线预警', color: '#F44336' },
      { key: 'growth', name: '引领成长', color: '#2196F3' },
      { key: 'outstanding', name: '特色发展', color: '#FF9800' }
    ]
    return {
      key: dim.key,
      name: dim.name,
      icon: dim.icon,
      levels: levelDefs.map(ldef => ({
        key: ldef.key,
        name: ldef.name,
        color: ldef.color,
        indicators: dim.indicators
          .filter(ind => getAttentionLevel(ind.points) === ldef.key)
          .map(ind => ({ id: ind.id, label: ind.label, type: ind.type, points: ind.points }))
      })).filter(l => l.indicators.length > 0)
    }
  })
}

// ========== Store ==========
export const useTagsStore = defineStore('tags', () => {
  const dimensions = ref<TagDimension[]>(buildInitialTree())

  // 统计
  const totalIndicatorCount = computed(() =>
    dimensions.value.reduce(
      (sum, dim) => sum + dim.levels.reduce((s, l) => s + l.indicators.length, 0), 0
    )
  )

  // ============ 一级：维度 ============
  function addDimension() {
    const id = `dim_${Date.now()}`
    dimensions.value.push({
      key: id,
      name: '新维度',
      icon: '📌',
      levels: []
    })
    return id
  }

  function removeDimension(key: string) {
    const idx = dimensions.value.findIndex(d => d.key === key)
    if (idx !== -1) dimensions.value.splice(idx, 1)
  }

  function renameDimension(key: string, name: string) {
    const dim = dimensions.value.find(d => d.key === key)
    if (dim) dim.name = name
  }

  function setDimensionIcon(key: string, icon: string) {
    const dim = dimensions.value.find(d => d.key === key)
    if (dim) dim.icon = icon
  }

  function moveDimension(key: string, direction: -1 | 1) {
    const idx = dimensions.value.findIndex(d => d.key === key)
    const newIdx = idx + direction
    if (idx < 0 || newIdx < 0 || newIdx >= dimensions.value.length) return
    const [item] = dimensions.value.splice(idx, 1)
    dimensions.value.splice(newIdx, 0, item)
  }

  // ============ 二级：关注等级 ============
  function addLevel(dimKey: string) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const id = `level_${Date.now()}`
    const colorIdx = dim.levels.length % DEFAULT_LEVEL_COLORS.length
    dim.levels.push({
      key: id,
      name: '新等级',
      color: DEFAULT_LEVEL_COLORS[colorIdx],
      indicators: []
    })
    return id
  }

  function removeLevel(dimKey: string, levelKey: string) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const idx = dim.levels.findIndex(l => l.key === levelKey)
    if (idx !== -1) dim.levels.splice(idx, 1)
  }

  function renameLevel(dimKey: string, levelKey: string, name: string) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const level = dim.levels.find(l => l.key === levelKey)
    if (level) level.name = name
  }

  function setLevelColor(dimKey: string, levelKey: string, color: string) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const level = dim.levels.find(l => l.key === levelKey)
    if (level) level.color = color
  }

  function moveLevel(dimKey: string, levelKey: string, direction: -1 | 1) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const idx = dim.levels.findIndex(l => l.key === levelKey)
    const newIdx = idx + direction
    if (idx < 0 || newIdx < 0 || newIdx >= dim.levels.length) return
    const [item] = dim.levels.splice(idx, 1)
    dim.levels.splice(newIdx, 0, item)
  }

  // ============ 三级：指标 ============
  function addIndicator(dimKey: string, levelKey: string) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const level = dim.levels.find(l => l.key === levelKey)
    if (!level) return
    const id = `ind_${Date.now()}`
    level.indicators.push({
      id,
      label: '新指标',
      type: 'positive',
      points: 1
    })
    return id
  }

  function removeIndicator(dimKey: string, levelKey: string, indId: string) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const level = dim.levels.find(l => l.key === levelKey)
    if (!level) return
    const idx = level.indicators.findIndex(i => i.id === indId)
    if (idx !== -1) level.indicators.splice(idx, 1)
  }

  function updateIndicator(dimKey: string, levelKey: string, indId: string, updates: Partial<TagIndicator>) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const level = dim.levels.find(l => l.key === levelKey)
    if (!level) return
    const ind = level.indicators.find(i => i.id === indId)
    if (!ind) return
    if (updates.label !== undefined) ind.label = updates.label
    if (updates.points !== undefined) {
      ind.points = updates.points
      ind.type = updates.points >= 0 ? 'positive' : 'negative'
    }
    if (updates.type !== undefined) ind.type = updates.type
  }

  function moveIndicator(dimKey: string, levelKey: string, indId: string, direction: -1 | 1) {
    const dim = dimensions.value.find(d => d.key === dimKey)
    if (!dim) return
    const level = dim.levels.find(l => l.key === levelKey)
    if (!level) return
    const idx = level.indicators.findIndex(i => i.id === indId)
    const newIdx = idx + direction
    if (idx < 0 || newIdx < 0 || newIdx >= level.indicators.length) return
    const [item] = level.indicators.splice(idx, 1)
    level.indicators.splice(newIdx, 0, item)
  }

  return {
    dimensions,
    totalIndicatorCount,
    // 维度
    addDimension,
    removeDimension,
    renameDimension,
    setDimensionIcon,
    moveDimension,
    // 等级
    addLevel,
    removeLevel,
    renameLevel,
    setLevelColor,
    moveLevel,
    // 指标
    addIndicator,
    removeIndicator,
    updateIndicator,
    moveIndicator
  }
})
