/**
 * modules/directory/data/mockDepartments.js
 * Dữ liệu phòng ban mẫu cho demo.
 *
 * 6 phòng ban điển hình của doanh nghiệp Việt Nam.
 * parentId = null → root node (Ban Giám đốc).
 * Các phòng khác có parentId = 'dept-bgd'.
 */

/** @type {import('@/types/department').Department[]} */
export const mockDepartments = [
  {
    id: 'dept-bgd',
    name: 'Ban Giám đốc',
    code: 'BGD',
    parentId: null,
    managerId: 'emp-001',
    employeeCount: 3,
    description: 'Lãnh đạo và định hướng chiến lược toàn công ty',
    createdAt: '2020-01-15T00:00:00.000Z',
  },
  {
    id: 'dept-kt',
    name: 'Phòng Kỹ thuật',
    code: 'KT',
    parentId: 'dept-bgd',
    managerId: 'emp-004',
    employeeCount: 7,
    description: 'Phát triển và vận hành các hệ thống phần mềm',
    createdAt: '2020-02-01T00:00:00.000Z',
  },
  {
    id: 'dept-kd',
    name: 'Phòng Kinh doanh',
    code: 'KD',
    parentId: 'dept-bgd',
    managerId: 'emp-008',
    employeeCount: 5,
    description: 'Tìm kiếm và chăm sóc khách hàng, phát triển doanh thu',
    createdAt: '2020-02-01T00:00:00.000Z',
  },
  {
    id: 'dept-ns',
    name: 'Phòng Nhân sự',
    code: 'NS',
    parentId: 'dept-bgd',
    managerId: 'emp-012',
    employeeCount: 3,
    description: 'Tuyển dụng, quản lý nhân sự và phúc lợi',
    createdAt: '2020-02-15T00:00:00.000Z',
  },
  {
    id: 'dept-ktoan',
    name: 'Phòng Kế toán',
    code: 'KToan',
    parentId: 'dept-bgd',
    managerId: 'emp-015',
    employeeCount: 3,
    description: 'Quản lý tài chính, kế toán và kiểm soát ngân sách',
    createdAt: '2020-03-01T00:00:00.000Z',
  },
  {
    id: 'dept-mkt',
    name: 'Phòng Marketing',
    code: 'MKT',
    parentId: 'dept-bgd',
    managerId: 'emp-018',
    employeeCount: 3,
    description: 'Xây dựng thương hiệu và truyền thông marketing',
    createdAt: '2020-03-15T00:00:00.000Z',
  },
]

/**
 * Helper: tìm phòng ban theo ID.
 * @param {string} id
 * @returns {import('@/types/department').Department|undefined}
 */
export const getDepartmentById = (id) =>
  mockDepartments.find((d) => d.id === id)

/**
 * Helper: tên phòng ban theo ID.
 * @param {string} id
 * @returns {string}
 */
export const getDepartmentName = (id) =>
  getDepartmentById(id)?.name ?? 'Chưa phân công'
