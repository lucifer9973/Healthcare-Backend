const { Pool, types } = require('pg');
const { loadEnv } = require('../config/env');

types.setTypeParser(20, (value) => Number.parseInt(value, 10));

let pool;

function getPool() {
  if (!pool) {
    const env = loadEnv();
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  return pool;
}

module.exports = { getPool };
