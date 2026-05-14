import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import type { WsMessage, ReviewSyncPayload } from '../types'

// ========== 模块级单例 ==========
const socket = ref<Socket | null>(null)
const isConnected = ref(false)
const lastMessage = ref<WsMessage | null>(null)
// 记住已加入的房间，断线重连后自动重新加入
const joinedClasses = new Set<string>()

export function useWebSocket(wsUrl?: string) {
  const WS_URL = wsUrl || import.meta.env.VITE_WS_URL || 'ws://localhost:3002'

  function connect() {
    if (socket.value?.connected) return
    // 如果 socket 已存在但断开，不要重复创建
    if (socket.value) return

    socket.value = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('[ws] connected')
      // 重连后自动重新加入所有班级房间
      joinedClasses.forEach(classId => {
        socket.value?.emit('join_class', { classId })
      })
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('[ws] disconnected')
    })

    socket.value.on('message', (data: WsMessage) => {
      lastMessage.value = data
    })

    socket.value.on('score_update', (data) => {
      lastMessage.value = { type: 'score_update', payload: data }
    })

    socket.value.on('homework_submit', (data) => {
      lastMessage.value = { type: 'homework_submit', payload: data }
    })

    socket.value.on('ranking_update', (data) => {
      lastMessage.value = { type: 'ranking_update', payload: data }
    })

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

  // 不检查 connected 状态 —— socket.io-client 会自动缓冲未连接时的消息
  function emit(event: string, data: unknown) {
    socket.value?.emit(event, data)
  }

  function joinClass(classId: string) {
    joinedClasses.add(classId)
    emit('join_class', { classId })
  }

  function leaveClass(classId: string) {
    joinedClasses.delete(classId)
    emit('leave_class', { classId })
  }

  function sendReviewSync(payload: ReviewSyncPayload) {
    emit('review_sync', payload)
  }

  function on(event: string, callback: (data: unknown) => void) {
    socket.value?.on(event, callback)
  }

  function off(event: string, callback?: (data: unknown) => void) {
    socket.value?.off(event, callback)
  }

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
