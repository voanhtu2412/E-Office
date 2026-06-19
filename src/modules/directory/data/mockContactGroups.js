/**
 * modules/directory/data/mockContactGroups.js
 * Dữ liệu nhóm liên hệ mẫu.
 *
 * memberIds trỏ đúng ID trong mockEmployees.js.
 */

/** @type {import('@/types/contactGroup').ContactGroup[]} */
export const mockContactGroups = [
  {
    id: 'group-001',
    name: 'Ban Lãnh đạo',
    description: 'Nhóm bao gồm toàn bộ thành viên Ban Giám đốc và Trưởng các phòng ban',
    memberIds: ['emp-001', 'emp-002', 'emp-004', 'emp-011', 'emp-012', 'emp-015', 'emp-018'],
    leaderId: 'emp-001',
    groupEmail: 'bod@eoffice.vn',
    createdBy: 'emp-001',
    createdAt: '2020-01-20T00:00:00.000Z',
    updatedAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 'group-002',
    name: 'Nhóm Dự án ERP 2024',
    description: 'Đội ngũ triển khai dự án hệ thống ERP nội bộ giai đoạn 2024–2025',
    memberIds: ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-016'],
    leaderId: 'emp-004',
    groupEmail: 'erp.project@eoffice.vn',
    createdBy: 'emp-004',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: 'group-003',
    name: 'Nhóm Hỗ trợ Kỹ thuật',
    description: 'Đội kỹ thuật phụ trách hỗ trợ người dùng nội bộ và xử lý sự cố hệ thống',
    memberIds: ['emp-005', 'emp-006', 'emp-007', 'emp-008-kt'],
    leaderId: 'emp-005',
    groupEmail: 'it.support@eoffice.vn',
    createdBy: 'emp-004',
    createdAt: '2021-06-01T00:00:00.000Z',
    updatedAt: '2024-10-15T00:00:00.000Z',
  },
  {
    id: 'group-004',
    name: 'Nhóm Marketing & Truyền thông',
    description: 'Đội phụ trách chiến lược marketing, nội dung và truyền thông thương hiệu',
    memberIds: ['emp-018', 'emp-019', 'emp-020', 'emp-009'],
    leaderId: 'emp-018',
    groupEmail: 'marketing@eoffice.vn',
    createdBy: 'emp-018',
    createdAt: '2022-03-01T00:00:00.000Z',
    updatedAt: '2024-11-20T00:00:00.000Z',
  },
]
