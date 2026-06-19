<template>
  <div class="dir-perm-wrapper">
    <!-- Quick Overview -->
    <div class="dir-perm-overview">
      <div class="dir-perm-overview-icon-wrap">
        <svg class="dir-perm-overview-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
      <div class="dir-perm-overview-text">
        <p class="dir-perm-overview-desc">
          Bảng phân quyền giúp xác định mức độ truy cập dữ liệu của từng vai trò. Chọn vai trò bên dưới để xem trước giao diện của họ. 
          Giả sử người dùng hiện tại thuộc phòng <strong>Kỹ thuật</strong>.
        </p>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="dir-perm-preview-section">
      <div class="dir-perm-preview-header">
        <label class="dir-perm-preview-label">Xem dưới vai trò:</label>
        <select v-model="previewRole" class="dir-perm-select">
          <option value="admin">Quản trị viên (Admin)</option>
          <option value="manager">Quản lý (Manager)</option>
          <option value="staff">Nhân viên (Employee)</option>
          <option value="guest">Khách/Thực tập sinh (Guest)</option>
        </select>
      </div>
      
      <div class="dir-perm-table-card">
         <table class="dir-perm-table">
           <thead>
             <tr>
               <th>Nhân viên</th>
               <th>Phòng ban</th>
               <th>SĐT</th>
               <th>Email</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="emp in previewEmployees" :key="emp.id">
                <td class="dir-perm-emp-name">{{ emp.fullName }}</td>
                <td class="dir-perm-emp-dept">{{ emp.departmentName }}</td>
                <td>
                   <span v-if="emp.canViewPhone" class="dir-perm-visible-text">{{ emp.phone }}</span>
                   <span v-else class="dir-perm-hidden-text">098***{{ emp.phone.slice(-3) }}</span>
                </td>
                <td>
                   <span v-if="emp.canViewEmail" class="dir-perm-visible-text">{{ emp.email }}</span>
                   <span v-else class="dir-perm-hidden-text">***@eoffice.vn</span>
                </td>
             </tr>
             <tr v-if="previewEmployees.length === 0">
                <td colspan="4" class="dir-perm-table-empty">Không có dữ liệu trong phạm vi xem</td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>

    <!-- Permission Matrix -->
    <div class="dir-perm-matrix-card">
      <div class="dir-perm-matrix-header">
        <h3 class="dir-perm-matrix-title">Ma trận phân quyền</h3>
        <p class="dir-perm-matrix-desc">Tổng quan toàn bộ quyền hạn theo từng vai trò</p>
      </div>
      <div class="dir-perm-matrix-table-wrap">
        <table class="dir-perm-table dir-perm-table--matrix">
          <thead>
            <tr>
              <th class="dir-perm-col-scope">Quyền hạn / Scope</th>
              <th class="dir-perm-text-center" v-for="role in roles" :key="role.id">{{ role.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="perm in requiredPermissions" :key="perm.key">
              <td>
                <div class="dir-perm-perm-label">{{ perm.label }}</div>
                <div class="dir-perm-perm-desc">{{ perm.desc }}</div>
              </td>
              <td
                v-for="role in roles"
                :key="role.id"
                class="dir-perm-text-center"
              >
                <div class="dir-perm-check-wrap">
                  <svg
                    v-if="role.permissions.includes(perm.key)"
                    class="dir-perm-icon-check"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg
                    v-else
                    class="dir-perm-icon-cross"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
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
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/services/directory/constants/permissions.js'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { storeToRefs } from 'pinia'

const store = useDirectoryStore()
const { employees: allEmployees, departments, isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.ensureDirectoryDataLoaded()
})

const requiredPermissions = [
  { key: PERMISSIONS.VIEW_ALL_DEPARTMENTS, label: 'Xem toàn bộ nhân sự', desc: 'Được xem dữ liệu của tất cả phòng ban' },
  { key: PERMISSIONS.VIEW_OWN_DEPARTMENT, label: 'Chỉ xem phòng ban', desc: 'Chỉ được xem người cùng phòng ban' },
  { key: PERMISSIONS.VIEW_PHONE_NUMBERS, label: 'Xem số điện thoại', desc: 'Hiển thị SĐT cá nhân' },
  { key: PERMISSIONS.VIEW_EMAIL, label: 'Xem email', desc: 'Hiển thị Email' },
  { key: PERMISSIONS.EXPORT_DATA, label: 'Xuất dữ liệu', desc: 'Xuất danh sách ra file Excel/CSV/PDF' },
  { key: PERMISSIONS.SYNC_DATA, label: 'Đồng bộ dữ liệu', desc: 'Kích hoạt đồng bộ với hệ thống ngoài' },
  { key: PERMISSIONS.MANAGE_GROUPS, label: 'Quản lý nhóm', desc: 'Tạo và quản lý nhóm liên hệ' },
]

const roles = ref([
  { id: 'r-admin', key: 'admin', name: 'Quản trị viên', permissions: ROLE_PERMISSIONS.ADMIN },
  { id: 'r-manager', key: 'manager', name: 'Quản lý', permissions: ROLE_PERMISSIONS.MANAGER },
  { id: 'r-staff', key: 'staff', name: 'Nhân viên', permissions: ROLE_PERMISSIONS.STAFF },
  { id: 'r-guest', key: 'guest', name: 'Thực tập sinh/Guest', permissions: ROLE_PERMISSIONS.GUEST },
])

const previewRole = ref('admin')

const getDepartmentName = (id) => {
  return departments.value.find(d => d.id === id)?.name || ''
}

const CURRENT_USER_DEPT = 'dept-002'

const emit = defineEmits(['close'])

const previewEmployees = computed(() => {
  const roleData = roles.value.find(r => r.key === previewRole.value)
  const perms = roleData ? roleData.permissions : []
  
  const canViewAll = perms.includes(PERMISSIONS.VIEW_ALL_DEPARTMENTS)
  const canViewOwn = perms.includes(PERMISSIONS.VIEW_OWN_DEPARTMENT)
  const canViewPhone = perms.includes(PERMISSIONS.VIEW_PHONE_NUMBERS)
  const canViewEmail = perms.includes(PERMISSIONS.VIEW_EMAIL)
  
  const sampleEmpIds = ['emp-001', 'emp-002', 'emp-003', 'emp-005', 'emp-008']
  let list = allEmployees.value.filter(e => sampleEmpIds.includes(e.id))
  
  if (!canViewAll) {
    if (canViewOwn) {
      list = list.filter(e => e.departmentId === CURRENT_USER_DEPT)
    } else {
      list = []
    }
  }
  
  return list.map(e => ({
    ...e,
    departmentName: getDepartmentName(e.departmentId),
    canViewPhone,
    canViewEmail
  }))
})

</script>

<style scoped>
.dir-perm-wrapper {
  padding: 10px;
}

/* Overview Section */
.dir-perm-overview {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}
@media (max-width: 640px) {
  .dir-perm-overview { flex-direction: column; text-align: center; gap: 16px; padding: 20px; }
}

.dir-perm-overview-icon-wrap {
  flex-shrink: 0;
}

.dir-perm-overview-icon {
  width: 80px; /* Reduced from default to 80px as requested (72px-96px) */
  height: 80px;
  color: #94a3b8;
}

.dir-perm-overview-text {
  flex: 1;
}

.dir-perm-overview-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}
.dir-perm-overview-desc strong {
  color: #0f172a;
  font-weight: 600;
}

