<template>
  <div class="priority-list">
    <div class="priority-list__header">
      <h3 class="priority-list__title">Thông báo ưu tiên</h3>
      <a href="#" class="priority-list__view-all" @click.prevent="$emit('view-all')">Xem tất cả</a>
    </div>

    <div class="priority-list__body">
      <div v-for="item in items" :key="item.id" class="priority-list__item">
        <span class="priority-list__dot"></span>
        <div class="priority-list__content">
          <h4 class="priority-list__item-title" :title="item.title">{{ item.title }}</h4>
          <span class="priority-list__item-time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriorityList',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [
        { id: 1, title: 'Bảo trì hệ thống ngày 12/05/2025', time: '22:00 - 24:00' },
        { id: 2, title: 'Nhắc nhở hoàn thành KPI tháng 5', time: 'Hạn chót: 20/05/2025' },
        { id: 3, title: 'Họp giao ban ban tháng 5/2025', time: '12/05/2025 - 08:30' },
        { id: 4, title: 'Cập nhật quy định bảo mật', time: '09/05/2025' }
      ]
    }
  },
  emits: ['view-all']
}
</script>

<style lang="scss">
.priority-list {
  @include card-style;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__header {
    @include flex-between;
    border-bottom: 1px solid $color-border-light;
    padding-bottom: $spacing-sm;
  }

  &__title {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    padding-left: 8px;
    border-left: 3px solid $color-primary; // vertical accent line
  }

  &__view-all {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-primary;
    text-decoration: none;
    @include transition-smooth(color);

    &:hover {
      color: $color-primary-hover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
  }

  &__dot {
    width: 6px;
    height: 6px;
    background-color: $color-danger;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
    animation: pulse-dot-red 2s infinite;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  &__item-title {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    line-height: 1.4;
    @include truncate-multi(2);
    cursor: pointer;
    @include transition-smooth(color);

    &:hover {
      color: $color-primary;
    }
  }

  &__item-time {
    font-size: 12.6px;
    color: $color-text-muted;
  }
}

@keyframes pulse-dot-red {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>
