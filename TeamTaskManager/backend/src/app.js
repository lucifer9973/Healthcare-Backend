const express = require('express');
const cors = require('cors');
const { loadEnv } = require('./config/env');
const { createApiRouter } = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

function createApp({ services }) {
  const env = loadEnv();
  const app = express();

  app.set('trust proxy', 1);
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.get('/health', (req, res) => res.status(200).json({ data: { status: 'ok' } }));
  app.use(createApiRouter(services));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
