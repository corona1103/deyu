<script setup lang="ts">
import { ref, computed } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'
import type { StatPeriod } from '@/types'

// 当前选中的榜单维度
const currentDimension = ref<'personal' | 'group' | 'single'>('personal')

// 时间周期
const currentPeriod = ref<StatPeriod>('week')

const periods: { key: StatPeriod; label: string }[] = [
  { key: 'day', label: '今日' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'semester', label: '本学期' }
]

// 维度Tab
const dimensions = [
  { key: 'personal', label: '个人榜', icon: '👤' },
  { key: 'group', label: '小组榜', icon: '👥' },
  { key: 'single', label: '单项榜', icon: '🏅' }
]

// 时间周期中文映射
const periodLabels: Record<StatPeriod, string> = {
  day: '今日',
  week: '本周',
  month: '本月',
  semester: '本学期'
}

// 个人榜数据 - 全班50人
const allStudents = ref([
  { rank: 1, name: '徐婉云', icon: '🐸', score: 270 },
  { rank: 2, name: '李渡嘉', icon: '🍓', score: 244 },
  { rank: 3, name: '张书诚', icon: '🌱', score: 235 },
  { rank: 4, name: '孙沐昀', icon: '🦋', score: 225 },
  { rank: 5, name: '刘燕杭', icon: '🌸', score: 212 },
  { rank: 6, name: '马子扬', icon: '🌟', score: 198 },
  { rank: 7, name: '张京钰', icon: '🎀', score: 197 },
  { rank: 8, name: '王梓萱', icon: '🌻', score: 189 },
  { rank: 9, name: '邱翌泽', icon: '🍀', score: 187 },
  { rank: 10, name: '张惟瑾', icon: '🌈', score: 185 },
  { rank: 11, name: '陆子涵', icon: '⭐', score: 182 },
  { rank: 12, name: '姚思琪', icon: '🎯', score: 178 },
  { rank: 13, name: '刘玥希', icon: '🌺', score: 176 },
  { rank: 14, name: '王泊远', icon: '🎨', score: 173 },
  { rank: 15, name: '林悦然', icon: '🎵', score: 170 },
  { rank: 16, name: '毛昱涵', icon: '🌙', score: 168 },
  { rank: 17, name: '何雨泽', icon: '☀️', score: 165 },
  { rank: 18, name: '陈思琪', icon: '🍎', score: 162 },
  { rank: 19, name: '王子轩', icon: '🎪', score: 160 },
  { rank: 20, name: '赵晨曦', icon: '🌊', score: 158 },
  { rank: 21, name: '吴佳琪', icon: '🎭', score: 156 },
  { rank: 22, name: '郑宇航', icon: '🚀', score: 154 },
  { rank: 23, name: '黄诗涵', icon: '🎹', score: 152 },
  { rank: 24, name: '杨子涵', icon: '🎸', score: 150 },
  { rank: 25, name: '孙梓萱', icon: '🎺', score: 148 },
  { rank: 26, name: '罗诗琪', icon: '🎻', score: 145 },
  { rank: 27, name: '谢子豪', icon: '🏀', score: 143 },
  { rank: 28, name: '唐欣妍', icon: '⚽', score: 141 },
  { rank: 29, name: '冯浩宇', icon: '🏈', score: 139 },
  { rank: 30, name: '程浩月', icon: '🎾', score: 137 },
  { rank: 31, name: '孙雅诺', icon: '🏐', score: 135 },
  { rank: 32, name: '陈翌泽', icon: '🎱', score: 132 },
  { rank: 33, name: '李嘉懿', icon: '🎳', score: 128 },
  { rank: 34, name: '吕思远', icon: '🏆', score: 125 },
  { rank: 35, name: '魏子轩', icon: '🎖️', score: 121 },
  { rank: 36, name: '蒋雨萱', icon: '🏅', score: 118 },
  { rank: 37, name: '沈梓涵', icon: '🎗️', score: 115 },
  { rank: 38, name: '李牧谦', icon: '🌴', score: 112 },
  { rank: 39, name: '刘昕佳策', icon: '🌵', score: 108 },
  { rank: 40, name: '徐奕洲', icon: '🌲', score: 105 },
  { rank: 41, name: '罗蕊瑶', icon: '🌳', score: 101 },
  { rank: 42, name: '潘子琪', icon: '🌾', score: 98 },
  { rank: 43, name: '董雨欣', icon: '🌿', score: 95 },
  { rank: 44, name: '袁浩然', icon: '🍃', score: 92 },
  { rank: 45, name: '邓诗雨', icon: '🍂', score: 89 },
  { rank: 46, name: '许子墨', icon: '🍁', score: 86 },
  { rank: 47, name: '崔浩宇', icon: '🍄', score: 82 },
  { rank: 48, name: '钟雨桐', icon: '🌰', score: 78 },
  { rank: 49, name: '廖欣怡', icon: '🥜', score: 75 },
  { rank: 50, name: '侯子墨', icon: '🫘', score: 72 }
])

