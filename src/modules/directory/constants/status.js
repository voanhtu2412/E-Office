/**
 * constants/status.js
 * Định nghĩa tất cả enum status dùng trong module Danh bạ.
 *
 * PROTECTED — Không tự ý thay đổi.
 * Các giá trị này phải khớp với enum từ Backend API.
 */

/** Trạng thái nhân viên */
export const EMPLOYEE_STATUS = {
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
}

/** Label hiển thị cho trạng thái nhân viên */
export const EMPLOYEE_STATUS_LABEL = {
  [EMPLOYEE_STATUS.ACTIVE]:   'Đang làm việc',
  [EMPLOYEE_STATUS.INACTIVE]: 'Nghỉ việc',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'Đang nghỉ phép',
}

/** CSS class cho badge trạng thái nhân viên */
export const EMPLOYEE_STATUS_CLASS = {
  [EMPLOYEE_STATUS.ACTIVE]:   'badge-active',
  [EMPLOYEE_STATUS.INACTIVE]: 'badge-inactive',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'badge-on-leave',
}

/** Trạng thái đồng bộ dữ liệu */
export const SYNC_STATUS = {
  IDLE:     'idle',
  SYNCING:  'syncing',
  SUCCESS:  'success',
  ERROR:    'error',
}

/** Label hiển thị cho trạng thái đồng bộ */
export const SYNC_STATUS_LABEL = {
  [SYNC_STATUS.IDLE]:    'Sẵn sàng',
  [SYNC_STATUS.SYNCING]: 'Đang đồng bộ...',
  [SYNC_STATUS.SUCCESS]: 'Đồng bộ thành công',
  [SYNC_STATUS.ERROR]:   'Lỗi đồng bộ',
}

/** Định dạng xuất dữ liệu */
export const EXPORT_FORMAT = {
  EXCEL:  'excel',
  PDF:    'pdf',
  CSV:    'csv',
  VCARD:  'vcard',
}

/** Label cho định dạng xuất */
export const EXPORT_FORMAT_LABEL = {
  [EXPORT_FORMAT.EXCEL]: 'Microsoft Excel (.xlsx)',
  [EXPORT_FORMAT.PDF]:   'PDF Document (.pdf)',
  [EXPORT_FORMAT.CSV]:   'CSV File (.csv)',
  [EXPORT_FORMAT.VCARD]: 'vCard Contact (.vcf)',
}

/** Vai trò phân quyền */
export const USER_ROLE = {
  ADMIN:   'admin',
  MANAGER: 'manager',
  STAFF:   'staff',
}

/** Label vai trò */
export const USER_ROLE_LABEL = {
  [USER_ROLE.ADMIN]:   'Quản trị viên',
  [USER_ROLE.MANAGER]: 'Quản lý',
  [USER_ROLE.STAFF]:   'Nhân viên',
}
