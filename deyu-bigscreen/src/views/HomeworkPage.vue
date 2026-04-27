<script setup lang="ts">
import { ref, computed } from 'vue'
import TopNav from '@/components/layout/TopNav.vue'

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
  animating?: boolean  // 用于语文作业的动画状态
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
  { id: '1', name: '数学作业', subject: '数学', deadline: '4/30/2026, 12:00:00 AM' },
  { id: '2', name: '语文周记', subject: '语文', deadline: '4/28/2026, 6:00:00 PM' },
  { id: '3', name: '英语单词抄写', subject: '英语', deadline: '4/25/2026, 8:00:00 AM' }
])

// 按分组展示学生 - 6个小组，每组约8-10人
const groups = ref<GroupData[]>([
  {
    id: 1, name: '孙沐昀组', icon: '🐱',
    students: [
      { id: '1-1', name: '徐婉云', submitted: false, animating: false },
      { id: '1-2', name: '孙沐昀', submitted: false, animating: false },
      { id: '1-3', name: '刘玥希', submitted: false, animating: false },
      { id: '1-4', name: '毛昱涵', submitted: false, animating: false },
      { id: '1-5', name: '陈思琪', submitted: false, animating: false },
      { id: '1-6', name: '王子轩', submitted: false, animating: false },
      { id: '1-7', name: '李欣怡', submitted: false, animating: false },
      { id: '1-8', name: '张浩然', submitted: false, animating: false }
    ]
  },
  {
    id: 2, name: '张书斌组', icon: '🐰',
    students: [
      { id: '2-1', name: '李渡嘉', submitted: false, animating: false },
      { id: '2-2', name: '张书斌', submitted: false, animating: false },
      { id: '2-3', name: '邱翌泽', submitted: false, animating: false },
      { id: '2-4', name: '张惟瑄', submitted: false, animating: false },
      { id: '2-5', name: '赵晨曦', submitted: false, animating: false },
      { id: '2-6', name: '吴佳琪', submitted: false, animating: false },
      { id: '2-7', name: '郑宇航', submitted: false, animating: false },
      { id: '2-8', name: '黄诗涵', submitted: false, animating: false }
    ]
  },
  {
    id: 3, name: '刘燕杭组', icon: '🦊',
    students: [
      { id: '3-1', name: '马子扬', submitted: false, animating: false },
      { id: '3-2', name: '张京钰', submitted: false, animating: false },
      { id: '3-3', name: '刘燕杭', submitted: false, animating: false },
      { id: '3-4', name: '王泊远', submitted: false, animating: false },
      { id: '3-5', name: '林悦然', submitted: false, animating: false },
      { id: '3-6', name: '何雨泽', submitted: false, animating: false },
      { id: '3-7', name: '罗诗琪', submitted: false, animating: false },
      { id: '3-8', name: '谢子豪', submitted: false, animating: false }
    ]
  },
  {
    id: 4, name: '李嘉懿组', icon: '🐸',
    students: [
      { id: '4-1', name: '程浩月', submitted: false, animating: false },
      { id: '4-2', name: '孙雅诺', submitted: false, animating: false },
      { id: '4-3', name: '陈翌泽', submitted: false, animating: false },
      { id: '4-4', name: '李嘉懿', submitted: false, animating: false },
      { id: '4-5', name: '吕思远', submitted: false, animating: false },
      { id: '4-6', name: '魏子轩', submitted: false, animating: false },
      { id: '4-7', name: '蒋雨萱', submitted: false, animating: false },
      { id: '4-8', name: '沈梓涵', submitted: false, animating: false }
    ]
  },
  {
    id: 5, name: '徐奕洲组', icon: '🐻',
    students: [
      { id: '5-1', name: '李牧谦', submitted: false, animating: false },
      { id: '5-2', name: '刘昕佳葆', submitted: false, animating: false },
      { id: '5-3', name: '徐奕洲', submitted: false, animating: false },
      { id: '5-4', name: '罗慕瑶', submitted: false, animating: false },
      { id: '5-5', name: '潘子琪', submitted: false, animating: false },
      { id: '5-6', name: '董雨欣', submitted: false, animating: false },
      { id: '5-7', name: '袁浩然', submitted: false, animating: false },
      { id: '5-8', name: '邓诗雨', submitted: false, animating: false }
    ]
  },
  {
    id: 6, name: '王梓萱组', icon: '🦁',
    students: [
      { id: '6-1', name: '王梓萱', submitted: false, animating: false },
      { id: '6-2', name: '陆子涵', submitted: false, animating: false },
      { id: '6-3', name: '姚思琪', submitted: false, animating: false },
      { id: '6-4', name: '崔浩宇', submitted: false, animating: false },
      { id: '6-5', name: '钟雨桐', submitted: false, animating: false },
      { id: '6-6', name: '谭子轩', submitted: false, animating: false },
      { id: '6-7', name: '廖欣怡', submitted: false, animating: false },
      { id: '6-8', name: '邱梓涵', submitted: false, animating: false }
    ]
  }
])

