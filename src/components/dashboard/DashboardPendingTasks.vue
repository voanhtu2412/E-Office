<template>
  <div class="dashboard-card pending-tasks-widget">
    <div class="card-header-row">
      <h2>{{ $t('i18nDashboard.dashboard.tasks_to_handle') }}</h2>
      <div class="actions-menu">
        <button class="header-action-btn" type="button" :title="$t('i18nDashboard.dashboard.settings')" :aria-label="$t('i18nDashboard.dashboard.settings')">
          <i class="fa-solid fa-sliders"></i>
        </button>
      </div>
    </div>
    
    <div class="pending-tasks-list">
      <div 
        v-for="(task, index) in tasks" 
        :key="index"
        class="pending-task-item"
        role="button"
        tabindex="0"
      >
        <div class="task-left">
          <div class="task-icon-wrapper" :class="task.themeClass">
            <i :class="task.icon"></i>
          </div>
          <div class="task-info">
            <span class="task-name">{{ $t(`i18nDashboard.dashboard.task_items.${task.key}`) }}</span>
            <span class="task-desc">{{ $t(`i18nDashboard.dashboard.task_items.${task.key}_desc`) }}</span>
          </div>
        </div>
        
        <div class="task-right">
          <span class="task-badge" :class="task.badgeClass">{{ task.count }}</span>
          <button class="action-btn" type="button" :class="task.themeClass">
            {{ $t(task.actionKey) }}
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface PendingTask {
  key: string;
  icon: string;
  count: number;
  themeClass: string;
  badgeClass: string;
  actionKey: string;
}

const tasks = ref<PendingTask[]>([
  {
    key: 'my_work',
    icon: 'fa-solid fa-briefcase',
    count: 12,
    themeClass: 'theme-blue',
    badgeClass: 'badge-red',
    actionKey: 'i18nDashboard.dashboard.view_details'
  },
  {
    key: 'pending_docs',
    icon: 'fa-solid fa-file-invoice',
    count: 16,
    themeClass: 'theme-green',
    badgeClass: 'badge-red',
    actionKey: 'i18nDashboard.dashboard.handle_now'
  },
  {
    key: 'approvals',
    icon: 'fa-solid fa-shield-halved',
    count: 9,
    themeClass: 'theme-orange',
    badgeClass: 'badge-orange',
    actionKey: 'i18nDashboard.dashboard.approve_now'
  },
  {
    key: 'assets',
    icon: 'fa-solid fa-laptop-house',
    count: 3,
    themeClass: 'theme-blue-light',
    badgeClass: 'badge-orange',
    actionKey: 'i18nDashboard.dashboard.check_now'
  },
  {
    key: 'hr',
    icon: 'fa-solid fa-users',
    count: 2,
    themeClass: 'theme-purple',
    badgeClass: 'badge-blue',
    actionKey: 'i18nDashboard.dashboard.view_details'
  },
  {
    key: 'meetings',
    icon: 'fa-solid fa-calendar-days',
    count: 4,
    themeClass: 'theme-purple',
    badgeClass: 'badge-blue',
    actionKey: 'i18nDashboard.dashboard.prepare_now'
  },
  {
    key: 'purchases',
    icon: 'fa-solid fa-cart-shopping',
    count: 5,
    themeClass: 'theme-orange',
    badgeClass: 'badge-orange',
    actionKey: 'i18nDashboard.dashboard.approve_now'
  },
  {
    key: 'probation',
    icon: 'fa-solid fa-user-tie',
    count: 1,
    themeClass: 'theme-green',
    badgeClass: 'badge-blue',
    actionKey: 'i18nDashboard.dashboard.review_now'
  },
  {
    key: 'weekly_reports',
    icon: 'fa-solid fa-chart-pie',
    count: 2,
    themeClass: 'theme-purple',
    badgeClass: 'badge-red',
    actionKey: 'i18nDashboard.dashboard.submit_now'
  }
]);
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.pending-tasks-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow: hidden;
}

.header-action-btn {
  background: none;
  border: none;
  color: $text-light;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(10, 101, 255, 0.05);
    color: $primary-color;
  }

  &:focus-visible {
    background-color: rgba(10, 101, 255, 0.05);
    color: $primary-color;
    outline: none;
  }

  i {
    font-size: 16.1px;
  }
}

.pending-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 6px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(10, 101, 255, 0.12);
    border-radius: 3px;
    &:hover {
      background-color: rgba(10, 101, 255, 0.25);
    }
  }
}

