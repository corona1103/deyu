<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard, BaseButton, BaseAvatar } from '@/components/common'
import { useVoiceReviewStore } from '@/stores/voiceReview'
import { useStudentsStore } from '@/stores/students'
import { useWebSocket } from '@shared/composables'
import { MORAL_DIMENSION_INDICATORS } from '@shared/constants'

const voiceReviewStore = useVoiceReviewStore()
const studentsStore = useStudentsStore()
const { connect, isConnected } = useWebSocket()

const isRecording = ref(false)
const editingResultId = ref<string | null>(null)
const showStudentPicker = ref(false)
const pickingForResultId = ref<string | null>(null)

onMounted(() => {
  connect()
})

function toggleRecording() {
  isRecording.value = !isRecording.value

  if (!isRecording.value && voiceReviewStore.inputText) {
    // 停止录音后自动解析
    handleParse()
  }
}

async function handleParse() {
  if (!voiceReviewStore.inputText.trim()) {
    alert('请输入或录入点评内容')
    return
  }
  await voiceReviewStore.parseInput()
}

function handleConfirmAll() {
  const validCount = voiceReviewStore.parsedResults.filter(r => r.studentId).length
  if (validCount === 0) {
    alert('没有有效的点评记录（请确保已选择学生）')
    return
  }

  const success = voiceReviewStore.confirmAll()
  if (success) {
    alert(`已成功提交 ${validCount} 条点评并同步到大屏`)
  }
}

function handleRemoveResult(resultId: string) {
  voiceReviewStore.removeResult(resultId)
}

function startEditResult(resultId: string) {
  editingResultId.value = resultId
}

function finishEditResult() {
  editingResultId.value = null
}

function openStudentPicker(resultId: string) {
  pickingForResultId.value = resultId
  showStudentPicker.value = true
}

function selectStudent(studentId: string) {
  if (pickingForResultId.value) {
    voiceReviewStore.updateResultStudent(pickingForResultId.value, studentId)
  }
  showStudentPicker.value = false
  pickingForResultId.value = null
}

function getDimensionIcon(dimensionKey: string): string {
  const dim = MORAL_DIMENSION_INDICATORS.find(d => d.key === dimensionKey)
  return dim?.icon || '📋'
}

function getDimensionName(dimensionKey: string): string {
  const dim = MORAL_DIMENSION_INDICATORS.find(d => d.key === dimensionKey)
  return dim?.name || dimensionKey
}
</script>

<template>
  <div class="voice-review-page">
    <PageHeader title="语音点评">
      <template #right>
        <div class="ws-status" :class="{ connected: isConnected }">
          {{ isConnected ? '已连接' : '未连接' }}
        </div>
      </template>
    </PageHeader>

    <main class="main-content">
      <!-- 录音区域 -->
      <BaseCard class="recording-area">
        <div class="recording-visual">
          <div
            class="record-btn touch-active"
            :class="{ recording: isRecording }"
            @click="toggleRecording"
          >
            <span class="record-icon">🎙️</span>
          </div>
          <div class="record-hint">
            {{ isRecording ? '正在录音...' : '点击开始录音' }}
          </div>
        </div>

        <div v-if="isRecording" class="wave-animation">
          <div class="wave" />
          <div class="wave" />
          <div class="wave" />
        </div>

        <textarea
          v-model="voiceReviewStore.inputText"
          class="text-input"
          placeholder="输入或录入点评内容，例如：&#10;小明今天认真听讲，积极发言&#10;小红作业完成得很好&#10;小刚上课讲话了需要改进"
          rows="4"
        />

        <BaseButton
          type="primary"
          size="md"
          block
          :loading="voiceReviewStore.isParsing"
          @click="handleParse"
        >
          {{ voiceReviewStore.isParsing ? '解析中...' : 'AI 智能解析' }}
        </BaseButton>
      </BaseCard>

      <!-- AI解析结果 -->
      <template v-if="voiceReviewStore.hasResults">
        <div class="section-header">
          <div class="section-title">
            AI解析结果
            <span class="result-count">({{ voiceReviewStore.parsedResults.length }}条)</span>
          </div>
          <div class="total-points" :class="{ negative: voiceReviewStore.totalPoints < 0 }">
            预计{{ voiceReviewStore.totalPoints >= 0 ? '加' : '扣' }}分：
            <span>{{ voiceReviewStore.totalPoints > 0 ? '+' : '' }}{{ voiceReviewStore.totalPoints }}</span>
          </div>
        </div>

        <BaseCard class="results-card">
          <div
            v-for="result in voiceReviewStore.parsedResults"
            :key="result.id"
            class="result-item"
            :class="{ negative: result.isNegative, 'no-student': !result.studentId }"
          >
            <div class="result-main">
              <div class="result-student" @click="openStudentPicker(result.id)">
                <BaseAvatar
                  v-if="result.studentId"
                  :name="result.studentName"
                  size="sm"
                />
                <span v-else class="no-student-icon">?</span>
                <span class="student-name">
                  {{ result.studentName }}
                  <span v-if="!result.studentId" class="pick-hint">点击选择</span>
                </span>
              </div>

              <div class="result-indicator">
                <span class="indicator-dim">{{ getDimensionIcon(result.indicator.dimension) }} {{ getDimensionName(result.indicator.dimension) }}</span>
                <span class="indicator-label">{{ result.indicator.label }}</span>
                <span
                  class="indicator-points"
                  :class="{ negative: result.indicator.points < 0 }"
                >
                  {{ result.indicator.points > 0 ? '+' : '' }}{{ result.indicator.points }}
                </span>
              </div>
            </div>

            <!-- 建议（负面评价） -->
            <div v-if="result.suggestion" class="result-suggestion">
              <span class="suggestion-icon">💡</span>
              <span class="suggestion-text">{{ result.suggestion }}</span>
            </div>

            <div class="result-actions">
              <button class="action-btn edit" @click="startEditResult(result.id)">编辑</button>
              <button class="action-btn delete" @click="handleRemoveResult(result.id)">删除</button>
            </div>
          </div>
        </BaseCard>

        <BaseButton
          type="success"
          size="lg"
          block
          @click="handleConfirmAll"
        >
          确认并同步到大屏 ({{ voiceReviewStore.parsedResults.filter(r => r.studentId).length }}条)
        </BaseButton>
      </template>

      <!-- 使用提示 -->
      <div v-if="!voiceReviewStore.hasResults" class="usage-tips">
        <div class="tip-title">使用提示</div>
        <ul class="tip-list">
          <li>支持多个学生同时点评，用逗号或换行分隔</li>
          <li>AI 会自动识别学生姓名和行为类型</li>
          <li>可以使用自然语言描述，如"小明今天表现很好"</li>
          <li>负面评价会自动生成改进建议</li>
        </ul>
      </div>
    </main>

    <!-- 学生选择器弹窗 -->
    <Teleport to="body">
      <div v-if="showStudentPicker" class="picker-overlay" @click="showStudentPicker = false">
        <div class="picker-dialog" @click.stop>
          <div class="picker-title">选择学生</div>
          <div class="picker-grid">
            <div
              v-for="student in studentsStore.students"
              :key="student.id"
              class="picker-item"
              @click="selectStudent(student.id)"
            >
              <BaseAvatar :name="student.name" size="sm" />
              <span class="picker-name">{{ student.name }}</span>
            </div>
          </div>
          <button class="picker-close" @click="showStudentPicker = false">取消</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.voice-review-page {
  min-height: 100vh;
  background: $gray-100;
}

