<template>
  <div class="notification-filters">
    <!-- Row 1: Tabs & Settings -->
    <div class="notification-filters__header">
      <div class="notification-filters__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="[
            'notification-filters__tab-btn',
            { 'notification-filters__tab-btn--active': activeTab === tab.value }
          ]"
          @click="$emit('update:activeTab', tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <button class="notification-filters__settings-btn" @click="$emit('settings-click')">
        <svg class="notification-filters__settings-icon" width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 1.33331V2.66665M8 13.3333V14.6666M14.6667 7.99998H13.3333M2.66667 7.99998H1.33333M12.7133 3.28665L11.7733 4.22665M4.22667 11.7733L3.28667 12.7133M12.7133 12.7133L11.7733 11.7733M4.22667 4.22665L3.28667 3.28665" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Cài đặt thông báo</span>
      </button>
    </div>

    <!-- Row 2: Search & Select Dropdowns -->
    <div class="notification-filters__body">
      <!-- Search Input -->
      <div class="notification-filters__search-wrapper">
        <span class="notification-filters__search-icon">
          <svg width="21" height="21" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 12.5L16 16M14.5 8.25C14.5 11.7018 11.7018 14.5 8.25 14.5C4.79822 14.5 2 11.7018 2 8.25C2 4.79822 4.79822 2 8.25 2C11.7018 2 14.5 4.79822 14.5 8.25Z" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          class="notification-filters__search-input"
          placeholder="Tìm kiếm tiêu đề, nội dung, người gửi..."
        />
      </div>

      <!-- Select Type -->
      <div class="notification-filters__select">
        <BaseSelect
          :model-value="selectedType"
          @update:model-value="$emit('update:selectedType', $event)"
          :options="typeOptions"
          placeholder="Tất cả loại thông báo"
        />
      </div>

      <!-- Select Dept -->
      <div class="notification-filters__select">
        <BaseSelect
          :model-value="selectedDept"
          @update:model-value="$emit('update:selectedDept', $event)"
          :options="deptOptions"
          placeholder="Tất cả phòng ban"
        />
      </div>

      <!-- Select Status -->
      <div class="notification-filters__select">
        <BaseSelect
          :model-value="selectedStatus"
          @update:model-value="$emit('update:selectedStatus', $event)"
          :options="statusOptions"
          placeholder="Tất cả trạng thái"
        />
      </div>

      <!-- Reset Filter Button -->
      <button
        class="notification-filters__reset-btn"
        @click="$emit('reset-filters')"
        title="Đặt lại bộ lọc"
      >
        <svg width="21" height="21" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.25 4.5H15.75M4.5 9H13.5M6.75 13.5H11.25" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import BaseSelect from '@/components/BaseSelect.vue';
import { NOTIFICATION_CATEGORIES, DEPARTMENTS } from '../constants';

export default {
  name: 'NotificationFilters',
  components: { BaseSelect },
  props: {
    searchQuery: { type: String, default: '' },
    selectedType: { type: String, default: '' },
    selectedDept: { type: String, default: '' },
    selectedStatus: { type: String, default: '' },
    activeTab: { type: String, default: 'all' }
  },
  emits: [
    'update:searchQuery',
    'update:selectedType',
    'update:selectedDept',
    'update:selectedStatus',
    'update:activeTab',
    'reset-filters',
    'settings-click'
  ],
  data() {
    return {
      tabs: [
        { value: 'all', label: 'Tất cả' },
        { value: 'unread', label: 'Chưa đọc' },
        { value: 'priority', label: 'Ưu tiên' },
        { value: 'mine', label: 'Thông báo của tôi' }
      ]
    };
  },
  computed: {
    typeOptions() {
      // Build options from constant
      const options = [{ value: '', label: 'Tất cả loại thông báo' }];
      Object.keys(NOTIFICATION_CATEGORIES).forEach(key => {
        options.push({
          value: key,
          label: NOTIFICATION_CATEGORIES[key].label
        });
      });
      return options;
    },
    deptOptions() {
      const options = [{ value: '', label: 'Tất cả phòng ban' }];
      DEPARTMENTS.forEach(dept => {
        options.push({ value: dept, label: dept });
      });
      return options;
    },
    statusOptions() {
      return [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'read', label: 'Đã đọc' },
        { value: 'unread', label: 'Chưa đọc' }
      ];
    }
  }
}
</script>

<style lang="scss">
.notification-filters {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  &__header {
    @include flex-between;
    flex-wrap: wrap;
    gap: $spacing-sm;
    border-bottom: 1px solid $color-border;
    padding-bottom: 2px;

    @include mobile {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__tabs {
    display: flex;
    gap: 4px;
    background-color: $color-border-light;
    padding: 4px;
    border-radius: $border-radius-lg;

    @include mobile {
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  &__tab-btn {
    padding: 8px 16px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    background: transparent;
    border: none;
    border-radius: $border-radius-md;
    @include transition-smooth(color, background-color, box-shadow);
    flex-shrink: 0;

    &:hover {
      color: $color-text-main;
    }

    &--active {
      color: $color-primary;
      font-weight: $font-weight-semibold;
      background-color: $color-white;
      box-shadow: $shadow-sm;
    }
  }

  &__settings-btn {
    @include flex-align;
    gap: $spacing-xs;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-primary;
    padding: 6px 12px;
    border-radius: $border-radius-md;
    border: 1px solid transparent;
    background-color: transparent;
    @include transition-smooth(background-color);

    &:hover {
      background-color: $color-primary-light;
    }

    @include mobile {
      width: 100%;
      justify-content: center;
      background-color: $color-primary-light;
    }
  }

  &__settings-icon {
    flex-shrink: 0;
  }

  &__body {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    align-items: center;

    @include tablet {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__search-wrapper {
    position: relative;
    flex-grow: 1;
    min-width: 260px;
  }

  &__search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    font-family: $font-family;
    font-size: $font-size-sm;
    color: $color-text-main;
    background-color: $color-border-light;
    border: 1px solid transparent;
    border-radius: $border-radius-lg;
    outline: none;
    @include transition-smooth(border-color, box-shadow, background-color);

    &:focus {
      background-color: $color-white;
      border-color: $color-primary;
      box-shadow: $shadow-primary-glow;
    }

    &::placeholder {
      color: $color-text-light;
    }
  }

  &__select {
    flex: 1;
    min-width: 160px;
    
    @include tablet {
      min-width: 100%;
    }
  }

  &__reset-btn {
    @include flex-center;
    width: 38px;
    height: 38px;
    background-color: $color-primary-light;
    border-radius: $border-radius-md;
    flex-shrink: 0;
    @include transition-smooth(background-color, transform);

    &:hover {
      background-color: darken($color-primary-light, 4%);
      transform: scale(1.02);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
