<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  position?: 'center' | 'bottom'
  closable?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  position: 'bottom',
  closable: true,
  closeOnOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

// 禁止背景滚动
watch(() => props.modelValue, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <Transition :name="position === 'bottom' ? 'slide-up' : 'scale'">
          <div
            v-if="modelValue"
            class="modal-content"
            :class="`position-${position}`"
            @click.stop
          >
            <div v-if="title || closable" class="modal-header">
              <span class="modal-title">{{ title }}</span>
              <button
                v-if="closable"
                class="modal-close"
                @click="close"
              >
                ×
              </button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-content {
  background: white;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;

  &.position-bottom {
    border-radius: $radius-xl $radius-xl 0 0;
    padding: 25px 20px;
    padding-bottom: calc(20px + $safe-area-bottom);

    @media (min-width: $breakpoint-md) {
      max-width: 500px;
      border-radius: $radius-xl;
      margin: auto;
    }
  }

  &.position-center {
    border-radius: $radius-xl;
    max-width: 400px;
    margin: auto;
    padding: 25px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
}

.modal-close {
  width: 30px;
  height: 30px;
  background: $gray-100;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  color: $gray-500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  min-height: 100px;
}

.modal-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid $gray-200;
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
