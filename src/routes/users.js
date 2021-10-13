'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const router = Router()

router.get('/', async (req, res) => {
    const userId = uuidv4()
    res.status(201).json(userId)
})

module.exports = router
