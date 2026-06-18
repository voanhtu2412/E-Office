<template>
  <div class="dashboard-grid">
    <!-- Row 1: 4 Statistics Cards -->
    <section class="stat-cards-container">
      <DashboardStatCard
        icon="fa-solid fa-briefcase"
        :title="$t('i18nDashboard.dashboard.my_work')"
        value="32"
        :trend-text="$t('i18nDashboard.dashboard.in_progress_tasks')"
        theme-class="blue-theme"
        :show-sparkline="true"
        sparkline-color="#0a65ff"
        sparkline-path="M0,24 L14,18 L28,21 L42,13 L56,16 L70,9 L84,12 L100,6"
      />

      <DashboardStatCard
        icon="fa-solid fa-file-invoice"
        :title="$t('i18nDashboard.dashboard.pending_documents')"
        value="16"
        trend-text="8%"
        trend-type="positive"
        theme-class="green-theme"
        :show-sparkline="true"
        sparkline-color="#2ed573"
        sparkline-path="M0,18 L13,15 L27,16 L40,22 L54,19 L68,13 L82,15 L100,8"
      />

      <DashboardStatCard
        icon="fa-solid fa-shield-halved"
        :title="$t('i18nDashboard.dashboard.approvals')"
        value="09"
        trend-text="12%"
        trend-type="positive"
        theme-class="orange-theme"
        :show-sparkline="true"
        sparkline-color="#ff9f43"
        sparkline-path="M0,23 L12,21 L25,24 L39,22 L52,25 L65,18 L78,10 L90,7 L100,15"
      />

      <DashboardStatCard
        icon="fa-solid fa-bell"
        :title="$t('i18nDashboard.dashboard.new_notifications')"
        value="23"
        trend-text="15%"
        trend-type="positive"
        theme-class="purple-theme"
        view-all-url="javascript:void(0)"
      />
    </section>

    <!-- Main Content Core Layout: Left column (Charts/Shortcuts) & Right column (Notifications/Schedule) -->
    <div class="core-layout">
      <!-- Left Main Area -->
      <div class="core-left">
        <!-- Grid of charts -->
        <div class="charts-row">
          <!-- Line Chart Card -->
          <div class="dashboard-card chart-card">
            <div class="card-header-row">
              <h2>{{ $t('i18nDashboard.dashboard.active_dashboard') }}</h2>
              <div class="dropdown-select">
                <span>{{ $t('i18nDashboard.dashboard_page.this_week') }}</span>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            <div class="chart-body">
              <ActivityLineChart />
            </div>
          </div>

          <!-- Donut Chart Card -->
          <div class="dashboard-card chart-card">
            <div class="card-header-row">
              <h2>{{ $t('i18nDashboard.dashboard.work_ratio') }}</h2>
            </div>
            <div class="chart-body">
              <TaskDonutChart />
            </div>
          </div>
        </div>

        <!-- Functional Shortcuts -->
        <div class="dashboard-card shortcuts-card">
          <div class="card-header-row">
            <h2>{{ $t('i18nDashboard.dashboard.functional_shortcuts') }}</h2>
          </div>
          <div class="shortcuts-grid">
            <DashboardShortcut
              icon="fa-solid fa-network-wired"
              :label="$t('i18nDashboard.dashboard.process')"
              gradient-class="gradient-blue"
            />
            <DashboardShortcut
              icon="fa-solid fa-shield-halved"
              :label="$t('i18nDashboard.dashboard.approvals')"
              gradient-class="gradient-green"
              :badge-count="5"
            />
            <DashboardShortcut
              icon="fa-solid fa-folder-open"
              :label="$t('i18nDashboard.dashboard.documents')"
              gradient-class="gradient-blue-light"
            />
            <DashboardShortcut
              icon="fa-solid fa-clock-rotate-left"
              :label="$t('i18nDashboard.dashboard.attendance')"
              gradient-class="gradient-green-light"
            />
            <DashboardShortcut
              icon="fa-solid fa-people-group"
              :label="$t('i18nDashboard.dashboard.meeting_room')"
              gradient-class="gradient-purple"
            />
            <DashboardShortcut
              icon="fa-solid fa-cubes"
              :label="$t('i18nDashboard.dashboard.assets_store')"
              gradient-class="gradient-blue-dark"
            />
            <DashboardShortcut
              icon="fa-solid fa-headset"
              :label="$t('i18nDashboard.dashboard.support')"
              gradient-class="gradient-purple-light"
            />
          </div>
        </div>

        <!-- Quick Statistics Row -->
        <div class="dashboard-card quick-stats-card">
          <div class="card-header-row">
            <h2>{{ $t('i18nDashboard.dashboard.quick_statistics') }}</h2>
          </div>
          <div class="quick-stats-grid">
            <div class="quick-stat-item">
              <div class="stat-icon-wrapper icon-blue">
                <i class="fa-solid fa-folder-closed"></i>
              </div>
              <div class="stat-info">
                <div class="label">{{ $t('i18nDashboard.dashboard.archived_documents') }}</div>
                <div class="num-row">
                  <span class="val">1.245</span>
                  <span class="trend positive">+23%</span>
                </div>
              </div>
            </div>

            <div class="quick-stat-item">
              <div class="stat-icon-wrapper icon-green">
                <i class="fa-solid fa-user-check"></i>
              </div>
              <div class="stat-info">
                <div class="label">{{ $t('i18nDashboard.dashboard.online_users') }}</div>
                <div class="num-row">
                  <span class="val">128</span>
                </div>
              </div>
            </div>

            <div class="quick-stat-item">
              <div class="stat-icon-wrapper icon-blue-light">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div class="stat-info-progress">
                <div class="label-row">
                  <span class="label">{{ $t('i18nDashboard.dashboard.used_capacity') }}</span>
                  <span class="val">68%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-bar" style="width: 68%;"></div>
                </div>
              </div>
            </div>

            <div class="quick-stat-item">
              <div class="stat-icon-wrapper icon-purple">
                <i class="fa-solid fa-stopwatch-20"></i>
              </div>
              <div class="stat-info">
                <div class="label">{{ $t('i18nDashboard.dashboard.saved_time') }}</div>
                <div class="num-row">
                  <span class="val">320h</span>
                  <span class="trend positive">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Sidebar Area -->
      <div class="core-center">
        <!-- New Notifications List -->
        <div class="dashboard-card sidebar-list-card">
          <div class="card-header-row">
            <h2>{{ $t('i18nDashboard.dashboard.new_notifications') }}</h2>
            <a href="javascript:void(0)" class="view-all-link">{{ $t('i18nDashboard.dashboard.view_all') }}</a>
          </div>
          <div class="notifications-list">
            <DashboardNotificationItem
              icon="fa-solid fa-cubes"
              icon-theme-class="icon-blue"
              :title="$t('i18nDashboard.dashboard_page.notifications.item1_title')"
              :sender="$t('i18nDashboard.dashboard_page.notifications.item1_sender')"
              :time-text="$t('i18nDashboard.dashboard_page.notifications.time_5m')"
            />
            <DashboardNotificationItem
              icon="fa-solid fa-file-invoice"
              icon-theme-class="icon-green"
              :title="$t('i18nDashboard.dashboard_page.notifications.item2_title')"
              :sender="$t('i18nDashboard.dashboard_page.notifications.item2_sender')"
              :time-text="$t('i18nDashboard.dashboard_page.notifications.time_15m')"
            />
            <DashboardNotificationItem
              icon="fa-solid fa-calendar-check"
              icon-theme-class="icon-purple"
              :title="$t('i18nDashboard.dashboard_page.notifications.item3_title')"
              :sender="$t('i18nDashboard.dashboard_page.notifications.item3_sender')"
              :time-text="$t('i18nDashboard.dashboard_page.notifications.time_30m')"
            />
            <DashboardNotificationItem
              icon="fa-solid fa-signature"
              icon-theme-class="icon-green-light"
              :title="$t('i18nDashboard.dashboard_page.notifications.item4_title')"
              :sender="$t('i18nDashboard.dashboard_page.notifications.item4_sender')"
              :time-text="$t('i18nDashboard.dashboard_page.notifications.time_45m')"
            />
          </div>
        </div>

        <!-- Today's Schedule Timeline -->
        <div class="dashboard-card sidebar-list-card schedule-card">
          <div class="card-header-row">
            <h2>{{ $t('i18nDashboard.dashboard.today_schedule') }}</h2>
            <div class="schedule-header-right">
              <span class="date-lbl">14/04/2024</span>
              <button class="add-event-btn"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <div class="schedule-timeline">
            <DashboardTimelineItem
              time-text="09:00"
              :title="$t('i18nDashboard.dashboard_page.schedule.item1_title')"
              :location="$t('i18nDashboard.dashboard_page.schedule.item1_loc')"
              :status-text="$t('i18nDashboard.dashboard.running')"
              status-type="running"
            />
            <DashboardTimelineItem
              time-text="11:00"
              :title="$t('i18nDashboard.dashboard_page.schedule.item2_title')"
              :location="$t('i18nDashboard.dashboard_page.schedule.item2_loc')"
              :status-text="$t('i18nDashboard.dashboard.upcoming')"
              status-type="upcoming"
            />
            <DashboardTimelineItem
              time-text="14:00"
              :title="$t('i18nDashboard.dashboard_page.schedule.item3_title')"
              :location="$t('i18nDashboard.dashboard_page.schedule.item3_loc')"
              location-icon="fa-solid fa-globe"
              :status-text="$t('i18nDashboard.dashboard.scheduled')"
              status-type="scheduled"
              :show-line="false"
            />
          </div>
        </div>
      </div>

      <!-- Right Sidebar Area (Tasks to Handle) -->
      <div class="core-right">
        <DashboardPendingTasks />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardStatCard from "@/components/dashboard/DashboardStatCard.vue";
