<template>
  <div class="support-box">
    <!-- Support Header with Agent Icon -->
    <div class="support-box__header">
      <div class="support-box__agent-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 8 4.5 4.5 8 3" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M16 3C19.5 4.5 22 8 22 12" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M12 7C9.23858 7 7 9.23858 7 12V14C7 14.5523 7.44772 15 8 15H9C9.55228 15 10 14.5523 10 14V11C10 10.4477 9.55228 10 9 10H8C8 8.5 9.5 7.5 11 7.5" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 7C14.7614 7 17 9.23858 17 12V14C17 14.5523 16.5523 15 16 15H15C14.4477 15 14 14.5523 14 14V11C14 10.4477 14.4477 10 15 10H16C16 8.5 14.5 7.5 13 7.5" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="support-box__header-text">
        <h4 class="support-box__agent-name">Bộ phận Hành chính - Quản trị</h4>
        <span class="support-box__agent-desc">Chúng tôi luôn sẵn sàng hỗ trợ!</span>
      </div>
    </div>

    <!-- Support Info Fields -->
    <div class="support-box__body">
      <!-- Phone Line -->
      <div class="support-box__info-item">
        <span class="support-box__info-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4743 21.8325 20.7294C21.721 20.9846 21.5573 21.2137 21.352 21.4019C21.1468 21.59 20.9046 21.7331 20.6408 21.822C20.377 21.9108 20.0974 21.9436 19.82 21.91C16.7428 21.5756 13.787 20.5231 11.19 18.83C8.77382 17.293 6.72695 15.2462 5.19 12.83C3.48997 10.2203 2.43777 7.24823 2.11 4.15C2.07633 3.87351 2.10882 3.59473 2.20521 3.33177C2.30159 3.06882 2.45973 2.82758 2.66902 2.6239C2.87832 2.42023 3.13398 2.2587 3.41943 2.1502C3.70487 2.04169 4.01349 1.98869 4.32 1.99H7.32C7.80251 1.98516 8.26921 2.16035 8.63172 2.48236C8.99423 2.80438 9.22814 3.25103 9.29 3.74C9.4044 4.6366 9.62359 5.51737 9.94 6.37C10.0784 6.73711 10.1118 7.13524 10.0358 7.52119C9.95981 7.90714 9.77779 8.26478 9.51 8.55L8.24 9.82C9.663 12.3213 11.7387 14.397 14.26 15.82L15.53 14.55C15.8152 14.2822 16.1728 14.1002 16.5588 14.0242C16.9448 13.9482 17.3429 13.9816 17.71 14.12C18.5626 14.4364 19.4434 14.6556 20.34 14.77C20.8339 14.8329 21.2844 15.0707 21.6033 15.4383C21.9222 15.8059 22.0877 16.2783 22.06 16.77L22 16.92Z" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="support-box__info-text">024 3 123 4567</span>
      </div>

      <!-- Email Line -->
      <div class="support-box__info-item">
        <span class="support-box__info-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 6L12 13L2 6" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="support-box__info-text">hcns@osp.vn</span>
      </div>

      <!-- Office hours Line -->
      <div class="support-box__info-item">
        <span class="support-box__info-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1b55e2" stroke-width="1.5"/>
            <path d="M12 6V12L16 14" stroke="#1b55e2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="support-box__info-text">Thứ 2 - Thứ 6: 08:30 - 17:30</span>
      </div>
    </div>

    <!-- Action Support request Button -->
    <button class="support-box__btn" @click="$emit('support-request')">
      <svg class="support-box__btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Gửi yêu cầu hỗ trợ</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SupportBox',
  emits: ['support-request']
}
</script>

<style lang="scss">
.support-box {
  @include card-style;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  background: linear-gradient(135deg, $color-primary 0%, #3b82f6 50%, #8b5cf6 100%);
  color: $color-white;
  position: relative;
  overflow: hidden;

  // Add subtle glowing orb effect in the background
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(20px);
    border-radius: 50%;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: $spacing-sm;
    z-index: 1;
  }

  &__agent-icon {
    @include flex-center;
    width: 44px;
    height: 44px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    flex-shrink: 0;
    
    svg path {
      stroke: $color-white;
    }
  }

  &__header-text {
    display: flex;
    flex-direction: column;
    z-index: 1;
  }

  &__agent-name {
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    color: $color-white;
    line-height: 1.3;
  }

  &__agent-desc {
    font-size: 12.6px;
    color: rgba(255, 255, 255, 0.8);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &__info-item {
    @include flex-align;
    gap: $spacing-sm;
  }

  &__info-icon {
    @include flex-center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;

    svg path, svg circle {
      stroke: $color-white;
    }
  }

  &__info-text {
    font-size: $font-size-xs;
    color: $color-white;
    font-weight: $font-weight-medium;
  }

  &__btn {
    @include flex-center;
    gap: $spacing-sm;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: $color-white;
    border-radius: $border-radius-md;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    z-index: 1;
    @include transition-smooth(background-color, transform, border-color);

    &:hover {
      background-color: $color-white;
      color: $color-primary;
      transform: translateY(-2px);
    }
  }

  &__btn-icon {
    flex-shrink: 0;
  }
}
</style>