// 组榜数据 - 6个小组（含组员详情）
const groupRanking = ref([
  {
    rank: 1, name: '博雅组', icon: '🦁', score: 1245,
    students: [
      { name: '徐婉云', score: 235 }, { name: '孙沐昀', score: 269 }, { name: '刘玥希', score: 127 },
      { name: '毛昱涵', score: 160 }, { name: '陈思琪', score: 198 }, { name: '王子轩', score: 176 },
      { name: '李欣怡', score: 145 }, { name: '张浩然', score: 132 }, { name: '刘雨桐', score: 118 },
      { name: '周子墨', score: 105 }
    ]
  },
  {
    rank: 2, name: '力行组', icon: '🐰', score: 1367,
    students: [
      { name: '李渡嘉', score: 270 }, { name: '张书诚', score: 244 }, { name: '邱翌泽', score: 154 },
      { name: '张惟瑾', score: 189 }, { name: '赵晨曦', score: 201 }, { name: '吴佳琪', score: 167 },
      { name: '郑宇航', score: 143 }, { name: '黄诗涵', score: 128 }, { name: '杨子涵', score: 112 },
      { name: '孙梓萱', score: 98 }
    ]
  },
  {
    rank: 3, name: '致远组', icon: '🐼', score: 1188,
    students: [
      { name: '马子扬', score: 154 }, { name: '张京钰', score: 197 }, { name: '刘燕杭', score: 212 },
      { name: '王泊远', score: 173 }, { name: '林悦然', score: 165 }, { name: '何雨泽', score: 148 },
      { name: '罗诗琪', score: 134 }, { name: '谢子豪', score: 121 }, { name: '唐欣妍', score: 108 },
      { name: '冯浩宇', score: 95 }
    ]
  },
  {
    rank: 4, name: '笃行组', icon: '🦊', score: 987,
    students: [
      { name: '程浩月', score: 214 }, { name: '孙雅诺', score: 142 }, { name: '陈翌泽', score: 141 },
      { name: '李嘉懿', score: 112 }, { name: '吕思远', score: 178 }, { name: '魏子轩', score: 156 },
      { name: '蒋雨萱', score: 139 }, { name: '沈梓涵', score: 124 }
    ]
  },
  {
    rank: 5, name: '明德组', icon: '🐧', score: 1023,
    students: [
      { name: '李牧谦', score: 78 }, { name: '刘昕佳策', score: 170 }, { name: '徐奕洲', score: 145 },
      { name: '罗蕊瑶', score: 136 }, { name: '潘子琪', score: 188 }, { name: '董雨欣', score: 162 },
      { name: '袁浩然', score: 147 }, { name: '邓诗雨', score: 131 }, { name: '许子墨', score: 97 }
    ]
  },
  {
    rank: 6, name: '日新组', icon: '🦌', score: 1165,
    students: [
      { name: '王梓萱', score: 225 }, { name: '陆子涵', score: 198 }, { name: '姚思琪', score: 176 },
      { name: '崔浩宇', score: 158 }, { name: '钟雨桐', score: 143 }, { name: '谭子轩', score: 129 },
      { name: '廖欣怡', score: 115 }, { name: '邱梓涵', score: 101 }, { name: '侯子墨', score: 96 }
    ]
  }
])

