import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
  getAllQueries,
  getQueryById,
  addAdminMessage,
  updateQueryStatus
} from '../controllers/query.management.controller.js';

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
  '/queries',
  [
    query('status').optional().isIn(['Open', 'Closed', 'In Progress'])
  ],
  handleValidationErrors,
  getAllQueries
);

router.get(
  '/queries/:queryId',
  [
    param('queryId').isInt({ min: 1 })
  ],
  handleValidationErrors,
  getQueryById
);

router.post(
  '/queries/:queryId/messages',
  [
    param('queryId').isInt({ min: 1 }),
    body('message').trim().notEmpty().withMessage('Message is required.')
  ],
  handleValidationErrors,
  addAdminMessage
);

router.patch(
  '/queries/:queryId/status',
  [
    param('queryId').isInt({ min: 1 }),
    body('status').isIn(['Open', 'Closed', 'In Progress']).withMessage('Invalid status.')
  ],
  handleValidationErrors,
  updateQueryStatus
);

export default router;
