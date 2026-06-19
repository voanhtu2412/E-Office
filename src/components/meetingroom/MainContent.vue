<template>
  <div class="main-content">
    <Header />
    <div class="content-area">
      <Dashboard />
    </div>
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Dashboard from '../../pages/MeetingPage.vue/index.js'
</script>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>
