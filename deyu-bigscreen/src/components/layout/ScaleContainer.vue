<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 设计稿尺寸
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const scale = ref(1)
const containerStyle = ref({})

function updateScale() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 计算缩放比例，取宽高比例的较小值以确保内容完全显示
  const scaleX = windowWidth / DESIGN_WIDTH
  const scaleY = windowHeight / DESIGN_HEIGHT
  scale.value = Math.min(scaleX, scaleY)

  // 计算居中偏移
  const offsetX = (windowWidth - DESIGN_WIDTH * scale.value) / 2
  const offsetY = (windowHeight - DESIGN_HEIGHT * scale.value) / 2

  containerStyle.value = {
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left',
    left: `${offsetX}px`,
    top: `${offsetY}px`
  }
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})
</script>

<template>
  <div class="scale-wrapper">
    <div class="scale-container" :style="containerStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scale-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1a2e;
  position: relative;
}

.scale-container {
  width: 1920px;
  height: 1080px;
  position: absolute;
  overflow: hidden;
}
</style>
