<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard } from '@/components/common'
import { useTagsStore } from '@/stores/tags'

const route = useRoute()
const router = useRouter()

type SubTab = 'students' | 'classes' | 'teachers' | 'tags' | 'knowledge' | 'settings'

const currentTab = ref<SubTab>((route.query.tab as SubTab) || 'students')

const tabs = [
  { value: 'students', label: '学生管理', icon: '🎓' },
  { value: 'classes', label: '班课管理', icon: '📚' },
  { value: 'teachers', label: '老师管理', icon: '👨‍🏫' },
  { value: 'tags', label: '标签管理', icon: '🏷️' },
  { value: 'knowledge', label: '知识库', icon: '📖' },
  { value: 'settings', label: '配置中心', icon: '⚙️' }
]

function switchTab(tab: SubTab) {
  currentTab.value = tab
  router.replace({ query: { tab } })
}

// ========== 标签管理（可编辑 3 级结构） ==========
const tagsStore = useTagsStore()

// 展开/收起
const expandedDimensions = ref<Set<string>>(new Set())
const expandedLevels = ref<Set<string>>(new Set())

function toggleDimension(key: string) {
  if (expandedDimensions.value.has(key)) {
    expandedDimensions.value.delete(key)
    for (const lk of [...expandedLevels.value]) {
      if (lk.startsWith(key + ':')) expandedLevels.value.delete(lk)
    }
  } else {
    expandedDimensions.value.add(key)
  }
}

function toggleLevel(dimKey: string, levelKey: string) {
  const k = `${dimKey}:${levelKey}`
  if (expandedLevels.value.has(k)) expandedLevels.value.delete(k)
  else expandedLevels.value.add(k)
}

function expandAll() {
  tagsStore.dimensions.forEach(dim => {
    expandedDimensions.value.add(dim.key)
    dim.levels.forEach(level => expandedLevels.value.add(`${dim.key}:${level.key}`))
  })
}

function collapseAll() {
  expandedDimensions.value.clear()
  expandedLevels.value.clear()
}

// 内联编辑状态
const editingField = ref<string | null>(null)   // 'dim:happy:name', 'level:happy:daily:name', 'ind:happy:daily:h01:label' 等
const editingValue = ref('')

function startEdit(fieldKey: string, currentValue: string) {
  editingField.value = fieldKey
  editingValue.value = currentValue
}

function confirmEdit(fieldKey: string) {
  if (editingField.value !== fieldKey) return
  const parts = fieldKey.split(':')
  const value = editingValue.value.trim()
  if (!value) { editingField.value = null; return }

  if (parts[0] === 'dim' && parts[2] === 'name') {
    tagsStore.renameDimension(parts[1], value)
  } else if (parts[0] === 'dim' && parts[2] === 'icon') {
    tagsStore.setDimensionIcon(parts[1], value)
  } else if (parts[0] === 'level' && parts[3] === 'name') {
    tagsStore.renameLevel(parts[1], parts[2], value)
  } else if (parts[0] === 'ind' && parts[4] === 'label') {
    tagsStore.updateIndicator(parts[1], parts[2], parts[3], { label: value })
  } else if (parts[0] === 'ind' && parts[4] === 'points') {
    const num = parseInt(value)
    if (!isNaN(num)) tagsStore.updateIndicator(parts[1], parts[2], parts[3], { points: num })
  }
  editingField.value = null
}

function cancelEdit() {
  editingField.value = null
}

function onEditKeydown(e: KeyboardEvent, fieldKey: string) {
  if (e.key === 'Enter') confirmEdit(fieldKey)
  else if (e.key === 'Escape') cancelEdit()
}

// 增删操作
function handleAddDimension() {
  const key = tagsStore.addDimension()
  if (key) expandedDimensions.value.add(key)
}

function handleRemoveDimension(key: string, name: string) {
  if (!confirm(`确定删除维度「${name}」及其下所有等级和指标？`)) return
  tagsStore.removeDimension(key)
  expandedDimensions.value.delete(key)
}

function handleAddLevel(dimKey: string) {
  const key = tagsStore.addLevel(dimKey)
  if (key) {
    expandedDimensions.value.add(dimKey)
    expandedLevels.value.add(`${dimKey}:${key}`)
  }
}