.ws-status {
  padding: 6px 12px;
  background: #FFEBEE;
  border-radius: $radius-full;
  font-size: 12px;
  color: $danger;

  &.connected {
    background: #E8F5E9;
    color: $success;
  }
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 600px;
    margin: 0 auto;
  }
}

.recording-area {
  margin-bottom: 20px;
}

.recording-visual {
  text-align: center;
  padding: 30px 0;
}

.record-btn {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &.recording {
    background: linear-gradient(135deg, $danger, lighten($danger, 10%));
    animation: pulse 1.5s infinite;
  }
}

.record-icon {
  font-size: 40px;
}

.record-hint {
  font-size: 16px;
  color: $gray-600;
}

.wave-animation {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.wave {
  width: 4px;
  height: 30px;
  background: $primary;
  border-radius: 2px;
  animation: wave 0.8s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes wave {
  0%, 100% {
    height: 10px;
  }
  50% {
    height: 40px;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba($danger, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px 10px rgba($danger, 0);
  }
}

.text-input {
  width: 100%;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  padding: 15px;
  font-size: 16px;
  resize: none;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

.result-count {
  font-weight: normal;
  color: $gray-500;
  font-size: 14px;
}

.total-points {
  font-size: 14px;
  color: $success;

  span {
    font-weight: bold;
    font-size: 16px;
  }

  &.negative {
    color: $danger;
  }
}

.results-card {
  margin-bottom: 20px;
  padding: 0;
}

.result-item {
  padding: 15px;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    border-bottom: none;
  }

  &.negative {
    background: #FFF8E1;
  }

  &.no-student {
    background: #FFF3E0;
  }
}

.result-main {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.result-student {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px;
  border-radius: $radius-sm;

  &:hover {
    background: $gray-50;
  }
}

.no-student-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $gray-200;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $gray-500;
  font-size: 14px;
}

.student-name {
  font-size: 15px;
  font-weight: 500;
  color: $gray-800;
}

.pick-hint {
  display: block;
  font-size: 11px;
  color: $warning;
  font-weight: normal;
}

.result-indicator {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.indicator-dim {
  font-size: 12px;
  color: $gray-500;
  background: $gray-50;
  padding: 3px 8px;
  border-radius: $radius-sm;
}

.indicator-label {
  font-size: 14px;
  color: $gray-700;
}

.indicator-points {
  font-size: 14px;
  font-weight: bold;
  color: $success;
  margin-left: auto;

  &.negative {
    color: $danger;
  }
}

.result-suggestion {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  background: #E3F2FD;
  border-radius: $radius-sm;
  margin-bottom: 10px;
}

.suggestion-icon {
  font-size: 16px;
}

.suggestion-text {
  flex: 1;
  font-size: 13px;
  color: $gray-700;
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 14px;
  border: none;
  border-radius: $radius-sm;
  font-size: 13px;
  cursor: pointer;

  &.edit {
    background: #E3F2FD;
    color: $secondary;
  }

  &.delete {
    background: #FFEBEE;
    color: $danger;
  }
}

.usage-tips {
  padding: 20px;
  background: white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.tip-title {
  font-size: 15px;
  font-weight: bold;
  color: $gray-700;
  margin-bottom: 12px;
}

.tip-list {
  padding-left: 20px;
  margin: 0;

  li {
    font-size: 14px;
    color: $gray-600;
    line-height: 1.8;
  }
}

// 学生选择器弹窗
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.picker-dialog {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.picker-title {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
  text-align: center;
  margin-bottom: 15px;
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.picker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #E3F2FD;
  }
}

.picker-name {
  font-size: 13px;
  color: $gray-700;
}

.picker-close {
  width: 100%;
  padding: 12px;
  background: $gray-100;
  border: none;
  border-radius: $radius-full;
  font-size: 15px;
  color: $gray-600;
  cursor: pointer;
}
</style>
