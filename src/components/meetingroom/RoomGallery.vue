<template>
  <div class="room-gallery">
    <div class="gallery-grid">
      <div v-for="room in rooms" :key="room.id" class="room-card">
        <div class="room-image-wrapper">
          <img :src="room.image" :alt="room.name" class="room-image">
        </div>
        <div class="room-info">
          <h4>{{ room.name }}</h4>
          <p>{{ room.description }}</p>
          <div class="room-meta">
            <span>🏢 {{ room.capacity }}</span>
            <span>👥 {{ room.people }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rooms = ref([
  {
    id: 1,
    name: 'Phòng A - Tầng 5',
    image: 'https://placehold.co/400x250?text=Phong+A',
    description: 'Phòng họp tiêu chuẩn',
    capacity: '20 người',
    people: '8 người'
  },
  {
    id: 2,
    name: 'Phòng B - Tầng 5',
    image: 'https://placehold.co/400x250?text=Phong+B',
    description: 'Phòng họp nhỏ',
    capacity: '12 người',
    people: '8 người'
  },
  {
    id: 3,
    name: 'Phòng C - Tầng 6',
    image: 'https://placehold.co/400x250?text=Phong+C',
    description: 'Phòng họp tiêu chuẩn',
    capacity: '8 người',
    people: '8 người'
  },
  {
    id: 4,
    name: 'Phòng D - Tầng 6',
    image: 'https://placehold.co/400x250?text=Phong+D',
    description: 'Phòng họp vip',
    capacity: '30 người',
    people: '15 người'
  },
  {
    id: 5,
    name: 'Phòng E - Tầng 7',
    image: 'https://placehold.co/400x250?text=Phong+E',
    description: 'Phòng họp tiêu chuẩn',
    capacity: '16 người',
    people: '10 người'
  },
  {
    id: 6,
    name: 'Phòng F - Tầng 7',
    image: 'https://placehold.co/400x250?text=Phong+F',
    description: 'Phòng họp tiêu chuẩn',
    capacity: '6 người',
    people: '5 người'
  }
])
</script>

<style scoped>
.room-gallery {
  width: 100%;
  overflow-x: auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.room-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.room-image-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f0f0f0;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.room-card:hover .room-image {
  transform: scale(1.05);
}

.room-info {
  padding: 15px;
}

.room-info h4 {
  margin: 0 0 8px 0;
  color: #1e3c72;
  font-size: 14px;
  font-weight: 600;
}

.room-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 12px;
}

.room-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

</style>
