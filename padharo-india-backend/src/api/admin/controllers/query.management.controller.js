import * as queryService from '../services/query.management.service.js';

export const getAllQueries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const queries = await queryService.findAllQueries(status);
    res.status(200).json(queries);
  } catch (error) {
    console.error('Error in getAllQueries admin controller:', error);
    next(error);
  }
};

export const getQueryById = async (req, res, next) => {
  try {
    const { queryId } = req.params;
    const query = await queryService.findQueryById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found.' });
    }

    const messages = await queryService.findMessagesByQueryId(queryId);
    res.status(200).json({ query, messages });
  } catch (error) {
    console.error('Error in getQueryById admin controller:', error);
    next(error);
  }
};

export const addAdminMessage = async (req, res, next) => {
  try {
    const adminUserId = req.user.id;
    const { queryId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const query = await queryService.findQueryById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found.' });
    }

    const messageId = await queryService.addAdminMessage(queryId, adminUserId, message.trim());

    if (query.status === 'Closed') {
      await queryService.updateQueryStatus(queryId, 'In Progress');
    }

    res.status(201).json({ message: 'Admin reply added successfully.', messageId });
  } catch (error) {
    console.error('Error in addAdminMessage controller:', error);
    next(error);
  }
};

export const updateQueryStatus = async (req, res, next) => {
  try {
    const { queryId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const success = await queryService.updateQueryStatus(queryId, status);
    if (!success) {
      return res.status(404).json({ message: 'Query not found or update failed.' });
    }

    res.status(200).json({ message: `Query status updated to ${status}.` });
  } catch (error) {
    console.error('Error in updateQueryStatus admin controller:', error);
    next(error);
  }
};
