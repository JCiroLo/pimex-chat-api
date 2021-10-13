'use strict'

const { db } = require('../lib/db.js')
const { getIcon, getColor } = require('../lib/random')
const { addLead, getBoard } = require('../lib/pimex')

const addChat = async ({ location, boardId }) => {
  const randomIcon = getIcon()
  const randomColor = getColor()

  const leadData = {
    _state: 'lead',
    name: '',
    origin: 'Chat',
    phone: 'sin teléfono',
    project: '14557',
    referrer: 'Chat',
    _compare: false
  }

  // const lead = await addLead(leadData)
  const boardData = await getBoard(boardId)

  const info = {
    agentImg: boardData.logo,
    agentName: boardData.title,
    boardId: boardId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    icon: {
      color: randomColor.code,
      name: randomIcon.name,
      value: randomIcon.icon
    },
    alias: `${randomIcon.name} ${randomColor.name}`,
    name: '',
    preview: '',
    leadId: null,
    location,
    submitedForm: false,
    archived: false,
    unreadMessages: 0
  }
  const chatData = await db.collection('chats').add(info)
  const chatRef = (await chatData.get()).data()

  const chatConfig = await db
    .collection('chatsConfig')
    .where('boardId', '==', boardId)
    .get()

  chatConfig.empty && (await addChatConfig(boardId))

  return {
    ...chatRef,
    id: chatData.id
  }
}

const updateChat = async (chatId, data) => {
  const chatRef = await db.collection('chats').doc(chatId)
  await chatRef.update({ ...data })
}

const addChatConfig = async boardId => {
  const defaultSchema = {
    boardId: boardId.toString(),
    enabledState: false,
    margin: {
      bottom: '20',
      right: '20'
    },
    color: '#134251',
    officeHours: [],
    createdAt: new Date()
  }
  await db.collection('chatsConfig').add(defaultSchema)
}

const getChatConfig = async boardId => {
  const chatConfig = await db
    .collection('chatsConfig')
    .where('boardId', '==', boardId)
    .get()
  let config = {}
  chatConfig.forEach(doc => {
    config = doc.data()
  })
  return config
}

module.exports = {
  addChat,
  updateChat,
  addChatConfig,
  getChatConfig
}
