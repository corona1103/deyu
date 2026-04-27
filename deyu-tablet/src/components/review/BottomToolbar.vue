<script setup lang="ts">
interface ToolItem {
  icon: string
  label: string
  action: string
}

const tools: ToolItem[] = [
  { icon: '🎲', label: '随机点名', action: 'random' },
  { icon: '⏱️', label: '计时器', action: 'timer' },
  { icon: '🔍', label: '找学生', action: 'search' },
  { icon: '👥', label: '多人点评', action: 'multi' }
]

defineEmits<{
  plus: []
  minus: []
  tool: [action: string]
}>()
</script>

<template>
  <div class="bottom-toolbar">
    <div class="toolbar-top">
      <div
        v-for="tool in tools"
        :key="tool.action"
        class="tool-item touch-active"
        @click="$emit('tool', tool.action)"
      >
        <span class="tool-icon">{{ tool.icon }}</span>
        <span class="tool-label">{{ tool.label }}</span>
      </div>
    </div>
    <div class="toolbar-actions">
      <button class="action-btn minus" @click="$emit('minus')">
        <span>➖</span>
        <span>扣分</span>
      </button>
      <button class="action-btn plus" @click="$emit('plus')">
        <span>➕</span>
        <span>加分</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (min-width: $breakpoint-lg) {
    left: 50%;
    transform: translateX(-50%);
    max-width: 800px;
    border-radius: $radius-lg $radius-lg 0 0;
  }
}

.toolbar-top {
  display: flex;
  justify-content: space-around;
  padding: 15px 20px;
  border-bottom: 1px solid $gray-100;

  @media (min-width: $breakpoint-md) {
    justify-content: center;
    gap: 40px;
  }
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: $gray-600;
  font-size: 12px;
  cursor: pointer;
  min-width: 60px;
  min-height: 44px;
  justify-content: center;
}

.tool-icon {
  font-size: 22px;
}

.tool-label {
  font-size: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  padding-bottom: calc(15px + $safe-area-bottom);

  @media (min-width: $breakpoint-md) {
    max-width: 500px;
    margin: 0 auto;
  }
}

.action-btn {
  flex: 1;
  height: 50px;
  border-radius: $radius-full;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &.minus {
    background: #FFEBEE;
    color: $danger;
  }

  &.plus {
    background: linear-gradient(135deg, $success, lighten($success, 10%));
    color: white;
  }
}
</style>
