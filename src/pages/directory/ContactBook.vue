<template>
  <div class="dir-cb-wrapper">
    <h1 class="dir-cb-page-title">Danh bạ nhân viên</h1>

    <div class="dir-cb-toolbar">
      <div class="dir-cb-search">
        <div class="dir-cb-search-box">
          <svg class="dir-cb-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" class="dir-cb-search-input" v-model="searchQuery" @input="handleSearch(searchQuery)" placeholder="Tìm kiếm nhân viên, SĐT, Email..." />
        </div>
      </div>

      <div class="dir-cb-filters">
        <select v-model="deptFilter" class="dir-cb-select" @change="handleDeptFilter">
          <option value="">Tất cả phòng ban</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
        </select>
        
        <select v-model="statusFilter" class="dir-cb-select" @change="handleStatusFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang làm việc</option>
          <option value="on_leave">Nghỉ phép</option>
          <option value="inactive">Đã nghỉ việc</option>
        </select>
      </div>

      <div class="dir-cb-count">
        Hiển thị {{ employees.length }} nhân viên
      </div>
    </div>

    <!-- Table content -->
    <div class="dir-cb-card dir-cb-table-wrap">
      <div v-if="isLoading" class="dir-cb-table-loading">
        <div v-for="i in 5" :key="i" class="dir-cb-skeleton-row">
          <div class="dir-cb-skeleton dir-cb-skeleton--avatar"></div>
          <div>
            <div class="dir-cb-skeleton dir-cb-skeleton--line"></div>
            <div class="dir-cb-skeleton dir-cb-skeleton--line-sm"></div>
          </div>
          <div class="dir-cb-skeleton dir-cb-skeleton--line" style="margin-left: 20px"></div>
          <div class="dir-cb-skeleton dir-cb-skeleton--badge" style="margin-left: auto"></div>
        </div>
      </div>
      
      <table v-else class="dir-cb-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Chức vụ</th>
            <th>Phòng ban</th>
            <th>Liên hệ</th>
            <th>Ext</th>
            <th>Trạng thái</th>
            <th class="dir-cb-text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.id" class="dir-cb-tr" @click="$router.push(`/directory/employee/${emp.id}`)">
            <!-- Employee -->
            <td>
              <div class="dir-cb-emp-cell">
                <img :src="emp.avatar" :alt="emp.fullName" class="dir-cb-avatar" />
                <div>
                  <a href="#" class="dir-cb-emp-name" @click.prevent="$router.push(`/directory/employee/${emp.id}`)">{{ emp.fullName }}</a>
                  <div class="dir-cb-emp-email">{{ emp.email }}</div>
                </div>
              </div>
            </td>
            <!-- Position -->
            <td class="dir-cb-td-position">{{ emp.position }}</td>
            <!-- Department -->
            <td>
              <span class="dir-cb-dept-badge">{{ getDeptName(emp.departmentId) }}</span>
            </td>
            <!-- Contact -->
            <td>
              <div class="dir-cb-contact-col">
                <a :href="`tel:${emp.phone}`" class="dir-cb-contact-link" title="Gọi điện" @click.stop>
                  <svg class="dir-cb-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ emp.phone }}
                </a>
                <a :href="`mailto:${emp.email}`" class="dir-cb-contact-link" title="Gửi email" @click.stop>
                  <svg class="dir-cb-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
            </td>
            <!-- Ext -->
            <td class="dir-cb-td-ext">{{ emp.extension || '-' }}</td>
            <!-- Status -->
            <td>
              <span :class="['dir-cb-badge', statusClass(emp.status)]">
                {{ statusLabel(emp.status) }}
              </span>
            </td>
            <!-- Actions -->
            <td class="dir-cb-text-right">
              <div class="dir-cb-emp-actions">
                <button class="dir-cb-action-btn" @click.stop="$router.push(`/directory/employee/${emp.id}`)">
                  <svg class="dir-cb-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> Hồ sơ
                </button>
                <button class="dir-cb-action-btn" @click.stop="shareContact(emp)">
                  <svg class="dir-cb-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg> Danh thiếp
                </button>
                <a :href="`tel:${emp.phone}`" class="dir-cb-action-btn dir-cb-action-btn--primary" @click.stop>
                  <svg class="dir-cb-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> Liên hệ
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeList } from '@/modules/directory/composables/useDirectory.js'
import { EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_CLASS } from '@/modules/directory/constants/status.js'

const router = useRouter()
const {
  employees,
  departments,
  isLoading,
  setSearch,
  setDepartment,
  setStatus,
} = useEmployeeList()

const searchQuery = ref('')
const deptFilter = ref('')
const statusFilter = ref('')

const handleSearch = (q) => setSearch(q)
const handleDeptFilter = () => setDepartment(deptFilter.value)
const handleStatusFilter = () => setStatus(statusFilter.value)

const getDeptName = (id) => {
  const dept = departments.value.find((d) => d.id === id)
  return dept?.name ?? '—'
}

const shareContact = (emp) => {
  if (!emp) return
  router.push(`/directory/business-card?employeeId=${emp.id}`)
}

const statusLabel = (s) => EMPLOYEE_STATUS_LABEL[s] ?? s

const statusClassMap = {
  'bg-emerald-100 text-emerald-700': 'dir-cb-badge--active',
  'bg-amber-100 text-amber-700': 'dir-cb-badge--leave',
  'bg-slate-100 text-slate-700': 'dir-cb-badge--inactive'
}

