const { getBoard, getUsersFromBoard, addNotification } = require('./pimex')
const { db } = require('./db')

const validate = async (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [boardId, token] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':')
  if (!boardId || !token) {
    return res.status(401).json({
      error: 'User or password is empty'
    })
  }
  try {
    const boardData = await getBoard(boardId)
    if (boardData.token !== token)
      return res.status(401).json({
        error: 'Token not valid'
      })
    return next()
  } catch (e) {
    return res.status(401).json({
      error: 'Something went wrong'
    })
  }
}

const sendNotification = async (boardId, message) => {
  const { data } = await getUsersFromBoard(boardId)
  const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  const addNotifications = async () => {
    for (const user of data) {
      await sleep(300)
      await addNotification(user.ID, {
        title: `Tienes nuevos mensajes de ${boardId}`,
        message: message,
        user: user.ID,
        style: {
          button: {
            text: 'Ir a los chats',
            path: `/board/${boardId}/chats`
          },
          icon: 'mdi mdi-forum'
        },
        event: 'chat.message.received'
      })
    }
  }
  await addNotifications()
  return data
}

module.exports = {
    validate,
    sendNotification
}
