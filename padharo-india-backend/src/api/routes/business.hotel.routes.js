import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getMyHotelProfile,
  createBusinessHotel,
  updateBusinessHotel,
  deleteBusinessHotel
} from '../controllers/business.hotel.controller.js';
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

router.use(authenticateToken, checkRole(['Business']), checkBusinessType(['Hotel']));

router.get('/', getMyHotelProfile);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Hotel name is required.'),
    body('location').trim().notEmpty().withMessage('Location is required.'),
    body('description').optional().isString(),
    body('star_rating').optional().isInt({ min: 0, max: 5 }),
    body('amenities').optional().isArray(),
    body('galleryUrls').optional().isArray()
  ],
  handleValidationErrors,
  createBusinessHotel
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
    body('star_rating').optional().isInt({ min: 0, max: 5 }),
    body('amenities').optional().isArray(),
    body('galleryUrls').optional().isArray()
  ],
  handleValidationErrors,
  updateBusinessHotel
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.')],
  handleValidationErrors,
  deleteBusinessHotel
);

export default router;
