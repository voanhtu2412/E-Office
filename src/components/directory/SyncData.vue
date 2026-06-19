<template>
  <div class="dir-sync-wrapper">

    <!-- Status Cards -->
    <div class="dir-sync-status-grid">
      <div class="dir-sync-status-card">
        <div class="dir-sync-status-label">Trạng thái</div>
        <div class="dir-sync-status-value" :class="`dir-sync-status-value--${syncStatus}`">
          {{ SYNC_STATUS_LABEL[syncStatus] }}
        </div>
        <div class="dir-sync-status-sub">Tự động mỗi 24h</div>
        <div class="dir-sync-status-icon-wrap" :class="{'dir-sync-status-icon-wrap--syncing': syncStatus === SYNC_STATUS.SYNCING}">
          <ArrowPathIcon class="dir-sync-icon-lg" :class="{'dir-sync-icon-spin': syncStatus === SYNC_STATUS.SYNCING}" />
        </div>
      </div>
      <div class="dir-sync-status-card">
        <div class="dir-sync-status-label">Lần đồng bộ cuối</div>
        <div class="dir-sync-status-value">{{ lastSyncTime }}</div>
        <div class="dir-sync-status-sub">{{ lastSyncResult }}</div>
      </div>
      <div class="dir-sync-status-card">
        <div class="dir-sync-status-label">Tổng bản ghi</div>
        <div class="dir-sync-status-value">{{ totalRecords }}</div>
        <div class="dir-sync-status-sub">100% khớp dữ liệu gốc</div>
      </div>
      <div class="dir-sync-status-card">
        <div class="dir-sync-status-label">Tần suất tự động</div>
        <div class="dir-sync-status-value">Hàng ngày</div>
        <div class="dir-sync-status-sub">00:00 AM (UTC+7)</div>
      </div>
    </div>

    <!-- Manual Sync Action Panel -->
    <div class="dir-sync-action-panel">
      <div class="dir-sync-action-row">
        <div>
          <label class="dir-sync-scope-label">Chọn nguồn đồng bộ ngay lập tức:</label>
          <div class="dir-sync-scope-options">
            <label v-for="opt in scopeOptions" :key="opt.value" class="dir-sync-scope-option">
              <input type="radio" v-model="selectedScope" :value="opt.value" :disabled="syncStatus === SYNC_STATUS.SYNCING" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>
        <button 
          class="dir-sync-btn-start" 
          :class="{'dir-sync-btn-start--loading': syncStatus === SYNC_STATUS.SYNCING}"
          @click="triggerSync"
          :disabled="syncStatus === SYNC_STATUS.SYNCING"
        >
          <ArrowPathIcon class="dir-sync-icon-md" :class="{'dir-sync-icon-spin': syncStatus === SYNC_STATUS.SYNCING}" />
          {{ syncStatus === SYNC_STATUS.SYNCING ? 'Đang đồng bộ...' : 'Bắt đầu đồng bộ' }}
        </button>
      </div>

      <!-- Progress bar -->
      <div v-if="syncStatus === SYNC_STATUS.SYNCING" class="dir-sync-progress">
        <div class="dir-sync-progress-bar">
          <div class="dir-sync-progress-fill" :style="{ width: `${syncProgress}%` }"></div>
        </div>
        <div class="dir-sync-progress-text">{{ Math.round(syncProgress) }}%</div>
      </div>

      <!-- Result Banner -->
      <div v-if="lastResult && syncStatus === SYNC_STATUS.SUCCESS" class="dir-sync-result dir-sync-result--success">
        <CheckCircleIcon class="dir-sync-icon-md" />
        Đồng bộ thành công lúc {{ formatDate(lastResult.syncedAt) }}. {{ lastResult.synced }} bản ghi được cập nhật.
      </div>
      <div v-if="lastResult && syncStatus === SYNC_STATUS.ERROR" class="dir-sync-result dir-sync-result--error">
        <XCircleIcon class="dir-sync-icon-md" />
        Đồng bộ thất bại: {{ lastResult.error }}
      </div>
    </div>

    <!-- Sync History Table -->
    <div class="dir-sync-history-card">
      <div class="dir-sync-history-header">
        <h3 class="dir-sync-history-title">Lịch sử đồng bộ</h3>
      </div>
      <div class="dir-sync-table-container">
        <table class="dir-sync-table">
          <thead>
            <tr>
              <th>Thời điểm</th>
              <th>Nguồn dữ liệu</th>
              <th>Thông báo</th>
              <th class="dir-sync-text-center">Đồng bộ được</th>
              <th class="dir-sync-text-center">Thất bại</th>
              <th class="dir-sync-text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in syncLogs" :key="log.id">
              <td>{{ log.time }}</td>
              <td>{{ log.scope }}</td>
              <td class="dir-sync-table-msg">{{ log.message || '-' }}</td>
              <td class="dir-sync-text-center dir-sync-text-success">{{ log.synced }}</td>
              <td class="dir-sync-text-center dir-sync-text-error">{{ log.failed }}</td>
              <td class="dir-sync-text-center">
                <span class="dir-sync-badge" :class="log.success ? 'dir-sync-badge--success' : 'dir-sync-badge--error'">
                  {{ log.success ? 'Thành công' : 'Thất bại' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { syncData } from '@/modules/directory/directoryService.js'
import { SYNC_STATUS, SYNC_STATUS_LABEL } from '@/modules/directory/constants/status.js'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'

const store = useDirectoryStore()

onMounted(async () => {
  await store.ensureDirectoryDataLoaded()
})

const syncStatus = ref(SYNC_STATUS.IDLE)
const syncProgress = ref(0)
const lastResult = ref(null)
const selectedScope = ref('hrm')
const emit = defineEmits(['close'])

const lastSyncTime = ref('18/12/2024 00:00')
const lastSyncResult = ref('20 bản ghi thành công')
const totalRecords = ref(20)

const scopeOptions = [
  { value: 'hrm', label: 'Hệ thống HRM (Hồ sơ nhân sự)' },
  { value: 'erp', label: 'Hệ thống ERP (Cơ cấu tổ chức)' },
  { value: 'google_workspace', label: 'Google Workspace (Email, Avatar)' },
]

const syncLogs = ref([
  { id: 1, time: '18/12/2024 00:00', scope: 'Hệ thống HRM (Hồ sơ nhân sự)', synced: 20, failed: 0, success: true, message: 'Đồng bộ hồ sơ nhân sự thành công' },
  { id: 2, time: '17/12/2024 00:00', scope: 'Hệ thống ERP (Cơ cấu tổ chức)', synced: 19, failed: 1, success: true, message: 'Đồng bộ phòng ban và chức vụ thành công' },
  { id: 3, time: '16/12/2024 00:00', scope: 'Google Workspace (Email, Avatar)', synced: 20, failed: 0, success: true, message: 'Đồng bộ email và avatar thành công' },
  { id: 4, time: '15/12/2024 06:30', scope: 'Thủ công', synced: 0, failed: 20, success: false, message: 'Đồng bộ thất bại do lỗi kết nối' },
  { id: 5, time: '15/12/2024 00:00', scope: 'Hệ thống HRM (Hồ sơ nhân sự)', synced: 18, failed: 2, success: true, message: 'Đồng bộ hồ sơ nhân sự thành công' },
])

const formatDate = (iso) => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('vi-VN')
}

const triggerSync = async () => {
  syncStatus.value = SYNC_STATUS.SYNCING
  syncProgress.value = 0
  lastResult.value = null

  const timer = setInterval(() => {
    syncProgress.value = Math.min(syncProgress.value + Math.random() * 20, 95)
  }, 200)

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (Math.random() < 0.1) {
      throw new Error('Mất kết nối đến server nguồn, vui lòng thử lại sau.')
    }

    const result = await syncData(selectedScope.value)
    clearInterval(timer)
    syncProgress.value = 100
    lastResult.value = result
    syncStatus.value = SYNC_STATUS.SUCCESS
    lastSyncTime.value = formatDate(result.syncedAt)
    lastSyncResult.value = `${result.synced} bản ghi thành công`
    totalRecords.value = result.synced

    const scopeLabel = scopeOptions.find(o => o.value === selectedScope.value)?.label || 'Thủ công'
    syncLogs.value.unshift({
      id: Date.now(),
      time: lastSyncTime.value,
      scope: scopeLabel,
      synced: result.synced,
      failed: 0,
      success: true,
      message: `Đồng bộ ${scopeLabel.toLowerCase()} thành công`
    })
  } catch (e) {
    clearInterval(timer)
    lastResult.value = { success: false, error: e.message, syncedAt: new Date().toISOString() }
    syncStatus.value = SYNC_STATUS.ERROR
    
    const scopeLabel = scopeOptions.find(o => o.value === selectedScope.value)?.label || 'Thủ công'
    syncLogs.value.unshift({
      id: Date.now(),
      time: formatDate(lastResult.value.syncedAt),
      scope: scopeLabel,
      synced: 0,
      failed: 1,
      success: false,
      message: `Đồng bộ thất bại: ${e.message}`
    })
  }
  
  setTimeout(() => { 
    if (syncStatus.value === SYNC_STATUS.SUCCESS) syncStatus.value = SYNC_STATUS.IDLE; 
    syncProgress.value = 0 
  }, 5000)
}
</script>

