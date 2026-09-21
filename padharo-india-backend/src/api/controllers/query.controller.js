import QueryModel from '../models/query.model.js';

export const createQuery = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required.' });
    }
    const queryId = await QueryModel.createQuery(userId, subject, message);
    res.status(201).json({ message: 'Query created successfully', queryId });
  } catch (error) {
    console.error('Error in createQuery:', error);
    next(error);
  }
};

export const getUserQueries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const queries = await QueryModel.findQueriesByUserId(userId);
    res.status(200).json(queries);
  } catch (error) {
    console.error('Error in getUserQueries:', error);
    next(error);
  }
};

export const getQueryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const queryId = parseInt(req.params.id || req.params.queryId, 10);
    if (isNaN(queryId)) {
      return res.status(400).json({ message: 'Invalid query ID.' });
    }
    const query = await QueryModel.findQueryById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found.' });
    }
    if (query.user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this query.' });
    }
    const messages = await QueryModel.findMessagesByQueryId(queryId);
    res.status(200).json({ query, messages });
  } catch (error) {
    console.error('Error in getQueryById:', error);
    next(error);
  }
};

export const addQueryMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const queryId = parseInt(req.params.queryId, 10);
    const { message } = req.body;
    if (isNaN(queryId) || !message) {
      return res.status(400).json({ message: 'Valid query ID and message are required.' });
    }
    const query = await QueryModel.findQueryById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found.' });
    }
    if (query.user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this query.' });
    }
    if (query.status === 'Closed') {
      return res.status(400).json({ message: 'Cannot add a message to a closed query.' });
    }
    const messageId = await QueryModel.addMessage(queryId, userId, message);
    res.status(201).json({ message: 'Message added successfully', messageId });
  } catch (error) {
    console.error('Error in addQueryMessage:', error);
    next(error);
  }
};
