<template>
  <div class="dir-org-wrapper">
    <!-- Toolbar -->
    <div class="dir-org-toolbar">

      <div class="dir-org-legend">
        <div class="dir-org-legend-item"><span class="dir-org-legend-dot dir-org-legend-dot--company" />Công ty</div>
        <div class="dir-org-legend-item"><span class="dir-org-legend-dot dir-org-legend-dot--dept" />Phòng ban</div>
        <div class="dir-org-legend-item"><span class="dir-org-legend-dot dir-org-legend-dot--member" />Nhân viên</div>
      </div>
    </div>

    <!-- Org tree & Panel -->
    <div class="dir-org-layout">
      <div class="dir-org-tree-panel">
        <div v-if="isLoading" class="dir-org-loading">
          <svg class="dir-org-spinner" fill="none" viewBox="0 0 24 24">
            <circle class="dir-org-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="dir-org-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p>Đang tải cơ cấu tổ chức...</p>
        </div>

        <OrganizationTree
          v-else
          :nodes="orgChart"
          :is-root="true"
          :expanded-ids="expandedIds"
          :selected-id="selectedNode?.id"
          @toggle="handleToggle"
          @select="handleSelect"
        />
      </div>

      <!-- Detail Panel -->
      <div v-if="selectedNode" class="dir-org-sidebar">
        <div class="dir-org-detail-card">
          <h3 class="dir-org-detail-title">{{ selectedNode.name }}</h3>
          <p class="dir-org-detail-code">{{ selectedNode.code }}</p>
          
          <div class="dir-org-detail-info">
            <div class="dir-org-info-row">
              <span class="dir-org-info-label">Quản lý</span>
              <span class="dir-org-info-value">{{ selectedNodeManager?.fullName || 'Chưa phân bổ' }}</span>
            </div>
            <div class="dir-org-info-row">
              <span class="dir-org-info-label">Tổng nhân sự</span>
              <span class="dir-org-info-value">{{ selectedNode.members?.length || 0 }} người</span>
            </div>
            <div v-if="selectedNode.description" class="dir-org-info-block">
              <span class="dir-org-info-label dir-org-info-label--block">Mô tả</span>
              <span class="dir-org-info-value dir-org-info-value--block">{{ selectedNode.description }}</span>
            </div>
          </div>
        </div>

        <div class="dir-org-members-card">
          <div class="dir-org-members-header">
            <h4 class="dir-org-members-title">Danh sách nhân sự</h4>
          </div>
          <div class="dir-org-members-list">
            <div v-if="!selectedNode.members?.length" class="dir-org-members-empty">
              Không có nhân sự nào trong đơn vị này
            </div>
            <div v-for="emp in selectedNode.members" :key="emp.id" class="dir-org-member-item">
              <img :src="emp.avatar" :alt="emp.fullName" class="dir-org-member-avatar" />
              <div class="dir-org-member-info">
                <a href="#" @click.prevent="openEmployee(emp.id)" class="dir-org-member-name">
                  {{ emp.fullName }}
                </a>
                <div class="dir-org-member-pos">{{ emp.position }}</div>
              </div>
              <a :href="`mailto:${emp.email}`" class="dir-org-member-email-btn" title="Gửi email">
                <svg viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="dir-org-summary">
      <div v-for="dept in deptSummary" :key="dept.id" class="dir-org-summary-item">
        <div class="dir-org-summary-name">{{ dept.name }}</div>
        <div class="dir-org-summary-count">{{ dept.count }} người</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import OrganizationTree from '@/components/directory/OrganizationTree.vue'
import { mockOrgChart } from '@/modules/directory/data/mockOrgChart.js'
import { mockDepartments } from '@/modules/directory/data/mockDepartments.js'
import { mockEmployees } from '@/modules/directory/data/mockEmployees.js'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'

const emit = defineEmits(['close'])
const store = useDirectoryStore()

const isLoading = ref(true)
const orgChart = ref([])
const expandedIds = ref([])
const selectedNode = ref(null)

const selectedNodeManager = computed(() => {
  if (!selectedNode.value || !selectedNode.value.members) return null
  const dept = mockDepartments.find(d => d.id === selectedNode.value.id)
  if (!dept || !dept.managerId) return null
  return selectedNode.value.members.find(m => m.id === dept.managerId)
})

onMounted(async () => {
  await store.ensureDirectoryDataLoaded()
  orgChart.value = mockOrgChart
  expandedIds.value = mockOrgChart.filter(n => n.type === 'company').map(n => n.id)
  isLoading.value = false
})

const deptSummary = computed(() =>
  mockDepartments.map((d) => ({
    id: d.id,
    name: d.name,
    count: mockEmployees.filter((e) => e.departmentId === d.id).length,
  }))
)

