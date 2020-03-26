require('dotenv').config()
const Sequelize = require('sequelize');
const __connection_url = process.env.TESTING ? process.env.DEV_DATABASE_URL : process.env.PPRODUCTION_DATABASE_URL
const db = new Sequelize(
    __connection_url, {
    logging: false
  }
);
module.exports = db;