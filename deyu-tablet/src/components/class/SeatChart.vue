<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { BaseCard, BaseAvatar } from '@/components/common'
import type { Student } from '@shared/types'

const props = defineProps<{
  classId?: string
}>()

const studentsStore = useStudentsStore()

const isEditMode = ref(false)
const draggingStudent = ref<Student | null>(null)
const selectedSeat = ref<{ row: number; col: number } | null>(null)
const showAisleSelector = ref(false)

// 座位布局
const seatLayout = computed(() => studentsStore.getSeatLayout())

// 未分配座位的学生（按班级筛选）
const unseatedStudents = computed(() => {
  const all = studentsStore.getUnseatedStudents()
  if (props.classId) {
    return all.filter(s => s.classId === props.classId)
  }
  return all
})

// 过道列集合
const aisleSet = computed(() =>
  new Set(studentsStore.seatConfig.aisleAfterCols || [])
)

function toggleEditMode() {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    draggingStudent.value = null
    selectedSeat.value = null
    showAisleSelector.value = false
  }
}

function handleDragStart(student: Student, event: DragEvent) {
  if (!isEditMode.value) return
  draggingStudent.value = student
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', student.id)
  }
}

function handleDragOver(event: DragEvent) {
  if (!isEditMode.value) return
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function handleDrop(row: number, col: number, event: DragEvent) {
  if (!isEditMode.value) return
  event.preventDefault()

  const studentId = event.dataTransfer?.getData('text/plain')
  if (!studentId) return

  const existingStudent = seatLayout.value[row]?.[col]

  if (existingStudent) {
    studentsStore.swapSeats(studentId, existingStudent.id)
  } else {
    studentsStore.updateStudentSeat(studentId, row, col)
  }

  draggingStudent.value = null
}

function handleSeatClick(row: number, col: number) {
  if (!isEditMode.value) return

  const student = seatLayout.value[row]?.[col]

  if (selectedSeat.value) {
    const selectedStudent = seatLayout.value[selectedSeat.value.row]?.[selectedSeat.value.col]

    if (selectedStudent) {
      if (student) {
        studentsStore.swapSeats(selectedStudent.id, student.id)
      } else {
        studentsStore.updateStudentSeat(selectedStudent.id, row, col)
      }
    }
    selectedSeat.value = null
  } else if (student) {
    selectedSeat.value = { row, col }
  }
}

function handleUnseatedClick(student: Student) {
  if (!isEditMode.value) return

  if (selectedSeat.value) {
    const existingStudent = seatLayout.value[selectedSeat.value.row]?.[selectedSeat.value.col]
    if (!existingStudent) {
      studentsStore.updateStudentSeat(student.id, selectedSeat.value.row, selectedSeat.value.col)
    }
    selectedSeat.value = null
  }
}

function handleClearSeat(row: number, col: number) {
  studentsStore.clearSeat(row, col)
}

function isSelected(row: number, col: number): boolean {
  return selectedSeat.value?.row === row && selectedSeat.value?.col === col
}

// 行列操作
function addRow() { studentsStore.addSeatRow() }
function removeRow() { studentsStore.removeSeatRow() }
function addCol() { studentsStore.addSeatCol() }
function removeCol() { studentsStore.removeSeatCol() }

function toggleAisleSelector() {
  showAisleSelector.value = !showAisleSelector.value
}

function handleToggleAisle(colIndex: number) {
  studentsStore.toggleAisle(colIndex)
}
</script>

<template>
  <div class="seat-chart">
    <!-- 工具栏 -->
    <div class="chart-toolbar">
      <button
        class="edit-mode-btn"
        :class="{ active: isEditMode }"
        @click="toggleEditMode"
      >
        {{ isEditMode ? '完成编辑' : '编辑座位' }}
      </button>
      <div class="seat-config">
        <span class="config-label">{{ studentsStore.seatConfig.rows }}行 x {{ studentsStore.seatConfig.cols }}列</span>
      </div>
    </div>

    <!-- 编辑模式工具栏 -->
    <div v-if="isEditMode" class="edit-toolbar">
      <div class="toolbar-group">
        <button class="tool-btn" @click="addRow">+行</button>
        <button class="tool-btn" :disabled="studentsStore.seatConfig.rows <= 1" @click="removeRow">-行</button>
        <button class="tool-btn" @click="addCol">+列</button>
        <button class="tool-btn" :disabled="studentsStore.seatConfig.cols <= 1" @click="removeCol">-列</button>
      </div>
      <div class="toolbar-group">
        <button
          class="tool-btn"
          :class="{ active: showAisleSelector }"
          @click="toggleAisleSelector"
        >
          添加过道
        </button>
      </div>
    </div>

    <!-- 过道选择器 -->
    <div v-if="showAisleSelector" class="aisle-selector">
      <span class="aisle-hint">点击选择在哪列后添加过道：</span>
      <div class="aisle-options">
        <button
          v-for="col in studentsStore.seatConfig.cols - 1"
          :key="col"
          class="aisle-option"
          :class="{ active: aisleSet.has(col - 1) }"
          @click="handleToggleAisle(col - 1)"
        >
          第{{ col }}列后
        </button>
      </div>
    </div>

    <!-- 黑板 -->
    <div class="blackboard">
      <span class="blackboard-text">黑板</span>
    </div>

    <!-- 座位网格 -->
    <BaseCard class="seats-container">
      <div
        v-for="(row, rowIndex) in seatLayout"
        :key="`row-${rowIndex}`"
        class="seat-row"
      >
        <template v-for="(student, colIndex) in row" :key="`seat-${rowIndex}-${colIndex}`">
          <div
            class="seat-cell"
            :class="{
              'has-student': student,
              'is-empty': !student,
              'edit-mode': isEditMode,
              'selected': isSelected(rowIndex, colIndex),
              'drop-target': isEditMode && draggingStudent
            }"
            draggable="true"
            @dragstart="student && handleDragStart(student, $event)"
            @dragover="handleDragOver"
            @drop="handleDrop(rowIndex, colIndex, $event)"
            @click="handleSeatClick(rowIndex, colIndex)"
          >
            <template v-if="student">
              <BaseAvatar :name="student.name" size="md" />
              <div class="seat-name">{{ student.name }}</div>
              <div class="seat-score">{{ student.score }}分</div>
              <button
                v-if="isEditMode"
                class="clear-btn"
                @click.stop="handleClearSeat(rowIndex, colIndex)"
              >
                ✕
              </button>
            </template>
            <template v-else>
              <div class="empty-seat">
                <span class="empty-icon">+</span>
              </div>
            </template>
          </div>
          <!-- 过道分隔 -->
          <div v-if="aisleSet.has(colIndex)" class="aisle-gap" />
        </template>
      </div>
    </BaseCard>

    <!-- 未分配座位的学生（始终显示） -->
    <div class="unseated-section">
      <div class="section-title">未分配座位 ({{ unseatedStudents.length }}人)</div>
      <div v-if="unseatedStudents.length > 0" class="unseated-list">
        <div
          v-for="student in unseatedStudents"
          :key="student.id"
          class="unseated-item"
          :class="{ 'edit-mode': isEditMode }"
          draggable="true"
          @dragstart="handleDragStart(student, $event)"
          @click="handleUnseatedClick(student)"
        >
          <BaseAvatar :name="student.name" size="sm" />
          <span class="unseated-name">{{ student.name }}</span>
        </div>
      </div>
      <div v-else class="empty-hint">所有学生均已分配座位</div>
    </div>

    <!-- 编辑提示 -->
    <div v-if="isEditMode" class="edit-hint">
      <p>拖拽学生到座位进行调整</p>
      <p>点击座位可选中，再点击另一座位进行交换</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.seat-chart {
  padding-bottom: 20px;
}

