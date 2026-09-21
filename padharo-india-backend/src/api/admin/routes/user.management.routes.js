import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { getAllUsers, updateUserStatus } from '../controllers/user.management.controller.js';

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
    query('role').optional().isIn(['User', 'Business', 'Admin']),
    query('isVerified').optional().isBoolean()
  ],
  handleValidationErrors,
  getAllUsers
);

router.patch(
  '/:userId/status',
  [
    param('userId').isInt({ min: 1 }),
    body('isVerified').optional().isBoolean(),
    body('role').optional().isIn(['User', 'Business', 'Admin']),
    body('businessType').optional({ nullable: true }).isIn(['Hotel', 'Guide', 'Cab', ''])
  ],
  handleValidationErrors,
  updateUserStatus
);

export default router;
