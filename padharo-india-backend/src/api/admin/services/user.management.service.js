import User from '../../models/user.model.js';

export const findAllUsers = async (filters = {}) => {
  return await User.findAllUsersWithStatus(filters);
};

export const updateUserStatus = async (userId, statusData) => {
  return await User.updateUserStatus(userId, statusData);
};
