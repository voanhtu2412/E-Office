<template>
  <div class="stat-card" :class="themeClass">
    <div class="card-icon-box">
      <i :class="icon"></i>
    </div>
    <div class="card-content">
      <div class="card-header-row">
        <h3>{{ title }}</h3>
        <a v-if="viewAllUrl" :href="viewAllUrl" class="view-all-link">{{ $t('dashboard.view_all') }}</a>
      </div>
      <div class="card-numbers">
        <span class="value">{{ value }}</span>
        <span
          v-if="trendText"
          class="trend-text"
          :class="{ 'positive': trendType === 'positive', 'negative': trendType === 'negative' }"
        >
          <i v-if="trendType === 'positive'" class="fa-solid fa-arrow-up trend-icon"></i>
          <i v-if="trendType === 'negative'" class="fa-solid fa-arrow-down trend-icon"></i>
          {{ trendText }}
        </span>
      </div>
    </div>
    <!-- Sparkline SVG -->
    <div v-if="showSparkline && sparklinePath" class="card-sparkline">
      <svg viewBox="0 0 100 30" width="100%" height="100%">
        <path
          :d="sparklinePath"
          fill="none"
          :stroke="sparklineColor || '#0a65ff'"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.1"
        ></path>
        <path
          :d="sparklinePath"
          fill="none"
          :stroke="sparklineColor || '#0a65ff'"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  value: string | number;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  themeClass?: string;
  showSparkline?: boolean;
  sparklineColor?: string;
  sparklinePath?: string;
  viewAllUrl?: string;
}>();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.stat-card {
  background-color: $bg-card;
  border-radius: $radius-lg;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: $card-shadow;
  border: 1px solid $border-light;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: $card-shadow-hover;
  }

  @media (max-width: 600px) {
    padding: 16px;
    gap: 12px;
  }

  .card-icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;

    @media (max-width: 600px) {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      font-size: 18px;
    }
  }

  .card-content {
    flex: 1;
    z-index: 1;
    min-width: 0;

    h3 {
      font-size: 13px;
      color: $text-light;
      font-weight: 500;
      margin: 0 0 6px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      min-width: 0;

      h3 {
        margin: 0;
      }
    }

    .view-all-link {
      font-size: 11px;
      color: $primary-color;
      text-decoration: none;
      font-weight: 600;
      flex-shrink: 0;
      
      &:hover {
        text-decoration: underline;
      }
    }

    .card-numbers {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;

      .value {
        font-size: 26px;
        font-weight: 700;
        color: $text-dark;
        line-height: 1;

        @media (max-width: 600px) {
          font-size: 24px;
        }
      }

      .trend-text {
        font-size: 11.5px;
        color: $text-muted;
        font-weight: 500;

        &.positive {
          color: $success-color;
          font-weight: 600;
        }

        &.negative {
          color: $danger-color;
          font-weight: 600;
        }

        .trend-icon {
          font-size: 9px;
          margin-right: 2px;
        }
      }
    }
  }

  .card-sparkline {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 82px;
    height: 32px;
    opacity: 0.8;

    @media (max-width: 480px) {
      width: 72px;
      opacity: 0.55;
    }
  }

  // Theme Gradients
  &.blue-theme {
    .card-icon-box {
      background: linear-gradient(135deg, #0a65ff 0%, #3b82f6 100%);
      box-shadow: 0 4px 10px rgba(10, 101, 255, 0.2);
    }
  }

  &.green-theme {
    .card-icon-box {
      background: linear-gradient(135deg, #2ed573 0%, #20bf6b 100%);
      box-shadow: 0 4px 10px rgba(46, 213, 115, 0.2);
    }
  }

  &.orange-theme {
    .card-icon-box {
      background: linear-gradient(135deg, #ff9f43 0%, #f0932b 100%);
      box-shadow: 0 4px 10px rgba(255, 159, 67, 0.2);
    }
  }

  &.purple-theme {
    .card-icon-box {
      background: linear-gradient(135deg, #8c7ae6 0%, #9c88ff 100%);
      box-shadow: 0 4px 10px rgba(140, 122, 230, 0.25);
    }
  }
}
</style>
