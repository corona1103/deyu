<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useReportStore } from '@/stores/report'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard, BaseAvatar } from '@/components/common'

const router = useRouter()
const userStore = useUserStore()
const reportStore = useReportStore()

interface Warning {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  type: 'behavior' | 'homework' | 'attendance'
  level: 'low' | 'medium' | 'high'
  message: string
  analysis: string
  guidance: string
  time: string
}

const allWarnings = ref<Warning[]>([
  // c1 三年级1班
  {
    id: '1', studentId: 's16', studentName: '李嘉懿', classId: 'c1', className: '三年级1班',
    type: 'behavior', level: 'high',
    message: '本周连续3天课堂表现不佳',
    analysis: '该生近期在「儒雅」和「快乐」两个维度持续出现负面行为记录，包括情绪发泄、言语伤害同学等。这可能反映出该生正面临较大的情绪压力，缺乏有效的情绪调节能力，社交技巧也有待提升。课堂表现不佳可能是内在情绪困扰的外在表现，需要关注其心理健康状态。',
    guidance: '建议老师近期多与李嘉懿进行一对一谈话，了解其情绪波动的深层原因，是否存在家庭环境变化或同伴关系困扰。课堂中可安排其与性格温和的同学同桌，减少冲突机会。给予小型任务（如发作业本），帮助其建立正向关注和成就感。同时建议家长每天安排15分钟亲子交流时间，倾听孩子的心声，用"我理解你的感受"开头回应，而非直接批评行为。',
    time: '2小时前'
  },
  {
    id: '2', studentId: 's15', studentName: '陈翌泽', classId: 'c1', className: '三年级1班',
    type: 'homework', level: 'medium',
    message: '已连续2次未交数学作业',
    analysis: '该生在「进取」维度多次出现未按时完成作业的记录，同时课堂上也有扰乱秩序的行为。这表明该生可能在学习动力和自我管理方面存在困难，缺乏目标意识和时间规划能力。连续未交作业可能意味着学习内容跟不上或对作业产生了逃避心理。',
    guidance: '建议老师先了解陈翌泽作业困难的具体原因——是不会做、忘记了还是不愿做。如果是能力问题，可以适当降低作业难度或安排学习小伙伴互助。课后花5分钟帮他梳理当天作业清单，培养"写完一项划掉一项"的习惯。家长在家可设置固定作业时间，陪伴但不代劳，完成后给予具体表扬（如"今天数学作业写得很工整"），逐步建立学习信心。',
    time: '4小时前'
  },
  {
    id: '3', studentId: 's12', studentName: '王泊远', classId: 'c1', className: '三年级1班',
    type: 'attendance', level: 'low',
    message: '本周迟到1次',
    analysis: '该生偶发迟到，目前频率不高。结合其在「快乐」维度饮水不足、「儒雅」维度个人物品杂乱的记录来看，可能在生活自理和时间管理方面需要引导。单次迟到虽属轻微，但若不加关注，可能逐渐形成习惯性的时间观念松散。',
    guidance: '建议老师温和提醒王泊远注意时间管理，可以引导其尝试前一晚整理好书包、准备好第二天的物品。家长可协助建立"睡前准备+早起流程"的时间表，让孩子参与制定并张贴在醒目位置。对于准时到校的日子给予口头肯定，强化正向行为。目前问题较轻微，重在预防，不必过度紧张。',
    time: '昨天'
  },
  // c2 三年级2班
  {
    id: '4', studentId: 's30', studentName: '杨欣妍', classId: 'c2', className: '三年级2班',
    type: 'behavior', level: 'medium',
    message: '课堂注意力不集中，需多关注',
    analysis: '该生在「快乐」维度有情绪发泄记录，在「儒雅」维度有打断他人说话的行为，在「进取」维度有未按时交作业的情况。综合来看，该生可能在情绪管理和社交规范方面需要更多引导，注意力不集中可能与情绪状态不稳定有关，内心的不安定影响了课堂专注力。',
    guidance: '建议老师在课堂上适时用眼神或轻拍桌子的方式温和提醒杨欣妍回到课堂，避免公开点名批评。可安排其坐在前排靠近老师的位置，减少分心干扰。课间主动与其聊天，了解近期开心和不开心的事。家长可每天陪孩子做10分钟专注力小游戏（如拼图、听故事复述），同时关注孩子的情绪表达，帮助其用语言而非行为来传递感受。',
    time: '3小时前'
  },
  {
    id: '5', studentId: 's25', studentName: '褚明轩', classId: 'c2', className: '三年级2班',
    type: 'homework', level: 'high',
    message: '本周3次未按时交作业',
    analysis: '该生在「进取」维度连续出现作业未交和课堂扰乱行为，在「快乐」维度有危险举动记录，在「儒雅」维度有言语伤害同学的行为，在「大气」维度值日不认真。多维度同时出现负面记录，表明该生可能在行为规范、学习习惯和社交能力方面都存在较大挑战，需要系统性的关注和干预。',
    guidance: '建议老师对褚明轩采用"小步骤+及时反馈"策略：每天只设定1-2个小目标（如"今天按时交语文作业"），完成后立即给予肯定。与其建立每日5分钟的固定沟通时间，关注其情绪状态。班级中可安排"学习伙伴"制度，让一位耐心的同学协助提醒。建议家长尽快与班主任面谈，共同制定为期一个月的改善计划，家校统一标准和奖励方式，必要时可咨询学校心理老师。',
    time: '5小时前'
  },
])

// 本模块独立的班级筛选（仅班主任班级）
const selectedClassId = ref(userStore.homeroomClasses[0]?.id || 'c1')

// 按班级过滤预警
const warnings = computed(() =>
  allWarnings.value.filter(w => w.classId === selectedClassId.value)
)

