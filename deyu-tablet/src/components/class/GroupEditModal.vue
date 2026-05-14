<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Group } from '@shared/types'
import { GROUP_ICONS } from '@shared/constants'
import BaseModal from '@/components/common/BaseModal.vue'
import { BaseAvatar } from '@/components/common'
import { useStudentsStore } from '@/stores/students'

interface Props {
  modelValue: boolean
  group: Group | null      // null = 新建模式
  classId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const studentsStore = useStudentsStore()

// 编辑状态
const editName = ref('')
const editIcon = ref('🌟')

// 班级所有学生
const classStudents = computed(() =>
  studentsStore.getStudentsByClass(props.classId)
)

// 班级所有分组
const classGroups = computed(() =>
  studentsStore.getGroupsByClass(props.classId)
)

// 当前组成员（编辑模式下实时从 store 获取）
const currentMembers = computed(() => {
  if (!props.group) return []
  return classStudents.value.filter(s => s.groupId === props.group!.id)
})

// 弹窗标题
const modalTitle = computed(() => props.group ? '编辑分组' : '新建分组')

// 学生所属组名映射
function getStudentGroupName(studentId: string): string {
  const student = classStudents.value.find(s => s.id === studentId)
  if (!student?.groupId) return ''
  const group = classGroups.value.find(g => g.id === student.groupId)
  return group?.name || ''
}

// 监听组变化，初始化编辑状态
watch(() => [props.group, props.modelValue], () => {
  if (props.modelValue) {
    if (props.group) {
      editName.value = props.group.name
      editIcon.value = props.group.icon
    } else {
      editName.value = ''
      editIcon.value = '🌟'
    }
  }
}, { immediate: true })

// 移出成员（变为未分组）
function removeMember(studentId: string) {
  studentsStore.moveStudentsToGroup([studentId], '')
}

// 添加学生到本组
function addMember(studentId: string) {
  if (!props.group) return
  studentsStore.moveStudentsToGroup([studentId], props.group.id)
}

function handleSave() {
  if (!editName.value.trim()) {
    alert('组名不能为空')
    return
  }

  if (props.group) {
    // 编辑模式：只保存名称和图标（成员变动已实时处理）
    studentsStore.updateGroupInfo(props.group.id, {
      name: editName.value.trim(),
      icon: editIcon.value
    })
  } else {
    // 新建模式：创建分组
    studentsStore.createGroup(editName.value.trim(), editIcon.value)
  }

  emit('saved')
  emit('update:modelValue', false)
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="modalTitle"
    position="center"
    @update:model-value="handleClose"
  >
    <div class="group-edit-content">
      <!-- 基本信息 -->
      <div class="edit-section">
        <div class="section-title">基本信息</div>

        <div class="form-group">
          <label class="form-label">组名</label>
          <input
            v-model="editName"
            type="text"
            class="form-input"
            placeholder="请输入组名"
          />
        </div>

        <div class="form-group">
          <label class="form-label">图标</label>
          <div class="icon-selector">
            <div
              v-for="icon in GROUP_ICONS"
              :key="icon"
              class="icon-option"
              :class="{ selected: editIcon === icon }"
              @click="editIcon = icon"
            >
              {{ icon }}
            </div>
          </div>
        </div>
      </div>

      <!-- 当前组员（编辑模式） -->
      <div v-if="group" class="edit-section">
        <div class="section-title">当前组员 ({{ currentMembers.length }}人)</div>
        <div class="members-list">
          <div
            v-for="student in currentMembers"
            :key="student.id"
            class="member-item"
          >
            <BaseAvatar :name="student.name" size="sm" />
            <span class="member-name">{{ student.name }}</span>
            <button class="remove-btn" @click="removeMember(student.id)">移出</button>
          </div>
          <div v-if="currentMembers.length === 0" class="empty-hint">暂无组员</div>
        </div>
      </div>

      <!-- 添加学生 -->
      <div v-if="group" class="edit-section">
        <div class="section-title">添加学生</div>
        <div class="students-list">
          <div
            v-for="student in classStudents"
            :key="student.id"
            class="student-item"
            :class="{
              'in-current': student.groupId === group.id,
              'in-other': student.groupId && student.groupId !== group.id
            }"
            @click="!student.groupId || (student.groupId !== group.id) ? addMember(student.id) : undefined"
          >
            <span class="student-check">
              <span v-if="student.groupId === group.id" class="check-mark">&#10003;</span>
            </span>
            <span class="student-name">{{ student.name }}</span>
            <span v-if="student.groupId && student.groupId !== group.id" class="group-tag">
              {{ getStudentGroupName(student.id) }}
            </span>
            <span v-if="!student.groupId" class="ungrouped-tag">未分组</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="modal-actions">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="save-btn" @click="handleSave">保存</button>
      </div>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.group-edit-content {
  padding: 10px 0;
}

.edit-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 12px;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: $gray-600;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.icon-option {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: $gray-50;
  border-radius: $radius-md;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: $gray-100;
  }

  &.selected {
    background: #FFF5F5;
    border-color: $primary;
  }
}

// 当前组员列表
.members-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: $gray-50;
  border-radius: $radius-md;
}

.member-name {
  flex: 1;
  font-size: 14px;
  color: $gray-800;
}

.remove-btn {
  padding: 4px 12px;
  background: #FFEBEE;
  color: $danger;
  border: none;
  border-radius: $radius-sm;
  font-size: 12px;
  cursor: pointer;
}

.empty-hint {
  text-align: center;
  color: $gray-400;
  font-size: 14px;
  padding: 20px 0;
}

// 添加学生列表
.students-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: $gray-50;
  border-radius: $radius-md;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover:not(.in-current) {
    background: $gray-100;
    border-color: $primary;
  }

  &.in-current {
    background: #E3F2FD;
    cursor: default;
    opacity: 0.7;
  }

  &.in-other {
    background: $gray-50;
  }
}

.student-check {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $gray-300;
  border-radius: 4px;
  font-size: 12px;

  .in-current & {
    background: $secondary;
    border-color: $secondary;
    color: white;
  }
}

.check-mark {
  line-height: 1;
}

.student-name {
  flex: 1;
  font-size: 14px;
  color: $gray-800;
}

.group-tag {
  font-size: 11px;
  color: $gray-500;
  background: $gray-200;
  padding: 2px 8px;
  border-radius: $radius-sm;
}

.ungrouped-tag {
  font-size: 11px;
  color: $primary;
  background: #FFF5F5;
  padding: 2px 8px;
  border-radius: $radius-sm;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn, .save-btn {
  flex: 1;
  padding: 14px;
  border-radius: $radius-full;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background: $gray-100;
  color: $gray-600;
}

.save-btn {
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
}
</style>
