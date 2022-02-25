const express = require('express')
const cors = require('cors')
const http = require('http')
const morgan = require('morgan')
const socketio = require('socket.io')
const { validate } = require('./lib/utils')
const { fetchMessages, addMessage } = require('./models/messages')
const {
  fetchChats,
  updateChat,
  increaseUnreadMessages
} = require('./models/chats')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', socket => {
  socket.on('joinBoardChat', async ({ boardId }) => {
    socket.join('chat.' + boardId)
    const chats = await fetchChats(boardId)
    socket.emit('fetchChats', chats)
  })

  socket.on('joinChat', async ({ userId, chatId }) => {
    socket.join(chatId)

    const messages = await fetchMessages(chatId)

    socket.emit('fetchMessages', messages)
  })

  socket.on('readChat', async chatData => {
    const response = await updateChat(chatData)
    socket.emit('readChat', response)
  })

  socket.on('sendMessage', async ({ messageData }) => {
    const response = await addMessage(messageData)
    socket.broadcast.to(messageData.chatId).emit('getMessage', response)
  })
})

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
// app.use(validate)

// settings

app.set('port', process.env.PORT || 5000)

// middlewares

// routes
app.use('/', require('./routes/index'))
app.use('/analytics', require('./routes/analytics'))
app.use('/chats', require('./routes/chats'))
app.use('/messages', require('./routes/messages'))
app.use('/users', require('./routes/users'))
app.use('/leads', require('./routes/leads'))

server.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'))
})
