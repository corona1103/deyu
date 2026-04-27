<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title: string
  showBack?: boolean
  rightSlot?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: true,
  rightSlot: true
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <header class="page-header">
    <div class="header-top">
      <button
        v-if="showBack"
        class="back-btn touch-active"
        @click="goBack"
      >
        <span class="back-icon">‹</span>
        <span>返回</span>
      </button>
      <div v-else class="back-placeholder" />

      <span class="page-title">{{ title }}</span>

      <div v-if="rightSlot" class="header-right">
        <slot name="right" />
      </div>
      <div v-else class="right-placeholder" />
    </div>

    <slot name="tabs" />
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.page-header {
  background: white;
  padding: 50px 20px 15px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: $shadow-sm;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px 15px;
  }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: $gray-800;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  min-width: 60px;
}

.back-icon {
  font-size: 20px;
  font-weight: bold;
}

.back-placeholder,
.right-placeholder {
  min-width: 60px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
}

.header-right {
  display: flex;
  gap: 10px;
}
</style>
