/**
 * modules/directory/data/mockOrgChart.js
 * Cây tổ chức dạng OrgNode[] đệ quy, 3 cấp.
 *
 * Cấu trúc: Công ty → Phòng ban → Nhân viên (leaf nodes)
 * Dùng để render OrganizationChart.vue bằng OrganizationTree.vue component.
 */

/** @type {import('@/types/organization').OrgNode[]} */
export const mockOrgChart = [
  {
    id: 'org-company',
    name: 'Công ty TNHH eOffice Việt Nam',
    type: 'company',
    parentId: null,
    code: 'EOFFICE',
    members: [],
    children: [
      {
        id: 'dept-bgd',
        name: 'Ban Giám đốc',
        type: 'department',
        parentId: 'org-company',
        code: 'BGD',
        members: [
          { id: 'emp-001', fullName: 'Nguyễn Minh Tuấn', position: 'Giám đốc điều hành (CEO)', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Minh+Tuan&background=2563eb&color=fff&size=64&bold=true' },
          { id: 'emp-002', fullName: 'Trần Thị Hương', position: 'Phó Giám đốc', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Huong&background=7c3aed&color=fff&size=64&bold=true' },
          { id: 'emp-003', fullName: 'Lê Văn Bình', position: 'Trợ lý Giám đốc', avatar: 'https://ui-avatars.com/api/?name=Le+Van+Binh&background=059669&color=fff&size=64&bold=true' },
        ],
        children: [],
      },
      {
        id: 'dept-kt',
        name: 'Phòng Kỹ thuật',
        type: 'department',
        parentId: 'org-company',
        code: 'KT',
        members: [
          { id: 'emp-004', fullName: 'Phạm Thanh Long', position: 'Trưởng phòng Kỹ thuật', avatar: 'https://ui-avatars.com/api/?name=Pham+Thanh+Long&background=dc2626&color=fff&size=64&bold=true' },
          { id: 'emp-005', fullName: 'Hoàng Thị Mai', position: 'Backend Senior', avatar: 'https://ui-avatars.com/api/?name=Hoang+Thi+Mai&background=d97706&color=fff&size=64&bold=true' },
          { id: 'emp-006', fullName: 'Đỗ Quốc Hùng', position: 'Frontend Senior', avatar: 'https://ui-avatars.com/api/?name=Do+Quoc+Hung&background=0891b2&color=fff&size=64&bold=true' },
          { id: 'emp-007', fullName: 'Vũ Thị Thanh', position: 'DevOps Engineer', avatar: 'https://ui-avatars.com/api/?name=Vu+Thi+Thanh&background=7c3aed&color=fff&size=64&bold=true' },
          { id: 'emp-008-kt', fullName: 'Bùi Ngọc Duy', position: 'QA Engineer', avatar: 'https://ui-avatars.com/api/?name=Bui+Ngoc+Duy&background=16a34a&color=fff&size=64&bold=true' },
        ],
        children: [],
      },
      {
        id: 'dept-kd',
        name: 'Phòng Kinh doanh',
        type: 'department',
        parentId: 'org-company',
        code: 'KD',
        members: [
          { id: 'emp-008', fullName: 'Ngô Thị Lan Anh', position: 'Trưởng phòng Kinh doanh', avatar: 'https://ui-avatars.com/api/?name=Ngo+Thi+Lan+Anh&background=be185d&color=fff&size=64&bold=true' },
          { id: 'emp-009', fullName: 'Dương Văn Khoa', position: 'Kinh doanh Senior', avatar: 'https://ui-avatars.com/api/?name=Duong+Van+Khoa&background=ea580c&color=fff&size=64&bold=true' },
          { id: 'emp-010', fullName: 'Lý Thị Bảo Ngọc', position: 'CSKH', avatar: 'https://ui-avatars.com/api/?name=Ly+Thi+Bao+Ngoc&background=7c3aed&color=fff&size=64&bold=true' },
        ],
        children: [],
      },
      {
        id: 'dept-ns',
        name: 'Phòng Nhân sự',
        type: 'department',
        parentId: 'org-company',
        code: 'NS',
        members: [
          { id: 'emp-012', fullName: 'Phan Thị Thu Hiền', position: 'Trưởng phòng Nhân sự', avatar: 'https://ui-avatars.com/api/?name=Phan+Thi+Thu+Hien&background=0369a1&color=fff&size=64&bold=true' },
          { id: 'emp-013', fullName: 'Trương Văn Đức', position: 'Chuyên viên Tuyển dụng', avatar: 'https://ui-avatars.com/api/?name=Truong+Van+Duc&background=15803d&color=fff&size=64&bold=true' },
          { id: 'emp-014', fullName: 'Võ Thị Mỹ Linh', position: 'Chuyên viên C&B', avatar: 'https://ui-avatars.com/api/?name=Vo+Thi+My+Linh&background=b45309&color=fff&size=64&bold=true' },
        ],
        children: [],
      },
      {
        id: 'dept-ktoan',
        name: 'Phòng Kế toán',
        type: 'department',
        parentId: 'org-company',
        code: 'KToan',
        members: [
          { id: 'emp-015', fullName: 'Cao Thị Bích Phượng', position: 'Trưởng phòng Kế toán', avatar: 'https://ui-avatars.com/api/?name=Cao+Thi+Bich+Phuong&background=9333ea&color=fff&size=64&bold=true' },
          { id: 'emp-016', fullName: 'Hà Văn Tú', position: 'Kế toán viên', avatar: 'https://ui-avatars.com/api/?name=Ha+Van+Tu&background=0f766e&color=fff&size=64&bold=true' },
          { id: 'emp-017', fullName: 'Lưu Thị Kim Oanh', position: 'Thủ quỹ', avatar: 'https://ui-avatars.com/api/?name=Luu+Thi+Kim+Oanh&background=7e22ce&color=fff&size=64&bold=true' },
        ],
        children: [],
      },
      {
        id: 'dept-mkt',
        name: 'Phòng Marketing',
        type: 'department',
        parentId: 'org-company',
        code: 'MKT',
        members: [
          { id: 'emp-018', fullName: 'Đinh Thị Quỳnh Nga', position: 'Trưởng phòng Marketing', avatar: 'https://ui-avatars.com/api/?name=Dinh+Thi+Quynh+Nga&background=c2410c&color=fff&size=64&bold=true' },
          { id: 'emp-019', fullName: 'Tô Văn Minh', position: 'Content Marketing', avatar: 'https://ui-avatars.com/api/?name=To+Van+Minh&background=0284c7&color=fff&size=64&bold=true' },
          { id: 'emp-020', fullName: 'Mạc Thị Xuân', position: 'Thiết kế đồ họa', avatar: 'https://ui-avatars.com/api/?name=Mac+Thi+Xuan&background=be185d&color=fff&size=64&bold=true' },
        ],
        children: [],
      },
    ],
  },
]