/* Preview Section */
.dir-perm-preview-section {
  margin-bottom: 32px;
}

.dir-perm-preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.dir-perm-preview-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.dir-perm-select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  width: 260px;
  background: white;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s;
}
.dir-perm-select:focus { border-color: #3b82f6; }

.dir-perm-table-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

/* Matrix Section */
.dir-perm-matrix-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.dir-perm-matrix-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.dir-perm-matrix-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dir-perm-matrix-desc {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.dir-perm-matrix-table-wrap {
  overflow-x: auto;
}

/* Tables */
.dir-perm-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.dir-perm-table th {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.dir-perm-table td {
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
}

.dir-perm-table tr:last-child td {
  border-bottom: none;
}

.dir-perm-table tbody tr {
  transition: background 0.15s;
}
.dir-perm-table tbody tr:hover {
  background: #f8fafc;
}

.dir-perm-table-empty {
  text-align: center;
  padding: 32px !important;
  color: #64748b;
}

.dir-perm-col-scope {
  width: 280px;
}

.dir-perm-text-center {
  text-align: center;
}

/* Content specific */
.dir-perm-emp-name {
  font-weight: 600;
  color: #0f172a;
}
.dir-perm-emp-dept {
  color: #475569;
}

.dir-perm-visible-text {
  color: #334155;
}
.dir-perm-hidden-text {
  color: #94a3b8;
  user-select: none;
}

.dir-perm-perm-label {
  font-weight: 600;
  color: #0f172a;
}
.dir-perm-perm-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.dir-perm-check-wrap {
  display: flex;
  justify-content: center;
}

.dir-perm-icon-check {
  width: 20px;
  height: 20px;
  color: #22c55e;
}
.dir-perm-icon-cross {
  width: 20px;
  height: 20px;
  color: #cbd5e1;
}

/* Dark mode */
html[data-theme="dark"] .dir-perm-overview {
  background-color: #0f172a;
  border-color: #334155;
}
html[data-theme="dark"] .dir-perm-overview-desc,
html[data-theme="dark"] .dir-perm-emp-dept,
html[data-theme="dark"] .dir-perm-perm-desc {
  color: #94a3b8;
}
html[data-theme="dark"] .dir-perm-overview-desc strong,
html[data-theme="dark"] .dir-perm-preview-label,
html[data-theme="dark"] .dir-perm-emp-name,
html[data-theme="dark"] .dir-perm-perm-label,
html[data-theme="dark"] .dir-perm-matrix-title {
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-perm-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-perm-table-card,
html[data-theme="dark"] .dir-perm-matrix-card {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-perm-matrix-header {
  border-color: #334155;
}
html[data-theme="dark"] .dir-perm-table th {
  background-color: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-perm-table td {
  border-color: #334155;
}
html[data-theme="dark"] .dir-perm-table tbody tr:hover {
  background-color: #334155;
}
html[data-theme="dark"] .dir-perm-visible-text {
  color: #cbd5e1;
}
html[data-theme="dark"] .dir-perm-hidden-text {
  color: #475569;
}
html[data-theme="dark"] .dir-perm-icon-cross {
  color: #475569;
}
</style>
