import express from 'express';
import providerRoutes from './provider.management.routes.js';
import queryRoutes from './query.management.routes.js';
import userRoutes from './user.management.routes.js';
import { authenticateToken, checkRole } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken, checkRole(['Admin']));
router.use('/providers', providerRoutes);
router.use('/support', queryRoutes);
router.use('/users', userRoutes);

export default router;
