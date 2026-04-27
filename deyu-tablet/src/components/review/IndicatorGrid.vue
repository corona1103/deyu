<script setup lang="ts">
import { MORAL_DIMENSION_INDICATORS } from '@shared/constants'
import type { DimensionIndicator } from '@shared/constants'
import { useResponsive } from '@/composables/useResponsive'
import { useReviewStore } from '@/stores/review'

const reviewStore = useReviewStore()
const { isMobile } = useResponsive()

function handleSelect(indicator: DimensionIndicator, dimensionKey: string, dimensionName: string) {
  reviewStore.toggleIndicator(indicator, dimensionKey, dimensionName)
}
</script>

<template>
  <div
    class="dimensions-container"
    :class="{ mobile: isMobile }"
  >
    <div
      v-for="dimension in MORAL_DIMENSION_INDICATORS"
      :key="dimension.key"
      class="dimension-column"
    >
      <!-- 维度标题 -->
      <div class="dimension-header">
        <span class="dimension-icon">{{ dimension.icon }}</span>
        <span class="dimension-name">{{ dimension.name }}</span>
      </div>

      <!-- 指标列表 -->
      <div class="indicators-list">
        <div
          v-for="indicator in dimension.indicators"
          :key="indicator.id"
          class="indicator-item touch-active"
          :class="{
            selected: reviewStore.isIndicatorSelected(indicator.id),
            negative: indicator.type === 'negative'
          }"
          @click="handleSelect(indicator, dimension.key, dimension.name)"
        >
          <div class="indicator-label">{{ indicator.label }}</div>
          <div
            class="indicator-points"
            :class="{ negative: indicator.type === 'negative' }"
          >
            {{ indicator.points > 0 ? '+' : '' }}{{ indicator.points }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.dimensions-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 10px 0;

  &.mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.dimension-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: linear-gradient(135deg, $primary, $primary-light);
  border-radius: $radius-md;
  color: white;
}

.dimension-icon {
  font-size: 20px;
}

.dimension-name {
  font-size: 14px;
  font-weight: bold;
}

.indicators-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.indicator-item {
  padding: 12px 10px;
  background: $gray-50;
  border-radius: $radius-md;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: $gray-100;
  }

  &.selected {
    background: #E8F5E9;
    border-color: $success;
  }

  &.negative {
    &.selected {
      background: #FFEBEE;
      border-color: $danger;
    }
  }
}

.indicator-label {
  font-size: 14px;
  color: $gray-800;
  font-weight: 500;
}

.indicator-points {
  font-size: 12px;
  color: $success;
  font-weight: bold;

  &.negative {
    color: $danger;
  }
}
</style>
