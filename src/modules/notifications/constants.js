export const NOTIFICATION_CATEGORIES = {
  general: { label: 'Thông báo chung', variant: 'general' },
  meeting: { label: 'Lịch họp', variant: 'meeting' },
  rule: { label: 'Quy định', variant: 'rule' },
  internal: { label: 'Tin nội bộ', variant: 'internal' },
  train: { label: 'Đào tạo', variant: 'train' },
  task: { label: 'Công việc', variant: 'task' },
  system: { label: 'Hệ thống', variant: 'system' }
};

export const DEPARTMENTS = [
  'Phòng Hành chính',
  'Phòng CNTT',
  'Phòng Nhân sự',
  'Phòng Đào tạo',
  'Phòng Kế hoạch'
];

export const STATUSES = [
  { value: 'unread', label: 'Chưa đọc', variant: 'primary' },
  { value: 'read', label: 'Đã đọc', variant: 'success' }
];
