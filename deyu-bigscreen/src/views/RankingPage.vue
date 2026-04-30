<script setup lang="ts">
import { ref, computed } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'
import rankingDecor from '@/assets/images/ranking-bg.png'
import coinIcon from '@/assets/images/coin.svg'
import type { StatPeriod } from '@/types'

// 当前选中的榜单维度
const currentDimension = ref<'personal' | 'group' | 'single'>('personal')

// 时间周期
const currentPeriod = ref<StatPeriod>('day')

const periods: { key: StatPeriod; label: string }[] = [
  { key: 'day', label: '日榜' },
  { key: 'week', label: '周榜' },
  { key: 'month', label: '月榜' },
  { key: 'semester', label: '学期榜' }
]

// 维度Tab
const dimensions = [
  { key: 'personal', label: '个人榜' },
  { key: 'group', label: '小组榜' },
  { key: 'single', label: '单项榜' }
]

// 时间周期中文映射
const periodLabels: Record<StatPeriod, string> = {
  day: '日榜',
  week: '周榜',
  month: '月榜',
  semester: '学期榜'
}

// 个人榜数据 - 全班36人
const allStudents = ref([
  { rank: 1, name: '陈宇桐', score: 100 },
  { rank: 2, name: '吴易奕', score: 100 },
  { rank: 3, name: '张梓航', score: 100 },
  { rank: 4, name: '周兆贤', score: 100 },
  { rank: 5, name: '孙楷', score: 100 },
  { rank: 6, name: '赵德震', score: 100 },
  { rank: 7, name: '赵俊英', score: 100 },
  { rank: 8, name: '赵涛', score: 100 },
  { rank: 9, name: '李婧妍', score: 100 },
  { rank: 10, name: '李文轩', score: 95 },
  { rank: 11, name: '郑淼杰', score: 95 },
  { rank: 12, name: '孙恒易', score: 95 },
  { rank: 13, name: '张静怡', score: 98 },
  { rank: 14, name: '周维佳', score: 98 },
  { rank: 15, name: '孙慧', score: 98 },
  { rank: 16, name: '王浩然', score: 92 },
  { rank: 17, name: '李政', score: 92 },
  { rank: 18, name: '周兆贤', score: 92 },
  { rank: 19, name: '刘婷婷', score: 97 },
  { rank: 20, name: '吴晨号', score: 97 },
  { rank: 21, name: '郑清予', score: 97 },
  { rank: 22, name: '赵子涵', score: 96 },
  { rank: 23, name: '赵吾光', score: 96 },
  { rank: 24, name: '孙书贤', score: 96 },
  { rank: 25, name: '孙晓明', score: 94 },
  { rank: 26, name: '赵雾珉', score: 94 },
  { rank: 27, name: '李世安', score: 94 },
  { rank: 28, name: '周雨欣', score: 99 },
  { rank: 29, name: '郑源鼎', score: 99 },
  { rank: 30, name: '赵冬梅', score: 99 },
  { rank: 31, name: '吴鹏飞', score: 97 },
  { rank: 32, name: '赵子峰', score: 97 },
  { rank: 33, name: '赵天宇', score: 97 },
  { rank: 34, name: '郑佳慧', score: 95 },
  { rank: 35, name: '吴萍兰', score: 95 },
  { rank: 36, name: '冯靖宇', score: 95 }
])

