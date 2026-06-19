<template>
  <div class="dir-ch-wrapper">
    <!-- Toolbar -->
    <div class="dir-ch-toolbar">
      <div class="dir-ch-filters">
        <select v-model="selectedType" class="dir-ch-select">
          <option value="all">Tất cả hành động</option>
          <option value="view">Xem hồ sơ</option>
          <option value="call">Gọi điện</option>
          <option value="email">Gửi email</option>
          <option value="share">Chia sẻ</option>
          <option value="export">Xuất dữ liệu</option>
          <option value="sync">Đồng bộ</option>
        </select>

        <select v-model="selectedEmpId" class="dir-ch-select">
          <option value="all">Tất cả nhân sự</option>
          <option v-for="emp in allEmployees" :key="emp.id" :value="emp.id">{{ emp.fullName }}</option>
        </select>
      </div>

      <div>
        <button class="dir-ch-btn-demo" @click="generateMockLog">
          <svg class="dir-ch-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Thêm log giả lập (Demo)
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="dir-ch-loading">
      <div class="dir-ch-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Table -->
    <div v-else class="dir-ch-card">
      <div class="dir-ch-table-wrap">
        <table class="dir-ch-table">
          <thead>
            <tr>
              <th class="dir-ch-col-time">Thời gian</th>
              <th>Người thực hiện</th>
              <th class="dir-ch-col-action">Hành động</th>
              <th>Đối tượng</th>
              <th class="dir-ch-col-source">Nguồn</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredLogs" :key="log.id" class="dir-ch-tr">
              <td class="dir-ch-td-time">{{ formatDate(log.createdAt) }}</td>
              <td class="dir-ch-td-actor">
                <img v-if="log.actorAvatar" :src="log.actorAvatar" class="dir-ch-avatar" />
                <div v-else class="dir-ch-avatar dir-ch-avatar--sys">SYS</div>
                {{ log.actorName }}
              </td>
              <td>
                <span :class="['dir-ch-badge', getActionBadgeClass(log.action)]">
                  {{ getActionLabel(log.action) }}
                </span>
              </td>
              <td class="dir-ch-td-target">{{ log.targetName }}</td>
              <td class="dir-ch-td-source">{{ log.source }}</td>
              <td class="dir-ch-td-note" :title="log.note">{{ log.note }}</td>
            </tr>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="6" class="dir-ch-empty">
                <svg class="dir-ch-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Không tìm thấy nhật ký hoạt động nào phù hợp.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { mockEmployees } from '@/services/directory/data/mockEmployees.js'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { storeToRefs } from 'pinia'

const store = useDirectoryStore()
const { employees: allEmployees, isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.ensureDirectoryDataLoaded()
})

const selectedEmpId = ref('all')
const selectedType = ref('all')
const emit = defineEmits(['close'])

const logs = ref([
  {
    id: 'log-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actorName: 'Nguyễn Văn An',
    actorAvatar: mockEmployees[0].avatar,
    action: 'view',
    targetId: 'emp-004',
    targetName: 'Phạm Thanh Long',
    source: 'Web',
    note: 'Xem chi tiết hồ sơ'
  },
  {
    id: 'log-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actorName: 'Nguyễn Văn An',
    actorAvatar: mockEmployees[0].avatar,
    action: 'email',
    targetId: 'emp-002',
    targetName: 'Trần Thị Hương',
    source: 'Web',
    note: 'Mở ứng dụng gửi email qua mailto:'
  },
  {
    id: 'log-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actorName: 'Hệ thống (Auto Sync)',
    actorAvatar: null,
    action: 'sync',
    targetId: 'all',
    targetName: 'Hệ thống HRM',
    source: 'Auto Sync',
    note: 'Đồng bộ tự động hồ sơ nhân sự (20 bản ghi thành công)'
  },
  {
    id: 'log-4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    actorName: 'Lê Minh Quân',
    actorAvatar: mockEmployees[3].avatar,
    action: 'export',
    targetId: 'dept-002',
    targetName: 'Phòng Kỹ thuật',
    source: 'Export API',
    note: 'Xuất danh sách phòng ban ra file Excel'
  },
  {
    id: 'log-5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actorName: 'Trần Thị Hương',
    actorAvatar: mockEmployees[1].avatar,
    action: 'share',
    targetId: 'emp-003',
    targetName: 'Lê Hoàng Hải',
    source: 'Mobile Web',
    note: 'Chia sẻ danh thiếp qua Web Share API'
  }
])

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchType = selectedType.value === 'all' || log.action === selectedType.value
    const matchEmp = selectedEmpId.value === 'all' || log.targetId === selectedEmpId.value || log.actorName.includes(allEmployees.value.find(e => e.id === selectedEmpId.value)?.fullName || '')
    return matchType && matchEmp
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const getActionLabel = (action) => {
  const labels = {
    view: 'Xem hồ sơ',
    call: 'Gọi điện',
    email: 'Gửi email',
    share: 'Chia sẻ',
    export: 'Xuất dữ liệu',
    sync: 'Đồng bộ'
  }
  return labels[action] || action
}

const getActionBadgeClass = (action) => {
  const classes = {
    view: 'dir-ch-badge--view',
    call: 'dir-ch-badge--call',
    email: 'dir-ch-badge--email',
    share: 'dir-ch-badge--share',
    export: 'dir-ch-badge--export',
    sync: 'dir-ch-badge--sync'
  }
  return classes[action] || 'dir-ch-badge--default'
}