const statusClass = (s) => {
  const twClass = EMPLOYEE_STATUS_CLASS[s]
  return statusClassMap[twClass] || 'dir-cb-badge--inactive'
}
</script>

<style scoped>
.dir-cb-wrapper {
  padding: 20px;
}

.dir-cb-page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 24px;
  letter-spacing: -0.02em;
}

.dir-cb-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.dir-cb-search { flex: 1; min-width: 200px; max-width: 380px; }

.dir-cb-search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.dir-cb-search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.dir-cb-search-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px 8px 36px;
  font-size: 13px;
  color: #334155;
  outline: none;
  transition: border-color 0.15s;
}

.dir-cb-search-input:focus { border-color: #2563eb; }

html[data-theme="dark"] .dir-cb-search-input {
  background-color: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

.dir-cb-filters {
  display: flex;
  gap: 10px;
}

.dir-cb-count {
  font-size: 13px;
  color: #64748b;
  margin-left: auto;
  font-weight: 500;
}

.dir-cb-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 28px 8px 12px;
  font-size: 13px;
  color: #334155;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%2394a3b8' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E") no-repeat right 8px center / 16px;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}
.dir-cb-select:focus { border-color: #2563eb; }

/* Table wrapper */
.dir-cb-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.dir-cb-table-wrap {
  overflow-x: auto;
}

/* Table */
.dir-cb-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.dir-cb-table th {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.dir-cb-table td {
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.dir-cb-tr {
  cursor: pointer;
  transition: background 0.15s;
}
.dir-cb-tr:hover {
  background: #f8fafc;
}

.dir-cb-text-right {
  text-align: right;
}

/* Employee cell */
.dir-cb-emp-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dir-cb-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #f1f5f9;
  flex-shrink: 0;
  object-fit: cover;
}

.dir-cb-emp-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  display: block;
  transition: color 0.15s;
}
.dir-cb-emp-name:hover { color: #2563eb; }

.dir-cb-emp-email {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.dir-cb-td-position {
  color: #334155;
  font-weight: 500;
}

/* Department badge */
.dir-cb-dept-badge {
  font-size: 12px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
  white-space: nowrap;
}

/* Contact links */
.dir-cb-contact-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dir-cb-contact-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #475569;
  text-decoration: none;
  transition: color 0.15s;
}
.dir-cb-contact-link:hover { color: #2563eb; }

.dir-cb-icon-sm {
  width: 14px;
  height: 14px;
}

.dir-cb-td-ext {
  color: #334155;
  font-weight: 600;
}

/* Status Badge */
.dir-cb-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.dir-cb-badge--active { background: #d1fae5; color: #047857; }
.dir-cb-badge--leave { background: #fef3c7; color: #b45309; }
.dir-cb-badge--inactive { background: #f1f5f9; color: #475569; }

/* Actions */
.dir-cb-emp-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.dir-cb-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}
.dir-cb-action-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.dir-cb-action-btn--primary { color: #2563eb; border-color: #bfdbfe; background: #eff6ff; }
.dir-cb-action-btn--primary:hover { background: #2563eb; border-color: #2563eb; color: white; }

/* Table loading skeleton */
.dir-cb-table-loading { padding: 12px 16px; }
.dir-cb-skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f8fafc;
}

.dir-cb-skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: dir-cb-shimmer 1.5s infinite;
  border-radius: 6px;
}
.dir-cb-skeleton--avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
.dir-cb-skeleton--line { height: 14px; width: 140px; }
.dir-cb-skeleton--line-sm { height: 11px; width: 100px; margin-top: 6px; }
.dir-cb-skeleton--badge { height: 22px; width: 80px; border-radius: 99px; }

@keyframes dir-cb-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Dark mode overrides */
html[data-theme="dark"] .dir-cb-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-cb-count { color: #94a3b8; }
html[data-theme="dark"] .dir-cb-card {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-cb-table th {
  background-color: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-cb-table td { border-color: #334155; }
html[data-theme="dark"] .dir-cb-tr:hover { background-color: #334155; }
html[data-theme="dark"] .dir-cb-emp-name,
html[data-theme="dark"] .dir-cb-td-position,
html[data-theme="dark"] .dir-cb-td-ext { color: #f1f5f9; }
html[data-theme="dark"] .dir-cb-emp-email { color: #94a3b8; }
html[data-theme="dark"] .dir-cb-avatar { border-color: #334155; }
html[data-theme="dark"] .dir-cb-dept-badge {
  background-color: #0f172a;
  color: #94a3b8;
  border-color: #334155;
}
html[data-theme="dark"] .dir-cb-contact-link { color: #cbd5e1; }
html[data-theme="dark"] .dir-cb-contact-link:hover { color: #93c5fd; }
html[data-theme="dark"] .dir-cb-action-btn {
  background-color: #0f172a;
  border-color: #475569;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-cb-action-btn:hover {
  background-color: #334155;
  border-color: #64748b;
  color: #f8fafc;
}
html[data-theme="dark"] .dir-cb-action-btn--primary {
  background-color: #1e3a8a;
  border-color: #1e3a8a;
  color: #60a5fa;
}
html[data-theme="dark"] .dir-cb-action-btn--primary:hover {
  background-color: #1e40af;
  border-color: #1e40af;
}

html[data-theme="dark"] .dir-cb-badge--inactive { background-color: #334155; color: #cbd5e1; }
html[data-theme="dark"] .dir-cb-badge--active { background-color: #064e3b; color: #34d399; }
html[data-theme="dark"] .dir-cb-badge--leave { background-color: #78350f; color: #fbbf24; }
</style>
