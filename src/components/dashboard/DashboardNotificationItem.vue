<template>
  <div class="notify-item" role="button" tabindex="0" :title="title" :aria-label="title">
    <div class="notify-icon" :class="iconThemeClass">
      <i :class="icon"></i>
    </div>
    <div class="notify-content">
      <p class="notify-title" :title="title">{{ title }}</p>
      <div class="notify-meta">
        <span class="sender">{{ sender }}</span>
        <span class="dot-separator">•</span>
        <span class="time">{{ timeText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  iconThemeClass: string;
  title: string;
  sender: string;
  timeText: string;
}>();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.notify-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: $bg-card-light;
    transform: translateX(2px);
    outline: none;
  }

  .notify-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;

    &.icon-blue {
      background-color: rgba(10, 101, 255, 0.08);
      color: $primary-color;
    }
    &.icon-green {
      background-color: rgba(46, 213, 115, 0.08);
      color: $success-color;
    }
    &.icon-purple {
      background-color: rgba(140, 122, 230, 0.08);
      color: $purple-color;
    }
    &.icon-green-light {
      background-color: rgba(26, 188, 156, 0.08);
      color: #1abc9c;
    }
  }

  .notify-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    flex: 1;

    .notify-title {
      font-size: 13px;
      font-weight: 700;
      color: $text-dark;
      margin: 0;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 480px) {
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .notify-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: $text-muted;
      margin-top: 3px;
      min-width: 0;

      .sender {
        font-weight: 500;
        color: $text-light;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dot-separator {
        font-size: 8px;
      }
    }
  }
}
</style>
