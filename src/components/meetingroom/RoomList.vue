<template>
  <div class="room-list">
    <div class="tabs-container">
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>

    <div class="list-controls">
      <button class="btn-control">Tất cả phòng</button>
      <button class="btn-control">Tất cả trạng thái</button>
      <span class="sort-icon">⋮</span>
    </div>

    <table class="rooms-table">
      <thead>
        <tr>
          <th>Phòng họp</th>
          <th>Nội dung cuộc họp</th>
          <th>Thời gian</th>
          <th>Người đặt</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in getCurrentTabData()" :key="room.id">
          <td>
            <div class="room-info">
              <div class="room-image">{{ room.roomInitial }}</div>
              <div>
                <div class="room-name">{{ room.name }}</div>
                <div class="room-capacity">{{ room.capacity }}</div>
              </div>
            </div>
          </td>
          <td>{{ room.content }}</td>
          <td>{{ room.time }}</td>
          <td>
            <div class="person">
              <div class="person-avatar">{{ room.personInitial }}</div>
              {{ room.person }}
            </div>
          </td>
          <td>
            <select :value="room.status" @change="updateStatus(room, $event)" class="status-select">
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Đã qua">Đã qua</option>
            </select>
          </td>
          <td><span class="action-menu">⋯</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('Lịch phòng họp')
const tabs = ['Lịch phòng họp', 'Lịch của tôi', 'Lịch phòng ban']

// Helper function to get initials
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Helper function to get room initial
const getRoomInitial = (name) => {
  return name.split('-')[0].trim()[0]
}

const roomsData = {
  'Lịch phòng họp': [
    {
      id: 1,
      name: 'Phòng A - Tầng 5',
      capacity: 'Sức chứa: 20 người',
      content: 'Họp ban giám đốc',
      time: '08:30 - 10:00',
      person: 'Nguyễn Văn An',
      status: 'Đang diễn ra',
      roomInitial: 'P',
      personInitial: 'NV'
    },
    {
      id: 2,
      name: 'Phòng B - Tầng 5',
      capacity: 'Sức chứa: 12 người',
      content: 'Họp phòng Marketing',
      time: '09:00 - 10:30',
      person: 'Trần Thị Mai',
      status: 'Đang diễn ra',
      roomInitial: 'P',
      personInitial: 'TT'
    },
    {
      id: 3,
      name: 'Phòng C - Tầng 6',
      capacity: 'Sức chứa: 8 người',
      content: 'Họp dự án phần mềm',
      time: '10:30 - 12:00',
      person: 'Phạm Văn Nam',
      status: 'Sắp diễn ra',
      roomInitial: 'P',
      personInitial: 'PV'
    },
    {
      id: 4,
      name: 'Phòng D - Tầng 6',
      capacity: 'Sức chứa: 30 người',
      content: 'Họp với đối tác ABC',
      time: '13:30 - 16:00',
      person: 'Lê Minh Tuấn',
      status: 'Đã qua',
      roomInitial: 'P',
      personInitial: 'LM'
    },
    {
      id: 5,
      name: 'Phòng E - Tầng 7',
      capacity: 'Sức chứa: 16 người',
      content: 'Họp kế hoạch Q2',
      time: '14:00 - 15:30',
      person: 'Hoàng Thị Linh',
      status: 'Sắp diễn ra',
      roomInitial: 'P',
      personInitial: 'HL'
    }
  ],
  'Lịch của tôi': [
    {
      id: 6,
      name: 'Phòng A - Tầng 5',
      capacity: 'Sức chứa: 20 người',
      content: 'Họp ban giám đốc',
      time: '08:30 - 10:00',
      person: 'Nguyễn Văn An',
      status: 'Đang diễn ra',
      roomInitial: 'P',
      personInitial: 'NV'
    },
    {
      id: 7,
      name: 'Phòng C - Tầng 6',
      capacity: 'Sức chứa: 8 người',
      content: 'Họp dự án phần mềm',
      time: '10:30 - 12:00',
      person: 'Phạm Văn Nam',
      status: 'Sắp diễn ra',
      roomInitial: 'P',
      personInitial: 'PV'
    },
    {
      id: 8,
      name: 'Phòng B - Tầng 5',
      capacity: 'Sức chứa: 12 người',
      content: 'Họp đánh giá hiệu suất',
      time: '15:00 - 16:30',
      person: 'Vũ Đức Anh',
      status: 'Sắp diễn ra',
      roomInitial: 'P',
      personInitial: 'VD'
    }
  ],
  'Lịch phòng ban': [
    {
      id: 9,
      name: 'Phòng A - Tầng 5',
      capacity: 'Sức chứa: 20 người',
      content: 'Họp phòng Marketing toàn bộ',
      time: '09:00 - 10:30',
      person: 'Trần Thị Mai',
      status: 'Đang diễn ra',
      roomInitial: 'P',
      personInitial: 'TT'
    },
    {
      id: 10,
      name: 'Phòng D - Tầng 6',
      capacity: 'Sức chứa: 30 người',
      content: 'Họp toàn công ty',
      time: '14:00 - 15:30',
      person: 'Nguyễn Văn An',
      status: 'Sắp diễn ra',
      roomInitial: 'P',
      personInitial: 'NV'
    },
    {
      id: 11,
      name: 'Phòng E - Tầng 7',
      capacity: 'Sức chứa: 16 người',
      content: 'Họp tổng kết tháng',
      time: '16:00 - 17:00',
      person: 'Lê Minh Tuấn',
      status: 'Sắp diễn ra',
      roomInitial: 'P',
      personInitial: 'LM'
    }
  ]
}

const getCurrentTabData = () => {
  return roomsData[activeTab.value]
}

const updateStatus = (room, event) => {
  room.status = event.target.value
}
</script>

<style scoped>
.room-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.tabs-container {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  padding: 0 20px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #999;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  font-weight: 500;
}

.tab-btn:hover {
  color: #666;
}

.tab-btn.active {
  color: #2a5298;
  border-bottom-color: #2a5298;
}

.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  gap: 10px;
}

.btn-control {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.btn-control:hover {
  background: #ebebeb;
}

.sort-icon {
  cursor: pointer;
  color: #999;
  font-size: 18px;
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
}

.rooms-table thead {
  background: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
}

.rooms-table th {
  text-align: left;
  padding: 12px 15px;
  color: #666;
  font-size: 13px;
  font-weight: 600;
}

.rooms-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.room-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.room-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.room-name {
  font-weight: 600;
  color: #1e3c72;
}

.room-capacity {
  color: #999;
  font-size: 12px;
}

.person {
  display: flex;
  align-items: center;
  gap: 8px;
}

.person-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}

.status-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #1e3c72;
  transition: all 0.3s;
}

.status-select:hover {
  border-color: #2a5298;
}

.status-select:focus {
  outline: none;
  border-color: #2a5298;
  box-shadow: 0 0 0 2px rgba(42, 82, 152, 0.1);
}

.action-menu {
  cursor: pointer;
  color: #999;
  font-size: 18px;
}

.rooms-table tbody tr:hover {
  background: #f9f9f9;
}
</style>
