require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USER,
  host: process.env.host,
  database: process.env.DATABASE,
  password: process.env.password,
  port: process.env.DB_PORT,
});

module.exports = pool;
