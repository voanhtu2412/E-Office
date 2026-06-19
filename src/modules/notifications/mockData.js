// Accurate mock data representing the screenshot's notifications list
const coreNotifications = [
  {
    id: 1,
    title: 'Thông báo nghỉ lễ 30/04 và 01/05',
    summary: 'Công ty trân trọng thông báo lịch nghỉ lễ Giải phóng miền Nam 30/04 và Quốc tế Lao động 01/05...',
    type: 'general', // Thông báo chung
    sender: 'Phòng Hành chính',
    senderAvatar: 'HC', // Initials or small icon label
    time: '10/05/2025 09:00',
    timestamp: new Date('2025-05-10T09:00:00').getTime(),
    isRead: false,
  },
  {
    id: 2,
    title: 'Họp giao ban Ban Giám đốc tháng 5/2025',
    summary: 'Thời gian: 08:30 - 11:00, Thứ Hai ngày 12/05/2025 tại Phòng họp lớn tầng 3...',
    type: 'meeting', // Lịch họp
    sender: 'Phòng Hành chính',
    senderAvatar: 'HC',
    time: '09/05/2025 16:30',
    timestamp: new Date('2025-05-09T16:30:00').getTime(),
    isRead: true,
  },
  {
    id: 3,
    title: 'Cập nhật quy định bảo mật thông tin nội bộ',
    summary: 'Nhằm tăng cường bảo mật thông tin, đề nghị toàn thể CBNV tuân thủ nghiêm ngặt quy chế bảo mật...',
    type: 'rule', // Quy định
    sender: 'Phòng CNTT',
    senderAvatar: 'IT',
    time: '09/05/2025 10:15',
    timestamp: new Date('2025-05-09T10:15:00').getTime(),
    isRead: false,
  },
  {
    id: 4,
    title: 'Chúc mừng sinh nhật CBNV tháng 5',
    summary: 'Chúc mừng các anh/chị có sinh nhật trong tháng 5. Kính chúc mọi người luôn mạnh khỏe, hạnh phúc...',
    type: 'internal', // Tin nội bộ
    sender: 'Phòng Nhân sự',
    senderAvatar: 'NS',
    time: '08/05/2025 08:00',
    timestamp: new Date('2025-05-08T08:00:00').getTime(),
    isRead: true,
  },
  {
    id: 5,
    title: 'Đào tạo kỹ năng thuyết trình hiệu quả',
    summary: 'Khóa học giúp bạn tự tin trình bày ý tưởng, thuyết phục và truyền cảm hứng trước đám đông...',
    type: 'train', // Đào tạo
    sender: 'Phòng Đào tạo',
    senderAvatar: 'DT',
    time: '07/05/2025 14:20',
    timestamp: new Date('2025-05-07T14:20:00').getTime(),
    isRead: true,
  },
  {
    id: 6,
    title: 'Nhắc nhở hoàn thành KPI tháng 5',
    summary: 'Đề nghị các phòng ban cập nhật tiến độ KPI trước ngày 20/05/2025 để tổng hợp báo cáo...',
    type: 'task', // Công việc
    sender: 'Phòng Kế hoạch',
    senderAvatar: 'KH',
    time: '07/05/2025 09:30',
    timestamp: new Date('2025-05-07T09:30:00').getTime(),
    isRead: false,
  },
  {
    id: 7,
    title: 'Bảo trì hệ thống ngày 12/05/2025',
    summary: 'Hệ thống OSPACE sẽ được bảo trì định kỳ từ 22:00 đến 24:00 ngày 12/05/2025 để nâng cấp hạ tầng...',
    type: 'system', // Hệ thống
    sender: 'Phòng CNTT',
    senderAvatar: 'IT',
    time: '06/05/2025 11:00',
    timestamp: new Date('2025-05-06T11:00:00').getTime(),
    isRead: true,
  },
  {
    id: 8,
    title: 'Thông báo phát hành phiên bản mới OSPACE',
    summary: 'OSPACE phiên bản 2.5.0 với nhiều cải tiến về hiệu năng và tính năng giao việc thông minh...',
    type: 'system', // Hệ thống
    sender: 'Phòng CNTT',
    senderAvatar: 'IT',
    time: '05/05/2025 16:45',
    timestamp: new Date('2025-05-05T16:45:00').getTime(),
    isRead: true,
  }
];