.chart-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.edit-mode-btn {
  padding: 10px 20px;
  background: $gray-100;
  border: none;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-700;
  cursor: pointer;

  &.active {
    background: linear-gradient(135deg, $primary, $primary-light);
    color: white;
  }
}

.seat-config {
  font-size: 14px;
  color: $gray-600;
}

// 编辑工具栏
.edit-toolbar {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 12px 15px;
  background: #FFF8E1;
  border-radius: $radius-md;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 8px;
}

.tool-btn {
  padding: 6px 14px;
  background: white;
  border: 1px solid $gray-200;
  border-radius: $radius-sm;
  font-size: 13px;
  color: $gray-700;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: $primary;
    color: $primary;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.active {
    background: $primary;
    color: white;
    border-color: $primary;
  }
}

// 过道选择器
.aisle-selector {
  margin-bottom: 15px;
  padding: 12px 15px;
  background: #E3F2FD;
  border-radius: $radius-md;
}

.aisle-hint {
  font-size: 13px;
  color: $gray-600;
  display: block;
  margin-bottom: 8px;
}

.aisle-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.aisle-option {
  padding: 6px 12px;
  background: white;
  border: 1px solid $gray-200;
  border-radius: $radius-sm;
  font-size: 13px;
  color: $gray-700;
  cursor: pointer;

  &.active {
    background: $secondary;
    color: white;
    border-color: $secondary;
  }
}

.blackboard {
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  padding: 15px;
  border-radius: $radius-md;
  text-align: center;
  margin-bottom: 20px;
}

.blackboard-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 4px;
}

.seats-container {
  padding: 20px;
}

.seat-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.aisle-gap {
  width: 24px;
  flex-shrink: 0;
}

.seat-cell {
  flex: 1;
  aspect-ratio: 1;
  padding: 10px;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: relative;
  transition: all 0.2s;
  min-height: 100px;

  &.has-student {
    background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
    cursor: grab;

    &.edit-mode {
      border: 2px dashed $secondary;
    }
  }

  &.is-empty {
    background: $gray-50;
    border: 2px dashed $gray-200;
  }

  &.selected {
    border-color: $primary !important;
    background: #FFF5F5;
    box-shadow: 0 0 0 3px rgba($primary, 0.3);
  }

  &.drop-target.is-empty {
    border-color: $success;
    background: #E8F5E9;
  }

  &.edit-mode:hover {
    transform: scale(1.02);
  }
}

.seat-name {
  font-size: 13px;
  font-weight: 500;
  color: $gray-800;
  text-align: center;
}

.seat-score {
  font-size: 11px;
  color: $gray-500;
}

.clear-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $danger;
  color: white;
  border: none;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-seat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.empty-icon {
  font-size: 24px;
  color: $gray-300;
}

.unseated-section {
  margin-top: 25px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: $gray-700;
  margin-bottom: 12px;
}

.unseated-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.unseated-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: white;
  border-radius: $radius-full;
  box-shadow: $shadow-sm;

  &.edit-mode {
    cursor: grab;
    border: 2px dashed $gray-200;

    &:hover {
      border-color: $primary;
      background: #FFF5F5;
    }
  }
}

.unseated-name {
  font-size: 14px;
  color: $gray-700;
}

.empty-hint {
  font-size: 13px;
  color: $gray-400;
  text-align: center;
  padding: 15px 0;
}

.edit-hint {
  margin-top: 20px;
  padding: 15px;
  background: #FFF8E1;
  border-radius: $radius-md;
  text-align: center;

  p {
    font-size: 13px;
    color: $gray-600;
    margin: 5px 0;
  }
}
</style>