// 所有学生的扁平列表（用于统计）
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

// 是否是语文作业（使用特殊交互效果）
const isChineseHomework = computed(() => {
  return selectedHomework.value?.subject === '语文'
})

const submissionStats = computed(() => {
  const total = allStudents.value.length
  const submitted = allStudents.value.filter(s => s.submitted).length
  return { submitted, total }
})

function selectHomework(id: string) {
  selectedHomeworkId.value = id
  // 切换作业时重置学生提交状态
  groups.value.forEach(g => {
    g.students.forEach(s => {
      s.submitted = false
      s.animating = false
    })
  })
}

function markSubmitted(student: StudentSubmission, event: MouseEvent) {
  if (student.submitted || student.animating) return

  if (isChineseHomework.value) {
    // 语文作业：先显示动画，然后姓名消失
    student.animating = true

    // 1秒后标记为已提交（名字消失）
    setTimeout(() => {
      student.submitted = true
      student.animating = false
    }, 800)
  } else {
    // 其他作业：原有的加分动画效果
    student.submitted = true

    // 创建得分飘动动画
    const anim = document.createElement('div')
    anim.className = 'score-animation'
    anim.textContent = '+2分'
    anim.style.left = event.pageX + 'px'
    anim.style.top = event.pageY + 'px'
    document.body.appendChild(anim)

    setTimeout(() => anim.remove(), 1500)
  }
}

function openCreateModal() {
  // 设置默认截止时间为当天17:00
  const today = new Date()
  today.setHours(17, 0, 0, 0)
  newHomework.value.deadline = today.toISOString().slice(0, 16)
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
    deadline: new Date(newHomework.value.deadline).toLocaleString()
  })

  selectedHomeworkId.value = newId
  newHomework.value.title = ''
  closeCreateModal()
}
</script>

