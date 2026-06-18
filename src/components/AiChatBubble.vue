<template>
  <div class="ai-chat-bubble-container">
    <!-- Floating Chat Bubble (FAB) -->
    <button
      class="ai-chat-bubble"
      type="button"
      :class="{ 'open': isOpen }"
      :aria-label="isOpen ? $t('chat.close_assistant') : $t('chat.open_assistant')"
      :title="isOpen ? $t('chat.close_assistant') : $t('chat.open_assistant')"
      @click="toggleChat"
    >
      <div class="bubble-inner">
        <i v-if="!isOpen" class="fa-solid fa-cube pulse-icon"></i>
        <i v-else class="fa-solid fa-xmark"></i>
      </div>
    </button>

    <!-- AI Chat Window -->
    <Transition name="chat-window">
      <div
        v-if="isOpen"
        class="ai-chat-window"
        :style="chatWindowStyle"
      >
      <!-- Header -->
      <div class="chat-header">
        <div class="header-avatar-area">
          <div class="ai-avatar">
            <i class="fa-solid fa-robot"></i>
            <span class="online-indicator"></span>
          </div>
          <div class="ai-info">
            <h3>{{ $t('chat.assistant_title') }}</h3>
            <span>{{ $t('chat.online') }}</span>
          </div>
        </div>
        <button class="close-chat-btn" type="button" :aria-label="$t('chat.close_assistant')" :title="$t('chat.close')" @click="toggleChat">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Messages Area -->
      <div ref="msgContainerRef" class="chat-messages">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="chat-msg-row"
          :class="msg.sender"
        >
          <div v-if="msg.sender === 'ai'" class="msg-avatar">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="msg-bubble">
            <p>{{ msg.text }}</p>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="chat-msg-row ai typing">
          <div class="msg-avatar">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="msg-bubble">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <form class="chat-input-bar" @submit.prevent="sendMessage">
        <input 
          v-model="userInput" 
          type="text" 
          :placeholder="$t('chat.placeholder')" 
          ref="inputRef"
        />
        <button type="submit" class="send-btn" :aria-label="$t('chat.send_message')" :title="$t('chat.send')" :disabled="!userInput.trim()">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const msgContainerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const viewportWidth = ref(window.innerWidth);
const viewportHeight = ref(window.innerHeight);

const isOpen = ref(false);
const isTyping = ref(false);
const userInput = ref('');

const messages = ref<Message[]>([
  {
    sender: 'ai',
    text: t('chat.welcome_msg'),
    time: formatTime(new Date())
  }
]);

const updateViewportSize = () => {
  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;
};

onMounted(() => {
  window.addEventListener('resize', updateViewportSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportSize);
});