const generateMockLog = () => {
  const actions = ['view', 'call', 'email', 'share', 'export', 'sync']
  const randomAction = actions[Math.floor(Math.random() * actions.length)]
  const randomEmp = allEmployees.value[Math.floor(Math.random() * allEmployees.value.length)] || {}
  const randomTarget = allEmployees.value[Math.floor(Math.random() * allEmployees.value.length)] || {}
  
  logs.value.unshift({
    id: 'log-' + Date.now(),
    createdAt: new Date().toISOString(),
    actorName: randomAction === 'sync' ? 'Hệ thống' : randomEmp.fullName,
    actorAvatar: randomAction === 'sync' ? null : randomEmp.avatar,
    action: randomAction,
    targetId: randomAction === 'sync' ? 'all' : randomTarget.id,
    targetName: randomAction === 'sync' ? 'Dữ liệu tổng' : randomTarget.fullName,
    source: randomAction === 'sync' ? 'Auto Sync' : 'Web',
    note: `Thao tác giả lập demo - ${getActionLabel(randomAction)}`
  })
}

</script>

<style scoped>
.dir-ch-wrapper {
  padding: 10px;
}

/* Toolbar */
.dir-ch-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.dir-ch-filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.dir-ch-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #334155;
  background: white;
  outline: none;
  min-width: 180px;
  transition: border-color 0.15s;
}
.dir-ch-select:focus { border-color: #3b82f6; }

.dir-ch-btn-demo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.dir-ch-btn-demo:hover { background: #1d4ed8; }
.dir-ch-icon { width: 16px; height: 16px; }

/* Loading state */
.dir-ch-loading {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  color: #64748b;
}

.dir-ch-spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px auto;
  border: 4px solid #2563eb;
  border-top-color: transparent;
  border-radius: 50%;
  animation: dir-ch-spin 1s linear infinite;
}
@keyframes dir-ch-spin { to { transform: rotate(360deg); } }

/* Table */
.dir-ch-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.dir-ch-table-wrap {
  overflow-x: auto;
}

.dir-ch-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.dir-ch-table th {
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.dir-ch-col-time { width: 160px; }
.dir-ch-col-action { width: 144px; }
.dir-ch-col-source { width: 128px; }

.dir-ch-table td {
  padding: 12px 20px;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
}

.dir-ch-tr {
  transition: background 0.15s;
}
.dir-ch-tr:hover {
  background: #f8fafc;
}
.dir-ch-tr:last-child td {
  border-bottom: none;
}

.dir-ch-td-time { color: #64748b; font-feature-settings: "tnum"; }

.dir-ch-td-actor {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #0f172a;
}

.dir-ch-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  object-fit: cover;
}
.dir-ch-avatar--sys {
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  border: none;
}

.dir-ch-td-target { font-weight: 500; color: #334155; }

.dir-ch-td-source {
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.dir-ch-td-note {
  color: #475569;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badges */
.dir-ch-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
}
.dir-ch-badge--view { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.dir-ch-badge--call { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.dir-ch-badge--email { background: #faf5ff; color: #7e22ce; border-color: #e9d5ff; }
.dir-ch-badge--share { background: #fffbeb; color: #b45309; border-color: #fde68a; }
.dir-ch-badge--export { background: #f1f5f9; color: #334155; border-color: #cbd5e1; }
.dir-ch-badge--sync { background: #eef2ff; color: #4338ca; border-color: #c7d2fe; }
.dir-ch-badge--default { background: #f8fafc; color: #475569; border-color: #e2e8f0; }

/* Empty state */
.dir-ch-empty {
  padding: 48px !important;
  text-align: center;
  color: #64748b;
}
.dir-ch-empty-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px auto;
  color: #cbd5e1;
}

/* Dark mode overrides */
html[data-theme="dark"] .dir-ch-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-ch-btn-demo {
  background-color: #1e3a8a;
  color: #60a5fa;
}
html[data-theme="dark"] .dir-ch-btn-demo:hover {
  background-color: #1e40af;
}
html[data-theme="dark"] .dir-ch-loading,
html[data-theme="dark"] .dir-ch-card {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-ch-table th {
  background-color: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-ch-table td {
  border-color: #334155;
}
html[data-theme="dark"] .dir-ch-tr:hover {
  background-color: #334155;
}
html[data-theme="dark"] .dir-ch-td-time,
html[data-theme="dark"] .dir-ch-td-source {
  color: #94a3b8;
}
html[data-theme="dark"] .dir-ch-td-actor,
html[data-theme="dark"] .dir-ch-td-target {
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-ch-td-note {
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-ch-avatar {
  border-color: #334155;
}
html[data-theme="dark"] .dir-ch-avatar--sys {
  background-color: #334155;
  color: #94a3b8;
}
html[data-theme="dark"] .dir-ch-empty-icon {
  color: #475569;
}

html[data-theme="dark"] .dir-ch-badge--view { background-color: #1e3a8a; color: #93c5fd; border-color: #1e40af; }
html[data-theme="dark"] .dir-ch-badge--call { background-color: #14532d; color: #86efac; border-color: #166534; }
html[data-theme="dark"] .dir-ch-badge--email { background-color: #581c87; color: #d8b4fe; border-color: #6b21a8; }
html[data-theme="dark"] .dir-ch-badge--share { background-color: #78350f; color: #fcd34d; border-color: #92400e; }
html[data-theme="dark"] .dir-ch-badge--export { background-color: #334155; color: #cbd5e1; border-color: #475569; }
html[data-theme="dark"] .dir-ch-badge--sync { background-color: #312e81; color: #a5b4fc; border-color: #3730a3; }
html[data-theme="dark"] .dir-ch-badge--default { background-color: #0f172a; color: #94a3b8; border-color: #334155; }
</style>
