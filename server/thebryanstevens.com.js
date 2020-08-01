require('dotenv').config()
const isDev = process.env.NODE_ENV === 'development'
const path = require('path');
const open = require('open');
const https = require('https');
const fs = require('fs');
const TDAmeritrade = require('./libs/TDAmeritrade');
const app = require('express').Router()
// var options = {
//   key: fs.readFileSync(__dirname + '/ssl/192.168.0.9:8080.key', 'utf8'),
//   cert: fs.readFileSync(__dirname + '/ssl/192.168.0.9:8080.cert', 'utf8')
// };

module.exports = app;

// 'API' routes
app.use('/api', require('./api'));

// sends stocks.html
app.use('/ameritrade', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/stocks.html'))
})

// sends yt.html
app.use('/yt', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/stocks.html'))
})

// sends index.html
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})