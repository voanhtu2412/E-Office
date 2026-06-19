<template>
  <div class="dir-dashboard-page">
    <div class="dir-header-actions">
      <button class="dir-header-btn" @click="openModal('export')">
        <ArrowDownTrayIcon />
        Xuất file
      </button>
      <button class="dir-header-btn dir-header-btn--primary" @click="openModal('sync')">
        <ArrowPathIcon />
        Đồng bộ
      </button>
    </div>

    <!-- ── Stats Row ── -->
    <div class="dir-stats-row" v-if="!isLoading">
      <div class="dir-stat-card">
        <div class="dir-stat-icon-wrap dir-stat-blue">
          <BuildingOfficeIcon />
        </div>
        <div class="dir-stat-info">
          <div class="dir-stat-label">Số lượng phòng ban</div>
          <div class="dir-stat-value">{{ departments.length }}</div>
          <div class="dir-stat-sub">Phòng ban</div>
        </div>
      </div>

      <div class="dir-stat-card">
        <div class="dir-stat-icon-wrap dir-stat-green">
          <UsersIcon />
        </div>
        <div class="dir-stat-info">
          <div class="dir-stat-label">Tổng số nhân viên</div>
          <div class="dir-stat-value">{{ employees.length }}</div>
          <div class="dir-stat-sub">Nhân viên</div>
        </div>
      </div>

      <div class="dir-stat-card">
        <div class="dir-stat-icon-wrap dir-stat-orange">
          <UserIcon />
        </div>
        <div class="dir-stat-info">
          <div class="dir-stat-label">Nam</div>
          <div class="dir-stat-value">{{ countMale }}</div>
          <div class="dir-stat-sub">Nhân viên</div>
        </div>
      </div>

      <div class="dir-stat-card">
        <div class="dir-stat-icon-wrap dir-stat-purple">
          <UserIcon />
        </div>
        <div class="dir-stat-info">
          <div class="dir-stat-label">Nữ</div>
          <div class="dir-stat-value">{{ countFemale }}</div>
          <div class="dir-stat-sub">Nhân viên</div>
        </div>
      </div>

      <div class="dir-stat-card dir-stat-link" @click="openModal('orgChart')">
        <div class="dir-stat-icon-wrap dir-stat-cyan">
          <ShareIcon />
        </div>
        <div class="dir-stat-info">
          <div class="dir-stat-label">Sơ đồ tổ chức</div>
          <div class="dir-stat-subtext">Xem và khám phá<br/>cơ cấu tổ chức công ty</div>
        </div>
      </div>
    </div>
    
    <!-- Loading skeleton for stats -->
    <div class="dir-stats-row" v-else>
      <div v-for="i in 5" :key="i" class="dir-stat-card" style="height: 82px;"></div>
    </div>

    <!-- ── Main Grid ── -->
    <div class="dir-dashboard-grid">
      <!-- Cột Trái: Danh sách phòng ban -->
      <div class="dir-card">
        <div class="dir-card-header">
          <h2 class="dir-card-title">Danh sách phòng ban</h2>
        </div>
        <div class="dir-card-body">
          <div class="dir-dept-item" :class="{'dir-dept-active': activeDept === 'all'}" @click="activeDept = 'all'">
            <span>Tất cả phòng ban</span>
            <span class="dir-dept-count">{{ employees.length }}</span>
          </div>
          <div v-for="dept in filteredDepartments" :key="dept.id" 
               class="dir-dept-item" :class="{'dir-dept-active': activeDept === dept.id}" 
               @click="activeDept = dept.id">
            <span>{{ dept.name }}</span>
            <span class="dir-dept-count">{{ getEmployeeCountByDept(dept.id) }}</span>
          </div>
        </div>
        <div class="dir-card-footer dir-card-footer-center">
          <button class="dir-link-btn" @click="resetFilters">Xem tất cả phòng ban</button>
        </div>
      </div>

      <!-- Cột Giữa: Danh sách nhân viên -->
      <div class="dir-card" style="position: relative;">
        <div v-if="isLoading" class="dir-loader-wrap">
          <div class="dir-spinner"></div>
        </div>

        <div class="dir-card-header">
          <h2 class="dir-card-title">Danh sách cán bộ nhân viên</h2>
          <div class="dir-filter-group">
            <div class="dir-search-box">
              <MagnifyingGlassIcon class="dir-search-icon" />
              <input type="text" placeholder="Tìm kiếm nhân viên, SĐT..." v-model="empSearch" class="dir-search-input" />
            </div>
            <select class="dir-filter-select" v-model="activeDept">
              <option value="all">Tất cả phòng ban</option>
              <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
            <select class="dir-filter-select" v-model="activeStatus">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="on_leave">Nghỉ phép</option>
            </select>
          </div>
        </div>

        <div class="dir-table-container">
          <table class="dir-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Chức danh</th>
                <th>Phòng ban</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th style="text-align: center;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(emp, index) in paginatedEmployees" :key="emp.id" @click="openModal('employeeDetail', emp.id)">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <div class="dir-emp-cell">
                    <img :src="emp.avatar" class="dir-emp-avatar" />
                    <span class="dir-emp-name">{{ emp.fullName }}</span>
                  </div>
                </td>
                <td>{{ emp.position }}</td>
                <td>{{ getDeptName(emp.departmentId) }}</td>
                <td>{{ emp.phone }}</td>
                <td>{{ emp.email }}</td>
                <td style="text-align: center;">
                  <div class="dir-emp-actions">
                    <button class="dir-action-btn" @click.stop="openModal('employeeDetail', emp.id)">
                      <UserIcon /> Hồ sơ
                    </button>
                    <button class="dir-action-btn" @click.stop="shareContact(emp)">
                      <IdentificationIcon /> Danh thiếp
                    </button>
                    <a :href="`tel:${emp.phone}`" class="dir-action-btn dir-action-btn-primary" @click.stop>
                      <PhoneIcon /> Liên hệ
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="dir-card-footer dir-pagination">
          <div>Hiển thị {{ paginationStart }} - {{ paginationEnd }} trên {{ filteredEmployees.length }} nhân viên</div>
          <div class="dir-page-controls">
            <button class="dir-page-btn" :disabled="currentPage === 1" @click="currentPage--"><ChevronLeftIcon /></button>
            <button v-for="page in totalPages" :key="page" class="dir-page-btn" :class="{'dir-page-active': page === currentPage}" @click="currentPage = page">{{ page }}</button>
            <button class="dir-page-btn" :disabled="currentPage === totalPages" @click="currentPage++"><ChevronRightIcon /></button>
          </div>
        </div>
      </div>

      <!-- Cột Phải: Org chart mini & Search -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="dir-card" style="flex: 1;">
          <div class="dir-card-header">
            <h2 class="dir-card-title">Sơ đồ tổ chức</h2>
          </div>
          <div class="dir-card-body dir-org-mini">
            <div class="dir-org-node dir-org-root">
              <UserIcon /> Ban Giám đốc
            </div>
            <div class="dir-org-line-v"></div>
            <div class="dir-org-line-h"></div>
            <div class="dir-org-row">
              <div class="dir-org-node dir-org-green"><UserIcon /> Khối Kinh doanh</div>
              <div class="dir-org-node dir-org-orange"><UserIcon /> Khối Hỗ trợ</div>
            </div>
          </div>
          <div class="dir-card-footer dir-card-footer-center">
            <button class="dir-link-btn" @click="openModal('orgChart')">Xem sơ đồ tổ chức</button>
          </div>
        </div>

        <!-- Quản lý & Tiện ích -->
        <div class="dir-card" style="padding: 20px;">
          <h2 class="dir-card-title" style="margin-bottom: 16px;">Quản lý & Tiện ích</h2>
          <div>
            <button class="dir-util-btn" @click="openModal('groups')">
              <div class="dir-util-icon dir-stat-blue"><UserGroupIcon /></div>
              <div>
                <div class="dir-util-title">Nhóm liên hệ</div>
                <div class="dir-util-desc">Quản lý các nhóm làm việc chung</div>
              </div>
            </button>
            <button class="dir-util-btn" @click="openModal('businessCard')">
              <div class="dir-util-icon dir-stat-orange"><IdentificationIcon /></div>
              <div>
                <div class="dir-util-title">Danh thiếp điện tử</div>
                <div class="dir-util-desc">Mã QR và vCard cá nhân</div>
              </div>
            </button>
            <button class="dir-util-btn" @click="openModal('history')">
              <div class="dir-util-icon" style="background:#eef2ff;color:#4f46e5;"><ClockIcon /></div>
              <div>
                <div class="dir-util-title">Nhật ký hoạt động</div>
                <div class="dir-util-desc">Theo dõi lịch sử tương tác</div>
              </div>
            </button>
            <button class="dir-util-btn" @click="openModal('permission')">
              <div class="dir-util-icon dir-stat-purple"><ShieldCheckIcon /></div>
              <div>
                <div class="dir-util-title">Phân quyền hiển thị</div>
                <div class="dir-util-desc">Cấu hình xem dữ liệu</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <BaseDirectoryModal :model-value="activeModal === 'export'" size="lg" title="Xuất & chia sẻ dữ liệu" @close="closeModal">
      <ExportData v-if="activeModal === 'export'" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'sync'" size="xl" title="Đồng bộ dữ liệu" @close="closeModal">
      <SyncData v-if="activeModal === 'sync'" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'orgChart'" size="xl" title="Sơ đồ tổ chức" @close="closeModal">
      <OrganizationChart v-if="activeModal === 'orgChart'" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'groups'" size="lg" title="Nhóm liên hệ" @close="closeModal">
      <ContactGroups v-if="activeModal === 'groups'" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'employeeDetail'" size="lg" title="Hồ sơ nhân viên" @close="closeModal">
      <EmployeeDetail v-if="activeModal === 'employeeDetail'" :employee-id="selectedEmployeeId" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'businessCard'" size="md" title="Danh thiếp điện tử" @close="closeModal">
      <BusinessCard v-if="activeModal === 'businessCard'" :employee-id="selectedEmployeeId" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'history'" size="xl" title="Nhật ký hoạt động" @close="closeModal">
      <ContactHistory v-if="activeModal === 'history'" @close="closeModal" />
    </BaseDirectoryModal>

    <BaseDirectoryModal :model-value="activeModal === 'permission'" size="xl" title="Phân quyền hiển thị" @close="closeModal">
      <Permission v-if="activeModal === 'permission'" @close="closeModal" />
    </BaseDirectoryModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseDirectoryModal from '@/components/directory/BaseDirectoryModal.vue'

