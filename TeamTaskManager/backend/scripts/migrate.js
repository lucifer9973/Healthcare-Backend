const fs = require('fs');
const path = require('path');
const { getPool } = require('../src/db/pool');

async function migrate() {
  const pool = getPool();
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  await pool.query(schema);
  await pool.end();
  console.log('Database schema applied');
}

migrate().catch((error) => {
  console.error('Migration failed');
  console.error(error);
  process.exit(1);
});
