// API 配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 通用请求方法
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 用户相关 API
export const userApi = {
  login: (phone: string, code: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code })
    }),

  getTeacherInfo: () =>
    request('/teacher/info'),

  getClasses: () =>
    request('/teacher/classes')
}

// 学生相关 API
export const studentApi = {
  getStudents: (classId: string) =>
    request(`/class/${classId}/students`),

  getGroups: (classId: string) =>
    request(`/class/${classId}/groups`),

  addScore: (studentId: string, points: number, category: string) =>
    request('/score/add', {
      method: 'POST',
      body: JSON.stringify({ studentId, points, category })
    })
}

// 作业相关 API
export const homeworkApi = {
  getHomeworkList: (classId: string) =>
    request(`/class/${classId}/homework`),

  createHomework: (classId: string, data: { title: string; subject: string; deadline: string }) =>
    request('/homework/create', {
      method: 'POST',
      body: JSON.stringify({ classId, ...data })
    }),

  markSubmission: (homeworkId: string, studentId: string) =>
    request('/homework/submit', {
      method: 'POST',
      body: JSON.stringify({ homeworkId, studentId })
    })
}

// 排行榜相关 API
export const rankingApi = {
  getGroupRanking: (classId: string, period: string) =>
    request(`/ranking/group?classId=${classId}&period=${period}`),

  getPersonalRanking: (classId: string, period: string) =>
    request(`/ranking/personal?classId=${classId}&period=${period}`),

  getProgressRanking: (classId: string, period: string) =>
    request(`/ranking/progress?classId=${classId}&period=${period}`)
}