// 单项榜数据
const singleCategories = ref([
  {
    name: '作业',
    icon: '📚',
    ranking: [
      { rank: 1, name: '徐婉云', score: 180 },
      { rank: 2, name: '李渡嘉', score: 165 },
      { rank: 3, name: '张书诚', score: 158 },
      { rank: 4, name: '孙沐昀', score: 152 },
      { rank: 5, name: '刘燕杭', score: 145 }
    ]
  },
  {
    name: '体育活动',
    icon: '⚽',
    ranking: [
      { rank: 1, name: '马子扬', score: 68 },
      { rank: 2, name: '王泊远', score: 62 },
      { rank: 3, name: '郑宇航', score: 55 },
      { rank: 4, name: '谢子豪', score: 48 },
      { rank: 5, name: '冯浩宇', score: 42 }
    ]
  },
  {
    name: '阅读',
    icon: '📖',
    ranking: [
      { rank: 1, name: '张京钰', score: 45 },
      { rank: 2, name: '王梓萱', score: 42 },
      { rank: 3, name: '林悦然', score: 38 },
      { rank: 4, name: '黄诗涵', score: 35 },
      { rank: 5, name: '罗诗琪', score: 32 }
    ]
  },
  {
    name: '课堂表现',
    icon: '🎓',
    ranking: [
      { rank: 1, name: '邱翌泽', score: 52 },
      { rank: 2, name: '张惟瑾', score: 48 },
      { rank: 3, name: '陆子涵', score: 45 },
      { rank: 4, name: '姚思琪', score: 42 },
      { rank: 5, name: '刘玥希', score: 38 }
    ]
  },
  {
    name: '劳动',
    icon: '🧹',
    ranking: [
      { rank: 1, name: '赵晨曦', score: 35 },
      { rank: 2, name: '吴佳琪', score: 32 },
      { rank: 3, name: '杨子涵', score: 28 },
      { rank: 4, name: '孙梓萱', score: 25 },
      { rank: 5, name: '唐欣妍', score: 22 }
    ]
  },
  {
    name: '文明礼仪',
    icon: '🤝',
    ranking: [
      { rank: 1, name: '毛昱涵', score: 28 },
      { rank: 2, name: '何雨泽', score: 25 },
      { rank: 3, name: '陈思琪', score: 22 },
      { rank: 4, name: '王子轩', score: 20 },
      { rank: 5, name: '程浩月', score: 18 }
    ]
  }
])

// Toast状态
const toastMessage = ref('')
const showToast = ref(false)

