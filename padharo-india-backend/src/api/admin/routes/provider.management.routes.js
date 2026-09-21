import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  getAllProviders,
  getProviderById,
  updateProviderStatus
} from '../controllers/provider.management.controller.js';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: errors.array().map(err => ({ field: err.param || err.path, message: err.msg }))
    });
  }
  next();
};

router.get(
  '/',
  [
    query('businessType').optional().isIn(['Hotel', 'Guide', 'Cab']),
    query('isVerified').optional().isBoolean()
  ],
  handleValidationErrors,
  getAllProviders
);

router.get(
  '/:providerId',
  [
    param('providerId').isInt({ min: 1 })
  ],
  handleValidationErrors,
  getProviderById
);

router.patch(
  '/:providerId/status',
  [
    param('providerId').isInt({ min: 1 }),
    body('isVerified').optional().isBoolean(),
    body('businessType').optional().isIn(['Hotel', 'Guide', 'Cab'])
  ],
  handleValidationErrors,
  updateProviderStatus
);

export default router;
