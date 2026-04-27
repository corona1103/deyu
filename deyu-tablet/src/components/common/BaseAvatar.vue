<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  src: '',
  size: 'md',
  color: ''
})

// 从名字获取首字
const initial = computed(() => {
  return props.name ? props.name.charAt(0) : '?'
})

// 根据名字生成背景色
const backgroundColor = computed(() => {
  if (props.color) return props.color

  const colors = [
    'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
    'linear-gradient(135deg, #87CEEB, #ADD8E6)',
    'linear-gradient(135deg, #98D8C8, #B8E6D9)',
    'linear-gradient(135deg, #DDA0DD, #EE82EE)',
    'linear-gradient(135deg, #F7DC6F, #F9E79F)',
    'linear-gradient(135deg, #E6E6FA, #D8BFD8)'
  ]

  if (!props.name) return colors[0]

  const index = props.name.charCodeAt(0) % colors.length
  return colors[index]
})
</script>

<template>
  <div
    class="base-avatar"
    :class="`size-${size}`"
  >
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="avatar-image"
    />
    <span
      v-else
      class="avatar-initial"
      :style="{ background: backgroundColor }"
    >
      {{ initial }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-avatar {
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.size-sm {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.size-md {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.size-lg {
  width: 45px;
  height: 45px;
  font-size: 16px;
}

.size-xl {
  width: 60px;
  height: 60px;
  font-size: 20px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
}
</style>
