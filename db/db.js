const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'diarydb',
  password: '08059911447Vic$',
  port: '5432',
});

module.exports = pool;
