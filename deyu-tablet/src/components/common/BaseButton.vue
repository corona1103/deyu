<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  loading: false
})

defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <button
    class="base-button"
    :class="[
      `btn-${type}`,
      `btn-${size}`,
      { 'btn-block': block, 'btn-disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading-spinner" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: $radius-full;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 44px;
  min-width: 44px;

  &:active:not(.btn-disabled) {
    transform: scale(0.98);
  }
}

// Types
.btn-primary {
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
}

.btn-secondary {
  background: $gray-100;
  color: $gray-700;
}

.btn-success {
  background: linear-gradient(135deg, $success, lighten($success, 10%));
  color: white;
}

.btn-danger {
  background: #FFEBEE;
  color: $danger;
}

.btn-ghost {
  background: transparent;
  color: $gray-600;
}

// Sizes
.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-md {
  padding: 12px 24px;
  font-size: 16px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 18px;
  height: 55px;
}

// States
.btn-block {
  width: 100%;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