<template>
  <div class="homework-page">
    <TopNav />

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title">
        <span class="page-title-icon">📋</span>
        <span class="page-title-text">作业跟踪面板</span>
      </div>
      <button class="create-btn" @click="openCreateModal">
        <span>+</span>
        <span>创建作业</span>
      </button>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧：作业列表 -->
      <div class="homework-list-section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <span class="section-title">作业列表</span>
        </div>
        <div class="homework-items">
          <div
            v-for="homework in homeworkList"
            :key="homework.id"
            class="homework-item"
            :class="{ active: selectedHomeworkId === homework.id }"
            @click="selectHomework(homework.id)"
          >
            <div class="homework-name">{{ homework.name }}</div>
            <div class="homework-meta">
              <span class="homework-subject">{{ homework.subject }}</span>
              <span class="homework-deadline">截止: {{ homework.deadline }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：提交情况 -->
      <div class="submission-section" :class="{ 'chinese-mode': isChineseHomework }">
        <!-- 简洁的顶部信息 -->
        <div class="submission-top">
          <div class="homework-info">
            <span class="homework-badge" :class="selectedHomework?.subject">{{ selectedHomework?.subject }}</span>
            <span class="homework-title">{{ selectedHomework?.name }}</span>
          </div>
          <div class="progress-info">
            <span class="progress-text">{{ submissionStats.submitted }}/{{ submissionStats.total }}</span>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (submissionStats.submitted / submissionStats.total * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 按分组展示学生 -->
        <div class="groups-container">
          <div v-for="group in groups" :key="group.id" class="group-section">
            <div class="group-header">
              <span class="group-icon">{{ group.icon }}</span>
              <span class="group-name">{{ group.name }}</span>
            </div>
            <div class="group-students">
              <div
                v-for="student in group.students"
                :key="student.id"
                class="student-card"
                :class="{
                  'not-submitted': !student.submitted && !student.animating,
                  'submitted': student.submitted,
                  'animating': student.animating,
                  'chinese-card': isChineseHomework
                }"
                @click="markSubmitted(student, $event)"
              >
                <!-- 语文作业：名字消失效果 -->
                <template v-if="isChineseHomework">
                  <div class="card-content" :class="{ 'fade-out': student.submitted }">
                    <span class="student-name">{{ student.name }}</span>
                  </div>
                  <!-- 动画中显示的提交标记 -->
                  <div v-if="student.animating" class="submit-animation">
                    <span class="check-icon">✓</span>
                    <span class="submit-text">已提交</span>
                  </div>
                </template>

                <!-- 其他作业：原有样式 -->
                <template v-else>
                  <div class="student-card-name">{{ student.name }}</div>
                  <div class="student-card-status">{{ student.submitted ? '✓' : '' }}</div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 创建作业弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <span class="modal-title">创建新作业</span>
          <span class="modal-close" @click="closeCreateModal">&times;</span>
        </div>
        <div class="form-group">
          <label class="form-label">学科</label>
          <select v-model="newHomework.subject" class="form-select">
            <option value="语文">语文</option>
            <option value="数学">数学</option>
            <option value="英语">英语</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">作业标题</label>
          <input
            v-model="newHomework.title"
            type="text"
            class="form-input"
            placeholder="请输入作业标题"
          >
        </div>
        <div class="form-group">
          <label class="form-label">提交截止时间</label>
          <input
            v-model="newHomework.deadline"
            type="datetime-local"
            class="form-input"
          >
        </div>
        <div class="modal-actions">
          <button class="modal-btn secondary" @click="closeCreateModal">取消</button>
          <button class="modal-btn primary" @click="createHomework">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.homework-page {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(180deg, #E8F4FD 0%, #F5F9FC 100%);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px 16px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title-icon {
  font-size: 40px;
}

.page-title-text {
  font-size: 36px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.create-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: white;
  border-radius: 24px;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(74, 144, 217, 0.3);
  transition: var(--transition-normal);
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 144, 217, 0.4);
  }
}