function handleRemoveLevel(dimKey: string, levelKey: string, name: string) {
  if (!confirm(`确定删除等级「${name}」及其下所有指标？`)) return
  tagsStore.removeLevel(dimKey, levelKey)
}

function handleAddIndicator(dimKey: string, levelKey: string) {
  tagsStore.addIndicator(dimKey, levelKey)
  expandedLevels.value.add(`${dimKey}:${levelKey}`)
}

function handleRemoveIndicator(dimKey: string, levelKey: string, indId: string, label: string) {
  if (!confirm(`确定删除指标「${label}」？`)) return
  tagsStore.removeIndicator(dimKey, levelKey, indId)
}

// 批量导入
const tagImportInput = ref<HTMLInputElement | null>(null)
function triggerTagImport() { tagImportInput.value?.click() }
function handleTagFileChange() {
  alert('Excel导入功能开发中，请按模板格式准备数据：维度 / 关注等级 / 行为描述 / 加减分值')
  if (tagImportInput.value) tagImportInput.value.value = ''
}

// 维度图标选项
const DIM_ICONS = ['😊', '🚀', '📚', '💪', '🌟', '🎯', '🏆', '💡', '🔥', '📌']

// ========== 其他 Mock 数据 ==========
const mockStudentList = [
  { id: 1, name: '徐婉云', class: '三年级1班', status: '在读' },
  { id: 2, name: '孙沐昀', class: '三年级1班', status: '在读' },
  { id: 3, name: '刘玥希', class: '三年级1班', status: '在读' },
  { id: 4, name: '赵思语', class: '三年级2班', status: '在读' },
  { id: 5, name: '钱浩然', class: '三年级2班', status: '在读' },
]

const mockClassList = [
  { id: 1, name: '三年级1班', teacher: '王老师', studentCount: 16 },
  { id: 2, name: '三年级2班', teacher: '李老师', studentCount: 16 },
  { id: 3, name: '四年级1班', teacher: '张老师', studentCount: 0 },
]

const mockTeacherList = [
  { id: 1, name: '王老师', subject: '语文', classes: '三年级1班' },
  { id: 2, name: '李老师', subject: '数学', classes: '三年级2班' },
  { id: 3, name: '张老师', subject: '英语', classes: '四年级1班' },
]
</script>

