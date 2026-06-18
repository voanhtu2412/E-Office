<template>
  <div class="shortcut-item" role="button" tabindex="0" :title="label" :aria-label="label">
    <div class="shortcut-icon" :class="gradientClass">
      <i :class="icon"></i>
      <span v-if="badgeCount !== undefined && badgeCount > 0" class="badge-dot">
        {{ badgeCount }}
      </span>
    </div>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  gradientClass: string;
  badgeCount?: number;
}>();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s ease;
  border-radius: 12px;
  padding: 4px;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    outline: none;
  }

  .shortcut-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    .shortcut-item:hover &,
    .shortcut-item:focus-visible & {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 14px rgba(10, 101, 255, 0.15);
    }

    .badge-dot {
      position: absolute;
      top: -3px;
      right: -3px;
      background-color: $danger-color;
      color: #ffffff;
      font-size: 9px;
      font-weight: 700;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid $bg-white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  span {
    font-size: 12px;
    color: $text-medium;
    font-weight: 600;
    line-height: 1.25;
  }
}
</style>