// Dynamic Chat Window Position Math
const chatWindowStyle = computed(() => {
  const margin = 16;
  const chatWidth = Math.min(350, viewportWidth.value - margin * 2);
  const chatHeight = Math.min(480, viewportHeight.value - margin * 2);
  const left = Math.max(margin, viewportWidth.value - chatWidth - margin);
  const top = Math.max(margin, viewportHeight.value - chatHeight - 84);

  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${chatWidth}px`,
    height: `${chatHeight}px`
  };
});

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom();
      inputRef.value?.focus();
    });
  }
};

const scrollToBottom = () => {
  if (msgContainerRef.value) {
    msgContainerRef.value.scrollTop = msgContainerRef.value.scrollHeight;
  }
};

const sendMessage = () => {
  const text = userInput.value.trim();
  if (!text) return;

  // Add User Message
  messages.value.push({
    sender: 'user',
    text,
    time: formatTime(new Date())
  });

  userInput.value = '';
  nextTick(() => {
    scrollToBottom();
  });

  // AI Typing State
  isTyping.value = true;
  nextTick(() => {
    scrollToBottom();
  });

  // Mock AI Responses after timeout
  setTimeout(() => {
    isTyping.value = false;
    const aiResponse = getAIResponse(text);
    messages.value.push({
      sender: 'ai',
      text: aiResponse,
      time: formatTime(new Date())
    });
    nextTick(() => {
      scrollToBottom();
    });
  }, 1200);
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
    return t('chat.ai_resp_hello');
  }
  if (lower.includes('việc') || lower.includes('công việc') || lower.includes('task')) {
    return t('chat.ai_resp_work');
  }
  if (lower.includes('duyệt') || lower.includes('phê duyệt') || lower.includes('yêu cầu')) {
    return t('chat.ai_resp_approvals');
  }
  if (lower.includes('tài liệu') || lower.includes('văn bản') || lower.includes('hồ sơ')) {
    return t('chat.ai_resp_docs');
  }
  if (lower.includes('lịch') || lower.includes('họp') || lower.includes('meeting')) {
    return t('chat.ai_resp_calendar');
  }
  if (lower.includes('tài sản') || lower.includes('kho') || lower.includes('thiết bị')) {
    return t('chat.ai_resp_assets');
  }
  if (lower.includes('nhân sự') || lower.includes('nghỉ phép') || lower.includes('phép')) {
    return t('chat.ai_resp_hr');
  }
  
  return t('chat.ai_resp_default');
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.ai-chat-bubble {
  position: fixed;
  right: -10px;
  bottom: 28px;
  width: 46px;
  height: 44px;
  z-index: 9999;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  background: transparent;
  border: 0;
  padding: 0;
  transition: right 0.2s ease, transform 0.15s ease, opacity 0.2s ease;

  @media (max-width: 600px) {
    right: -8px;
    bottom: 20px;
    width: 44px;
    height: 42px;
  }

  &:hover,
  &:focus-visible {
    right: 0;

    @media (max-width: 600px) {
      right: 0;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: none;

    .bubble-inner {
      border-color: rgba(10, 101, 255, 0.5);
      box-shadow: 0 0 0 4px rgba(10, 101, 255, 0.14), 0 8px 32px rgba(10, 101, 255, 0.18);
    }
  }

  .bubble-inner {
    width: 100%;
    height: 100%;
    border-radius: 16px 0 0 16px;
    background-color: $bg-glass-bubble;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(10, 101, 255, 0.2);
    box-shadow: 0 8px 24px rgba(10, 101, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0a65ff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    padding: 0;
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.92);
      border-color: rgba(10, 101, 255, 0.34);
      box-shadow: 0 8px 28px rgba(10, 101, 255, 0.16);
      transform: translateY(-2px);
    }

    i {
      width: 28px;
      height: 28px;
      border-radius: 10px;
      background-color: rgba(10, 101, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .pulse-icon {
    animation: robotPulse 2s infinite ease-in-out;
  }
}

// AI Chat Window
.ai-chat-window {
  position: fixed;
  background-color: $bg-glass-chat;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(10, 101, 255, 0.18);
  box-shadow: 0 12px 36px rgba(10, 101, 255, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;

  @media (max-width: 480px) {
    border-radius: 14px;
  }
}

.chat-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(10, 101, 255, 0.78) 0%, rgba(0, 84, 214, 0.78) 100%);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-avatar-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ai-avatar {
    width: 36px;
    height: 36px;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .online-indicator {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 9px;
      height: 9px;
      background-color: #2ed573;
      border: 2px solid #0054d6;
      border-radius: 50%;
    }
  }

  .ai-info {
    h3 {
      font-size: 13px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.3px;
    }
    span {
      font-size: 10px;
      opacity: 0.85;
      font-weight: 500;
    }
  }

  .close-chat-btn {
    background: none;
    border: none;
    color: #ffffff;
    opacity: 0.8;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      opacity: 1;
    }

    &:focus-visible {
      background-color: rgba(255, 255, 255, 0.16);
      opacity: 1;
      outline: none;
    }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(10, 101, 255, 0.1);
    border-radius: 3px;
  }
}

.chat-msg-row {
  display: flex;
  gap: 10px;
  max-width: 85%;
  align-self: flex-start;

  .msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: rgba(10, 101, 255, 0.08);
    border: 1px solid rgba(10, 101, 255, 0.15);
    color: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
      flex-shrink: 0;
    }

  .msg-bubble {
    padding: 10px 12px;
    border-radius: 14px;
    border-top-left-radius: 2px;
    background-color: $bg-glass-msg;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: 0 2px 6px rgba(10, 101, 255, 0.03);
    border: 1px solid rgba(10, 101, 255, 0.05);

    p {
      font-size: 12.5px;
      line-height: 1.45;
      color: $text-dark;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .msg-time {
      font-size: 9px;
      color: $text-muted;
      display: block;
      text-align: right;
      margin-top: 4px;
    }
  }

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;

    .msg-bubble {
      background-color: rgba(10, 101, 255, 0.82);
      border-top-left-radius: 14px;
      border-top-right-radius: 2px;
      border: none;
      box-shadow: 0 4px 10px rgba(10, 101, 255, 0.15);

      p {
        color: #ffffff;
      }
      .msg-time {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.chat-input-bar {
  padding: 12px 14px;
  border-top: 1px solid rgba(10, 101, 255, 0.1);
  background-color: $bg-glass-input;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    flex: 1;
    border: 1px solid $border-light;
    background-color: $bg-light-gray;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 12.5px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: $primary-color;
      background-color: $bg-white;
      box-shadow: 0 0 0 2px rgba(10, 101, 255, 0.1);
    }
  }

  .send-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background-color: $primary-color;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: $primary-hover;
      transform: scale(1.05);
    }

    &:focus-visible {
      background-color: $primary-hover;
      outline: none;
    }

    &:disabled {
      background-color: #e2e8f0;
      color: $text-muted;
      cursor: not-allowed;
    }
  }
}

// Typing indicators
.typing {
  .msg-bubble {
    padding: 12px 16px;
  }
}
.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 12px;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: $text-light;
    animation: typingBounce 1.4s infinite ease-in-out both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

// Animations
@keyframes robotPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}



.chat-window-enter-active,
.chat-window-leave-active {
  transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, opacity;
}
.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}
.chat-window-enter-to,
.chat-window-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}
</style>
