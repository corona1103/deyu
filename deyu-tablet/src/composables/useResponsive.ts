import { ref, onMounted, onUnmounted, computed } from 'vue'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024
}

export function useResponsive() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 768)
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 1024)

  const deviceType = computed<DeviceType>(() => {
    if (windowWidth.value < BREAKPOINTS.tablet) return 'mobile'
    if (windowWidth.value < BREAKPOINTS.desktop) return 'tablet'
    return 'desktop'
  })

  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')
  const isLandscape = computed(() => windowWidth.value > windowHeight.value)

  // 网格列数
  const gridCols = computed(() => {
    if (isMobile.value) return 2
    if (isTablet.value) return 3
    return 4
  })

  // 是否显示底部导航
  const showBottomNav = computed(() => isMobile.value)

  // 是否显示侧边栏
  const showSidebar = computed(() => isDesktop.value)

  function handleResize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    windowWidth,
    windowHeight,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    gridCols,
    showBottomNav,
    showSidebar
  }
}
