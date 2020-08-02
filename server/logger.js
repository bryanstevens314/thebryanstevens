const log4js = require('log4js');
const path = require('path');

log4js.configure({
    appenders: { everything: { type: 'file', filename: path.join(__dirname, '..', '/logs/log.log') } },
    categories: { default: { appenders: ['everything'], level: 'ALL' } }
});

const logger = log4js.getLogger();

module.exports = logger