<template>
  <div class="donut-chart-container">
    <div class="canvas-wrapper">
      <canvas ref="chartCanvas"></canvas>
      <div class="center-text">
        <span class="percentage">78%</span>
        <span class="label">{{ $t('i18nDashboard.dashboard.completed_tasks') }}</span>
      </div>
    </div>
    <div class="legend-list">
      <div class="legend-item">
        <div class="legend-label">
          <span class="dot dot-completed"></span>
          <span>{{ $t('i18nDashboard.dashboard.completed_tasks') }}</span>
        </div>
        <span class="legend-value">78%</span>
      </div>
      <div class="legend-item">
        <div class="legend-label">
          <span class="dot dot-inprogress"></span>
          <span>{{ $t('i18nDashboard.dashboard.in_progress_tasks') }}</span>
        </div>
        <span class="legend-value">16%</span>
      </div>
      <div class="legend-item">
        <div class="legend-label">
          <span class="dot dot-overdue"></span>
          <span>{{ $t('i18nDashboard.dashboard.overdue_tasks') }}</span>
        </div>
        <span class="legend-value">6%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import Chart from "chart.js/auto";

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
const { t, locale } = useI18n();

const buildChart = () => {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [t('i18nDashboard.dashboard.completed_tasks'), t('i18nDashboard.dashboard.in_progress_tasks'), t('i18nDashboard.dashboard.overdue_tasks')],
      datasets: [
        {
          data: [78, 16, 6],
          backgroundColor: ["#0a65ff", "#ffa502", "#ff4757"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      layout: {
        padding: 2,
      },
      interaction: {
        intersect: false,
        mode: "nearest",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
};

onMounted(() => {
  buildChart();
});

watch(locale, () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  buildChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.donut-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.canvas-wrapper {
  position: relative;
  width: clamp(132px, 58%, 170px);
  aspect-ratio: 1;
  height: auto;
  flex-shrink: 0;
  margin-bottom: 14px;

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  .percentage {
    font-size: clamp(22px, 2.1vw, 28px);
    font-weight: 700;
    color: $text-dark;
    line-height: 1.1;
  }

  .label {
    font-size: 12.6px;
    color: $text-light;
    font-weight: 500;
    margin-top: 4px;
    max-width: 84px;
    text-align: center;
    line-height: 1.2;
  }
}

.legend-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0 4px;
  min-width: 0;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: $text-medium;
  gap: 12px;
  min-width: 0;

  .legend-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    min-width: 0;

    span:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;

    &.dot-completed {
      background-color: #0a65ff;
    }
    &.dot-inprogress {
      background-color: #ffa502;
    }
    &.dot-overdue {
      background-color: #ff4757;
    }
  }

  .legend-value {
    font-weight: 600;
    color: $text-dark;
    flex-shrink: 0;
  }
}
</style>