function toast(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

function switchPeriod(period: StatPeriod) {
  currentPeriod.value = period
  toast(`已切换到「${periodLabels[period]}」数据`)
}

function switchDimension(dim: 'personal' | 'group' | 'single') {
  currentDimension.value = dim
  const labels = { personal: '个人榜', group: '小组榜', single: '单项榜' }
  toast(`查看「${labels[dim]}」`)
}

// 个人榜分列显示
const personalColumns = computed(() => {
  const cols = [[], [], [], [], []] as typeof allStudents.value[]
  allStudents.value.forEach((student, idx) => {
    cols[idx % 5].push(student)
  })
  return cols
})
</script>

<template>
  <div class="ranking-page">
    <TopNav />

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部控制栏 -->
      <div class="control-bar">
        <div class="dimension-tabs">
          <div
            v-for="dim in dimensions"
            :key="dim.key"
            class="dimension-tab"
            :class="{ active: currentDimension === dim.key }"
            @click="switchDimension(dim.key as 'personal' | 'group' | 'single')"
          >
            <span class="tab-icon">{{ dim.icon }}</span>
            <span class="tab-label">{{ dim.label }}</span>
          </div>
        </div>
        <div class="period-selector">
          <div
            v-for="period in periods"
            :key="period.key"
            class="period-item"
            :class="{ active: currentPeriod === period.key }"
            @click="switchPeriod(period.key)"
          >
            {{ period.label }}
          </div>
        </div>
      </div>

      <!-- 个人榜 -->
      <div v-if="currentDimension === 'personal'" class="personal-ranking">
        <div class="ranking-header">
          <span class="header-icon">🏆</span>
          <span class="header-title">个人积分排行榜</span>
          <span class="header-count">共 {{ allStudents.length }} 人</span>
        </div>
        <div class="personal-grid">
          <div v-for="(column, colIdx) in personalColumns" :key="colIdx" class="personal-column">
            <div
              v-for="student in column"
              :key="student.rank"
              class="personal-item"
              :class="{ 'top-three': student.rank <= 3 }"
            >
              <span class="rank-num" :class="{ gold: student.rank === 1, silver: student.rank === 2, bronze: student.rank === 3 }">
                {{ student.rank <= 3 ? ['🥇', '🥈', '🥉'][student.rank - 1] : student.rank }}
              </span>
              <span class="student-name">{{ student.name }}</span>
              <span class="student-score">
                <span class="star">★</span>{{ student.score }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 小组榜 -->
      <div v-if="currentDimension === 'group'" class="group-ranking">
        <div class="ranking-header">
          <span class="header-icon">🏆</span>
          <span class="header-title">小组积分排行榜</span>
          <span class="header-count">共 {{ groupRanking.length }} 组</span>
        </div>
        <div class="group-grid">
          <div
            v-for="group in groupRanking"
            :key="group.rank"
            class="group-card"
          >
            <div class="group-header">
              <div class="group-icon">{{ group.icon }}</div>
              <div class="group-name">{{ group.name }}</div>
              <div class="group-total">
                <span class="trophy">🏆</span>
                <span class="total-value">{{ group.score.toLocaleString() }}</span>
              </div>
            </div>
            <div class="group-students">
              <div
                v-for="(student, idx) in group.students"
                :key="idx"
                class="group-student-item"
              >
                <span class="stu-name">{{ student.name }}</span>
                <span class="stu-score">
                  <span class="star">★</span>{{ student.score }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 单项榜 -->
      <div v-if="currentDimension === 'single'" class="single-ranking">
        <div class="ranking-header">
          <span class="header-icon">🏆</span>
          <span class="header-title">单项积分排行榜</span>
          <span class="header-count">共 {{ singleCategories.length }} 个单项</span>
        </div>
        <div class="single-grid">
          <div v-for="category in singleCategories" :key="category.name" class="single-card">
            <div class="single-header">
              <span class="single-icon">{{ category.icon }}</span>
              <span class="single-name">{{ category.name }}</span>
            </div>
            <div class="single-list">
              <div
                v-for="item in category.ranking"
                :key="item.rank"
                class="single-item"
              >
                <span class="item-rank" :class="{ gold: item.rank === 1, silver: item.rank === 2, bronze: item.rank === 3 }">
                  {{ item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank }}
                </span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-score">{{ item.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部激励语 -->
    <div class="motivation-text">
      ✨ 每一次努力的进步，都是成长路上的光 ✨
    </div>

    <!-- Toast 消息 -->
    <div class="toast" :class="{ show: showToast }">{{ toastMessage }}</div>
  </div>
</template>

<style scoped lang="scss">
// 主题色 - 温暖橙红色系
$primary-orange: #FF6B35;
$primary-red: #E53935;
$warm-bg: #FFF8F5;
$card-bg: #FFFFFF;
$text-primary: #2D3436;
$text-secondary: #636E72;
$text-muted: #B2BEC3;
$gold: #FFD700;
$green: #4CAF50;

.ranking-page {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(180deg, $warm-bg 0%, #FFF5F0 50%, #FFEEE8 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.ranking-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 10% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(229, 57, 53, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.main-content {
  flex: 1;
  padding: 20px 36px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

// 控制栏
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dimension-tabs {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.dimension-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 18px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  .tab-icon {
    font-size: 20px;
  }

  &:hover {
    background: rgba($primary-orange, 0.1);
    color: $primary-orange;
  }

  &.active {
    background: linear-gradient(135deg, $primary-orange, $primary-red);
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba($primary-orange, 0.4);
  }
}

.period-selector {
  display: flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px;
  border-radius: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.period-item {
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 18px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba($primary-orange, 0.1);
    color: $primary-orange;
  }

  &.active {
    background: linear-gradient(135deg, $primary-orange, $primary-red);
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba($primary-orange, 0.3);
  }
}

// 榜单标题
.ranking-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
}

.header-icon {
  font-size: 32px;
}

.header-title {
  font-size: 28px;
  font-weight: bold;
  color: $text-primary;
}

.header-count {
  margin-left: auto;
  font-size: 16px;
  color: $text-muted;
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: 20px;
}

// 个人榜
.personal-ranking {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.personal-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.personal-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.personal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: $card-bg;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba($primary-orange, 0.15);
  }

  &.top-three {
    background: linear-gradient(90deg, rgba($gold, 0.1), $card-bg);
    border-left: 3px solid $gold;
  }
}

.rank-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: $text-muted;
  background: #f5f5f5;
  border-radius: 50%;

  &.gold, &.silver, &.bronze {
    background: transparent;
    font-size: 20px;
  }
}

.student-name {
  flex: 1;
  font-size: 17px;
  color: $text-primary;
  white-space: nowrap;
}

.student-score {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 16px;
  font-weight: bold;
  color: $primary-orange;

  .star {
    color: $gold;
    font-size: 12px;
  }
}

// 小组榜
.group-ranking {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.group-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.group-card {
  background: $card-bg;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba($primary-orange, 0.15);
  }
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px dashed #f0f0f0;
  margin-bottom: 12px;
}

.group-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.group-name {
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  color: $primary-orange;
}

.group-total {
  display: flex;
  align-items: center;
  gap: 4px;

  .trophy {
    font-size: 16px;
  }

  .total-value {
    font-size: 20px;
    font-weight: bold;
    color: $primary-orange;
  }
}

.group-students {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.group-student-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #FAFAFA;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #FFF3E0;
  }
}

.stu-name {
  font-size: 15px;
  color: $text-primary;
  white-space: nowrap;
}

.stu-score {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  color: $primary-orange;
  font-weight: 500;

  .star {
    color: $gold;
    font-size: 10px;
  }
}

// 单项榜
.single-ranking {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.single-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.single-card {
  background: $card-bg;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.single-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px dashed #f0f0f0;
  margin-bottom: 12px;
}

.single-icon {
  font-size: 28px;
}

.single-name {
  font-size: 20px;
  font-weight: bold;
  color: $text-primary;
}

.single-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.single-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #FFF8F5;
  }
}

.item-rank {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  color: $text-muted;

  &.gold, &.silver, &.bronze {
    font-size: 18px;
  }
}

.item-name {
  flex: 1;
  font-size: 16px;
  color: $text-primary;
}

.item-score {
  font-size: 16px;
  font-weight: bold;
  color: $primary-orange;
}

// 激励语
.motivation-text {
  text-align: center;
  font-size: 18px;
  color: $primary-orange;
  padding: 12px;
  letter-spacing: 2px;
}

// Toast
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 14px 36px;
  background: linear-gradient(135deg, $primary-orange, $primary-red);
  color: white;
  border-radius: 32px;
  font-size: 17px;
  font-weight: 500;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba($primary-orange, 0.4);

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
