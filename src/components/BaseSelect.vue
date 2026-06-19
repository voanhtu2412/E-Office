<template>
  <div class="base-select-wrapper">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="base-select"
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span class="base-select-icon">
      <svg width="12" height="7" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BaseSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true,
      // structure: [{ value: 'value1', label: 'label1' }]
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
}
</script>

<style lang="scss">
.base-select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.base-select {
  width: 100%;
  padding: 10px 36px 10px 16px;
  font-family: $font-family;
  font-size: $font-size-sm;
  color: $color-text-main;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  cursor: pointer;
  appearance: none; // Hides default arrow
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  @include transition-smooth(border-color, box-shadow);

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }

  &::placeholder {
    color: $color-text-light;
  }
}

.base-select-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
