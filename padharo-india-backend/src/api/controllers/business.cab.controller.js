import pool from '../../config/db.js';
import Cab from '../models/cab.model.js';

export const getMyCabs = async (req, res, next) => {
  try {
    const driverUserId = req.user.id;
    const sql = `
      SELECT c.*, u.firstName AS driverFirstName, u.lastName AS driverLastName
      FROM cabs c
      JOIN users u ON u.id = c.driver_user_id
      WHERE c.driver_user_id = ?
    `;
    const [rows] = await pool.execute(sql, [driverUserId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error in getMyCabs:', error);
    next(error);
  }
};

export const createBusinessCab = async (req, res, next) => {
  try {
    const driverUserId = req.user.id;
    const cabData = { ...req.body, driver_user_id: driverUserId };
    const cabId = await Cab.create(cabData);
    res.status(201).json({ message: 'Cab created successfully', cabId });
  } catch (error) {
    console.error('Error in createBusinessCab:', error);
    next(error);
  }
};

export const updateBusinessCab = async (req, res, next) => {
  try {
    const cabId = parseInt(req.params.id, 10);
    if (isNaN(cabId)) {
      return res.status(400).json({ message: 'Invalid Cab ID.' });
    }
    const businessUserId = req.user.id;
    const updateData = { ...req.body };
    delete updateData.driver_user_id;
    try {
      const success = await Cab.update(cabId, updateData, businessUserId);
      if (!success) {
        const ownerId = await Cab.findOwnerId(cabId);
        if (ownerId === null) {
          return res.status(404).json({ message: 'Cab not found.' });
        }
        return res.status(403).json({ message: 'Forbidden: You do not own this cab.' });
      }
      const updatedCab = await Cab.findById(cabId);
      res.status(200).json({ message: 'Cab updated successfully', cab: updatedCab });
    } catch (error) {
      if (error.message?.includes('Forbidden')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error in updateBusinessCab:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error in updateBusinessCab:', error);
    next(error);
  }
};

export const deleteBusinessCab = async (req, res, next) => {
  try {
    const cabId = parseInt(req.params.id, 10);
    if (isNaN(cabId)) {
      return res.status(400).json({ message: 'Invalid Cab ID.' });
    }
    const businessUserId = req.user.id;
    try {
      const success = await Cab.deleteById(cabId, businessUserId);
      if (!success) {
        const ownerId = await Cab.findOwnerId(cabId);
        if (ownerId === null) {
          return res.status(404).json({ message: 'Cab not found.' });
        }
        return res.status(403).json({ message: 'Forbidden: You do not own this cab.' });
      }
      res.status(200).json({ message: 'Cab deleted successfully.' });
    } catch (error) {
      if (error.message?.includes('Forbidden')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error in deleteBusinessCab:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error in deleteBusinessCab:', error);
    next(error);
  }
};
