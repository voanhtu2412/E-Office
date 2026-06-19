<template>
  <!-- SearchBar.vue — Module-specific search input with debounce -->
  <div class="search-bar" :class="{ 'search-bar--focused': isFocused }">
    <!-- Search icon -->
    <svg class="search-bar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <!-- Input -->
    <input
      ref="inputRef"
      type="text"
      class="search-bar__input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.enter="emit('search', modelValue)"
      @keydown.escape="handleClear"
    />

    <!-- Clear button -->
    <button
      v-if="modelValue"
      class="search-bar__clear"
      @click="handleClear"
      aria-label="Xóa tìm kiếm"
      type="button"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Loading indicator -->
    <div v-if="loading" class="search-bar__loading">
      <svg class="search-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Tìm kiếm...',
  },
  debounce: {
    type: Number,
    default: 300,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const inputRef = ref(null)
const isFocused = ref(false)
let debounceTimer = null

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
  inputRef.value?.focus()
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 12px;
  height: 42px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-bar--focused {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}

.search-bar__icon {
  width: 17px;
  height: 17px;
  color: #94a3b8;
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13.5px;
  color: #0f172a;
  background: transparent;
  font-family: var(--font-family);
}

.search-bar__input::placeholder {
  color: #94a3b8;
}

.search-bar__clear {
  padding: 3px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  display: flex;
  transition: background 0.15s;
}

.search-bar__clear:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.search-bar__loading {
  display: flex;
  flex-shrink: 0;
}

.search-spinner {
  width: 16px;
  height: 16px;
  color: #2563eb;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
