const router = require('express').Router()
module.exports = router

router.get('/projects', (req, res, next) => {
  try {
      res.json({
        type: 'projects',
        payload: [
          {
            name: 'Card title 1',
            image: '',
            href: 'https://github.com/bryanstevens314',
            description:'Some quick example text to build on the card title and make up the bulk of the cards content.'
          },
          {
            name: 'Card title 2',
            image: '',
            href: 'https://github.com/bryanstevens314',
            description:'Some quick example text to build on the card title and make up the bulk of the cards content.'
          },
          {
            name: 'Card title 3',
            image: '',
            href: 'https://github.com/bryanstevens314',
            description:'Some quick example text to build on the card title and make up the bulk of the cards content.'
          },
          {
            name: 'Card title 4',
            image: '',
            href: 'https://github.com/bryanstevens314',
            description:'Some quick example text to build on the card title and make up the bulk of the cards content.'
          },
          {
            name: 'Card title 5',
            image: '',
            href: 'https://github.com/bryanstevens314',
            description:'Some quick example text to build on the card title and make up the bulk of the cards content.'
          },
          {
            name: 'Card title 6',
            image: '',
            href: 'https://github.com/bryanstevens314',
            description:'Some quick example text to build on the card title and make up the bulk of the cards content.'
          },
        ]
      })
  } catch (err) {
    next(err)
  }
})