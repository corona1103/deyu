<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useUserStore } from '@/stores/user'
import { useTagsStore } from '@/stores/tags'
import { useClassIndicatorsStore } from '@/stores/classIndicators'
import { useWebSocket } from '@shared/composables'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard } from '@/components/common'
import BaseModal from '@/components/common/BaseModal.vue'
import GroupEditModal from '@/components/class/GroupEditModal.vue'
import SeatChart from '@/components/class/SeatChart.vue'
import type { Group } from '@shared/types'

const studentsStore = useStudentsStore()
const userStore = useUserStore()
const tagsStore = useTagsStore()
const classIndStore = useClassIndicatorsStore()
const { connect, joinClass } = useWebSocket()

// 班级筛选
const selectedClassId = ref(userStore.homeroomClasses[0]?.id || 'c1')

// 连接 WebSocket 并加入班级房间
onMounted(() => {
  connect()
  joinClass(selectedClassId.value)
})

const classStudents = computed(() => studentsStore.getStudentsByClass(selectedClassId.value))
const classGroups = computed(() => studentsStore.getGroupsByClass(selectedClassId.value))

const ungroupedStudents = computed(() => {
  const groupIds = new Set(classGroups.value.map(g => g.id))
  return classStudents.value.filter(s => !s.groupId || !groupIds.has(s.groupId))
})

function onClassChange(e: Event) {
  selectedClassId.value = (e.target as HTMLSelectElement).value
}

type TabType = 'groups' | 'seats' | 'indicators'
const currentTab = ref<TabType>('groups')

const tabs = [
  { value: 'groups', label: '分组管理', icon: '👥' },
  { value: 'seats', label: '座位管理', icon: '🪑' },
  { value: 'indicators', label: '点评指标管理', icon: '⭐' }
]

// ========== 分组管理 ==========
const isEditModalOpen = ref(false)
const editingGroup = ref<Group | null>(null)
const showDeleteConfirm = ref(false)
const deletingGroup = ref<Group | null>(null)
const groupImportInput = ref<HTMLInputElement | null>(null)
const seatImportInput = ref<HTMLInputElement | null>(null)

function handleEditGroup(group: Group) { editingGroup.value = group; isEditModalOpen.value = true }
function handleCreateGroup() { editingGroup.value = null; isEditModalOpen.value = true }
function handleDeleteGroup(group: Group) {
  if (classGroups.value.length <= 1) { alert('至少需要保留一个分组'); return }
  deletingGroup.value = group; showDeleteConfirm.value = true
}
function confirmDeleteGroup() {
  if (deletingGroup.value) { studentsStore.deleteGroup(deletingGroup.value.id); showDeleteConfirm.value = false; deletingGroup.value = null }
}
function cancelDeleteGroup() { showDeleteConfirm.value = false; deletingGroup.value = null }
function handleGroupSaved() { studentsStore.refreshGroupStudents() }
function triggerGroupImport() { groupImportInput.value?.click() }
function handleGroupFileChange() { alert('Excel导入功能开发中'); if (groupImportInput.value) groupImportInput.value.value = '' }
function triggerSeatImport() { seatImportInput.value?.click() }
function handleSeatFileChange() { alert('Excel导入功能开发中'); if (seatImportInput.value) seatImportInput.value.value = '' }

// ========== 点评指标管理 ==========
// 展开/收起
const indExpandedDims = ref<Set<string>>(new Set())
const indExpandedLevels = ref<Set<string>>(new Set())

function toggleIndDim(key: string) {
  if (indExpandedDims.value.has(key)) {
    indExpandedDims.value.delete(key)
    for (const k of [...indExpandedLevels.value]) { if (k.startsWith(key + ':')) indExpandedLevels.value.delete(k) }
  } else {
    indExpandedDims.value.add(key)
  }
}

