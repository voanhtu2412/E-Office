<template>
  <Teleport to="body">
    <Transition name="dir-modal-fade">
      <div v-if="modelValue" class="dir-modal-backdrop" @click.self="handleClose">
        <div
          class="dir-modal-container"
          :class="`dir-modal-${size}`"
          role="dialog"
          :aria-label="title"
        >
          <!-- Header -->
          <div class="dir-modal-header">
            <h3 class="dir-modal-title">{{ title }}</h3>
            <button class="dir-modal-close-btn" @click="handleClose" aria-label="Đóng">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="dir-modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="dir-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  /** Kích thước: sm | md | lg | xl | full */
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v),
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
/* Transition */
.dir-modal-fade-enter-active,
.dir-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dir-modal-fade-enter-active .dir-modal-container,
.dir-modal-fade-leave-active .dir-modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.dir-modal-fade-enter-from,
.dir-modal-fade-leave-to {
  opacity: 0;
}
.dir-modal-fade-enter-from .dir-modal-container {
  transform: scale(0.96) translateY(-10px);
  opacity: 0;
}
.dir-modal-fade-leave-to .dir-modal-container {
  transform: scale(0.96);
  opacity: 0;
}
</style>
