import User from '../../models/user.model.js';

const BUSINESS_ROLE = 'Business';
const VALID_BUSINESS_TYPES = ['Hotel', 'Guide', 'Cab'];

export const findAllProviders = async (filters = {}) => {
  const providerFilters = { ...filters, role: BUSINESS_ROLE };
  return await User.findAllUsersWithStatus(providerFilters);
};

export const findProviderById = async (providerId) => {
  const provider = await User.findById(providerId);
  if (!provider || provider.role !== BUSINESS_ROLE) {
    return null;
  }
  return provider;
};

export const updateProviderStatus = async (providerId, statusData) => {
  if (statusData.businessType && !VALID_BUSINESS_TYPES.includes(statusData.businessType)) {
    throw new Error('Invalid businessType value.');
  }

  if (statusData.role && statusData.role !== BUSINESS_ROLE) {
    statusData.role = BUSINESS_ROLE;
  }

  return await User.updateUserStatus(providerId, statusData);
};