@media (max-width: 900px) {
  .pending-tasks-widget {
    max-height: 520px;
  }
}

.pending-task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: $bg-card-light;
  border: 1px solid $border-light;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover,
  &:focus-within,
  &:focus-visible {
    background-color: $bg-white;
    border-color: $border-light;
    box-shadow: 0 4px 12px rgba(10, 101, 255, 0.04);
    transform: translateY(-2px);
    outline: none;

    .task-right {
      .task-badge {
        opacity: 0;
        transform: translateY(-10px) scale(0.8);
        pointer-events: none;
      }

      .action-btn {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
    }
  }
}

.task-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0; // for text ellipsis
}

.task-icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17.3px;
  flex-shrink: 0;

  &.theme-blue {
    background-color: rgba(10, 101, 255, 0.1);
    color: $primary-color;
  }
  &.theme-green {
    background-color: rgba(46, 213, 115, 0.1);
    color: $success-color;
  }
  &.theme-orange {
    background-color: rgba(255, 159, 67, 0.1);
    color: $warning-color;
  }
  &.theme-blue-light {
    background-color: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
  }
  &.theme-purple {
    background-color: rgba(140, 122, 230, 0.1);
    color: $purple-color;
  }
}

.task-info {
  display: flex;
  flex-direction: column;
  min-width: 0;

  .task-name {
    font-size: 15px;
    font-weight: 700;
    color: $text-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .task-desc {
    font-size: 12.6px;
    color: $text-light;
    font-weight: 500;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.task-right {
  display: flex;
  align-items: center;
  position: relative;
  width: 88px;
  justify-content: flex-end;
  height: 28px;
  flex-shrink: 0;
}

.task-badge {
  font-size: 12.6px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  transition: all 0.2s ease;
  position: absolute;
  right: 0;

  &.badge-red {
    background-color: rgba(255, 71, 87, 0.1);
    color: $danger-color;
  }
  &.badge-orange {
    background-color: rgba(255, 159, 67, 0.1);
    color: $warning-color;
  }
  &.badge-blue {
    background-color: rgba(10, 101, 255, 0.1);
    color: $primary-color;
  }
}

.action-btn {
  font-size: 12.6px;
  font-weight: 700;
  padding: 5px 10px;
  width: 84px;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  i {
    font-size: 9.2px;
    transition: transform 0.2s ease;
  }

  &:hover {
    i {
      transform: translateX(2px);
    }
  }

  &.theme-blue {
    background-color: rgba(10, 101, 255, 0.05);
    color: $primary-color;
    border-color: rgba(10, 101, 255, 0.15);
    &:hover {
      background-color: $primary-color;
      color: #ffffff;
    }
  }
  &.theme-green {
    background-color: rgba(46, 213, 115, 0.05);
    color: $success-color;
    border-color: rgba(46, 213, 115, 0.15);
    &:hover {
      background-color: $success-color;
      color: #ffffff;
    }
  }
  &.theme-orange {
    background-color: rgba(255, 159, 67, 0.05);
    color: $warning-color;
    border-color: rgba(255, 159, 67, 0.15);
    &:hover {
      background-color: $warning-color;
      color: #ffffff;
    }
  }
  &.theme-blue-light {
    background-color: rgba(0, 210, 255, 0.05);
    color: #00beeb;
    border-color: rgba(0, 210, 255, 0.15);
    &:hover {
      background-color: #00d2ff;
      color: #ffffff;
    }
  }
  &.theme-purple {
    background-color: rgba(140, 122, 230, 0.05);
    color: $purple-color;
    border-color: rgba(140, 122, 230, 0.15);
    &:hover {
      background-color: $purple-color;
      color: #ffffff;
    }
  }
}

@media (max-width: 600px) {
  .pending-task-item {
    padding: 11px 12px;
  }

  .pending-task-item {
    &:active {
      background-color: #f0f3f8;
    }
  }

  .task-right {
    width: auto !important;
    gap: 8px;
  }

  .task-badge {
    position: static !important;
    opacity: 1 !important;
    transform: none !important;
    margin-right: 0;
  }

  .action-btn {
    position: static !important;
    opacity: 1 !important;
    transform: none !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
    width: auto !important;
    color: $text-muted !important;
    pointer-events: auto !important;
    font-size: 0 !important;

    i {
      font-size: 12.6px !important;
      color: $text-muted !important;
    }
  }
}
</style>
