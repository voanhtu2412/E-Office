<template>
  <div class="dir-ed-wrapper">
    <!-- Loading state -->
    <div v-if="isLoading" class="dir-ed-loading">
      <div class="dir-ed-skeleton-profile">
        <div class="dir-ed-skeleton dir-ed-skeleton--avatar-lg" />
        <div>
          <div class="dir-ed-skeleton dir-ed-skeleton--title" />
          <div class="dir-ed-skeleton dir-ed-skeleton--subtitle" />
        </div>
      </div>
      <div class="dir-ed-skeleton-grid">
        <div v-for="i in 6" :key="i" class="dir-ed-skeleton dir-ed-skeleton--field" />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="dir-ed-empty">
      <p class="dir-ed-error-text">{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="employee">
      <!-- Profile hero -->
      <div class="dir-ed-card dir-ed-hero">
        <div class="dir-ed-hero-left">
          <div class="dir-ed-avatar-wrap">
            <img :src="employee.avatar" :alt="employee.fullName" class="dir-ed-avatar" />
            <span :class="['dir-ed-status-dot', statusDotClass]" :title="statusLabel" />
          </div>
          <div>
            <h1 class="dir-ed-name">{{ employee.fullName }}</h1>
            <div class="dir-ed-position">{{ employee.position }}</div>
            <div class="dir-ed-dept" v-if="department">
              <svg class="dir-ed-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
              {{ department.name }}
            </div>
          </div>
        </div>
        <div class="dir-ed-hero-right">
          <span :class="['dir-ed-badge', statusBadgeClass]">{{ statusLabel }}</span>
          <div class="dir-ed-actions">
            <a :href="`tel:${employee.phone}`" class="dir-ed-action-btn dir-ed-action-btn--primary">
              <svg class="dir-ed-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Gọi điện
            </a>
            <a :href="`mailto:${employee.email}`" class="dir-ed-action-btn">
              <svg class="dir-ed-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Gửi email
            </a>
            <button class="dir-ed-action-btn" @click="shareContact">
              <svg class="dir-ed-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>

      <!-- Detail sections -->
      <div class="dir-ed-grid">
        <!-- Contact info -->
        <div class="dir-ed-card">
          <h2 class="dir-ed-section-title">Thông tin liên hệ</h2>
          <div class="dir-ed-info-list">
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Số điện thoại</span>
              <a :href="`tel:${employee.phone}`" class="dir-ed-info-value dir-ed-link">{{ employee.phone }}</a>
            </div>
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Máy lẻ</span>
              <span class="dir-ed-info-value dir-ed-font-medium">{{ employee.extension || '—' }}</span>
            </div>
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Email</span>
              <a :href="`mailto:${employee.email}`" class="dir-ed-info-value dir-ed-link">{{ employee.email }}</a>
            </div>
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Vị trí ngồi</span>
              <span class="dir-ed-info-value">{{ employee.seat || 'Chưa phân bổ' }}</span>
            </div>
          </div>
        </div>

        <!-- Work info -->
        <div class="dir-ed-card">
          <h2 class="dir-ed-section-title">Thông tin công việc</h2>
          <div class="dir-ed-info-list">
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Ngày vào làm</span>
              <span class="dir-ed-info-value">{{ formatDate(employee.joinDate) }}</span>
            </div>
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Trạng thái</span>
              <span :class="['dir-ed-badge', statusBadgeClass]">{{ statusLabel }}</span>
            </div>
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Quản lý trực tiếp</span>
              <button v-if="manager" @click="openManagerModal(manager.id)" class="dir-ed-info-value dir-ed-link dir-ed-text-left">
                {{ manager.fullName }}
              </button>
              <span v-else class="dir-ed-info-value">Không có</span>
            </div>
            <div class="dir-ed-info-item">
              <span class="dir-ed-info-label">Nhân sự cấp dưới</span>
              <span class="dir-ed-info-value">{{ subordinates.length }} người</span>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div class="dir-ed-card dir-ed-bio-card">
          <h2 class="dir-ed-section-title">Giới thiệu</h2>
          <p class="dir-ed-bio-text">{{ employee.bio }}</p>

          <hr class="dir-ed-divider" />

          <h2 class="dir-ed-section-title">Lịch sử liên hệ gần đây</h2>
          <div class="dir-ed-history">
            <div v-for="entry in contactHistory.slice(0, 3)" :key="entry.id" class="dir-ed-history-item">
              <div :class="['dir-ed-history-dot', `dir-ed-history-dot--${entry.type}`]" />
              <div class="dir-ed-history-content">
                <div class="dir-ed-history-note">{{ entry.note }}</div>
                <div class="dir-ed-history-meta">{{ entry.createdByName }} · {{ formatDateShort(entry.createdAt) }}</div>
              </div>
            </div>
          </div>
          <button @click="openHistoryModal" class="dir-ed-view-all">Xem toàn bộ lịch sử →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeDetail } from '@/services/directory/composables/useDirectory.js'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_CLASS } from '@/services/directory/constants/status.js'

