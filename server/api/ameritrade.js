const TDAmeritrade = require('../libs/TDAmeritrade')
const router = require('express').Router()
module.exports = router

router.get('/:action', (req, res) => {
    switch(req.params.action){
        case 'chart':
            return TDAmeritrade.getChart(req, res)
        case 'movers':
            return TDAmeritrade.getMovers(req, res)
        case 'orders':
            return TDAmeritrade.getOrders(req, res)
        case 'transactions':
            return TDAmeritrade.getTransactions(req, res)
        case 'accounts':
            return TDAmeritrade.getAccounts(req, res)
        case 'reauth':
            return TDAmeritrade.reAuthorize(req, res)
        case 'auth':
            return TDAmeritrade.storeToken(req, res)
        case 'redirect':
            return TDAmeritrade.createRedirect(req, res)
    }
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})