<template>
  <div class="school-manage-page">
    <PageHeader title="学校管理" :show-back="false" />

    <main class="main-content">
      <!-- 二级导航 -->
      <div class="sub-nav">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="sub-nav-item"
          :class="{ active: currentTab === tab.value }"
          @click="switchTab(tab.value as SubTab)"
        >
          <span class="sub-nav-icon">{{ tab.icon }}</span>
          <span class="sub-nav-label">{{ tab.label }}</span>
        </div>
      </div>

      <!-- 学生管理 -->
      <template v-if="currentTab === 'students'">
        <div class="action-bar">
          <button class="add-btn">+ 添加学生</button>
          <button class="import-btn">批量导入</button>
        </div>
        <BaseCard class="data-table">
          <div class="table-header">
            <span class="col" style="flex:2">姓名</span>
            <span class="col" style="flex:2">班级</span>
            <span class="col" style="flex:1">状态</span>
            <span class="col" style="flex:1">操作</span>
          </div>
          <div v-for="s in mockStudentList" :key="s.id" class="table-row">
            <span class="col" style="flex:2">{{ s.name }}</span>
            <span class="col" style="flex:2">{{ s.class }}</span>
            <span class="col status-tag" style="flex:1">{{ s.status }}</span>
            <span class="col" style="flex:1">
              <button class="mini-btn">编辑</button>
            </span>
          </div>
        </BaseCard>
      </template>

      <!-- 班课管理 -->
      <template v-else-if="currentTab === 'classes'">
        <div class="action-bar">
          <button class="add-btn">+ 新建班课</button>
        </div>
        <div class="cards-grid">
          <BaseCard v-for="c in mockClassList" :key="c.id" class="info-card">
            <div class="card-title">{{ c.name }}</div>
            <div class="card-meta">班主任：{{ c.teacher }}</div>
            <div class="card-meta">学生人数：{{ c.studentCount }}人</div>
            <div class="card-actions">
              <button class="mini-btn">编辑</button>
              <button class="mini-btn danger">删除</button>
            </div>
          </BaseCard>
        </div>
      </template>

      <!-- 老师管理 -->
      <template v-else-if="currentTab === 'teachers'">
        <div class="action-bar">
          <button class="add-btn">+ 添加老师</button>
          <button class="import-btn">批量导入</button>
        </div>
        <BaseCard class="data-table">
          <div class="table-header">
            <span class="col" style="flex:2">姓名</span>
            <span class="col" style="flex:2">学科</span>
            <span class="col" style="flex:2">班级</span>
            <span class="col" style="flex:1">操作</span>
          </div>
          <div v-for="t in mockTeacherList" :key="t.id" class="table-row">
            <span class="col" style="flex:2">{{ t.name }}</span>
            <span class="col" style="flex:2">{{ t.subject }}</span>
            <span class="col" style="flex:2">{{ t.classes }}</span>
            <span class="col" style="flex:1">
              <button class="mini-btn">编辑</button>
            </span>
          </div>
        </BaseCard>
      </template>

      <!-- 标签管理（可编辑 3 级结构） -->
      <template v-else-if="currentTab === 'tags'">
        <div class="action-bar">
          <button class="add-btn" @click="handleAddDimension">+ 添加维度</button>
          <button class="import-btn" @click="triggerTagImport">批量导入</button>
          <input
            ref="tagImportInput"
            type="file"
            accept=".xlsx,.xls"
            style="display:none"
            @change="handleTagFileChange"
          />
          <div class="action-spacer" />
          <button class="text-btn" @click="expandAll">全部展开</button>
          <button class="text-btn" @click="collapseAll">全部收起</button>
        </div>

        <!-- 统计概览 -->
        <div class="tag-stats">
          <div v-for="dim in tagsStore.dimensions" :key="dim.key" class="stat-item">
            <span class="stat-icon">{{ dim.icon }}</span>
            <span class="stat-label">{{ dim.name.split('（')[0] }}</span>
            <span class="stat-num">{{ dim.levels.reduce((s, l) => s + l.indicators.length, 0) }}项</span>
          </div>
          <div class="stat-item stat-total">
            <span class="stat-label">合计</span>
            <span class="stat-num">{{ tagsStore.totalIndicatorCount }}项</span>
          </div>
        </div>

        <!-- ===== 一级：维度 ===== -->
        <div class="dim-list">
          <div v-for="(dim, dimIdx) in tagsStore.dimensions" :key="dim.key" class="dim-block">
            <div class="dim-header">
              <!-- 展开 -->
              <span
                class="dim-expand"
                :class="{ expanded: expandedDimensions.has(dim.key) }"
                @click="toggleDimension(dim.key)"
              >›</span>

              <!-- 图标（可编辑） -->
              <span
                v-if="editingField !== `dim:${dim.key}:icon`"
                class="dim-icon editable"
                @click.stop="startEdit(`dim:${dim.key}:icon`, dim.icon)"
              >{{ dim.icon }}</span>
              <div v-else class="icon-picker" @click.stop>
                <span
                  v-for="ic in DIM_ICONS"
                  :key="ic"
                  class="icon-choice"
                  :class="{ active: ic === editingValue }"
                  @click="editingValue = ic; confirmEdit(`dim:${dim.key}:icon`)"
                >{{ ic }}</span>
              </div>

              <!-- 名称（可编辑） -->
              <span
                v-if="editingField !== `dim:${dim.key}:name`"
                class="dim-name editable"
                @click.stop="startEdit(`dim:${dim.key}:name`, dim.name)"
              >{{ dim.name }}</span>
              <input
                v-else
                class="inline-input dim-name-input"
                v-model="editingValue"
                @blur="confirmEdit(`dim:${dim.key}:name`)"
                @keydown="onEditKeydown($event, `dim:${dim.key}:name`)"
                @click.stop
                autofocus
              />

              <span class="dim-count">{{ dim.levels.reduce((s, l) => s + l.indicators.length, 0) }}项</span>

              <!-- 排序 & 删除 -->
              <div class="row-ops" @click.stop>
                <button class="op-btn" :disabled="dimIdx === 0" @click="tagsStore.moveDimension(dim.key, -1)">↑</button>
                <button class="op-btn" :disabled="dimIdx === tagsStore.dimensions.length - 1" @click="tagsStore.moveDimension(dim.key, 1)">↓</button>
                <button class="op-btn del" @click="handleRemoveDimension(dim.key, dim.name)">✕</button>
              </div>
            </div>

            <!-- ===== 二级：关注等级 ===== -->
            <div v-if="expandedDimensions.has(dim.key)" class="level-list">
              <div
                v-for="(level, lvlIdx) in dim.levels"
                :key="level.key"
                class="level-block"
              >
                <div class="level-header">
                  <span
                    class="level-expand"
                    :class="{ expanded: expandedLevels.has(`${dim.key}:${level.key}`) }"
                    @click="toggleLevel(dim.key, level.key)"
                  >›</span>
                  <span class="level-dot" :style="{ background: level.color }" />

                  <!-- 等级名称（可编辑） -->
                  <span
                    v-if="editingField !== `level:${dim.key}:${level.key}:name`"
                    class="level-name editable"
                    @click.stop="startEdit(`level:${dim.key}:${level.key}:name`, level.name)"
                  >{{ level.name }}</span>
                  <input
                    v-else
                    class="inline-input level-name-input"
                    v-model="editingValue"
                    @blur="confirmEdit(`level:${dim.key}:${level.key}:name`)"
                    @keydown="onEditKeydown($event, `level:${dim.key}:${level.key}:name`)"
                    @click.stop
                    autofocus
                  />

                  <span class="level-count">{{ level.indicators.length }}项</span>

                  <div class="row-ops" @click.stop>
                    <button class="op-btn" :disabled="lvlIdx === 0" @click="tagsStore.moveLevel(dim.key, level.key, -1)">↑</button>
                    <button class="op-btn" :disabled="lvlIdx === dim.levels.length - 1" @click="tagsStore.moveLevel(dim.key, level.key, 1)">↓</button>
                    <button class="op-btn del" @click="handleRemoveLevel(dim.key, level.key, level.name)">✕</button>
                  </div>
                </div>

                <!-- ===== 三级：指标 ===== -->
                <div
                  v-if="expandedLevels.has(`${dim.key}:${level.key}`)"
                  class="indicator-list"
                >
                  <div
                    v-for="(ind, indIdx) in level.indicators"
                    :key="ind.id"
                    class="indicator-row"
                  >
                    <!-- 行为描述（可编辑） -->
                    <span
                      v-if="editingField !== `ind:${dim.key}:${level.key}:${ind.id}:label`"
                      class="ind-label editable"
                      @click.stop="startEdit(`ind:${dim.key}:${level.key}:${ind.id}:label`, ind.label)"
                    >{{ ind.label }}</span>
                    <input
                      v-else
                      class="inline-input ind-label-input"
                      v-model="editingValue"
                      @blur="confirmEdit(`ind:${dim.key}:${level.key}:${ind.id}:label`)"
                      @keydown="onEditKeydown($event, `ind:${dim.key}:${level.key}:${ind.id}:label`)"
                      @click.stop
                      autofocus
                    />

                    <!-- 分值（可编辑） -->
                    <span
                      v-if="editingField !== `ind:${dim.key}:${level.key}:${ind.id}:points`"
                      class="ind-points editable"
                      :class="ind.points > 0 ? 'positive' : 'negative'"
                      @click.stop="startEdit(`ind:${dim.key}:${level.key}:${ind.id}:points`, String(ind.points))"
                    >{{ ind.points > 0 ? '+' : '' }}{{ ind.points }}分</span>
                    <input
                      v-else
                      type="number"
                      class="inline-input points-input"
                      v-model="editingValue"
                      @blur="confirmEdit(`ind:${dim.key}:${level.key}:${ind.id}:points`)"
                      @keydown="onEditKeydown($event, `ind:${dim.key}:${level.key}:${ind.id}:points`)"
                      @click.stop
                      autofocus
                    />

                    <!-- 排序 & 删除 -->
                    <div class="row-ops compact" @click.stop>
                      <button class="op-btn sm" :disabled="indIdx === 0" @click="tagsStore.moveIndicator(dim.key, level.key, ind.id, -1)">↑</button>
                      <button class="op-btn sm" :disabled="indIdx === level.indicators.length - 1" @click="tagsStore.moveIndicator(dim.key, level.key, ind.id, 1)">↓</button>
                      <button class="op-btn sm del" @click="handleRemoveIndicator(dim.key, level.key, ind.id, ind.label)">✕</button>
                    </div>
                  </div>

                  <!-- 添加指标按钮 -->
                  <div class="add-row" @click="handleAddIndicator(dim.key, level.key)">
                    <span class="add-row-text">+ 添加指标</span>
                  </div>
                </div>
              </div>

              <!-- 添加等级按钮 -->
              <div class="add-level-row" @click="handleAddLevel(dim.key)">
                <span class="add-row-text">+ 添加关注等级</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 知识库 -->
      <template v-else-if="currentTab === 'knowledge'">
        <div class="action-bar">
          <button class="add-btn">+ 添加文档</button>
          <button class="import-btn">上传文件</button>
        </div>
        <div class="placeholder-section">
          <div class="placeholder-icon">📖</div>
          <div class="placeholder-text">知识库功能开发中</div>
          <div class="placeholder-desc">可上传德育相关文档、政策文件、教学资料等</div>
        </div>
      </template>

      <!-- 配置中心 -->
      <template v-else-if="currentTab === 'settings'">
        <div class="settings-list">
          <BaseCard class="setting-item">
            <div class="setting-header">
              <span class="setting-icon">🏫</span>
              <div class="setting-info">
                <div class="setting-name">学校信息</div>
                <div class="setting-desc">学校名称、地址、联系方式等基本信息</div>
              </div>
              <span class="setting-arrow">›</span>
            </div>
          </BaseCard>
          <BaseCard class="setting-item">
            <div class="setting-header">
              <span class="setting-icon">📅</span>
              <div class="setting-info">
                <div class="setting-name">学期设置</div>
                <div class="setting-desc">学期起止日期、假期安排</div>
              </div>
              <span class="setting-arrow">›</span>
            </div>
          </BaseCard>
          <BaseCard class="setting-item">
            <div class="setting-header">
              <span class="setting-icon">🔔</span>
              <div class="setting-info">
                <div class="setting-name">通知设置</div>
                <div class="setting-desc">预警通知、消息推送等配置</div>
              </div>
              <span class="setting-arrow">›</span>
            </div>
          </BaseCard>
          <BaseCard class="setting-item">
            <div class="setting-header">
              <span class="setting-icon">🔒</span>
              <div class="setting-info">
                <div class="setting-name">权限管理</div>
                <div class="setting-desc">角色权限、数据访问权限设置</div>
              </div>
              <span class="setting-arrow">›</span>
            </div>
          </BaseCard>
        </div>
      </template>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.school-manage-page {
  min-height: 100vh;
  background: $gray-100;
}

