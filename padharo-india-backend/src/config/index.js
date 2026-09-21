import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`WARNING: Missing environment variable ${key}.`);
  }
}

const config = {
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'padharo_india_db',
  port: process.env.PORT || 5000,
};

export default config;
