'use strict'

const {Router} = require('express')
const {addMessage} = require('../models/messages')
const router = Router()

router.post('/', async ({body}, res) => {
    try {
        const message = await addMessage(body)
        if (message) {
            res.status(201).json({
                message: 'successfully sent'
            })
        } else {
            res.status(404).json({
                message: 'Error, not available'
            })
        }
    } catch (e) {
        res.status(400).json({
            message: 'Bad request'
        })
    }
})

module.exports = router