<style scoped>
.dir-sync-wrapper {
  padding: 10px;
}

/* Status Grid */
.dir-sync-status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
@media (max-width: 768px) {
  .dir-sync-status-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .dir-sync-status-grid { grid-template-columns: 1fr; }
}

.dir-sync-status-card {
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.dir-sync-status-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 8px;
}

.dir-sync-status-value {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}
.dir-sync-status-value--syncing { color: #2563eb; }
.dir-sync-status-value--success { color: #16a34a; }
.dir-sync-status-value--error   { color: #dc2626; }

.dir-sync-status-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.dir-sync-status-icon-wrap {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.08;
  color: #0f172a;
}
.dir-sync-status-icon-wrap--syncing { opacity: 0.15; color: #2563eb; }

/* Action Panel */
.dir-sync-action-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.dir-sync-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.dir-sync-scope-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 12px;
  display: block;
}

.dir-sync-scope-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.dir-sync-scope-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
}

.dir-sync-btn-start {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.dir-sync-btn-start:hover:not(:disabled) { background: #1d4ed8; }
.dir-sync-btn-start--loading { background: #93c5fd; cursor: not-allowed; }

/* Progress */
.dir-sync-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}
.dir-sync-progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}
.dir-sync-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 4px;
  transition: width 0.3s ease;
}
.dir-sync-progress-text {
  font-size: 13px;
  font-weight: 600;
  color: #2563eb;
  min-width: 40px;
  text-align: right;
}

/* Result banner */
.dir-sync-result {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}
.dir-sync-result--success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.dir-sync-result--error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Table */
.dir-sync-history-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.dir-sync-history-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.dir-sync-history-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dir-sync-table-container {
  overflow-x: auto;
}

.dir-sync-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.dir-sync-table th {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.dir-sync-table td {
  padding: 12px 16px;
  font-size: 13px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}

.dir-sync-table tr:last-child td {
  border-bottom: none;
}

.dir-sync-table tr:hover td {
  background: #f8fafc;
}

.dir-sync-table-msg {
  color: #64748b;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-sync-text-center { text-align: center; }
.dir-sync-text-success { color: #16a34a; font-weight: 600; }
.dir-sync-text-error { color: #dc2626; font-weight: 600; }

.dir-sync-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.dir-sync-badge--success { background: #f0fdf4; color: #16a34a; }
.dir-sync-badge--error { background: #fef2f2; color: #dc2626; }

/* Icons */
.dir-sync-icon-md { width: 20px; height: 20px; flex-shrink: 0; }
.dir-sync-icon-lg { width: 48px; height: 48px; flex-shrink: 0; }
.dir-sync-icon-spin { animation: dir-spin 1s linear infinite; }
@keyframes dir-spin { to { transform: rotate(360deg); } }

/* Dark mode */
html[data-theme="dark"] .dir-sync-status-card,
html[data-theme="dark"] .dir-sync-history-card {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-sync-status-label,
html[data-theme="dark"] .dir-sync-status-sub,
html[data-theme="dark"] .dir-sync-table-msg,
html[data-theme="dark"] .dir-sync-scope-option {
  color: #94a3b8;
}
html[data-theme="dark"] .dir-sync-status-value,
html[data-theme="dark"] .dir-sync-history-title,
html[data-theme="dark"] .dir-sync-scope-label {
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-sync-action-panel {
  background-color: #0f172a;
  border-color: #334155;
}
html[data-theme="dark"] .dir-sync-history-header,
html[data-theme="dark"] .dir-sync-table th {
  background-color: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-sync-table td {
  border-color: #334155;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-sync-table tr:hover td {
  background-color: #334155;
}
html[data-theme="dark"] .dir-sync-result--success,
html[data-theme="dark"] .dir-sync-badge--success {
  background-color: #14532d;
  color: #4ade80;
  border-color: #166534;
}
html[data-theme="dark"] .dir-sync-result--error,
html[data-theme="dark"] .dir-sync-badge--error {
  background-color: #7f1d1d;
  color: #f87171;
  border-color: #991b1b;
}
html[data-theme="dark"] .dir-sync-progress-bar {
  background-color: #334155;
}
html[data-theme="dark"] .dir-sync-status-icon-wrap {
  color: #f8fafc;
  opacity: 0.05;
}
</style>
