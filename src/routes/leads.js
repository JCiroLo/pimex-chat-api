const { Router } = require('express')
const { addLead } = require('../lib/pimex')
const router = Router()

router.post('/', async ({ body }, res) => {
  try {
    const newLead = await addLead(body)
    res.status(201).json(newLead)
  } catch (e) {
    res.status(400).json({ message: 'Error, bad request' })
  }
})

module.exports = router
