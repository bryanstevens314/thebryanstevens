require('dotenv').config()
const isDev = process.env.NODE_ENV === 'development'
const path = require('path');
const open = require('open');
const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Feeling chatty on port ${PORT}`)
  // open('http://localhost:8080')
});

module.exports = app;
// static middleware
app.use(express.static(path.join(__dirname, '..', 'node_modules')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 'API' routes
app.use('/api', require('./api'));

// 404 middleware
app.use((req, res, next) =>
  path.extname(req.path).length > 0 ?
    res.status(404).send('Not found') :
    next()
);

// send index.html
app.use('*', (req, res, next) =>{
  const htmlPath = isDev ? 'public' : 'dist'
  res.sendFile(path.join(__dirname, '..', `${htmlPath}/index.html`))
});

// error handling endware
app.use((err, req, res, next) =>
  res.status(err.status || 500).send(err.message || 'Internal server error.')
);
