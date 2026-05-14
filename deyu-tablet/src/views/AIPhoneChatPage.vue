<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentsStore } from '@/stores/students'
import { useAiPhoneStore } from '@/stores/aiPhone'
import PageHeader from '@/components/layout/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const studentsStore = useStudentsStore()
const aiPhoneStore = useAiPhoneStore()

const chatAreaRef = ref<HTMLElement | null>(null)
const inputText = ref('')

// 获取学生信息
const studentId = computed(() => route.query.studentId as string)
const student = computed(() =>
  studentId.value ? studentsStore.getStudentById(studentId.value) : undefined
)
const studentName = computed(() => student.value?.name || '未知学生')

// 语音相关
let recognition: any = null
let synthesis: SpeechSynthesis | null = null
const voiceText = ref('') // 语音识别实时文本

// 初始化对话
onMounted(() => {
  if (!studentId.value) {
    router.replace('/ai-phone')
    return
  }
  aiPhoneStore.startConversation(studentId.value, studentName.value)
  synthesis = window.speechSynthesis
})

// 离开页面时沉淀记忆
onBeforeUnmount(() => {
  stopVoiceMode()
  aiPhoneStore.endConversation()
})

// 自动滚动到底部
watch(
  () => aiPhoneStore.currentMessages.length,
  () => {
    nextTick(() => {
      if (chatAreaRef.value) {
        chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
      }
    })
  }
)

// 发送文字消息
async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return
  inputText.value = ''
  const reply = await aiPhoneStore.sendMessage(text)

  // 语音模式下朗读AI回复
  if (aiPhoneStore.isVoiceMode && synthesis) {
    speakText(reply)
  }
}

// 语音朗读
function speakText(text: string) {
  if (!synthesis) return
  synthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 1.0
  utterance.pitch = 1.1
  synthesis.speak(utterance)
}

// 进入语音模式
function startVoiceMode() {
  const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognitionCtor) {
    alert('当前浏览器不支持语音识别，请使用Chrome浏览器')
    return
  }

  aiPhoneStore.isVoiceMode = true
  voiceText.value = ''

  recognition = new SpeechRecognitionCtor()
  recognition.lang = 'zh-CN'
  recognition.continuous = true
  recognition.interimResults = true

  recognition.onresult = (event: any) => {
    let interim = ''
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        final += transcript
      } else {
        interim += transcript
      }
    }

    if (final) {
      voiceText.value = ''
      handleVoiceInput(final)
    } else {
      voiceText.value = interim
    }
  }

  recognition.onerror = (event: any) => {
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      console.warn('语音识别错误:', event.error)
    }
  }

  recognition.onend = () => {
    // 语音模式下自动重启识别
    if (aiPhoneStore.isVoiceMode && recognition) {
      try {
        recognition.start()
      } catch (e) {
        // ignore
      }
    }
  }

  recognition.start()
}

// 处理语音输入
async function handleVoiceInput(text: string) {
  const reply = await aiPhoneStore.sendMessage(text)
  if (aiPhoneStore.isVoiceMode && synthesis) {
    speakText(reply)
  }
}

// 退出语音模式
function stopVoiceMode() {
  aiPhoneStore.isVoiceMode = false
  voiceText.value = ''

  if (recognition) {
    recognition.onend = null
    try { recognition.stop() } catch (e) { /* ignore */ }
    recognition = null
  }

  if (synthesis) {
    synthesis.cancel()
  }
}
</script>

<template>
  <div class="ai-phone-chat-page">
    <PageHeader :title="studentName + ' — AI对话'" :show-back="true" />

    <main class="main-content">
      <!-- 聊天区域 -->
      <div ref="chatAreaRef" class="chat-area">
        <div
          v-for="msg in aiPhoneStore.currentMessages"
          :key="msg.id"
          class="message"
          :class="msg.role"
        >
          <div v-if="msg.role === 'ai'" class="avatar">
            <span>🤖</span>
          </div>
          <div class="bubble">{{ msg.content }}</div>
        </div>

        <!-- AI正在输入 -->
        <div v-if="aiPhoneStore.isAiTyping" class="message ai">
          <div class="avatar"><span>🤖</span></div>
          <div class="bubble typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <!-- 语音识别实时文本 -->
        <div v-if="voiceText" class="message user">
          <div class="bubble voice-interim">{{ voiceText }}...</div>
        </div>
      </div>

      <!-- 语音模式覆盖层 -->
      <div v-if="aiPhoneStore.isVoiceMode" class="voice-overlay">
        <div class="voice-pulse-ring">
          <div class="pulse-circle"></div>
          <div class="pulse-circle delay-1"></div>
          <div class="pulse-circle delay-2"></div>
          <div class="mic-icon">🎙</div>
        </div>
        <div class="voice-hint">正在聆听...</div>
        <div v-if="voiceText" class="voice-live-text">{{ voiceText }}</div>
        <button class="hangup-btn" @click="stopVoiceMode">
          <span class="hangup-icon">📞</span>
          挂断
        </button>
      </div>

      <!-- 输入区域 -->
      <div v-if="!aiPhoneStore.isVoiceMode" class="input-area">
        <input
          v-model="inputText"
          type="text"
          class="chat-input"
          placeholder="输入你想说的话..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
          发送
        </button>
        <button class="mic-btn" @click="startVoiceMode" title="语音通话">
          🎙
        </button>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.ai-phone-chat-page {
  min-height: 100vh;
  background: $gray-100;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: calc(80px + $safe-area-bottom);

  @media (min-width: $breakpoint-md) {
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
  }
}

// ---- 聊天区域 ----
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
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

  &.voice-interim {
    opacity: 0.6;
    font-style: italic;
  }
}

// typing动画
.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 14px 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $gray-400;
  animation: dotBounce 1.4s ease-in-out infinite;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

// ---- 输入区域 ----
.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  padding: 12px 15px;
  padding-bottom: calc(12px + $safe-area-bottom);
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  @media (min-width: $breakpoint-md) {
    position: relative;
    box-shadow: none;
    padding: 12px 15px;
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
  padding: 0 20px;
  height: 45px;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}

.mic-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid $primary;
  background: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;

  &:active {
    background: $primary;
    transform: scale(0.95);
  }
}

// ---- 语音模式 ----
.voice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  gap: 24px;
}

.voice-pulse-ring {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s ease-out infinite;

  &.delay-1 { animation-delay: 0.5s; }
  &.delay-2 { animation-delay: 1s; }
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

.mic-icon {
  font-size: 50px;
  z-index: 1;
}

.voice-hint {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.voice-live-text {
  font-size: 16px;
  color: white;
  max-width: 80%;
  text-align: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-md;
}

.hangup-btn {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 36px;
  background: #F44336;
  color: white;
  border: none;
  border-radius: $radius-full;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;

  .hangup-icon {
    display: inline-block;
    transform: rotate(135deg);
    font-size: 20px;
  }
}
</style>