// Generator to reach 128 total items for full pagination demo
const generateMockNotifications = () => {
  const list = [...coreNotifications];
  const types = ['general', 'meeting', 'rule', 'internal', 'train', 'task', 'system'];
  const senders = [
    { name: 'Phòng Hành chính', avatar: 'HC' },
    { name: 'Phòng CNTT', avatar: 'IT' },
    { name: 'Phòng Nhân sự', avatar: 'NS' },
    { name: 'Phòng Đào tạo', avatar: 'DT' },
    { name: 'Phòng Kế hoạch', avatar: 'KH' }
  ];

  const titles = {
    general: [
      'Thông báo về việc nghỉ mát hè 2025',
      'Thông báo đăng ký gửi xe quý III',
      'Thông báo diễn tập phòng cháy chữa cháy'
    ],
    meeting: [
      'Họp tổng kết tuần quý II',
      'Họp khẩn triển khai dự án OSPACE',
      'Họp bàn giao công việc Hành chính'
    ],
    rule: [
      'Ban hành quy chế làm việc từ xa mới',
      'Quy chế quản lý trang thiết bị văn phòng',
      'Quy trình nộp đề xuất nghỉ phép năm'
    ],
    internal: [
      'Chào mừng nhân sự mới gia nhập OSP',
      'Chúc mừng OSP đạt doanh thu mốc kỷ lục',
      'Phát động giải bóng đá OSP Cup 2025'
    ],
    train: [
      'Đào tạo hội nhập cho nhân viên mới',
      'Khóa huấn luyện Bảo mật thông tin cơ bản',
      'Chia sẻ kinh nghiệm quản lý dự án Agile'
    ],
    task: [
      'Giao chỉ tiêu kinh doanh tháng 6',
      'Báo cáo tiến độ hoàn thiện module thông báo',
      'Đánh giá kết quả thử việc nhân sự CNTT'
    ],
    system: [
      'Cảnh báo quá tải hệ thống lưu trữ',
      'Nâng cấp máy chủ mail công ty ngày 15/5',
      'Khởi động lại tổng đài hỗ trợ OSPACE'
    ]
  };

  let baseTime = new Date('2025-05-04T12:00:00');

  for (let i = 9; i <= 128; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const sender = senders[Math.floor(Math.random() * senders.length)];
    const titleTemplate = titles[type][Math.floor(Math.random() * titles[type].length)];
    const title = `${titleTemplate} (Sinh thêm #${i})`;

    // Decrement time slightly for each notification
    baseTime.setHours(baseTime.getHours() - 3);
    const day = String(baseTime.getDate()).padStart(2, '0');
    const month = String(baseTime.getMonth() + 1).padStart(2, '0');
    const year = baseTime.getFullYear();
    const hours = String(baseTime.getHours()).padStart(2, '0');
    const minutes = String(baseTime.getMinutes()).padStart(2, '0');

    list.push({
      id: i,
      title,
      summary: `Nội dung tóm tắt chi tiết cho thông báo tự động thứ ${i}. Mời quý nhân viên kiểm tra...`,
      type,
      sender: sender.name,
      senderAvatar: sender.avatar,
      time: `${day}/${month}/${year} ${hours}:${minutes}`,
      timestamp: baseTime.getTime(),
      isRead: Math.random() > 0.2 // 80% read, 20% unread
    });
  }

  return list;
};

export const MOCK_NOTIFICATIONS = generateMockNotifications();

// Mock data for right-side Priority list
export const PRIORITY_NOTIFICATIONS = [
  {
    id: 101,
    title: 'Bảo trì hệ thống ngày 12/05/2025',
    time: '22:00 - 24:00',
    date: '12/05/2025'
  },
  {
    id: 102,
    title: 'Nhắc nhở hoàn thành KPI tháng 5',
    time: 'Hạn chót: 20/05/2025',
    date: '20/05/2025'
  },
  {
    id: 103,
    title: 'Họp giao ban ban tháng 5/2025',
    time: '12/05/2025 - 08:30',
    date: '12/05/2025'
  },
  {
    id: 104,
    title: 'Cập nhật quy định bảo mật',
    time: '09/05/2025',
    date: '09/05/2025'
  }
];
