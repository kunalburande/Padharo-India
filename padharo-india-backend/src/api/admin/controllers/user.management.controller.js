import * as userService from '../services/user.management.service.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.isVerified !== undefined) filters.isVerified = req.query.isVerified === 'true';

    const users = await userService.findAllUsers(filters);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers admin controller:', error);
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isVerified, role, businessType } = req.body;

    const statusData = {};
    if (isVerified !== undefined) statusData.isVerified = isVerified;
    if (role) statusData.role = role;
    if (businessType !== undefined) statusData.businessType = businessType;

    if (Object.keys(statusData).length === 0) {
      return res.status(400).json({ message: 'No valid status fields provided.' });
    }

    const success = await userService.updateUserStatus(userId, statusData);
    if (!success) {
      return res.status(404).json({ message: 'User not found or update failed.' });
    }

    res.status(200).json({ message: 'User status updated successfully.' });
  } catch (error) {
    console.error('Error in updateUserStatus admin controller:', error);
    next(error);
  }
};
