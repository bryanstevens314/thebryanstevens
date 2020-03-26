const router = require('express').Router()
module.exports = router
// api routes
router.use('/data-control', require('./data-control.js'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})