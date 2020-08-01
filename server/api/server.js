const Log = require('../Log.js')
const router = require('express').Router()
module.exports = router

router.get('/events', async (req, res, next) => {
  try {
    res.json({
        events: await Log.get(req.connection.remoteAddress)
    })
  } catch (err) {
    next(err)
  }
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})