import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const createToken = (payload) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required to sign tokens.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required to verify tokens.');
  }
  return jwt.verify(token, JWT_SECRET);
};
