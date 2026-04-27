import { ref, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import type { WsMessage, ReviewSyncPayload } from '../types'

export function useWebSocket(wsUrl?: string) {
  const WS_URL = wsUrl || import.meta.env.VITE_WS_URL || 'ws://localhost:3001'

  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<WsMessage | null>(null)

  function connect() {
    if (socket.value?.connected) return

    socket.value = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('WebSocket connected')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    })

    socket.value.on('message', (data: WsMessage) => {
      lastMessage.value = data
    })

    // 监听得分更新
    socket.value.on('score_update', (data) => {
      lastMessage.value = { type: 'score_update', payload: data }
    })

    // 监听作业提交
    socket.value.on('homework_submit', (data) => {
      lastMessage.value = { type: 'homework_submit', payload: data }
    })

    // 监听排行榜更新
    socket.value.on('ranking_update', (data) => {
      lastMessage.value = { type: 'ranking_update', payload: data }
    })

    // 监听点评同步
    socket.value.on('review_sync', (data) => {
      lastMessage.value = { type: 'review_sync', payload: data }
    })
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  function emit(event: string, data: unknown) {
    if (socket.value?.connected) {
      socket.value.emit(event, data)
    }
  }

  function joinClass(classId: string) {
    emit('join_class', { classId })
  }

  function leaveClass(classId: string) {
    emit('leave_class', { classId })
  }

  // 发送点评同步
  function sendReviewSync(payload: ReviewSyncPayload) {
    emit('review_sync', payload)
  }

  // 监听特定事件
  function on(event: string, callback: (data: unknown) => void) {
    socket.value?.on(event, callback)
  }

  function off(event: string, callback?: (data: unknown) => void) {
    socket.value?.off(event, callback)
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    lastMessage,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinClass,
    leaveClass,
    sendReviewSync
  }
}