.main-content {
  padding: 15px;

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 960px;
    margin: 0 auto;
  }
}

// 二级导航
.sub-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.sub-nav-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: white;
  border-radius: $radius-full;
  font-size: 14px;
  color: $gray-600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: $gray-50;
  }

  &.active {
    border-color: $primary;
    color: $primary;
    background: #FFF5F5;
  }
}

.sub-nav-icon {
  font-size: 16px;
}

// 通用操作栏
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

// 数据表格
.data-table {
  overflow-x: auto;
}

.table-header, .table-row {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid $gray-100;
}

.table-header {
  font-weight: bold;
  color: $gray-600;
  font-size: 13px;
  background: $gray-50;
}

.table-row {
  font-size: 14px;
  color: $gray-800;

  &:last-child {
    border-bottom: none;
  }
}

.col {
  display: flex;
  align-items: center;
}

.status-tag {
  color: $success;
  font-size: 13px;
}

.mini-btn {
  padding: 5px 12px;
  background: $gray-100;
  border: none;
  border-radius: $radius-sm;
  font-size: 12px;
  color: $gray-600;
  cursor: pointer;

  &:hover {
    background: $gray-200;
  }

  &.danger {
    color: $danger;
    background: #FFEBEE;
  }

  & + & {
    margin-left: 6px;
  }
}

