const logger = require('./logger')
try{
  const isDev = process.env.NODE_ENV === 'development'
  const path = require('path');
  if(isDev){
    require('dotenv').config({ path: path.join(__dirname, '..', '/.env') })
  }
  const subdomain = require('express-subdomain');
  const morgan = require('morgan')
  const compression = require('compression')
  const helmet = require('helmet')
  var vhost = require('vhost');
  const open = require('open');
  const https = require('https');
  const fs = require('fs');
  const TDAmeritrade = require('./libs/TDAmeritrade');
  const express = require('express');
  const PORT = process.env.PORT || 80;
  const app = express();
  // var options = {
  //   key: fs.readFileSync(__dirname + '/ssl/192.168.0.9:8080.key', 'utf8'),
  //   cert: fs.readFileSync(__dirname + '/ssl/192.168.0.9:8080.cert', 'utf8')
  // };

  module.exports = app;

  app.use(morgan('dev'))
  app.use(helmet())

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression())

  if (fs.existsSync(path.join(__dirname, '../..', '/Hacking_Playlists'))) {
    console.log('Hacking_Playlists exists!')
    // app.use('/', require('../../Hacking_Playlists/server/hacked-playlists.thebryanstevens.com.js'))
    app.use(subdomain('hacked-playlists', require('../../Hacking_Playlists/server/hacked-playlists.thebryanstevens.com.js')))
  }

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', '/public')))

  app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname + '../logs/logs.log'));
  });

  app.use('/', require('./thebryanstevens.com.js'));

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
  // https.createServer(optio÷ns, app);
  const server = app.listen(PORT, () => {
    console.log(`Feeling chatty on port ${PORT}`)
    // open('http://localhost:8080')
  });
} catch(error){
  logger.debug(error)
}