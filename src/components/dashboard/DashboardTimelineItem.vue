<template>
  <div class="timeline-item" :class="statusType + '-status'">
    <div class="timeline-marker">
      <div class="marker-dot"></div>
      <div v-if="showLine" class="marker-line"></div>
    </div>
    <div class="timeline-time">{{ timeText }}</div>
    <div class="timeline-event">
      <div class="event-details">
        <h4>{{ title }}</h4>
        <p><i :class="locationIcon || 'fa-solid fa-map-pin'"></i> {{ location }}</p>
      </div>
      <span class="status-badge" :class="statusType">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  timeText: string;
  title: string;
  location: string;
  locationIcon?: string;
  statusText: string;
  statusType: 'running' | 'upcoming' | 'scheduled';
  showLine?: boolean;
}>(), {
  showLine: true
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
  padding-bottom: 20px;

  &:last-child {
    padding-bottom: 0;
  }

  .timeline-marker {
    width: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;

    .marker-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: $text-muted;
      border: 2px solid $bg-white;
      box-shadow: 0 0 0 2px $border-light;
      z-index: 2;
    }

    .marker-line {
      width: 2px;
      flex: 1;
      background-color: $border-light;
      z-index: 1;
      margin-top: 2px;
    }
  }

  .timeline-time {
    font-size: 14.4px;
    font-weight: 700;
    color: $text-light;
    width: 35px;
    text-align: right;
    padding-top: 1px;
    flex-shrink: 0;

    @media (max-width: 480px) {
      width: 42px;
    }
  }

  .timeline-event {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background-color: $bg-card-light;
    border-radius: 12px;
    border: 1px solid $border-light;
    min-width: 0;
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background-color: $bg-white;
      border-color: $border-light;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .event-details {
      min-width: 0;
      flex: 1;
      padding-right: 8px;

      h4 {
        font-size: 15px;
        font-weight: 700;
        color: $text-dark;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        font-size: 12.6px;
        color: $text-light;
        margin: 4px 0 0 0;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        i {
          font-size: 11.5px;
          color: $text-muted;
        }
      }
    }

    .status-badge {
      font-size: 11.5px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      flex-shrink: 0;

      &.running {
        background-color: rgba(10, 101, 255, 0.08);
        color: $primary-color;
      }
      &.upcoming {
        background-color: rgba(255, 159, 67, 0.08);
        color: $warning-color;
      }
      &.scheduled {
        background-color: rgba(46, 213, 115, 0.08);
        color: $success-color;
      }
    }
  }

  // Dot color mappings based on status type
  &.running-status {
    .timeline-marker .marker-dot {
      background-color: $primary-color;
      box-shadow: 0 0 0 2px rgba(10, 101, 255, 0.25);
    }
  }
  &.upcoming-status {
    .timeline-marker .marker-dot {
      background-color: $warning-color;
      box-shadow: 0 0 0 2px rgba(255, 159, 67, 0.25);
    }
  }
  &.scheduled-status {
    .timeline-marker .marker-dot {
      background-color: $success-color;
      box-shadow: 0 0 0 2px rgba(46, 213, 115, 0.25);
    }
  }
}
</style>
