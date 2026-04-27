<script setup lang="ts">
interface Tab {
  value: string
  label: string
}

interface Props {
  tabs: Tab[]
  modelValue: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="view-tabs hide-scrollbar">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="view-tab touch-active"
      :class="{ active: modelValue === tab.value }"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.view-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.view-tab {
  flex-shrink: 0;
  padding: 8px 18px;
  background: $gray-100;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-600;
  cursor: pointer;
  min-height: 36px;
  display: flex;
  align-items: center;
  transition: all 0.3s;

  &.active {
    background: #E8F4FD;
    color: $secondary;
  }
}
</style>
