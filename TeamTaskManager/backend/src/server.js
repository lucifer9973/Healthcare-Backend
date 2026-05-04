const { loadEnv } = require('./config/env');
const { getPool } = require('./db/pool');
const { createRepositories } = require('./repositories');
const { createServices } = require('./services');
const { createApp } = require('./app');

async function start() {
  const env = loadEnv();
  const pool = getPool();
  await pool.query('SELECT 1');

  const repositories = createRepositories(pool);
  const services = createServices({ repos: repositories });
  const app = createApp({ services });

  app.listen(env.PORT, () => {
    console.log(`Team Task Manager backend running on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server');
  console.error(error);
  process.exit(1);
});