const currentTab = ref<'all' | 'unhandled'>('unhandled')

function onClassChange(e: Event) {
  selectedClassId.value = (e.target as HTMLSelectElement).value
}

function getLevelColor(level: string) {
  const colors: Record<string, string> = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50'
  }
  return colors[level]
}

function getTypeIcon(type: string) {
  const icons: Record<string, string> = {
    behavior: '⚠️',
    homework: '📋',
    attendance: '⏰'
  }
  return icons[type]
}

function goToStudentReport(warning: Warning) {
  // 设置报告页选中的班级
  reportStore.selectedPeriod = 'week'
  router.push({
    path: '/report',
    query: { classId: warning.classId, studentId: warning.studentId }
  })
}

function handleMarkDone(e: Event, id: string) {
  e.stopPropagation()
  allWarnings.value = allWarnings.value.filter(w => w.id !== id)
}
</script>

<template>
  <div class="warning-page">
    <PageHeader title="预警中心" :show-back="false">
      <template #right>
        <div class="class-selector-wrap">
          <select
            class="class-selector"
            :value="selectedClassId"
            @change="onClassChange"
          >
            <option
              v-for="cls in userStore.homeroomClasses"
              :key="cls.id"
              :value="cls.id"
            >
              {{ cls.name }}
            </option>
          </select>
        </div>
      </template>
    </PageHeader>

    <main class="main-content">
      <!-- Tab 切换 -->
      <div class="tab-bar">
        <div
          class="tab-item"
          :class="{ active: currentTab === 'all' }"
          @click="currentTab = 'all'"
        >
          全部预警
        </div>
        <div
          class="tab-item"
          :class="{ active: currentTab === 'unhandled' }"
          @click="currentTab = 'unhandled'"
        >
          待处理
        </div>
      </div>

      <!-- 预警列表 -->
      <div class="warning-list">
        <BaseCard
          v-for="warning in warnings"
          :key="warning.id"
          class="warning-card"
        >
          <div class="warning-header">
            <div class="warning-left">
              <BaseAvatar :name="warning.studentName" size="md" />
              <div class="warning-info">
                <div class="warning-name">{{ warning.studentName }}</div>
                <div class="warning-class">{{ warning.className }}</div>
                <div class="warning-time">{{ warning.time }}</div>
              </div>
            </div>
            <div
              class="warning-level"
              :style="{ background: getLevelColor(warning.level) }"
            >
              {{ warning.level === 'high' ? '紧急' : warning.level === 'medium' ? '中等' : '轻微' }}
            </div>
          </div>

          <!-- 预警信息 -->
          <div class="warning-content">
            <span class="warning-icon">{{ getTypeIcon(warning.type) }}</span>
            <span class="warning-message">{{ warning.message }}</span>
          </div>

          <!-- 详细分析 -->
          <div class="analysis-section">
            <div class="section-label analysis-label">问题分析</div>
            <div class="analysis-text">{{ warning.analysis }}</div>
          </div>

          <!-- 干预指导建议 -->
          <div class="guidance-section">
            <div class="section-label guidance-label">干预指导建议</div>
            <div class="guidance-text">{{ warning.guidance }}</div>
          </div>

          <!-- 操作按钮 -->
          <div class="warning-actions">
            <button class="action-btn detail" @click="goToStudentReport(warning)">查看详情</button>
            <button class="action-btn mark" @click="handleMarkDone($event, warning.id)">标记已处理</button>
          </div>
        </BaseCard>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.warning-page {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 800px;
    margin: 0 auto;
  }
}

.tab-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tab-item {
  padding: 10px 0;
  font-size: 16px;
  color: $gray-500;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  &.active {
    color: $primary;
    border-color: $primary;
    font-weight: bold;
  }
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.warning-card {
  padding: 15px;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.warning-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warning-info {
  text-align: left;
}

.warning-name {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

.warning-class {
  font-size: 12px;
  color: $gray-500;
  margin-top: 1px;
}

.warning-time {
  font-size: 12px;
  color: $gray-400;
}

.warning-level {
  padding: 4px 12px;
  border-radius: $radius-full;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: $gray-50;
  border-radius: $radius-md;
  margin-bottom: 12px;
}

.warning-icon {
  font-size: 18px;
}

.warning-message {
  flex: 1;
  font-size: 14px;
  color: $gray-700;
  line-height: 1.5;
  font-weight: 500;
}

// 分析 & 指导
.section-label {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: $radius-sm;
  display: inline-block;
  margin-bottom: 6px;
}

.analysis-label {
  background: #FFF3E0;
  color: #E65100;
}

.guidance-label {
  background: #E3F2FD;
  color: #1565C0;
}

.analysis-section {
  margin-bottom: 12px;
}

.analysis-text {
  font-size: 13px;
  color: $gray-600;
  line-height: 1.7;
}

.guidance-section {
  margin-bottom: 14px;
  padding: 12px;
  background: #F5F9FF;
  border-radius: $radius-md;
  border-left: 3px solid #1976D2;
}

.guidance-text {
  font-size: 13px;
  color: $gray-700;
  line-height: 1.7;
}

.warning-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: $radius-md;
  font-size: 14px;
  cursor: pointer;

  &.detail {
    background: linear-gradient(135deg, $primary, $primary-light);
    color: white;
    font-weight: 500;
  }

  &.mark {
    background: #E8F5E9;
    color: $success;
  }
}

.class-selector-wrap {
  display: flex;
  align-items: center;
}

.class-selector {
  padding: 6px 28px 6px 12px;
  border: 1px solid $gray-200;
  border-radius: $radius-full;
  font-size: 13px;
  color: $gray-700;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 10px center;
  appearance: none;
  cursor: pointer;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}
</style>
