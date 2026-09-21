import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getMyCabs,
  createBusinessCab,
  updateBusinessCab,
  deleteBusinessCab
} from '../controllers/business.cab.controller.js';
import { authenticateToken, checkRole, checkBusinessType } from '../middleware/auth.middleware.js';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: errors.array().map(err => ({ field: err.param || err.path || 'body', message: err.msg }))
    });
  }
  next();
};

router.use(authenticateToken, checkRole(['Business']), checkBusinessType(['Cab']));

router.get('/', getMyCabs);

router.post(
  '/',
  [
    body('model').trim().notEmpty().withMessage('Model is required.'),
    body('plate_number').trim().notEmpty().withMessage('Plate number is required.'),
    body('type').trim().notEmpty().withMessage('Type is required.'),
    body('seats').isInt({ min: 1 }).withMessage('Seats is required and must be a number.'),
    body('transmission').trim().notEmpty().withMessage('Transmission is required.'),
    body('fuel_type').trim().notEmpty().withMessage('Fuel type is required.'),
    body('base_rate_km').isDecimal({ decimal_digits: '0,2' }).withMessage('Base rate per km is required.'),
    body('base_rate_hour').isDecimal({ decimal_digits: '0,2' }).withMessage('Base rate per hour is required.')
  ],
  handleValidationErrors,
  createBusinessCab
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Cab ID must be a positive integer.'),
    body('seats').optional().isInt({ min: 1 }).withMessage('Seats must be a number.'),
    body('base_rate_km').optional().isDecimal({ decimal_digits: '0,2' }),
    body('base_rate_hour').optional().isDecimal({ decimal_digits: '0,2' })
  ],
  handleValidationErrors,
  updateBusinessCab
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Cab ID must be a positive integer.')],
  handleValidationErrors,
  deleteBusinessCab
);

export default router;
