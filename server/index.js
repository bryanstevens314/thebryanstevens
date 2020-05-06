require('dotenv').config()
const isDev = process.env.NODE_ENV === 'development'
const path = require('path');
const open = require('open');
const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();


module.exports = app;

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 'API' routes
app.use('/api', require('./api'));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })
// 404 middleware
app.use((req, res, next) =>
  path.extname(req.path).length > 0 ?
    res.status(404).send('Not found') :
    next()
);

// error handling endware
app.use((err, req, res, next) =>
  res.status(err.status || 500).send(err.message || 'Internal server error.')
);
const server = app.listen(PORT, () => {
  console.log(`Feeling chatty on port ${PORT}`)
  // open('http://localhost:8080')
});