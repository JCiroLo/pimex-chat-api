'use strict'

const { db, firestore } = require('../lib/db.js')
const { getIcon, getColor } = require('../lib/random')
const { addLead, getBoard } = require('../lib/pimex')

const addChat = async data => {
  console.log(data)
  const boardId = data.boardId
  const randomIcon = getIcon()
  const randomColor = getColor()
  const boardData = await getBoard(boardId)
  const info = {
    boardId: boardId.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    alias: `${randomIcon.name} ${randomColor.name}`,
    name: data.name || '',
    preview: '',
    leadId: null,
    location: data.location,
    submitedForm: false,
    archived: false,
    unreadMessages: 0,
    origin: data.origin,
    agentInfo: {
      logo: boardData.logo,
      name: boardData.title
    },
    customerInfo: {
      id: data.userId || null,
      profileImg: data.userImg || null
    },
    icon: {
      color: randomColor.code,
      name: randomIcon.name,
      value: randomIcon.icon
    }
  }
  const chat = await db
    .collection('chats')
    .where('userId', '==', data.userId)
    .get()
  let chatRef
  let chatId
  if (chat.empty) {
    const chatData = await db.collection('chats').add(info)
    chatRef = (await chatData.get()).data()
    chatId = chatData.id
  } else {
    chatRef = chat.docs[0].data()
    chatId = chat.docs[0].id
  }

  const chatConfig = await db
    .collection('chatsConfig')
    .where('boardId', '==', boardId)
    .get()

  chatConfig.empty && (await addChatConfig(boardId))

  return {
    ...chatRef,
    id: chatId
  }
}

const updateChat = async data => {
  const chatId = data.id
  const chatRef = await db.collection('chats').doc(chatId)
  delete data.id
  await chatRef.update({ ...data })
  return { ...data, id: chatId }
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
  try {
    const chatConfig = await db
      .collection('chatsConfig')
      .where('boardId', '==', boardId)
      .get()
    let config = {}
    chatConfig.forEach(doc => {
      config = doc.data()
    })
    return config
  } catch (e) {
    return Promise.reject(e)
  }
}

const fetchChats = async boardId => {
  const querySnapshot = await db
    .collection('chats')
    .where('boardId', '==', boardId)
    .orderBy('updatedAt', 'desc')
    .get()
  const chats = []
  querySnapshot.forEach(e => chats.push({ id: e.id, ...e.data() }))
  return chats
}

const increaseUnreadMessages = async chatId => {
  await db
    .collection('chats')
    .doc(chatId)
    .update({
      unreadMessages: firestore.FieldValue.increment(1)
    })
}

module.exports = {
  addChat,
  updateChat,
  addChatConfig,
  getChatConfig,
  fetchChats,
  increaseUnreadMessages
}
