<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Group, Student } from '@shared/types'
import { GROUP_ICONS } from '@shared/constants'
import BaseModal from '@/components/common/BaseModal.vue'
import { BaseAvatar } from '@/components/common'
import { useStudentsStore } from '@/stores/students'

interface Props {
  modelValue: boolean
  group: Group | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const studentsStore = useStudentsStore()

// 编辑状态
const editName = ref('')
const editIcon = ref('')
const selectedMemberIds = ref<string[]>([])
const targetGroupId = ref('')

// 其他可用分组
const otherGroups = computed(() =>
  studentsStore.groups.filter(g => g.id !== props.group?.id)
)

// 当前组成员
const currentMembers = computed(() =>
  props.group?.students || []
)

// 监听组变化，初始化编辑状态
watch(() => props.group, (newGroup) => {
  if (newGroup) {
    editName.value = newGroup.name
    editIcon.value = newGroup.icon
    selectedMemberIds.value = []
    targetGroupId.value = ''
  }
}, { immediate: true })

function toggleMemberSelection(studentId: string) {
  const index = selectedMemberIds.value.indexOf(studentId)
  if (index === -1) {
    selectedMemberIds.value.push(studentId)
  } else {
    selectedMemberIds.value.splice(index, 1)
  }
}

function selectAllMembers() {
  if (selectedMemberIds.value.length === currentMembers.value.length) {
    selectedMemberIds.value = []
  } else {
    selectedMemberIds.value = currentMembers.value.map(s => s.id)
  }
}

function moveSelectedToGroup() {
  if (selectedMemberIds.value.length === 0) {
    alert('请先选择要移动的成员')
    return
  }
  if (!targetGroupId.value) {
    alert('请选择目标分组')
    return
  }

  studentsStore.moveStudentsToGroup(selectedMemberIds.value, targetGroupId.value)
  selectedMemberIds.value = []
  targetGroupId.value = ''
}

function handleSave() {
  if (!props.group) return

  if (!editName.value.trim()) {
    alert('组名不能为空')
    return
  }

  studentsStore.updateGroupInfo(props.group.id, {
    name: editName.value.trim(),
    icon: editIcon.value
  })

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
    title="编辑分组"
    position="center"
    @update:model-value="handleClose"
  >
    <div v-if="group" class="group-edit-content">
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

      <!-- 成员管理 -->
      <div class="edit-section">
        <div class="section-header">
          <div class="section-title">成员管理 ({{ currentMembers.length }}人)</div>
          <button class="select-all-btn" @click="selectAllMembers">
            {{ selectedMemberIds.length === currentMembers.length ? '取消全选' : '全选' }}
          </button>
        </div>

        <div class="members-grid">
          <div
            v-for="student in currentMembers"
            :key="student.id"
            class="member-item"
            :class="{ selected: selectedMemberIds.includes(student.id) }"
            @click="toggleMemberSelection(student.id)"
          >
            <BaseAvatar :name="student.name" size="sm" />
            <span class="member-name">{{ student.name }}</span>
            <span v-if="selectedMemberIds.includes(student.id)" class="check-icon">✓</span>
          </div>
        </div>

        <!-- 批量移动 -->
        <div v-if="selectedMemberIds.length > 0" class="move-section">
          <div class="move-hint">
            已选择 {{ selectedMemberIds.length }} 人，移动到：
          </div>
          <div class="move-controls">
            <select v-model="targetGroupId" class="group-select">
              <option value="">选择目标分组</option>
              <option v-for="g in otherGroups" :key="g.id" :value="g.id">
                {{ g.icon }} {{ g.name }}
              </option>
            </select>
            <button
              class="move-btn"
              :disabled="!targetGroupId"
              @click="moveSelectedToGroup"
            >
              移动
            </button>
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 12px;

  .section-header & {
    margin-bottom: 0;
  }
}

.select-all-btn {
  padding: 6px 12px;
  background: $gray-100;
  border: none;
  border-radius: $radius-sm;
  font-size: 13px;
  color: $gray-600;
  cursor: pointer;
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

.members-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: $gray-50;
  border-radius: $radius-md;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: $gray-100;
  }

  &.selected {
    background: #E3F2FD;
    border-color: $secondary;
  }
}

.member-name {
  flex: 1;
  font-size: 14px;
  color: $gray-800;
}

.check-icon {
  color: $secondary;
  font-weight: bold;
}

.move-section {
  margin-top: 15px;
  padding: 15px;
  background: #FFF8E1;
  border-radius: $radius-md;
}

.move-hint {
  font-size: 14px;
  color: $gray-700;
  margin-bottom: 10px;
}

.move-controls {
  display: flex;
  gap: 10px;
}

.group-select {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.move-btn {
  padding: 10px 20px;
  background: $secondary;
  color: white;
  border: none;
  border-radius: $radius-md;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
