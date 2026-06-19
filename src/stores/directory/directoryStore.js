/**
 * modules/directory/stores/directoryStore.js
 * PROTECTED — Không tự ý thay đổi.
 *
 * Pinia store cho toàn module Danh bạ.
 * Tất cả state liên quan đến module đều được quản lý tại đây.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getEmployees,
  getDepartments,
  getContactGroups,
} from '../../modules/directory/directoryService.js'

export const useDirectoryStore = defineStore('directory', () => {
  // ── State ────────────────────────────────────────────────────
  /** @type {import('vue').Ref<import('@/types/employee').Employee[]>} */
  const employees = ref([])

  /** @type {import('vue').Ref<import('@/types/department').Department[]>} */
  const departments = ref([])

  /** @type {import('vue').Ref<import('@/types/contactGroup').ContactGroup[]>} */
  const contactGroups = ref([])

  /** @type {import('vue').Ref<import('@/types/employee').Employee|null>} */
  const selectedEmployee = ref(null)

  const activeModal = ref(null)
  const selectedEmployeeId = ref(null)

  /** @type {import('vue').Ref<string>} */
  const searchQuery = ref('')

  /** @type {import('vue').Ref<string>} */
  const selectedDepartmentId = ref('')

  /** @type {import('vue').Ref<string>} */
  const selectedStatus = ref('')

  /** @type {import('vue').Ref<boolean>} */
  const isLoading = ref(false)

  /** @type {import('vue').Ref<string|null>} */
  const error = ref(null)

  /** @type {import('vue').Ref<{ page: number, pageSize: number, total: number }>} */
  const pagination = ref({ page: 1, pageSize: 12, total: 0 })

  // ── Getters ──────────────────────────────────────────────────

  /** Nhân viên đã lọc theo searchQuery, department, status */
  const filteredEmployees = computed(() => {
    let result = employees.value
    const q = searchQuery.value.toLowerCase().trim()

    if (q) {
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q) ||
          (e.phone && e.phone.includes(q)) ||
          (departmentById.value(e.departmentId)?.name || '').toLowerCase().includes(q)
      )
    }

    if (selectedDepartmentId.value) {
      result = result.filter((e) => e.departmentId === selectedDepartmentId.value)
    }

    if (selectedStatus.value) {
      result = result.filter((e) => e.status === selectedStatus.value)
    }

    return result
  })

  /** Tổng số nhân viên đang hoạt động */
  const activeEmployeeCount = computed(
    () => employees.value.filter((e) => e.status === 'active').length
  )

  /** Tổng số phòng ban */
  const departmentCount = computed(() => departments.value.length)

  /** Tổng số nhóm liên hệ */
  const contactGroupCount = computed(() => contactGroups.value.length)

  /**
   * Tìm nhân viên theo ID.
   * @param {string} id
   */
  const employeeById = computed(() => (id) =>
    employees.value.find((e) => e.id === id) ?? null
  )

  /**
   * Tìm phòng ban theo ID.
   * @param {string} id
   */
  const departmentById = computed(() => (id) =>
    departments.value.find((d) => d.id === id) ?? null
  )

  /** Nhân viên thuộc một phòng ban cụ thể */
  const employeesByDepartment = computed(() => (departmentId) =>
    employees.value.filter((e) => e.departmentId === departmentId)
  )

  // ── Actions ──────────────────────────────────────────────────

  /** Tải danh sách nhân viên */
  async function fetchEmployees(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const data = await getEmployees(params)
      employees.value = data
      pagination.value.total = data.length
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /** Tải danh sách phòng ban */
  async function fetchDepartments() {
    try {
      departments.value = await getDepartments()
    } catch (err) {
      console.error('[directoryStore] fetchDepartments error:', err)
    }
  }

  /** Tải danh sách nhóm liên hệ */
  async function fetchContactGroups() {
    try {
      contactGroups.value = await getContactGroups()
    } catch (err) {
      console.error('[directoryStore] fetchContactGroups error:', err)
    }
  }

  let initPromise = null
  /** Khởi tạo toàn bộ dữ liệu module (chỉ fetch những data còn thiếu) */
  async function ensureDirectoryDataLoaded() {
    if (initPromise) return initPromise

    const promises = []
    if (employees.value.length === 0) promises.push(fetchEmployees())
    if (departments.value.length === 0) promises.push(fetchDepartments())
    if (contactGroups.value.length === 0) promises.push(fetchContactGroups())

    if (promises.length > 0) {
      isLoading.value = true
      initPromise = Promise.all(promises).finally(() => {
        isLoading.value = false
        initPromise = null
      })
      await initPromise
    } else {
      return Promise.resolve()
    }
  }

  /** Cập nhật từ khóa tìm kiếm */
  function setSearchQuery(query) {
    searchQuery.value = query
    pagination.value.page = 1
  }

  /** Lọc theo phòng ban */
  function setDepartmentFilter(departmentId) {
    selectedDepartmentId.value = departmentId
    pagination.value.page = 1
  }

  /** Lọc theo trạng thái */
  function setStatusFilter(status) {
    selectedStatus.value = status
    pagination.value.page = 1
  }

  /** Chọn nhân viên để xem chi tiết */
  function selectEmployee(employee) {
    selectedEmployee.value = employee
  }

  /** Reset tất cả bộ lọc */
  function resetFilters() {
    searchQuery.value = ''
    selectedDepartmentId.value = ''
    selectedStatus.value = ''
    pagination.value.page = 1
  }

  /** Xóa thông báo lỗi */
  function clearError() {
    error.value = null
  }

  function openModal(modalName, id = null) {
    activeModal.value = modalName
    if (id !== null) {
      selectedEmployeeId.value = id
    }
  }

  function closeModal() {
    activeModal.value = null
  }

  return {
    // State
    employees,
    departments,
    contactGroups,
    selectedEmployee,
    activeModal,
    selectedEmployeeId,
    searchQuery,
    selectedDepartmentId,
    selectedStatus,
    isLoading,
    error,
    pagination,
    // Getters
    filteredEmployees,
    activeEmployeeCount,
    departmentCount,
    contactGroupCount,
    employeeById,
    departmentById,
    employeesByDepartment,
    // Actions
    fetchEmployees,
    fetchDepartments,
    fetchContactGroups,
    initializeModule: ensureDirectoryDataLoaded,
    ensureDirectoryDataLoaded,
    setSearchQuery,
    setDepartmentFilter,
    setStatusFilter,
    selectEmployee,
    resetFilters,
    clearError,
    openModal,
    closeModal,
  }
})
