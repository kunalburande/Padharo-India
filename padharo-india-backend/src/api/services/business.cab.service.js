import pool from '../../config/db.js';
import Cab from '../models/cab.model.js';

export const getCabsByDriver = async (driverUserId) => {
  const sql = `
    SELECT c.*, u.firstName AS driverFirstName, u.lastName AS driverLastName
    FROM cabs c
    JOIN users u ON u.id = c.driver_user_id
    WHERE c.driver_user_id = ?
  `;
  const [rows] = await pool.execute(sql, [driverUserId]);
  return rows;
};

export const createBusinessCab = async (cabData) => Cab.create(cabData);
export const updateBusinessCab = async (cabId, updateData, driverUserId) => Cab.update(cabId, updateData, driverUserId);
export const deleteBusinessCab = async (cabId, driverUserId) => Cab.deleteById(cabId, driverUserId);
