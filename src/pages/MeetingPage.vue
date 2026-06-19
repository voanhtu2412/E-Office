<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="header-title">
        <h2>Phòng họp</h2>
      </div>
      <button class="btn-primary">+ Đặt phòng họp</button>
    </div>

    <div class="stats-grid">
      <StatCard title="Tổng phòng họp" value="16" icon="🏢" />
      <StatCard title="Đang diễn ra" value="3" icon="▶️" color="#22c55e" />
      <StatCard title="Sắp diễn ra" value="7" icon="⏱️" color="#f59e0b" />
      <StatCard title="Đã qua lúc nay" value="5" icon="✓" color="#8b5cf6" />
      <StatCard title="Liên hệ bộ phận hỗ trợ" value="" icon="🎧" color="#06b6d4" subtitle="Hạch chủng - Quản trị" />
    </div>

    <div class="content-grid">
      <div class="section full-width">
        <div class="section-header">
          <h3>Danh sách phòng họp</h3>
        </div>
        
        <RoomList />
      </div>

      <div class="section full-width">
        <h3>Lịch họp hôm nay</h3>
        <SchedulePanel />
      </div>
    </div>

    <div class="rooms-showcase">
      <h3>Danh sách phòng họp</h3>
      <RoomGallery />
    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/meetingroom/StatCard.vue'
import RoomList from '@/components/meetingroom/RoomList.vue'
import SchedulePanel from '@/components/meetingroom/SchedulePanel.vue'
import RoomGallery from '@/components/meetingroom/RoomGallery.vue'
</script>

<style scoped>
.dashboard {
  padding: 30px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scrollbar */
.dashboard::-webkit-scrollbar {
  width: 8px;
}

.dashboard::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dashboard::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.dashboard::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-title h2 {
  margin: 0;
  color: #1e3c72;
  font-size: 28px;
}

.btn-primary {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 82, 152, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  margin-bottom: 30px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section.full-width {
  grid-column: 1 / -1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section h3 {
  margin: 0 0 20px 0;
  color: #1e3c72;
  font-size: 18px;
}

.rooms-showcase {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rooms-showcase h3 {
  margin: 0 0 20px 0;
  color: #1e3c72;
}
</style>