import DashboardShortcut from "@/components/dashboard/DashboardShortcut.vue";
import DashboardNotificationItem from "@/components/dashboard/DashboardNotificationItem.vue";
import DashboardTimelineItem from "@/components/dashboard/DashboardTimelineItem.vue";
import ActivityLineChart from "@/components/dashboard/ActivityLineChart.vue";
import TaskDonutChart from "@/components/dashboard/TaskDonutChart.vue";
import DashboardPendingTasks from "@/components/dashboard/DashboardPendingTasks.vue";
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

// Row 1: Statistics Cards Layout
.stat-cards-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

// Charts Row
.charts-row {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
  gap: 16px;
  flex: 1;
  min-height: 0;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;

  .dropdown-select {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: $bg-light-gray;
    border: 1px solid $border-light;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    color: $text-medium;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: $border-light;
    }

    i {
      font-size: 9px;
      color: $text-muted;
    }
  }

  .chart-body {
    flex: 1;
    min-height: 180px;
    height: clamp(180px, 28vh, 250px);

    @media (max-width: 600px) {
      min-height: 210px;
      height: auto;
    }
  }
}

// Shortcuts styling
.shortcuts-card {
  flex-shrink: 0;

  .shortcuts-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 600px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 360px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

// Quick Statistics Styling
.quick-stats-card {
  flex-shrink: 0;

  .quick-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .quick-stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 12px;
    background-color: $bg-card-light;
    border: 1px solid $border-light;
    min-width: 0;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

    &:hover {
      background-color: $bg-white;
      border-color: $border-light;
      transform: translateY(-1px);
    }

    .stat-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;

      &.icon-blue {
        background-color: rgba(10, 101, 255, 0.1);
        color: $primary-color;
      }
      &.icon-green {
        background-color: rgba(46, 213, 115, 0.1);
        color: $success-color;
      }
      &.icon-blue-light {
        background-color: rgba(0, 210, 255, 0.1);
        color: #00d2ff;
      }
      &.icon-purple {
        background-color: rgba(140, 122, 230, 0.1);
        color: $purple-color;
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      
      .label {
        font-size: 11.5px;
        color: $text-light;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .num-row {
        display: flex;
        align-items: baseline;
        gap: 6px;

        .val {
          font-size: 16px;
          font-weight: 700;
          color: $text-dark;
        }

        .trend {
          font-size: 10px;
          font-weight: 700;
          
          &.positive {
            color: $success-color;
          }
        }
      }
    }

    .stat-info-progress {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;

      .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        font-size: 11.5px;

        .label {
          color: $text-light;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }

        .val {
          font-weight: 700;
          color: $text-dark;
          flex-shrink: 0;
        }
      }

      .progress-track {
        width: 100%;
        height: 6px;
        background-color: #edf2f7;
        border-radius: 3px;
        overflow: hidden;

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #0a65ff 0%, #00d2ff 100%);
          border-radius: 3px;
        }
      }
    }
  }
}

.schedule-card {
  flex: 1;
}

// Sidebar list details
.sidebar-list-card {
  .schedule-header-right {
    display: flex;
    align-items: center;
    gap: 10px;

    .date-lbl {
      font-size: 12px;
      color: $text-light;
      font-weight: 600;
    }

    .add-event-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: $primary-color;
      color: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: $primary-hover;
        transform: scale(1.1);
      }
    }
  }
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 4px;
}
</style>
