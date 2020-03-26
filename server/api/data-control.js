const router = require('express').Router()
module.exports = router

router.get('/projects', (req, res, next) => {
  try {
      console.log('HELLO');
      res.json([
          {},
          {},
          {},
          {},
          {},
          {},
      ])
  } catch (err) {
    next(err)
  }
})