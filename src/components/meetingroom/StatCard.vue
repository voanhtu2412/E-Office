<template>
  <div class="stat-card" :style="{ borderLeftColor: color }">
    <div class="icon">{{ icon }}</div>
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="value">{{ value }}</div>
      <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  color: {
    type: String,
    default: '#2a5298'
  },
  subtitle: String
})
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 32px;
  min-width: 50px;
}

.content {
  flex: 1;
}

.title {
  color: #666;
  font-size: 12px;
  margin-bottom: 5px;
}

.value {
  color: #1e3c72;
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  color: #999;
  font-size: 11px;
  margin-top: 5px;
}
</style>
