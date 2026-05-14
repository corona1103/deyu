import { createServer } from 'http'
import { Server } from 'socket.io'

const PORT = process.env.WS_PORT || 3002

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log(`[ws] client connected: ${socket.id}`)

  // 加入班级房间
  socket.on('join_class', ({ classId }) => {
    socket.join(`class_${classId}`)
    console.log(`[ws] ${socket.id} joined class_${classId}`)
  })

  socket.on('leave_class', ({ classId }) => {
    socket.leave(`class_${classId}`)
  })

  // 指标配置同步：平板端 → 大屏端
  socket.on('indicator_config_sync', (data) => {
    console.log(`[ws] indicator_config_sync for class ${data.classId}`)
    socket.to(`class_${data.classId}`).emit('indicator_config_sync', data)
  })

  // 点评同步：平板端 → 大屏端
  socket.on('review_sync', (data) => {
    socket.broadcast.emit('review_sync', data)
  })

  socket.on('multi_review_sync', (data) => {
    socket.broadcast.emit('multi_review_sync', data)
  })

  socket.on('voice_review_sync', (data) => {
    socket.broadcast.emit('voice_review_sync', data)
  })

  socket.on('disconnect', () => {
    console.log(`[ws] client disconnected: ${socket.id}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`[ws] WebSocket server running on port ${PORT}`)
})
