<template>
  <span :class="['base-badge', `base-badge--${variant}`, { 'base-badge--has-dot': showDot }]">
    <span v-if="showDot" class="base-badge__dot"></span>
    <span class="base-badge__text">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'BaseBadge',
  props: {
    variant: {
      type: String,
      default: 'general',
      validator: (value) => [
        'primary', 'success', 'warning', 'danger', 'info', 'purple',
        'general', 'meeting', 'rule', 'internal', 'train', 'task', 'system'
      ].includes(value)
    },
    showDot: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  line-height: 1.2;
  white-space: nowrap;

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }

  // Variants mapped to variables
  &--primary {
    background-color: $color-primary-light;
    color: $color-primary;
    
    .base-badge__dot { 
      background-color: $color-primary; 
      animation: pulse-badge-blue 2s infinite;
    }
  }

  &--success {
    background-color: $color-success-bg;
    color: $color-success;
    .base-badge__dot { background-color: $color-success; }
  }

  &--warning {
    background-color: $color-warning-bg;
    color: $color-warning;
    .base-badge__dot { background-color: $color-warning; }
  }

  &--danger {
    background-color: $color-danger-bg;
    color: $color-danger;
    .base-badge__dot { background-color: $color-danger; }
  }

  &--info {
    background-color: $color-info-bg;
    color: $color-info;
    .base-badge__dot { background-color: $color-info; }
  }

  &--purple {
    background-color: $color-purple-bg;
    color: $color-purple;
    .base-badge__dot { background-color: $color-purple; }
  }

  // Category variants
  &--general {
    background-color: $color-badge-general-bg;
    color: $color-badge-general;
  }

  &--meeting {
    background-color: $color-badge-meeting-bg;
    color: $color-badge-meeting;
  }

  &--rule {
    background-color: $color-badge-rule-bg;
    color: $color-badge-rule;
  }

  &--internal {
    background-color: $color-badge-internal-bg;
    color: $color-badge-internal;
  }

  &--train {
    background-color: $color-badge-train-bg;
    color: $color-badge-train;
  }

  &--task {
    background-color: $color-badge-task-bg;
    color: $color-badge-task;
  }

  &--system {
    background-color: $color-badge-system-bg;
    color: $color-badge-system;
  }
}

html[data-theme="dark"] {
  .base-badge {
    &--general {
      background-color: rgba(37, 99, 235, 0.15);
      color: #60a5fa;
    }
    &--meeting {
      background-color: rgba(5, 150, 105, 0.15);
      color: #34d399;
    }
    &--rule {
      background-color: rgba(124, 58, 237, 0.15);
      color: #a78bfa;
    }
    &--internal {
      background-color: rgba(220, 38, 38, 0.15);
      color: #f87171;
    }
    &--train {
      background-color: rgba(234, 88, 12, 0.15);
      color: #fb923c;
    }
    &--task {
      background-color: rgba(8, 145, 178, 0.15);
      color: #22d3ee;
    }
    &--system {
      background-color: rgba(71, 85, 105, 0.15);
      color: #94a3b8;
    }
  }
}

@keyframes pulse-badge-blue {
  0% {
    box-shadow: 0 0 0 0 rgba(27, 85, 226, 0.5);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(27, 85, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(27, 85, 226, 0);
  }
}
</style>