const handleToggle = (id) => {
  const index = expandedIds.value.indexOf(id)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(id)
  }
}

const handleSelect = (node) => {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null
  } else {
    selectedNode.value = node
  }
}

const openEmployee = (id) => {
  store.openModal('employeeDetail', id)
}
</script>

<style scoped>
.dir-org-wrapper {
  padding: 10px;
}

.dir-org-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.dir-org-btn-tool {
  font-size: 13px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s;
}
.dir-org-btn-tool:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

.dir-org-legend {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #475569;
}

.dir-org-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dir-org-legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 4px;
}
.dir-org-legend-dot--company { background: #2563eb; }
.dir-org-legend-dot--dept { background: #f8fafc; border: 1px solid #cbd5e1; }
.dir-org-legend-dot--member { background: white; border: 1px solid #e2e8f0; border-radius: 50%; }

.dir-org-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@media (min-width: 1024px) {
  .dir-org-layout { flex-direction: row; }
}

.dir-org-tree-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  flex: 1;
  overflow-x: auto;
  min-height: 600px;
}

.dir-org-sidebar {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 1024px) {
  .dir-org-sidebar { width: 384px; }
}

.dir-org-detail-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.dir-org-detail-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.dir-org-detail-code {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.dir-org-detail-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dir-org-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.dir-org-info-label {
  font-size: 13px;
  color: #64748b;
}

.dir-org-info-value {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.dir-org-info-block {
  padding-bottom: 4px;
}

.dir-org-info-label--block {
  display: block;
  margin-bottom: 4px;
}

.dir-org-info-value--block {
  display: block;
  font-weight: 400;
  color: #334155;
  line-height: 1.5;
}

.dir-org-members-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.dir-org-members-header {
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.dir-org-members-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.dir-org-members-list {
  max-height: 400px;
  overflow-y: auto;
}

.dir-org-members-empty {
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 13px;
}

.dir-org-member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}

.dir-org-member-item:hover {
  background: #f8fafc;
}

.dir-org-member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.dir-org-member-info {
  flex: 1;
  min-width: 0;
}

.dir-org-member-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dir-org-member-name:hover { color: #2563eb; }

.dir-org-member-pos {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.dir-org-member-email-btn {
  padding: 6px;
  color: #94a3b8;
  border-radius: 50%;
  transition: all 0.15s;
}
.dir-org-member-email-btn svg { width: 16px; height: 16px; fill: none; }
.dir-org-member-email-btn:hover { color: #2563eb; background: #eff6ff; }

.dir-org-summary {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.dir-org-summary-item {
  flex: 1;
  min-width: 140px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.dir-org-summary-name {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 6px;
}

.dir-org-summary-count {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

/* Loader */
.dir-org-loading {
  text-align: center;
  padding: 48px 0;
  color: #94a3b8;
}
.dir-org-spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px auto;
  animation: dir-spin 1s linear infinite;
  color: #38bdf8;
}
.dir-org-spinner-circle { opacity: 0.25; }
.dir-org-spinner-path { opacity: 0.75; }
@keyframes dir-spin { to { transform: rotate(360deg); } }

/* Dark mode overrides */
html[data-theme="dark"] .dir-org-tree-panel,
html[data-theme="dark"] .dir-org-detail-card,
html[data-theme="dark"] .dir-org-members-card,
html[data-theme="dark"] .dir-org-summary-item {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-org-btn-tool {
  background-color: #1e293b;
  border-color: #475569;
  color: #e2e8f0;
}
html[data-theme="dark"] .dir-org-btn-tool:hover {
  background-color: #334155;
  border-color: #64748b;
  color: #f8fafc;
}
html[data-theme="dark"] .dir-org-legend,
html[data-theme="dark"] .dir-org-info-label,
html[data-theme="dark"] .dir-org-detail-code,
html[data-theme="dark"] .dir-org-summary-name {
  color: #94a3b8;
}
html[data-theme="dark"] .dir-org-detail-title,
html[data-theme="dark"] .dir-org-info-value,
html[data-theme="dark"] .dir-org-summary-count,
html[data-theme="dark"] .dir-org-member-name {
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-org-members-header {
  background-color: #0f172a;
  border-color: #334155;
}
html[data-theme="dark"] .dir-org-members-title {
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-org-info-row,
html[data-theme="dark"] .dir-org-member-item {
  border-color: #334155;
}
html[data-theme="dark"] .dir-org-member-item:hover {
  background-color: #334155;
}
html[data-theme="dark"] .dir-org-legend-dot--dept {
  background-color: #334155;
  border-color: #475569;
}
html[data-theme="dark"] .dir-org-legend-dot--member {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-org-info-value--block {
  color: #cbd5e1;
}
</style>
