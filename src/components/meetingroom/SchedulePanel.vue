<template>
  <div class="schedule-panel">
    <div class="date-info">
      <span class="date-label">Thứ 5, 19/06/2025</span>
    </div>

    <div class="schedule-list">
      <div v-for="meeting in meetings" :key="meeting.id" class="meeting-item" :class="meeting.status">
        <div class="meeting-header">
          <div class="time">{{ meeting.time }}</div>
          <div class="person-avatar">{{ meeting.personInitial }}</div>
        </div>
        <div class="meeting-details">
          <div class="meeting-title">{{ meeting.title }}</div>
          <div class="meeting-room">{{ meeting.room }}</div>
          <div class="meeting-person">Người dẫn: {{ meeting.organizer }}</div>
        </div>
      </div>
          <div class="btn-group">
      <button class="btn-link">Xem đầy đủ lịch trong ngày</button>
    </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const meetings = ref([
  {
    id: 1,
    time: '08:30 - 10:00',
    title: 'Họp ban Giám đốc',
    room: 'Phòng họp A - Tầng 5',
    organizer: 'Nguyễn Văn An',
    personInitial: 'NV',
    status: 'active'
  },
  {
    id: 2,
    time: '09:00 - 10:30',
    title: 'Họp phòng Marketing',
    room: 'Phòng họp C - Tầng 6',
    organizer: 'Trần Thị Mai',
    personInitial: 'TT',
    status: 'active'
  },
  {
    id: 3,
    time: '10:30 - 12:00',
    title: 'Họp dự án phần mềm',
    room: 'Phòng họp B - Tầng 5',
    organizer: 'Phạm Văn Nam',
    personInitial: 'PV',
    status: 'upcoming'
  },
  {
    id: 4,
    time: '13:30 - 15:00',
    title: 'Họp với đối tác ABC',
    room: 'Phòng họp A - Tầng 5',
    organizer: 'Lê Minh Tuấn',
    personInitial: 'LM',
    status: 'upcoming'
  },
  {
    id: 5,
    time: '17:00 - 18:00',
    title: 'Họp phòng Nhân sự',
    room: 'Phòng họp B - Tầng 5',
    organizer: 'Vũ Đức Anh',
    personInitial: 'VD',
    status: 'upcoming'
  }
])
</script>

<style scoped>
.schedule-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.date-info {
  padding: 0 0 15px 0;
  border-bottom: 1px solid #e0e0e0;
}

.date-label {
  color: #1e3c72;
  font-weight: 600;
  font-size: 14px;
}

.schedule-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
  margin-right: -10px;
  padding-right: 10px;
}

.meeting-item {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 3px solid;
  background: #f9f9f9;
  font-size: 15px;
  transition: all 0.3s;
}

.meeting-item:hover {
  background: #f0f0f0;
}

.meeting-item.active {
  border-left-color: #22c55e;
  background: #f0fdf4;
}

.meeting-item.upcoming {
  border-left-color: #f59e0b;
  background: #fefce8;
}

.meeting-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.time {
  color: #1e3c72;
  font-weight: 600;
}

.person-avatar {
  width: 24px;
  height: 24px;
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

.meeting-details {
  margin-top: 4px;
}

.meeting-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 4px;
}

.meeting-room {
  color: #666;
  margin-bottom: 3px;
  font-size: 15px;
}

.meeting-person {
  color: #999;
  font-size: 15px;
}

.btn-group {
  padding: 15px 0 0 0;
  border-top: 1px solid #e0e0e0;
}

.btn-link {
  background: none;
  border: none;
  color: #2a5298;
  cursor: pointer;
  font-size: 15px;
  text-decoration: underline;
  padding: 8px 0;
  width: 100%;
  text-align: center;
}

.btn-link:hover {
  color: #1e3c72;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