.main-content {
  display: flex;
  padding: 0 40px 30px;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

.homework-list-section {
  width: 420px;
  background: white;
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-indicator {
  width: 5px;
  height: 28px;
  background: var(--color-secondary);
  border-radius: 3px;
}

.section-title {
  font-size: 27px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.homework-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.homework-item {
  padding: 14px 16px;
  border: 2px solid #F0F0F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-secondary);
    background: #F8FAFC;
  }

  &.active {
    border-color: var(--color-secondary);
    background: #E8F4FD;
  }
}

.homework-name {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.homework-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  color: var(--color-text-secondary);
}

.homework-subject {
  padding: 4px 14px;
  background: #E8F4FD;
  border-radius: 10px;
  color: var(--color-secondary);
  font-size: 18px;
}

.homework-deadline {
  color: var(--color-text-muted);
  font-size: 16px;
}

.submission-section {
  flex: 1;
  background: white;
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

// 简洁的顶部信息
.submission-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.homework-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.homework-badge {
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 21px;
  font-weight: 600;

  &.语文 { background: #FFEBEE; color: #C62828; }
  &.数学 { background: #E3F2FD; color: #1565C0; }
  &.英语 { background: #E8F5E9; color: #2E7D32; }
}

.homework-title {
  font-size: 30px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 27px;
  font-weight: bold;
  color: var(--color-secondary);
}

.progress-bar {
  width: 150px;
  height: 12px;
  background: #E0E0E0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 6px;
  transition: width 0.3s ease;
}

// 分组容器
.groups-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
  align-content: start;
  overflow-y: auto;
}

.group-section {
  background: #FAFAFA;
  border-radius: 16px;
  padding: 16px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E8E8E8;
}

.group-icon {
  font-size: 28px;
}

.group-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.group-students {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.student-card {
  padding: 18px 12px;
  border-radius: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #E0E0E0;
  min-height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

  // 未提交状态 - 明显的卡片样式
  &.not-submitted {
    background: white;
    border-color: #E0E0E0;

    &:hover {
      background: #F0F7FF;
      border-color: var(--color-secondary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 144, 217, 0.15);
    }

    .student-card-name {
      color: #333;
      font-weight: 600;
    }
  }

  // 已提交状态 - 明显弱化（数学/英语作业）
  &.submitted:not(.chinese-card) {
    background: #F5F5F5;
    border-color: #E8E8E8;
    cursor: default;
    box-shadow: none;

    .student-card-name {
      color: #BDBDBD;
      font-weight: 400;
    }

    .student-card-status {
      color: #A5D6A7;
    }
  }

  // 语文作业特殊样式
  &.chinese-card {
    position: relative;
    overflow: hidden;

    &.not-submitted {
      background: white;
      border-color: #FFCDD2;

      &:hover {
        background: #FFF5F5;
        border-color: #EF9A9A;
      }

      .student-name {
        color: #333;
      }
    }

    &.animating {
      background: #E8F5E9;
      border-color: #A5D6A7;
    }

    &.submitted {
      background: #FAFAFA;
      border-color: #EEEEEE;
      cursor: default;

      .card-content {
        opacity: 0;
      }
    }
  }
}

.card-content {
  transition: opacity 0.3s ease;

  &.fade-out {
    opacity: 0;
  }
}

.student-name {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

// 语文作业提交动画
.submit-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: submitPop 0.8s ease forwards;
}

.check-icon {
  font-size: 36px;
  color: #4CAF50;
  animation: checkBounce 0.4s ease;
}

.submit-text {
  font-size: 18px;
  color: #4CAF50;
  font-weight: 600;
  margin-top: 4px;
}

@keyframes submitPop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes checkBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

// 数学/英语作业样式
.student-card-name {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.student-card-status {
  font-size: 20px;
  color: #4CAF50;
  margin-top: 6px;
  font-weight: 500;
}

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

.modal-content {
  background: white;
  padding: 40px 50px;
  border-radius: var(--radius-xl);
  width: 500px;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-title {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.modal-close {
  font-size: 32px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color var(--transition-normal);

  &:hover {
    color: var(--color-text-primary);
  }
}

.form-group {
  margin-bottom: 28px;
}

.form-label {
  display: block;
  font-size: 24px;
  color: var(--color-text-primary);
  margin-bottom: 12px;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  height: 60px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 20px;
  font-size: 22px;
  transition: border-color var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--color-secondary);
  }
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.modal-btn {
  flex: 1;
  padding: 16px 30px;
  border-radius: var(--radius-md);
  font-size: 22px;
  transition: var(--transition-normal);

  &.primary {
    background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(74, 144, 217, 0.4);
    }
  }

  &.secondary {
    background: var(--color-bg-light);
    color: var(--color-text-secondary);

    &:hover {
      background: var(--color-border);
    }
  }
}
</style>
