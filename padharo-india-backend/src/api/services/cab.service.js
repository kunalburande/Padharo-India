import Cab from '../models/cab.model.js';

export const getAllCabs = async (filters) => Cab.findAll(filters);
export const getCabDetails = async (id) => Cab.findById(id);
export const createCab = async (cabData) => Cab.create(cabData);
export const updateCab = async (cabId, updateData, driverUserId) => Cab.update(cabId, updateData, driverUserId);
export const deleteCab = async (cabId, driverUserId) => Cab.deleteById(cabId, driverUserId);
