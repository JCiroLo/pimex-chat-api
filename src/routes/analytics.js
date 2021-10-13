'use strict'

const {Router} = require('express')
const {addView} = require('../models/analytics')
const router = Router()

router.post('/', async (req, res) => {
    const data = req.body
    try {
        await addView(data.boardId, data.type)
        res.status(200).json({
            message: 'Successfully sent'
        })
    } catch (e) {
        res.status(400).json({
            message: 'Error, bad request'
        })
    }
})

module.exports = router
