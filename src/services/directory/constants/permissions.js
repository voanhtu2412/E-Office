/**
 * constants/permissions.js
 * Định nghĩa các permission key của module Danh bạ.
 *
 * PROTECTED — Không tự ý thay đổi.
 * Khi BE xây dựng hệ thống phân quyền, sẽ map
 * các giá trị này với roles từ API.
 */

export const PERMISSIONS = {
  /** Xem danh sách nhân viên */
  VIEW_DIRECTORY:       'directory:view',

  /** Chỉnh sửa thông tin nhân viên */
  EDIT_EMPLOYEE:        'directory:employee:edit',

  /** Tạo nhân viên mới */
  CREATE_EMPLOYEE:      'directory:employee:create',

  /** Xóa nhân viên */
  DELETE_EMPLOYEE:      'directory:employee:delete',

  /** Quản lý nhóm liên hệ */
  MANAGE_GROUPS:        'directory:groups:manage',

  /** Xem danh thiếp điện tử */
  VIEW_BUSINESS_CARD:   'directory:business-card:view',

  /** Xuất dữ liệu */
  EXPORT_DATA:          'directory:export',

  /** Quản lý phân quyền */
  MANAGE_PERMISSIONS:   'directory:permissions:manage',

  /** Kích hoạt đồng bộ dữ liệu */
  SYNC_DATA:            'directory:sync',

  /** Xem lịch sử liên hệ */
  VIEW_HISTORY:         'directory:history:view',

  /** SCOPE DATA **/
  VIEW_ALL_DEPARTMENTS: 'directory:scope:view-all',
  VIEW_OWN_DEPARTMENT:  'directory:scope:view-own',
  VIEW_PHONE_NUMBERS:   'directory:scope:view-phone',
  VIEW_EMAIL:           'directory:scope:view-email',
}

/**
 * Định nghĩa các role mặc định và danh sách permissions đi kèm.
 * @type {Record<string, string[]>}
 */
export const ROLE_PERMISSIONS = {
  ADMIN: Object.values(PERMISSIONS),
  MANAGER: [
    PERMISSIONS.VIEW_DIRECTORY,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.MANAGE_GROUPS,
    PERMISSIONS.VIEW_BUSINESS_CARD,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_ALL_DEPARTMENTS,
    PERMISSIONS.VIEW_PHONE_NUMBERS,
    PERMISSIONS.VIEW_EMAIL,
  ],
  STAFF: [
    PERMISSIONS.VIEW_DIRECTORY,
    PERMISSIONS.VIEW_BUSINESS_CARD,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_OWN_DEPARTMENT,
    PERMISSIONS.VIEW_EMAIL,
  ],
  GUEST: [
    PERMISSIONS.VIEW_DIRECTORY,
    PERMISSIONS.VIEW_OWN_DEPARTMENT,
  ],
}
