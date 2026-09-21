import { validationResult } from 'express-validator';

export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: errors.array().map(err => ({ field: err.param || err.path || 'body', message: err.msg }))
    });
  }
  next();
};

export const requireBodyFields = (fields = []) => (req, res, next) => {
  for (const field of fields) {
    if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
      return res.status(400).json({ message: `${field} is required.` });
    }
  }
  next();
};
