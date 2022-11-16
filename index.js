import { Server } from 'socket.io'

const io = new Server({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001']
  }
})

let onlineAdmins = []

const addNewAdmin = (adminId, socketId) => {
  !onlineAdmins.some((admin) => admin.adminId === adminId) &&
    onlineAdmins.push({ adminId, socketId })
}

const removeAdmin = (socketId) => {
  onlineAdmins = onlineAdmins.filter((admin) => admin.socketId !== socketId)
}

const getAdmin = (adminId) => {
  return onlineAdmins.find((admin) => admin.adminId === adminId)
}

io.on('connection', (socket) => {
  socket.on('new-admin', (adminId) => {
    addNewAdmin(adminId, socket.id)
  })

  socket.on('send-notification', (data) => {
    if (!onlineAdmins.length) return
    onlineAdmins.forEach((admin) => {
      io.to(admin.socketId).emit('get-notification', data)
    })
  })

  socket.on('handle-disconnect', () => {
    removeAdmin(socket.id)
  })

  socket.on('disconnect', () => {
    removeAdmin(socket.id)
  })
})

io.listen(5000)
