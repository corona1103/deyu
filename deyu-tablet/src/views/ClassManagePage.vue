<script setup lang="ts">
import { ref } from 'vue'
import { useStudentsStore } from '@/stores/students'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard, BaseAvatar } from '@/components/common'
import GroupEditModal from '@/components/class/GroupEditModal.vue'
import SeatChart from '@/components/class/SeatChart.vue'
import type { Group } from '@shared/types'

const studentsStore = useStudentsStore()

type TabType = 'groups' | 'students' | 'indicators' | 'seats'
const currentTab = ref<TabType>('groups')

const tabs = [
  { value: 'groups', label: '分组管理', icon: '👥' },
  { value: 'students', label: '学生列表', icon: '📋' },
  { value: 'indicators', label: '点评指标', icon: '⭐' },
  { value: 'seats', label: '座位表', icon: '🪑' }
]

// 分组编辑相关
const isEditModalOpen = ref(false)
const editingGroup = ref<Group | null>(null)

// 删除确认
const showDeleteConfirm = ref(false)
const deletingGroup = ref<Group | null>(null)

function handleEditGroup(group: Group) {
  editingGroup.value = group
  isEditModalOpen.value = true
}

function handleDeleteGroup(group: Group) {
  if (studentsStore.groups.length <= 1) {
    alert('至少需要保留一个分组')
    return
  }
  deletingGroup.value = group
  showDeleteConfirm.value = true
}

function confirmDeleteGroup() {
  if (deletingGroup.value) {
    studentsStore.deleteGroup(deletingGroup.value.id)
    showDeleteConfirm.value = false
    deletingGroup.value = null
  }
}

function cancelDeleteGroup() {
  showDeleteConfirm.value = false
  deletingGroup.value = null
}

function handleCreateGroup() {
  const name = prompt('请输入新分组名称')
  if (name && name.trim()) {
    studentsStore.createGroup(name.trim(), '🌟')
  }
}

function handleGroupSaved() {
  // 刷新组数据
  studentsStore.refreshGroupStudents()
}
</script>

<template>
  <div class="class-manage-page">
    <PageHeader title="班级管理" />

    <main class="main-content">
      <!-- Tab 切换 -->
      <div class="tab-bar">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item touch-active"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value as TabType"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>

      <!-- 分组管理 -->
      <template v-if="currentTab === 'groups'">
        <div class="action-bar">
          <button class="add-btn touch-active" @click="handleCreateGroup">+ 新建分组</button>
        </div>
        <div class="groups-list">
          <BaseCard
            v-for="group in studentsStore.groups"
            :key="group.id"
            class="group-item"
          >
            <div class="group-header">
              <span class="group-icon">{{ group.icon }}</span>
              <span class="group-name">{{ group.name }}</span>
              <span class="group-count">{{ group.students.length }}人</span>
            </div>
            <div class="group-members">
              <BaseAvatar
                v-for="student in group.students.slice(0, 5)"
                :key="student.id"
                :name="student.name"
                size="sm"
              />
              <span v-if="group.students.length > 5" class="more-count">
                +{{ group.students.length - 5 }}
              </span>
            </div>
            <div class="group-actions">
              <button class="edit-btn" @click="handleEditGroup(group)">编辑</button>
              <button class="delete-btn" @click="handleDeleteGroup(group)">删除</button>
            </div>
          </BaseCard>
        </div>
      </template>

      <!-- 学生列表 -->
      <template v-else-if="currentTab === 'students'">
        <div class="action-bar">
          <button class="add-btn touch-active">+ 添加学生</button>
          <button class="import-btn touch-active">导入名单</button>
        </div>
        <BaseCard class="students-table">
          <div class="table-header">
            <span class="col-name">姓名</span>
            <span class="col-group">分组</span>
            <span class="col-score">积分</span>
            <span class="col-action">操作</span>
          </div>
          <div
            v-for="student in studentsStore.students"
            :key="student.id"
            class="table-row"
          >
            <span class="col-name">
              <BaseAvatar :name="student.name" size="sm" />
              {{ student.name }}
            </span>
            <span class="col-group">
              {{ studentsStore.groups.find(g => g.id === student.groupId)?.name }}
            </span>
            <span class="col-score">{{ student.score }}</span>
            <span class="col-action">
              <button class="mini-btn">编辑</button>
            </span>
          </div>
        </BaseCard>
      </template>

      <!-- 点评指标 -->
      <template v-else-if="currentTab === 'indicators'">
        <div class="action-bar">
          <button class="add-btn touch-active">+ 添加指标</button>
        </div>
        <div class="indicator-section">
          <div class="section-title">加分指标</div>
          <BaseCard class="indicators-list">
            <div class="indicator-row">
              <span class="ind-icon">📚</span>
              <span class="ind-name">认真听讲</span>
              <span class="ind-score positive">+2分</span>
            </div>
            <div class="indicator-row">
              <span class="ind-icon">✋</span>
              <span class="ind-name">积极发言</span>
              <span class="ind-score positive">+2分</span>
            </div>
            <div class="indicator-row">
              <span class="ind-icon">📝</span>
              <span class="ind-name">作业优秀</span>
              <span class="ind-score positive">+3分</span>
            </div>
          </BaseCard>
        </div>
        <div class="indicator-section">
          <div class="section-title">扣分指标</div>
          <BaseCard class="indicators-list">
            <div class="indicator-row">
              <span class="ind-icon">😴</span>
              <span class="ind-name">上课走神</span>
              <span class="ind-score negative">-1分</span>
            </div>
            <div class="indicator-row">
              <span class="ind-icon">🗣️</span>
              <span class="ind-name">课堂讲话</span>
              <span class="ind-score negative">-1分</span>
            </div>
          </BaseCard>
        </div>
      </template>

      <!-- 座位表管理 -->
      <template v-else-if="currentTab === 'seats'">
        <SeatChart />
      </template>
    </main>

    <!-- 分组编辑弹窗 -->
    <GroupEditModal
      v-model="isEditModalOpen"
      :group="editingGroup"
      @saved="handleGroupSaved"
    />

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click="cancelDeleteGroup">
        <div class="confirm-dialog" @click.stop>
          <div class="confirm-icon">⚠️</div>
          <div class="confirm-title">确认删除</div>
          <div class="confirm-message">
            确定要删除分组「{{ deletingGroup?.name }}」吗？
            <br />
            组内成员将被移动到其他分组。
          </div>
          <div class="confirm-actions">
            <button class="confirm-cancel" @click="cancelDeleteGroup">取消</button>
            <button class="confirm-delete" @click="confirmDeleteGroup">删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.class-manage-page {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 900px;
    margin: 0 auto;
  }
}

