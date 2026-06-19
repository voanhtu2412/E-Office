/**
 * modules/directory/composables/useDirectory.js
 *
 * Composable layer cho module Danh bạ.
 * Wrap store actions và cung cấp reactive logic cho từng use case.
 *
 * Quy tắc sử dụng:
 * - View chỉ import từ composable này, không import store trực tiếp.
 * - Mỗi exported function phục vụ một use case cụ thể.
 */

import { ref, computed, watch, onMounted, isRef } from 'vue'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { getEmployeeById, getContactHistory } from '@/modules/directory/directoryService.js'

// ── useEmployeeList ────────────────────────────────────────────
/**
 * Composable cho trang danh sách nhân viên.
 * Tự động fetch khi mounted nếu store chưa có data.
 *
 * @returns {{
 *   employees: import('vue').ComputedRef,
 *   isLoading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   departments: import('vue').ComputedRef,
 *   searchQuery: import('vue').ComputedRef,
 *   activeCount: import('vue').ComputedRef,
 *   setSearch: (q: string) => void,
 *   setDepartment: (id: string) => void,
 *   setStatus: (s: string) => void,
 *   resetFilters: () => void,
 *   reload: () => void,
 * }}
 */
export function useEmployeeList() {
  const store = useDirectoryStore()

  onMounted(async () => {
    await store.ensureDirectoryDataLoaded()
  })

  return {
    employees: computed(() => store.filteredEmployees),
    departments: computed(() => store.departments),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    searchQuery: computed(() => store.searchQuery),
    selectedDepartmentId: computed(() => store.selectedDepartmentId),
    selectedStatus: computed(() => store.selectedStatus),
    totalEmployees: computed(() => store.employees.length),
    activeCount: computed(() => store.activeEmployeeCount),
    departmentCount: computed(() => store.departmentCount),
    groupCount: computed(() => store.contactGroupCount),
    setSearch: store.setSearchQuery,
    setDepartment: store.setDepartmentFilter,
    setStatus: store.setStatusFilter,
    resetFilters: store.resetFilters,
    reload: () => store.fetchEmployees(),
  }
}

// ── useEmployeeSearch ──────────────────────────────────────────
/**
 * Composable cho trang tìm kiếm nhanh với debounce.
 *
 * @param {number} [debounceMs=300]
 * @returns {{
 *   query: import('vue').Ref<string>,
 *   results: import('vue').ComputedRef,
 *   isLoading: import('vue').Ref<boolean>,
 *   hasResults: import('vue').ComputedRef,
 *   hasSearched: import('vue').Ref<boolean>,
 * }}
 */
export function useEmployeeSearch(debounceMs = 300) {
  const store = useDirectoryStore()
  const query = ref('')
  const hasSearched = ref(false)
  let debounceTimer = null

  onMounted(async () => {
    await store.ensureDirectoryDataLoaded()
  })

  watch(query, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      store.setSearchQuery(val)
      hasSearched.value = val.trim().length > 0
    }, debounceMs)
  })

  return {
    query,
    results: computed(() => store.filteredEmployees),
    isLoading: computed(() => store.isLoading),
    hasResults: computed(() => store.filteredEmployees.length > 0),
    hasSearched,
  }
}

// ── useEmployeeDetail ──────────────────────────────────────────
/**
 * Composable cho trang / modal chi tiết nhân viên.
 *
 * Nhận cả string lẫn Ref<string> / ComputedRef<string>.
 * Khi dùng trong modal (Ref), tự watch và reload khi id thay đổi.
 *
 * @param {string | import('vue').Ref<string>} employeeIdOrRef
 * @returns {{
 *   employee: import('vue').Ref,
 *   department: import('vue').ComputedRef,
 *   contactHistory: import('vue').Ref,
 *   isLoading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 * }}
 */
export function useEmployeeDetail(employeeIdOrRef) {
  const store = useDirectoryStore()
  const employee = ref(null)
  const contactHistory = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const department = computed(() => {
    if (!employee.value) return null
    return store.departmentById(employee.value.departmentId)
  })

  /** Lấy id hiện tại (hỗ trợ cả string lẫn Ref) */
  const getId = () => isRef(employeeIdOrRef) ? employeeIdOrRef.value : employeeIdOrRef

  const load = async () => {
    const id = getId()
    if (!id) return
    isLoading.value = true
    error.value = null
    employee.value = null
    contactHistory.value = []
    try {
      await store.ensureDirectoryDataLoaded()
      const [emp, history] = await Promise.all([
        getEmployeeById(id),
        getContactHistory(id),
      ])
      employee.value = emp
      contactHistory.value = history
      store.selectEmployee(emp)
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(load)

  // Nếu là Ref → watch để reload khi modal chuyển nhân viên
  if (isRef(employeeIdOrRef)) {
    watch(employeeIdOrRef, (newId) => {
      if (newId) load()
    })
  }

  return { employee, department, contactHistory, isLoading, error }
}

// ── useDirectoryStats ──────────────────────────────────────────
/**
 * Composable cho stats bar ở Dashboard.
 */
export function useDirectoryStats() {
  const store = useDirectoryStore()

  onMounted(async () => {
    await store.ensureDirectoryDataLoaded()
  })

  return {
    totalEmployees: computed(() => store.employees.length),
    activeEmployees: computed(() => store.activeEmployeeCount),
    totalDepartments: computed(() => store.departmentCount),
    totalGroups: computed(() => store.contactGroupCount),
    isLoading: computed(() => store.isLoading),
  }
}

// ── usePagination ──────────────────────────────────────────────
/**
 * Generic pagination composable.
 *
 * @template T
 * @param {import('vue').ComputedRef<T[]>} items
 * @param {number} [pageSize=12]
 */
export function usePagination(items, pageSize = 12) {
  const currentPage = ref(1)

  const totalPages = computed(() =>
    Math.ceil(items.value.length / pageSize)
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => goToPage(currentPage.value + 1)
  const prevPage = () => goToPage(currentPage.value - 1)

  // Reset về trang 1 khi items thay đổi
  watch(items, () => { currentPage.value = 1 })

  return {
    currentPage,
    totalPages,
    paginatedItems,
    pageSize,
    total: computed(() => items.value.length),
    goToPage,
    nextPage,
    prevPage,
    hasPrev: computed(() => currentPage.value > 1),
    hasNext: computed(() => currentPage.value < totalPages.value),
  }
}

// ── useContactGroups ───────────────────────────────────────────
/**
 * Composable cho trang nhóm liên hệ.
 */
export function useContactGroups() {
  const store = useDirectoryStore()

  onMounted(async () => {
    await store.ensureDirectoryDataLoaded()
  })

  return {
    groups: computed(() => store.contactGroups),
    isLoading: computed(() => store.isLoading),
    getEmployee: (id) => store.employeeById(id),
  }
}
