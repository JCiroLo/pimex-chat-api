const { db, firestore } = require('../lib/db.js')
const { sendNotification } = require('../lib/utils')
const { sendMessageToFacebook } = require('../lib/integrations')
const { getChatConfig } = require('./chat')
const mixpanel = require('../lib/mixpanel')

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

const addMessage = async data => {
  const boardId = data.boardId
  const res = await insertMessage(data)
  const { officeHours } = await getChatConfig(boardId)
  const currentDate = new Date()
  const currentDay = days[currentDate.getDay()]
  const currentSeconds =
    currentDate.getHours() * 3600 +
    currentDate.getMinutes() * 60 +
    currentDate.getSeconds()
  const ifDay = officeHours.find(oh => {
    return oh.days === currentDay
  })
  const ifAll = officeHours.find(oh => {
    return oh.days === 'all'
  })
  const ifWeekDays = officeHours.find(oh => {
    return oh.days === 'weekdays'
  })

  const ifWeekendDays = officeHours.find(oh => {
    return oh.days === 'weekends'
  })
  if (typeof ifDay === 'object') {
    addBotMessage(data, ifDay, currentSeconds)
  } else if (typeof ifAll === 'object') {
    addBotMessage(data, ifAll, currentSeconds)
  } else if (
    typeof ifWeekDays === 'object' &&
    currentDay !== 'sunday' &&
    currentDay !== 'saturday'
  ) {
    addBotMessage(data, ifWeekDays, currentSeconds)
  } else if (
    typeof ifWeekendDays === 'object' &&
    currentDay === 'sunday' &&
    currentDay === 'saturday'
  ) {
    addBotMessage(data, ifWeekendDays, currentSeconds)
  }
  return res
}
const insertMessage = async data => {
  const increment = firestore.FieldValue.increment(1)
  const chat = (
    await db
      .collection('chats')
      .doc(data.chatId)
      .get()
  ).data()
  if (data.senderType === 'board' && chat.origin === 'Facebook') {
    sendMessageToFacebook({
      board: chat.boardId,
      recipientId: chat.userId,
      message: data.message
    })
  }
  const res = await (
    await db.collection('messages').add({
      message: data.message,
      createdAt: new Date(),
      chatId: data.chatId,
      senderId: data.senderId,
      senderType: data.senderType
    })
  ).get()

  await db
    .collection('chats')
    .doc(data.chatId)
    .update({
      updatedAt: new Date(),
      preview: data.message,
      unreadMessages: increment
    })
  if (data.senderId === 'client') {
    sendNotification(data.boardId, data.message)
  }
  return { id: res.id, ...res.data() }
}
const addBotMessage = (messageData, ifData, currentSeconds) => {
  const from = ifData.from.split(':')
  const fromSeconds =
    parseInt(from[0]) * 3600 + parseInt(from[1]) * 60 + parseInt(from[0])
  const to = ifData.to.split(':')
  const toSeconds =
    parseInt(to[0]) * 3600 + parseInt(to[1]) * 60 + parseInt(to[0])
  if (fromSeconds > currentSeconds || currentSeconds > toSeconds) {
    let botMessage = messageData
    botMessage.senderType = 'bot'
    botMessage.message =
      'Por el momento no hay asesores disponibles, vuelva en nuestros horarios de atencion'
    insertMessage(botMessage)
    mixpanel.track('chat.customer.out-of-office-hours') // Track
  }
}
const fetchMessages = async chatId => {
  const querySnapshot = await db
    .collection('messages')
    .where('chatId', '==', chatId)
    .orderBy('createdAt')
    .get()
  const messages = []
  querySnapshot.forEach(e => messages.push({ id: e.id, ...e.data() }))
  return messages
}

module.exports = {
  addMessage,
  fetchMessages
}
