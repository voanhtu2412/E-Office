<template>
  <!-- All -->
  <svg v-if="name === 'all'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- General / Bell -->
  <svg v-else-if="name === 'general'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  
  <!-- Meeting / Calendar -->
  <svg v-else-if="name === 'meeting'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Rule / Shield -->
  <svg v-else-if="name === 'rule'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Internal / Gift Box -->
  <svg v-else-if="name === 'internal'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" :stroke-width="strokeWidth"/>
    <path d="M12 7V22M12 7C12 7 9.5 3 6.5 3C5.11929 3 4 4.11929 4 5.5C4 7 6.5 7 6.5 7M12 7C12 7 14.5 3 17.5 3C18.8807 3 20 4.11929 20 5.5C20 7 17.5 7 17.5 7" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Train / Graduation Cap -->
  <svg v-else-if="name === 'train'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 12.5V18.5C6 19.5 8.7 20.5 12 20.5C15.3 20.5 18 19.5 18 18.5V12.5" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round"/>
  </svg>

  <!-- Task / Target -->
  <svg v-else-if="name === 'task'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" :stroke-width="strokeWidth"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" :stroke-width="strokeWidth - 0.5"/>
    <circle cx="12" cy="12" r="2" stroke="currentColor" :stroke-width="strokeWidth - 0.5"/>
  </svg>

  <!-- System / Server & Desktop -->
  <svg v-else-if="name === 'system'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 21H16M12 17V21" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: 'NotificationIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 16
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  }
}
</script>
