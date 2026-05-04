const jwt = require('jsonwebtoken');
const { loadEnv } = require('../config/env');

function signToken(payload) {
  const env = loadEnv();
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { signToken };