import ExportData from '@/components/directory/ExportData.vue'
import SyncData from '@/components/directory/SyncData.vue'
import OrganizationChart from '@/components/directory/OrganizationChart.vue'
import ContactGroups from '@/components/directory/ContactGroups.vue'
import EmployeeDetail from '@/components/directory/EmployeeDetail.vue'
import BusinessCard from '@/components/directory/BusinessCard.vue'
import ContactHistory from '@/components/directory/ContactHistory.vue'
import Permission from '@/components/directory/Permission.vue'
import {
  BuildingOfficeIcon,
  UsersIcon,
  UserIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  UserGroupIcon,
  IdentificationIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { storeToRefs } from 'pinia'

const store = useDirectoryStore()

// Lấy state từ store
const { employees, departments, isLoading, activeModal, selectedEmployeeId } = storeToRefs(store)

const openModal = (modalName, id = null) => {
  store.openModal(modalName, id)
}

const closeModal = () => {
  store.closeModal()
}

const shareContact = (emp) => {
  if (!emp) return
  openModal('businessCard', emp.id)
}

onMounted(async () => {
  await store.ensureDirectoryDataLoaded()
})

// Stats Computations (Mock gender allocation cho đủ UI)
const countMale = computed(() => Math.floor(employees.value.length * 0.55))
const countFemale = computed(() => employees.value.length - countMale.value)

// Department List
const filteredDepartments = computed(() => {
  return departments.value
})

const getEmployeeCountByDept = (deptId) => {
  return employees.value.filter(e => e.departmentId === deptId).length
}

// Employee Table
const empSearch = ref('')
const activeDept = ref('all')
const activeStatus = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(12) // Changed to 10 as per UI default

watch([itemsPerPage, empSearch, activeDept, activeStatus], () => {
  currentPage.value = 1
})

const resetFilters = () => {
  activeDept.value = 'all'
  activeStatus.value = 'all'
  empSearch.value = ''
  currentPage.value = 1
}

const filteredEmployees = computed(() => {
  let result = employees.value

  if (activeDept.value !== 'all') {
    result = result.filter(e => e.departmentId === activeDept.value)
  }

  if (activeStatus.value !== 'all') {
    result = result.filter(e => e.status === activeStatus.value)
  }

  if (empSearch.value) {
    const q = empSearch.value.toLowerCase()
    result = result.filter(e => 
      e.fullName.toLowerCase().includes(q) || 
      e.email.toLowerCase().includes(q) || 
      e.phone.includes(q)
    )
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / itemsPerPage.value) || 1)

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredEmployees.value.slice(start, start + itemsPerPage.value)
})

const paginationStart = computed(() => filteredEmployees.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredEmployees.value.length))

const getDeptName = (id) => {
  const d = departments.value.find(d => d.id === id)
  return d ? d.name : '—'
}

</script>

<style src="@/assets/directory/directory-style.css"></style>
