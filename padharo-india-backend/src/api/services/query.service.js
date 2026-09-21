import QueryModel from '../models/query.model.js';

export const createQuery = async (userId, subject, message) => QueryModel.createQuery(userId, subject, message);
export const getQueriesByUser = async (userId) => QueryModel.findQueriesByUserId(userId);
export const getQueryById = async (queryId) => QueryModel.findQueryById(queryId);
export const addQueryMessage = async (queryId, senderId, message) => QueryModel.addMessage(queryId, senderId, message);
