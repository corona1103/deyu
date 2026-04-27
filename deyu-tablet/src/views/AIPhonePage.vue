<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { BaseCard, BaseAvatar, BaseButton } from '@/components/common'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

const messages = ref<Message[]>([
  { id: '1', role: 'ai', content: '你好！我是AI心理辅导助手，有什么想和我聊聊的吗？' },
])

const inputText = ref('')

function sendMessage() {
  if (!inputText.value.trim()) return

  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: inputText.value
  })

  const userInput = inputText.value
  inputText.value = ''

  // Mock AI回复
  setTimeout(() => {
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: `我理解你的感受。${userInput.includes('压力') ? '学习压力是很常见的，让我们一起想办法缓解。' : '你能具体说说是什么让你感到困扰吗？'}`
    })
  }, 1000)
}
</script>

<template>
  <div class="ai-phone-page">
    <PageHeader title="AI电话亭" />

    <main class="main-content">
      <!-- 聊天区域 -->
      <div class="chat-area">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message"
          :class="msg.role"
        >
          <div v-if="msg.role === 'ai'" class="avatar">
            <span>🤖</span>
          </div>
          <div class="bubble">{{ msg.content }}</div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <input
          v-model="inputText"
          type="text"
          class="chat-input"
          placeholder="输入你想说的话..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" @click="sendMessage">
          发送
        </button>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.ai-phone-page {
  min-height: 100vh;
  background: $gray-100;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  padding-bottom: calc(80px + $safe-area-bottom);

  @media (min-width: $breakpoint-md) {
    padding: 20px 40px;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
  }
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  &.user {
    flex-direction: row-reverse;

    .bubble {
      background: linear-gradient(135deg, $primary, $primary-light);
      color: white;
    }
  }

  &.ai {
    .bubble {
      background: white;
      color: $gray-800;
    }
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E3F2FD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: $radius-lg;
  font-size: 15px;
  line-height: 1.5;
  box-shadow: $shadow-sm;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 15px;
  padding-bottom: calc(15px + $safe-area-bottom);
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  @media (min-width: $breakpoint-md) {
    position: relative;
    box-shadow: none;
    padding: 15px 0;
  }
}

.chat-input {
  flex: 1;
  height: 45px;
  border: 1px solid $gray-200;
  border-radius: $radius-full;
  padding: 0 20px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.send-btn {
  padding: 0 25px;
  height: 45px;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
