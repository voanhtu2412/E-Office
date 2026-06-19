<template>
  <div class="notification-table-container">
    <div class="notification-table">
      <!-- Table Header (Hidden on Mobile) -->
      <div class="notification-table__head">
        <div class="notification-table__th notification-table__th--title">Tiêu đề</div>
        <div class="notification-table__th notification-table__th--type">Loại thông báo</div>
        <div class="notification-table__th notification-table__th--sender">Người gửi</div>
        <div class="notification-table__th notification-table__th--time">Thời gian</div>
        <div class="notification-table__th notification-table__th--status">Trạng thái</div>
        <div class="notification-table__th notification-table__th--actions">Thao tác</div>
      </div>

      <!-- Table Body -->
      <div class="notification-table__body">
        <template v-if="notifications.length > 0">
          <div
            v-for="item in notifications"
            :key="item.id"
            :class="['notification-table__row', { 'notification-table__row--unread': !item.isRead }]"
          >
            <!-- Column 1: Title & Icon -->
            <div class="notification-table__td notification-table__td--title">
              <div :class="['notification-table__type-icon', `notification-table__type-icon--${item.type}`]">
                <!-- Category specific SVG icon -->
                <NotificationIcon :name="item.type" :size="16" />
              </div>
              <div class="notification-table__title-details">
                <h4 class="notification-table__title-text" :title="item.title">
                  {{ item.title }}
                </h4>
                <p class="notification-table__summary-text">{{ item.summary }}</p>
              </div>
            </div>

            <!-- Column 2: Badge Category -->
            <div class="notification-table__td notification-table__td--type" data-label="Loại thông báo">
              <BaseBadge :variant="getCategoryVariant(item.type)">
                {{ getCategoryLabel(item.type) }}
              </BaseBadge>
            </div>

            <!-- Column 3: Sender Details -->
            <div class="notification-table__td notification-table__td--sender" data-label="Người gửi">
              <div class="notification-table__sender-info">
                <div :class="['notification-table__sender-avatar', `notification-table__sender-avatar--${item.type}`]">
                  {{ item.senderAvatar }}
                </div>
                <span class="notification-table__sender-name">{{ item.sender }}</span>
              </div>
            </div>

            <!-- Column 4: Time -->
            <div class="notification-table__td notification-table__td--time" data-label="Thời gian">
              <span class="notification-table__time-val">{{ item.time }}</span>
            </div>

            <!-- Column 5: Read/Unread Status -->
            <div class="notification-table__td notification-table__td--status" data-label="Trạng thái">
              <BaseBadge
                :variant="item.isRead ? 'success' : 'primary'"
                :show-dot="true"
              >
                {{ item.isRead ? 'Đã đọc' : 'Chưa đọc' }}
              </BaseBadge>
            </div>

            <!-- Column 6: Actions menu trigger -->
            <div class="notification-table__td notification-table__td--actions">
              <button
                class="notification-table__action-btn"
                @click="$emit('action-click', item)"
                title="Thao tác"
              >
                <svg width="18" height="5" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2H2.01M8 2H8.01M14 2H14.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </template>
        
        <!-- Empty State -->
        <div v-else class="notification-table__empty">
          <svg width="55" height="55" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V13" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16.01L12.01 15.999" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="mt-2 text-muted">Không tìm thấy thông báo nào phù hợp bộ lọc.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseBadge from '@/components/BaseBadge.vue';
import NotificationIcon from './NotificationIcon.vue';
import { NOTIFICATION_CATEGORIES } from '../constants';

export default {
  name: 'NotificationTable',
  components: { BaseBadge, NotificationIcon },
  props: {
    notifications: {
      type: Array,
      required: true
    }
  },
  emits: ['action-click'],
  methods: {
    getCategoryVariant(type) {
      return NOTIFICATION_CATEGORIES[type]?.variant || 'general';
    },
    getCategoryLabel(type) {
      return NOTIFICATION_CATEGORIES[type]?.label || 'Thông báo';
    }
  }
}
</script>

<style lang="scss">
.notification-table-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  border-radius: $border-radius-xl;
  border: 1px solid rgba(10, 101, 255, 0.04);
  background-color: $color-white;
  box-shadow: $shadow-sm;
  flex-grow: 1;
  min-height: 0; // critical: lets the table box shrink in grid parent
  padding-bottom: $spacing-md;
  @include custom-scrollbar(6px);

  @include tablet {
    overflow-y: visible;
  }
}