const props = defineProps({
  employeeId: { type: String, default: null }
})
const emit = defineEmits(['close'])
const router = useRouter()
const store = useDirectoryStore()

const resolvedId = computed(() => props.employeeId)
const { employee, department, contactHistory, isLoading, error } = useEmployeeDetail(resolvedId)

const manager = computed(() => {
  if (!employee.value || !employee.value.managerId) return null
  return store.employees.find(e => e.id === employee.value.managerId)
})

const subordinates = computed(() => {
  if (!employee.value) return []
  return store.employees.filter(e => e.managerId === employee.value.id)
})

const statusLabel = computed(() =>
  employee.value ? (EMPLOYEE_STATUS_LABEL[employee.value.status] ?? employee.value.status) : ''
)

// Map classes correctly without tailwind
const statusBadgeClassMap = {
  'bg-emerald-100 text-emerald-700': 'dir-ed-badge--active',
  'bg-amber-100 text-amber-700': 'dir-ed-badge--leave',
  'bg-slate-100 text-slate-700': 'dir-ed-badge--inactive'
}
const statusBadgeClass = computed(() => {
  if (!employee.value) return ''
  const twClass = EMPLOYEE_STATUS_CLASS[employee.value.status]
  return statusBadgeClassMap[twClass] || 'dir-ed-badge--inactive'
})

const statusDotClass = computed(() => {
  const s = employee.value?.status
  return s === 'active' ? 'dir-ed-dot--active' : s === 'on_leave' ? 'dir-ed-dot--leave' : 'dir-ed-dot--inactive'
})

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatDateShort = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 0) return 'Hôm nay'
  if (diff === 1) return 'Hôm qua'
  if (diff < 30) return `${diff} ngày trước`
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const shareContact = () => {
  if (!employee.value) return
  store.openModal('businessCard', employee.value.id)
}

const openManagerModal = (managerId) => {
  store.openModal('employeeDetail', managerId)
}

const openHistoryModal = () => {
  store.openModal('history')
}
</script>

<style scoped>
.dir-ed-wrapper {
  padding: 10px;
}

/* Card */
.dir-ed-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

/* Hero */
.dir-ed-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.dir-ed-hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.dir-ed-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.dir-ed-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #f1f5f9;
  object-fit: cover;
}

