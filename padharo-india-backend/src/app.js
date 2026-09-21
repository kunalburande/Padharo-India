import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import errorHandler from './api/middleware/errorHandler.js';
import apiRoutes from './api/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.resolve(__dirname, './uploads');
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.json({ message: 'Padharo India Backend API is running!' });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
