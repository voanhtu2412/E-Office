<template>
  <div class="quick-filters">
    <h3 class="quick-filters__title">Bộ lọc nhanh</h3>
    
    <div class="quick-filters__list">
      <button
        v-for="item in filterItems"
        :key="item.type"
        :class="[
          'quick-filters__item',
          { 'quick-filters__item--active': activeType === item.type }
        ]"
        @click="$emit('select-category', item.type)"
      >
        <span class="quick-filters__item-left">
          <span :class="['quick-filters__icon', `quick-filters__icon--${item.type || 'all'}`]">
            <NotificationIcon :name="item.type || 'all'" :size="14" />
          </span>
          <span class="quick-filters__name">{{ item.label }}</span>
        </span>
        <span class="quick-filters__count">{{ counts[item.type] || 0 }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import NotificationIcon from './NotificationIcon.vue';

export default {
  name: 'QuickFilters',
  components: { NotificationIcon },
  props: {
    counts: {
      type: Object,
      required: true,
      default: () => ({
        '': 128,
        general: 32,
        task: 24,
        meeting: 18,
        rule: 12,
        internal: 16,
        train: 14,
        system: 12
      })
    },
    activeType: {
      type: String,
      default: ''
    }
  },
  emits: ['select-category'],
  data() {
    return {
      filterItems: [
        { type: '', label: 'Tất cả thông báo' },
        { type: 'general', label: 'Thông báo chung' },
        { type: 'task', label: 'Công việc' },
        { type: 'meeting', label: 'Lịch họp' },
        { type: 'rule', label: 'Quy định' },
        { type: 'internal', label: 'Tin nội bộ' },
        { type: 'train', label: 'Đào tạo' },
        { type: 'system', label: 'Hệ thống' }
      ]
    };
  }
}
</script>

<style lang="scss">
.quick-filters {
  @include card-style;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__title {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    border-bottom: 1px solid $color-border-light;
    padding-bottom: $spacing-sm;
    padding-left: 8px;
    border-left: 3px solid $color-primary; // vertical accent line
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__item {
    @include flex-between;
    padding: $spacing-sm 12px;
    border-radius: $border-radius-md;
    border: 1px solid transparent;
    text-align: left;
    background-color: transparent;
    @include transition-smooth(background-color, border-color, color, transform, box-shadow);

    &:hover {
      background-color: $color-white;
      border-color: rgba(10, 101, 255, 0.1);
      box-shadow: $shadow-sm;
      transform: translateY(-1px);
      
      .quick-filters__name {
        color: $color-primary;
      }
    }

    &--active {
      background-color: $color-primary-light !important;
      border-color: rgba(10, 101, 255, 0.2);
      
      .quick-filters__name {
        color: $color-primary;
        font-weight: $font-weight-bold;
      }
      
      .quick-filters__count {
        color: $color-primary;
        font-weight: $font-weight-bold;
        background-color: $color-white;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }
  }

  &__item-left {
    @include flex-align;
    gap: $spacing-sm;
  }

  &__icon {
    @include flex-center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    flex-shrink: 0;

    &--all { color: $color-primary; }
    &--general { color: $color-badge-general; }
    &--task { color: $color-badge-task; }
    &--meeting { color: $color-badge-meeting; }
    &--rule { color: $color-badge-rule; }
    &--internal { color: $color-badge-internal; }
    &--train { color: $color-badge-train; }
    &--system { color: $color-badge-system; }
  }

  &__name {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    @include transition-smooth(color);
  }

  &__count {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
  }
}
</style>
