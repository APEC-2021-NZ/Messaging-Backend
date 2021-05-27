import { createServer } from 'http'
import express from 'express'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors)

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
})

io.on('connection', (socket) => {
    const { conversations } = socket.handshake.query
    conversations.map((conversation) => socket.join(conversation))

    socket.on('join', ({ conversation }) => {
        socket.join(conversation)
    })
    socket.on('message', ({ conversation, message }) => {
        socket.to(conversation).emit('message', { conversation, message })
    })
})

console.log('start server at http://localhost:3000')
httpServer.listen(process.env.PORT || 3000)
