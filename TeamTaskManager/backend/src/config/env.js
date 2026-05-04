const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ADMIN_SEED_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_SEED_PASSWORD: z.string().min(8).default('Admin123!'),
  MEMBER_SEED_EMAIL: z.string().email().default('member@example.com'),
  MEMBER_SEED_PASSWORD: z.string().min(8).default('Member123!')
});

function loadEnv() {
  return envSchema.parse(process.env);
}

module.exports = { loadEnv };
