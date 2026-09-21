import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getMyGuideProfile,
  createBusinessGuide,
  updateBusinessGuide,
  deleteBusinessGuide
} from '../controllers/business.guide.controller.js';
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

router.use(authenticateToken, checkRole(['Business']), checkBusinessType(['Guide']));

router.get('/', getMyGuideProfile);

router.post(
  '/',
  [
    body('location').trim().notEmpty().withMessage('Location is required.'),
    body('description_short').trim().notEmpty().withMessage('Short description is required.'),
    body('price_per_hour').isDecimal({ decimal_digits: '0,2' }).withMessage('Price per hour is required.'),
    body('experience_years').isInt({ min: 0 }).withMessage('Experience years is required.'),
    body('languages').optional().isArray().withMessage('Languages must be an array.'),
    body('specialties').optional().isArray().withMessage('Specialties must be an array.')
  ],
  handleValidationErrors,
  createBusinessGuide
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Guide ID must be a positive integer.'),
    body('price_per_hour').optional().isDecimal({ decimal_digits: '0,2' }),
    body('experience_years').optional().isInt({ min: 0 }),
    body('languages').optional().isArray(),
    body('specialties').optional().isArray()
  ],
  handleValidationErrors,
  updateBusinessGuide
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Guide ID must be a positive integer.')],
  handleValidationErrors,
  deleteBusinessGuide
);

export default router;
