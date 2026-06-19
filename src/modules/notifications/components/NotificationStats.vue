<template>
  <div class="notification-stats">
    <!-- Total Notifications -->
    <div class="notification-stats__card notification-stats__card--total">
      <div class="notification-stats__icon-wrapper">
        <!-- Megaphone Icon -->
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12C19 14.28 17.58 16.22 15.58 17M19 12C19 9.72 17.58 7.78 15.58 7M19 12H22M12 4L7 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H7L12 20V4ZM12 4V20V4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.58 7C16.92 8.1 17.75 9.8 17.75 11.7C17.75 13.6 16.92 15.3 15.58 16.4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="notification-stats__details">
        <span class="notification-stats__title">{{ $t('i18nDashboard.notification_page.stats.total') }}</span>
        <span class="notification-stats__value">{{ stats.total }}</span>
        <span class="notification-stats__label">{{ $t('i18nCommon.header.notifications') }}</span>
      </div>
    </div>

    <!-- Unread -->
    <div class="notification-stats__card notification-stats__card--unread">
      <div class="notification-stats__icon-wrapper">
        <!-- Paper Plane Icon -->
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="notification-stats__details">
        <span class="notification-stats__title">{{ $t('i18nDashboard.notification_page.stats.unread') }}</span>
        <span class="notification-stats__value">{{ stats.unread }}</span>
        <span class="notification-stats__label">{{ $t('i18nCommon.header.notifications') }}</span>
      </div>
    </div>

    <!-- Today -->
    <div class="notification-stats__card notification-stats__card--today">
      <div class="notification-stats__icon-wrapper">
        <!-- Calendar Icon -->
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7V3M16 7V3M3 11H21M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="7" y="14" width="2" height="2" rx="0.5" fill="white"/>
          <rect x="11" y="14" width="2" height="2" rx="0.5" fill="white"/>
          <rect x="15" y="14" width="2" height="2" rx="0.5" fill="white"/>
        </svg>
      </div>
      <div class="notification-stats__details">
        <span class="notification-stats__title">{{ $t('i18nDashboard.notification_page.stats.today') }}</span>
        <span class="notification-stats__value">{{ stats.today }}</span>
        <span class="notification-stats__label">{{ $t('i18nCommon.header.notifications') }}</span>
      </div>
    </div>

    <!-- Upcoming -->
    <div class="notification-stats__card notification-stats__card--upcoming">
      <div class="notification-stats__icon-wrapper">
        <!-- Clock Icon -->
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="notification-stats__details">
        <span class="notification-stats__title">{{ $t('i18nDashboard.notification_page.stats.upcoming') }}</span>
        <span class="notification-stats__value">{{ stats.upcoming }}</span>
        <span class="notification-stats__label">{{ $t('i18nCommon.header.notifications') }}</span>
      </div>
    </div>

    <!-- Read -->
    <div class="notification-stats__card notification-stats__card--read">
      <div class="notification-stats__icon-wrapper">
        <!-- Shield Check Icon -->
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="notification-stats__details">
        <span class="notification-stats__title">{{ $t('i18nDashboard.notification_page.stats.read') }}</span>
        <span class="notification-stats__value">{{ stats.read }}</span>
        <span class="notification-stats__label">{{ $t('i18nCommon.header.notifications') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationStats',
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        total: 128,
        unread: 24,
        today: 8,
        upcoming: 5,
        read: 104
      })
    }
  }
}
</script>

<style lang="scss">
.notification-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $spacing-md;
  width: 100%;

  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
  }

  &__card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: $border-radius-xl;
    background-color: $color-white;
    box-shadow: $shadow-sm;
    border: 1px solid rgba(10, 101, 255, 0.03);
    position: relative;
    overflow: hidden;
    z-index: 1;
    @include transition-smooth(transform, box-shadow, border-color);

    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      opacity: 0;
      z-index: -1;
      transition: opacity 0.4s ease;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-lg;
      border-color: transparent;
      &::before {
        opacity: 1;
      }
    }

    // Individual card colors based on screenshot
    &--total {
      background-image: linear-gradient(145deg, transparent 0%, rgba(10, 101, 255, 0.05) 100%);
      &::before { background-image: linear-gradient(145deg, rgba(10, 101, 255, 0.02) 0%, rgba(10, 101, 255, 0.08) 100%); }
      .notification-stats__icon-wrapper {
        background: linear-gradient(135deg, $color-primary 0%, lighten($color-primary, 15%) 100%);
        box-shadow: 0 6px 14px rgba($color-primary, 0.3);
      }
    }

    &--unread {
      background-image: linear-gradient(145deg, transparent 0%, rgba(46, 213, 115, 0.05) 100%);
      &::before { background-image: linear-gradient(145deg, rgba(46, 213, 115, 0.02) 0%, rgba(46, 213, 115, 0.08) 100%); }
      .notification-stats__icon-wrapper {
        background: linear-gradient(135deg, $color-success 0%, lighten($color-success, 10%) 100%);
        box-shadow: 0 6px 14px rgba($color-success, 0.3);
      }
    }

    &--today {
      background-image: linear-gradient(145deg, transparent 0%, rgba(255, 159, 67, 0.05) 100%);
      &::before { background-image: linear-gradient(145deg, rgba(255, 159, 67, 0.02) 0%, rgba(255, 159, 67, 0.08) 100%); }
      .notification-stats__icon-wrapper {
        background: linear-gradient(135deg, $color-warning 0%, lighten($color-warning, 15%) 100%);
        box-shadow: 0 6px 14px rgba($color-warning, 0.3);
      }
    }

    &--upcoming {
      background-image: linear-gradient(145deg, transparent 0%, rgba(140, 122, 230, 0.05) 100%);
      &::before { background-image: linear-gradient(145deg, rgba(140, 122, 230, 0.02) 0%, rgba(140, 122, 230, 0.08) 100%); }
      .notification-stats__icon-wrapper {
        background: linear-gradient(135deg, $color-purple 0%, lighten($color-purple, 12%) 100%);
        box-shadow: 0 6px 14px rgba($color-purple, 0.3);
      }
    }

    &--read {
      background-image: linear-gradient(145deg, transparent 0%, rgba(255, 59, 48, 0.05) 100%);
      &::before { background-image: linear-gradient(145deg, rgba(255, 59, 48, 0.02) 0%, rgba(255, 59, 48, 0.08) 100%); }
      .notification-stats__icon-wrapper {
        background: linear-gradient(135deg, $color-danger 0%, lighten($color-danger, 15%) 100%);
        box-shadow: 0 6px 14px rgba($color-danger, 0.3);
      }
    }

    @include mobile {
      padding: $spacing-sm;
      gap: $spacing-sm;
      
      &:last-child {
        grid-column: span 2;
      }
    }
  }

  &__icon-wrapper {
    @include flex-center;
    width: 42px;
    height: 42px;
    border-radius: $border-radius-md;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }

    @include mobile {
      width: 36px;
      height: 36px;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
  }

  &__value {
    font-size: 25.3px;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    line-height: 1.2;
    margin: 2px 0;

    @include mobile {
      font-size: 20.7px;
    }
  }

  &__label {
    font-size: $font-size-xs;
    color: $color-text-light;
  }
}
</style>
