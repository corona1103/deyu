<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
import MobileTabBar from './MobileTabBar.vue'
import TabletSidebar from './TabletSidebar.vue'

const route = useRoute()
const { showBottomNav, showSidebar } = useResponsive()

const hideLayout = computed(() => route.meta.hideLayout === true)
</script>

<template>
  <div class="app-layout">
    <!-- 侧边栏 (桌面端) -->
    <TabletSidebar v-if="showSidebar && !hideLayout" />

    <!-- 主内容区 -->
    <main
      class="main-content"
      :class="{
        'with-sidebar': showSidebar && !hideLayout,
        'with-bottom-nav': showBottomNav && !hideLayout
      }"
    >
      <slot />
    </main>

    <!-- 底部导航 (移动端) -->
    <MobileTabBar v-if="showBottomNav && !hideLayout" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.app-layout {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  min-height: 100vh;
  transition: padding 0.3s;

  &.with-sidebar {
    margin-left: 250px;
  }

  &.with-bottom-nav {
    padding-bottom: calc($bottom-nav-height + $safe-area-bottom);
  }
}
</style>
