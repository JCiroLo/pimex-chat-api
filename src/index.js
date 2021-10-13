const express = require('express')
const cors = require('cors')
const app = express()
// const morgan = require('morgan')
const { validate } = require('./lib/utils')
const index = require('./routes/index')
const analytics = require('./routes/analytics')
const chats = require('./routes/chats')
const messages = require('./routes/messages')
const users = require('./routes/users')

app.use(cors())

app.use(express.json())
// app.use(morgan('dev'))
// app.use(validate)

// settings

app.set('port', process.env.PORT || 5000)

// middlewares

// routes
app.use('/', index)
app.use('/analytics', analytics)
app.use('/chats', chats)
app.use('/messages', messages)
app.use('/users', users)

app.listen(app.get('port'))
console.log('Server on port', app.get('port'))
