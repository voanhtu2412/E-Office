/**
 * modules/directory/services/directoryService.js
 * PROTECTED — Không tự ý thay đổi.
 *
 * Service layer cho module Danh bạ.
 * - Axios instance riêng với baseURL từ env.
 * - Flag USE_MOCK: khi true, tất cả API call sẽ trả về mock data.
 * - Khi BE sẵn sàng, chỉ cần đặt VITE_USE_MOCK=false.
 */

import axios from 'axios'
import { mockEmployees } from './data/mockEmployees.js'
import { mockDepartments } from './data/mockDepartments.js'
import { mockContactGroups } from './data/mockContactGroups.js'

// ── Config ─────────────────────────────────────────────────────
const USE_MOCK = true // import.meta.env.VITE_USE_MOCK === 'true'

/** Giả lập network delay để demo loading state */
const MOCK_DELAY_MS = 600

// ── Axios instance ─────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: inject Authorization token (stub)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Lấy token từ auth store khi BE sẵn sàng
    // const token = authStore.accessToken
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: normalize error format
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Đã xảy ra lỗi'
    return Promise.reject(new Error(message))
  }
)

// ── Mock helper ────────────────────────────────────────────────
/**
 * Trả về mock data sau delay giả lập.
 * @template T
 * @param {T} data
 * @returns {Promise<T>}
 */
const mockResponse = (data) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(data), MOCK_DELAY_MS)
  )

// ── Exported API functions ─────────────────────────────────────

/**
 * Lấy danh sách nhân viên.
 * @param {{ search?: string, departmentId?: string, status?: string, page?: number, pageSize?: number }} params
 * @returns {Promise<import('@/types/employee').Employee[]>}
 */
export const getEmployees = async (params = {}) => {
  if (USE_MOCK) {
    let result = [...mockEmployees]
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q)
      )
    }
    if (params.departmentId) {
      result = result.filter((e) => e.departmentId === params.departmentId)
    }
    if (params.status) {
      result = result.filter((e) => e.status === params.status)
    }
    return mockResponse(result)
  }
  const { data } = await apiClient.get('/employees', { params })
  return data
}

/**
 * Lấy thông tin chi tiết một nhân viên.
 * @param {string} id
 * @returns {Promise<import('@/types/employee').Employee>}
 */
export const getEmployeeById = async (id) => {
  if (USE_MOCK) {
    const employee = mockEmployees.find((e) => e.id === id)
    if (!employee) throw new Error(`Không tìm thấy nhân viên với id: ${id}`)
    return mockResponse(employee)
  }
  const { data } = await apiClient.get(`/employees/${id}`)
  return data
}

/**
 * Lấy danh sách phòng ban.
 * @returns {Promise<import('@/types/department').Department[]>}
 */
export const getDepartments = async () => {
  if (USE_MOCK) return mockResponse([...mockDepartments])
  const { data } = await apiClient.get('/departments')
  return data
}

/**
 * Lấy danh sách nhóm liên hệ.
 * @returns {Promise<import('@/types/contactGroup').ContactGroup[]>}
 */
export const getContactGroups = async () => {
  if (USE_MOCK) return mockResponse([...mockContactGroups])
  const { data } = await apiClient.get('/contact-groups')
  return data
}

/**
 * Lấy lịch sử liên hệ của nhân viên.
 * @param {string} employeeId
 * @returns {Promise<import('@/modules/directory/types').ContactHistoryEntry[]>}
 */
export const getContactHistory = async (employeeId) => {
  if (USE_MOCK) {
    // Tạo danh sách lịch sử đa dạng dựa trên độ dài ID để giả lập sự khác biệt
    const seed = employeeId.charCodeAt(employeeId.length - 1)
    const history = [
      { id: `h-${employeeId}-1`, employeeId, type: 'meeting', note: 'Họp review dự án ERP Q4. Thống nhất timeline và phân công nhiệm vụ cho từng thành viên.', createdAt: '2024-12-10T09:00:00.000Z', createdBy: 'emp-001', createdByName: 'Nguyễn Minh Tuấn' },
      { id: `h-${employeeId}-2`, employeeId, type: 'email', note: 'Gửi báo cáo tiến độ tháng. Đính kèm tài liệu kỹ thuật và kết quả kiểm thử.', createdAt: '2024-11-29T14:30:00.000Z', createdBy: 'emp-004', createdByName: 'Phạm Thanh Long' },
      { id: `h-${employeeId}-3`, employeeId, type: 'call', note: 'Gọi điện trao đổi về yêu cầu thay đổi module phân quyền. Xác nhận sẽ cập nhật spec trong tuần này.', createdAt: '2024-11-20T11:15:00.000Z', createdBy: 'emp-002', createdByName: 'Trần Thị Hương' },
      { id: `h-${employeeId}-4`, employeeId, type: 'note', note: 'Ghi chú: Đề xuất cải tiến quy trình onboarding cho nhân viên mới. Cần chuẩn bị slides.', createdAt: '2024-11-15T16:00:00.000Z', createdBy: 'emp-012', createdByName: 'Phan Thị Thu Hiền' },
      { id: `h-${employeeId}-5`, employeeId, type: 'meeting', note: 'Đánh giá hiệu suất quý. Kết quả: Tốt. Đề xuất tham gia khóa học nâng cao kỹ năng.', createdAt: '2024-10-05T10:00:00.000Z', createdBy: 'emp-012', createdByName: 'Phan Thị Thu Hiền' },
    ]
    
    if (seed % 2 === 0) {
      history.unshift({ id: `h-${employeeId}-6`, employeeId, type: 'email', note: 'Phản hồi về tài liệu thiết kế. Yêu cầu bổ sung phần bảo mật API.', createdAt: '2024-12-15T10:00:00.000Z', createdBy: 'emp-003', createdByName: 'Lê Hoàng Hải' })
    } else {
      history.unshift({ id: `h-${employeeId}-7`, employeeId, type: 'call', note: 'Gọi nhắc nhở deadline nộp báo cáo chi phí công tác.', createdAt: '2024-12-18T15:45:00.000Z', createdBy: 'emp-010', createdByName: 'Nguyễn Thanh Tùng' })
    }

    return mockResponse(history)
  }
  const { data } = await apiClient.get(`/employees/${employeeId}/history`)
  return data
}

/**
 * Kích hoạt đồng bộ dữ liệu với hệ thống HRM.
 * @returns {Promise<import('@/modules/directory/types').SyncResult>}
 */
export const syncData = async () => {
  if (USE_MOCK) {
    return mockResponse({
      success: true,
      synced: 20,
      failed: 0,
      syncedAt: new Date().toISOString(),
      error: null,
    })
  }
  const { data } = await apiClient.post('/sync')
  return data
}

/**
 * Xuất dữ liệu nhân viên.
 * @param {import('@/modules/directory/types').ExportOptions} options
 * @returns {Promise<{ downloadUrl: string }>}
 */
export const exportData = async (options) => {
  if (USE_MOCK) {
    return mockResponse({ downloadUrl: '#mock-download-url' })
  }
  const { data } = await apiClient.post('/export', options)
  return data
}
