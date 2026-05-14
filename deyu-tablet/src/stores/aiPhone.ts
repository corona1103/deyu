import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: number
}

export interface StudentMemory {
  summary: string
  lastTopic: string
  sessionCount: number
}

export const useAiPhoneStore = defineStore('aiPhone', () => {
  // 每个学生的对话记忆沉淀
  const studentMemories = reactive<Record<string, StudentMemory>>({})

  // 当前会话消息（临时）
  const currentMessages = ref<ChatMessage[]>([])

  // 当前对话的学生
  const currentStudentId = ref('')
  const currentStudentName = ref('')

  // 语音通话状态
  const isVoiceMode = ref(false)

  // AI正在回复
  const isAiTyping = ref(false)

  // 开始新对话
  function startConversation(studentId: string, studentName: string) {
    currentStudentId.value = studentId
    currentStudentName.value = studentName
    currentMessages.value = []

    const memory = studentMemories[studentId]
    let greeting: string

    if (memory && memory.sessionCount > 0) {
      // 有历史记忆，打招呼时引用
      greeting = `${studentName}同学你好呀！上次我们聊了关于"${memory.lastTopic}"的话题，${memory.summary}。今天想聊点什么呢？`
    } else {
      greeting = `${studentName}同学你好！我是你的AI小伙伴，有什么想和我聊聊的吗？比如学习上的困惑、和同学的相处，或者任何开心或不开心的事情都可以哦～`
    }

    currentMessages.value.push({
      id: Date.now().toString(),
      role: 'ai',
      content: greeting,
      timestamp: Date.now()
    })
  }

  // 发送消息并生成mock AI回复
  function sendMessage(content: string): Promise<string> {
    // 添加用户消息
    currentMessages.value.push({
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    })

    isAiTyping.value = true

    return new Promise((resolve) => {
      setTimeout(() => {
        const reply = generateMockReply(content, currentStudentName.value)
        currentMessages.value.push({
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: reply,
          timestamp: Date.now()
        })
        isAiTyping.value = false
        resolve(reply)
      }, 800 + Math.random() * 700)
    })
  }

  // Mock AI回复逻辑：关键词匹配 + 学生记忆上下文
  function generateMockReply(input: string, studentName: string): string {
    const memory = studentMemories[currentStudentId.value]
    const memoryContext = memory ? `（记得${studentName}之前聊过${memory.lastTopic}）` : ''

    if (input.includes('压力') || input.includes('紧张') || input.includes('焦虑')) {
      return `我能感受到你的压力。${studentName}，每个人都会有感到紧张的时候，这很正常。你能告诉我是什么事情让你感到压力最大吗？我们可以一起想想办法来缓解。`
    }
    if (input.includes('考试') || input.includes('成绩') || input.includes('分数')) {
      return `考试确实是大家都会关心的事情。${studentName}，成绩只是学习的一个反馈，不代表你的全部。你觉得最近在学习上有哪些进步呢？哪怕是很小的进步也值得肯定哦！`
    }
    if (input.includes('同学') || input.includes('朋友') || input.includes('吵架') || input.includes('欺负')) {
      return `和同学之间的关系确实很重要。${studentName}，能具体说说发生了什么吗？有时候换个角度想想，也许能发现不一样的解决方法。我愿意听你说。`
    }
    if (input.includes('开心') || input.includes('高兴') || input.includes('快乐')) {
      return `太好了！${studentName}，听到你开心我也很高兴！是什么让你这么开心呢？和我分享一下吧，快乐分享后会变得更多哦～`
    }
    if (input.includes('不想') || input.includes('讨厌') || input.includes('烦') || input.includes('无聊')) {
      return `${studentName}，我理解你现在的心情。每个人都会有不想做某些事的时候。你能告诉我具体是什么让你感到烦恼吗？也许我们可以找到一个让事情变得有趣一点的方法。`
    }
    if (input.includes('老师') || input.includes('爸爸') || input.includes('妈妈') || input.includes('家')) {
      return `家人和老师都是关心你的人呢。${studentName}，虽然有时候可能觉得他们不太理解你，但他们都是希望你好的。你想具体聊聊是什么事情吗？`
    }
    if (input.includes('梦想') || input.includes('未来') || input.includes('长大')) {
      return `哇，${studentName}有在想未来的事情呢，真棒！每个人的梦想都值得被尊重。你的梦想是什么呀？不管多大多小，只要坚持努力，都有可能实现哦！`
    }

    // 默认回复
    const defaults = [
      `${studentName}，谢谢你愿意和我分享。你能再多说说吗？我想更好地理解你的感受。`,
      `我听到了，${studentName}。这对你来说一定很重要吧。你觉得怎样做会让情况变得好一些呢？`,
      `${studentName}，你说的这些我都记住了。你平时遇到这样的事情通常会怎么做呢？`,
      `谢谢你的信任，${studentName}。每个人的感受都是有意义的。你有没有想过和信任的人聊聊呢？`,
    ]
    return defaults[Math.floor(Math.random() * defaults.length)]
  }

  // 结束对话，沉淀记忆
  function endConversation() {
    if (!currentStudentId.value || currentMessages.value.length <= 1) return

    // 提取用户消息用于摘要
    const userMessages = currentMessages.value
      .filter(m => m.role === 'user')
      .map(m => m.content)

    if (userMessages.length === 0) return

    // 简单摘要：取最后一条用户消息的关键内容作为lastTopic
    const lastUserMsg = userMessages[userMessages.length - 1]
    const topic = lastUserMsg.length > 15 ? lastUserMsg.slice(0, 15) + '...' : lastUserMsg

    // 简单摘要生成
    const summary = userMessages.length === 1
      ? '聊得不多但很有意义'
      : `一共交流了${userMessages.length}轮，聊得很开心`

    const existing = studentMemories[currentStudentId.value]
    studentMemories[currentStudentId.value] = {
      summary,
      lastTopic: topic,
      sessionCount: (existing?.sessionCount || 0) + 1
    }

    // 清理当前对话
    currentMessages.value = []
    currentStudentId.value = ''
    currentStudentName.value = ''
    isVoiceMode.value = false
  }

  return {
    studentMemories,
    currentMessages,
    currentStudentId,
    currentStudentName,
    isVoiceMode,
    isAiTyping,
    startConversation,
    sendMessage,
    endConversation,
  }
})
