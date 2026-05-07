<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useWebSocket } from '@shared/composables'
import PageHeader from '@/components/layout/PageHeader.vue'

const userStore = useUserStore()
const { connect, joinClass } = useWebSocket()

// 大屏端 iframe URL（固定加载 review 页面）
const iframeSrc = computed(() => {
  const isDev = import.meta.env.DEV
  const base = isDev
    ? 'http://localhost:3000/deyu/deyu-bigscreen/'
    : '/deyu/deyu-bigscreen/'
  return `${base}review?embed=1`
})

onMounted(() => {
  connect()
  if (userStore.currentClassId) {
    joinClass(userStore.currentClassId)
  }
})
</script>

<template>
  <div class="review-page">
    <PageHeader title="行为点评" :show-back="false" :right-slot="false" />

    <main class="iframe-container">
      <iframe
        :src="iframeSrc"
        class="embed-iframe"
        frameborder="0"
        allowfullscreen
      />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.review-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $gray-100;
}

.iframe-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.embed-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
