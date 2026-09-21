import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  createQuery,
  getUserQueries,
  getQueryById,
  addQueryMessage
} from '../controllers/query.controller.js';

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

router.use(authenticateToken);

router.post(
  '/queries',
  [
    body('subject').trim().notEmpty().withMessage('Subject is required.'),
    body('message').trim().notEmpty().withMessage('Message is required.')
  ],
  handleValidationErrors,
  createQuery
);

router.get('/queries', getUserQueries);

router.get(
  '/queries/:queryId',
  [param('queryId').isInt({ min: 1 }).withMessage('Query ID must be a positive integer.')],
  handleValidationErrors,
  getQueryById
);

router.post(
  '/queries/:queryId/messages',
  [
    param('queryId').isInt({ min: 1 }).withMessage('Query ID must be a positive integer.'),
    body('message').trim().notEmpty().withMessage('Message is required.')
  ],
  handleValidationErrors,
  addQueryMessage
);

export default router;
