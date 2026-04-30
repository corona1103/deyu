<script setup lang="ts">
import { ref, computed } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'
import coinIcon from '@/assets/images/coin.svg'

interface HomeworkItem {
  id: string
  name: string
  subject: string
  deadline: string
}

interface StudentSubmission {
  id: string
  name: string
  submitted: boolean
  animating?: boolean
  scoreAnim?: boolean
}

interface GroupData {
  id: number
  name: string
  icon: string
  students: StudentSubmission[]
}

const showCreateModal = ref(false)
const selectedHomeworkId = ref('1')

const homeworkList = ref<HomeworkItem[]>([
  { id: '1', name: '数学作业', subject: '数学', deadline: '2026-04-30 17:00' },
  { id: '2', name: '语文周记', subject: '语文', deadline: '2026-04-28 18:00' },
  { id: '3', name: '英语单词抄写', subject: '英语', deadline: '2026-04-25 17:00' }
])

// 按分组展示学生
const groups = ref<GroupData[]>([
  {
    id: 1, name: '孙沐昀组', icon: '🐱',
    students: [
      { id: '1-1', name: '徐婉云', submitted: false },
      { id: '1-2', name: '孙沐昀', submitted: false },
      { id: '1-3', name: '刘玥希', submitted: false },
      { id: '1-4', name: '毛昱涵', submitted: false },
      { id: '1-5', name: '陈思琪', submitted: false },
      { id: '1-6', name: '王子轩', submitted: false },
      { id: '1-7', name: '李欣怡', submitted: false },
      { id: '1-8', name: '张浩然', submitted: false }
    ]
  },
  {
    id: 2, name: '张书斌组', icon: '🐰',
    students: [
      { id: '2-1', name: '李渡嘉', submitted: false },
      { id: '2-2', name: '张书斌', submitted: false },
      { id: '2-3', name: '邱翌泽', submitted: false },
      { id: '2-4', name: '张惟瑄', submitted: false },
      { id: '2-5', name: '赵晨曦', submitted: false },
      { id: '2-6', name: '吴佳琪', submitted: false },
      { id: '2-7', name: '郑宇航', submitted: false },
      { id: '2-8', name: '黄诗涵', submitted: false }
    ]
  },
  {
    id: 3, name: '刘燕杭组', icon: '🦊',
    students: [
      { id: '3-1', name: '马子扬', submitted: false },
      { id: '3-2', name: '张京钰', submitted: false },
      { id: '3-3', name: '刘燕杭', submitted: false },
      { id: '3-4', name: '王泊远', submitted: false },
      { id: '3-5', name: '林悦然', submitted: false },
      { id: '3-6', name: '何雨泽', submitted: false },
      { id: '3-7', name: '罗诗琪', submitted: false },
      { id: '3-8', name: '谢子豪', submitted: false }
    ]
  },
  {
    id: 4, name: '李嘉懿组', icon: '🐸',
    students: [
      { id: '4-1', name: '程浩月', submitted: false },
      { id: '4-2', name: '孙雅诺', submitted: false },
      { id: '4-3', name: '陈翌泽', submitted: false },
      { id: '4-4', name: '李嘉懿', submitted: false },
      { id: '4-5', name: '吕思远', submitted: false },
      { id: '4-6', name: '魏子轩', submitted: false },
      { id: '4-7', name: '蒋雨萱', submitted: false },
      { id: '4-8', name: '沈梓涵', submitted: false }
    ]
  },
  {
    id: 5, name: '徐奕洲组', icon: '🐻',
    students: [
      { id: '5-1', name: '李牧谦', submitted: false },
      { id: '5-2', name: '刘昕佳葆', submitted: false },
      { id: '5-3', name: '徐奕洲', submitted: false },
      { id: '5-4', name: '罗慕瑶', submitted: false },
      { id: '5-5', name: '潘子琪', submitted: false },
      { id: '5-6', name: '董雨欣', submitted: false },
      { id: '5-7', name: '袁浩然', submitted: false },
      { id: '5-8', name: '邓诗雨', submitted: false }
    ]
  },
  {
    id: 6, name: '王梓萱组', icon: '🦁',
    students: [
      { id: '6-1', name: '王梓萱', submitted: false },
      { id: '6-2', name: '陆子涵', submitted: false },
      { id: '6-3', name: '姚思琪', submitted: false },
      { id: '6-4', name: '崔浩宇', submitted: false },
      { id: '6-5', name: '钟雨桐', submitted: false },
      { id: '6-6', name: '谭子轩', submitted: false },
      { id: '6-7', name: '廖欣怡', submitted: false },
      { id: '6-8', name: '邱梓涵', submitted: false }
    ]
  }
])

