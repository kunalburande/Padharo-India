import SupportModel from '../../models/support.model.js';

export const findAllQueries = async (status) => {
  return await SupportModel.findAllQueries(status);
};

export const findQueryById = async (queryId) => {
  return await SupportModel.findQueryById(queryId);
};

export const findMessagesByQueryId = async (queryId) => {
  return await SupportModel.findMessagesByQueryId(queryId);
};

export const addAdminMessage = async (queryId, adminUserId, message) => {
  return await SupportModel.addMessage(queryId, adminUserId, message);
};

export const updateQueryStatus = async (queryId, status) => {
  return await SupportModel.updateQueryStatus(queryId, status);
};
