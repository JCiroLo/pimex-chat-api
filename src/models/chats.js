'use strict'

const {db} = require('../lib/db.js')
const {getIcon, getColor} = require('../lib/random')
const {addLead, getBoard} = require('../lib/pimex')

const addChat = async (data) => {
    const boardId = data.boardId
    const randomIcon = getIcon()
    const randomColor = getColor()
    const location = data.location
    const boardData = await getBoard(boardId)
    const info = {
        boardId: boardId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        alias: `${randomIcon.name} ${randomColor.name}`,
        name: data.name || '',
        preview: '',
        leadId: null,
        location,
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

const updateChat = async (chatId, data) => {
    const chatRef = await db.collection('chats').doc(chatId)
    try {
        await chatRef.update({...data})
        return 'Success'
    } catch (e) {
        return Promise.reject(e)
    }
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

module.exports = {
    addChat,
    updateChat,
    addChatConfig,
    getChatConfig
}