.notification-table {
  width: 100%;
  min-width: 900px;
  display: flex;
  flex-direction: column;

  @include desktop {
    min-width: 100%;
  }

  &__head {
    display: grid;
    // Cột Tiêu đề linh hoạt (1fr = chiếm phần còn lại)
    // Các cột khác dùng px cố định theo đúng nội dung bên trong
    grid-template-columns: 1fr 155px 190px 150px 120px 80px;
    background-color: var(--bg-card);
    border-bottom: 2px solid rgba(10, 101, 255, 0.04);
    font-weight: $font-weight-semibold;
    color: $color-text-muted;
    font-size: 12.6px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-left: 3px solid transparent; // aligned with row border
    position: sticky;
    top: 0;
    z-index: 10;
    
    @include tablet {
      display: none; // Hide table header on small screens
    }
  }

  &__th {
    padding: $spacing-md;
    @include flex-align;
    width: 100%;
    min-width: 0;
    white-space: nowrap;

    &--type { justify-content: center; }
    &--status { justify-content: center; }
    &--actions { justify-content: center; }
  }

  &__body {
    display: flex;
    flex-direction: column;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 155px 190px 150px 120px 80px;
    border-bottom: 1px solid transparent;
    border-left: 3px solid transparent;
    margin: 4px 8px;
    border-radius: $border-radius-lg;
    background-color: var(--bg-card);
    @include transition-smooth(background-color, transform, box-shadow, border-color);

    &:hover {
      background-color: var(--bg-card);
      transform: translateY(-2px) scale(1.002);
      box-shadow: 0 8px 20px rgba(10, 101, 255, 0.06);
      z-index: 1;
      position: relative;
    }

    &--unread {
      background-color: rgba(10, 101, 255, 0.02);
      border-left-color: $color-primary; // indicator color
      
      &:hover {
        background-color: var(--bg-card);
      }
      
      .notification-table__title-text {
        font-weight: $font-weight-bold;
        color: $color-text-main;
      }
    }

    @include tablet {
      display: flex;
      flex-direction: column;
      padding: $spacing-md;
      gap: $spacing-xs;
      border-bottom: 3px solid $color-border;
      background-color: var(--bg-card) !important;
      border-left: none;
    }
  }

  &__td {
    padding: $spacing-md;
    @include flex-align;
    font-size: $font-size-sm;
    color: $color-text-main;
    width: 100%;
    min-width: 0;

    &--title { 
      align-items: flex-start;
      gap: $spacing-md;
    }
    
    &--type { 
      justify-content: center; 
    }
    
    &--time { 
      color: $color-text-muted;
    }
    
    &--status { 
      justify-content: center; 
    }
    
    &--actions { 
      justify-content: center; 
    }

    @include tablet {
      padding: $spacing-xs 0;
      width: 100%;
      justify-content: space-between;

      &--title {
        flex: none;
        align-items: flex-start;
        border-bottom: 1px solid $color-border-light;
        padding-bottom: $spacing-sm;
        margin-bottom: $spacing-xs;
      }

      &--type, &--sender, &--time, &--status {
        flex: none;
        
        &::before {
          content: attr(data-label) ": ";
          font-weight: $font-weight-semibold;
          color: $color-text-muted;
          font-size: $font-size-xs;
        }
      }

      &--actions {
        flex: none;
        justify-content: flex-end;
        border-top: 1px solid $color-border-light;
        padding-top: $spacing-sm;
        margin-top: $spacing-xs;
      }
    }
  }

  // Row Column 1 Content
  &__type-icon {
    @include flex-center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;

    // Define colors for background circles
    &--general { background-color: $color-badge-general-bg; color: $color-badge-general; }
    &--meeting { background-color: $color-badge-meeting-bg; color: $color-badge-meeting; }
    &--rule { background-color: $color-badge-rule-bg; color: $color-badge-rule; }
    &--internal { background-color: $color-badge-internal-bg; color: $color-badge-internal; }
    &--train { background-color: $color-badge-train-bg; color: $color-badge-train; }
    &--task { background-color: $color-badge-task-bg; color: $color-badge-task; }
    &--system { background-color: $color-badge-system-bg; color: $color-badge-system; }
  }

  &__title-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }

  &__title-text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    line-height: 1.4;
    cursor: pointer;
    @include transition-smooth(color);
    @include truncate-single;

    &:hover {
      color: $color-primary;
    }

    @include tablet {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-weight: $font-weight-semibold;
    }
  }

  &__summary-text {
    font-size: $font-size-xs;
    color: $color-text-muted;
    line-height: 1.4;
    @include truncate-single;

    @include tablet {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  // Column 3 Sender Content
  &__sender-info {
    @include flex-align;
    gap: $spacing-sm;
  }

  &__sender-avatar {
    @include flex-center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 11.5px;
    font-weight: $font-weight-bold;
    color: $color-white;
    flex-shrink: 0;

    &--general { background-color: $color-badge-general; }
    &--meeting { background-color: $color-badge-meeting; }
    &--rule { background-color: $color-badge-rule; }
    &--internal { background-color: $color-badge-internal; }
    &--train { background-color: $color-badge-train; }
    &--task { background-color: $color-badge-task; }
    &--system { background-color: $color-badge-system; }
  }

  &__sender-name {
    font-weight: $font-weight-medium;
    white-space: nowrap;
  }

  &__time-val {
    white-space: nowrap;
  }

  // Action Button
  &__action-btn {
    @include flex-center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: $color-text-light;
    background-color: transparent;
    border: none;
    cursor: pointer;
    @include transition-smooth(color, background-color);

    &:hover {
      color: $color-primary;
      background-color: $color-primary-light;
    }
  }

  &__empty {
    @include flex-center(column);
    padding: $spacing-xl * 1.5;
  }
}
</style>
