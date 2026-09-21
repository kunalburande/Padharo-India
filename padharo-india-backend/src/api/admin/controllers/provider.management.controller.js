import * as providerService from '../services/provider.management.service.js';

export const getAllProviders = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.businessType) filters.businessType = req.query.businessType;
    if (req.query.isVerified !== undefined) filters.isVerified = req.query.isVerified === 'true';

    const providers = await providerService.findAllProviders(filters);
    res.status(200).json(providers);
  } catch (error) {
    console.error('Error in getAllProviders admin controller:', error);
    next(error);
  }
};

export const getProviderById = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const provider = await providerService.findProviderById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found.' });
    }
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error in getProviderById admin controller:', error);
    next(error);
  }
};

export const updateProviderStatus = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { isVerified, businessType } = req.body;

    const statusData = {};
    if (isVerified !== undefined) statusData.isVerified = isVerified;
    if (businessType !== undefined) statusData.businessType = businessType;

    if (Object.keys(statusData).length === 0) {
      return res.status(400).json({ message: 'No valid status fields provided.' });
    }

    const success = await providerService.updateProviderStatus(providerId, statusData);
    if (!success) {
      return res.status(404).json({ message: 'Provider not found or update failed.' });
    }

    res.status(200).json({ message: 'Provider status updated successfully.' });
  } catch (error) {
    console.error('Error in updateProviderStatus admin controller:', error);
    next(error);
  }
};
