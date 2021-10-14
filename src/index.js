const express = require('express')
const cors = require('cors')
const app = express()
// const morgan = require('morgan')
const { validate } = require('./lib/utils')

app.use(cors())

app.use(express.json())
// app.use(morgan('dev'))
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

app.listen(app.get('port'))
console.log('Server on port', app.get('port'))
