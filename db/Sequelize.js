const Sequelize = require('sequelize');
require('dotenv').config();

const { password, user, database } = process.env;

const db = new Sequelize(database, user, password, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// connecting db
function connectDB() {
  db.authenticate().then(() => console.log('database connected...'));
}

module.exports = { db, connectDB };