// 组榜数据
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
    name: '快乐',
    icon: '😊',
    ranking: [
      { rank: 1, name: '马子扬', score: 68 },
      { rank: 2, name: '王泊远', score: 62 },
      { rank: 3, name: '郑宇航', score: 55 },
      { rank: 4, name: '谢子豪', score: 48 },
      { rank: 5, name: '冯浩宇', score: 42 }
    ]
  },
  {
    name: '进取',
    icon: '🚀',
    ranking: [
      { rank: 1, name: '张京钰', score: 52 },
      { rank: 2, name: '邱翌泽', score: 48 },
      { rank: 3, name: '张惟瑾', score: 45 },
      { rank: 4, name: '陆子涵', score: 42 },
      { rank: 5, name: '刘玥希', score: 38 }
    ]
  },
  {
    name: '儒雅',
    icon: '📖',
    ranking: [
      { rank: 1, name: '王梓萱', score: 45 },
      { rank: 2, name: '林悦然', score: 42 },
      { rank: 3, name: '黄诗涵', score: 38 },
      { rank: 4, name: '罗诗琪', score: 35 },
      { rank: 5, name: '何雨泽', score: 32 }
    ]
  },
  {
    name: '大气',
    icon: '💪',
    ranking: [
      { rank: 1, name: '赵晨曦', score: 35 },
      { rank: 2, name: '毛昱涵', score: 32 },
      { rank: 3, name: '陈思琪', score: 28 },
      { rank: 4, name: '吴佳琪', score: 25 },
      { rank: 5, name: '程浩月', score: 22 }
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

// 前三名
const top3 = computed(() => allStudents.value.slice(0, 3))

// 第4名及以后，按3列排列
const restStudents = computed(() => allStudents.value.slice(3))

const column1 = computed(() => restStudents.value.filter((_, i) => i % 3 === 0))
const column2 = computed(() => restStudents.value.filter((_, i) => i % 3 === 1))
const column3 = computed(() => restStudents.value.filter((_, i) => i % 3 === 2))
</script>

<template>
  <div class="ranking-page">
    <TopNav />

    <main class="main-content">
      <!-- 左侧装饰图 -->
      <div class="left-decor">
        <img :src="rankingDecor" alt="" class="decor-img" />
      </div>

      <!-- 右侧排行榜内容 -->
      <div class="ranking-content">
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
              {{ dim.label }}
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
          <!-- Top 3 领奖台 -->
          <div class="podium">
            <!-- 第2名 - 左 -->
            <div class="podium-item second">
              <div class="podium-crown">
                <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                  <path d="M4 28h32V16L28 22 20 8 12 22 4 16v12z" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1"/>
                  <circle cx="20" cy="6" r="4" fill="#C0C0C0"/>
                  <circle cx="4" cy="14" r="3" fill="#C0C0C0"/>
                  <circle cx="36" cy="14" r="3" fill="#C0C0C0"/>
                </svg>
              </div>
              <div class="podium-name">{{ top3[1]?.name }}</div>
              <div class="podium-score">{{ top3[1]?.score }} <img :src="coinIcon" class="coin" alt="coin" /></div>
              <div class="podium-badge silver">
                <span class="badge-num">2</span>
              </div>
            </div>
            <!-- 第1名 - 中 -->
            <div class="podium-item first">
              <div class="podium-crown">
                <svg width="48" height="38" viewBox="0 0 48 38" fill="none">
                  <path d="M4 34h40V18L34 26 24 8 14 26 4 18v16z" fill="#FFD700" stroke="#E6C200" stroke-width="1"/>
                  <circle cx="24" cy="6" r="5" fill="#FFD700"/>
                  <circle cx="4" cy="16" r="4" fill="#FFD700"/>
                  <circle cx="44" cy="16" r="4" fill="#FFD700"/>
                </svg>
              </div>
              <div class="podium-name">{{ top3[0]?.name }}</div>
              <div class="podium-score">{{ top3[0]?.score }} <img :src="coinIcon" class="coin" alt="coin" /></div>
              <div class="podium-badge gold">
                <span class="badge-num">1</span>
              </div>
            </div>
            <!-- 第3名 - 右 -->
            <div class="podium-item third">
              <div class="podium-crown">
                <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                  <path d="M4 28h32V16L28 22 20 8 12 22 4 16v12z" fill="#CD7F32" stroke="#B8722E" stroke-width="1"/>
                  <circle cx="20" cy="6" r="4" fill="#CD7F32"/>
                  <circle cx="4" cy="14" r="3" fill="#CD7F32"/>
                  <circle cx="36" cy="14" r="3" fill="#CD7F32"/>
                </svg>
              </div>
              <div class="podium-name">{{ top3[2]?.name }}</div>
              <div class="podium-score">{{ top3[2]?.score }} <img :src="coinIcon" class="coin" alt="coin" /></div>
              <div class="podium-badge bronze">
                <span class="badge-num">3</span>
              </div>
            </div>
          </div>

          <!-- 排名列表 - 3列 -->
          <div class="ranking-list">
            <div class="ranking-column">
              <div v-for="student in column1" :key="student.rank" class="ranking-row">
                <span class="row-rank">{{ student.rank }}</span>
                <span class="row-name">{{ student.name }}</span>
                <span class="row-score">
                  <span class="score-val">{{ student.score }}</span>
                  <img :src="coinIcon" class="coin-small" alt="coin" />
                </span>
              </div>
            </div>
            <div class="ranking-column">
              <div v-for="student in column2" :key="student.rank" class="ranking-row">
                <span class="row-rank">{{ student.rank }}</span>
                <span class="row-name">{{ student.name }}</span>
                <span class="row-score">
                  <span class="score-val">{{ student.score }}</span>
                  <img :src="coinIcon" class="coin-small" alt="coin" />
                </span>
              </div>
            </div>
            <div class="ranking-column">
              <div v-for="student in column3" :key="student.rank" class="ranking-row">
                <span class="row-rank">{{ student.rank }}</span>
                <span class="row-name">{{ student.name }}</span>
                <span class="row-score">
                  <span class="score-val">{{ student.score }}</span>
                  <img :src="coinIcon" class="coin-small" alt="coin" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 小组榜 -->
        <div v-if="currentDimension === 'group'" class="group-ranking">
          <div class="group-grid">
            <div v-for="group in groupRanking" :key="group.rank" class="group-card">
              <div class="group-header">
                <div class="group-icon">{{ group.icon }}</div>
                <div class="group-name">{{ group.name }}</div>
                <div class="group-total">
                  <span class="trophy">🏆</span>
                  <span class="total-value">{{ group.score.toLocaleString() }}</span>
                </div>
              </div>
              <div class="group-students">
                <div v-for="(student, idx) in group.students" :key="idx" class="group-student-item">
                  <span class="stu-name">{{ student.name }}</span>
                  <span class="stu-score">{{ student.score }} <img :src="coinIcon" class="coin-inline" alt="coin" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 单项榜 -->
        <div v-if="currentDimension === 'single'" class="single-ranking">
          <div class="single-grid">
            <div v-for="category in singleCategories" :key="category.name" class="single-card">
              <div class="single-header">
                <span class="single-icon">{{ category.icon }}</span>
                <span class="single-name">{{ category.name }}</span>
              </div>
              <div class="single-list">
                <div v-for="item in category.ranking" :key="item.rank" class="single-item">
                  <span class="item-rank">{{ item.rank }}</span>
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-score">{{ item.score }} <img :src="coinIcon" class="coin-inline" alt="coin" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast -->
    <div class="toast" :class="{ show: showToast }">{{ toastMessage }}</div>
  </div>
</template>

<style scoped lang="scss">
$primary: #E8524A;
$primary-dark: #8B0000;
$bg-pink: #FFF0EE;
$bg-pink-deep: #FFE4E0;
$gold: #FFD700;
$silver: #C0C0C0;
$bronze: #CD7F32;
$text-dark: #333;
$text-gray: #666;
$text-light: #999;

.ranking-page {
  width: 1920px;
  height: 1080px;
  background: #FDF2F3;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

// 左侧装饰区域
.left-decor {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .decor-img {
    width: 88%;
    max-height: 90%;
    object-fit: contain;
    pointer-events: none;
  }
}

// 右侧排行榜内容
.ranking-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 16px 20px 16px 0;
  background: rgba(255, 255, 255, 0.65);
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 24px 28px;
}

// 控制栏
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dimension-tabs {
  display: flex;
  background: white;
  border-radius: 30px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dimension-tab {
  padding: 12px 36px;
  border-radius: 25px;
  font-size: 18px;
  color: $text-gray;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    color: $primary;
  }

  &.active {
    background: $primary;
    color: white;
    font-weight: bold;
  }
}

.period-selector {
  display: flex;
  background: white;
  border-radius: 30px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.period-item {
  padding: 10px 22px;
  border-radius: 25px;
  font-size: 16px;
  color: $text-gray;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    color: $primary;
  }

  &.active {
    background: $primary;
    color: white;
    font-weight: bold;
  }
}

// 个人榜
.personal-ranking {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 领奖台
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;
  padding: 10px 0 16px;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &.first {
    order: 2;
    margin-bottom: 10px;
  }
  &.second {
    order: 1;
  }
  &.third {
    order: 3;
  }
}

.podium-crown {
  display: flex;
  align-items: center;
  justify-content: center;
}

.podium-name {
  font-size: 17px;
  font-weight: bold;
  color: $text-dark;
}

.podium-score {
  font-size: 16px;
  font-weight: bold;
  color: $primary;
  display: flex;
  align-items: center;
  gap: 4px;
}

.coin {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.podium-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 2px;

  &.gold {
    background: radial-gradient(circle, #FFE066, #FFD700, #E6B800);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
    width: 56px;
    height: 56px;
  }

  &.silver {
    background: radial-gradient(circle, #E8E8E8, #C0C0C0, #A8A8A8);
    box-shadow: 0 4px 12px rgba(192, 192, 192, 0.5);
  }

  &.bronze {
    background: radial-gradient(circle, #E8A060, #CD7F32, #B8722E);
    box-shadow: 0 4px 12px rgba(205, 127, 50, 0.5);
  }

  .badge-num {
    color: white;
    font-size: 22px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  &.gold .badge-num {
    font-size: 26px;
  }
}

// 排名列表
.ranking-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 20px;
  overflow: hidden;
}

.ranking-column {
  display: flex;
  flex-direction: column;
}

.ranking-row {
  display: flex;
  align-items: center;
  padding: 11px 16px;
  border-radius: 8px;
  transition: background 0.2s;

  &:nth-child(odd) {
    background: rgba(#F94348, 0.1);
  }

  &:nth-child(even) {
    background: transparent;
  }

  &:hover {
    background: rgba(#F94348, 0.15);
  }
}

.row-rank {
  width: 32px;
  font-size: 16px;
  font-weight: 500;
  color: $text-light;
  text-align: center;
}

.row-name {
  flex: 1;
  font-size: 17px;
  color: $text-dark;
  margin-left: 12px;
}

.row-score {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-val {
  font-size: 17px;
  font-weight: bold;
  color: $primary;
}

.coin-small {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

.coin-inline {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

// 小组榜
.group-ranking {
  flex: 1;
  overflow: auto;
}

.group-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.group-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 10px;
}

.group-icon {
  width: 40px;
  height: 40px;
  background: #FFF3E0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.group-name {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: $primary;
}

.group-total {
  display: flex;
  align-items: center;
  gap: 4px;

  .trophy { font-size: 16px; }
  .total-value {
    font-size: 18px;
    font-weight: bold;
    color: $primary;
  }
}

.group-students {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.group-student-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  background: #FAFAFA;
  border-radius: 6px;
  font-size: 14px;
}

.stu-name { color: $text-dark; }
.stu-score { color: $primary; font-weight: 500; }

// 单项榜
.single-ranking {
  flex: 1;
  overflow: auto;
}

.single-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.single-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.single-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 10px;
}

.single-icon { font-size: 24px; }
.single-name {
  font-size: 18px;
  font-weight: bold;
  color: $text-dark;
}

.single-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.single-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;

  &:hover { background: #FFF5F3; }
}

.item-rank {
  width: 24px;
  font-size: 14px;
  font-weight: bold;
  color: $text-light;
  text-align: center;
}

.item-name {
  flex: 1;
  font-size: 15px;
  color: $text-dark;
}

.item-score {
  font-size: 15px;
  font-weight: bold;
  color: $primary;
}

// Toast
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 14px 36px;
  background: $primary;
  color: white;
  border-radius: 32px;
  font-size: 17px;
  font-weight: 500;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba($primary, 0.4);

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
