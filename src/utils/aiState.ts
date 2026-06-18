import { ref } from 'vue';

const storageKey = 'eoffice-hide-ai';

// Load initial state from localStorage
const stored = localStorage.getItem(storageKey);
export const isAiHidden = ref(stored === 'true');

export const setAiHidden = (value: boolean) => {
  isAiHidden.value = value;
  localStorage.setItem(storageKey, String(value));
};
