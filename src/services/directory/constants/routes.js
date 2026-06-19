/**
 * constants/routes.js
 * Định nghĩa tất cả route paths của module Danh bạ.
 *
 * PROTECTED — Không tự ý thay đổi.
 * Mọi component muốn điều hướng phải import từ file này,
 * không được hard-code string path.
 */

export const DIRECTORY_ROUTES = {
  DASHBOARD:      '/directory',
  CONTACT_BOOK:   '/directory/contact-book',
  ORG_CHART:      '/directory/org-chart',
  GROUPS:         '/directory/groups',
  SEARCH:         '/directory/search',
  EMPLOYEE_DETAIL: '/directory/employee/:id',
  BUSINESS_CARD:  '/directory/business-card',
  HISTORY:        '/directory/history',
  PERMISSIONS:    '/directory/permissions',
  SYNC:           '/directory/sync',
  EXPORT:         '/directory/export',
}

/**
 * Helper tạo path cho EmployeeDetail với ID cụ thể.
 * @param {string} id
 * @returns {string}
 */
export const toEmployeeDetailPath = (id) =>
  DIRECTORY_ROUTES.EMPLOYEE_DETAIL.replace(':id', id)
