'use strict'

const {Router} = require('express')
const {addChat, getChatConfig, updateChat} = require('../models/chats')
const router = Router()

router.post('/', async ({body}, res) => {
    try {
        const newChat = await addChat(body)
        res.status(201).json(newChat)
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Error, bad request'})
    }
})

router.put('/:id', async ({params, body}, res) => {
    try {
        await updateChat(params.id, body)
        res.status(201).json({message: 'Successfully sent'})
    } catch (e) {
        res.status(400).json({message: 'Error, bad request'})
    }
})

router.get('/:boardId/settings', async ({params}, res) => {
    try {
        const chatConfig = await getChatConfig(params.boardId)
        res.status(200).json(chatConfig)
    } catch (e) {
        res.status(400).json({message: 'Error, bad request'})
    }
})

module.exports = router
