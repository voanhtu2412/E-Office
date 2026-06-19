<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--block': block }
    ]"
    :type="type"
    v-on="$attrs"
  >
    <span v-if="$slots.iconLeft" class="base-button__icon base-button__icon--left">
      <slot name="iconLeft"></slot>
    </span>
    <span class="base-button__content">
      <slot></slot>
    </span>
    <span v-if="$slots.iconRight" class="base-button__icon base-button__icon--right">
      <slot name="iconRight"></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    block: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    }
  }
}
</script>

<style lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family;
  font-weight: $font-weight-medium;
  border-radius: $border-radius-md;
  cursor: pointer;
  @include transition-smooth(background-color, border-color, color, box-shadow);
  border: 1px solid transparent;
  outline: none;
  white-space: nowrap;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    
    &--left {
      margin-right: $spacing-sm;
    }
    
    &--right {
      margin-left: $spacing-sm;
    }
  }

  // Sizes
  &--sm {
    padding: 6px 12px;
    font-size: $font-size-xs;
    border-radius: $border-radius-sm;
  }

  &--md {
    padding: 10px 18px;
    font-size: $font-size-sm;
  }

  &--lg {
    padding: 12px 24px;
    font-size: $font-size-base;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  // Variants
  &--primary {
    background-color: $color-primary;
    color: $color-white;
    
    &:hover {
      background-color: $color-primary-hover;
      box-shadow: 0 4px 12px rgba($color-primary, 0.2);
    }
  }

  &--secondary {
    background-color: $color-primary-light;
    color: $color-primary;
    
    &:hover {
      background-color: darken($color-primary-light, 3%);
    }
  }

  &--outline {
    background-color: transparent;
    border-color: $color-primary;
    color: $color-primary;
    
    &:hover {
      background-color: $color-primary-light;
    }
  }

  &--text {
    background-color: transparent;
    color: $color-text-muted;
    padding-left: $spacing-xs;
    padding-right: $spacing-xs;
    
    &:hover {
      color: $color-primary;
      background-color: $color-border-light;
    }
  }
}
</style>