const allStudents = computed(() => {
  return groups.value.flatMap(g => g.students)
})

// 创建作业表单
const newHomework = ref({
  subject: '语文',
  title: '',
  deadline: ''
})

const selectedHomework = computed(() => {
  return homeworkList.value.find(h => h.id === selectedHomeworkId.value)
})

const isChineseHomework = computed(() => {
  return selectedHomework.value?.subject === '语文'
})

// 判断当前作业是否已超时（当前时间 > 截止时间）
const isOverdue = computed(() => {
  const hw = selectedHomework.value
  if (!hw) return false
  const deadline = new Date(hw.deadline.replace(' ', 'T'))
  return Date.now() > deadline.getTime()
})

// 根据是否超时返回加分文本：按时+2，超时+1
const scoreText = computed(() => {
  return isOverdue.value ? '+1分' : '+2分'
})

const submissionStats = computed(() => {
  const total = allStudents.value.length
  const submitted = allStudents.value.filter(s => s.submitted).length
  return { submitted, total }
})

function selectHomework(id: string) {
  selectedHomeworkId.value = id
  groups.value.forEach(g => {
    g.students.forEach(s => {
      s.submitted = false
      s.animating = false
    })
  })
}

function markSubmitted(student: StudentSubmission, groupId: number) {
  if (student.submitted || student.animating || student.scoreAnim) return

  // 张书斌组：加分动效 → 灰显保留名字
  if (groupId === 2) {
    student.scoreAnim = true
    setTimeout(() => {
      student.scoreAnim = false
      student.submitted = true
    }, 1500)
    return
  }

  if (isChineseHomework.value) {
    // 语文作业：卡片消失（名字淡出）
    student.animating = true
    setTimeout(() => {
      student.submitted = true
      student.animating = false
    }, 800)
  } else {
    // 数学/英语/其他作业：加分动效 → 卡片隐形
    student.scoreAnim = true
    setTimeout(() => {
      student.scoreAnim = false
      student.submitted = true
    }, 1500)
  }
}