function toggleIndLevel(dimKey: string, levelKey: string) {
  const k = `${dimKey}:${levelKey}`
  if (indExpandedLevels.value.has(k)) indExpandedLevels.value.delete(k)
  else indExpandedLevels.value.add(k)
}

function indExpandAll() {
  tagsStore.dimensions.forEach(dim => {
    indExpandedDims.value.add(dim.key)
    dim.levels.forEach(l => indExpandedLevels.value.add(`${dim.key}:${l.key}`))
  })
}

function indCollapseAll() {
  indExpandedDims.value.clear()
  indExpandedLevels.value.clear()
}

// 忽略/恢复
function handleToggleIgnore(indId: string) {
  classIndStore.toggleIgnore(selectedClassId.value, indId)
}

function isIndIgnored(indId: string): boolean {
  return classIndStore.isIgnored(selectedClassId.value, indId)
}

// 删除自定义指标
function handleRemoveCustom(id: string, label: string) {
  if (!confirm(`确定删除自定义指标「${label}」？`)) return
  classIndStore.removeCustomIndicator(selectedClassId.value, id)
}

// 添加自定义指标弹窗
const showAddIndModal = ref(false)
const newIndLabel = ref('')
const newIndPoints = ref(1)
const newIndDimKey = ref('')
const newIndLevelKey = ref('')

// 当前选中维度的等级列表
const newIndLevelOptions = computed(() => {
  const dim = tagsStore.dimensions.find(d => d.key === newIndDimKey.value)
  return dim?.levels || []
})

function openAddIndModal() {
  newIndLabel.value = ''
  newIndPoints.value = 1
  newIndDimKey.value = tagsStore.dimensions[0]?.key || ''
  newIndLevelKey.value = tagsStore.dimensions[0]?.levels[0]?.key || ''
  showAddIndModal.value = true
}

function confirmAddInd() {
  if (!newIndLabel.value.trim()) { alert('请输入指标名称'); return }
  if (!newIndDimKey.value || !newIndLevelKey.value) { alert('请选择归属维度和等级'); return }

  classIndStore.addCustomIndicator(selectedClassId.value, {
    label: newIndLabel.value.trim(),
    points: newIndPoints.value,
    dimKey: newIndDimKey.value,
    levelKey: newIndLevelKey.value
  })

  showAddIndModal.value = false

  // 自动展开目标节点
  indExpandedDims.value.add(newIndDimKey.value)
  indExpandedLevels.value.add(`${newIndDimKey.value}:${newIndLevelKey.value}`)
}

// 统计
const indIgnoredCount = computed(() => classIndStore.getIgnoredCount(selectedClassId.value))
const indCustomCount = computed(() => classIndStore.getCustomCount(selectedClassId.value))
</script>