// 卡片网格
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 15px;
}

.info-card {
  padding: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: $gray-800;
  margin-bottom: 10px;
}

.card-meta {
  font-size: 13px;
  color: $gray-500;
  margin-bottom: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

// ====== 标签管理 — 可编辑 3 级结构 ======
.action-spacer { flex: 1; }

.text-btn {
  padding: 8px 14px;
  background: none;
  border: none;
  font-size: 13px;
  color: $gray-500;
  cursor: pointer;
  &:hover { color: $primary; }
}

// 统计概览
.tag-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border-radius: $radius-md;
  font-size: 13px;
  color: $gray-600;
}

.stat-icon { font-size: 18px; }
.stat-num { font-weight: bold; color: $gray-800; }
.stat-total {
  background: #FFF5F5;
  color: $primary;
  .stat-num { color: $primary; }
}

// 通用：inline 编辑输入框
.inline-input {
  padding: 4px 8px;
  border: 1px solid $primary;
  border-radius: 4px;
  font-size: inherit;
  outline: none;
  background: white;
}

.editable {
  cursor: text;
  border-bottom: 1px dashed transparent;
  transition: border-color 0.2s;
  &:hover { border-bottom-color: $gray-300; }
}

// 通用：行操作按钮（排序 + 删除）
.row-ops {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin-left: auto;
}

