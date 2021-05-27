import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
})

io.on('connection', (socket) => {
    const { conversations } = socket.handshake.query
    conversations.map((conversation) => socket.join(conversation))

    socket.on('message', (conversation, message) => {
        socket.to(conversation).emit(message)
    })
})

httpServer.listen(3000)