.dir-ed-status-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
}
.dir-ed-dot--active { background: #10b981; }
.dir-ed-dot--leave { background: #f59e0b; }
.dir-ed-dot--inactive { background: #94a3b8; }

.dir-ed-name {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.dir-ed-position {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  margin-bottom: 6px;
}

.dir-ed-dept {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 500;
}

.dir-ed-hero-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.dir-ed-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.dir-ed-badge--active { background: #d1fae5; color: #047857; }
.dir-ed-badge--leave { background: #fef3c7; color: #b45309; }
.dir-ed-badge--inactive { background: #f1f5f9; color: #475569; }

/* Actions */
.dir-ed-actions {
  display: flex;
  gap: 8px;
}

.dir-ed-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #475569;
  transition: all 0.15s;
  cursor: pointer;
}
.dir-ed-action-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.dir-ed-action-btn--primary { background: #2563eb; border-color: #2563eb; color: white; }
.dir-ed-action-btn--primary:hover { background: #1d4ed8; border-color: #1d4ed8; color: white; }

.dir-ed-icon-sm { width: 14px; height: 14px; }
.dir-ed-icon { width: 16px; height: 16px; }

/* Grid */
.dir-ed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.dir-ed-bio-card {
  grid-column: 1 / -1;
}

.dir-ed-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

/* Info List */
.dir-ed-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dir-ed-info-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f8fafc;
}
.dir-ed-info-item:last-child { border-bottom: none; padding-bottom: 0; }

.dir-ed-info-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.dir-ed-info-value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
  text-align: right;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
}
button.dir-ed-info-value { cursor: pointer; font-family: inherit; }

.dir-ed-link { color: #2563eb; text-decoration: none; }
.dir-ed-link:hover { text-decoration: underline; }
.dir-ed-font-medium { font-weight: 500; }
.dir-ed-text-left { text-align: left; }

/* Bio */
.dir-ed-bio-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.7;
  margin: 0;
}

.dir-ed-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 24px 0;
}

/* History */
.dir-ed-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.dir-ed-history-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.dir-ed-history-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}
.dir-ed-history-dot--meeting { background: #3b82f6; }
.dir-ed-history-dot--email   { background: #10b981; }
.dir-ed-history-dot--call    { background: #f59e0b; }
.dir-ed-history-dot--note    { background: #94a3b8; }

.dir-ed-history-content { flex: 1; min-width: 0; }

.dir-ed-history-note {
  font-size: 14px;
  color: #1e293b;
  line-height: 1.5;
  font-weight: 500;
}

.dir-ed-history-meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.dir-ed-view-all {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.dir-ed-view-all:hover { color: #1d4ed8; text-decoration: underline; }

/* Skeletons & empty */
.dir-ed-empty { text-align: center; padding: 40px; }
.dir-ed-error-text { color: #dc2626; font-weight: 500; }
.dir-ed-skeleton-profile { display: flex; gap: 20px; align-items: center; margin-bottom: 24px; }
.dir-ed-skeleton--avatar-lg { width: 80px; height: 80px; border-radius: 50%; }
.dir-ed-skeleton--title { height: 24px; width: 200px; margin-bottom: 8px; border-radius: 6px; }
.dir-ed-skeleton--subtitle { height: 16px; width: 140px; border-radius: 6px; }
.dir-ed-skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dir-ed-skeleton--field { height: 120px; border-radius: 12px; }

.dir-ed-skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: dir-ed-shimmer 1.5s infinite;
}
@keyframes dir-ed-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

@media (max-width: 768px) {
  .dir-ed-grid { grid-template-columns: 1fr; }
  .dir-ed-hero { flex-direction: column; align-items: flex-start; }
  .dir-ed-hero-right { align-items: flex-start; width: 100%; }
  .dir-ed-actions { flex-wrap: wrap; }
}

/* Dark mode overrides */
html[data-theme="dark"] .dir-ed-card {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-ed-name,
html[data-theme="dark"] .dir-ed-section-title,
html[data-theme="dark"] .dir-ed-info-value,
html[data-theme="dark"] .dir-ed-bio-text,
html[data-theme="dark"] .dir-ed-history-note {
  color: #f1f5f9; /* Sáng rõ */
}
html[data-theme="dark"] .dir-ed-position,
html[data-theme="dark"] .dir-ed-info-label,
html[data-theme="dark"] .dir-ed-history-meta {
  color: #94a3b8;
}
html[data-theme="dark"] .dir-ed-action-btn {
  background-color: #0f172a;
  border-color: #475569;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-ed-action-btn:hover {
  background-color: #334155;
  border-color: #64748b;
  color: #f8fafc;
}
html[data-theme="dark"] .dir-ed-action-btn--primary {
  background-color: #1e3a8a;
  border-color: #1e3a8a;
  color: #60a5fa;
}
html[data-theme="dark"] .dir-ed-action-btn--primary:hover {
  background-color: #1e40af;
  border-color: #1e40af;
}
html[data-theme="dark"] .dir-ed-dept {
  background-color: #1e3a8a;
  border-color: #1e3a8a;
  color: #93c5fd;
}
html[data-theme="dark"] .dir-ed-link, html[data-theme="dark"] .dir-ed-view-all {
  color: #60a5fa;
}
html[data-theme="dark"] .dir-ed-link:hover, html[data-theme="dark"] .dir-ed-view-all:hover {
  color: #93c5fd;
}
html[data-theme="dark"] .dir-ed-avatar {
  border-color: #1e293b;
}
html[data-theme="dark"] .dir-ed-status-dot {
  border-color: #1e293b;
}
html[data-theme="dark"] .dir-ed-section-title,
html[data-theme="dark"] .dir-ed-info-item {
  border-color: #334155;
}
html[data-theme="dark"] .dir-ed-divider {
  border-color: #334155;
}
html[data-theme="dark"] .dir-ed-badge--inactive {
  background-color: #334155;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-ed-badge--active {
  background-color: #064e3b;
  color: #34d399;
}
html[data-theme="dark"] .dir-ed-badge--leave {
  background-color: #78350f;
  color: #fbbf24;
}
</style>
