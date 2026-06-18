<template>
  <div class="line-chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import Chart from "chart.js/auto";

const { t, locale } = useI18n();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const buildChart = () => {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Create gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(10, 101, 255, 0.25)");
  gradient.addColorStop(1, "rgba(10, 101, 255, 0.0)");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        t('i18nDashboard.dashboard_page.chart.mon'),
        t('i18nDashboard.dashboard_page.chart.tue'),
        t('i18nDashboard.dashboard_page.chart.wed'),
        t('i18nDashboard.dashboard_page.chart.thu'),
        t('i18nDashboard.dashboard_page.chart.fri'),
        t('i18nDashboard.dashboard_page.chart.sat'),
        t('i18nDashboard.dashboard_page.chart.sun')
      ],
      datasets: [
        {
          label: t('i18nDashboard.dashboard_page.chart.work'),
          data: [42, 66, 38, 48, 45, 68, 60],
          borderColor: "#0a65ff",
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#0a65ff",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false, // Hide default tooltip since we draw a custom persistent one
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#86909c",
            font: {
              size: 11,
              family: "Outfit, Inter, sans-serif",
            },
          },
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            color: "#86909c",
            font: {
              size: 11,
              family: "Outfit, Inter, sans-serif",
            },
          },
          grid: {
            color: "rgba(134, 144, 156, 0.12)",
          },
          border: {
            display: false,
          },
        },
      },
    },
    plugins: [
      {
        id: "customTooltip",
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const index = 3; // Thursday (Thứ 5) is index 3
          const meta = chart.getDatasetMeta(0);
          if (!meta.data[index]) return;
          const { x: ptX, y: ptY } = meta.data[index];

          ctx.save();
          const text = locale.value === 'vi' ? 'Thứ 5 / 76 công việc' : 'Thu / 76 tasks';
          ctx.font = "bold 11px Outfit, Inter, sans-serif";
          const textWidth = ctx.measureText(text).width;
          const paddingX = 10;
          const rectWidth = textWidth + paddingX * 2;
          const rectHeight = 24;
          const rectX = ptX - rectWidth / 2;
          const rectY = ptY - rectHeight - 10;

          // Draw blue tooltip box shadow
          ctx.shadowColor = "rgba(10, 101, 255, 0.4)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 3;

          // Draw tooltip background
          ctx.fillStyle = "#0a65ff";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(rectX, rectY, rectWidth, rectHeight, 6);
          } else {
            // Fallback for older browsers
            ctx.rect(rectX, rectY, rectWidth, rectHeight);
          }
          ctx.fill();

          // Draw caret pointing down
          ctx.shadowColor = "transparent";
          ctx.beginPath();
          ctx.moveTo(ptX - 6, rectY + rectHeight);
          ctx.lineTo(ptX + 6, rectY + rectHeight);
          ctx.lineTo(ptX, rectY + rectHeight + 5);
          ctx.closePath();
          ctx.fill();

          // Draw text inside tooltip
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(text, ptX, rectY + rectHeight / 2 + 1);
          ctx.restore();
        },
      },
    ],
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
.line-chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
