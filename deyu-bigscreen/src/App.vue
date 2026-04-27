<script setup lang="ts">
import { RouterView } from 'vue-router'
import ScaleContainer from '@/components/layout/ScaleContainer.vue'
</script>

<template>
  <ScaleContainer>
    <RouterView />
  </ScaleContainer>
</template>

<style>
/* 全局样式已在 main.scss 中定义 */
</style>
