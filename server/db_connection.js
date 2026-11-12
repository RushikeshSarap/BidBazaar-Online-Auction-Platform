const { Pool } = require('pg');
const { database } = require('./config');

const pool = new Pool(database);

pool.on('error', (error) => {
  console.error('Unexpected idle PostgreSQL client error', {
    code: error.code || 'unknown'
  });
});

module.exports = pool;