function openCreateModal() {
  const today = new Date()
  today.setHours(17, 0, 0, 0)
  // 用本地时间格式化，避免 toISOString 的 UTC 时区偏移
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  newHomework.value.deadline = `${y}-${m}-${d}T17:00`
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function createHomework() {
  if (!newHomework.value.title) {
    alert('请输入作业标题')
    return
  }

  const newId = String(homeworkList.value.length + 1)
  homeworkList.value.unshift({
    id: newId,
    name: newHomework.value.title,
    subject: newHomework.value.subject,
    deadline: newHomework.value.deadline.replace('T', ' ')
  })

  selectedHomeworkId.value = newId
  newHomework.value.title = ''
  closeCreateModal()
}
</script>

<template>
  <div class="homework-page">
    <TopNav />

    <!-- 子导航栏 -->
    <div class="sub-nav">
      <div class="nav-left">
        <span class="page-title">作业跟踪</span>
        <span class="homework-count">{{ homeworkList.length }} 项作业</span>
      </div>
      <button class="create-btn" @click="openCreateModal">+ 创建作业</button>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧：作业列表 -->
      <div class="homework-list-panel">
        <div
          v-for="homework in homeworkList"
          :key="homework.id"
          class="homework-item"
          :class="{ active: selectedHomeworkId === homework.id }"
          @click="selectHomework(homework.id)"
        >
          <div class="hw-subject-badge" :class="homework.subject">{{ homework.subject }}</div>
          <div class="hw-info">
            <div class="hw-name">{{ homework.name }}</div>
            <div class="hw-deadline">截止: {{ homework.deadline }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：提交情况 -->
      <div class="submission-panel">
        <!-- 顶部信息栏 -->
        <div class="submission-header">
          <div class="hw-current">
            <span class="hw-current-badge" :class="selectedHomework?.subject">{{ selectedHomework?.subject }}</span>
            <span class="hw-current-name">{{ selectedHomework?.name }}</span>
          </div>
          <div class="progress-area">
            <span v-if="isOverdue" class="overdue-badge">已超时 · 提交+1分</span>
            <span v-else class="ontime-badge">按时提交+2分</span>
            <div class="progress-nums">
              <span class="progress-done">{{ submissionStats.submitted }}</span>
              <span class="progress-sep">/</span>
              <span class="progress-total">{{ submissionStats.total }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (submissionStats.submitted / submissionStats.total * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 分组学生列表 -->
        <div class="groups-grid">
          <div v-for="group in groups" :key="group.id" class="group-card">
            <div class="group-header">
              <span class="group-icon">{{ group.icon }}</span>
              <span class="group-name">{{ group.name }}</span>
            </div>
            <div class="students-grid">
              <div
                v-for="student in group.students"
                :key="student.id"
                class="student-card"
                :class="{
                  submitted: student.submitted,
                  animating: student.animating,
                  'score-animating': student.scoreAnim,
                  'chinese-mode': isChineseHomework,
                  'greyed-mode': group.id === 2 && student.submitted
                }"
                @click="markSubmitted(student, group.id)"
              >
                <!-- 张书斌组：+2动效 → 灰显保留名字 + 右下角对勾 -->
                <template v-if="group.id === 2">
                  <template v-if="student.scoreAnim">
                    <div class="score-fly">{{ scoreText }}</div>
                  </template>
                  <template v-else>
                    <div class="student-name" :class="{ greyed: student.submitted }">{{ student.name }}</div>
                    <span v-if="student.submitted" class="greyed-check">✓</span>
                  </template>
                </template>

                <!-- 语文作业：名字淡出 -->
                <template v-else-if="isChineseHomework">
                  <template v-if="!student.submitted && !student.animating">
                    <div class="student-name">{{ student.name }}</div>
                  </template>
                  <template v-else-if="student.animating">
                    <div class="submit-anim">
                      <span class="anim-check">✓</span>
                    </div>
                  </template>
                  <template v-else>
                    <!-- 已提交：卡片空白 -->
                  </template>
                </template>

                <!-- 其他作业：加分动效 → 卡片消失 -->
                <template v-else>
                  <template v-if="!student.submitted && !student.scoreAnim">
                    <div class="student-name">{{ student.name }}</div>
                  </template>
                  <template v-else-if="student.scoreAnim">
                    <div class="score-fly">{{ scoreText }}</div>
                  </template>
                  <template v-else>
                    <!-- 已提交：卡片隐形 -->
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 创建作业弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-panel" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">创建新作业</h3>
          <button class="modal-close" @click="closeCreateModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">学科</label>
            <div class="subject-options">
              <div
                v-for="sub in ['语文', '数学', '英语', '其他']"
                :key="sub"
                class="subject-option"
                :class="{ selected: newHomework.subject === sub }"
                @click="newHomework.subject = sub"
              >{{ sub }}</div>
            </div>
          </div>
          <div class="form-field">
            <label class="form-label">作业标题</label>
            <input
              v-model="newHomework.title"
              type="text"
              class="form-input"
              placeholder="请输入作业标题"
            >
          </div>
          <div class="form-field">
            <label class="form-label">提交截止时间</label>
            <input
              v-model="newHomework.deadline"
              type="datetime-local"
              class="form-input"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeCreateModal">取消</button>
          <button class="btn-confirm" @click="createHomework">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$primary: #EE595B;
$primary-bg: #FFDBDB;

.homework-page {
  width: 1920px;
  height: 1080px;
  background: #FFF8F7;
  display: flex;
  flex-direction: column;
}

.sub-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 50px;
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.homework-count {
  font-size: 16px;
  color: #999;
  background: #f5f5f5;
  padding: 4px 14px;
  border-radius: 12px;
}

.create-btn {
  padding: 12px 28px;
  background: $primary;
  color: white;
  border-radius: 30px;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba($primary, 0.4);
  }
}

.main-content {
  flex: 1;
  display: flex;
  padding: 0 50px 20px;
  gap: 20px;
  min-height: 0;
}

// 左侧作业列表
.homework-list-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.homework-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: white;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid #f0f0f0;

  &:hover {
    border-color: $primary;
  }

  &.active {
    border-color: $primary;
    background: #FFF0F0;
    box-shadow: 0 0 0 1px $primary;
  }
}

.hw-subject-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;

  &.语文 { background: #FFEBEE; color: #C62828; }
  &.数学 { background: #E3F2FD; color: #1565C0; }
  &.英语 { background: #E8F5E9; color: #2E7D32; }
  &.其他 { background: #F3E5F5; color: #6A1B9A; }
}

.hw-info {
  flex: 1;
  min-width: 0;
}

.hw-name {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.hw-deadline {
  font-size: 13px;
  color: #999;
}

// 右侧提交面板
.submission-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: white;
  border-radius: 14px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.hw-current {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hw-current-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;

  &.语文 { background: #FFEBEE; color: #C62828; }
  &.数学 { background: #E3F2FD; color: #1565C0; }
  &.英语 { background: #E8F5E9; color: #2E7D32; }
  &.其他 { background: #F3E5F5; color: #6A1B9A; }
}

.hw-current-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.progress-area {
  display: flex;
  align-items: center;
  gap: 14px;
}

.progress-nums {
  font-size: 20px;
  font-weight: bold;
}

.overdue-badge {
  font-size: 14px;
  font-weight: 600;
  color: #FF9800;
  background: #FFF3E0;
  padding: 4px 12px;
  border-radius: 12px;
}

.ontime-badge {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  background: #E8F5E9;
  padding: 4px 12px;
  border-radius: 12px;
}

.progress-done { color: $primary; }
.progress-sep { color: #ccc; margin: 0 2px; }
.progress-total { color: #999; }

.progress-bar {
  width: 140px;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary, #FF8A80);
  border-radius: 5px;
  transition: width 0.3s;
}

// 分组网格
.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex: 1;
  align-content: start;
  overflow-y: auto;
}

.group-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.group-icon {
  font-size: 24px;
}

.group-name {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.student-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  background: white;
  border-radius: 12px;
  border: 1.5px solid #FFD6D6;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 58px;
  position: relative;

  &:hover:not(.submitted):not(.score-animating) {
    border-color: $primary;
    background: #FFF5F5;
  }

  &.submitted {
    background: transparent;
    border-color: transparent;
    cursor: default;
    box-shadow: none;
  }

  &.animating {
    background: rgba($primary, 0.08);
    border-color: rgba($primary, 0.3);
  }

  &.score-animating {
    background: rgba($primary, 0.08);
    border-color: rgba($primary, 0.3);
    cursor: default;
  }
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  white-space: nowrap;

  &.greyed {
    color: #ccc;
  }
}

// 张书斌组：灰显 + 对勾样式
.student-card.greyed-mode {
  background: #FAFAFA;
  border-color: #e8e8e8;
  cursor: default;
  position: relative;
}

.greyed-check {
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 13px;
  color: rgba(#EE595B, 0.45);
  font-weight: bold;
}

// 语文作业：勾选动画
.submit-anim {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: submitPop 0.8s ease forwards;
}

.anim-check {
  font-size: 28px;
  color: $primary;
  animation: checkBounce 0.4s ease;
}

// 其他作业：加分飘动动效
.score-fly {
  font-size: 20px;
  font-weight: bold;
  color: $primary;
  animation: scoreFlyUp 1.5s ease forwards;
}

@keyframes scoreFlyUp {
  0% { opacity: 0; transform: scale(0.5) translateY(10px); }
  20% { opacity: 1; transform: scale(1.2) translateY(0); }
  60% { opacity: 1; transform: scale(1) translateY(-8px); }
  100% { opacity: 0; transform: scale(0.8) translateY(-20px); }
}

@keyframes submitPop {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes checkBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

// 弹窗
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-panel {
  width: 520px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: $primary;
  color: white;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover { background: rgba(255, 255, 255, 0.3); }
}

.modal-body {
  padding: 28px 32px;
}

.form-field {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.subject-options {
  display: flex;
  gap: 10px;
}

.subject-option {
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 16px;
  border: 1.5px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;

  &:hover {
    border-color: $primary;
    color: $primary;
  }

  &.selected {
    background: $primary;
    color: white;
    border-color: $primary;
  }
}

.form-input {
  width: 100%;
  height: 50px;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 17px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 32px;
  background: #F8FAFC;
}

.btn-cancel {
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 18px;
  background: #f5f5f5;
  color: #666;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover { background: #e0e0e0; }
}

.btn-confirm {
  padding: 12px 40px;
  border-radius: 24px;
  font-size: 18px;
  background: $primary;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba($primary, 0.4);
  }
}
</style>
