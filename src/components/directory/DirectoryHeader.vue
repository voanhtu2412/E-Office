<template>
  <!-- DirectoryHeader.vue — Module-specific header component -->
  <div class="dir-header">
    <div class="dir-header__icon-wrap">
      <component :is="icon" class="dir-header__icon" />
    </div>
    <div>
      <h1 class="dir-header__title">{{ title }}</h1>
      <p class="dir-header__desc">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  /** Heroicon component (Heroicons v2 exports as Function) */
  icon: {
    type: [Object, Function],
    required: true,
  },
})
</script>

<style scoped>
.dir-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.dir-header__icon-wrap {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #bfdbfe;
}

.dir-header__icon {
  width: 26px;
  height: 26px;
  color: #2563eb;
}

.dir-header__title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.dir-header__desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}
</style>