<template>
  <div class="class-manage-page">
    <PageHeader title="班级管理" :show-back="false">
      <template #right>
        <div class="class-selector-wrap">
          <select class="class-selector" :value="selectedClassId" @change="onClassChange">
            <option v-for="cls in userStore.homeroomClasses" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
          </select>
        </div>
      </template>
    </PageHeader>

    <main class="main-content">
      <!-- Tab 切换 -->
      <div class="tab-bar">
        <div
          v-for="tab in tabs" :key="tab.value"
          class="tab-item touch-active"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value as TabType"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>

      <!-- ========== 分组管理 ========== -->
      <template v-if="currentTab === 'groups'">
        <div class="action-bar">
          <button class="add-btn touch-active" @click="handleCreateGroup">+ 新建分组</button>
          <button class="import-btn touch-active" @click="triggerGroupImport">批量导入</button>
          <input ref="groupImportInput" type="file" accept=".xlsx,.xls" style="display:none" @change="handleGroupFileChange" />
        </div>
        <div class="groups-list">
          <BaseCard v-for="group in classGroups" :key="group.id" class="group-item">
            <div class="group-header">
              <span class="group-icon">{{ group.icon }}</span>
              <span class="group-name">{{ group.name }}</span>
              <span class="group-count">{{ group.students.length }}人</span>
            </div>
            <div class="group-members-full">
              <span v-for="student in group.students" :key="student.id" class="member-tag">{{ student.name }}</span>
            </div>
            <div class="group-actions">
              <button class="edit-btn" @click="handleEditGroup(group)">编辑</button>
              <button class="delete-btn" @click="handleDeleteGroup(group)">删除</button>
            </div>
          </BaseCard>
        </div>
        <div class="ungrouped-section">
          <div class="section-title">未分组学生 ({{ ungroupedStudents.length }}人)</div>
          <div v-if="ungroupedStudents.length > 0" class="ungrouped-tags">
            <span v-for="student in ungroupedStudents" :key="student.id" class="ungrouped-tag">{{ student.name }}</span>
          </div>
          <div v-else class="empty-hint">所有学生均已分组</div>
        </div>
      </template>

      <!-- ========== 座位管理 ========== -->
      <template v-else-if="currentTab === 'seats'">
        <div class="action-bar">
          <button class="import-btn touch-active" @click="triggerSeatImport">批量导入</button>
          <input ref="seatImportInput" type="file" accept=".xlsx,.xls" style="display:none" @change="handleSeatFileChange" />
        </div>
        <SeatChart :class-id="selectedClassId" />
      </template>

      <!-- ========== 点评指标管理（三级结构） ========== -->
      <template v-else-if="currentTab === 'indicators'">
        <div class="action-bar">
          <button class="add-btn touch-active" @click="openAddIndModal">+ 添加自定义指标</button>
          <div class="action-spacer" />
          <button class="text-btn" @click="indExpandAll">全部展开</button>
          <button class="text-btn" @click="indCollapseAll">全部收起</button>
        </div>

        <!-- 统计提示 -->
        <div class="ind-stats-bar">
          <span class="ind-stat">已忽略 <strong>{{ indIgnoredCount }}</strong> 项校级指标</span>
          <span class="ind-stat">自定义 <strong>{{ indCustomCount }}</strong> 项班级指标</span>
        </div>

        <!-- 一级：维度 -->
        <div class="ci-dim-list">
          <div v-for="dim in tagsStore.dimensions" :key="dim.key" class="ci-dim-block">
            <div class="ci-dim-header" @click="toggleIndDim(dim.key)">
              <span class="ci-expand" :class="{ expanded: indExpandedDims.has(dim.key) }">›</span>
              <span class="ci-dim-icon">{{ dim.icon }}</span>
              <span class="ci-dim-name">{{ dim.name }}</span>
              <span class="ci-dim-count">
                {{ dim.levels.reduce((s, l) => s + l.indicators.length, 0)
                  + classIndStore.getCustomIndicators(selectedClassId).filter(i => i.dimKey === dim.key).length }}项
              </span>
            </div>

            <!-- 二级：等级 -->
            <div v-if="indExpandedDims.has(dim.key)" class="ci-level-list">
              <div v-for="level in dim.levels" :key="level.key" class="ci-level-block">
                <div class="ci-level-header" @click="toggleIndLevel(dim.key, level.key)">
                  <span class="ci-expand" :class="{ expanded: indExpandedLevels.has(`${dim.key}:${level.key}`) }">›</span>
                  <span class="ci-level-dot" :style="{ background: level.color }" />
                  <span class="ci-level-name">{{ level.name }}</span>
                  <span class="ci-level-count">
                    {{ level.indicators.length + classIndStore.getCustomByLevel(selectedClassId, dim.key, level.key).length }}项
                  </span>
                </div>

                <!-- 三级：指标 -->
                <div v-if="indExpandedLevels.has(`${dim.key}:${level.key}`)" class="ci-ind-list">
                  <!-- 自定义指标（置顶） -->
                  <div
                    v-for="ci in classIndStore.getCustomByLevel(selectedClassId, dim.key, level.key)"
                    :key="ci.id"
                    class="ci-ind-row custom-row"
                  >
                    <span class="ci-custom-badge">自</span>
                    <span class="ci-ind-label">{{ ci.label }}</span>
                    <span class="ci-ind-points" :class="ci.points >= 0 ? 'positive' : 'negative'">
                      {{ ci.points > 0 ? '+' : '' }}{{ ci.points }}分
                    </span>
                    <button class="ci-op-btn del" @click="handleRemoveCustom(ci.id, ci.label)">删除</button>
                  </div>

                  <!-- 校级指标 -->
                  <div
                    v-for="ind in level.indicators"
                    :key="ind.id"
                    class="ci-ind-row"
                    :class="{ ignored: isIndIgnored(ind.id) }"
                  >
                    <span class="ci-ind-label">{{ ind.label }}</span>
                    <span class="ci-ind-points" :class="ind.points > 0 ? 'positive' : 'negative'">
                      {{ ind.points > 0 ? '+' : '' }}{{ ind.points }}分
                    </span>
                    <button
                      class="ci-op-btn"
                      :class="isIndIgnored(ind.id) ? 'restore' : 'ignore'"
                      @click="handleToggleIgnore(ind.id)"
                    >
                      {{ isIndIgnored(ind.id) ? '恢复' : '忽略' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- 分组编辑弹窗 -->
    <GroupEditModal v-model="isEditModalOpen" :group="editingGroup" :class-id="selectedClassId" @saved="handleGroupSaved" />

    <!-- 删除确认弹窗 -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="confirm-overlay" @click="cancelDeleteGroup">
        <div class="confirm-dialog" @click.stop>
          <div class="confirm-icon-wrap">⚠️</div>
          <div class="confirm-title">确认删除</div>
          <div class="confirm-message">确定要删除分组「{{ deletingGroup?.name }}」吗？<br />组内成员将变为未分组状态。</div>
          <div class="confirm-actions">
            <button class="confirm-cancel" @click="cancelDeleteGroup">取消</button>
            <button class="confirm-delete" @click="confirmDeleteGroup">删除</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 添加自定义指标弹窗 -->
    <BaseModal v-model="showAddIndModal" title="添加自定义指标" position="center" @update:model-value="showAddIndModal = $event">
      <div class="add-ind-form">
        <div class="form-group">
          <label class="form-label">指标名称</label>
          <input v-model="newIndLabel" type="text" class="form-input" placeholder="请输入行为描述" />
        </div>
        <div class="form-group">
          <label class="form-label">加减分值</label>
          <div class="points-row">
            <button class="points-adj" @click="newIndPoints--">-</button>
            <input v-model.number="newIndPoints" type="number" class="points-input" />
            <button class="points-adj" @click="newIndPoints++">+</button>
            <span class="points-preview" :class="newIndPoints >= 0 ? 'positive' : 'negative'">
              {{ newIndPoints > 0 ? '+' : '' }}{{ newIndPoints }}分
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">归属维度</label>
          <select v-model="newIndDimKey" class="form-select" @change="newIndLevelKey = newIndLevelOptions[0]?.key || ''">
            <option v-for="dim in tagsStore.dimensions" :key="dim.key" :value="dim.key">{{ dim.icon }} {{ dim.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">归属等级</label>
          <select v-model="newIndLevelKey" class="form-select">
            <option v-for="level in newIndLevelOptions" :key="level.key" :value="level.key">
              {{ level.name }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showAddIndModal = false">取消</button>
          <button class="save-btn" @click="confirmAddInd">确认添加</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.class-manage-page { min-height: 100vh; background: $gray-100; }

.main-content {
  padding: 15px;
  @media (min-width: $breakpoint-md) { padding: 20px 40px; max-width: 900px; margin: 0 auto; }
}

.tab-bar { display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; }

.tab-item {
  flex-shrink: 0; display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; background: white; border-radius: $radius-full;
  font-size: 14px; color: $gray-600; cursor: pointer; border: 2px solid transparent;
  &.active { border-color: $primary; color: $primary; background: #FFF5F5; }
}

.tab-icon { font-size: 16px; }

.action-bar { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
.action-spacer { flex: 1; }

.text-btn {
  padding: 8px 14px; background: none; border: none; font-size: 13px;
  color: $gray-500; cursor: pointer;
  &:hover { color: $primary; }
}

.add-btn, .import-btn {
  padding: 10px 20px; border-radius: $radius-full; font-size: 14px; cursor: pointer; border: none;
}
.add-btn { background: linear-gradient(135deg, $primary, $primary-light); color: white; }
.import-btn { background: white; color: $gray-700; border: 1px solid $gray-200; }

// ========== 分组管理 ==========
.groups-list { display: flex; flex-direction: column; gap: 15px; }
.group-item { padding: 15px; }
.group-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.group-icon { font-size: 24px; }
.group-name { flex: 1; font-size: 16px; font-weight: bold; color: $gray-800; }
.group-count { font-size: 13px; color: $gray-500; }
.group-members-full { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.member-tag { display: inline-block; padding: 4px 12px; background: #E3F2FD; color: $gray-800; border-radius: $radius-full; font-size: 13px; }
.group-actions { display: flex; gap: 10px; }
.edit-btn, .delete-btn { padding: 8px 16px; border-radius: $radius-sm; font-size: 13px; cursor: pointer; border: none; }
.edit-btn { background: #E3F2FD; color: $secondary; }
.delete-btn { background: #FFEBEE; color: $danger; }
.ungrouped-section { margin-top: 25px; padding: 15px; background: white; border-radius: $radius-lg; }
.section-title { font-size: 14px; font-weight: bold; color: $gray-700; margin-bottom: 10px; }
.ungrouped-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ungrouped-tag { display: inline-block; padding: 6px 14px; background: #FFF5F5; color: $primary; border-radius: $radius-full; font-size: 13px; border: 1px dashed $primary; }
.empty-hint { font-size: 13px; color: $gray-400; text-align: center; padding: 10px 0; }

// ========== 点评指标管理 三级结构 ==========
.ind-stats-bar {
  display: flex; gap: 20px; margin-bottom: 16px;
  font-size: 13px; color: $gray-500;
  strong { color: $gray-800; margin: 0 2px; }
}

// 一级
.ci-dim-list { display: flex; flex-direction: column; gap: 12px; }

.ci-dim-block { background: white; border-radius: $radius-lg; overflow: hidden; }

.ci-dim-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; cursor: pointer; transition: background 0.2s;
  &:hover { background: $gray-50; }
}

.ci-expand {
  font-size: 18px; color: $gray-400; width: 20px; text-align: center;
  transition: transform 0.2s; flex-shrink: 0;
  &.expanded { transform: rotate(90deg); }
}

.ci-dim-icon { font-size: 24px; }
.ci-dim-name { flex: 1; font-size: 16px; font-weight: bold; color: $gray-800; }
.ci-dim-count { font-size: 13px; color: $gray-400; }

// 二级
.ci-level-list { border-top: 1px solid $gray-100; }

.ci-level-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px 12px 36px; cursor: pointer; transition: background 0.2s;
  &:hover { background: $gray-50; }
}

.ci-level-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.ci-level-name { font-size: 14px; font-weight: 600; color: $gray-700; flex: 1; }
.ci-level-count { font-size: 12px; color: $gray-400; }

// 三级
.ci-ind-list { background: $gray-50; border-top: 1px solid $gray-100; }

.ci-ind-row {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 16px 11px 56px;
  border-bottom: 1px solid $gray-100; font-size: 14px;
  transition: opacity 0.2s, background 0.2s;
  &:last-child { border-bottom: none; }

  &.ignored {
    opacity: 0.45;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 6px, rgba(0,0,0,0.02) 6px, rgba(0,0,0,0.02) 12px
    );
    .ci-ind-label { text-decoration: line-through; }
  }

  &.custom-row {
    background: #FFFDE7;
  }
}

.ci-custom-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 4px;
  background: $primary; color: white;
  font-size: 11px; font-weight: bold; flex-shrink: 0;
}

.ci-ind-label { flex: 1; color: $gray-700; line-height: 1.4; }

.ci-ind-points {
  font-size: 13px; font-weight: 600; flex-shrink: 0;
  min-width: 50px; text-align: right;
  &.positive { color: $success; }
  &.negative { color: $danger; }
}

.ci-op-btn {
  padding: 4px 12px; border-radius: 4px; font-size: 12px;
  border: none; cursor: pointer; flex-shrink: 0;

  &.ignore { background: $gray-100; color: $gray-500; &:hover { background: #FFEBEE; color: $danger; } }
  &.restore { background: #E8F5E9; color: $success; &:hover { background: #C8E6C9; } }
  &.del { background: #FFEBEE; color: $danger; &:hover { background: #FFCDD2; } }
}

// ========== 添加自定义指标弹窗 ==========
.add-ind-form { padding: 10px 0; }

.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: 14px; color: $gray-600; margin-bottom: 8px; }

.form-input, .form-select {
  width: 100%; padding: 12px 15px;
  border: 1px solid $gray-200; border-radius: $radius-md; font-size: 15px;
  &:focus { outline: none; border-color: $primary; }
}

.form-select {
  appearance: none;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 14px center;
}

.points-row {
  display: flex; align-items: center; gap: 10px;
}

.points-adj {
  width: 40px; height: 40px; border-radius: 50%;
  background: $gray-100; border: none; font-size: 20px;
  color: $gray-700; cursor: pointer; display: flex; align-items: center; justify-content: center;
  &:hover { background: $gray-200; }
}

.points-input {
  width: 80px; padding: 10px; text-align: center;
  border: 1px solid $gray-200; border-radius: $radius-md;
  font-size: 18px; font-weight: bold;
  &:focus { outline: none; border-color: $primary; }
}

.points-preview {
  font-size: 16px; font-weight: bold; margin-left: 8px;
  &.positive { color: $success; }
  &.negative { color: $danger; }
}

.modal-actions { display: flex; gap: 12px; margin-top: 24px; }

.cancel-btn, .save-btn {
  flex: 1; padding: 14px; border-radius: $radius-full;
  font-size: 16px; font-weight: bold; cursor: pointer; border: none;
}
.cancel-btn { background: $gray-100; color: $gray-600; }
.save-btn { background: linear-gradient(135deg, $primary, $primary-light); color: white; }

// ========== 通用弹窗 ==========
.confirm-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.confirm-dialog { background: white; border-radius: $radius-lg; padding: 30px; text-align: center; max-width: 320px; width: 90%; }
.confirm-icon-wrap { font-size: 48px; margin-bottom: 15px; }
.confirm-title { font-size: 18px; font-weight: bold; color: $gray-800; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: $gray-600; line-height: 1.6; margin-bottom: 25px; }
.confirm-actions { display: flex; gap: 12px; }
.confirm-cancel, .confirm-delete {
  flex: 1; padding: 12px; border-radius: $radius-full; font-size: 15px; font-weight: bold; cursor: pointer; border: none;
}
.confirm-cancel { background: $gray-100; color: $gray-600; }
.confirm-delete { background: $danger; color: white; }

.class-selector-wrap { display: flex; align-items: center; }
.class-selector {
  padding: 6px 28px 6px 12px; border: 1px solid $gray-200; border-radius: $radius-full;
  font-size: 13px; color: $gray-700;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 10px center;
  appearance: none; cursor: pointer; min-width: 120px;
  &:focus { outline: none; border-color: $primary; }
}
</style>
