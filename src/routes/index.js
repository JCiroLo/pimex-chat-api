'use strict'

const {Router} = require('express')
const {validate} = require('../lib/utils')
const router = Router()

router.get('/', (req, res) => {
    res.status(200).json({
        service: 'pimex-chat',
        status: 'ok'
    })
})

// .use(validate)


module.exports = router