.tab-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-600;
  cursor: pointer;
  border: 2px solid transparent;

  &.active {
    border-color: $primary;
    color: $primary;
    background: #FFF5F5;
  }
}

.tab-icon {
  font-size: 16px;
}

.action-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.add-btn, .import-btn {
  padding: 10px 20px;
  border-radius: $radius-full;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.add-btn {
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
}

.import-btn {
  background: white;
  color: $gray-700;
  border: 1px solid $gray-200;
}

// 分组管理
.groups-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.group-item {
  padding: 15px;
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
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
}

.group-count {
  font-size: 13px;
  color: $gray-500;
}

.group-members {
  display: flex;
  gap: -8px;
  margin-bottom: 12px;
}

.more-count {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $gray-200;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: $gray-600;
}

.group-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: $radius-sm;
  font-size: 13px;
  cursor: pointer;
  border: none;
}

.edit-btn {
  background: #E3F2FD;
  color: $secondary;
}

.delete-btn {
  background: #FFEBEE;
  color: $danger;
}

// 学生表格
.students-table {
  overflow-x: auto;
}

.table-header, .table-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid $gray-100;
}

.table-header {
  font-weight: bold;
  color: $gray-600;
  font-size: 13px;
}

.table-row {
  font-size: 14px;
  color: $gray-800;
}

.col-name {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.col-group, .col-score {
  flex: 1;
}

.col-action {
  width: 60px;
}

.mini-btn {
  padding: 4px 10px;
  background: $gray-100;
  border: none;
  border-radius: $radius-sm;
  font-size: 12px;
  color: $gray-600;
  cursor: pointer;
}

// 指标管理
.indicator-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: $gray-700;
  margin-bottom: 10px;
}

.indicators-list {
  padding: 0;
}

.indicator-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    border-bottom: none;
  }
}

.ind-icon {
  font-size: 20px;
}

.ind-name {
  flex: 1;
  font-size: 15px;
  color: $gray-800;
}

.ind-score {
  font-size: 14px;
  font-weight: 500;

  &.positive {
    color: $success;
  }
  &.negative {
    color: $danger;
  }
}

// 删除确认弹窗
.confirm-overlay {
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

.confirm-dialog {
  background: white;
  border-radius: $radius-lg;
  padding: 30px;
  text-align: center;
  max-width: 320px;
  width: 90%;
}

.confirm-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.confirm-title {
  font-size: 18px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 10px;
}

.confirm-message {
  font-size: 14px;
  color: $gray-600;
  line-height: 1.6;
  margin-bottom: 25px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
}

.confirm-cancel, .confirm-delete {
  flex: 1;
  padding: 12px;
  border-radius: $radius-full;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.confirm-cancel {
  background: $gray-100;
  color: $gray-600;
}

.confirm-delete {
  background: $danger;
  color: white;
}
</style>
