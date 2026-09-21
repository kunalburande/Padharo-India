import SupportModel from './support.model.js';

class QueryModel {
  static async createQuery(userId, subject, message) {
    return SupportModel.createQuery(userId, subject, message);
  }

  static async findQueriesByUserId(userId) {
    return SupportModel.findQueriesByUserId(userId);
  }

  static async findQueryById(queryId) {
    return SupportModel.findQueryById(queryId);
  }

  static async addMessage(queryId, senderId, message) {
    return SupportModel.addMessage(queryId, senderId, message);
  }

  static async findMessagesByQueryId(queryId) {
    return SupportModel.findMessagesByQueryId(queryId);
  }

  static async findAllQueries(status) {
    return SupportModel.findAllQueries(status);
  }

  static async updateQueryStatus(queryId, status) {
    return SupportModel.updateQueryStatus(queryId, status);
  }
}

export default QueryModel;
