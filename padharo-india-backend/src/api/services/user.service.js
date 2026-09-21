import User from '../models/user.model.js';

export const getUserProfile = async (userId) => User.findById(userId);
export const updateUserProfile = async (userId, updateData) => User.updateUser(userId, updateData);
export const getAllUsers = async (filters) => User.findAllUsersWithStatus(filters);
export const updateUserStatus = async (userId, statusData) => User.updateUserStatus(userId, statusData);
