<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  hoverable: false
})
</script>

<template>
  <div
    class="base-card"
    :class="[`padding-${padding}`, { hoverable }]"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-card {
  background: white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.padding-none {
  padding: 0;
}

.padding-sm {
  padding: 12px;
}

.padding-md {
  padding: 20px;
}

.padding-lg {
  padding: 25px;
}

.hoverable {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:active {
    transform: scale(0.98);
  }
}
</style>