.op-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $gray-200;
  border-radius: 4px;
  background: white;
  font-size: 13px;
  color: $gray-500;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: $primary;
    color: $primary;
    background: #FFF5F5;
  }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
  &.del:hover:not(:disabled) {
    border-color: $danger;
    color: $danger;
    background: #FFEBEE;
  }
  &.sm { width: 22px; height: 22px; font-size: 11px; }
}

.row-ops.compact { gap: 2px; }

// 图标选择器
.icon-picker {
  display: flex;
  gap: 4px;
  background: white;
  padding: 4px;
  border: 1px solid $gray-200;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.icon-choice {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: $gray-100; }
  &.active { background: #FFF5F5; outline: 2px solid $primary; }
}

// 一级：维度
.dim-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dim-block {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
}

.dim-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  transition: background 0.2s;
  &:hover { background: $gray-50; }
}

.dim-expand, .level-expand {
  font-size: 18px;
  color: $gray-400;
  transition: transform 0.2s;
  width: 20px;
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  &.expanded { transform: rotate(90deg); }
}

.dim-icon { font-size: 24px; flex-shrink: 0; }
.dim-name-input { width: 200px; font-size: 16px; font-weight: bold; }
.dim-name { font-size: 16px; font-weight: bold; color: $gray-800; }
.dim-count { font-size: 13px; color: $gray-400; white-space: nowrap; margin-right: 4px; }

// 二级：关注等级
.level-list { border-top: 1px solid $gray-100; }

.level-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 12px 36px;
  transition: background 0.2s;
  &:hover { background: $gray-50; }
}

.level-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.level-name { font-size: 14px; font-weight: 600; color: $gray-700; }
.level-name-input { width: 120px; font-size: 14px; font-weight: 600; }
.level-count { font-size: 12px; color: $gray-400; white-space: nowrap; margin-right: 4px; }

// 三级：指标
.indicator-list {
  background: $gray-50;
  border-top: 1px solid $gray-100;
}

.indicator-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 10px 56px;
  border-bottom: 1px solid $gray-100;
  font-size: 14px;
  &:last-child { border-bottom: none; }
}

.ind-label { flex: 1; color: $gray-700; line-height: 1.4; }
.ind-label-input { flex: 1; font-size: 14px; min-width: 0; }

.ind-points {
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  min-width: 50px;
  text-align: right;
  padding: 2px 4px;
  border-radius: 4px;
  &.positive { color: $success; }
  &.negative { color: $danger; }
}

.points-input {
  width: 60px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

// 添加行
.add-row, .add-level-row {
  padding: 10px 16px 10px 56px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: rgba($primary, 0.05); }
}

.add-level-row { padding-left: 36px; border-top: 1px solid $gray-100; }

.add-row-text {
  font-size: 13px;
  color: $primary;
  font-weight: 500;
}

// 占位区域
.placeholder-section {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: $radius-lg;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.placeholder-text {
  font-size: 18px;
  font-weight: bold;
  color: $gray-700;
  margin-bottom: 10px;
}

.placeholder-desc {
  font-size: 14px;
  color: $gray-400;
}

// 配置中心
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-item {
  padding: 16px 20px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

.setting-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.setting-icon {
  font-size: 28px;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-size: 15px;
  font-weight: 500;
  color: $gray-800;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: $gray-400;
}

.setting-arrow {
  font-size: 24px;
  color: $gray-300;
}
</style>
