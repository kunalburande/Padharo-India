import Package from '../models/package.model.js';

export const getAllPackages = async (filters) => Package.findAll(filters);
export const getPackageByName = async (name) => Package.findByName(name);
export const createPackage = async (packageData) => Package.create(packageData);
export const updatePackage = async (packageId, updateData) => Package.update(packageId, updateData);
export const deletePackage = async (packageId) => Package.deleteById(packageId);
